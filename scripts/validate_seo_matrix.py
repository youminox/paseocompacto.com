#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auditoría matemática de Cero Canibalización sobre las 1,524 páginas de paseocompacto.com.
Verifica:
1. Exactamente 14 Hubs Pilares + 510 Artículos Transaccionales + 1,000 Artículos SEO = 1,524 JSONs.
2. 0 duplicados en slug, path, title, seoTitle y primaryKeyword.
3. Integridad de todos los enlaces internos en blocks.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"


def main():
    files = sorted(ART_DIR.glob("*.json"))
    assert len(files) == 1524, f"Se esperaban 1,524 archivos JSON, hay {len(files)}"

    slugs, paths, titles, seo_titles, kws = set(), set(), set(), set(), set()
    pillars = 0
    trans = 0
    seo_info = 0

    articles = []
    for f in files:
        a = json.loads(f.read_text(encoding="utf-8"))
        assert a["slug"] not in slugs, f"Slug duplicado: {a['slug']}"
        assert a["path"] not in paths, f"Path duplicado: {a['path']}"
        assert a["title"] not in titles, f"Title duplicado: {a['title']}"
        assert a["seoTitle"] not in seo_titles, f"seoTitle duplicado: {a['seoTitle']}"
        assert a["primaryKeyword"] not in kws, f"primaryKeyword duplicado: {a['primaryKeyword']}"

        slugs.add(a["slug"])
        paths.add(a["path"])
        titles.add(a["title"])
        seo_titles.add(a["seoTitle"])
        kws.add(a["primaryKeyword"])
        articles.append(a)

        if a.get("isPillar"):
            pillars += 1
        elif a.get("isTransactional"):
            trans += 1
        else:
            seo_info += 1

    assert pillars == 14, f"Se esperaban 14 pilares, hay {pillars}"
    assert trans == 510, f"Se esperaban 510 transaccionales, hay {trans}"
    assert seo_info == 1000, f"Se esperaban 1,000 SEO informacionales, hay {seo_info}"

    # Verificar que todos los enlaces internos existan en `paths`
    broken = []
    for a in articles:
        blob = json.dumps(a.get("blocks", []), ensure_ascii=False)
        for m in re.findall(r"\]\((/[^)\s]+)\)", blob):
            if m not in paths:
                broken.append((a["slug"], m))
    assert not broken, f"Enlaces internos rotos detectados: {broken[:10]}"

    print(
        f"✅ AUDITORÍA SEO SUPERADA AL 100%: {len(files)} páginas editoriales verificadas "
        f"({pillars} Hubs + {trans} Transaccionales + {seo_info} SEO Info) con 0 duplicados, 0 enlaces rotos y 0% canibalización."
    )


if __name__ == "__main__":
    main()
