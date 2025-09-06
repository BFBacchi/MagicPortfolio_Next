"use client";

import { Avatar, Button, Column, Flex, Text, Tag, Icon, Heading } from "@once-ui-system/core";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./about.module.scss";

interface AvatarPanelProps {
  name: string;
  role: string;
  location: string;
  languages: string[];
  onEdit?: () => void;
  avatarUrl?: string;
}

export const AvatarPanel = ({
  name,
  role,
  location,
  languages,
  onEdit,
  avatarUrl = "/images/avatar.jpg"
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
