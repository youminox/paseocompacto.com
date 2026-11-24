"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import OpenChatButton from "./OpenChatButton";

export const NAV = [
  { href: "/resenas-coches-compactos-de-viaje/", label: "Reseñas Compactos" },
  { href: "/comparativas-coches-de-bebe/", label: "Ingenuity vs Kolcraft vs Doona" },
  { href: "/mejores-coches-por-viaje-y-auto/", label: "Por Viaje y Auto" },
  { href: "/viajar-en-avion-cabina-y-gate-check/", label: "Avión y Gate Check" },
  { href: "/espacio-en-maletera-y-viajes-en-auto/", label: "Maletera" },
  { href: "/bolsos-de-transporte-y-fundas-avion/", label: "Bolsos" },
  { href: "/protectores-de-lluvia-y-clima/", label: "Lluvia y Organizadores" },
];

export default function Header({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const dark = variant === "dark" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        dark
          ? "bg-transparent text-white"
          : "bg-white/92 text-fxink shadow-[0_8px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl"
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-3">
        <Link href="/" aria-label="PaseoCompacto.com – inicio">
          <Logo dark={dark} />
        </Link>
        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Principal"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-2 text-[0.8rem] font-semibold transition ${
                dark
                  ? "hover:bg-white/10"
                  : "hover:bg-fxsky hover:text-prunedeep"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <OpenChatButton
            label="Asesor IA"
            className="btn btn-buy shine !px-4 !py-2 text-xs sm:text-sm"
          />
          <button
            className="grid h-10 w-10 place-items-center rounded-full xl:hidden cursor-pointer"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="wrap grid gap-1 pb-5 xl:hidden bg-white text-fxink rounded-b-3xl shadow-xl"
          aria-label="Móvil"
          data-lenis-prevent
        >
          {[
            ...NAV,
            {
              href: "/organizadores-y-accesorios-compatibles/",
              label: "Organizadores y Accesorios Compatibles",
            },
            {
              href: "/guias-de-plegado-peso-y-medidas/",
              label: "Guías de Plegado, Peso y Medidas",
            },
            {
              href: "/etapas-del-bebe-edad-peso-y-reclinado/",
              label: "Etapas del Bebé y Reclinado",
            },
            {
              href: "/seguridad-certificaciones-faa-y-frenos/",
              label: "Seguridad, Certificaciones FAA y Frenos",
            },
            {
              href: "/mantenimiento-limpieza-y-repuestos/",
              label: "Mantenimiento y Limpieza",
            },
            {
              href: "/destinos-paseos-urbanos-y-logistica-familiar/",
              label: "Destinos y Parques",
            },
            {
              href: "/guia-de-compra-en-amazon-usa-y-equipaje/",
              label: "Guía de Compra en Amazon EE. UU.",
            },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 font-semibold hover:bg-fxsky"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
