"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "Verifica el peso real y el tipo de cierre con una mano",
    d: "Cuando viajas con un bebé en brazos, necesitas un coche entre 4.9 kg y 7.5 kg: el Kolcraft Cloud Plus pliega de pie con una mano en 1 segundo; el Ingenuity 3Dlite ofrece reclinado de viaje con correa al hombro; y el Doona retrae sus ruedas bajo la silla con un botón.",
  },
  {
    n: "02",
    t: "Mide el espacio exacto que deja en la maletera para el equipaje",
    d: "Un coche tradicional se come toda la cajuela de un sedán o hatchback. Compara plegado 3D alargado (109 × 25 × 30 cm), plegado de pie tipo libro (56 × 52 × 32 cm) o el Doona en el asiento del auto dejando el 100 % de la maletera libre para maletas.",
  },
  {
    n: "03",
    t: "Elige entre cabina IATA (Overhead Bin) o puerta de embarque (Gate Check)",
    d: "Si quieres subir el coche al compartimento superior necesitas medidas cercanas a 55 × 40 × 20 cm (como gb Pockit+ o YOYO). Si entregas tu Ingenuity o Kolcraft en la puerta del avión, protégelo siempre con un bolso Gate Check impermeable.",
  },
  {
    n: "04",
    t: "Suma el protector de lluvia y el organizador compatible sin desequilibrar el manillar",
    d: "No todos los accesorios encajan igual: los coches paraguas (Ingenuity 3Dlite) usan organizadores flexibles para doble mango curvo; los de barra corrida (Kolcraft Cloud Plus / Doona) aceptan bandejas y portavasos firmes + burbuja de lluvia EVA ventilada.",
  },
];

