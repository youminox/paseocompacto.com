import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre Nosotros | PaseoCompacto.com",
  description: `Conoce el proyecto PaseoCompacto.com, fundado por ${LEGAL_OWNER} en ${LEGAL_LOCATION} (${LEGAL_EMAIL}).`,
  alternates: { canonical: `${SITE_URL}/sobre-nosotros/` },
};

export default function SobreNosotrosPage() {
  return (
    <SimplePage
      title="Sobre PaseoCompacto.com"
      crumb="Sobre nosotros"
      href="/sobre-nosotros/"
      intro="Guía en español creada para ayudar a familias viajeras a elegir el coche de bebé compacto correcto y sus accesorios compatibles en Amazon Estados Unidos."
    >
      <h2>¿Por qué nació PaseoCompacto.com?</h2>
      <p>
        Quienes viajan con un bebé descubren rápido que un coche grande bloquea
        la maletera del taxi, complica las escaleras del aeropuerto y obliga a
        soltar al bebé para poder cerrarlo.{" "}
        <strong>PaseoCompacto.com</strong> reúne más de 1,500 guías claras en
        español para comparar sin rodeos modelos como{" "}
        <strong>Ingenuity 3Dlite / 3Dmini / 3Dquickclose</strong>,{" "}
        <strong>Kolcraft Cloud Plus / Umbrella</strong> y{" "}
        <strong>Doona Car Seat &amp; Stroller</strong> junto con sus bolsos de
        transporte, protectores de lluvia y organizadores compatibles en Amazon
        EE. UU.
      </p>

      <h2>Titularidad y dirección del proyecto</h2>
      <ul>
        <li>
          <strong>Titular y fundador:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Ubicación:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Contacto oficial:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>
    </SimplePage>
  );
}
