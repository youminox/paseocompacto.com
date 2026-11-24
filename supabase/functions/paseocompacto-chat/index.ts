import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://paseocompacto.com";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];
const AMAZON_TAG_US = "paseocompacto-20";
const AMAZON_TAG_ES = "paseocompacto-21";

export interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | null;
  search_text: string | null;
}

export interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

export interface AmazonProductCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  rating: string;
  reviewsCount: string;
  urlUS: string;
  urlES: string;
}

const AMAZON_PRODUCTS: Record<string, AmazonProductCard> = {
  "ingenuity-3dlite-convenience": {
    id: "ingenuity-3dlite-convenience",
    badge: "🏆 #1 Todoterreno Ligero Calidad-Precio",
    title:
      "Ingenuity 3Dlite Convenience Stroller — Chasis Aluminio 13 lb (5.9 kg) y Reclinado 4 Posiciones",
    subtitle:
      "Plegado compacto 3D (109 × 25 × 30 cm), correa de hombro integrada, soporta hasta 50 lb (22.6 kg) y deja +75 % de la maletera libre para tus maletas.",
    rating: "4.7",
    reviewsCount: "29.400+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Ingenuity 3Dlite Convenience Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Ingenuity 3Dlite silla de paseo ligera")}&tag=${AMAZON_TAG_ES}`,
  },
  "kolcraft-cloud-plus-lightweight": {
    id: "kolcraft-cloud-plus-lightweight",
    badge: "✋ #1 Verdadero Plegado con 1 Sola Mano (11.8 lb)",
    title:
      "Kolcraft Cloud Plus Lightweight Easy-Fold Stroller — Plegado de Pie con 1 Mano (5.3 kg)",
    subtitle:
      "Plegado en un segundo desde el manillar (46 × 30 × 86 cm), se mantiene de pie en la maletera, incluye bandeja para padres e hijo y soporta hasta 50 lb.",
    rating: "4.6",
    reviewsCount: "18.700+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Kolcraft Cloud Plus Lightweight Easy Fold Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Kolcraft Cloud Plus silla de paseo plegado una mano")}&tag=${AMAZON_TAG_ES}`,
  },
  "doona-car-seat-stroller": {
    id: "doona-car-seat-stroller",
    badge: "✈️ #1 Sistema 2-en-1 Certificado FAA (0 % Espacio en Maletera)",
    title:
      "Doona Car Seat & Stroller — Silla de Auto Certificada Avión FAA + Coche Integrado",
    subtitle:
      "Convierte la silla de auto en coche en 1 segundo sin despertar al bebé (4 a 35 lb). Va en el asiento del auto o avión dejando el 100 % de la maletera libre.",
    rating: "4.9",
    reviewsCount: "14.200+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Doona Infant Car Seat Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Doona silla de coche y paseo 2 en 1")}&tag=${AMAZON_TAG_ES}`,
  },
  "ingenuity-3dmini-convenience": {
    id: "ingenuity-3dmini-convenience",
    badge: "🪶 El Más Liviano y Económico de Viaje (11 lb)",
    title:
      "Ingenuity 3Dmini Convenience Stroller — Ultraligero 11 lb (4.9 kg) para Vuelos y Taxis",
    subtitle:
      "Plegado ultradelgado (109 × 24 × 27 cm) para maleteras pequeñas, respaldos acolchados con multiposición y doble portavasos para padres.",
    rating: "4.6",
    reviewsCount: "21.500+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Ingenuity 3Dmini Convenience Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Ingenuity 3Dmini silla paseo ultraligera")}&tag=${AMAZON_TAG_ES}`,
  },
  "ingenuity-3dquickclose-cs": {
    id: "ingenuity-3dquickclose-cs",
    badge: "🚗 Plegado Cuadrado con 1 Mano para Hatchback",
    title:
      "Ingenuity 3Dquickclose CS+ Compact Fold Stroller — Cierre Rápido Libro con 1 Mano",
    subtitle:
      "Medidas ultracortas plegado (56 × 52 × 32 cm) para entrar de pie en maleteras cortas, con cierre instantáneo con una mano y compatible con silla de auto.",
    rating: "4.5",
    reviewsCount: "3.900+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Ingenuity 3Dquickclose CS Compact Fold Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Ingenuity coche compacto plegado libro una mano")}&tag=${AMAZON_TAG_ES}`,
  },
  "kolcraft-cloud-umbrella": {
    id: "kolcraft-cloud-umbrella",
    badge: "☀️ Ultraligero Tipo Bastón para Aeropuertos (< $50)",
    title:
      "Kolcraft Cloud Umbrella Stroller — 9.5 a 11 lb con Capota Extensible y Respaldo Ventilado",
    subtitle:
      "Se guarda en segundos en cualquier esquina de la cajuela (104 × 28 × 23 cm), ideal para traslados rápidos, conexiones aéreas y abuelos.",
    rating: "4.5",
    reviewsCount: "9.800+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Kolcraft Cloud Umbrella Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Kolcraft Cloud silla de paseo paraguas ligera")}&tag=${AMAZON_TAG_ES}`,
  },
  "gb-pockit-all-terrain": {
    id: "gb-pockit-all-terrain",
    badge: "🧳 Plegado Récord de Cabina IATA (Cabe en Overhead Bin)",
    title:
      "gb Pockit+ All-Terrain / Stokke YOYO3 — Coche Ultracompacto Apto Compartimento Superior",
    subtitle:
      "Plegado ultrarreducido (34 × 20 × 42 cm, 12.3 lb) que sube contigo directo a la cabina del avión sin pasar por puerta de embarque ni bodega.",
    rating: "4.6",
    reviewsCount: "7.600+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("gb Pockit All Terrain Ultra Compact Stroller")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("gb Pockit All Terrain silla de paseo plegado cabina avion")}&tag=${AMAZON_TAG_ES}`,
  },
  "gate-check-travel-bag": {
    id: "gate-check-travel-bag",
    badge: "🛡️ Protección Obligatoria en Puerta de Avión",
    title:
      "J.L. Childress Gate Check Bag / Mochila Acolchada de Transporte (Paraguas, Libro y Doona)",
    subtitle:
      "Funda impermeable de nailon resistente con correas acolchadas para cargar al hombro y etiqueta de identificación; evita raspones, lluvia y grasa en bodega.",
    rating: "4.8",
    reviewsCount: "34.100+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("J.L. Childress Gate Check Travel Bag Stroller Umbrella Doona")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("bolsa transporte silla paseo avion impermeable mochila")}&tag=${AMAZON_TAG_ES}`,
  },
  "universal-rain-cover-eva": {
    id: "universal-rain-cover-eva",
    badge: "🌧️ Protector de Lluvia Transparente sin PVC",
    title:
      "Protector de Lluvia Universal Ventilado EVA (Compatible con Ingenuity, Kolcraft y Doona)",
    subtitle:
      "Ventana frontal con doble cierre para atender al bebé, malla lateral respirable contra condensación y ajuste firme contra viento y lluvia.",
    rating: "4.7",
    reviewsCount: "16.400+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Universal Stroller Rain Cover EVA Clear Waterproof Ingenuity Kolcraft")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("protector lluvia silla paseo universal transparente impermeable")}&tag=${AMAZON_TAG_ES}`,
  },
  "stroller-handlebar-organizer": {
    id: "stroller-handlebar-organizer",
    badge: "🥤 Organizador Compatible Doble Manillar o Barra Corrida",
    title:
      "Organizador Universal de Manillar con 2 Portavasos Térmicos y Bolso Desmontable",
    subtitle:
      "Correas antideslizantes compatibles con manillar tipo paraguas (Ingenuity 3Dlite) y barra corrida (Kolcraft Cloud Plus / Doona) sin desequilibrar el coche.",
    rating: "4.8",
    reviewsCount: "28.900+",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Momcozy Universal Stroller Organizer Cup Holder")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("organizador carrito bebe universal portavasos")}&tag=${AMAZON_TAG_ES}`,
  },
};

function calculateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  if (model.includes("mini")) {
    return Number(
      (promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6)
    );
  }
  return Number(
    (promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6)
  );
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como",
  "cual",
  "cuales",
  "que",
  "quien",
  "donde",
  "cuando",
  "por",
  "para",
  "con",
  "sin",
  "una",
  "uno",
  "los",
  "las",
  "del",
  "al",
  "hola",
  "quiero",
  "puedo",
  "recomienda",
  "mejor",
  "mejores",
  "sobre",
  "mas",
  "muy",
  "tiene",
  "tengo",
  "coche",
  "cochecito",
  "carriola",
  "bebe",
  "viajar",
  "viaje",
]);

function extractTokens(text: string): string[] {
  return norm(text)
    .split(" ")
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

let catalogCache: {
  at: number;
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
} | null = null;

async function loadCatalog(): Promise<{
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
}> {
  if (
    catalogCache &&
    Date.now() - catalogCache.at < 10 * 60 * 1000 &&
    catalogCache.rows.length > 0
  ) {
    return catalogCache;
  }
  const [batch1, batch2, batch3] = await Promise.all([
    supabase
      .from("paseocompacto_articles")
      .select(
        "slug, title, category, category_name, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("paseocompacto_articles")
      .select(
        "slug, title, category, category_name, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(1000, 1999),
    supabase
      .from("paseocompacto_articles")
      .select(
        "slug, title, category, category_name, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(2000, 2999),
  ]);

  const rows: ArticleRow[] = [];
  const bySlug = new Map<string, ArticleRow>();
  for (const data of [batch1.data, batch2.data, batch3.data]) {
    if (Array.isArray(data)) {
      for (const r of data as ArticleRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function toArticleCard(r: ArticleRow): ArticleCard {
  const img = r.featured_image || "/img/ambiente/home-hero-viaje.webp";
  const url =
    r.slug === r.category
      ? `${SITE}/${r.category}/`
      : `${SITE}/${r.category}/${r.slug}/`;
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url,
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    readTime: r.read_time || "7 min",
    excerpt: (r.excerpt || "").slice(0, 145),
  };
}

function searchArticles(
  rows: ArticleRow[],
  userMessage: string,
  historyText: string,
  limit = 14
): ArticleRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter(
    (t) => !primaryTokens.includes(t)
  );
  const fullPhrase = norm(userMessage);

  const starterSlugs = [
    "ingenuity-3dlite-convenience-stroller-resena-peso-medidas-maletera",
    "kolcraft-cloud-plus-lightweight-stroller-resena-plegado-una-mano",
    "doona-car-seat-stroller-2-en-1-avion-faa-resena-completa",
    "ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje",
    "mejores-coches-compactos-de-bebe-para-viajar-amazon-usa",
    "mejores-bolsos-de-transporte-gate-check-ingenuity-kolcraft-doona",
  ];

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    const picked: ArticleRow[] = [];
    for (const s of starterSlugs) {
      const f = rows.find((r) => r.slug === s);
      if (f) picked.push(f);
    }
    return picked.length > 0 ? picked : rows.slice(0, 8);
  }

  const scored: Array<{ r: ArticleRow; score: number }> = [];
  for (const r of rows) {
    const titleNorm = norm(r.title);
    const catNorm = norm(`${r.category_name} ${r.category}`);
    const bodyNorm =
      r.search_text || `${titleNorm} ${catNorm} ${norm(r.excerpt || "")}`;

    let score = 0;
    if (fullPhrase.length >= 5 && titleNorm.includes(fullPhrase)) score += 45;

    let matchedPrimary = 0;
    for (const tok of primaryTokens) {
      if (titleNorm.includes(tok)) {
        score += 16;
        matchedPrimary++;
      } else if (catNorm.includes(tok)) {
        score += 9;
        matchedPrimary++;
      } else if (bodyNorm.includes(tok)) {
        score += 5;
        matchedPrimary++;
      }
    }
    if (matchedPrimary >= 2) score += matchedPrimary * 8;
    if (starterSlugs.includes(r.slug)) score += 5;

    for (const cTok of contextTokens.slice(-5)) {
      if (titleNorm.includes(cTok)) score += 3;
    }

    if (score > 0) scored.push({ r, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.r);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body =
      req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || (req.method === "GET" ? "config" : "chat");

    // 0. Seed / Sync articles endpoint
    if (mode === "seed_articles") {
      const syncKey = req.headers.get("x-sync-key") || "";
      if (syncKey !== "paseocompacto-sync-2026") {
        return json({ error: "No autorizado" }, 401);
      }
      const rows = Array.isArray(body.articles) ? body.articles : [];
      if (rows.length === 0) return json({ error: "Sin artículos" }, 400);
      const { error } = await supabase
        .from("paseocompacto_articles")
        .upsert(rows, { onConflict: "slug" });
      if (error) return json({ error: error.message }, 500);
      catalogCache = null;
      return json({ success: true, count: rows.length });
    }

    // 1. Load live config (Default: gpt-4o-mini)
    const { data: configRow } = await supabase
      .from("paseocompacto_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.35,
      max_messages_per_session: 30,
      daily_budget_usd: 5.0,
      welcome_message:
        "¡Hola! 🍼✈️ Soy tu Asesor de Coches Compactos de Viaje IA de PaseoCompacto.com (modelo mini rápido). Cuéntame la edad de tu bebé, qué auto o aerolínea usas y si buscas Ingenuity, Kolcraft o Doona, y te recomendaré el coche ligero que mejor se pliega con una mano y deja espacio libre en tu maletera, junto con su bolso de transporte, protector de lluvia y organizador en Amazon Estados Unidos.",
      custom_instructions: "",
    };

    const activeModel = ALLOWED_MODELS.includes(config.ai_model)
      ? config.ai_model
      : "gpt-4o-mini";

    if (mode === "config" || req.method === "GET") {
      return json({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: activeModel,
        max_messages_per_session: config.max_messages_per_session,
      });
    }

    // 2. Track click on an article or Amazon product
    if (mode === "track_click") {
      const {
        session_id,
        visitor_id,
        article_slug,
        article_title,
        category,
        target_url,
        page_url,
      } = body;
      if (target_url) {
        await supabase.from("paseocompacto_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: String(visitor_id || "anon").slice(0, 80),
          article_slug: article_slug ? String(article_slug).slice(0, 180) : null,
          article_title: article_title
            ? String(article_title).slice(0, 240)
            : null,
          category: category ? String(category).slice(0, 80) : null,
          target_url: String(target_url).slice(0, 500),
          page_url: page_url ? String(page_url).slice(0, 500) : null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("paseocompacto_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls)
              ? sess.clicked_urls
              : [];
            if (!urls.includes(target_url)) urls.push(target_url);
            await supabase
              .from("paseocompacto_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return json({ success: true });
    }

    // 3. Chat Completion
    if (!config.is_enabled) {
      return json({
        reply: `En este momento el Asesor de Coches Compactos IA está en mantenimiento breve. Puedes ver nuestras comparativas de Ingenuity, Kolcraft y Doona en [PaseoCompacto.com](${SITE}/).`,
        recommended_articles: [],
        recommended_products: [],
        suggested_options: [
          "Ingenuity 3Dlite vs Kolcraft Cloud Plus",
          "Doona para viajar en avión con recién nacido",
        ],
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim().slice(0, 1000);
    if (!userMessage) return json({ error: "Mensaje vacío" }, 400);

    const visitorId = String(
      body.visitor_id || "pc-" + crypto.randomUUID().slice(0, 8)
    ).slice(0, 80);
    const region = body.region === "ES" ? "ES" : "US";
    const storeName = region === "ES" ? "Amazon.es" : "Amazon.com";
    const pageUrl = String(body.page_url || SITE + "/").slice(0, 500);
    const userAgent = String(
      body.user_agent || req.headers.get("user-agent") || ""
    ).slice(0, 300);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("paseocompacto_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("paseocompacto_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: activeModel,
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("paseocompacto_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    const catalog = await loadCatalog();
    const recentHistoryText = history
      .slice(-3)
      .map((h: any) => h?.content || "")
      .join(" ");
    const candidateRows = searchArticles(
      catalog.rows,
      userMessage,
      recentHistoryText,
      14
    );

    const candidatesPrompt =
      candidateRows.length > 0
        ? candidateRows
            .map((r) => {
              const u =
                r.slug === r.category
                  ? `${SITE}/${r.category}/`
                  : `${SITE}/${r.category}/${r.slug}/`;
              return `- SLUG: "${r.slug}" | TÍTULO: "${r.title}" | CATEGORÍA: ${r.category_name} | URL: ${u} | RESUMEN: ${(r.excerpt || "").slice(0, 140)}`;
            })
            .join("\n")
        : "No se encontraron artículos exactos con esos términos.";

    const amazonCatalogPrompt = Object.values(AMAZON_PRODUCTS)
      .map(
        (p) =>
          `- PRODUCT_ID: "${p.id}" | ${p.badge} | NOMBRE: "${p.title}" | DETALLE: ${p.subtitle} | URL_${region}: ${region === "ES" ? p.urlES : p.urlUS}`
      )
      .join("\n");

    const extraInstructions = config.custom_instructions
      ? `\nINSTRUCCIONES ADICIONALES DEL ADMINISTRADOR:\n${config.custom_instructions}\n`
      : "";

    const systemPrompt = `Eres el Asesor Oficial de Coches de Bebé Compactos para Viajar de PaseoCompacto.com (${SITE}), la guía en español con más de 1,500 artículos especializados para familias viajeras (titular Carlos Lingan Borja, Lima, Perú, info@charlielingan.com).

Tu doble misión es:
1. RESPONDER TODAS LAS DUDAS DEL USUARIO con datos concretos (lb/kg, in/cm, cierre con una mano y espacio en maletera) en español claro:
   - COMPARATIVA DE MODELOS CLAVE:
     * Ingenuity 3Dlite (13 lb / 5.9 kg, plegado 3D de 109 × 25 × 30 cm, soporta 50 lb, reclinado 4 posiciones, correa de hombro, deja +75 % de la maletera libre en diagonal o al fondo).
     * Ingenuity 3Dmini (11 lb / 4.9 kg, ultradelgado, opción más económica para traslados rápidos) e Ingenuity 3Dquickclose CS+ (17.5 lb / 7.9 kg, plegado libro cuadrado 56 × 52 × 32 cm con 1 mano).
     * Kolcraft Cloud Plus (11.8 lb / 5.3 kg, verdadero cierre rápido con 1 sola mano y se mantiene de pie plegado 46 × 30 × 86 cm, bandeja para padres e hijo, deja espacio para 2 maletas grandes) y Kolcraft Cloud Umbrella (9.5–11 lb, tipo bastón).
     * Doona Car Seat & Stroller (2-en-1 silla de auto certificada FAA para avión + coche integrado, 16.5 lb / 7.5 kg, conversión en 1 botón para bebés de 4 a 35 lb; va en el asiento dejando el 100 % de la maletera libre para equipaje).
     * gb Pockit+ All-Terrain / YOYO3 (ultracompactos que caben en compartimento superior Overhead Bin del avión).
   - ACCESORIOS COMPATIBLES: Recomienda siempre verificar compatibilidad de bolso de transporte Gate Check (funda paraguas para Ingenuity 3Dlite/3Dmini vs funda libro/acolchada para Kolcraft Cloud Plus y Doona), protector de lluvia EVA ventilado sin PVC y organizador de manillar (doble manillar curvo en Ingenuity vs barra corrida en Kolcraft/Doona).
   - Enlaza entre 1 y 3 guías de nuestro listado inferior usando Markdown exacto: [Título](${SITE}/categoria/slug/) e incluye sus slugs en "recommended_slugs".
2. AYUDAR ACTIVAMENTE A QUE COMPREN EN AMAZON (${storeName}):
   - Recomienda siempre 1 o 2 productos exactos de nuestro CATÁLOGO AMAZON OFICIAL (por ejemplo, el coche ideal + su bolso de transporte Gate Check, protector de lluvia u organizador compatible).
   - Incluye en tu respuesta un enlace Markdown directo al producto en ${storeName} usando su URL_${region} exacta y añade entre 1 y 2 IDs en "recommended_product_ids".${extraInstructions}

CATÁLOGO AMAZON OFICIAL (${storeName}):
${amazonCatalogPrompt}

ARTÍCULOS ENCONTRADOS EN PASEOCOMPACTO.COM:
${candidatesPrompt}

Responde ÚNICAMENTE con un objeto JSON válido con estas 4 llaves exactas:
{
  "reply": "Tu respuesta práctica y cercana en español comparando peso, medidas al plegarse, cierre con una mano, espacio libre en maletera y accesorios compatibles, con enlaces Markdown a nuestras guías y al producto en ${storeName}",
  "recommended_slugs": ["slug-1", "slug-2"],
  "recommended_product_ids": ["ingenuity-3dlite-convenience", "gate-check-travel-bag"],
  "suggested_options": ["Opción 1", "Opción 2", "Opción 3"]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (
        h &&
        (h.role === "user" || h.role === "assistant") &&
        typeof h.content === "string"
      ) {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: activeModel,
          messages: chatMessages,
          temperature: Number(config.temperature) || 0.35,
          max_tokens: 900,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!openaiRes.ok) {
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: candidateRows.slice(0, 2).map((r) => r.slug),
        recommended_product_ids: ["ingenuity-3dlite-convenience"],
        suggested_options: [
          "¿Ingenuity 3Dlite o Kolcraft Cloud Plus para maletera pequeña?",
          "¿El Doona vale la pena para viajar en avión?",
          "Bolso Gate Check y protector de lluvia compatible",
        ],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedArticles: ArticleCard[] = slugs
      .map((s) => catalog.bySlug.get(s))
      .filter((r): r is ArticleRow => Boolean(r))
      .map(toArticleCard);

    const productIds: string[] = Array.isArray(parsed.recommended_product_ids)
      ? parsed.recommended_product_ids.slice(0, 2)
      : ["ingenuity-3dlite-convenience"];
    const recommendedProducts: AmazonProductCard[] = productIds
      .map((id) => AMAZON_PRODUCTS[id])
      .filter((p): p is AmazonProductCard => Boolean(p));

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options
          .slice(0, 3)
          .map((s: unknown) => String(s).slice(0, 72))
      : [];

    const replyText: string =
      parsed.reply ||
      `Te recomiendo revisar nuestra comparativa de [Ingenuity 3Dlite vs Kolcraft Cloud Plus](${SITE}/comparativas-coches-de-bebe/ingenuity-3dlite-vs-kolcraft-cloud-plus-comparativa-viaje/).`;

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens =
      openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(
      activeModel,
      promptTokens,
      completionTokens
    );

    if (sessionId && existingSession) {
      await supabase.from("paseocompacto_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_articles: recommendedArticles,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(
        existingSession.recommended_articles
      )
        ? existingSession.recommended_articles
        : [];
      for (const ra of recommendedArticles) {
        if (!prevRecs.includes(ra.title)) prevRecs.push(ra.title);
      }
      for (const rp of recommendedProducts) {
        const label = `[Amazon] ${rp.title}`;
        if (!prevRecs.includes(label)) prevRecs.push(label);
      }

      await supabase
        .from("paseocompacto_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_articles: prevRecs.slice(0, 30),
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens:
            (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(
              6
            )
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    await supabase.from("token_usage").insert({
      source: "paseocompacto.com",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return json({
      session_id: sessionId,
      reply: replyText,
      recommended_articles: recommendedArticles,
      recommended_products: recommendedProducts,
      suggested_options: suggestedOptions,
      model: activeModel,
    });
  } catch (err: any) {
    return json(
      {
        error: err.message || "Error interno",
        reply: `Puedes explorar nuestras más de 1,500 guías de coches compactos Ingenuity, Kolcraft y Doona en [PaseoCompacto.com](${SITE}/).`,
        recommended_articles: [],
        recommended_products: [],
        suggested_options: ["Intentar de nuevo"],
      },
      500
    );
  }
});
