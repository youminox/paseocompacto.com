#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auditoría integral de Calidad SEO, Imágenes Únicas (<100 KB) y Cumplimiento Amazon Associates
sobre las 1,524 páginas de paseocompacto.com.
"""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
ART_IMG_DIR = ROOT / "public/img/articulos"
AMB_IMG_DIR = ROOT / "public/img/ambiente"

PRICE_RE = re.compile(
    r"(?:US\$\s*\d+|\$\s*\d+|\bUSD\s*\d+|€\s*\d+)",
    re.IGNORECASE,
)

OLD_TEMPLATE_MARKERS = [
    "Revisar en detalle **",
    "Resolver correctamente **",
]


def main():
    files = sorted(ART_DIR.glob("*.json"))
    assert len(files) == 1524, f"Se esperaban 1,524 archivos JSON, hay {len(files)}"

    slugs, paths, titles, seo_titles, kws, metas, excerpts, img_urls = (
        set(),
        set(),
        set(),
        set(),
        set(),
        set(),
        set(),
        set(),
    )
    pillars = 0
    trans = 0
    seo_info = 0
    non_llm = []
    template_hits = []
    price_hits = []
    star_hits = []

    articles = []
    for f in files:
        raw_txt = f.read_text(encoding="utf-8")
        a = json.loads(raw_txt)

        if not a.get("llmAuthored"):
            non_llm.append(a["slug"])

        for marker in OLD_TEMPLATE_MARKERS:
            if marker in raw_txt:
                template_hits.append((a["slug"], marker))

        assert a["slug"] not in slugs, f"Slug duplicado: {a['slug']}"
        assert a["path"] not in paths, f"Path duplicado: {a['path']}"
        assert a["title"] not in titles, f"Title duplicado: {a['title']}"
        assert a["seoTitle"] not in seo_titles, f"seoTitle duplicado: {a['seoTitle']}"
        assert a["primaryKeyword"] not in kws, f"primaryKeyword duplicado: {a['primaryKeyword']}"
        assert a["metaDescription"] not in metas, f"metaDescription duplicada en: {a['slug']}"
        assert a["excerpt"] not in excerpts, f"excerpt duplicado en: {a['slug']}"

        expected_img = f"/img/articulos/{a['slug']}.webp"
        assert a.get("imageUrl") == expected_img, f"imageUrl inválido en {a['slug']}: {a.get('imageUrl')}"
        assert a["imageUrl"] not in img_urls, f"imageUrl repetido en {a['slug']}"

        img_file = ART_IMG_DIR / f"{a['slug']}.webp"
        assert img_file.exists(), f"Falta imagen en disco para {a['slug']}: {img_file}"
        sz = img_file.stat().st_size
        assert 1_000 < sz < 100_000, f"Imagen fuera de rango (<100 KB) en {a['slug']}: {sz} bytes"

        # Check editorial text fields (excluding preserved search-query title/slug/url) for stars or prices
        editorial_blob = json.dumps(
            {
                "metaDescription": a.get("metaDescription"),
                "excerpt": a.get("excerpt"),
                "quickAnswer": a.get("quickAnswer"),
                "blocks": a.get("blocks"),
                "faqs": a.get("faqs"),
            },
            ensure_ascii=False,
        )
        if any(st in editorial_blob for st in ("★", "☆", "⭐")):
            star_hits.append(a["slug"])
        m_price = PRICE_RE.search(editorial_blob)
        if m_price:
            price_hits.append((a["slug"], m_price.group(0)))

        slugs.add(a["slug"])
        paths.add(a["path"])
        titles.add(a["title"])
        seo_titles.add(a["seoTitle"])
        kws.add(a["primaryKeyword"])
        metas.add(a["metaDescription"])
        excerpts.add(a["excerpt"])
        img_urls.add(a["imageUrl"])
        articles.append(a)

        if a.get("isPillar"):
            pillars += 1
        elif a.get("isTransactional"):
            trans += 1
        else:
            seo_info += 1

    assert not non_llm, f"Artículos sin llmAuthored ({len(non_llm)}): {non_llm[:5]}"
    assert not template_hits, f"Marcadores de plantilla Python detectados: {template_hits[:5]}"
    assert not star_hits, f"Estrellas detectadas en artículos: {star_hits[:5]}"
    assert not price_hits, f"Precios detectados en cuerpo de artículos: {price_hits[:5]}"
    assert pillars == 14, f"Se esperaban 14 pilares, hay {pillars}"
    assert trans == 510, f"Se esperaban 510 transaccionales, hay {trans}"
    assert seo_info == 1000, f"Se esperaban 1,000 SEO informacionales, hay {seo_info}"

    # Check internal links
    broken = []
    for a in articles:
        blob = json.dumps(a.get("blocks", []), ensure_ascii=False)
        for m in re.findall(r"\]\((/[^)\s]+)\)", blob):
            if m not in paths:
                broken.append((a["slug"], m))
    assert not broken, f"Enlaces internos rotos detectados: {broken[:10]}"

    # Check ambient images < 100 KB too
    for amb in AMB_IMG_DIR.glob("*.webp"):
        assert amb.stat().st_size < 100_000, f"Imagen ambiente >= 100 KB: {amb.name} ({amb.stat().st_size} B)"

    # Check UI & Edge Function code for stars, rating, reviewsCount, or US$ prices
    code_targets = [
        ROOT / "src/lib/amazon.ts",
        ROOT / "src/components/AmazonAffiliateBox.tsx",
        ROOT / "src/components/PaseoCompactoChatWidget.tsx",
        ROOT / "src/app/page.tsx",
        ROOT / "supabase/functions/paseocompacto-chat/index.ts",
    ]
    for cf in code_targets:
        txt = cf.read_text(encoding="utf-8")
        assert "★" not in txt and "⭐" not in txt, f"Estrella detectada en {cf.name}"
        assert "reviewsCount" not in txt, f"reviewsCount detectado en {cf.name}"
        assert not PRICE_RE.search(txt), f"Precio estático detectado en {cf.name}: {PRICE_RE.search(txt).group(0)}"

    art_sizes = [p.stat().st_size for p in ART_IMG_DIR.glob("*.webp")]
    print(
        f"✅ AUDITORÍA INTEGRAL 100 % SUPERADA:\n"
        f"   - Artículos redactados por LLM: {len(files)} / 1,524 ({pillars} Pilares + {trans} Transaccionales + {seo_info} SEO Info)\n"
        f"   - Duplicados (slug/path/title/seoTitle/keyword/meta/excerpt/imageUrl): 0\n"
        f"   - Enlaces internos rotos: 0\n"
        f"   - Imágenes únicas en public/img/articulos/: {len(art_sizes)} / 1,524 (máx: {max(art_sizes)/1024:.1f} KB, prom: {sum(art_sizes)/len(art_sizes)/1024:.1f} KB, 0 >= 100 KB)\n"
        f"   - Estrellas, conteos de reseñas o precios estáticos en Amazon/UI/Chat/Artículos: 0"
    )


if __name__ == "__main__":
    main()
