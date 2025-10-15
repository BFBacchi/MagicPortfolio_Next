"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TechnicalSkill } from "@/lib/supabase/queries";
import { Button, Input, Column, Dialog, Text, Row } from "@once-ui-system/core";
import { upsertTechnicalSkill } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";
import { Section } from "../Section";
import styles from "../about.module.scss";


const skillLevels = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' },
];

interface TechnicalSkillsSectionProps {
  technicalSkills: TechnicalSkill[];
  onUpdate: () => void;
}

export const TechnicalSkillsSection = ({ technicalSkills, onUpdate }: TechnicalSkillsSectionProps) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<TechnicalSkill | null>(null);
  const [formData, setFormData] = useState<Partial<TechnicalSkill>>({
    name: '',
    level: 'intermediate',
    category: ''
  });

  const handleEdit = (skill: TechnicalSkill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      level: skill.level || 'intermediate',
      category: skill.category || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      level: 'intermediate',
      category: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return;

      // Ensure all required fields are present
      const data: Partial<TechnicalSkill> = {
        name: formData.name || '',
        level: formData.level || 'intermediate',
        category: formData.category || '',
        user_id: user.id,
        ...(editingSkill?.id && { id: editingSkill.id })
      };

      console.log('Saving technical skill:', data); // Debug log
      
      await upsertTechnicalSkill(data as TechnicalSkill);
      addToast('Habilidad guardada correctamente', 'success');
      
      // Reset form and close modal
      setIsDialogOpen(false);
      setEditingSkill(null);
      setFormData({
        name: '',
        level: 'intermediate',
        category: ''
      });
      setIsEditing(false);
      
      onUpdate();
    } catch (error) {
      console.error('Error saving technical skill:', error);
      addToast('Error al guardar la habilidad', 'danger');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSkillLevelLabel = (level: string) => {
    const found = skillLevels.find(l => l.value === level);
    return found ? found.label : level;
  };

  // Group skills by category
  const skillsByCategory = technicalSkills.reduce((acc, skill) => {
    const category = skill.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  return (
    <>
      <Section
        id="technical-skills"
        title="Habilidades Técnicas"
      >
        <div className={styles.skillsHeader}>
          {!loading && user && (
            <Button 
              variant="primary" 
              onClick={handleAddNew}
              className={styles.addSkillButton}
            >
              + Añadir Habilidad
            </Button>
          )}
        </div>
        <div className={styles.skillsContainer}>
          {technicalSkills.length === 0 ? (
            <p className={styles.sectionText}>
              Agrega tus habilidades técnicas y competencias...
            </p>
          ) : (
            <div className={styles.skillsList}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className={styles.skillCategory}>
                  <Text as="h3" variant="heading-strong-s" className={styles.categoryTitle}>
                    {category}
                  </Text>
                  <div className={styles.skillsGrid}>
                    {skills.map((skill) => (
                      <div key={skill.id} className={styles.skillItem}>
                        <div className={styles.skillContent}>
                          <div className={styles.skillHeader}>
                            <Text as="h4" variant="body-strong-m" className={styles.skillName}>
                              {skill.name}
                            </Text>
                            {!loading && user && (
                              <Button 
                                variant="tertiary" 
                                size="s" 
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  handleEdit(skill);
                                }}
                                className={styles.editButton}
                              >
                                Editar
                              </Button>
                            )}
                          </div>
                          <div className={styles.skillLevelContainer}>
                            <div className={styles.skillLevelBar}>
                              <div 
                                className={`${styles.skillLevelFill} ${
                                  skill.level === 'beginner' ? styles.beginner :
                                  skill.level === 'intermediate' ? styles.intermediate :
                                  skill.level === 'advanced' ? styles.advanced :
                                  styles.expert
                                }`}
                              ></div>
                            </div>
                            <Text as="span" variant="body-default-xs" className={styles.skillLevelLabel}>
                              {getSkillLevelLabel(skill.level)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSkill(null);
          setFormData({
            name: '',
            level: 'intermediate',
            category: ''
          });
          setIsEditing(false);
        }}
        title={isEditing ? 'Editar Habilidad' : 'Añadir Habilidad'}
        description="Actualiza tus habilidades técnicas"
      >
        <Column fillWidth gap="16" marginTop="12">
          <form onSubmit={handleSubmit}>
            <Column gap="16">
              <Input
                name="name"
                label="Nombre de la habilidad"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <select
                  name="level"
                  value={formData.level || 'intermediate'}
                  onChange={handleChange}
                  className={styles.skillLevelSelect}
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                name="category"
                label="Categoría (ej: Frontend, Backend, Herramientas, etc.)"
                value={formData.category || ''}
                onChange={handleChange}
              />
            </Column>
            
            <Row fillWidth vertical="center" gap="8" style={{ justifyContent: "flex-end", marginTop: "24px" }}>
              <Button 
                variant="tertiary" 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setIsDialogOpen(false);
                  setEditingSkill(null);
                  setFormData({
                    name: '',
                    level: 'intermediate',
                    category: ''
                  });
                  setIsEditing(false);
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

export default TechnicalSkillsSection;
