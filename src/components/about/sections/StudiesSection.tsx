"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Study } from "@/lib/supabase/queries";
import { Button, Input, Textarea, Column, Dialog, Text, Row } from "@once-ui-system/core";
import { upsertStudy } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";
import { Section } from "../Section";
import styles from "../about.module.scss";

// Using 'danger' instead of 'error' to match the expected ToastVariant type
type ToastVariant = 'success' | 'danger' | 'warning' | 'info';


interface StudiesSectionProps {
  studies: Study[];
  onUpdate: () => void;
}

export const StudiesSection = ({ studies, onUpdate }: StudiesSectionProps) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [formData, setFormData] = useState<Partial<Study>>({
    degree: '',
    institution: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const handleEdit = (study: Study) => {
    setEditingStudy(study);
    setFormData({
      degree: study.degree,
      institution: study.institution,
      description: study.description || '',
      start_date: study.start_date,
      end_date: study.end_date || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingStudy(null);
    setFormData({
      degree: '',
      institution: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return;

      const data = {
        ...formData,
        user_id: user.id,
        id: editingStudy?.id
      };

      await upsertStudy(data as Study);
      addToast('Estudio guardado correctamente', 'success');
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving study:', error);
addToast('Error al guardar el estudio', 'danger');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Section
        id="studies"
        title="Estudios"
        onEdit={!loading && !!user ? handleAddNew : undefined}
      >
        <div className={styles.studiesContainer}>
          {studies.length === 0 ? (
            <p className={styles.sectionText}>
              Agrega tu formación académica y certificaciones...
            </p>
          ) : (
            <div className={styles.studiesList}>
              {studies.map((study) => (
                <div key={study.id} className={styles.studyItem}>
                  <div className={styles.studyContent}>
                    <div className={styles.studyHeader}>
                      <Text as="h3" variant="heading-strong-s" className={styles.studyTitle}>
                        {study.degree}
                      </Text>
                      {!loading && user && (
                        <Button 
                          variant="tertiary" 
                          size="s" 
                          onClick={() => handleEdit(study)}
                          className={styles.editButton}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                    <Text as="p" variant="body-default-m" className={styles.institutionName}>
                      {study.institution}
                    </Text>
                    <Text as="p" variant="body-default-s" className={styles.dateRange}>
                      {new Date(study.start_date).getFullYear()} - {study.end_date ? new Date(study.end_date).getFullYear() : 'Actual'}
                    </Text>
                    {study.description && (
                      <Text as="p" variant="body-default-m" className={styles.studyDescription}>
                        {study.description}
                      </Text>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? 'Editar Estudio' : 'Añadir Estudio'}
        description="Actualiza tu formación académica"
      >
        <Column fillWidth gap="16" marginTop="12">
          <form onSubmit={handleSubmit}>
            <Column gap="16">
              <Input
                id="degree"
                name="degree"
                label="Título o Certificación"
                value={formData.degree}
                onChange={handleChange}
                required
              />
              <Input
                id="institution"
                name="institution"
                label="Institución"
                value={formData.institution}
                onChange={handleChange}
                required
              />
              <Input
                id="start_date"
                name="start_date"
                type="date"
                label="Fecha de inicio"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
              <Input
                id="end_date"
                name="end_date"
                type="date"
                label="Fecha de finalización (deja en blanco si es actual)"
                value={formData.end_date || ''}
                onChange={handleChange}
              />
              <Textarea
                id="description"
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </Column>
            
            <Row fillWidth vertical="center" gap="8" style={{ justifyContent: "flex-end", marginTop: "24px" }}>
              <Button 
                variant="tertiary" 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setIsDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </Row>
          </form>
        </Column>
      </Dialog>
    </>
  );
};

export default StudiesSection;
