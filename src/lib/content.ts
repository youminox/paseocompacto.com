import fs from "node:fs";
import path from "node:path";
import categories from "@/data/categories.json";
import keywordMap from "@/data/keyword_map.json";

export const SITE_URL = "https://paseocompacto.com";
export const SITE_NAME = "PaseoCompacto.com";
export const LEGAL_OWNER = "CARLOS LINGAN BORJA";
export const LEGAL_LOCATION = "Lima, Perú";
export const LEGAL_EMAIL = "info@charlielingan.com";
export const LEGAL_LINE =
  "Titular del sitio web: CARLOS LINGAN BORJA, domiciliado en Lima, Perú · Correo electrónico: info@charlielingan.com";
export const STROLLERS_DISCLAIMER =
  "las marcas comerciales mencionadas (Amazon, Ingenuity, 3Dlite, 3Dmini, 3Dquickclose, Summer Infant, Kolcraft, Cloud Plus, Contours, Doona, gb Pockit, Babyzen, Stokke YOYO, J.L. Childress, Momcozy, entre otras) pertenecen a sus respectivos propietarios; este portal realiza comparativas independientes de coches de bebé compactos para viajar, peso, medidas de plegado, espacio en maletera y accesorios compatibles en español, y participa en el Programa de Afiliados de Amazon";
export const PUBLISHED = "2026-11-24";
export const VERIFIED_LABEL = "24/11/2026";
export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/paseocompacto-chat";

export type Block =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | {
      type: "callout";
      variant: "etiqueta" | "fabricante" | "aviso" | "tip";
      title?: string;
      text: string;
    }
  | { type: "steps"; items: { name: string; text: string }[] }
  | { type: "cta"; text: string };

export type Article = {
  slug: string;
  pillar: string;
  path: string;
  isPillar: boolean;
  isTransactional?: boolean;
  primaryKeyword: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  readingMinutes: number;
  image: { prompt: string; alt: string };
  blocks: Block[];
  faqs: { q: string; a: string }[];
  sources?: { label: string; url: string }[];
  related: string[];
  datePublished: string;
  dateModified: string;
  imageUrl: string | null;
};

export type Category = (typeof categories)[number];

const DIR = path.join(process.cwd(), "src/content/articles");
const PUBLIC = path.join(process.cwd(), "public");
let cache: Article[] | null = null;

function isValidArticle(a: Partial<Article>): a is Article {
  return Boolean(
    a && a.slug && a.pillar && a.path && a.title && Array.isArray(a.blocks)
  );
}

const PILLAR_SCENE_POOLS: Record<string, string[]> = {
  "resenas-coches-compactos-de-viaje": [
    "cat-resenas-coches-compactos-de-viaje",
    "scene-resenas-2",
    "scene-resenas-3",
    "home-hero-viaje",
  ],
  "comparativas-coches-de-bebe": [
    "cat-comparativas-coches-de-bebe",
    "scene-comparativas-2",
    "scene-comparativas-3",
    "og-default",
  ],
  "mejores-coches-por-viaje-y-auto": [
    "cat-mejores-coches-por-viaje-y-auto",
    "scene-viaje-auto-2",
    "scene-viaje-auto-3",
    "home-maletera-sedan",
  ],
  "bolsos-de-transporte-y-fundas-avion": [
    "cat-bolsos-de-transporte-y-fundas-avion",
    "scene-bolsos-2",
    "scene-bolsos-3",
    "home-gate-check",
  ],
  "protectores-de-lluvia-y-clima": [
    "cat-protectores-de-lluvia-y-clima",
    "scene-lluvia-2",
    "scene-lluvia-3",
    "home-lluvia-paseo",
  ],
  "organizadores-y-accesorios-compatibles": [
    "cat-organizadores-y-accesorios-compatibles",
    "scene-organizadores-2",
    "scene-organizadores-3",
    "home-organizador-manillar",
  ],
  "viajar-en-avion-cabina-y-gate-check": [
    "cat-viajar-en-avion-cabina-y-gate-check",
    "scene-avion-2",
    "scene-avion-3",
    "home-gate-check",
    "home-cabina-avion",
  ],
  "espacio-en-maletera-y-viajes-en-auto": [
    "cat-espacio-en-maletera-y-viajes-en-auto",
    "scene-maletera-2",
    "scene-maletera-3",
    "home-maletera-sedan",
    "home-doona-asiento",
  ],
  "guias-de-plegado-peso-y-medidas": [
    "cat-guias-de-plegado-peso-y-medidas",
    "scene-plegado-2",
    "scene-plegado-3",
    "home-plegado-una-mano",
  ],
  "etapas-del-bebe-edad-peso-y-reclinado": [
    "cat-etapas-del-bebe-edad-peso-y-reclinado",
    "scene-etapas-2",
    "scene-etapas-3",
    "home-doona-asiento",
  ],
  "seguridad-certificaciones-faa-y-frenos": [
    "cat-seguridad-certificaciones-faa-y-frenos",
    "scene-seguridad-2",
    "scene-seguridad-3",
  ],
  "mantenimiento-limpieza-y-repuestos": [
    "cat-mantenimiento-limpieza-y-repuestos",
    "scene-mantenimiento-2",
    "scene-mantenimiento-3",
  ],
  "destinos-paseos-urbanos-y-logistica-familiar": [
    "cat-destinos-paseos-urbanos-y-logistica-familiar",
    "scene-destinos-2",
    "scene-destinos-3",
    "home-parques-ciudad",
  ],
  "guia-de-compra-en-amazon-usa-y-equipaje": [
    "cat-guia-de-compra-en-amazon-usa-y-equipaje",
    "scene-amazon-usa-2",
    "scene-amazon-usa-3",
    "og-default",
  ],
};

