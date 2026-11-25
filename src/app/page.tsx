import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientEffects from "@/components/ClientEffects";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import { JsonLd } from "@/components/Breadcrumbs";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import TrunkAndFoldAnatomySvg from "@/components/home/TrunkAndFoldAnatomySvg";
import StrollerCompatibilityOrbit, {
  type OrbitItem,
} from "@/components/home/StrollerCompatibilityOrbit";
import MetricsCounters, {
  type MetricItem,
} from "@/components/home/MetricsCounters";
import TravelModeComparisonSlider from "@/components/home/TravelModeComparisonSlider";
import MomentsCarousel, {
  type Moment,
} from "@/components/home/MomentsCarousel";
import StrollerFinderBlock, {
  type StrollerTier,
} from "@/components/home/StrollerFinderBlock";
import { getContextualAmazonProducts } from "@/lib/amazon";
import {
  SITE_URL,
  OG_DEFAULT,
  STROLLERS_DISCLAIMER,
  ambient,
  getAllContent,
  getArticlesIn,
  getByPath,
  getCategories,
  safeHref,
  type Article,
} from "@/lib/content";

export const metadata: Metadata = {
  title:
    "PaseoCompacto.com: Coches de Bebé Compactos para Viajar (Ingenuity, Kolcraft y Doona) en Amazon EE. UU.",
  description:
    "Guía en español para elegir el coche de bebé compacto ideal para viajar. Compara modelos de Ingenuity, Kolcraft y Doona según su peso, medidas al plegarse, cierre con una mano y espacio en la maletera, más bolsos de transporte, protectores de lluvia y organizadores en Amazon Estados Unidos.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title:
      "PaseoCompacto.com: Guía de Coches Compactos de Viaje y Accesorios en Amazon EE. UU.",
    description:
      "Compara Ingenuity 3Dlite, Kolcraft Cloud Plus y Doona por peso, medidas plegado, cierre con 1 mano y litros libres en maletera.",
    images: [
      {
        url: OG_DEFAULT(),
        width: 1200,
        height: 675,
        alt: "PaseoCompacto.com – Guía en español de coches compactos para viajar",
      },
    ],
  },
};

const FAQ = [
  {
    q: "¿Qué conviene más para viajar: Ingenuity 3Dlite, Kolcraft Cloud Plus o Doona?",
    a: "Depende de la edad de tu bebé y tu forma de viajar: el Doona es insuperable de 0 a 12 meses porque es silla de auto FAA + coche en una sola pieza y deja 100 % de la maletera libre. El Kolcraft Cloud Plus (11.8 lb) es el rey del cierre verdadero con una sola mano y se sostiene de pie junto a las maletas. Y el Ingenuity 3Dlite (13 lb) ofrece reclinado más largo de 4 posiciones y correa al hombro hasta las 50 lb.",
  },
  {
    q: "¿Caben los coches compactos en el compartimento superior del avión (Overhead Bin)?",
    a: "Solo los coches con plegado tríptico ultracompacto tipo mochila (como el gb Pockit+ de 34 × 20 × 42 cm o el YOYO) cumplen siempre las medidas de equipaje de cabina (55 × 40 × 20 cm). Los coches paraguas alargados (Ingenuity 3Dlite / 3Dmini) y el Kolcraft Cloud Plus se entregan gratis en la puerta del avión (Gate Check), preferiblemente protegidos con un bolso de transporte.",
  },
  {
    q: "¿Cuánto espacio libre dejan en la maletera de un sedán o hatchback?",
    a: "Un coche pesado de sistema tradicional ocupa entre 190 y 240 litros de la maletera. En cambio, un Ingenuity 3Dlite o 3Dmini ocupa apenas unos 65–82 litros en diagonal dejando espacio para 2 maletas grandes, el Kolcraft Cloud Plus se apoya vertical ocupando una esquina, y el Doona va en el asiento trasero dejando toda la maletera vacía.",
  },
  {
    q: "¿Cuál se cierra realmente con una sola mano sosteniendo al bebé?",
    a: "El Kolcraft Cloud Plus y el Ingenuity 3Dquickclose CS+ incorporan mecanismo real de cierre con una mano desde el manillar o asiento, mientras que el Doona retrae las ruedas en un segundo apretando un botón. En cambio, los modelos paraguas como el Ingenuity 3Dlite y 3Dmini requieren presionar un seguro trasero con el pie antes de plegar el chasis.",
  },
  {
    q: "¿Qué bolso de transporte, protector de lluvia y organizador son compatibles con cada modelo?",
    a: "Los coches paraguas con doble manillar curvo (Ingenuity 3Dlite y 3Dmini) necesitan bolsos Gate Check alargados (43\") y organizadores de correas flexibles; los coches de barra corrida (Kolcraft Cloud Plus y Doona) usan fundas anchas o mochilas acolchadas cuadradas, portavasos rígidos o bandejas integradas y burbujas EVA ventiladas acordes a su capota.",
  },
  {
    q: "¿Hasta qué edad o peso aguanta un coche compacto de viaje?",
    a: "El Doona está limitado por normativa de silla infantil hasta 35 lb (15.8 kg) o 32 pulgadas de estatura (~12–15 meses). Por su parte, tanto el Ingenuity 3Dlite como el Kolcraft Cloud Plus y el Ingenuity 3Dquickclose resisten hasta 50 lb (22.6 kg), cubriendo perfectamente hasta los 3 a 4 años de edad.",
  },
  {
    q: "¿Por qué consultar precios y disponibilidad en Amazon Estados Unidos?",
    a: "Amazon EE. UU. (amazon.com) concentra el catálogo más amplio y con mejores precios en dólares de Ingenuity, Kolcraft, Doona, fundas J.L. Childress, burbujas EVA libres de PVC y organizadores universales, con envío a hoteles en EE. UU., casilleros y envíos internacionales AmazonGlobal.",
  },
];

