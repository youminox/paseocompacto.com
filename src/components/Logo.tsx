import { useId } from "react";

/** Logotipo de PaseoCompacto.com: Coche de Bebé Compacto Plegado + Ruedas + Destello de Viaje */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#090e1a" />
          <stop offset="0.55" stopColor="#0f172a" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id}bg)`} />
      {/* Capota curva y asiento compacto */}
      <path
        d="M17 34 C17 20 27 14 38 15 L40 28 L23 34 Z"
        fill={`url(#${id}gold)`}
      />
      {/* Chasis plegable y manillar */}
      <path
        d="M15 36 L41 36 L47 21 L52 21"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 36 L17 45 M39 36 L44 45"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Ruedas */}
      <circle cx="17" cy="48" r="4.5" fill="#f8fafc" />
      <circle cx="17" cy="48" r="1.8" fill="#0d9488" />
      <circle cx="44" cy="48" r="4.5" fill="#f8fafc" />
      <circle cx="44" cy="48" r="1.8" fill="#0d9488" />
    </svg>
  );
}

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight">
      <LogoMark />
      <span>
        Paseo<span className={dark ? "text-fxlime" : "text-prune"}>Compacto</span>
        <span
          className={`ml-1.5 hidden text-[10px] font-bold uppercase tracking-[0.18em] sm:inline ${
            dark ? "text-white/60" : "text-[var(--muted)]"
          }`}
        >
          .com
        </span>
      </span>
    </span>
  );
}
