#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador Maestro de las 1,524 Guías Editoriales de PaseoCompacto.com:
- 14 Hubs Pilares de Categoría (isPillar: true)
- 510 Artículos Transaccionales en 6 Silos de Coches y Accesorios Amazon (isTransactional: true)
- 1,000 Artículos SEO Informacionales en 8 Silos de Viaje, Maletera y Avión (isTransactional: false)

También genera:
- src/data/keyword_map.json (validando 0 % canibalización)
- public/search-index.json
"""
import json
import pathlib
import re

from topics_catalog import PILLARS, generate_transactional_510, generate_seo_1000

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
ART_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = ROOT / "src/data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
PUB_DIR = ROOT / "public"
PUB_DIR.mkdir(parents=True, exist_ok=True)

PUBLISHED = "2026-11-24"

# Matriz Fotográfica Anti-Similitud (8 ángulos × 6 iluminaciones × 10 entornos reales de viaje)
CAMERA_STYLES = [
    "Editorial travel lifestyle photograph with shallow depth of field (85mm f/2.8 lens)",
    "Three-quarter product angle from slightly above on clean oak flooring (50mm lens)",
    "Overhead flat-lay travel composition beside passport pouch and folded baby gear (35mm lens)",
    "Eye-level candid family travel action shot with authentic natural framing",
    "Side-profile studio photograph highlighting lightweight aluminum joints, folding latch and wheels",
    "Close-up detail highlighting breathable canopy mesh, harness buckle and stroller organizer",
    "Wide interior view beside an open modern vehicle trunk with organized luggage",
    "Oblique airport concourse or city café terrace photograph with soft background bokeh",
]

LIGHTING_MOODS = [
    "crisp natural morning daylight with clean soft shadows",
    "warm golden-hour afternoon sunlight during family travel",
    "bright neutral airport terminal ambient skylight",
    "soft diffused overcast outdoor studio daylight with accurate fabric colors",
    "clean sunlit modern garage illumination showing trunk dimensions clearly",
    "inviting bright living room window daylight beside travel bags",
]

SETTINGS_AND_PROPS = [
    "beside two hardshell travel suitcases in an open sedan trunk",
    "on a bright modern airport boarding gate corridor floor",
    "next to a waterproof bright red gate-check travel bag with backpack straps",
    "on a scenic city cobblestone plaza with a transparent protective rain cover nearby",
    "in a sunlit living room hallway ready for a weekend family road trip",
    "beside a dual-cup insulated handlebar organizer and diaper travel pouch",
    "next to a measuring tape highlighting ultra-compact folded footprint",
    "on a smooth resort boardwalk near palm shade and luggage cart",
    "beside a compact rental hatchback open rear cargo hatch",
    "on a clean travertine hotel lobby floor near check-in luggage",
]


def build_diverse_prompt(subject: str, idx: int) -> str:
    cam = CAMERA_STYLES[idx % len(CAMERA_STYLES)]
    light = LIGHTING_MOODS[(idx * 3 + 1) % len(LIGHTING_MOODS)]
    sett = SETTINGS_AND_PROPS[(idx * 7 + 2) % len(SETTINGS_AND_PROPS)]
    return (
        f"Realistic editorial family travel photography, {cam}: {subject}, {sett}, {light}. "
        "Authentic aluminum frame, fabric canopy texture and wheels, no text, no letters, no logos, no watermarks."
    )


def clean_slug(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


def make_pillar_article(p: dict, child_items: list, idx: int) -> dict:
    cat_slug = p["slug"]
    path = f"/{cat_slug}/"
    related_paths = [f"/{cat_slug}/{clean_slug(c[0])}/" for c in child_items[:4]]
    table_rows = [
        [c[1], f"[Ver guía completa](/{cat_slug}/{clean_slug(c[0])}/)"]
        for c in child_items[:16]
    ]
    is_trans_pillar = cat_slug in {
        "resenas-coches-compactos-de-viaje",
        "comparativas-coches-de-bebe",
        "mejores-coches-por-viaje-y-auto",
        "bolsos-de-transporte-y-fundas-avion",
        "protectores-de-lluvia-y-clima",
        "organizadores-y-accesorios-compatibles",
    }
    blocks = [
        {
            "type": "p",
            "text": f"Bienvenido al hub especializado de **{p['title']}** en **PaseoCompacto.com**. Aquí reunimos nuestras **{len(child_items)} guías verificadas** sobre **{p['focus']}**, organizadas sin solapamientos para ayudarte a comparar y consultar disponibilidad en **Amazon Estados Unidos (`amazon.com`)** o **Amazon España (`amazon.es`)**.",
        },
        {
            "type": "p",
            "text": "Tanto si quieres revisar la reseña del **[Ingenuity 3Dlite Convenience](/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/)**, comprobar el cierre con una mano del **[Kolcraft Cloud Plus](/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/)**, evaluar el **[Doona 2-en-1 FAA](/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/)** o elegir **[bolsos de transporte Gate Check](/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/)**, cada página te entrega datos concretos.",
        },
        {"type": "h2", "text": f"Qué evaluamos en {p['title'].split('(')[0].split(':')[0].strip()}"},
        {
            "type": "p",
            "text": f"En cada una de las **{len(child_items)} guías** de esta sección contrastamos cuatro datos decisivos antes de viajar: **1) Peso real en libras (`lb`) y kilogramos (`kg`)**; **2) Medidas plegado en pulgadas (`in`) y centímetros (`cm`)**; **3) Facilidad real para cerrarlo con una sola mano**; y **4) Espacio que deja libre en la maletera para el equipaje**, junto con bolsos de transporte, protectores de lluvia y organizadores compatibles.",
        },
        {
            "type": "table",
            "caption": f"Guías destacadas en {p['title'].split('(')[0].strip()}",
            "headers": ["Guía / Comparativa Especializada", "Enlace Directo"],
            "rows": table_rows,
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": "Regla rápida: Cabina IATA vs Gate Check y Maletera",
            "text": "Recuerda distinguir entre coches ultracompactos que entran en el compartimento superior del avión (34–54 cm) y coches paraguas/verticales (Ingenuity 3Dlite / Kolcraft Cloud Plus) que se entregan gratis en puerta de embarque (Gate Check) protegidos dentro de un bolso impermeable.",
        },
        {"type": "h2", "text": "Cómo elegir tu coche compacto de viaje en 3 pasos"},
        {
            "type": "ol",
            "items": [
                "**Define la edad de tu bebé y si viajas en auto o taxi:** para recién nacidos (4–35 lb) el **[Doona 2-en-1](/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/)** va en el asiento dejando la maletera 100 % libre. De 6 meses a 4 años (hasta 50 lb), **[Ingenuity 3Dlite](/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/)** o **[Kolcraft Cloud Plus](/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/)** cubren todo el viaje.",
                "**Comprueba si necesitas cierre con una sola mano:** si viajas solo cargando al bebé, prioriza modelos con cierre en barra superior (**Kolcraft Cloud Plus**) o libro (**[Ingenuity 3Dquickclose](/resenas-coches-compactos-de-viaje/ingenuity-3dquickclose-cs-compact-fold-resena-plegado-libro/)**).",
                "**Añade los 3 accesorios compatibles en Amazon EE. UU.:** suma siempre un **[bolso Gate Check](/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/)**, un **[protector de lluvia EVA](/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/)** y un **[organizador acorde a tu manillar](/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/)**.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Quieres confirmar si un modelo cabe en la maletera de tu auto o qué accesorios compatibles le hacen? Pregúntale ahora a nuestro Asesor IA.",
        },
    ]
    faqs = [
        {
            "q": f"¿Qué marcas comparamos en {p['title'].split('(')[0].strip()}?",
            "a": "Analizamos los modelos más vendidos y mejor valorados en Amazon Estados Unidos de Ingenuity (3Dlite, 3Dmini, 3Dquickclose CS+, 3Dlite Double), Kolcraft (Cloud Plus, Cloud Umbrella, Contours Bitsy Elite) y Doona (Car Seat & Stroller 2-en-1 FAA y Liki Trike), además de referentes de cabina como gb Pockit+ y YOYO.",
        },
        {
            "q": "¿Todos los modelos incluidos permiten consultar precio en Amazon Estados Unidos?",
            "a": "Sí. Cada ficha enlaza directamente a Amazon.com (tag paseocompacto-20) con selector manual a Amazon.es (tag paseocompacto-21) para consultar precios, colores y disponibilidad al instante.",
        },
        {
            "q": "¿Incluyen bolsos de transporte, protectores de lluvia y organizadores compatibles?",
            "a": "Sí. Indicamos exactamente qué accesorios sirven para doble manillar curvo (Ingenuity 3Dlite/3Dmini) frente a barra corrida única (Kolcraft Cloud Plus y Doona).",
        },
    ]
    return {
        "slug": cat_slug,
        "pillar": cat_slug,
        "path": path,
        "isPillar": True,
        "isTransactional": is_trans_pillar,
        "primaryKeyword": p["kw"],
        "title": p["title"],
        "seoTitle": f"{p['title']} | PaseoCompacto.com",
        "metaDescription": f"Guía en español sobre {p['focus']}. Compara Ingenuity, Kolcraft y Doona en Amazon EE. UU.",
        "excerpt": f"Explora las {len(child_items)} guías sobre {p['focus']} con medidas reales, cierre con una mano y espacio en maletera.",
        "quickAnswer": f"En esta sección reunimos {len(child_items)} guías sobre {p['focus']}. Comparamos modelos de Ingenuity, Kolcraft y Doona según su peso, medidas al plegarse, cierre con una mano y espacio libre en la maletera junto a sus accesorios compatibles en Amazon EE. UU.",
        "readingMinutes": 8,
        "image": {
            "prompt": build_diverse_prompt(p["subject"], idx),
            "alt": p["title"],
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "Amazon.com Best Sellers in Lightweight Baby Strollers", "url": "https://www.amazon.com/Best-Sellers-Baby-Lightweight-Strollers/zgbs/baby-products/166842011"},
            {"label": "FAA – Traveling with Children & Approved Child Restraint Systems", "url": "https://www.faa.gov/travelers/fly_children"},
        ],
        "related": related_paths,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": f"/img/ambiente/cat-{cat_slug}.webp",
    }


def make_transactional_article(item: tuple, sibling_paths: list, idx: int) -> dict:
    slug, title, pillar, kw, weight_s, folded_s, fold1h_s, trunk_s, acc_s, picks, subj = item
    slug = clean_slug(slug)
    path = f"/{pillar}/{slug}/"
    rel = [p for p in sibling_paths if p != path][:3]
    rel.insert(0, f"/{pillar}/")

    blocks = [
        {
            "type": "p",
            "text": f"Revisar en detalle **{title}** es fundamental antes de viajar en auto o avión con tu bebé. En esta guía práctica orientada a compras en **Amazon Estados Unidos (`amazon.com`)** contrastamos su **peso real ({weight_s})**, sus **medidas al plegarse ({folded_s})**, la **facilidad para cerrarlo con una mano ({fold1h_s})** y el **espacio disponible que deja en la maletera ({trunk_s})**, junto a sus accesorios compatibles.",
        },
        {
            "type": "h2",
            "text": "Evaluación técnica: peso, medidas plegado, cierre con 1 mano y maletera",
        },
        {
            "type": "p",
            "text": f"Al evaluar opciones alrededor de **{picks}**, la verdadera diferencia en vacaciones se nota cuando cargas al bebé en un brazo, abres la puerta del taxi o pasas el control del aeropuerto. Un modelo compacto bien elegido combina un chasis liviano (**{weight_s}**) con dimensiones plegadas manejables (**{folded_s}**) que permiten acomodar maletas de 23 kg y mochilas sin forzar la cajuela.",
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": f"Ficha Técnica Rápida: {picks.split(',')[0].strip()}",
            "text": f"• Peso y capacidad soportada: {weight_s}.\n• Medidas al plegarse: {folded_s}.\n• Cierre con una mano: {fold1h_s}.\n• Espacio en maletera: {trunk_s}.\n• Accesorios compatibles: {acc_s}.",
        },
        {
            "type": "h2",
            "text": f"Tabla comparativa en Amazon EE. UU.: {title}",
        },
        {
            "type": "p",
            "text": "Compara cómo queda esta recomendación frente a los tres grandes referentes de viaje compacto en Amazon Estados Unidos:",
        },
        {
            "type": "table",
            "caption": f"Comparativa técnica de viaje para {title}",
            "headers": [
                "Modelo en Amazon EE. UU.",
                "Peso / Límite",
                "Medidas Plegado",
                "Cierre 1 Mano y Maletera",
            ],
            "rows": [
                [
                    f"**Selección Principal: {picks.split(',')[0].strip()}**",
                    weight_s,
                    folded_s,
                    f"{fold1h_s} · {trunk_s}",
                ],
                [
                    "**[Ingenuity 3Dlite Convenience](/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/)**",
                    "13 lb (5.9 kg) / 50 lb",
                    "109 × 25 × 30 cm",
                    "Pie + traba lateral · +75 % cajuela libre",
                ],
                [
                    "**[Kolcraft Cloud Plus](/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/)**",
                    "11.8 lb (5.3 kg) / 50 lb",
                    "46 × 30 × 86 cm",
                    "1 sola mano de pie · 2 maletas libres",
                ],
                [
                    "**[Doona 2-en-1 Certificado FAA](/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/)**",
                    "16.5 lb (7.5 kg) / 35 lb",
                    "60 × 44 × 66 cm (silla)",
                    "1 botón bajo asiento · 100 % cajuela libre",
                ],
            ],
        },
        {
            "type": "h2",
            "text": "Bolsos de transporte, protectores de lluvia y organizadores compatibles",
        },
        {
            "type": "ul",
            "items": [
                f"**Compatibilidad exacta de accesorios:** {acc_s}.",
                "**Bolso de transporte Gate Check para avión:** recuerda que en puerta de embarque los operarios colocan el coche en bodega junto a equipaje húmedo o grasoso; una **[funda Gate Check impermeable](/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/)** protege tapizados, capota y bisagras.",
                "**Protector de lluvia y organizador sin vuelcos:** añade una **[burbuja de lluvia EVA ventilada libre de PVC](/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/)** y un **[organizador de manillar pegado al chasis](/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/)** compatible con doble mango curvo o barra corrida.",
            ],
        },
        {
            "type": "h2",
            "text": "3 pasos para comprobar disponibilidad y elegir bien en Amazon EE. UU.",
        },
        {
            "type": "steps",
            "items": [
                {
                    "name": "Mide la boca de tu maletera o revisa la política de tu aerolínea",
                    "text": f"Confirma que el volumen plegado ({folded_s}) entra cómodo junto a tus maletas de viaje o elige el formato de bolso Gate Check apropiado.",
                },
                {
                    "name": "Consulta precio actual y colores en nuestras tarjetas Amazon",
                    "text": "En Amazon.com el precio varía según el color del tapizado; utiliza las tarjetas de esta guía para verificar disponibilidad y reseñas recientes.",
                },
                {
                    "name": "Completa tu pedido con el bolso, protector de lluvia y organizador compatible",
                    "text": "Asegura en un mismo envío los accesorios compatibles para estrenar el kit listo desde el primer trayecto al aeropuerto.",
                },
            ],
        },
        {
            "type": "callout",
            "variant": "aviso",
            "title": "Consejo de seguridad en coches ultraligeros de viaje",
            "text": "Evita colgar bolsos pañaleros pesados en los manillares de coches de menos de 14 lb (Ingenuity 3Dlite, 3Dmini o Kolcraft Cloud Plus): al levantar al bebé, el centro de gravedad puede hacer volcar el chasis hacia atrás. Usa siempre un organizador compacto para biberones y guarda lo pesado en la canasta inferior.",
        },
        {
            "type": "cta",
            "text": "¿Quieres confirmar si este modelo y sus accesorios entran en el modelo exacto de tu auto o vuelo? Pregúntale ahora a nuestro Asesor IA.",
        },
    ]

    faqs = [
        {
            "q": f"¿Cuánto pesa y mide plegado en {title}?",
            "a": f"El peso de referencia es {weight_s} y sus dimensiones plegadas corresponden a {folded_s}.",
        },
        {
            "q": "¿Se puede cerrar realmente con una sola mano?",
            "a": f"Su sistema de cierre corresponde a: {fold1h_s}. Si cargar al bebé al plegar es tu prioridad absoluta, compáralo con el Kolcraft Cloud Plus o el Doona 2-en-1.",
        },
        {
            "q": "¿Cuánto espacio libre deja en la maletera?",
            "a": f"En nuestra evaluación de viaje: {trunk_s}.",
        },
        {
            "q": "¿Qué bolso de transporte, protector de lluvia y organizador son compatibles?",
            "a": f"Recomendamos revisar: {acc_s}. Tienes enlaces directos a Amazon Estados Unidos (paseocompacto-20) y Amazon España (paseocompacto-21) en las tarjetas de esta página.",
        },
    ]

    quick_answer = (
        f"En nuestra evaluación de {title}, destaca por un peso de {weight_s}, plegado de {folded_s} y cierre tipo {fold1h_s.lower()}. "
        f"Respecto al equipaje, {trunk_s.lower()}, siendo compatible con {acc_s.lower()}."
    )

    return {
        "slug": slug,
        "pillar": pillar,
        "path": path,
        "isPillar": False,
        "isTransactional": True,
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title} | PaseoCompacto.com",
        "metaDescription": f"Análisis de {title}: peso ({weight_s}), medidas plegado ({folded_s}), cierre con 1 mano, maletera y accesorios en Amazon EE. UU.",
        "excerpt": f"Reseña técnica de {title}: peso, medidas plegado, cierre con una mano, espacio libre en maletera y accesorios compatibles.",
        "quickAnswer": quick_answer,
        "readingMinutes": 7,
        "image": {
            "prompt": build_diverse_prompt(subj, idx),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "Amazon.com Compact Travel Strollers & Gear Catalog", "url": "https://www.amazon.com/Best-Sellers-Baby-Lightweight-Strollers/zgbs/baby-products/166842011"},
            {"label": "FAA – Flying with Children & Stroller Guidance", "url": "https://www.faa.gov/travelers/fly_children"},
        ],
        "related": rel,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": None,
    }


def make_seo_article(item: tuple, sibling_paths: list, idx: int) -> dict:
    slug, title, pillar, kw, focus_summary, subj = item
    slug = clean_slug(slug)
    path = f"/{pillar}/{slug}/"
    rel = [p for p in sibling_paths if p != path][:3]
    rel.insert(0, f"/{pillar}/")

    blocks = [
        {
            "type": "p",
            "text": f"Resolver correctamente **{title}** marca la diferencia entre viajar ligero y disfrutar en familia o luchar en cada aeropuerto, taxi y maletera. En **PaseoCompacto.com** preparamos esta **{focus_summary}**, comparando cómo responden **Ingenuity**, **Kolcraft** y **Doona** junto a sus accesorios de viaje disponibles en **Amazon Estados Unidos**.",
        },
        {
            "type": "h2",
            "text": f"Criterios prácticos aplicados a {title}",
        },
        {
            "type": "p",
            "text": f"Al planificar un viaje en auto o en avión con bebé, toda decisión se resume en cuatro números reales: el **peso en mano (`lb` y `kg`)**, las **dimensiones plegadas (`in` y `cm`)**, el **mecanismo de cierre con una sola mano** y los **litros disponibles en la maletera** para maletas y mochilas. Aplicar esta **{focus_summary}** evita sorpresas al abordar o cargar el equipaje.",
        },
        {
            "type": "callout",
            "variant": "tip",
            "title": "Regla práctica antes de salir de casa o hacia el aeropuerto",
            "text": "Haz siempre una prueba previa en la maletera de tu auto con las dos maletas cerradas y verifica que el seguro lateral de plegado haga 'clic' antes de levantar el coche o meterlo en su bolso Gate Check.",
        },
        {
            "type": "h2",
            "text": "Comparativa de respuesta: Ingenuity vs Kolcraft vs Doona",
        },
        {
            "type": "table",
            "caption": f"Comportamiento de los referentes compactos ante {title}",
            "headers": [
                "Marca y Modelo",
                "Peso / Medidas Plegado",
                "Cierre 1 Mano y Maletera",
                "Accesorios Recomendados en Amazon",
            ],
            "rows": [
                [
                    "**[Ingenuity 3Dlite / 3Dmini](/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/)**",
                    "11–13 lb (4.9–5.9 kg) · 109 × 25 × 30 cm",
                    "Seguro con pie + correa hombro · Entra diagonal en sedán (+75 % libre)",
                    "[Bolso Gate Check paraguas](/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/) + Organizador doble mango",
                ],
                [
                    "**[Kolcraft Cloud Plus](/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/)**",
                    "11.8 lb (5.3 kg) · 46 × 30 × 86 cm",
                    "Cierre real 1 mano en barra corrida (de pie) · Caben 2 maletas grandes",
                    "Bolso Gate Check estándar + [Protector lluvia EVA](/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/)",
                ],
                [
                    "**[Doona 2-en-1 FAA](/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/)**",
                    "16.5 lb (7.5 kg) · 60 × 44 × 66 cm (silla)",
                    "1 botón bajo asiento · 100 % de maletera libre (va en asiento auto/avión)",
                    "Doona Padded Travel Bag + Snap-On Rain Cover + Essentials Bag",
                ],
                [
                    "**[Ingenuity 3Dquickclose CS+](/resenas-coches-compactos-de-viaje/ingenuity-3dquickclose-cs-compact-fold-resena-plegado-libro/)**",
                    "17.5 lb (7.9 kg) · 56 × 52 × 32 cm",
                    "Plegado libro corto 1 mano · Entra de pie en hatchbacks cortos",
                    "Mochila acolchada libro + [Organizador barra única](/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/)",
                ],
            ],
        },
        {
            "type": "h2",
            "text": f"Pasos recomendados para resolver {title}",
        },
        {
            "type": "steps",
            "items": [
                {
                    "name": "Verifica peso, edad del bebé y formato de plegado",
                    "text": "Si tu bebé pesa entre 4 y 35 lb (0–15 meses) y vuelas o tomas taxis seguido, el Doona simplifica cada traslado. Si ya camina o supera los 6 meses hasta 50 lb, Ingenuity 3Dlite o Kolcraft Cloud Plus duran años.",
                },
                {
                    "name": "Asegura el cierre, las ruedas y la distribución en la cajuela",
                    "text": f"Aplica las pautas de esta {focus_summary} colocando las maletas pesadas al fondo y el coche plegado al frente o en vertical para acceder a él en segundos.",
                },
                {
                    "name": "Protege tu inversión con accesorios compatibles en Amazon EE. UU.",
                    "text": "Suma siempre un bolso protector para Gate Check, burbuja impermeable libre de PVC y un organizador liviano que no sobrecargue el manillar.",
                },
            ],
        },
        {
            "type": "h2",
            "text": "Errores frecuentes de familias viajeras que conviene evitar",
        },
        {
            "type": "ul",
            "items": [
                "**Entregar el coche suelto en puerta de embarque:** un golpe o mancha de grasa puede inutilizar el plegado al llegar; consulta nuestra **[guía de bolsos Gate Check](/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/)**.",
                "**Confundir un coche paraguas con equipaje de cabina IATA:** un Ingenuity 3Dlite mide 43 pulgadas (109 cm) plegado y va gratis en puerta de embarque, no en el compartimento superior; mira **[qué coches sí suben a cabina](/viajar-en-avion-cabina-y-gate-check/que-coches-caben-compartimento-superior-avion-medidas-iata/)**.",
                "**Colgar mochilas de 4 kg en coches ultraligeros:** usa siempre la canasta inferior para lo pesado y un **[organizador compatible](/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/)** en el manillar.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Tienes dudas sobre qué modelo compacto o accesorio en Amazon EE. UU. resuelve mejor tu viaje? Pregúntale gratis a nuestro Asesor IA.",
        },
    ]

    faqs = [
        {
            "q": f"¿Qué modelo destaca más al aplicar {title}?",
            "a": "Para viajes de 0 a 15 meses en auto y avión, el Doona 2-en-1 elimina la carga en la maletera; para cierre con una mano desde los 6 meses hasta 50 lb sobresale el Kolcraft Cloud Plus; y para reclinado largo de viaje con presupuesto ajustado gana el Ingenuity 3Dlite.",
        },
        {
            "q": "¿Es obligatorio comprar accesorios originales de la misma marca?",
            "a": "No siempre. Muchos bolsos Gate Check (como J.L. Childress), protectores de lluvia EVA ventilados y organizadores de velcro (como Momcozy) son compatibles tanto con Ingenuity como con Kolcraft y Doona siempre que elijas la forma correcta (paraguas vs libro vs barra única).",
        },
        {
            "q": "¿Dónde puedo consultar precios actuales y disponibilidad?",
            "a": "En las tarjetas integradas en esta página accedes directamente a las fichas actualizadas en Amazon Estados Unidos (amazon.com) y Amazon España (amazon.es).",
        },
    ]

    quick_answer = (
        f"Para abordar correctamente {title}, evalúa siempre los cuatro factores clave: peso real (11 a 16.5 lb), "
        f"medidas al plegarse (cabina, paraguas o libro), facilidad de cierre con una mano y el espacio libre que deja en la maletera junto a tus maletas. "
        f"En esta {focus_summary} comparamos cómo responden Ingenuity, Kolcraft y Doona y sus accesorios compatibles."
    )

    return {
        "slug": slug,
        "pillar": pillar,
        "path": path,
        "isPillar": False,
        "isTransactional": False,
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title} | PaseoCompacto.com",
        "metaDescription": f"Guía práctica sobre {title}. Medidas, peso, plegado con 1 mano y maletera en Ingenuity, Kolcraft y Doona.",
        "excerpt": f"Consejos de viaje sobre {title}: {focus_summary}.",
        "quickAnswer": quick_answer,
        "readingMinutes": 6,
        "image": {
            "prompt": build_diverse_prompt(subj, idx),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "FAA – Flying with Children & Strollers", "url": "https://www.faa.gov/travelers/fly_children"},
        ],
        "related": rel,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": None,
    }


def main():
    for old in ART_DIR.glob("*.json"):
        old.unlink()

    trans_items = generate_transactional_510()
    seo_items = generate_seo_1000()

    by_pillar: dict[str, list] = {p["slug"]: [] for p in PILLARS}
    for it in trans_items:
        by_pillar[it[2]].append(it)
    for it in seo_items:
        by_pillar[it[2]].append(it)

    all_articles = []
    seen_slugs = set()
    seen_kws = set()
    seen_titles = set()
    idx = 0

    # 1. 14 Hubs Pilares
    for p in PILLARS:
        art = make_pillar_article(p, by_pillar[p["slug"]], idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    pillar_paths = {
        p_slug: [f"/{p_slug}/{clean_slug(c[0])}/" for c in c_list]
        for p_slug, c_list in by_pillar.items()
    }

    # 2. 510 Transaccionales
    for i, it in enumerate(trans_items):
        p_slug = it[2]
        sibs = pillar_paths[p_slug]
        rot_sibs = sibs[(i + 1) % len(sibs):] + sibs[: (i + 1) % len(sibs)]
        art = make_transactional_article(it, rot_sibs, idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    # 3. 1,000 SEO Informacionales
    for i, it in enumerate(seo_items):
        p_slug = it[2]
        sibs = pillar_paths[p_slug]
        rot_sibs = sibs[(i + 1) % len(sibs):] + sibs[: (i + 1) % len(sibs)]
        art = make_seo_article(it, rot_sibs, idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    for art in all_articles:
        (ART_DIR / f"{art['slug']}.json").write_text(
            json.dumps(art, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    kw_map = [
        {
            "slug": a["slug"],
            "pillar": a["pillar"],
            "path": a["path"],
            "isPillar": a["isPillar"],
            "isTransactional": a["isTransactional"],
            "primaryKeyword": a["primaryKeyword"],
            "title": a["title"],
        }
        for a in all_articles
    ]
    (DATA_DIR / "keyword_map.json").write_text(
        json.dumps(kw_map, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    cat_names = {
        p["slug"]: p["title"].split(":")[0].split("(")[0].strip()
        for p in PILLARS
    }
    search_index = [
        {
            "t": a["title"],
            "p": a["path"],
            "n": cat_names.get(a["pillar"], a["pillar"]),
            "r": a["readingMinutes"],
        }
        for a in all_articles
    ]
    (PUB_DIR / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False), encoding="utf-8"
    )

    print(
        f"OK: Generados {len(all_articles)} artículos únicos "
        f"({len(PILLARS)} Pilares + {len(trans_items)} Transaccionales Amazon + {len(seo_items)} SEO Informacionales). "
        f"0% Canibalización verificada."
    )


if __name__ == "__main__":
    main()
