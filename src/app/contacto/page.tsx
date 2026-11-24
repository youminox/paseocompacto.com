import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import OpenChatButton from "@/components/OpenChatButton";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Contacto | PaseoCompacto.com",
  description: `Contacta con ${LEGAL_OWNER} (${LEGAL_LOCATION}) en ${LEGAL_EMAIL} o usa el Asesor IA de PaseoCompacto.com.`,
  alternates: { canonical: `${SITE_URL}/contacto/` },
};

export default function ContactoPage() {
  return (
    <SimplePage
      title="Contacto y Asesoría"
      crumb="Contacto"
      href="/contacto/"
      intro="Canales directos de contacto con la dirección editorial de PaseoCompacto.com y acceso al Asesor IA de coches compactos."
    >
      <h2>1. Datos de contacto del titular</h2>
      <ul>
        <li>
          <strong>Titular de la web:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <h2>2. ¿Necesitas elegir coche o accesorio ahora mismo?</h2>
      <p>
        Si quieres saber en segundos qué modelo entre Ingenuity, Kolcraft o
        Doona cabe en tu auto o aerolínea, o qué bolso de transporte, protector
        de lluvia u organizador es compatible, conversa con nuestro Asesor IA
        en línea disponible las 24 horas:
      </p>
      <div className="not-prose mt-4">
        <OpenChatButton
          label="Abrir Asesor de Coches Compactos IA"
          className="btn btn-buy shine"
        />
      </div>
    </SimplePage>
  );
}
