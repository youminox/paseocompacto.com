"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import HeroSearch from "@/components/HeroSearch";
import OpenChatButton from "@/components/OpenChatButton";

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = false;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const COLORS = [
      "45,212,191",
      "254,240,138",
      "56,189,248",
      "234,88,12",
      "255,255,255",
      "13,148,136",
    ];
    const N = w < 700 ? 48 : 110;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.3 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.55 + 0.25,
    }));
    let mx = -999,
      my = -999;
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx,
          dy = p.y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / 4000) * f;
          p.vy += (dy / 4000) * f;
        }
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.006;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? play() : pause()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric =
      (window as any).requestIdleCallback ||
      ((f: () => void) => setTimeout(f, 300));
    ric(() => io.observe(c));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      aria-hidden
    />
  );
}

export default function Hero({ heroImage }: { heroImage: string }) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01)
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 22;
      ty = -(e.clientY / window.innerHeight - 0.5) * 16;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const words = ["PaseoCompacto", ".com"];
  return (
    <section className="hero min-h-[100svh] pt-[68px]">
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <Particles />
      <div className="wrap grid min-h-[calc(100svh-68px)] items-center gap-8 py-12 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:py-6">
        <div className="relative z-20">
          <span className="chip">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />{" "}
            Guía en Español · Amazon EE. UU. · Ingenuity · Kolcraft · Doona
          </span>
          <h1 className="hero-title mt-5">
            <span className="block">
              {words.map((w, i) => (
                <span key={w}>
                  <span
                    className="hw"
                    style={{
                      animationDelay: `${0.08 + i * 0.14}s, ${-i * 1.2}s`,
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>{" "}
            <span className="mt-4 block text-[0.38em] font-bold leading-[1.22] tracking-[-0.02em] text-white/92">
              Elige el coche de bebé compacto para viajar{" "}
              <span className="text-[#fef08a]">
                que cabe en tu maletera junto al equipaje y cierra con una mano
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/78">
            Comparamos modelos de{" "}
            <strong className="text-white">
              Ingenuity, Kolcraft y Doona
            </strong>{" "}
            en <strong className="text-white">Amazon Estados Unidos</strong>{" "}
            según su <strong className="text-white">peso real</strong>,{" "}
            <strong className="text-white">medidas al plegarse</strong>,{" "}
            <strong className="text-white">cierre con una sola mano</strong> y{" "}
            <strong className="text-white">espacio en la maletera</strong>, más{" "}
            <strong className="text-[#fef08a]">
              bolsos Gate Check, protectores de lluvia y organizadores
              compatibles
            </strong>
            .
          </p>

          <div className="mt-6">
            <HeroSearch />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/comparativas-coches-de-bebe/"
              className="btn btn-lime shine text-sm sm:text-base"
              data-magnetic
            >
              ⚖️ Ingenuity vs Kolcraft vs Doona
            </Link>
            <Link
              href="/espacio-en-maletera-y-viajes-en-auto/"
              className="btn btn-buy shine text-sm sm:text-base"
              data-magnetic
            >
              🚗 Ver Espacio en Maletera
            </Link>
            <OpenChatButton
              label="Consultar Asesor IA"
              className="btn btn-glass text-sm sm:text-base"
              magnetic
            />
          </div>

          <ul
            className="mt-8 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-3"
            aria-label="Métricas clave de PaseoCompacto.com"
          >
            {[
              ["1,524", "guías", "1,000 SEO + 510 Amazon"],
              ["11.8 lb", "peso real", "Cierre con 1 sola mano"],
              ["+75 %", "maletera", "Espacio libre para maletas"],
            ].map(([v, u, l]) => (
              <li key={l} className="glass px-3 py-3 sm:px-4">
                <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                  {v}
                  {u && (
                    <span className="ml-1 text-xs font-bold text-fxlime">
                      {u}
                    </span>
                  )}
                </p>
                <p className="text-[0.72rem] leading-tight text-white/70 sm:text-xs">
                  {l}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="tilt-stage relative z-10 mx-auto w-full max-w-[560px]">
          <div ref={card} className="tilt-card relative py-4">
            <div className="tilt-glow" />
            <div className="halo-ring" />
            <div className="relative" style={{ transform: "translateZ(50px)" }}>
              <div className="float-y relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[32px] border-2 border-white/20 shadow-[0_40px_60px_rgba(0,0,0,0.65)]">
                <Image
                  src={heroImage}
                  alt="Coche de bebé compacto plegado dentro de la maletera de un automóvil junto a dos maletas de viaje, bolso protector y organizador"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a]/95 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <span className="inline-block rounded-full bg-prune px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      Top Viajes Amazon EE. UU.
                    </span>
                    <p className="mt-1 font-display text-lg sm:text-xl font-extrabold leading-tight">
                      Ingenuity 3Dlite · Kolcraft Cloud · Doona
                    </p>
                  </div>
                  <Link
                    href="/resenas-coches-compactos-de-viaje/"
                    className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/30"
                  >
                    Ver Reseñas →
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="absolute right-0 top-0 sm:right-2 sm:top-1 grid h-[120px] w-[120px] place-items-center rounded-full text-center text-slate-950 shadow-2xl"
              style={{
                background:
                  "radial-gradient(circle at 30% 28%, #fef08a, #f59e0b 55%, #ea580c)",
                transform: "translateZ(100px) rotate(-8deg)",
              }}
              aria-label="Desde 11 lb y plegado rápido con 1 mano"
            >
              <div>
                <p className="font-display text-[1.15rem] font-extrabold leading-none">
                  11–16 lb
                </p>
                <p className="mt-1 text-[0.62rem] font-extrabold uppercase">
                  Cierre 1 Mano
                </p>
                <p className="text-[0.6rem] font-bold">Maletera Libre</p>
              </div>
            </div>
            <div
              className="absolute -left-1 bottom-2 hidden rounded-2xl border border-white/15 bg-[#090e1a]/90 px-4 py-3 shadow-xl backdrop-blur sm:block"
              style={{ transform: "translateZ(80px)" }}
            >
              <p className="text-[0.68rem] uppercase tracking-wider text-white/60">
                4 Ejes + Accesorios Compatibles
              </p>
              <p className="font-display font-bold text-teal-300">
                Peso · Plegado · 1 Mano · Maletera
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
