"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Study } from "@/lib/supabase/queries";
import { Button, Input, Textarea, Column } from "@once-ui-system/core";
import { upsertStudy } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";

// Using 'danger' instead of 'error' to match the expected ToastVariant type
type ToastVariant = 'success' | 'danger' | 'warning' | 'info';

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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Estudios</h2>
        {!loading && user && (
          <Button variant="secondary" onClick={handleAddNew}>
            Añadir Estudio
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {studies.map((study) => (
          <div key={study.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{study.degree}</h3>
                <p className="text-gray-600">{study.institution}</p>
                <p className="text-sm text-gray-500">
                  {new Date(study.start_date).getFullYear()} - {study.end_date ? new Date(study.end_date).getFullYear() : 'Actual'}
                </p>
                {study.description && <p className="mt-2 text-gray-700">{study.description}</p>}
              </div>
              {!loading && user && (
                <Button variant="secondary" size="s" onClick={() => handleEdit(study)}>
                  Editar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isEditing ? 'Editar Estudio' : 'Añadir Estudio'}</h2>
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            {isEditing 
              ? 'Actualiza los detalles de tu formación académica.'
              : 'Añade un nuevo estudio o certificación a tu perfil.'}
          </p>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <Column gap="4" className="py-4">
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

export default StudiesSection;
