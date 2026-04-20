"use client";

import {
  Heading,
  Flex,
  Text,
  Button,
  RevealFx,
  Column,
  Badge,
  Row,
} from "@once-ui-system/core";
import { home, about, person } from "@/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./homeIntro.module.scss";

type HomeIntroProps = {
  /** Desde Supabase (`introduction.avatar_url`) o ruta estática; si no viene, usa `person.avatar`. */
  aboutCtaAvatarSrc?: string;
};

export function HomeIntro({ aboutCtaAvatarSrc }: HomeIntroProps) {
  const { t } = useLanguage();
  const ctaAvatarSrc =
    aboutCtaAvatarSrc?.trim() || person.avatar || "/favicon.ico";

  return (
    <Column maxWidth="s">
      {home.featured.display && (
        <RevealFx
          fillWidth
          horizontal="start"
          paddingTop="16"
          paddingBottom="32"
          paddingLeft="12"
        >
          <Badge
            background="brand-alpha-weak"
            paddingX="12"
            paddingY="4"
            onBackground="neutral-strong"
            textVariant="label-default-s"
            arrow={false}
            href={home.featured.href}
            onClick={(e) => {
              e.preventDefault();
              window.open(home.featured.href, "_blank", "noopener,noreferrer");
            }}
          >
            <Row paddingY="2" gap="4" vertical="center">
              <Text as="span" variant="label-default-s">
                {t("home.featured_prefix")}{" "}
              </Text>
              <Text as="span" variant="label-default-s" weight="strong">
                {t("home.featured_highlight")}
              </Text>
            </Row>
          </Badge>
        </RevealFx>
      )}
      <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
        <Heading wrap="balance" variant="display-strong-l">
          {t("home.headline")}
        </Heading>
      </RevealFx>
      <RevealFx
        translateY="8"
        delay={0.2}
        fillWidth
        horizontal="start"
        paddingBottom="32"
      >
        <Text
          wrap="balance"
          onBackground="neutral-weak"
          variant="heading-default-xl"
          style={{ whiteSpace: "pre-line" }}
        >
          {t("home.subline")}
        </Text>
      </RevealFx>
      <RevealFx paddingTop="12" delay={0.4} horizontal="start" paddingLeft="12">
        <Button
          id="about"
          data-border="rounded"
          href={about.path}
          variant="secondary"
          size="m"
          weight="default"
          arrowIcon
        >
          <Flex gap="8" vertical="center" paddingRight="4">
            {about.avatar.display && (
              <img
                src={ctaAvatarSrc}
                alt=""
                className={styles.aboutCtaAvatar}
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            )}
            {t("home.about_cta", { name: person.name })}
          </Flex>
        </Button>
      </RevealFx>
    </Column>
  );
}
