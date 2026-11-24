import Link from "next/link";
import {
  getCategories,
  getArticlesIn,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
  STROLLERS_DISCLAIMER,
} from "@/lib/content";
import { AMAZON_TAG_ES, AMAZON_TAG_US } from "@/lib/amazon";
import { LogoMark } from "./Logo";
import OpenChatButton from "./OpenChatButton";

export default function Footer() {
  const cats = getCategories();
  return (
    <footer className="relative mt-24 overflow-hidden bg-[#090e1a] text-white/80">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-prune/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-40 right-0 h-80 w-[30rem] rounded-full bg-fxblue/25 blur-3xl" />
      <div className="wrap relative grid gap-12 py-16 lg:grid-cols-[1.15fr_2.2fr]">
        <div>
          <p className="flex items-center gap-3 font-display text-2xl font-extrabold text-white">
            <LogoMark className="h-10 w-10" />
            <span>
              Paseo<span className="text-fxlime">Compacto</span>.com
            </span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Guía en español para familias que buscan un{" "}
            <strong className="text-white">
              coche de bebé compacto para viajar
            </strong>
            . Comparamos modelos de{" "}
            <strong className="text-white">Ingenuity, Kolcraft y Doona</strong>{" "}
            según peso, medidas al plegarse, cierre con una mano y espacio libre
            en la maletera, además de bolsos de transporte, protectores de
            lluvia y organizadores compatibles en Amazon Estados Unidos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <OpenChatButton
              label="Asesor de PaseoCompacto IA"
              className="btn btn-lime shine text-sm"
            />
            <Link
              href="/comparativas-coches-de-bebe/"
              className="btn btn-glass text-sm"
            >
              Ver Comparativas
            </Link>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/70">
            <p className="font-bold text-white">Titular y Contacto Oficial:</p>
            <p className="mt-1">
              <strong>{LEGAL_OWNER}</strong> · Domiciliado en {LEGAL_LOCATION}
            </p>
            <p className="mt-0.5">
              Email:{" "}
              <a
                href={`mailto:${LEGAL_EMAIL}`}
                className="text-fxlime hover:underline"
              >
                {LEGAL_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <div key={c.slug}>
              <Link
                href={`/${c.slug}/`}
                className="font-display font-bold text-white hover:text-fxlime text-sm"
              >
                {c.name}
              </Link>
              <ul className="mt-2 space-y-1.5 text-xs text-white/65">
                {getArticlesIn(c.slug)
                  .slice(0, 3)
                  .map((a) => (
                    <li key={a.path}>
                      <Link href={a.path} className="hover:text-white">
                        {a.title.length > 52
                          ? a.title.slice(0, 50) + "…"
                          : a.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap relative">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-xs leading-relaxed text-white/65">
          <p>
            <strong className="text-white/90">
              Titular legal: {LEGAL_OWNER}, domiciliado en {LEGAL_LOCATION} ·
              Contacto: {LEGAL_EMAIL}.
            </strong>{" "}
            PaseoCompacto.com es una guía editorial independiente en español para
            familias viajeras. En este sitio {STROLLERS_DISCLAIMER}.
          </p>
          <p className="mt-2">
            <strong className="text-white/90">
              Divulgación de Afiliados de Amazon:
            </strong>{" "}
            En calidad de Afiliado de Amazon.com Associates (ID EE. UU.:{" "}
            <code>{AMAZON_TAG_US}</code>) y Amazon EU (ID España:{" "}
            <code>{AMAZON_TAG_ES}</code>), PaseoCompacto.com obtiene ingresos por
            las compras adscritas que cumplen los requisitos aplicables, sin
            ningún costo adicional para ti.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 paseocompacto.com · {LEGAL_OWNER} ({LEGAL_LOCATION}) ·{" "}
            {LEGAL_EMAIL}
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
            <Link href="/sobre-nosotros/" className="hover:text-white">
              Sobre nosotros
            </Link>
            <Link href="/contacto/" className="hover:text-white">
              Contacto
            </Link>
            <Link href="/divulgacion-de-afiliados/" className="hover:text-white">
              Divulgación de afiliados
            </Link>
            <Link href="/aviso-legal/" className="hover:text-white">
              Aviso legal
            </Link>
            <Link href="/politica-de-privacidad/" className="hover:text-white">
              Privacidad
            </Link>
            <Link href="/politica-de-cookies/" className="hover:text-white">
              Cookies
            </Link>
            <Link href="/politica-editorial/" className="hover:text-white">
              Política editorial
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