function resolveArticleImage(
  a: Article,
  pillarCountMap: Map<string, number>
): string {
  const imgArt = path.join(PUBLIC, "img/articulos", `${a.slug}.webp`);
  if (fs.existsSync(imgArt)) {
    return `/img/articulos/${a.slug}.webp`;
  }
  if (a.isPillar) {
    const imgCat = path.join(PUBLIC, "img/ambiente", `cat-${a.pillar}.webp`);
    if (fs.existsSync(imgCat)) return `/img/ambiente/cat-${a.pillar}.webp`;
  }
  const idx = pillarCountMap.get(a.pillar) || 0;
  pillarCountMap.set(a.pillar, idx + 1);
  const pool = PILLAR_SCENE_POOLS[a.pillar] || ["home-hero-viaje"];
  const candidate = pool[idx % pool.length];
  const candidatePath = path.join(PUBLIC, "img/ambiente", `${candidate}.webp`);
  if (fs.existsSync(candidatePath)) {
    return `/img/ambiente/${candidate}.webp`;
  }
  const imgAmb = path.join(PUBLIC, "img/ambiente", `cat-${a.pillar}.webp`);
  return fs.existsSync(imgAmb)
    ? `/img/ambiente/cat-${a.pillar}.webp`
    : `/img/ambiente/home-hero-viaje.webp`;
}

export function getAllContent(): Article[] {
  if (cache) return cache;
  const order = (keywordMap as Array<{ path: string }>).map((k) => k.path);
  const files = fs.existsSync(DIR)
    ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))
    : [];
  const list: Article[] = [];
  const seen = new Set<string>();
  const pillarCountMap = new Map<string, number>();
  for (const f of files) {
    try {
      const a = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      if (!isValidArticle(a) || seen.has(a.path)) continue;
      seen.add(a.path);
      const imageUrl = resolveArticleImage(a, pillarCountMap);
      list.push({
        ...a,
        isPillar: Boolean(a.isPillar),
        isTransactional: Boolean(a.isTransactional),
        image:
          a.image && a.image.alt ? a.image : { prompt: "", alt: a.title },
        faqs: Array.isArray(a.faqs) ? a.faqs : [],
        related: Array.isArray(a.related) ? a.related : [],
        quickAnswer: a.quickAnswer || a.excerpt || "",
        excerpt: a.excerpt || a.metaDescription || "",
        seoTitle: a.seoTitle || a.title,
        metaDescription: a.metaDescription || a.excerpt || "",
        datePublished: a.datePublished || PUBLISHED,
        dateModified: a.dateModified || PUBLISHED,
        imageUrl,
      });
    } catch {
      // ignore invalid json during generation
    }
  }
  list.sort((x, y) => {
    const ix = order.indexOf(x.path);
    const iy = order.indexOf(y.path);
    if (ix === -1 && iy === -1) return x.path.localeCompare(y.path);
    if (ix === -1) return 1;
    if (iy === -1) return -1;
    return ix - iy;
  });
  cache = list;
  return list;
}

export const getCategories = (): Category[] => categories;
export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const getPillar = (slug: string) =>
  getAllContent().find((a) => a.isPillar && a.pillar === slug);
export const getArticle = (pillar: string, slug: string) =>
  getAllContent().find(
    (a) => !a.isPillar && a.pillar === pillar && a.slug === slug
  );
export const getArticlesIn = (pillar: string) =>
  getAllContent().filter((a) => !a.isPillar && a.pillar === pillar);
export const getByPath = (p: string) =>
  getAllContent().find((a) => a.path === p);

export function safeHref(p: string): string {
  if (getByPath(p)) return p;
  const pillar = p.split("/").filter(Boolean)[0];
  if (pillar && getCategory(pillar)) return `/${pillar}/`;
  return "/";
}

export function ambient(
  name: string,
  fallback = "/img/ambiente/home-hero-viaje.webp"
): string {
  const rel = `/img/ambiente/${name}.webp`;
  return fs.existsSync(path.join(PUBLIC, rel)) ? rel : fallback;
}

export const hasAmbient = (name: string) =>
  fs.existsSync(path.join(PUBLIC, `/img/ambiente/${name}.webp`));

export const OG_DEFAULT = () =>
  ambient("og-default", "/img/ambiente/home-hero-viaje.webp");

export function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export function trimTitle(t: string) {
  return t.replace(/\s*\|\s*PaseoCompacto(?:\.com)?\s*$/i, "");
}

export const organizationLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.svg`,
  founder: { "@id": `${SITE_URL}/#carlos` },
  email: LEGAL_EMAIL,
  description:
    "Guía en español para familias que buscan coches de bebé compactos para viajar en Amazon Estados Unidos: compara modelos Ingenuity, Kolcraft y Doona según peso, medidas al plegarse, cierre con una mano y espacio en la maletera, más bolsos, protectores de lluvia y organizadores compatibles.",
};

export const personLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#carlos`,
  name: LEGAL_OWNER,
  email: LEGAL_EMAIL,
  jobTitle: "Fundador & Editor Jefe de PaseoCompacto.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressCountry: "PE",
  },
  url: `${SITE_URL}/sobre-nosotros/`,
};
