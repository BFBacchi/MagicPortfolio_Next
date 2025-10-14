"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkExperience } from "@/lib/supabase/queries";
import { Button, Input, Textarea, Column, Dialog } from "@once-ui-system/core";
import { upsertWorkExperience } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";


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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Experiencia Laboral</h2>
        {!loading && user && (
          <Button variant="secondary" onClick={handleAddNew}>
            Añadir Experiencia
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {workExperience.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Actual'}
                </p>
                {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {!loading && user && (
                <Button variant="secondary" size="s" onClick={() => handleEdit(exp)}>
                  Editar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? 'Editar Experiencia' : 'Añadir Experiencia'}
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
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="secondary" 
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
            </div>
          </form>
        </Column>
      </Dialog>
    </div>
  );
};

export default WorkExperienceSection;
