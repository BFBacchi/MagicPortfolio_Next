"use client";

import { useEffect, useState } from "react";
import { Button, Column, Flex, Text, Tag, Icon, IconButton } from "@once-ui-system/core";
import { useAuth } from "@/contexts/AuthContext";
import { ensureExternalHref } from "@/lib/ensureExternalHref";
import styles from "./about.module.scss";

const FALLBACK_AVATAR = "/images/avatar.jpg";

function resolveAvatarSrc(url?: string): string {
  const u = (url ?? "").trim();
  if (!u) return FALLBACK_AVATAR;
  if (u.startsWith("/")) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return FALLBACK_AVATAR;
}

interface AvatarPanelProps {
  name: string;
  role: string;
  location: string;
  languages: string[];
  onEdit?: () => void;
  avatarUrl?: string;
  socialLinks?: {
    github_url?: string;
    linkedin_url?: string;
    discord_url?: string;
    email_url?: string;
  };
}

export const AvatarPanel = ({
  name,
  role,
  location,
  languages,
  onEdit,
  avatarUrl = "/images/avatar.jpg",
  socialLinks
}: AvatarPanelProps) => {
  const { user, loading } = useAuth();

  const [displaySrc, setDisplaySrc] = useState(() =>
    resolveAvatarSrc(avatarUrl)
  );

  useEffect(() => {
    setDisplaySrc(resolveAvatarSrc(avatarUrl));
  }, [avatarUrl]);

  const githubHref = ensureExternalHref(socialLinks?.github_url);
  const linkedinHref = ensureExternalHref(socialLinks?.linkedin_url);
  const discordHref = ensureExternalHref(socialLinks?.discord_url);

  return (
    <div className={styles.avatarContainer}>
      <Column gap="m" horizontal="center">
        <div className={styles.avatarWrapper}>
          {/* Once UI Avatar usa next/image; con URLs de Storage a veces queda capa negra sin imagen visible. */}
          <img
            src={displaySrc}
            alt=""
            className={styles.avatarImg}
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setDisplaySrc(FALLBACK_AVATAR)}
          />
        </div>
        <Text as="h2" variant="display-strong-s">{name}</Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          {role}
        </Text>
        <Flex gap="s" vertical="center">
          <Icon name="map-pin" size="s" onBackground="neutral-weak" />
          <Text variant="body-default-s" onBackground="neutral-weak">
            {location}
          </Text>
        </Flex>
        
        {languages.length > 0 && (
          <div className={styles.languagesContainer}>
            {languages.map((language) => (
              <Tag key={language} size="m" variant="neutral">
                {language}
              </Tag>
            ))}
          </div>
        )}

        {/* Social Links */}
        <Flex gap="s" wrap>
          {githubHref && (
            <IconButton
              href={githubHref}
              icon="github"
              tooltip="GitHub"
              size="s"
              variant="ghost"
            />
          )}
          {linkedinHref && (
            <IconButton
              href={linkedinHref}
              icon="linkedin"
              tooltip="LinkedIn"
              size="s"
              variant="ghost"
            />
          )}
          {discordHref && (
            <IconButton
              href={discordHref}
              icon="discord"
              tooltip="Discord"
              size="s"
              variant="ghost"
            />
          )}
          {socialLinks?.email_url && (
            <IconButton
              href={`mailto:${socialLinks.email_url}`}
              icon="email"
              tooltip="Email"
              size="s"
              variant="ghost"
            />
          )}
        </Flex>

        {/* Show edit button only if user is authenticated, not loading, and onEdit function is provided */}
        {!loading && user && onEdit && (
          <Button 
            variant="secondary" 
            onClick={onEdit}
            className={styles.editButton}
            prefixIcon="edit"
          >
            Editar Perfil
          </Button>
        )}
      </Column>
    </div>
  );
};
