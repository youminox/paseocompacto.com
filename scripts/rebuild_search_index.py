#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Actualiza public/search-index.json a partir de los 1,524 artículos redactados por LLM
en src/content/articles/*.json, preservando el orden canónico de src/data/keyword_map.json
y deduplicando cualquier posible colisión accidental en metaDescription o excerpt.
"""
from __future__ import annotations

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
KW_MAP_PATH = ROOT / "src/data/keyword_map.json"
CATS_PATH = ROOT / "src/data/categories.json"
SEARCH_INDEX_PATH = ROOT / "public/search-index.json"


def main():
    kw_map = json.loads(KW_MAP_PATH.read_text(encoding="utf-8"))
    cats = {c["slug"]: c["name"] for c in json.loads(CATS_PATH.read_text(encoding="utf-8"))}

    seen_meta: set[str] = set()
    seen_excerpt: set[str] = set()
    search_items = []
    dedup_fixes = 0

    for item in kw_map:
        slug = item["slug"]
        fp = ART_DIR / f"{slug}.json"
        if not fp.exists():
            raise FileNotFoundError(f"Missing article file: {fp}")
        art = json.loads(fp.read_text(encoding="utf-8"))
        changed = False

        # Ensure imageUrl is strictly unique 1-to-1
        expected_img = f"/img/articulos/{slug}.webp"
        if art.get("imageUrl") != expected_img:
            art["imageUrl"] = expected_img
            changed = True

        meta = (art.get("metaDescription") or "").strip()
        if not meta or meta in seen_meta:
            suffix = f" ({art['primaryKeyword'][:42]})"
            base = (meta or art["title"]).rstrip(".… ")
            meta = (base[: max(40, 158 - len(suffix))] + suffix).strip()
            art["metaDescription"] = meta
            changed = True
            dedup_fixes += 1
        seen_meta.add(meta)

        exc = (art.get("excerpt") or "").strip()
        if not exc or exc in seen_excerpt or exc == meta:
            suffix = f" — Guía sobre {art['primaryKeyword'][:50]}."
            base = (exc or art.get("quickAnswer") or art["title"]).rstrip(".… ")
            exc = (base[: max(50, 212 - len(suffix))] + suffix).strip()
            art["excerpt"] = exc
            changed = True
            dedup_fixes += 1
        seen_excerpt.add(exc)

        if changed:
            fp.write_text(json.dumps(art, ensure_ascii=False, indent=2), encoding="utf-8")

        search_items.append(
            {
                "t": art["title"],
                "p": art["path"],
                "n": cats.get(art["pillar"], art["pillar"]),
                "r": int(art.get("readingMinutes") or 7),
            }
        )

    SEARCH_INDEX_PATH.write_text(
        json.dumps(search_items, ensure_ascii=False), encoding="utf-8"
    )
    print(
        f"✅ Rebuilt public/search-index.json with {len(search_items)} entries (dedup adjustments: {dedup_fixes})"
    )


if __name__ == "__main__":
    main()
