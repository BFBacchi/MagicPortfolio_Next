"use client";

import { Button, Column, Flex, Heading, RevealFx, Text } from "@once-ui-system/core";
import { useLanguage } from "@/contexts/LanguageContext";

const serviceIcons = ["🤖", "⚙️", "💻", "📈"] as const;

export function HomeBusinessSections() {
  const { t } = useLanguage();

  const services = [
    {
      title: t("home.service_1_title"),
      description: t("home.service_1_desc"),
      useCase: t("home.service_1_case"),
    },
    {
      title: t("home.service_2_title"),
      description: t("home.service_2_desc"),
      useCase: t("home.service_2_case"),
    },
    {
      title: t("home.service_3_title"),
      description: t("home.service_3_desc"),
      useCase: t("home.service_3_case"),
    },
    {
      title: t("home.service_4_title"),
      description: t("home.service_4_desc"),
      useCase: t("home.service_4_case"),
    },
  ];

  const strengths = [
    { title: t("home.why_1_title"), description: t("home.why_1_desc") },
    { title: t("home.why_2_title"), description: t("home.why_2_desc") },
    { title: t("home.why_3_title"), description: t("home.why_3_desc") },
  ];

  return (
    <Column fillWidth gap="xl" paddingX="l">
      <RevealFx horizontal="start">
        <Column fillWidth gap="m">
          <Heading as="h2" variant="display-strong-xs">
            {t("home.services_title")}
          </Heading>
          <Text onBackground="neutral-weak">{t("home.services_subtitle")}</Text>
          <Flex fillWidth mobileDirection="column" gap="16" wrap>
            {services.map((service, index) => (
              <Column
                key={service.title}
                flex={1}
                minWidth={14}
                padding="l"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="12"
              >
                <Text variant="heading-default-xl">
                  {serviceIcons[index]} {service.title}
                </Text>
                <Text onBackground="neutral-weak">{service.description}</Text>
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {service.useCase}
                </Text>
              </Column>
            ))}
          </Flex>
        </Column>
      </RevealFx>

      <RevealFx delay={0.1} horizontal="start">
        <Column fillWidth gap="m">
          <Heading as="h2" variant="display-strong-xs">
            {t("home.why_title")}
          </Heading>
          <Flex fillWidth mobileDirection="column" gap="16" wrap>
            {strengths.map((strength) => (
              <Column
                key={strength.title}
                flex={1}
                minWidth={16}
                padding="l"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="8"
              >
                <Text variant="heading-default-m">{strength.title}</Text>
                <Text onBackground="neutral-weak">{strength.description}</Text>
              </Column>
            ))}
          </Flex>
        </Column>
      </RevealFx>

      <RevealFx delay={0.2} horizontal="start">
        <Column
          fillWidth
          padding="xl"
          radius="l"
          border="brand-alpha-medium"
          background="brand-alpha-weak"
          gap="12"
        >
          <Heading as="h2" variant="display-strong-xs">
            {t("home.cta_title")}
          </Heading>
          <Text onBackground="neutral-weak">{t("home.cta_desc")}</Text>
          <Flex gap="12" mobileDirection="column" vertical="center">
            <Button href="/contacto" variant="primary" size="m">
              {t("home.cta_button")}
            </Button>
            <Text variant="body-default-s" onBackground="neutral-medium">
              {t("home.cta_trust")}
            </Text>
          </Flex>
        </Column>
      </RevealFx>
    </Column>
  );
}
