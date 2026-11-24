"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function TravelModeComparisonSlider() {
  const [v, setV] = useState(26);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const t = v / 100;
  const mid = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const compact = clamp((t - 0.45) / 0.45);
  const fullCompact = clamp((t - 0.55) / 0.4);

  const phase =
    t < 0.35
      ? "Antes · Coche Tradicional Pesado (12 kg · 2 Manos · Maletera Llena)"
      : t < 0.68
      ? "Comparando · Reducción de Volumen y Cierre con 1 Mano"
      : "Después · Coche Compacto de Viaje + Bolso, Lluvia y Organizador";

  const spaceReading =
    t < 0.45 ? "22 % Maletera Libre · 12 kg" : "75–100 % Maletera Libre · 5.3 kg";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#090e1a] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if (
              (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)
            )
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="wt-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fef2f2" />
              <stop offset="1" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="wt-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ea580c" />
              <stop offset="0.55" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#f0fdfa" />
            </linearGradient>
            <linearGradient id="wt-compact" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#090e1a" />
              <stop offset="0.7" stopColor="#0f172a" />
              <stop offset="1" stopColor="#132a2e" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#wt-light)" />
          <rect width="800" height="450" fill="url(#wt-mid)" opacity={mid} />
          <rect
            width="800"
            height="450"
            fill="url(#wt-compact)"
            opacity={compact}
          />

          <rect
            x="0"
            y="365"
            width="800"
            height="85"
            fill={compact > 0.5 ? "#0b1322" : "#cbd5e1"}
          />

          {compact < 0.5 ? (
            <g>
              <rect
                x="185"
                y="140"
                width="430"
                height="200"
                rx="18"
                fill="#ffffff"
                stroke="#ea580c"
                strokeWidth="4"
              />
              <text
                x="400"
                y="192"
                textAnchor="middle"
                fontFamily="Outfit, sans-serif"
                fontWeight="800"
                fontSize="17"
                fill="#c2410c"
              >
                ❌ Coche Travel System Pesado (25–30 lb / 12+ kg)
              </text>
              <text
                x="400"
                y="226"
                textAnchor="middle"
                fontSize="13.5"
                fontWeight="700"
                fill="#0f172a"
              >
                ✗ Ocupa el 80 % de la maletera: apenas cabe 1 maleta de mano
              </text>
              <text
                x="400"
                y="254"
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#334155"
              >
                ✗ Exige usar ambas manos o desmontar asiento en cada taxi
              </text>
              <text
                x="400"
                y="282"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#b91c1c"
              >
                ✗ Sufre daños sin bolso Gate Check en puerta de avión
              </text>
            </g>
          ) : (
            <g opacity={fullCompact}>
              <rect
                x="175"
                y="138"
                width="450"
                height="205"
                rx="18"
                fill="#0f172a"
                stroke="#2dd4bf"
                strokeWidth="4"
              />
              <text
                x="400"
                y="192"
                textAnchor="middle"
                fontFamily="Outfit, sans-serif"
                fontWeight="800"
                fontSize="17"
                fill="#fef08a"
              >
                ✓ Ingenuity 3Dlite / Kolcraft Cloud Plus / Doona + Accesorios
              </text>
              <text
                x="400"
                y="226"
                textAnchor="middle"
                fontSize="13.5"
                fontWeight="700"
                fill="#ffffff"
              >
                ✓ Desde 11.8 lb (5.3 kg) y plegado en 1 segundo con 1 sola mano
              </text>
              <text
                x="400"
                y="254"
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#cbd5e1"
              >
                ✓ Deja espacio en la maletera para 2 maletas de 23 kg + mochilas
              </text>
              <text
                x="400"
                y="282"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#5eead4"
              >
                ✓ Kit listo: Bolso Gate Check + Burbuja Lluvia + Organizador
              </text>
            </g>
          )}

          <rect
            x="110"
            y="354"
            width="580"
            height="34"
            rx="10"
            fill="#090e1a"
            stroke="#2dd4bf"
            strokeWidth="2"
          />
          <text
            x="400"
            y="375"
            textAnchor="middle"
            fontFamily="Outfit, sans-serif"
            fontWeight="800"
            fontSize="12"
            fill="#fef08a"
          >
            {compact > 0.5
              ? "Ideal para vuelos internacionales, Ubers diarios, maleteras compactas y vacaciones familiares"
              : "Coche grande de uso diario en barrio, difícil de cargar en aeropuertos, escaleras y taxis"}
          </text>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-slate-950/65 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/75">
            {phase}
          </p>
          <p className="font-display text-xl sm:text-2xl font-extrabold tabular-nums text-teal-300">
            {spaceReading}
          </p>
        </div>
        {!touched && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-fxink shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra: Coche Tradicional Pesado vs Paseo Compacto de Viaje →
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 bg-[#090e1a] px-5 py-4 text-white sm:px-7">
        <span className="text-xs font-bold whitespace-nowrap text-orange-300">
          🚗 Maletera Llena (12 kg)
        </span>
        <label className="sr-only" htmlFor="wt-range">
          Comparador de espacio en maletera y plegado
        </label>
        <input
          id="wt-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            setTouched(true);
          }}
          aria-valuetext={`${phase}, ${spaceReading}`}
        />
        <span className="text-xs font-bold whitespace-nowrap text-teal-300">
          ✈️ Compacto 1 Mano (5.3 kg)
        </span>
      </div>
    </div>
  );
}
