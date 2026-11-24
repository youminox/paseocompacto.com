#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera imágenes fotorrealistas y visualmente diversas para paseocompacto.com vía la Edge Function paseocompacto-images
(Supabase charlielingan → OpenAI ChatGPT Image API con quality="medium") y las comprime en WebP
ligeros (<= 68 KB, garantizado estrictamente < 100 KB para Google SEO) en public/img/,
incluyendo verificación perceptual dHash anti-similitud.

Uso:
  python3 scripts/gen_images.py all         # genera ~70 imágenes diversas (Home + 14 Silos + Escenas + Artículos Top)
  python3 scripts/gen_images.py home        # solo Home + 14 Silos + Escenas
  python3 scripts/gen_images.py articles    # solo artículos destacados
  python3 scripts/gen_images.py one <slug> "<prompt>"
"""
import concurrent.futures as cf
import io
import json
import pathlib
import sys
import urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENDPOINT = "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/paseocompacto-images"
TOKEN = "paseocompacto-img-2026"
RAW = ROOT / "scripts/.cache/raw"
RAW.mkdir(parents=True, exist_ok=True)

# 51 escenas fotográficas ultra diversas (distintos ángulos, entornos de maletera, aeropuerto, lluvias y accesorios)
HOME_PROMPTS = {
    "home-hero-viaje": "Three-quarter editorial travel photograph inside an open sunlit modern sedan trunk showing a slim folded black compact travel stroller neatly placed beside two hardshell cabin suitcases and a diaper backpack",
    "og-default": "Sunlit modern airport departure lounge seating area displaying three distinct compact travel strollers—one umbrella-fold stroller, one standing one-hand fold stroller, and an infant car-seat stroller—beside luggage",
    "home-maletera-sedan": "Wide realistic top-angle view of a compact hatchback car trunk neatly holding two medium travel bags, a carry-on suitcase and a lightweight folded travel stroller with ample free cargo room",
    "home-gate-check": "Realistic airport jet bridge scene where smiling parents zip a folded lightweight stroller into a bright red waterproof gate-check travel bag with backpack straps before boarding",
    "home-plegado-una-mano": "Candid eye-level outdoor street shot beside a city taxi showing a mother holding her toddler securely on one hip while folding a slate-gray compact stroller effortlessly with her free hand",
    "home-doona-asiento": "Interior rear-seat car photograph showing a sleek dark-gray 2-in-1 infant car seat stroller buckled neatly on the passenger side while the open car trunk in the background remains completely empty",
    "home-lluvia-paseo": "Realistic misty European city street scene featuring a compact travel stroller shielded by a crystal-clear ventilated rain cover with zippered front window while parents walk under an umbrella",
    "home-organizador-manillar": "Close-up editorial photograph of a quilted universal stroller handlebar organizer with two insulated bottles, zippered smartphone pouch and baby wipes attached cleanly to a stroller bar",
    "home-cabina-avion": "Inside a commercial aircraft cabin aisle showing a traveler sliding an ultra-compact tri-fold travel stroller inside its backpack sleeve into the overhead luggage bin",
    # 14 Categorías Pilares
    "cat-resenas-coches-compactos-de-viaje": "Clean modern studio loft comparison showing an aluminum umbrella travel stroller, a single-bar one-hand fold stroller and a digital luggage hanging scale on oak wood",
    "cat-comparativas-coches-de-bebe": "Balanced side-by-side studio comparison of an elongated 3D umbrella-fold stroller on the left and an upright standing compact stroller on the right next to a measuring tape",
    "cat-mejores-coches-por-viaje-y-auto": "Open SUV rear hatch packed for a family vacation displaying a folded compact stroller, two suitcases, beach bag and stroller rain pouch in golden afternoon light",
    "cat-bolsos-de-transporte-y-fundas-avion": "Flat-lay editorial composition on warm birch flooring of a bright red ripstop gate-check stroller bag, a padded black travel backpack bag and luggage identification tags",
    "cat-protectores-de-lluvia-y-clima": "Macro editorial view of a clear EVA baby stroller rain shield with breathable side mesh windows and UV sun canopy extender beside a compact travel stroller on wet patio tiles",
    "cat-organizadores-y-accesorios-compatibles": "Detailed tabletop arrangement of a black stroller handlebar organizer, insulated cup holder, flexible silicone snack tray and USB clip-on fan in soft daylight",
    "cat-viajar-en-avion-cabina-y-gate-check": "Parents pushing a nimble dark-navy compact stroller through a bright glass-walled international airport concourse past departure boards and rolling carry-ons",
    "cat-espacio-en-maletera-y-viajes-en-auto": "Clean side-angle view looking into a compact silver sedan trunk showing exact packing geometry of two suitcases and a slim folded baby stroller",
    "cat-guias-de-plegado-peso-y-medidas": "Macro close-up of a thumb pressing an ergonomic one-hand folding trigger latch on a sleek charcoal stroller handlebar against soft outdoor greenery",
    "cat-etapas-del-bebe-edad-peso-y-reclinado": "Peaceful park pathway scene featuring a deeply reclined compact stroller with adjustable calf rest and oversized mesh-peekaboo sun canopy during an outdoor nap",
    "cat-seguridad-certificaciones-faa-y-frenos": "Extreme close-up of a padded 5-point baby stroller safety harness buckle and an engaged rear linked foot brake pedal on paved walkway",
    "cat-mantenimiento-limpieza-y-repuestos": "Clean balcony maintenance tabletop with a soft nylon brush, microfiber cloth, dry silicone spray bottle and cleanly wiped swivel stroller wheels",
    "cat-destinos-paseos-urbanos-y-logistica-familiar": "Family strolling happily past sunlit café tables on a historic cobblestone pedestrian street pushing a nimble lightweight stroller with compact canopy",
    "cat-guia-de-compra-en-amazon-usa-y-equipaje": "Bright hotel room welcome scene with a newly unboxed lightweight travel stroller, compact travel organizer and packed family weekender bag",
    # 28 Variantes Visuales Anti-Similitud (2 adicionales por cada silo)
    "scene-resenas-2": "Low-angle hero photograph of a slim charcoal umbrella-fold stroller with silver aluminum struts standing beside a travel duffel on travertine tile",
    "scene-resenas-3": "Hands lifting a featherweight 11-pound folded compact stroller effortlessly by its padded shoulder carry strap up bright subway stairs",
    "scene-comparativas-2": "Top-down visual footprint comparison on light oak floor showing a long folded umbrella stroller next to a square tri-fold travel stroller",
    "scene-comparativas-3": "Detailed close-up comparing dual curved foam umbrella handles on the left with a continuous horizontal parent handlebar on the right",
    "scene-viaje-auto-2": "Father loading a square-folded compact stroller with one hand into the rear cargo area of a white rental crossover vehicle",
    "scene-viaje-auto-3": "Compact economy city car open trunk comfortably fitting a folded umbrella stroller diagonally alongside grocery totes",
    "scene-bolsos-2": "Close-up of a padded black nylon stroller backpack travel bag resting on an airport baggage scale showing light travel weight",
    "scene-bolsos-3": "Folded red gate-check travel pouch stored neatly inside the under-seat mesh basket of a compact travel stroller",
    "scene-lluvia-2": "Fine breathable white mosquito net cover stretched smoothly over a lightweight travel stroller parked near tropical resort palms",
    "scene-lluvia-3": "Extendable UPF 50+ dark navy clip-on sun shade canopy shielding a compact travel stroller on a sunny beach promenade",
    "scene-organizadores-2": "Insulated double bottle pocket organizer strapped neatly between dual curved handles of a lightweight umbrella stroller",
    "scene-organizadores-3": "Flexible silicone baby snack tray with cup recess snapped firmly across the front belly bar of a compact travel stroller",
    "scene-avion-2": "Family passing smoothly through an airport terminal hallway with a folded compact stroller slung over the shoulder like a gym bag",
    "scene-avion-3": "2-in-1 infant car seat stroller buckled securely with a lap belt inside a commercial airplane window seat row",
    "scene-maletera-2": "Three-row family SUV with all seats raised showing a slim compact stroller resting vertically behind the third row bench",
    "scene-maletera-3": "Clean yellow-and-black taxi trunk open at an airport curb with a folded compact stroller and two hard carry-on suitcases inside",
    "scene-plegado-2": "Step-by-step action shot of a foot lifting the rear red folding latch on an aluminum umbrella stroller chassis on sunlit patio stones",
    "scene-plegado-3": "Self-standing folded light-gray stroller balancing upright independently beside a hotel check-in desk without touching the wall",
    "scene-etapas-2": "Padded ergonomic newborn head support cushion nestled cleanly inside an infant car seat stroller in bright natural window light",
    "scene-etapas-3": "Tall toddler comfortably seated upright under an extended ventilated mesh canopy of a sturdy 50-lb rated lightweight stroller",
    "scene-seguridad-2": "Close-up of dual front swivel wheel locking levers on a compact stroller before rolling onto textured paving stones",
    "scene-seguridad-3": "Parent wrist safety tether strap looped gently around the wrist while walking a lightweight stroller down a gentle park slope",
    "scene-mantenimiento-2": "Freshly rinsed compact stroller seat fabric drying outdoors on a shaded balcony rack beside clean detached canopy pads",
    "scene-mantenimiento-3": "Close-up of a dry brush removing fine coastal beach sand from compact dual stroller wheel bearings on a rubber mat",
    "scene-destinos-2": "Cheerful parents navigating a bustling sunny theme park avenue with a lightweight compact stroller and cold water bottles in the organizer",
    "scene-destinos-3": "Narrow cruise ship cabin hallway with a slim compact stroller rolling effortlessly through the stateroom doorway",
    "scene-amazon-usa-2": "Hotel concierge desk corner with two neatly sealed cardboard delivery boxes beside a newly assembled lightweight travel stroller",
    "scene-amazon-usa-3": "Minimalist travel checklist flat-lay on oak wood featuring a luggage scale, folded rain cover pouch, red gate-check bag and boarding folder",
}

TOP_ARTICLE_SLUGS = [
    "ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera",
    "kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano",
    "doona-car-seat-stroller-2-en-1-avion-faa-resena-completa",
    "ingenuity-3dmini-convenience-stroller-resena-viaje-economico",
    "ingenuity-3dquickclose-cs-compact-fold-resena-plegado-libro",
    "kolcraft-cloud-umbrella-stroller-resena-ultraligero-verano",
    "ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje",
    "ingenuity-3dlite-vs-kolcraft-cloud-plus-vs-doona-cual-elegir",
    "mejores-coches-compactos-de-bebe-para-viajar-amazon-usa",
    "mejores-coches-compactos-para-maleteras-pequenas-sedan-hatchback",
    "mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona",
    "mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona",
    "mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona",
    "que-coches-caben-compartimento-superior-avion-medidas-iata",
    "como-meter-coche-compacto-y-dos-maletas-maletera-sedan",
    "como-cerrar-coche-bebe-con-una-sola-mano-mientras-cargas-bebe",
    "desde-que-mes-puede-ir-bebe-en-coche-compacto-de-viaje",
    "que-significa-certificacion-faa-astm-jpma-coche-viaje",
    "como-limpiar-y-lubricar-ruedas-coche-compacto-despues-playa",
    "como-comprar-coche-compacto-en-amazon-usa-medidas-envio-hotel",
]


def compute_dhash(im: Image.Image, hash_size: int = 8) -> int:
    small = im.convert("L").resize((hash_size + 1, hash_size), Image.LANCZOS)
    pixels = list(small.getdata())
    bits = 0
    for row in range(hash_size):
        offset = row * (hash_size + 1)
        for col in range(hash_size):
            bits = (bits << 1) | (1 if pixels[offset + col] > pixels[offset + col + 1] else 0)
    return bits


def call(slug: str, prompt: str) -> bytes:
    data = json.dumps({"slug": slug, "prompt": prompt}).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-paseocompacto-token": TOKEN,
        },
    )
    with urllib.request.urlopen(req, timeout=240) as r:
        res = json.loads(r.read())
    if not res.get("ok"):
        raise RuntimeError(res.get("error"))
    with urllib.request.urlopen(res["url"] + "?v=1", timeout=120) as r:
        return r.read()


def save_variants(slug: str, raw_bytes: bytes, outdir: pathlib.Path) -> tuple[dict, int]:
    outdir.mkdir(parents=True, exist_ok=True)
    im = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    w, h = im.size
    target = 16 / 9
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))

    dhash = compute_dhash(im)
    # Tope duro: <= 68 KB para 1200x675 (estrictamente < 100 KB como solicitó el usuario)
    sizes = {"": 1200, "-800": 800, "-400": 400}
    limits = {"": 68_000, "-800": 42_000, "-400": 18_000}
    out = {}
    for suf, width in sizes.items():
        cur_w = width
        q = 78
        while True:
            r = im.resize((cur_w, round(cur_w * 9 / 16)), Image.LANCZOS)
            buf = io.BytesIO()
            r.save(buf, format="WEBP", quality=q, method=6)
            b = buf.getvalue()
            if len(b) <= limits[suf]:
                break
            if q > 36:
                q -= 7
            else:
                cur_w = int(cur_w * 0.85)
                q = 65
        p = outdir / f"{slug}{suf}.webp"
        p.write_bytes(b)
        out[suf or "full"] = len(b)
    return out, dhash


def gen_one(slug: str, prompt: str, outdir: pathlib.Path) -> tuple[str, dict, int]:
    raw_file = RAW / f"{slug}.webp"
    if raw_file.exists():
        raw = raw_file.read_bytes()
    else:
        raw = call(slug, prompt)
        raw_file.write_bytes(raw)
    sizes, dhash = save_variants(slug, raw, outdir)
    return slug, sizes, dhash


def gen_home():
    outdir = ROOT / "public/img/ambiente"
    tasks = list(HOME_PROMPTS.items())
    hashes: dict[str, int] = {}
    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(gen_one, slug, prompt, outdir) for slug, prompt in tasks]
        for f in cf.as_completed(futs):
            slug, sizes, dh = f.result()
            hashes[slug] = dh
            print(f"[AMB] {slug}: {sizes}", flush=True)
    vals = list(hashes.values())
    dists = [
        bin(vals[i] ^ vals[j]).count("1")
        for i in range(len(vals))
        for j in range(i + 1, len(vals))
    ]
    if dists:
        print(
            f"Diversidad dHash en {len(vals)} escenas: distancia mínima = {min(dists)} bits, promedio = {sum(dists)/len(dists):.1f} bits",
            flush=True,
        )


def gen_articles(only_top: bool = True):
    outdir = ROOT / "public/img/articulos"
    art_dir = ROOT / "src/content/articles"
    if only_top:
        slugs = TOP_ARTICLE_SLUGS
    else:
        slugs = [f.stem for f in sorted(art_dir.glob("*.json"))]

    tasks = []
    for s in slugs:
        fp = art_dir / f"{s}.json"
        if not fp.exists():
            continue
        a = json.loads(fp.read_text(encoding="utf-8"))
        tasks.append((s, a["image"]["prompt"]))

    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(gen_one, slug, prompt, outdir) for slug, prompt in tasks]
        for f in cf.as_completed(futs):
            slug, sizes, _ = f.result()
            print(f"[ART] {slug}: {sizes}", flush=True)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    if cmd == "home":
        gen_home()
    elif cmd == "articles":
        gen_articles(only_top=True)
    elif cmd == "all_articles":
        gen_articles(only_top=False)
    elif cmd == "all":
        gen_home()
        gen_articles(only_top=True)
    elif cmd == "one":
        s, pr = sys.argv[2], sys.argv[3]
        print(gen_one(s, pr, ROOT / "public/img/articulos"))
