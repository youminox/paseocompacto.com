#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepara los 1,524 briefs editoriales para redacción con el LLM (Gemini 4 Carbon High)
y los 1,524 prompts fotográficos 100 % únicos y anti-similitud para ChatGPT Image API.
"""
import hashlib
import json
import pathlib
import re

from topics_catalog import PILLARS, generate_transactional_510, generate_seo_1000

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts/.cache"
CACHE.mkdir(parents=True, exist_ok=True)


def clean_slug(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


# 32 encuadres y ópticas fotográficas reales
CAMERAS = [
    "Eye-level candid documentary travel shot on 35mm f/2.0 lens",
    "Three-quarter elevated angle on 50mm prime lens with natural depth of field",
    "High-angle 45-degree trunk-packing perspective on 28mm wide-angle lens",
    "Low-angle ground-level perspective highlighting wheels and compact frame on 35mm lens",
    "Side-profile editorial composition on 85mm f/2.8 lens with soft background bokeh",
    "Close-up functional detail framing of folding latch, canopy and chassis on 50mm macro lens",
    "Wide environmental travel portrait framing family gear in context on 24mm lens",
    "Over-the-shoulder parent perspective packing travel gear on 35mm lens",
    "Clean architectural symmetry framing in modern transit space on 40mm lens",
    "Diagonal dynamic walkway framing with crisp motion-frozen wheels on 50mm lens",
    "Overhead tabletop flat-lay and side-by-side gear arrangement on 35mm lens",
    "Intimate rear-seat interior cabin perspective looking through open car door on 28mm lens",
    "Three-quarter rear cargo bay close-up showing exact luggage clearance on 35mm lens",
    "Candid street-corner lifestyle framing beside curb on 50mm lens",
    "Split studio-style comparison framing on warm natural flooring on 50mm lens",
    "Bright window-lit interior hallway departure framing on 35mm lens",
    "Medium shot focused on handlebar ergonomics and parent grip on 85mm lens",
    "Quarter-turn upright folded silhouette framing next to carry-on roller bag on 50mm lens",
    "Wide panoramic airport gate seating area composition on 28mm lens",
    "Close mechanical joint and breathable mesh canopy study on 60mm lens",
    "Natural family boardwalk stroll framing from 45-degree front angle on 50mm lens",
    "Tight vertical-clearance trunk corner framing beside suitcases on 35mm lens",
    "Crisp outdoor patio stone demonstration angle on 40mm lens",
    "Elevated staircase landing portability shot with shoulder strap on 35mm lens",
    "Hotel check-in lobby marble floor lifestyle angle on 50mm lens",
    "Park bench rest-stop perspective with reclined backrest on 85mm lens",
    "Jet-bridge boarding corridor perspective on 35mm lens",
    "Suburban garage open-hatch packing demonstration on 28mm lens",
    "Covered arcade walkway weather-protection angle on 50mm lens",
    "Train platform level-boarding gap perspective on 35mm lens",
    "Compact apartment entryway storage nook perspective on 28mm lens",
    "Sunlit outdoor café terrace table-side parking perspective on 50mm lens",
]

# 32 escenarios físicos distintos
LOCATIONS = [
    "beside an open silver sedan trunk parked on a tree-lined residential driveway",
    "inside a bright glass-walled international airport departure concourse",
    "at an airline jet-bridge boarding door next to a carry-on suitcase",
    "beside a compact white hatchback rear cargo area in a clean sunlit parking deck",
    "on a historic European cobblestone pedestrian street near café chairs",
    "along a shaded botanical park paved pathway with lush green foliage",
    "in a modern minimalist hotel lobby with warm travertine stone flooring",
    "next to a yellow city taxi open trunk along an urban avenue curb",
    "on a sunny coastal wooden boardwalk with palm trees in soft focus",
    "inside a spacious family garage next to two hardshell suitcases and a duffel bag",
    "in a sunlit Scandinavian-style living room hardwood hallway ready for departure",
    "at a train station platform beside sliding carriage doors",
    "inside a modern crossover SUV trunk showing generous remaining luggage space",
    "on a clean wet slate plaza after light rain with reflections",
    "along a wide family theme-park promenade with colorful gardens blurred behind",
    "in a narrow cruise-ship cabin corridor with warm carpeting",
    "beside an airport baggage scale and check-in counter area",
    "at the foot of bright subway station stairs with stainless handrails",
    "inside a rental car pickup bay with neatly stacked family luggage",
    "on a breezy resort courtyard patio with terracotta tiles",
    "next to a cozy nursery doorway with packed weekender tote",
    "in an outdoor shopping promenade with smooth limestone pavers",
    "beside a minivan rear bench with neatly organized baby travel gear",
    "under a modern glass canopy at a museum entrance plaza",
    "in a bright airport family lounge beside leather seating",
    "on a brick-paved university town sidewalk in autumn light",
    "inside a compact city-car open boot with a cabin backpack beside it",
    "at a scenic overlook parking bay with mountain horizon blurred",
    "on a shaded brick patio beside a wooden bench and diaper bag",
    "along a wide waterfront esplanade with calm harbor water behind",
    "in a hotel guest-room entryway next to a luggage rack",
    "at a suburban park playground perimeter path on a clear day",
]

# 20 paletas cromáticas de tapizado y chasis para que ningún coche se vea idéntico
COLORWAYS = [
    "matte charcoal fabric with brushed silver aluminum tubing and cognac handle grip",
    "deep navy blue canopy with matte black anodized aluminum frame",
    "heather slate gray melange fabric with satin black lightweight frame",
    "warm sand beige UV canopy with champagne-silver aluminum chassis",
    "olive sage green breathable fabric with matte dark-gray tubing",
    "classic jet-black ripstop fabric with subtle teal accent stitching",
    "soft stone gray fabric with polished silver umbrella struts",
    "deep burgundy plum canopy with charcoal aluminum frame",
    "forest pine green canopy with black ergonomic handlebar",
    "graphite melange upholstery with dark bronze metallic frame accents",
    "midnight blue melange seat with light gray ventilated mesh panels",
    "warm taupe fabric with matte black compact tri-fold joints",
    "coastal slate blue canopy with silver lightweight frame",
    "terracotta rust accent canopy with charcoal gray seat pad",
    "pearl gray fabric with sleek black single-bar handle",
    "espresso brown trim on oatmeal melange fabric and black chassis",
    "dusty eucalyptus green canopy with silver-gray frame",
    "charcoal tweed-texture seat with bright red folding latch detail",
    "steel blue UV50+ canopy with matte titanium-toned tubing",
    "anthracite black seat with ivory piping and silver swivel wheels",
]

# 18 atmósferas de iluminación realistas
LIGHTINGS = [
    "crisp morning sunlight casting gentle directional shadows",
    "warm golden-hour afternoon sunlight with natural rim glow",
    "soft diffused overcast daylight revealing true fabric textures",
    "bright airy skylight illumination inside a modern terminal",
    "dappled sunlight filtering through park trees",
    "clean neutral mid-morning daylight with high clarity",
    "warm late-afternoon sun streaming through large floor-to-ceiling windows",
    "fresh post-rain luminous daylight on damp pavement",
    "soft coastal daylight with clean sky reflections",
    "even open-shade natural outdoor illumination",
    "bright garage door daylight illuminating the trunk interior clearly",
    "early morning blue-hour transition with warm terminal lights",
    "clear high-visibility sunny travel day lighting",
    "soft window sidelight highlighting aluminum joints and quilted fabric",
    "warm welcoming indoor-outdoor threshold daylight",
    "crisp autumn afternoon clarity with rich natural contrast",
    "gentle diffused courtyard skylight",
    "bright sunlit curb-side natural photography lighting",
]


def infer_specific_subject(slug: str, title: str, pillar: str, base_subj: str) -> str:
    t = f"{slug} {title}".lower()
    parts = []

    # Detect specific stroller geometry
    if "doona" in t and "trike" in t:
        parts.append("ultra-compact foldable toddler trike stroller with parent push bar")
    elif "doona" in t:
        parts.append("2-in-1 infant car seat stroller with integrated retractable wheels")
    elif "3dquickclose" in t or "presto" in t or "ready2jet" in t or "libro" in t:
        parts.append("compact book-fold baby stroller folding into a short square upright package")
    elif "pockit" in t or "yoyo" in t or "butterfly" in t or "aer" in t or "sparrow" in t or "bitsy" in t or "itsy" in t or "metro" in t or "minu" in t or "cabina" in t or "overhead" in t:
        parts.append("ultra-compact tri-fold cabin baby stroller sized for airplane overhead bin")
    elif "double" in t or "gemelar" in t or "dos-bebes" in t or "hermanos" in t:
        parts.append("lightweight side-by-side compact double travel stroller with dual canopies")
    elif "kolcraft" in t and "umbrella" not in t:
        parts.append("lightweight one-hand easy-fold baby stroller with continuous handlebar and child snack tray")
    elif "ingenuity" in t or "paraguas" in t or "baston" in t or "umbrella" in t:
        parts.append("ultralight 3D umbrella-fold aluminum baby stroller with dual curved handles and shoulder carry strap")
    else:
        parts.append(base_subj or "compact lightweight family travel baby stroller")

    # Detect specific accessory or action in the article topic
    if "gate-check" in t or "bolso" in t or "funda" in t or "mochila" in t:
        parts.append("paired with a protective waterproof gate-check stroller travel bag with backpack straps")
    if "lluvia" in t or "burbuja" in t or "eva" in t or "viento" in t:
        parts.append("fitted with a crystal-clear ventilated EVA rain cover with zippered front window")
    elif "mosquitero" in t or "insecto" in t:
        parts.append("covered with a fine breathable mesh mosquito net shield")
    elif "solar" in t or "uv" in t or "playa" in t or "calor" in t or "verano" in t:
        parts.append("featuring an extended UPF50+ sun visor shade and ventilated mesh backrest")
    if "organizador" in t or "portavasos" in t or "biberon" in t or "manillar" in t:
        parts.append("equipped with a neatly strapped handlebar organizer holding two insulated baby bottles")
    if "maletera" in t or "cajuela" in t or "sedan" in t or "hatchback" in t or "suv" in t or "equipaje" in t or "maletas" in t:
        parts.append("positioned to clearly demonstrate generous free car trunk cargo space alongside family suitcases")
    elif "una-mano" in t or "1-mano" in t or "cerrar" in t or "plegar" in t or "abrir" in t:
        parts.append("showing smooth one-hand folding mechanism while a parent holds a baby bag")
    elif "avion" in t or "aeropuerto" in t or "embarque" in t or "faa" in t:
        parts.append("in an air-travel family boarding context")
    elif "ruedas" in t or "limpiar" in t or "lubricar" in t or "arena" in t or "mantenimiento" in t or "lavar" in t:
        parts.append("showing clean swivel wheel assemblies, locking levers and well-maintained washable fabric")
    elif "freno" in t or "arnes" in t or "seguridad" in t or "vuelco" in t or "certificacion" in t:
        parts.append("highlighting the 5-point padded safety harness, low center of gravity and rear linked foot brake")
    elif "recien-nacido" in t or "0-a-" in t or "siesta" in t or "reclinado" in t:
        parts.append("in deep comfortable nap recline mode with padded infant support and adjustable calf rest")

    return ", ".join(parts)


def build_unique_prompt(slug: str, title: str, pillar: str, base_subj: str, idx: int) -> str:
    h = int(hashlib.sha256(slug.encode("utf-8")).hexdigest()[:12], 16)
    cam = CAMERAS[(idx + h) % len(CAMERAS)]
    loc = LOCATIONS[(idx * 7 + (h >> 5)) % len(LOCATIONS)]
    col = COLORWAYS[(idx * 13 + (h >> 11)) % len(COLORWAYS)]
    light = LIGHTINGS[(idx * 5 + (h >> 17)) % len(LIGHTINGS)]
    subj = infer_specific_subject(slug, title, pillar, base_subj)
    return (
        f"{cam}: {subj} in {col}, {loc}, {light}. "
        f"Topic focus: {slug.replace('-', ' ')}. "
        "Photorealistic authentic travel gear details, natural proportions, zero text, zero letters, zero logos, zero watermarks."
    )


def main():
    trans_items = generate_transactional_510()
    seo_items = generate_seo_1000()

    by_pillar = {p["slug"]: [] for p in PILLARS}
    for it in trans_items:
        by_pillar[it[2]].append(it)
    for it in seo_items:
        by_pillar[it[2]].append(it)

    pillar_paths = {
        p_slug: [f"/{p_slug}/{clean_slug(c[0])}/" for c in c_list]
        for p_slug, c_list in by_pillar.items()
    }
    key_hub_links = [
        "/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/",
        "/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/",
        "/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/",
        "/comparativas-coches-de-bebe/ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje/",
        "/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/",
        "/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/",
        "/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/",
        "/viajar-en-avion-cabina-y-gate-check/que-coches-caben-compartimento-superior-avion-medidas-iata/",
    ]

    briefs = []
    prompts = {}
    idx = 0

    trans_pillars = {
        "resenas-coches-compactos-de-viaje",
        "comparativas-coches-de-bebe",
        "mejores-coches-por-viaje-y-auto",
        "bolsos-de-transporte-y-fundas-avion",
        "protectores-de-lluvia-y-clima",
        "organizadores-y-accesorios-compatibles",
    }

    # 1. 14 Pillars
    for p in PILLARS:
        cat_slug = p["slug"]
        path = f"/{cat_slug}/"
        children = by_pillar[cat_slug]
        child_paths = [f"/{cat_slug}/{clean_slug(c[0])}/" for c in children[:10]]
        related = child_paths[:4]
        allowed_links = list(dict.fromkeys(child_paths[:8] + key_hub_links[:4]))
        pr = build_unique_prompt(cat_slug, p["title"], cat_slug, p["subject"], idx)
        idx += 1
        prompts[cat_slug] = pr
        briefs.append(
            {
                "slug": cat_slug,
                "pillar": cat_slug,
                "path": path,
                "isPillar": True,
                "isTransactional": cat_slug in trans_pillars,
                "primaryKeyword": p["kw"],
                "title": p["title"],
                "focusHint": f"Página pilar hub de categoría ({len(children)} guías hijas) enfocada en: {p['focus']}.",
                "related": related,
                "allowedLinks": [u for u in allowed_links if u != path][:8],
                "image": {"prompt": pr, "alt": p["title"]},
            }
        )

    # 2. 510 Transactional
    for i, it in enumerate(trans_items):
        slug, title, pillar, kw, weight_s, folded_s, fold1h_s, trunk_s, acc_s, picks, subj = it
        slug = clean_slug(slug)
        path = f"/{pillar}/{slug}/"
        sibs = pillar_paths[pillar]
        rot = [s for s in (sibs[(i + 1) % len(sibs) :] + sibs[: (i + 1) % len(sibs)]) if s != path]
        related = [f"/{pillar}/"] + rot[:3]
        allowed_links = list(dict.fromkeys(related + [u for u in key_hub_links if u != path][:4]))
        pr = build_unique_prompt(slug, title, pillar, subj, idx)
        idx += 1
        prompts[slug] = pr
        briefs.append(
            {
                "slug": slug,
                "pillar": pillar,
                "path": path,
                "isPillar": False,
                "isTransactional": True,
                "primaryKeyword": kw,
                "title": title,
                "focusHint": (
                    f"Artículo transaccional de análisis/compra en Amazon EE. UU. Selección clave: {picks}. "
                    f"Referencia peso: {weight_s}; plegado: {folded_s}; cierre 1 mano: {fold1h_s}; maletera: {trunk_s}; accesorios: {acc_s}."
                ),
                "related": related,
                "allowedLinks": allowed_links[:7],
                "image": {"prompt": pr, "alt": title},
            }
        )

    # 3. 1,000 Informational SEO
    for i, it in enumerate(seo_items):
        slug, title, pillar, kw, focus_summary, subj = it
        slug = clean_slug(slug)
        path = f"/{pillar}/{slug}/"
        sibs = pillar_paths[pillar]
        rot = [s for s in (sibs[(i + 1) % len(sibs) :] + sibs[: (i + 1) % len(sibs)]) if s != path]
        related = [f"/{pillar}/"] + rot[:3]
        allowed_links = list(dict.fromkeys(related + [u for u in key_hub_links if u != path][:4]))
        pr = build_unique_prompt(slug, title, pillar, subj, idx)
        idx += 1
        prompts[slug] = pr
        briefs.append(
            {
                "slug": slug,
                "pillar": pillar,
                "path": path,
                "isPillar": False,
                "isTransactional": False,
                "primaryKeyword": kw,
                "title": title,
                "focusHint": f"Guía informacional SEO en profundidad: {focus_summary}. Responde con medidas reales, maniobra práctica y comparación útil entre Ingenuity, Kolcraft y Doona cuando aplique.",
                "related": related,
                "allowedLinks": allowed_links[:7],
                "image": {"prompt": pr, "alt": title},
            }
        )

    assert len(briefs) == 1524, f"Expected 1524 briefs, got {len(briefs)}"
    assert len(set(prompts.values())) == 1524, "Prompts must be 100% unique!"

    (CACHE / "article_briefs.json").write_text(
        json.dumps(briefs, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (CACHE / "prompts_1524.json").write_text(
        json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"OK: Prepared {len(briefs)} unique briefs & {len(prompts)} unique image prompts.")


if __name__ == "__main__":
    main()
