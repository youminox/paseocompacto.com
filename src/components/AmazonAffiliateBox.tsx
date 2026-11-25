"use client";

import { useEffect, useState } from "react";
import {
  AmazonProductRecommendation,
  AmazonStoreRegion,
  AMAZON_TAG_ES,
  AMAZON_TAG_US,
  buildAmazonUrl,
  detectUserAmazonRegion,
} from "@/lib/amazon";
import { trackClick } from "@/lib/client-constants";

interface AmazonAffiliateBoxProps {
  variant: "verdict" | "vs" | "inline" | "showcase" | "sidebar";
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
  vsCompetitor?: AmazonProductRecommendation;
  source?: string;
}

function CategoryIcon({
  type,
}: {
  type: AmazonProductRecommendation["categoryType"];
}) {
  if (type === "one-hand-fold") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-900 border border-teal-300/70 text-2xl">
        ✋
      </div>
    );
  }
  if (type === "carseat-2in1") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-900 border border-sky-300/70 text-2xl">
        ✈️
      </div>
    );
  }
  if (type === "travel-bag") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-900 border border-rose-300/70 text-2xl">
        🎒
      </div>
    );
  }
  if (type === "rain-cover") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-900 border border-cyan-300/70 text-2xl">
        🌧️
      </div>
    );
  }
  if (type === "organizer") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-900 border border-amber-300/70 text-2xl">
        🥤
      </div>
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] text-[#2dd4bf] border border-[#0d9488]/50 shadow-2xs text-2xl">
      🍼
    </div>
  );
}

