import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Cookies | PaseoCompacto.com",
  description: `Información sobre el uso de almacenamiento local y cookies en PaseoCompacto.com (${LEGAL_OWNER}, ${LEGAL_LOCATION}).`,
  alternates: { canonical: `${SITE_URL}/politica-de-cookies/` },
};

export default function CookiesPage() {
  return (
    <SimplePage
      title="Política de Cookies"
      crumb="Política de cookies"
      href="/politica-de-cookies/"
      intro="Detalle claro sobre el almacenamiento técnico y las cookies de atribución de afiliados de Amazon en PaseoCompacto.com."
    >
      <h2>1. Almacenamiento técnico propio</h2>
      <p>
        PaseoCompacto.com utiliza claves ligeras de almacenamiento local (
        <code>localStorage</code> y <code>sessionStorage</code>) únicamente para
        recordar tu tienda Amazon seleccionada (<code>pc_amazon_region</code>:
        Amazon.com EE. UU. o Amazon.es España) y conservar el hilo reciente de
        tu conversación con el Asesor IA (<code>pc_chat_session</code> y{" "}
        <code>pc_chat_messages</code>).
      </p>

      <h2>2. Cookies de terceros (Amazon Associates)</h2>
      <p>
        Cuando haces clic voluntariamente en un botón o enlace de afiliado hacia{" "}
        <code>amazon.com</code> o <code>amazon.es</code>, Amazon establece sus
        propias cookies en su plataforma para atribuir correctamente las compras
        realizadas durante la ventana reglamentaria del programa de afiliados.
      </p>

      <h2>3. Gestión de cookies y contacto</h2>
      <p>
        Puedes eliminar las cookies y datos locales en cualquier momento desde
        la configuración de privacidad de tu navegador. Para consultas escribe a{" "}
        <strong>{LEGAL_OWNER}</strong>, domiciliado en {LEGAL_LOCATION}, al
        correo <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
