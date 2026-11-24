import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política Editorial y Metodología | PaseoCompacto.com",
  description: `Cómo evaluamos coches de bebé compactos para viajar en PaseoCompacto.com (${LEGAL_OWNER}, ${LEGAL_LOCATION}).`,
  alternates: { canonical: `${SITE_URL}/politica-editorial/` },
};

export default function PoliticaEditorialPage() {
  return (
    <SimplePage
      title="Política Editorial y Metodología de Evaluación"
      crumb="Política editorial"
      href="/politica-editorial/"
      intro="Los cuatro criterios objetivos y verificables que aplicamos en cada comparativa de coches compactos y accesorios de viaje."
    >
      <h2>1. Los 4 pilares obligatorios de análisis</h2>
      <p>
        Cada guía publicada en <strong>PaseoCompacto.com</strong> bajo la
        dirección editorial de <strong>{LEGAL_OWNER}</strong> (domiciliado en{" "}
        {LEGAL_LOCATION}, contacto{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>) evalúa los
        modelos de marcas como <strong>Ingenuity</strong>,{" "}
        <strong>Kolcraft</strong> y <strong>Doona</strong> según estos cuatro
        ejes prácticos:
      </p>
      <ol>
        <li>
          <strong>Peso real y límite soportado:</strong> expresamos siempre tanto
          el peso en libras (<code>lb</code>) publicado en Amazon Estados Unidos
          como su conversión exacta a kilogramos (<code>kg</code>).
        </li>
        <li>
          <strong>Medidas al plegarse:</strong> detallamos alto, ancho y largo
          plegado en pulgadas y centímetros para saber si entra en el
          compartimento superior del avión o en puerta de embarque.
        </li>
        <li>
          <strong>Facilidad para cerrarlo con una sola mano:</strong>{" "}
          distinguimos entre cierres reales de una mano en el manillar (como
          Kolcraft Cloud Plus o Doona) y cierres de paraguas que requieren
          accionar una traba con el pie (como Ingenuity 3Dlite/3Dmini).
        </li>
        <li>
          <strong>Espacio libre en la maletera y compatibilidad:</strong>{" "}
          calculamos cómo convive el coche plegado con maletas de 23 kg y qué
          bolsos de transporte, protectores de lluvia y organizadores encajan en
          su chasis.
        </li>
      </ol>

      <h2>2. Actualizaciones y correcciones</h2>
      <p>
        Las dimensiones de equipaje de mano de las aerolíneas y los accesorios
        de Amazon EE. UU. se actualizan periódicamente. Si detectas una ficha
        que debamos revisar, escríbenos directamente a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
