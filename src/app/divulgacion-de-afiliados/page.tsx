import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";
import { AMAZON_TAG_US, AMAZON_TAG_ES } from "@/lib/amazon";

export const metadata: Metadata = {
  title: "Divulgación de Afiliados de Amazon | PaseoCompacto.com",
  description: `Declaración transparente de participación en el Programa de Afiliados de Amazon Estados Unidos (${AMAZON_TAG_US}) y España (${AMAZON_TAG_ES}).`,
  alternates: { canonical: `${SITE_URL}/divulgacion-de-afiliados/` },
};

export default function DivulgacionAfiliadosPage() {
  return (
    <SimplePage
      title="Divulgación de Afiliados de Amazon"
      crumb="Divulgación de afiliados"
      href="/divulgacion-de-afiliados/"
      intro="Transparencia total sobre cómo financiamos nuestras más de 1,500 guías gratuitas en español sin costo extra para tu familia."
    >
      <h2>1. Participación oficial en Amazon Associates</h2>
      <p>
        <strong>PaseoCompacto.com</strong>, sitio web titularidad de{" "}
        <strong>{LEGAL_OWNER}</strong> (domiciliado en {LEGAL_LOCATION} · email:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>), participa en el
        Programa de Afiliados de <strong>Amazon.com Services LLC</strong>{" "}
        (Estados Unidos, ID de seguimiento: <code>{AMAZON_TAG_US}</code>) y en
        el Programa de Afiliados de <strong>Amazon EU</strong> (España, ID de
        seguimiento: <code>{AMAZON_TAG_ES}</code>).
      </p>
      <p>
        <em>
          &ldquo;En calidad de Afiliado de Amazon, PaseoCompacto.com obtiene
          ingresos por las compras adscritas que cumplen los requisitos
          aplicables.&rdquo;
        </em>
      </p>

      <h2>2. ¿El precio sube al comprar desde nuestros enlaces?</h2>
      <p>
        <strong>No, pagas exactamente lo mismo.</strong> El precio, las ofertas
        y el envío de Amazon Estados Unidos o Amazon España son idénticos tanto
        si entras desde PaseoCompacto.com como si buscas el producto por tu
        cuenta. La comisión publicitaria que abona Amazon financia nuestras
        guías técnicas y el Asesor IA en línea.
      </p>

      <h2>3. Criterio independiente en cada recomendación</h2>
      <p>
        Ninguna marca (Ingenuity, Kolcraft, Doona u otra) paga por modificar las
        tablas comparativas de peso, medidas de plegado, cierre con una mano o
        espacio en maletera. Señalamos con claridad cuándo un modelo compacto
        solo aplica para Gate Check y cuándo entra en cabina aérea.
      </p>
    </SimplePage>
  );
}
