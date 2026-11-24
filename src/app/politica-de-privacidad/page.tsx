import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Privacidad | PaseoCompacto.com",
  description: `Política de privacidad y protección de datos personales de PaseoCompacto.com, gestionado por ${LEGAL_OWNER} (${LEGAL_LOCATION}).`,
  alternates: { canonical: `${SITE_URL}/politica-de-privacidad/` },
};

export default function PrivacidadPage() {
  return (
    <SimplePage
      title="Política de Privacidad"
      crumb="Política de privacidad"
      href="/politica-de-privacidad/"
      intro="Cómo protegemos y tratamos la información de navegación y las consultas realizadas en PaseoCompacto.com."
    >
      <h2>1. Responsable del tratamiento de datos</h2>
      <ul>
        <li>
          <strong>Titular responsable:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio legal:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico para ejercicio de derechos:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <h2>2. Qué datos recopilamos y con qué finalidad</h2>
      <p>
        En PaseoCompacto.com no exigimos registro de cuenta ni recopilamos datos
        bancarios o de tarjetas. Únicamente tratamos la información mínima
        necesaria para brindar el servicio:
      </p>
      <ul>
        <li>
          <strong>Consultas en el Asesor IA en línea:</strong> los mensajes que
          envías voluntariamente al chat para consultar por modelos Ingenuity,
          Kolcraft, Doona, espacio en maletera o accesorios se almacenan junto a
          un identificador anónimo de sesión y la URL de origen con el fin de
          responder tu duda y mejorar las guías del portal. Te recomendamos no
          compartir datos personales sensibles en el chat.
        </li>
        <li>
          <strong>Comunicaciones por correo electrónico:</strong> si escribes a{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>, tus datos de
          contacto se usarán exclusivamente para responder tu consulta.
        </li>
        <li>
          <strong>Métricas técnicas y atribución de enlaces:</strong> registro
          agregado de clics hacia artículos internos y enlaces de Amazon
          Associates.
        </li>
      </ul>

      <h2>3. Normativa aplicable y derechos del usuario</h2>
      <p>
        Respetamos los principios de la Ley N.º 29733 (Ley de Protección de
        Datos Personales del Perú), así como los estándares internacionales del
        RGPD europeo y leyes estatales de privacidad aplicables en EE. UU.
        Puedes solicitar el acceso, rectificación o eliminación de cualquier
        información asociada escribiendo a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
