"use client";

import { useState } from "react";
import { Button, Input, Text, Flex } from "@once-ui-system/core";
import styles from "./about.module.scss";

interface EditFormProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  fields: Array<{
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date';
    required?: boolean;
  }>;
}

export const EditForm = ({ initialData, onSave, onCancel, fields }: EditFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formFields}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formField}>
            <Text as="label" htmlFor={field.name} variant="body-default-m" onBackground="neutral-strong">
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </Text>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                rows={4} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--neutral-alpha-medium)'}}
                className={styles.formInput}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className={styles.formInput}
              />
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <div className={styles.buttonsContainer}>
            <Button 
              variant="tertiary" 
              onClick={onCancel} 
              type="button"
              disabled={isSubmitting}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="primary"
              className={styles.submitButton}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