export default function AmazonAffiliateBox({
  variant,
  sectionTitle,
  sectionSubtitle,
  products,
  vsCompetitor,
  source = "article",
}: AmazonAffiliateBoxProps) {
  const [region, setRegion] = useState<AmazonStoreRegion>("US");

  useEffect(() => {
    setRegion(detectUserAmazonRegion());
  }, []);

  const changeRegion = (next: AmazonStoreRegion) => {
    setRegion(next);
    try {
      window.localStorage.setItem("pc_amazon_region", next);
    } catch {
      // ignore
    }
  };

  const primaryProduct = products[0];
  const storeName =
    region === "US" ? "Amazon.com (EE. UU.)" : "Amazon.es (España)";
  const shortStore = region === "US" ? "Amazon.com" : "Amazon.es";

  const onAmazonClick = (prod: AmazonProductRecommendation, pos: string) => {
    const url = buildAmazonUrl(prod, region);
    trackClick(`${source}-${variant}-${pos}`, {
      article_slug: prod.id,
      article_title: prod.title,
      category: "amazon",
      target_url: url,
    });
  };

  const RegionSwitch = () => (
    <div className="inline-flex items-center gap-1 rounded-full bg-white border border-[var(--line)] px-2.5 py-1 text-[11px] font-bold text-slate-600">
      <span>Tienda:</span>
      <button
        type="button"
        onClick={() => changeRegion("US")}
        className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
          region === "US"
            ? "bg-[#ea580c] text-white font-extrabold"
            : "hover:text-slate-900"
        }`}
      >
        🇺🇸 Amazon.com
      </button>
      <button
        type="button"
        onClick={() => changeRegion("ES")}
        className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
          region === "ES"
            ? "bg-[#ea580c] text-white font-extrabold"
            : "hover:text-slate-900"
        }`}
      >
        🇪🇸 Amazon.es
      </button>
    </div>
  );

  // 1. VERDICT VARIANT
  if (variant === "verdict") {
    const url = buildAmazonUrl(primaryProduct, region);
    return (
      <section
        aria-label="Recomendación destacada de coche compacto para viajar en Amazon"
        className="my-8 rounded-3xl border-2 border-[#0d9488]/45 bg-gradient-to-br from-[#f0fdfa] via-white to-[#fef3c7]/55 p-5 sm:p-7 shadow-[0_20px_50px_-28px_rgba(13,148,136,0.35)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-3 py-1 text-xs font-extrabold text-[#fef08a]">
              {primaryProduct.badge}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-950">
              Enlace patrocinado · {shortStore}
            </span>
          </div>
          <RegionSwitch />
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-start gap-3.5">
              <CategoryIcon type={primaryProduct.categoryType} />
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {primaryProduct.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                  {primaryProduct.subtitle}
                </p>
              </div>
            </div>

            {primaryProduct.specs && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl bg-white/95 border border-[var(--line)] p-3.5 text-xs">
                <div>
                  <span className="font-extrabold text-[#c2410c] uppercase block">
                    ⚖️ Peso y Límite del Bebé
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {primaryProduct.specs.weight}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-[#0f766e] uppercase block">
                    📏 Medidas al Plegarse
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {primaryProduct.specs.foldedMeasures}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-[#0284c7] uppercase block">
                    ✋ Cierre con Una Mano
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {primaryProduct.specs.oneHandFold}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 uppercase block">
                    🚗 Espacio Libre en Maletera
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {primaryProduct.specs.trunkSpace}
                  </span>
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-1.5 text-xs sm:text-sm text-slate-700">
              {primaryProduct.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 font-extrabold text-teal-700">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-stretch md:w-64 gap-2.5 rounded-2xl bg-[#0f172a] p-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 text-center">
              Disponibilidad · {storeName}
            </span>
            <a
              href={url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => onAmazonClick(primaryProduct, "verdict-cta")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-4 py-3.5 text-center font-display text-sm font-extrabold text-white shadow-lg hover:brightness-105 transition"
            >
              <span>{primaryProduct.ctaLabel}</span>
              <span aria-hidden>→</span>
            </a>
            <p className="text-[11px] text-center text-white/70 leading-snug">
              Consulta colores, disponibilidad y condiciones de envío en{" "}
              {shortStore}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 2. VS VARIANT (Side-by-side comparison)
  if (variant === "vs") {
    const rival = vsCompetitor || products[1];
    const contenders = [primaryProduct, rival];
    return (
      <section
        aria-label="Comparativa directa de coches compactos en Amazon"
        className="my-8 rounded-3xl border-2 border-slate-900/15 bg-gradient-to-b from-slate-950 to-slate-900 p-5 sm:p-7 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
              ⚖️ Duelo Técnico Cara a Cara en Amazon
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold mt-0.5">
              {sectionTitle}
            </h3>
          </div>
          <RegionSwitch />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {contenders.map((item, idx) => {
            const url = buildAmazonUrl(item, region);
            return (
              <div
                key={item.id + idx}
                className="flex flex-col justify-between rounded-2xl bg-white/95 p-5 text-slate-900 border border-teal-300/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-950">
                      {idx === 0 ? "Opción #1 Destacada" : "Alternativa Directa"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Ficha en {shortStore}
                    </span>
                  </div>
                  <h4 className="mt-2.5 font-display text-lg font-extrabold leading-snug">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.subtitle}
                  </p>
                  {item.specs && (
                    <div className="mt-3 space-y-1 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200">
                      <p>
                        <strong>⚖️ Peso:</strong> {item.specs.weight}
                      </p>
                      <p>
                        <strong>📏 Plegado:</strong> {item.specs.foldedMeasures}
                      </p>
                      <p>
                        <strong>✋ Cierre 1 mano:</strong>{" "}
                        {item.specs.oneHandFold}
                      </p>
                      <p>
                        <strong>🚗 Maletera:</strong> {item.specs.trunkSpace}
                      </p>
                    </div>
                  )}
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => onAmazonClick(item, `vs-${idx + 1}`)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-4 py-3 font-display text-xs sm:text-sm font-extrabold text-white shadow hover:brightness-110 transition"
                >
                  <span>Ver disponibilidad en {shortStore}</span>
                  <span aria-hidden>→</span>
                </a>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // 3. INLINE VARIANT (Mid-article high CTR card on 100% of pages)
  if (variant === "inline") {
    const url = buildAmazonUrl(primaryProduct, region);
    return (
      <aside
        aria-label="Coche o accesorio recomendado en Amazon relacionado con este artículo"
        className="my-8 rounded-3xl border border-teal-300/80 bg-gradient-to-r from-[#f0fdfa] via-white to-[#fef3c7]/50 p-5 sm:p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-3 py-0.5 text-[11px] font-extrabold text-amber-300">
            {primaryProduct.badge}
          </span>
          <RegionSwitch />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <CategoryIcon type={primaryProduct.categoryType} />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {primaryProduct.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                {primaryProduct.subtitle}
              </p>
              {primaryProduct.specs && (
                <p className="mt-2 text-xs font-semibold text-teal-950 bg-teal-50 border border-teal-200/80 rounded-lg px-2.5 py-1.5">
                  📏 <strong>Plegado:</strong>{" "}
                  {primaryProduct.specs.foldedMeasures} · 🚗{" "}
                  {primaryProduct.specs.trunkSpace}
                </p>
              )}
            </div>
          </div>
          <div className="shrink-0 sm:w-56">
            <a
              href={url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => onAmazonClick(primaryProduct, "inline")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-4 py-3.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-md hover:brightness-110 transition"
            >
              <span>Consultar en {shortStore}</span>
              <span aria-hidden>→</span>
            </a>
            <p className="mt-1 text-center text-[11px] text-slate-500">
              Enlace de afiliado · {shortStore}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // 4. SIDEBAR VARIANT (Desktop sticky widget)
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-[var(--line)]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#c2410c]">
            🛒 Selección Amazon EE. UU.
          </span>
          <div className="inline-flex gap-1 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => changeRegion("US")}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                region === "US"
                  ? "bg-[#ea580c] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              🇺🇸 US
            </button>
            <button
              type="button"
              onClick={() => changeRegion("ES")}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                region === "ES"
                  ? "bg-[#ea580c] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              🇪🇸 ES
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {products.slice(0, 2).map((item, i) => {
            const url = buildAmazonUrl(item, region);
            return (
              <div
                key={item.id + i}
                className="rounded-xl bg-slate-50 p-3 border border-slate-200/80"
              >
                <span className="block text-[10px] font-extrabold text-teal-800">
                  {i === 0 ? "1. Modelo Recomendado" : "2. Accesorio Compatible"}
                </span>
                <p className="mt-0.5 font-display text-xs font-extrabold text-slate-900 line-clamp-2">
                  {item.title}
                </p>
                {item.specs && (
                  <p className="mt-1 text-[11px] text-slate-600">
                    {item.specs.weight}
                  </p>
                )}
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => onAmazonClick(item, `sidebar-${i + 1}`)}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-[#0f172a] px-3 py-2 text-[11px] font-extrabold text-amber-300 hover:bg-slate-800 transition"
                >
                  Consultar en {shortStore} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. SHOWCASE VARIANT (3-card cross-sell showcase: Stroller + Travel Bag / Alternative + Rain Cover / Organizer)
  return (
    <section
      aria-label="Vitrina de coches compactos y accesorios compatibles en Amazon"
      className="my-12 rounded-3xl bg-gradient-to-br from-[#090e1a] via-[#0f172a] to-[#132a2e] p-6 sm:p-8 text-white shadow-2xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-teal-400/15 border border-teal-400/30 px-3 py-1 text-xs font-extrabold text-teal-300">
            ✈️ Selección Compatible en {storeName}
          </span>
          <h2 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold text-white">
            {sectionTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-300">{sectionSubtitle}</p>
        </div>
        <RegionSwitch />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {products.map((prod, idx) => {
          const url = buildAmazonUrl(prod, region);
          const roleLabels = [
            "1. Coche / Producto Principal",
            "2. Alternativa o Protección",
            "3. Accesorio Compatible",
          ];
          return (
            <div
              key={prod.id + idx}
              className="flex flex-col justify-between rounded-2xl bg-white text-slate-900 p-5 shadow-lg border border-white/20"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                    {roleLabels[idx] || prod.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {shortStore}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-slate-900">
                  {prod.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {prod.subtitle}
                </p>

                {prod.specs && (
                  <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-[11px] space-y-1">
                    <p>
                      <strong className="text-orange-800">Peso:</strong>{" "}
                      {prod.specs.weight}
                    </p>
                    <p>
                      <strong className="text-teal-800">Plegado:</strong>{" "}
                      {prod.specs.foldedMeasures}
                    </p>
                    <p>
                      <strong className="text-sky-900">Maletera:</strong>{" "}
                      {prod.specs.trunkSpace}
                    </p>
                  </div>
                )}

                <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                  {prod.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <span className="font-extrabold text-teal-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => onAmazonClick(prod, `showcase-${idx + 1}`)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-4 py-3 font-display text-xs sm:text-sm font-extrabold text-white shadow hover:brightness-105 transition"
              >
                <span>Consultar disponibilidad en {shortStore}</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[11px] text-slate-400 text-center">
        En calidad de Afiliado de Amazon ({AMAZON_TAG_US} en Amazon.com y{" "}
        {AMAZON_TAG_ES} en Amazon.es), PaseoCompacto.com obtiene ingresos por
        las compras adscritas que cumplen los requisitos aplicables sin ningún
        costo adicional para ti. Los precios y la disponibilidad son los que
        figuran en tiempo real en Amazon en el momento de la compra.
      </p>
    </section>
  );
}
