"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CATALOG,
  buildAmazonUrl,
  detectUserAmazonRegion,
  type AmazonStoreRegion,
  type AmazonProductRecommendation,
} from "@/lib/amazon";
import { trackClick } from "@/lib/client-constants";
import OpenChatButton from "@/components/OpenChatButton";

export type StrollerTier = {
  key: string;
  label: string;
  weightSpec: string;
  foldSpec: string;
  trunkSpec: string;
  img: string;
  alt: string;
  idealFor: string;
  reviewHref: string;
  productKey: keyof typeof CATALOG;
};

export default function StrollerFinderBlock({
  options,
}: {
  options: StrollerTier[];
}) {
  const [k, setK] = useState(options[0].key);
  const [trunkLiters, setTrunkLiters] = useState(380);
  const [region, setRegion] = useState<AmazonStoreRegion>("US");

  useEffect(() => {
    setRegion(detectUserAmazonRegion());
  }, []);

  const p = options.find((o) => o.key === k) || options[0];
  const amzProd: AmazonProductRecommendation =
    CATALOG[p.productKey] || CATALOG.INGENUITY_3DLITE;
  const amzUrl = buildAmazonUrl(amzProd, region);
  const storeName = region === "US" ? "Amazon.com" : "Amazon.es";

  const strollerLiters =
    p.key === "doona" ? 0 : p.key === "kolcraft" ? 118 : p.key === "ingenuity" ? 82 : 45;
  const freeLiters = Math.max(0, trunkLiters - strollerLiters);
  const largeSuitcases = Math.max(1, Math.floor(freeLiters / 115));
  const carryOns = Math.max(1, Math.floor((freeLiters % 115) / 42) + 1);

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
      <div className="card card-static spot relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-prune/10 blur-3xl" />
        <div className="relative">
          <div
            className="inline-flex flex-wrap rounded-full bg-fxsky p-1 gap-1"
            role="tablist"
            aria-label="Selector de coche compacto por prioridad de viaje"
          >
            {options.map((o) => (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={o.key === k}
                onClick={() => setK(o.key)}
                className={`rounded-full px-3.5 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  o.key === k
                    ? "bg-fxink text-amber-300 shadow"
                    : "text-[var(--muted)] hover:text-fxink"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1.2fr]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[240px] overflow-hidden rounded-2xl border border-[var(--line)] shadow-sm">
              <Image
                key={p.img}
                src={p.img}
                alt={p.alt}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="inline-block rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-950">
                {amzProd.badge}
              </span>
              <p className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-fxink leading-snug">
                {amzProd.title.split("—")[0].trim()}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                <strong className="text-fxink">Ideal para:</strong>{" "}
                {p.idealFor}
              </p>
              <div className="mt-2.5 rounded-xl bg-fxsky p-2.5 text-xs space-y-1">
                <p className="font-bold text-fxbluedeep">
                  ⚖️ Peso: {p.weightSpec}
                </p>
                <p className="font-semibold text-prunedeep">
                  📏 Plegado: {p.foldSpec}
                </p>
                <p className="font-semibold text-fxink">
                  🚗 Maletera: {p.trunkSpec}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={amzUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() =>
                trackClick(`finder-amazon-${p.key}`, {
                  article_slug: amzProd.id,
                  article_title: amzProd.title,
                  category: "amazon",
                  target_url: amzUrl,
                })
              }
              className="btn btn-buy shine flex-1 text-sm"
              data-magnetic
            >
              ✈️ Consultar disponibilidad en {storeName} ↗
            </a>
            <Link href={p.reviewHref} className="btn btn-ghost text-sm">
              Ver análisis y accesorios →
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#090e1a] via-[#0f172a] to-[#132a2e] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
          Calculadora Real de Espacio en la Maletera
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          ¿Cuánto equipaje te cabe junto al coche?
        </h3>
        <p className="mt-2 text-sm text-white/75">
          Desliza los litros de la maletera de tu auto (city-car, sedán o SUV)
          para ver cuánto volumen libre te queda para tus maletas con el modelo
          seleccionado.
        </p>
        <label
          htmlFor="trunk-slider"
          className="mt-6 flex items-center justify-between text-sm font-semibold"
        >
          <span>Capacidad total de tu maletera</span>
          <span className="rounded-full bg-white/10 px-3.5 py-1 font-display text-lg text-fxlime">
            {trunkLiters} Litros
          </span>
        </label>
        <input
          id="trunk-slider"
          type="range"
          min={250}
          max={600}
          step={25}
          value={trunkLiters}
          onChange={(e) => setTrunkLiters(Number(e.target.value))}
          className="mt-3 w-full accent-[#0D9488]"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-white/50">
          <span>250 L (Hatchback)</span>
          <span>375 L (Sedán/Taxi)</span>
          <span>475 L (SUV Compacta)</span>
          <span>600 L (SUV Familiar)</span>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Espacio Libre", `${freeLiters} L libres`],
            ["Maletas 23 kg", `${largeSuitcases} maleta${largeSuitcases > 1 ? "s" : ""}`],
            ["Carry-On Extra", `${carryOns} cabina`],
          ].map(([l, val], i) => (
            <div
              key={l}
              className={`glass flex flex-col-reverse p-3 ${
                i === 0 ? "border-teal-400/50 bg-teal-400/10" : ""
              }`}
            >
              <dt className="mt-1 text-[0.7rem] leading-tight text-white/65">
                {l}
              </dt>
              <dd
                className={`font-display font-extrabold ${
                  i === 0
                    ? "text-sm text-teal-300 sm:text-base"
                    : "text-xs sm:text-base"
                }`}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs text-white/65">
          <span>
            Recuerda sumar un <strong>Bolso Gate Check</strong> y{" "}
            <strong>Protector de Lluvia</strong> sin ocupar litros extra.
          </span>
          <OpenChatButton
            label="Preguntar si entra en mi modelo de auto"
            prompt={`Tengo un auto con maletera de unos ${trunkLiters} litros y estoy viendo la opción "${p.label}". ¿Cómo acomodo el coche con mis maletas y qué accesorios compatibles necesito en Amazon EE. UU.?`}
            className="text-fxlime font-bold hover:underline !bg-transparent !p-0"
          />
        </div>
      </div>
    </div>
  );
}
