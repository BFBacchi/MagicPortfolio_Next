import { Column, Meta, Schema } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { baseURL, person } from "@/resources";

const contactSeo = {
  path: "/contacto",
  title: "Contacto | Agencia IA y software en Argentina",
  description:
    "Pedi una propuesta para automatizacion con IA, chatbots para empresas y software a medida. Respuesta en menos de 24 horas.",
};

export async function generateMetadata() {
  return Meta.generate({
    title: contactSeo.title,
    description: contactSeo.description,
    baseURL,
    path: contactSeo.path,
    image: `/api/og/generate?title=${encodeURIComponent(contactSeo.title)}`,
  });
}

export default function ContactoPage() {
  return (
    <Column maxWidth="s">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={contactSeo.title}
        description={contactSeo.description}
        path={contactSeo.path}
        image={`/api/og/generate?title=${encodeURIComponent(contactSeo.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Mailchimp display />
    </Column>
  );
}
