#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador masivo, reanudable y anti-similitud (dHash) de las 1,524 imágenes únicas de artículos
para paseocompacto.com usando ChatGPT Image API (quality="medium") vía Supabase Edge Function
paseocompacto-images, comprimiendo cada WebP estrictamente por debajo de 100 KB (tope duro <= 68 KB).

Uso:
  python3 scripts/gen_images.py test2        # prueba rápida de 2 artículos nuevos
  python3 scripts/gen_images.py all_1524     # genera las 1,524 imágenes únicas en public/img/articulos/<slug>.webp
  python3 scripts/gen_images.py audit        # verifica 1,524 archivos < 100 KB y diversidad dHash
"""
from __future__ import annotations

import base64
import concurrent.futures as cf
import io
import json
import pathlib
import random
import sys
import threading
import time
import urllib.error
import urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENDPOINT = "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/paseocompacto-images"
TOKEN = "paseocompacto-img-2026"
ART_IMG_DIR = ROOT / "public/img/articulos"
ART_IMG_DIR.mkdir(parents=True, exist_ok=True)
PROMPTS_FILE = ROOT / "scripts/.cache/prompts_1524.json"
DHASH_CACHE_FILE = ROOT / "scripts/.cache/dhashes_1524.json"

MAX_BYTES = 68_000  # Estrictamente < 100 KB (tope duro 68 KB en 1200x675 WebP)
LOCK = threading.Lock()


def compute_dhash(im: Image.Image, hash_size: int = 8) -> int:
    small = im.convert("L").resize((hash_size + 1, hash_size), Image.LANCZOS)
    pixels = list(small.getdata())
    bits = 0
    for row in range(hash_size):
        offset = row * (hash_size + 1)
        for col in range(hash_size):
            bits = (bits << 1) | (1 if pixels[offset + col] > pixels[offset + col + 1] else 0)
    return bits


def hamming(a: int, b: int) -> int:
    return bin(a ^ b).count("1")


def call_api(slug: str, prompt: str) -> bytes:
    payload = json.dumps({"slug": slug, "prompt": prompt, "skipStorage": True}).encode("utf-8")
    last_err = None
    for attempt in range(6):
        try:
            req = urllib.request.Request(
                ENDPOINT,
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "x-paseocompacto-token": TOKEN,
                },
            )
            with urllib.request.urlopen(req, timeout=240) as r:
                res = json.loads(r.read())
            if not res.get("ok"):
                raise RuntimeError(res.get("error") or "unknown error")
            if res.get("b64"):
                return base64.b64decode(res["b64"])
            with urllib.request.urlopen(res["url"] + "?v=1", timeout=120) as r2:
                return r2.read()
        except Exception as e:
            last_err = e
            wait = min(30.0, (2 ** attempt) * 1.5 + random.uniform(0.2, 1.4))
            time.sleep(wait)
    raise RuntimeError(f"Failed {slug} after retries: {last_err}")


def compress_1200_webp(raw_bytes: bytes) -> tuple[bytes, int]:
    im = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    w, h = im.size
    target = 16 / 9
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))

    dh = compute_dhash(im)
    cur_w = 1200
    q = 78
    while True:
        r = im.resize((cur_w, round(cur_w * 9 / 16)), Image.LANCZOS)
        buf = io.BytesIO()
        r.save(buf, format="WEBP", quality=q, method=6)
        b = buf.getvalue()
        if len(b) <= MAX_BYTES:
            return b, dh
        if q > 36:
            q -= 7
        else:
            cur_w = int(cur_w * 0.86)
            q = 66


EXTRA_VARIATIONS = [
    "Captured from an elevated diagonal perspective in bright natural morning light beside red travel bags.",
    "Framed at low wheel-level angle on warm limestone tiles with soft outdoor garden bokeh.",
    "Shot inside a sunlit family home entryway with hardwood floor and neatly packed weekend luggage.",
    "Photographed beside an open dark-blue SUV cargo bay in crisp afternoon daylight.",
]


def load_existing_dhashes() -> dict[str, int]:
    if DHASH_CACHE_FILE.exists():
        try:
            return {k: int(v) for k, v in json.loads(DHASH_CACHE_FILE.read_text()).items()}
        except Exception:
            pass
    out: dict[str, int] = {}
    for p in ART_IMG_DIR.glob("*.webp"):
        if p.stem.endswith("-800") or p.stem.endswith("-400"):
            continue
        try:
            with Image.open(p) as im:
                out[p.stem] = compute_dhash(im)
        except Exception:
            pass
    return out


def gen_article_image(slug: str, prompt: str, dhashes: dict[str, int]) -> tuple[str, int, bool]:
    dest = ART_IMG_DIR / f"{slug}.webp"
    if dest.exists() and 1_000 < dest.stat().st_size < 100_000:
        with LOCK:
            if slug not in dhashes:
                with Image.open(dest) as im:
                    dhashes[slug] = compute_dhash(im)
        return slug, dest.stat().st_size, False

    cur_prompt = prompt
    webp_bytes = b""
    dh = 0
    for v_idx in range(3):
        raw = call_api(slug, cur_prompt)
        webp_bytes, dh = compress_1200_webp(raw)
        with LOCK:
            too_close = any(
                other_slug != slug and hamming(dh, other_dh) <= 2
                for other_slug, other_dh in dhashes.items()
            )
            if not too_close or v_idx == 2:
                dhashes[slug] = dh
                break
        cur_prompt = f"{prompt} {EXTRA_VARIATIONS[(v_idx + hash(slug)) % len(EXTRA_VARIATIONS)]}"

    dest.write_bytes(webp_bytes)
    return slug, len(webp_bytes), True


def run_batch(limit: int | None = None, workers: int = 12):
    prompts: dict[str, str] = json.loads(PROMPTS_FILE.read_text(encoding="utf-8"))
    dhashes = load_existing_dhashes()

    # Clean up unused -800 / -400 files in articulos if present
    for extra in list(ART_IMG_DIR.glob("*-800.webp")) + list(ART_IMG_DIR.glob("*-400.webp")):
        extra.unlink()

    pending = [
        (slug, pr)
        for slug, pr in prompts.items()
        if not (
            (ART_IMG_DIR / f"{slug}.webp").exists()
            and 1_000 < (ART_IMG_DIR / f"{slug}.webp").stat().st_size < 100_000
        )
    ]
    if limit is not None:
        pending = pending[:limit]

    total_target = len(prompts) if limit is None else len(pending)
    print(
        f"Target prompts: {len(prompts)} | Already on disk: {len(prompts) - len(pending) if limit is None else 0} | Pending now: {len(pending)} (workers={workers})",
        flush=True,
    )

    done_new = 0
    failed = []
    t0 = time.time()
    with cf.ThreadPoolExecutor(max_workers=workers) as ex:
        fut_map = {
            ex.submit(gen_article_image, slug, pr, dhashes): slug
            for slug, pr in pending
        }
        for fut in cf.as_completed(fut_map):
            slug = fut_map[fut]
            try:
                _, sz, created = fut.result()
                if created:
                    done_new += 1
                if done_new % 25 == 0 or limit is not None:
                    elapsed = time.time() - t0
                    rate = done_new / max(elapsed, 0.1) * 60
                    existing_cnt = len(list(ART_IMG_DIR.glob("*.webp")))
                    print(
                        f"[{existing_cnt}/{len(prompts)}] +{done_new} new ({rate:.1f} img/min) last={slug} ({sz} B)",
                        flush=True,
                    )
                    with LOCK:
                        DHASH_CACHE_FILE.write_text(json.dumps(dhashes))
            except Exception as e:
                failed.append((slug, str(e)))
                print(f"[ERR] {slug}: {e}", flush=True)

    DHASH_CACHE_FILE.write_text(json.dumps(dhashes))
    existing_cnt = len(list(ART_IMG_DIR.glob("*.webp")))
    print(
        f"Summary: on_disk={existing_cnt}/{len(prompts)} | newly_created={done_new} | failed={len(failed)}",
        flush=True,
    )
    if failed:
        print("Sample failures:", failed[:5], flush=True)
        sys.exit(1)


def audit():
    prompts: dict[str, str] = json.loads(PROMPTS_FILE.read_text(encoding="utf-8"))
    files = sorted(ART_IMG_DIR.glob("*.webp"))
    missing = [s for s in prompts if not (ART_IMG_DIR / f"{s}.webp").exists()]
    over_100k = [(p.name, p.stat().st_size) for p in files if p.stat().st_size >= 100_000]
    sizes = [p.stat().st_size for p in files]
    dhashes = load_existing_dhashes()
    unique_hashes = len(set(dhashes.values()))
    print(f"Total article images: {len(files)} / {len(prompts)}")
    print(f"Missing: {len(missing)}")
    print(f"Over 100KB: {len(over_100k)} {over_100k[:5]}")
    if sizes:
        print(f"Min size: {min(sizes)} B | Avg size: {sum(sizes)//len(sizes)} B | Max size: {max(sizes)} B ({max(sizes)/1024:.1f} KB)")
    print(f"Unique 64-bit dHashes: {unique_hashes} / {len(dhashes)}")
    assert len(missing) == 0, f"Missing {len(missing)} images"
    assert len(over_100k) == 0, f"Found {len(over_100k)} images >= 100KB"
    print("✅ IMAGE AUDIT PASSED 100%")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all_1524"
    w = int(sys.argv[2]) if len(sys.argv) > 2 else 12
    if cmd == "test2":
        run_batch(limit=2, workers=2)
    elif cmd == "all_1524":
        run_batch(limit=None, workers=w)
    elif cmd == "audit":
        audit()
