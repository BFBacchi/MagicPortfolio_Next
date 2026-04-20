"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
  Button,
  Icon,
} from "@once-ui-system/core";
import { useLanguage } from "@/contexts/LanguageContext";
import { ensureExternalHref } from "@/lib/ensureExternalHref";

interface ProjectCardProps {
  /** Ruta interna del detalle, p. ej. `/work/mi-proyecto`. Si falta, no se muestra el enlace al caso. */
  href?: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  onEdit?: (project: any) => void;
  showEditButton?: boolean;
  project?: any; // Proyecto completo para pasar al onEdit
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  onEdit,
  showEditButton = false,
  project,
}) => {
  const { t } = useLanguage();
  const externalProjectUrl = ensureExternalHref(link);

  return (
    <Column fillWidth gap="m">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
      <Flex
        mobileDirection="column"
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex flex={5}>
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          </Flex>
        )}
        {(avatars?.length > 0 ||
          description?.trim() ||
          content?.trim() ||
          href?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="m" reverse />}
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            <Flex gap="24" wrap>
              {href?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: "0", width: "fit-content" }}
                  href={href}
                >
                  <Text variant="body-default-s">{t("project.read_case")}</Text>
                </SmartLink>
              )}
              {externalProjectUrl && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={externalProjectUrl}
                >
                  <Text variant="body-default-s">{t("project.view_external")}</Text>
                </SmartLink>
              )}
              {showEditButton && onEdit && (
                <Button
                  variant="secondary"
                  size="s"
                  onClick={() => onEdit(project || { title, content, description, images, link, href })}
                >
                  <Icon name="edit" size="s" />
                  {t("project.edit")}
                </Button>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
