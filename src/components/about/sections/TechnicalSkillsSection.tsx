"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TechnicalSkill } from "@/lib/supabase/queries";
import { Button, Input, Column, Select } from "@once-ui-system/core";
import { upsertTechnicalSkill } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";

// Custom Dialog component to avoid type issues with the UI library
const Dialog = ({ 
  open, 
  onOpenChange, 
  children 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  children: React.ReactNode 
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

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
      name: skill.name,
      level: skill.level,
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

      const data = {
        ...formData,
        user_id: user.id,
        id: editingSkill?.id
      };

      await upsertTechnicalSkill(data as TechnicalSkill);
      addToast('Habilidad guardada correctamente', 'success');
      setIsDialogOpen(false);
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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Habilidades Técnicas</h2>
        {!loading && user && (
          <Button variant="secondary" onClick={handleAddNew}>
            Añadir Habilidad
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{skill.name}</h4>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              skill.level === 'beginner' ? 'bg-blue-400 w-1/4' :
                              skill.level === 'intermediate' ? 'bg-blue-500 w-1/2' :
                              skill.level === 'advanced' ? 'bg-blue-600 w-3/4' :
                              'bg-blue-700 w-full'
                            }`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {getSkillLevelLabel(skill.level)}
                        </span>
                      </div>
                    </div>
                    {!loading && user && (
                      <Button 
                        variant="secondary" 
                        size="s" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleEdit(skill);
                        }}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isEditing ? 'Editar Habilidad' : 'Añadir Habilidad'}</h2>
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            {isEditing ? 'Actualiza los detalles de tu habilidad' : 'Añade una nueva habilidad técnica'}
          </p>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <Column gap="4" className="py-4">
              <Input
                name="name"
                label="Nombre de la habilidad"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full"
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              </div>
              
              <Input
                name="category"
                label="Categoría (ej: Frontend, Backend, Herramientas, etc.)"
                value={formData.category}
                onChange={handleChange}
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
        </div>
      </Dialog>
    </div>
  );
};

export default TechnicalSkillsSection;
