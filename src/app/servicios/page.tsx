import { Column, Flex, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";

const servicesSeo = {
  path: "/servicios",
  title: "Servicios de IA para empresas en Argentina | BrunoDev",
  description:
    "Automatizacion con IA, chatbots para empresas y desarrollo de software a medida para pymes de Argentina y Latinoamerica.",
};

const services = [
  {
    title: "Chatbots para empresas",
    description:
      "Asistentes que responden consultas, toman datos y mejoran la velocidad de atencion en canales como web y WhatsApp.",
    keyword:
      "Keyword: chatbots para empresas en Argentina",
  },
  {
    title: "Automatizacion con IA para empresas",
    description:
      "Integraciones para eliminar tareas repetitivas, reducir errores y acelerar operaciones comerciales o administrativas.",
    keyword:
      "Keyword: automatizacion con IA para empresas en Latinoamerica",
  },
  {
    title: "Desarrollo de software a medida",
    description:
      "Aplicaciones y paneles adaptados al flujo real de tu negocio para controlar procesos, ventas y reportes.",
    keyword: "Keyword: desarrollo de software a medida en Argentina",
  },
  {
    title: "Integracion de IA en procesos de negocio",
    description:
      "Implementacion gradual de IA en ventas, soporte y operaciones, con foco en resultados medibles.",
    keyword: "Keyword: soluciones de IA para pymes",
  },
];

export async function generateMetadata() {
  return Meta.generate({
    title: servicesSeo.title,
    description: servicesSeo.description,
    baseURL,
    path: servicesSeo.path,
    image: `/api/og/generate?title=${encodeURIComponent(servicesSeo.title)}`,
  });
}

export default function ServiciosPage() {
  return (
    <Column maxWidth="m" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={servicesSeo.path}
        title={servicesSeo.title}
        description={servicesSeo.description}
        image={`/api/og/generate?title=${encodeURIComponent(servicesSeo.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column gap="m">
        <Heading as="h1" variant="display-strong-m">
          Servicios de IA y software para empresas
        </Heading>
        <Text onBackground="neutral-weak">
          Te ayudo a implementar soluciones simples que mejoran tiempos de respuesta, reducen costos operativos y escalan tus procesos.
        </Text>
      </Column>
      <Flex fillWidth mobileDirection="column" gap="16" wrap>
        {services.map((service) => (
          <Column
            key={service.title}
            flex={1}
            minWidth={16}
            padding="l"
            background="surface"
            border="neutral-alpha-weak"
            radius="l"
            gap="8"
          >
            <Heading as="h2" variant="heading-strong-l">
              {service.title}
            </Heading>
            <Text onBackground="neutral-weak">{service.description}</Text>
            <Text variant="body-default-s" onBackground="neutral-medium">
              {service.keyword}
            </Text>
          </Column>
        ))}
      </Flex>
    </Column>
  );
}
