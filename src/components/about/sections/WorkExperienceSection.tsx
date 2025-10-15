"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkExperience } from "@/lib/supabase/queries";
import { Button, Input, Textarea, Column, Dialog, Text, Row } from "@once-ui-system/core";
import { upsertWorkExperience } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";
import { Section } from "../Section";
import styles from "../about.module.scss";


interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  onUpdate: () => void;
}

export const WorkExperienceSection = ({ workExperience, onUpdate }: WorkExperienceSectionProps) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [formData, setFormData] = useState<Partial<WorkExperience>>({
    position: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    technologies: []
  });
  
  const [technologiesInput, setTechnologiesInput] = useState('');

  const handleEdit = (exp: WorkExperience) => {
    setEditingExp(exp);
    setFormData({
      position: exp.position,
      company: exp.company,
      description: exp.description || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      technologies: exp.technologies || []
    });
    setTechnologiesInput(exp.technologies ? exp.technologies.join(', ') : '');
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechnologiesInput(value);
    
    // Split by comma and trim whitespace from each technology
    const techArray = value
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
      
    setFormData(prev => ({
      ...prev,
      technologies: techArray
    }));
  };

  const handleAddNew = () => {
    setEditingExp(null);
    setFormData({
      position: '',
      company: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return;

      const data = {
        ...formData,
        user_id: user.id,
        id: editingExp?.id
      };

      await upsertWorkExperience(data as WorkExperience);
      addToast('Experiencia guardada correctamente', 'success');
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving work experience:', error);
      addToast('Error al guardar la experiencia', 'danger');
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
        id="work-experience"
        title="Experiencia Laboral"
        onEdit={!loading && !!user ? handleAddNew : undefined}
      >
        <div className={styles.experienceContainer}>
          {workExperience.length === 0 ? (
            <p className={styles.sectionText}>
              Agrega tu experiencia laboral para mostrar tu trayectoria profesional...
            </p>
          ) : (
            <div className={styles.experienceList}>
              {workExperience.map((exp) => (
                <div key={exp.id} className={styles.experienceItem}>
                  <div className={styles.experienceContent}>
                    <div className={styles.experienceHeader}>
                      <Text as="h3" variant="heading-strong-s" className={styles.experienceTitle}>
                        {exp.position}
                      </Text>
                      {!loading && user && (
                        <Button 
                          variant="tertiary" 
                          size="s" 
                          onClick={() => handleEdit(exp)}
                          className={styles.editButton}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                    <Text as="p" variant="body-default-m" className={styles.companyName}>
                      {exp.company}
                    </Text>
                    <Text as="p" variant="body-default-s" className={styles.dateRange}>
                      {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Actual'}
                    </Text>
                    {exp.description && (
                      <Text as="p" variant="body-default-m" className={styles.experienceDescription}>
                        {exp.description}
                      </Text>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className={styles.technologiesContainer}>
                        {exp.technologies.map((tech, idx) => (
                          <span key={idx} className={styles.technologyTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
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
        title={isEditing ? 'Editar Experiencia' : 'Añadir Experiencia'}
        description="Actualiza tu experiencia laboral"
      >
        <Column fillWidth gap="16" marginTop="12">
          <form onSubmit={handleSubmit}>
            <Column gap="16">
              <Input
                id="position"
                name="position"
                label="Puesto"
                value={formData.position}
                onChange={handleChange}
                required
              />
              <Input
                id="company"
                name="company"
                label="Empresa"
                value={formData.company}
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
              <Input
                id="technologies"
                name="technologies"
                label="Tecnologías (separadas por comas)"
                value={technologiesInput}
                onChange={handleTechnologiesChange}
                placeholder="Ej: React, Node.js, TypeScript"
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

export default WorkExperienceSection;