export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          gsap.set(q(".phone-alert, .night, .sound-wave"), { opacity: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2200",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });
        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(
            q(".step-0 .dot"),
            { backgroundColor: "#0D9488", color: "#fff", duration: 0.2 },
            0
          )
          .fromTo(
            q(".bit-insert"),
            { x: 24 },
            { x: 0, duration: 0.6 },
            0.1
          )
          .to(q(".step-0"), { opacity: 0.75, duration: 0.2 }, 1)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1)
          .to(
            q(".step-1 .dot"),
            { backgroundColor: "#EA580C", color: "#fff", duration: 0.2 },
            1
          )
          .to(
            q(".torque-badge"),
            { scale: 1.06, svgOrigin: "200 130", duration: 0.5 },
            1.15
          )
          .to(q(".step-1"), { opacity: 0.75, duration: 0.2 }, 2)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#0284C7", color: "#fff", duration: 0.2 },
            2
          )
          .fromTo(
            q(".battery-pack"),
            { y: 20 },
            { y: 0, duration: 0.7 },
            2.05
          )
          .to(q(".sound-wave"), { opacity: 1, scaleX: 1, duration: 0.5 }, 2.1)
          .to(q(".step-2"), { opacity: 0.75, duration: 0.2 }, 3.1)
          .to(q(".step-3"), { opacity: 1, duration: 0.2 }, 3.1)
          .to(
            q(".step-3 .dot"),
            { backgroundColor: "#0F172A", color: "#FDE68A", duration: 0.2 },
            3.1
          )
          .to(q(".night"), { opacity: 1, duration: 0.6 }, 3.1)
          .to(q(".phone-alert"), { opacity: 1, y: 0, duration: 0.5 }, 3.3)
          .to(q(".bar"), { scaleX: 1, duration: 3.8 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="ruta-viaje"
      ref={root}
      className="relative bg-gradient-to-b from-white via-fxsky to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">Del Taxi a la Maletera y al Avión</span>
            <h2 className="section-title mt-3">
              Cuatro pasos.{" "}
              <span className="text-prune">
                Cierra con una mano, guarda en la maletera y despega sin estrés.
              </span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-prune via-fxlime to-fxblue" />
            </div>
            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`step step-${i} flex gap-4`}
                  style={{ opacity: 0.8 }}
                >
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-display font-extrabold text-fxink shadow-md">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-xl">
                      {s.t}
                    </p>
                    <p className="text-sm text-[var(--muted)] sm:text-base">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-full max-w-[270px] sm:max-w-[360px] lg:max-w-[420px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(15,23,42,0.22)]"
              role="img"
              aria-label="Esquema interactivo de maletera de automóvil con coche de bebé compacto plegado, dos maletas de viaje, bolso Gate Check y organizador"
            >
              <defs>
                <linearGradient id="ss-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f0fdfa" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="ss-dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#090e1a" />
                  <stop offset="0.65" stopColor="#0f172a" />
                  <stop offset="1" stopColor="#132a2e" />
                </linearGradient>
                <clipPath id="ss-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>
              <g clipPath="url(#ss-panel)">
                <rect width="400" height="440" fill="url(#ss-light)" />
                <rect
                  className="night"
                  width="400"
                  height="440"
                  fill="url(#ss-dark)"
                  opacity="0"
                />

                <g className="torque-badge">
                  <rect
                    x="55"
                    y="88"
                    width="290"
                    height="36"
                    rx="10"
                    fill="#0f172a"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                  />
                  <text
                    x="200"
                    y="110"
                    textAnchor="middle"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="800"
                    fontSize="11"
                    fill="#fef08a"
                  >
                    MALETERA SEDÁN (400 L) · +75 % ESPACIO LIBRE
                  </text>
                </g>

                {/* Contorno de maletera abierta */}
                <rect
                  x="48"
                  y="148"
                  width="304"
                  height="218"
                  rx="22"
                  fill="#1e293b"
                  stroke="#0d9488"
                  strokeWidth="4"
                />

                {/* Maleta grande 23 kg */}
                <rect
                  x="68"
                  y="168"
                  width="116"
                  height="176"
                  rx="12"
                  fill="#0284c7"
                  stroke="#e0f2fe"
                  strokeWidth="2.5"
                />
                <text
                  x="126"
                  y="256"
                  textAnchor="middle"
                  fontFamily="Outfit, sans-serif"
                  fontWeight="800"
                  fontSize="12"
                  fill="#ffffff"
                >
                  MALETA 23 kg
                </text>

                {/* Carry-on */}
                <rect
                  x="194"
                  y="168"
                  width="82"
                  height="112"
                  rx="10"
                  fill="#ea580c"
                  stroke="#fef3c7"
                  strokeWidth="2.5"
                />
                <text
                  x="235"
                  y="228"
                  textAnchor="middle"
                  fontFamily="Outfit, sans-serif"
                  fontWeight="800"
                  fontSize="11"
                  fill="#ffffff"
                >
                  CARRY-ON
                </text>

                {/* Coche compacto plegado deslizando */}
                <g className="bit-insert">
                  <rect
                    x="194"
                    y="290"
                    width="142"
                    height="54"
                    rx="12"
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="3"
                  />
                  <circle cx="216" cy="340" r="8" fill="#0f172a" />
                  <circle cx="316" cy="340" r="8" fill="#0f172a" />
                  <text
                    x="265"
                    y="322"
                    textAnchor="middle"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="800"
                    fontSize="11"
                    fill="#0f172a"
                  >
                    COCHE PLEGADO
                  </text>
                </g>

                {/* Kit de accesorios compatibles */}
                <g className="battery-pack">
                  <rect
                    x="286"
                    y="168"
                    width="48"
                    height="112"
                    rx="10"
                    fill="#0f172a"
                    stroke="#2dd4bf"
                    strokeWidth="2.5"
                  />
                  <text
                    x="310"
                    y="214"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#2dd4bf"
                  >
                    BOLSO
                  </text>
                  <text
                    x="310"
                    y="230"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#fef08a"
                  >
                    LLUVIA
                  </text>
                  <text
                    x="310"
                    y="246"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    ORG.
                  </text>
                </g>

                <line
                  className="sound-wave"
                  x1="54"
                  y1="392"
                  x2="346"
                  y2="392"
                  stroke="#2dd4bf"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                <g
                  className="phone-alert"
                  opacity="0"
                  transform="translate(40 18)"
                >
                  <rect
                    width="320"
                    height="48"
                    rx="14"
                    fill="#ffffff"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                  />
                  <circle cx="24" cy="24" r="13" fill="#0d9488" />
                  <text
                    x="24"
                    y="28"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    ✓
                  </text>
                  <text
                    x="46"
                    y="20"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="800"
                    fontSize="11.5"
                    fill="#0f172a"
                  >
                    ¡Cierre 1 Mano + Todo el Equipaje Cabe!
                  </text>
                  <text
                    x="46"
                    y="35"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                    fontSize="10"
                    fill="#0f766e"
                  >
                    Ingenuity · Kolcraft · Doona + Kit Protector Amazon
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
