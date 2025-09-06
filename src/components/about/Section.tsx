"use client";

import { useState } from "react";
import { Column, Flex, Text, Button, Icon } from "@once-ui-system/core";
import { EditForm } from "./EditForm";
import styles from "./about.module.scss";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  editFields?: Array<{
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date';
    required?: boolean;
  }>;
  onSave?: (data: any) => Promise<void>;
  initialData?: any;
}

export const Section = ({
  id,
  title,
  children,
  onEdit,
  editFields,
  onSave,
  initialData = {},
}: SectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" variant="display-strong-m">
          {title}
        </Text>
        {onEdit && !isEditing && (
          <Button 
            variant="tertiary"
            size="s"
            onClick={onEdit}
          >
            <Icon name="edit" size="s" />
            <span>Editar</span>
          </Button>
        )}
      </div>
      
      {isEditing && editFields ? (
        <div className={styles.editForm}>
          <EditForm
            initialData={initialData}
            fields={editFields}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className={styles.sectionContent}>
          {children}
        </div>
      )}
    </section>
  );
};
