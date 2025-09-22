"use client";

import { Avatar, Button, Column, Flex, Text, Tag, Icon, Heading, IconButton } from "@once-ui-system/core";
import { useAuth } from "@/contexts/AuthContext";
import { social } from "@/resources";
import styles from "./about.module.scss";

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

  // Debug: Log the user object to check if it's being retrieved correctly
  console.log('AvatarPanel - user:', user);
  console.log('AvatarPanel - loading:', loading);
  console.log('AvatarPanel - should show edit button:', !loading && user && onEdit);
  console.log('AvatarPanel - avatarUrl:', avatarUrl);
  console.log('AvatarPanel - avatarUrl type:', typeof avatarUrl);
  console.log('AvatarPanel - avatarUrl valid:', avatarUrl && avatarUrl.startsWith('http'));

  return (
    <div className={styles.avatarContainer}>
      <Column gap="m" horizontal="center">
        <div className={styles.avatarWrapper}>
          <Avatar 
            src={avatarUrl && avatarUrl.startsWith('http') ? avatarUrl : "/images/avatar.jpg"} 
            size="xl"
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
          {socialLinks?.github_url && (
            <IconButton
              href={socialLinks.github_url}
              icon="github"
              tooltip="GitHub"
              size="s"
              variant="ghost"
            />
          )}
          {socialLinks?.linkedin_url && (
            <IconButton
              href={socialLinks.linkedin_url}
              icon="linkedin"
              tooltip="LinkedIn"
              size="s"
              variant="ghost"
            />
          )}
          {socialLinks?.discord_url && (
            <IconButton
              href={socialLinks.discord_url}
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