const CLAIMS = [
  "Ingenuity 3Dlite (13 lb)",
  "Kolcraft Cloud Plus (11.8 lb)",
  "Doona 2-en-1 Certificado FAA",
  "Ingenuity 3Dmini & 3Dquickclose",
  "Cierre Real con 1 Sola Mano",
  "Espacio Libre en Maletera",
  "Bolsos Gate Check Compatibles",
  "Enlaces Verificados en Amazon EE. UU.",
];

const CLAIMS_2 = [
  "Peso en lb y kg",
  "Medidas Plegado cm y in",
  "Protectores de Lluvia EVA",
  "Organizadores de Manillar",
  "Cabina IATA vs Gate Check",
  "Maletera Sedán y Hatchback",
  "Recién Nacido hasta 50 lb",
  "Guía 100 % en Español",
];

const ICONS: Record<string, string> = {
  stroller: "🍼",
  scale: "⚖️",
  car: "🚗",
  bag: "🎒",
  rain: "🌧️",
  organizer: "🥤",
  plane: "✈️",
  trunk: "🧳",
  fold: "✋",
  baby: "👶",
  shield: "🛡️",
  wrench: "🔧",
  map: "🗺️",
  box: "📦",
};

export default function Home() {
  const cats = getCategories();
  const all = getAllContent();
  const amzHome = getContextualAmazonProducts(
    "home",
    "resenas-coches-compactos-de-viaje",
    "Mejores Coches Compactos de Viaje y Accesorios en Amazon EE. UU."
  );

  const orbit: OrbitItem[] = [
    {
      k: "ingenuity3dlite",
      name: "Ingenuity 3Dlite",
      img: null,
      icon: "🏆",
      role: "13 lb (5.9 kg) · Reclinado 4 Posiciones · Hasta 50 lb",
      d: "Chasis de aluminio ligero con correa de hombro integrada, plegado 3D (109 × 25 × 30 cm) y canasta amplia. Uno de los modelos más equilibrados para viajes familiares en Amazon EE. UU.",
      href: safeHref(
        "/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/"
      ),
    },
    {
      k: "kolcraftcloud",
      name: "Kolcraft Cloud Plus",
      img: null,
      icon: "✋",
      role: "11.8 lb (5.3 kg) · Cierre 1 Mano de Pie · Doble Bandeja",
      d: "Verdadero cierre con una sola mano desde el manillar (46 × 30 × 86 cm), se mantiene de pie sin tocar el suelo y deja sitio para dos maletas grandes en la maletera.",
      href: safeHref(
        "/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/"
      ),
    },
    {
      k: "doona",
      name: "Doona 2-en-1 FAA",
      img: null,
      icon: "✈️",
      role: "Silla de Auto + Coche · 0 % Maletera · Bebés 4–35 lb",
      d: "Certificado FAA para viajar en el asiento del avión y desplegar ruedas en 1 segundo al bajar al taxi. Deja el 100 % de la cajuela disponible para el equipaje.",
      href: safeHref(
        "/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/"
      ),
    },
    {
      k: "ingenuity3dmini",
      name: "Ingenuity 3Dmini & CS+",
      img: null,
      icon: "🪶",
      role: "11 lb Económico o Plegado Libro Cuadrado 56 cm",
      d: "El 3Dmini (4.9 kg) domina en presupuesto y taxis; el 3Dquickclose CS+ pliega en libro cuadrado con una mano para maleteras cortas de hatchback.",
      href: safeHref(
        "/resenas-coches-compactos-de-viaje/ingenuity-3dmini-convenience-stroller-resena-viaje-economico/"
      ),
    },
    {
      k: "bolsos",
      name: "Bolsos Gate Check",
      img: null,
      icon: "🎒",
      role: "Fundas Impermeables Paraguas, Libro y Mochila Doona",
      d: "Evita raspones, grasa de cinta transportadora y lluvia en puerta de embarque. Incluye versiones exactas para plegado alargado y tipo mochila.",
      href: safeHref(
        "/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/"
      ),
    },
    {
      k: "lluvia",
      name: "Protectores de Lluvia",
      img: null,
      icon: "🌧️",
      role: "Burbujas Transparentes EVA sin PVC + Malla Ventilada",
      d: "Ajuste rápido con velcro y ventana frontal con doble cierre para que el bebé respire cómodo sin quitar la cubierta bajo lluvia o viento.",
      href: safeHref(
        "/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/"
      ),
    },
    {
      k: "organizadores",
      name: "Organizadores Manillar",
      img: null,
      icon: "🥤",
      role: "Doble Manillar (Ingenuity) vs Barra Corrida (Kolcraft)",
      d: "Portavasos térmicos y bolsillo desmontable con correas antideslizantes pegadas al chasis para no volcar coches ultraligeros.",
      href: safeHref(
        "/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/"
      ),
    },
    {
      k: "cabina",
      name: "Cabina IATA (Overhead)",
      img: null,
      icon: "🧳",
      role: "Medidas 34 × 20 × 42 cm · Sube al Avión Contigo",
      d: "Modelos trípticos como gb Pockit+ y YOYO3 que entran en el compartimento superior del avión y bajo el asiento delantero del auto.",
      href: safeHref(
        "/viajar-en-avion-cabina-y-gate-check/que-coches-caben-compartimento-superior-avion-medidas-iata/"
      ),
    },
  ];

  const metrics: MetricItem[] = [
    {
      v: 1524,
      dec: 0,
      u: "guías",
      l: "1,000 SEO + 510 Amazon",
      pct: 100,
      note: "Arquitectura 0 % canibalización",
    },
    {
      v: 11.8,
      dec: 1,
      u: "lb",
      l: "Peso Kolcraft Cloud Plus",
      pct: 94,
      note: "Equivale a solo 5.3 kg",
    },
    {
      v: 13.0,
      dec: 1,
      u: "lb",
      l: "Peso Ingenuity 3Dlite",
      pct: 90,
      note: "5.9 kg · Soporta hasta 50 lb",
    },
    {
      v: 1,
      dec: 0,
      u: "seg",
      l: "Despliegue Doona / 1 Mano",
      pct: 100,
      note: "Botón FAA o palanca en manillar",
    },
    {
      v: 75,
      dec: 0,
      u: "%+",
      l: "Maletera Libre para Equipaje",
      pct: 88,
      note: "Espacio real para 2 maletas 23 kg",
    },
    {
      v: 100,
      dec: 0,
      u: "%",
      l: "Accesorios Compatibles",
      pct: 100,
      note: "Bolsos, lluvia y organizadores",
    },
  ];

  const moments: Moment[] = [
    {
      img: ambient("home-maletera-sedan"),
      t: "En la maletera del auto",
      d: "Cómo acomodar Ingenuity, Kolcraft o Doona junto a maletas de 23 kg en un sedán o hatchback.",
      href: safeHref(
        "/espacio-en-maletera-y-viajes-en-auto/como-meter-coche-compacto-y-dos-maletas-maletera-sedan/"
      ),
      alt: "Coche compacto plegado dentro de la maletera de un automóvil junto a dos maletas de viaje",
    },
    {
      img: ambient("home-gate-check"),
      t: "Puerta de embarque",
      d: "Protege el chasis y las ruedas en Gate Check con el bolso impermeable correcto.",
      href: safeHref(
        "/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/"
      ),
      alt: "Familia guardando coche compacto en bolso rojo Gate Check antes de abordar el avión",
    },
    {
      img: ambient("home-plegado-una-mano"),
      t: "Cierre con una mano",
      d: "Cómo cerrar el coche en 1 segundo mientras sostienes a tu bebé en brazos al subir al taxi.",
      href: safeHref(
        "/guias-de-plegado-peso-y-medidas/como-cerrar-coche-bebe-con-una-sola-mano-mientras-cargas-bebe/"
      ),
      alt: "Madre plegando un coche de bebé compacto con una sola mano sosteniendo al bebé",
    },
    {
      img: ambient("home-doona-asiento"),
      t: "Doona en auto y avión",
      d: "Silla de auto certificada FAA que deja el 100 % de la maletera libre en vacaciones.",
      href: safeHref(
        "/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/"
      ),
      alt: "Coche silla 2 en 1 instalado en asiento trasero de automóvil dejando maletera libre",
    },
    {
      img: ambient("home-lluvia-paseo"),
      t: "Lluvia y viento en viaje",
      d: "Protector transparente libre de PVC con malla lateral para pasear seco sin empañar.",
      href: safeHref(
        "/protectores-de-lluvia-y-clima/mejores-protectores-de-lluvia-compatibles-ingenuity-kolcraft-doona/"
      ),
      alt: "Coche de bebé compacto con burbuja protectora de lluvia transparente en ciudad",
    },
    {
      img: ambient("home-organizador-manillar"),
      t: "Organizador sin vuelcos",
      d: "Modelos compatibles con doble manillar curvo vs barra corrida única sin perder equilibrio.",
      href: safeHref(
        "/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/"
      ),
      alt: "Organizador de manillar con dos portavasos térmicos y bolsillo instalado en coche compacto",
    },
    {
      img: ambient("home-cabina-avion"),
      t: "Cabina aérea IATA",
      d: "Qué modelos ultracompactos suben contigo al compartimento superior sin pasar por bodega.",
      href: safeHref(
        "/viajar-en-avion-cabina-y-gate-check/que-coches-caben-compartimento-superior-avion-medidas-iata/"
      ),
      alt: "Viajero colocando coche ultracompacto plegado dentro del compartimento superior del avión",
    },
  ];

  const POPULAR_PATHS = [
    "/comparativas-coches-de-bebe/ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje/",
    "/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/",
    "/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/",
    "/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/",
    "/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/",
    "/organizadores-y-accesorios-compatibles/mejores-organizadores-manillar-compatibles-ingenuity-kolcraft-doona/",
  ];
  const popular: Article[] = POPULAR_PATHS.map((p) => getByPath(p)).filter(
    Boolean
  ) as Article[];
  for (const a of all) {
    if (popular.length >= 6) break;
    if (!a.isPillar && !popular.includes(a)) popular.push(a);
  }

  const finderOptions: StrollerTier[] = [
    {
      key: "ingenuity",
      label: "🏆 Ingenuity 3Dlite",
      weightSpec: "13 lb (5.9 kg) · Hasta 50 lb",
      foldSpec: "109 × 25 × 30 cm · Correa al hombro",
      trunkSpec: "Deja +75 % maletera libre (diagonal/fondo)",
      img: ambient("home-hero-viaje"),
      alt: "Ingenuity 3Dlite plegado junto a equipaje de viaje",
      idealFor:
        "Familias que buscan el mejor equilibrio precio-reclinado para siestas en vuelos y paseos de 6 meses a 4 años.",
      reviewHref: safeHref(
        "/resenas-coches-compactos-de-viaje/ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera/"
      ),
      productKey: "INGENUITY_3DLITE",
    },
    {
      key: "kolcraft",
      label: "✋ Kolcraft Cloud Plus",
      weightSpec: "11.8 lb (5.3 kg) · Hasta 50 lb",
      foldSpec: "46 × 30 × 86 cm · Cierre 1 mano de pie",
      trunkSpec: "Deja espacio para 2 maletas grandes de 23 kg",
      img: ambient("home-plegado-una-mano"),
      alt: "Kolcraft Cloud Plus cerrado con una sola mano manteniéndose de pie",
      idealFor:
        "Padres que viajan solos o suben rápido a Uber/taxi y necesitan cerrar el coche en 1 segundo sosteniendo al bebé.",
      reviewHref: safeHref(
        "/resenas-coches-compactos-de-viaje/kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano/"
      ),
      productKey: "KOLCRAFT_CLOUD_PLUS",
    },
    {
      key: "doona",
      label: "✈️ Doona 2-en-1 FAA",
      weightSpec: "16.5 lb (7.5 kg) · 4 a 35 lb",
      foldSpec: "60 × 44 × 66 cm · 1 botón en silla",
      trunkSpec: "100 % de la maletera libre (va en el asiento)",
      img: ambient("home-doona-asiento"),
      alt: "Doona silla de auto y coche integrado instalado en automóvil",
      idealFor:
        "Recién nacidos y bebés de 0 a 15 meses que vuelan en avión (silla certificada FAA) y hacen traslados sin despertar al bebé.",
      reviewHref: safeHref(
        "/resenas-coches-compactos-de-viaje/doona-car-seat-stroller-2-en-1-avion-faa-resena-completa/"
      ),
      productKey: "DOONA_CAR_SEAT_STROLLER",
    },
    {
      key: "kit",
      label: "🎒 Kit Protección Viaje",
      weightSpec: "Bolso + Lluvia EVA + Organizador",
      foldSpec: "Compatibles paraguas, libro y Doona",
      trunkSpec: "Cero manchas de ruedas ni raspones en bodega",
      img: ambient("home-gate-check"),
      alt: "Bolso de transporte Gate Check, protector de lluvia y organizador de manillar",
      idealFor:
        "Proteger tu coche en puerta de embarque (Gate Check), pasear bajo lluvia y llevar biberones y pasaportes a mano.",
      reviewHref: safeHref(
        "/bolsos-de-transporte-y-fundas-avion/mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona/"
      ),
      productKey: "BAG_GATE_CHECK_TRAVEL",
    },
  ];

  return (
    <>
      <ReadingProgress />
      <Header variant="dark" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/#webpage`,
              url: `${SITE_URL}/`,
              name: "PaseoCompacto.com — Guía de Coches Compactos de Viaje en Amazon EE. UU.",
              inLanguage: "es",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              primaryImageOfPage: `${SITE_URL}${ambient("home-hero-viaje")}`,
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <main>
        {/* 1–2. Hero 3D Tilt + Partículas + Buscador sobre 1,524 Guías */}
        <Hero heroImage={ambient("home-hero-viaje")} />

        {/* 3. Doble Cinta Marquee en Sentidos Opuestos */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-lg font-bold text-fxink/85"
                aria-hidden={k === 1}
              >
                {CLAIMS.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-fxlime to-prune" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-sm font-semibold uppercase tracking-[0.14em] text-prunedeep/85"
              >
                {CLAIMS_2.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-fxblue" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Los 4 criterios técnicos + Mosaico Spotlight (.spot) */}
        <section id="criterios" className="wrap py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Guía de Movilidad Familiar sin Complicaciones
              </span>
              <SplitHeading
                text="Compara cada coche compacto por"
                accent={{
                  text: "sus 4 medidas reales",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                No todos los coches &ldquo;ligeros&rdquo; entran igual en una
                maletera o se pliegan con un bebé en brazos. En{" "}
                <strong className="text-fxink">PaseoCompacto.com</strong>{" "}
                contrastamos los superventas de{" "}
                <strong className="text-fxink">
                  Ingenuity, Kolcraft y Doona
                </strong>{" "}
                disponibles en{" "}
                <strong className="text-fxink">Amazon Estados Unidos</strong>{" "}
                con sus accesorios exactos.
              </p>
              <div
                className="mt-6 rounded-2xl border border-teal-300/70 bg-teal-50/80 p-5"
                data-reveal
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-900">
                  ✈️ Regla de oro antes de comprar coche y accesorios
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95rem] text-fxink">
                  <li>
                    • <strong>Doble mango vs barra corrida:</strong> decide qué
                    organizador y qué cierre con una mano puedes usar.
                  </li>
                  <li>
                    • <strong>Plegado paraguas vs libro:</strong> el largo de
                    43&quot; va en diagonal; el libro de 22&quot; va de pie.
                  </li>
                  <li>
                    • <strong>Gate Check protegido:</strong> una funda
                    impermeable evita perder ruedas o manchar la capota en la
                    bodega del avión.
                  </li>
                </ul>
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/bolsos-de-transporte-y-fundas-avion/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  🎒 Bolsos de Transporte
                </Link>
                <Link
                  href="/protectores-de-lluvia-y-clima/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  🌧️ Protectores de Lluvia
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(15,23,42,0.6)]"
                data-reveal
              >
                <Image
                  src={ambient("og-default")}
                  alt="Comparativa visual de coches compactos Ingenuity, Kolcraft y Doona junto a equipaje de mano y accesorios de viaje"
                  fill
                  sizes="(max-width:1024px) 100vw, 600px"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-fxink">
                  Ingenuity · Kolcraft · Doona · Accesorios Amazon EE. UU.
                </span>
              </div>
              {[
                [
                  "⚖️",
                  "Peso Real (lb / kg)",
                  "Desde 9.5–11.8 lb (Kolcraft / 3Dmini) hasta 16.5 lb (Doona).",
                ],
                [
                  "📏",
                  "Medidas al Plegarse",
                  "Longitud, grosor y si cabe en cabina IATA o solo en maletera.",
                ],
                [
                  "✋",
                  "Cierre con Una Mano",
                  "Mecanismo real en manillar de 1 segundo vs traba trasera de pie.",
                ],
                [
                  "🚗",
                  "Espacio en Maletera",
                  "Litros libres reales junto a maletas de 23 kg en sedán y SUV.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden>
                    {e}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ScrollStory Fijada con GSAP ScrollTrigger */}
        <ScrollStory />

        {/* 6. Diagrama Técnico Oscuro + SVG Animado */}
        <section className="relative isolate overflow-hidden bg-[#090e1a] py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-prune/22 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-fxblue/25 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-teal-300" data-reveal>
                Geometría Real de Maletera y Cabina
              </span>
              <SplitHeading
                text="Paraguas 3D vs Libro vs 2-en-1:"
                accent={{
                  text: "cómo encaja en tu viaje",
                  className: "text-gradient",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-white/75" data-reveal>
                No basta leer &ldquo;ultraligero&rdquo; en la caja. Un{" "}
                <strong className="text-white">Ingenuity 3Dlite</strong> mide
                109 cm plegado a lo largo pero es delgadísimo; un{" "}
                <strong className="text-amber-300">Kolcraft Cloud Plus</strong>{" "}
                se sostiene de pie con 1 mano (86 cm); y un{" "}
                <strong className="text-teal-300">Doona</strong> viaja en el
                asiento dejando la maletera vacía para todo tu equipaje.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["109×25 cm", "Perfil 3D Ingenuity"],
                  ["1 Mano", "Kolcraft de Pie"],
                  ["0 Litros", "Doona en Asiento"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="font-display text-lg font-extrabold text-fxlime">
                      {e}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white/80">
                      {t}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href={safeHref(
                    "/comparativas-coches-de-bebe/ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje/"
                  )}
                  className="btn btn-glass"
                  data-magnetic
                >
                  Ingenuity 3Dlite vs Kolcraft Cloud Plus
                </Link>
                <Link
                  href={safeHref(
                    "/viajar-en-avion-cabina-y-gate-check/que-coches-caben-compartimento-superior-avion-medidas-iata/"
                  )}
                  className="btn btn-glass"
                  data-magnetic
                >
                  Medidas de cabina aérea IATA
                </Link>
              </div>
            </div>
            <div data-reveal>
              <TrunkAndFoldAnatomySvg />
            </div>
          </div>
        </section>

        {/* 7. Órbita Interactiva de 8 Nodos */}
        <section className="wrap py-24">
          <StrollerCompatibilityOrbit
            items={orbit}
            center={ambient("home-organizador-manillar")}
          />
        </section>

        {/* 8. Contadores Animados + Tabla Maestra Comparativa */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#090e1a] via-[#0f172a] to-[#132a2e] py-24 text-white">
          <div className="hero-aurora opacity-35" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="eyebrow !text-teal-300" data-reveal>
                Cifras verificadas antes de viajar
              </span>
              <SplitHeading
                text="Ingenuity, Kolcraft y Doona,"
                accent={{ text: "medida por medida", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-4 max-w-xl text-white/75" data-reveal>
                Comparamos especificaciones reales publicadas y probadas en
                Amazon EE. UU. para que sepas con certeza el peso al subir
                escaleras, si cierra con una mano y cuánto equipaje entra en tu
                maletera.
              </p>
              <div className="mt-8">
                <MetricsCounters data={metrics} />
              </div>
            </div>

            <div
              className="overflow-hidden rounded-3xl bg-white p-5 text-slate-900 shadow-2xl"
              data-reveal
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-prunedeep">
                Tabla Rápida Comparativa · Amazon EE. UU.
              </p>
              <h3 className="mt-1 font-display text-xl font-extrabold">
                Peso, Plegado, 1 Mano y Maletera por Modelo
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-display font-bold">
                      <th className="p-2.5">Modelo</th>
                      <th className="p-2.5">Peso / Límite</th>
                      <th className="p-2.5">Plegado (cm)</th>
                      <th className="p-2.5">1 Mano</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold">Ingenuity 3Dlite</td>
                      <td className="p-2.5">13 lb / 50 lb</td>
                      <td className="p-2.5">109 × 25 × 30</td>
                      <td className="p-2.5">Pie + Lateral</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Kolcraft Cloud Plus</td>
                      <td className="p-2.5">11.8 lb / 50 lb</td>
                      <td className="p-2.5">46 × 30 × 86</td>
                      <td className="p-2.5 text-teal-800 font-bold">✓ Real 1 Mano</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Doona 2-en-1 FAA</td>
                      <td className="p-2.5">16.5 lb / 35 lb</td>
                      <td className="p-2.5">60 × 44 × 66</td>
                      <td className="p-2.5 text-teal-800 font-bold">✓ 1 Botón</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Ingenuity 3Dmini</td>
                      <td className="p-2.5">11.0 lb / 45 lb</td>
                      <td className="p-2.5">109 × 24 × 27</td>
                      <td className="p-2.5">Pie + Lateral</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Ingenuity 3Dquickclose</td>
                      <td className="p-2.5">17.5 lb / 50 lb</td>
                      <td className="p-2.5">56 × 52 × 32</td>
                      <td className="p-2.5 text-teal-800 font-bold">✓ Real 1 Mano</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link
                href={safeHref(
                  "/comparativas-coches-de-bebe/ingenuity-3dlite-vs-kolcraft-cloud-plus-vs-doona-cual-elegir/"
                )}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 font-display text-xs font-extrabold text-amber-300 hover:bg-slate-800 transition"
              >
                Ver comparativa completa Ingenuity vs Kolcraft vs Doona →
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Comparador Deslizante: Coche Tradicional Pesado ↔ Paseo Compacto */}
        <section className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                La diferencia real al viajar en familia
              </span>
              <SplitHeading
                text="Coche tradicional vs compacto de viaje:"
                accent={{
                  text: "cuánto cambia tu maletera",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-lg text-[var(--muted)]" data-reveal>
              Arrastra el control interactivo. Pasar de un coche de sistema
              pesado de 12 kg a un{" "}
              <strong className="text-fxink">
                Ingenuity, Kolcraft o Doona
              </strong>{" "}
              con su bolso Gate Check y organizador te devuelve el espacio para
              todo el equipaje.
            </p>
          </div>
          <div data-reveal>
            <TravelModeComparisonSlider />
          </div>
        </section>

        {/* 10. Carrusel 4:5 de Escenas Reales de Viaje Familiar */}
        <section className="overflow-hidden bg-fxsky py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Escenarios reales con bebé
              </span>
              <SplitHeading
                text="Cada tramo del viaje,"
                accent={{
                  text: "resuelto paso a paso",
                  className: "text-prunedeep",
                }}
                className="section-title mt-3"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Recomendador Interactivo + Calculadora de Litros en Maletera */}
        <section id="recomendador" className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Selector Interactivo Amazon EE. UU.
              </span>
              <SplitHeading
                text="Encuentra tu coche compacto ideal"
                accent={{
                  text: "y calcula tu maletera",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-[var(--muted)]" data-reveal>
              Elige entre Ingenuity 3Dlite, Kolcraft Cloud Plus, Doona 2-en-1 o
              el kit completo de protección y comprueba cuántas maletas siguen
              entrando en la cajuela de tu auto.
            </p>
          </div>
          <div data-reveal>
            <StrollerFinderBlock options={finderOptions} />
          </div>
        </section>

        {/* 12. Bento Grid Asimétrico de los 14 Silos + Vitrina Amazon + Top 6 Guías */}
        <section className="bg-gradient-to-b from-white to-fxsky py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                1,524 Guías Sin Canibalización
              </span>
              <SplitHeading
                text="Todo organizado en"
                accent={{
                  text: "14 silos especializados",
                  className: "text-prunedeep",
                }}
                className="section-title mt-3"
              />
            </div>

            <div className="grid auto-rows-[minmax(185px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
              {cats.map((c, i) => {
                const count = getArticlesIn(c.slug).length;
                const big = i === 0;
                const wide = i === 1 || i === 6 || i === 7;
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot group flex flex-col p-6 ${
                      big
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#090e1a] via-[#0f172a] to-[#0f766e] text-white md:col-span-2 lg:row-span-2"
                        : ""
                    } ${wide ? "lg:col-span-2" : ""}`}
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          big ? "bg-white/15" : "bg-fxsky"
                        }`}
                        aria-hidden
                      >
                        {ICONS[c.icon] || "🍼"}
                      </span>
                      {count > 0 && (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            big ? "text-fxlime" : "text-prunedeep"
                          }`}
                        >
                          {count} guías
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-4 font-display font-extrabold ${
                        big ? "text-3xl sm:text-4xl" : "text-xl"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        big ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {c.description}
                    </p>
                    {big && (
                      <ul className="mt-6 space-y-2 text-sm text-white/85">
                        {getArticlesIn(c.slug)
                          .slice(0, 5)
                          .map((a) => (
                            <li key={a.path} className="truncate">
                              → {a.title}
                            </li>
                          ))}
                      </ul>
                    )}
                    <span
                      className={`mt-auto pt-4 text-sm font-semibold ${
                        big ? "text-fxlime" : "text-prunedeep"
                      }`}
                    >
                      Explorar silo →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Vitrina Amazon Showcase en la Home */}
            <AmazonAffiliateBox
              variant="showcase"
              sectionTitle={amzHome.sectionTitle}
              sectionSubtitle={amzHome.sectionSubtitle}
              products={amzHome.products}
              source="home-showcase"
            />

            {popular.length > 0 && (
              <div className="mt-16">
                <h3
                  className="font-display text-2xl font-extrabold sm:text-3xl"
                  data-reveal
                >
                  Las 6 comparativas y guías de accesorios más consultadas
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {popular.slice(0, 6).map((a) => (
                    <div key={a.path} data-reveal>
                      <ArticleCard a={a} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 13. Transparencia Técnica vs Marketing Comercial */}
        <section className="wrap py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Metodología Editorial Independiente
              </span>
              <SplitHeading
                text="Medidas reales en la maletera,"
                accent={{
                  text: "sin promesas vagas de caja",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                Muchos coches se anuncian como &ldquo;compactos de avión&rdquo;,
                pero al doblarse superan los límites del compartimento superior
                o bloquean toda la cajuela. En{" "}
                <strong className="text-fxink">PaseoCompacto.com</strong>{" "}
                contrastamos dimensiones en pulgadas/centímetros y
                compatibilidad real de accesorios. En este sitio{" "}
                {STROLLERS_DISCLAIMER}.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/politica-editorial/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  Nuestra política editorial
                </Link>
                <Link
                  href="/divulgacion-de-afiliados/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  Divulgación de afiliados Amazon
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-900">
                  ✓ Lo que verificamos en cada modelo
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Peso exacto en libras y kilogramos listo para cargar</li>
                  <li>• Largo, ancho y alto plegado para cajuela o cabina IATA</li>
                  <li>• Si el cierre con 1 mano funciona con bebé en brazos</li>
                  <li>• Compatibilidad real de bolsos, lluvia y organizador</li>
                </ul>
              </div>
              <div className="card spot p-6" data-reveal data-reveal-delay="1">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                  ⚠️ Errores frecuentes que evitamos
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Despachar en avión sin bolso protector Gate Check</li>
                  <li>• Comprar organizador de barra corrida para doble mango</li>
                  <li>• Colgar pañaleras pesadas que vuelcan coches de 11 lb</li>
                  <li>• Asumir que un paraguas de 43&quot; cabe en Overhead Bin</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 14. Preguntas Frecuentes (FAQ JSON-LD) */}
        <section className="wrap pb-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas frecuentes
              </span>
              <SplitHeading
                text="Respuestas claras antes de viajar"
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                ¿Tienes dudas sobre si entra en tu auto, qué modelo elegir para
                la edad de tu bebé o qué accesorios comprar en Amazon EE. UU.?
                Nuestro Asesor IA te ayuda al instante.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Preguntar al Asesor IA"
                  className="btn btn-buy shine"
                />
                <Link
                  href="/espacio-en-maletera-y-viajes-en-auto/"
                  className="btn btn-ghost"
                >
                  Guías de maletera
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fxsky text-prunedeep transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[var(--muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CTA Final Aurora */}
        <section className="wrap pb-6">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#090e1a] via-[#0f172a] to-[#0f766e] px-6 py-14 text-white sm:px-14 sm:py-20">
            <div className="hero-grid opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="text-center lg:text-left">
                <SplitHeading
                  text="Viaja liviano con tu bebé,"
                  accent={{
                    text: "al mejor precio en Amazon EE. UU.",
                    className: "text-fxlime",
                  }}
                  className="text-3xl font-extrabold sm:text-5xl"
                />
                <p className="mt-4 text-lg text-white/85">
                  Explora nuestras 1,524 comparativas de Ingenuity, Kolcraft,
                  Doona, bolsos Gate Check, protectores de lluvia y
                  organizadores, o pregúntale gratis al Asesor IA.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link
                    href="/mejores-coches-por-viaje-y-auto/"
                    className="btn btn-lime shine text-base"
                    data-magnetic
                  >
                    Ver Mejores Coches en Amazon
                  </Link>
                  <OpenChatButton
                    label="Hablar con el Asesor IA"
                    className="btn btn-glass text-base"
                    magnetic
                  />
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[380px]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl float-y">
                  <Image
                    src={ambient("home-gate-check")}
                    alt="Coche compacto de viaje listo con su bolso protector en aeropuerto"
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ClientEffects stickySource="home-sticky" />
    </>
  );
}
