"use client";

import { useState, useRef } from 'react';
import { 
  Column, 
  Row, 
  Button, 
  Input, 
  Textarea, 
  Text, 
  Icon,
  Flex,
  Tag
} from '@once-ui-system/core';
import { Project } from '@/lib/supabase';
import { uploadProjectImage, getYouTubeThumbnail } from '@/lib/supabase/storage';
import { createProject, updateProject } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    summary: project?.summary || '',
    content: project?.content || '',
    tag: project?.tag || '',
    link: project?.link || '',
    video_url: project?.video_url || '',
    technologies: project?.technologies || [],
    featured: project?.featured || false,
    status: project?.status || 'published' as 'draft' | 'published' | 'archived'
  });

  const [images, setImages] = useState<string[]>(project?.images || []);
  const [newTechnology, setNewTechnology] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (!user) return;

    setIsLoading(true);
    setUploadingImages(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    try {
      const imageUrl = await uploadProjectImage(file, formData.slug || 'temp', index);
      setImages(prev => {
        const newImages = [...prev];
        newImages[index] = imageUrl;
        return newImages;
      });
      addToast('Imagen subida exitosamente', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast('Error al subir la imagen', 'error');
    } finally {
      setUploadingImages(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const projectData = {
        ...formData,
        images,
        published_at: project?.published_at || new Date().toISOString(),
        video_thumbnail: formData.video_url ? getYouTubeThumbnail(formData.video_url) : undefined
      };

      let savedProject: Project;
      if (isEditing && project) {
        savedProject = await updateProject(project.id, projectData);
      } else {
        savedProject = await createProject(projectData);
      }

      addToast(
        isEditing ? 'Proyecto actualizado exitosamente' : 'Proyecto creado exitosamente',
        'success'
      );
      onSave(savedProject);
    } catch (error) {
      console.error('Error saving project:', error);
      addToast('Error al guardar el proyecto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Column gap="l">

      <Row gap="l">
        <Column flex={1} gap="m">
          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título del proyecto"
            required
          />

          <Input
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="url-del-proyecto"
            required
          />

          <Textarea
            label="Resumen"
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Breve descripción del proyecto"
            rows={3}
            required
          />

          <Textarea
            label="Contenido (Markdown)"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Contenido completo del proyecto en Markdown"
            rows={8}
          />

          <Input
            label="Enlace del proyecto"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            placeholder="https://ejemplo.com"
          />

          <Input
            label="URL del video de YouTube"
            value={formData.video_url}
            onChange={(e) => handleInputChange('video_url', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Column>

        <Column flex={1} gap="m">
          <Input
            label="Etiqueta"
            value={formData.tag}
            onChange={(e) => handleInputChange('tag', e.target.value)}
            placeholder="web-development"
          />

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              Tecnologías
            </Text>
            <Flex gap="s" wrap marginTop="s">
              {formData.technologies.map((tech) => (
                <Tag key={tech} size="s" variant="neutral">
                  {tech}
                  <button
                    onClick={() => handleRemoveTechnology(tech)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Tag>
              ))}
            </Flex>
            <Flex gap="s" marginTop="s">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Agregar tecnología"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
              />
              <Button
                variant="secondary"
                size="s"
                onClick={handleAddTechnology}
                disabled={!newTechnology.trim()}
              >
                Agregar
              </Button>
            </Flex>
          </div>

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              Estado
            </Text>
            <Flex gap="s" marginTop="s">
              {(['draft', 'published', 'archived'] as const).map((status) => (
                <Button
                  key={status}
                  variant={formData.status === status ? 'primary' : 'secondary'}
                  size="s"
                  onClick={() => handleInputChange('status', status)}
                >
                  {status === 'draft' ? 'Borrador' : 
                   status === 'published' ? 'Publicado' : 'Archivado'}
                </Button>
              ))}
            </Flex>
          </div>

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              Opciones
            </Text>
            <Flex gap="s" marginTop="s">
              <Button
                variant={formData.featured ? 'primary' : 'secondary'}
                size="s"
                onClick={() => handleInputChange('featured', !formData.featured)}
              >
                <Icon name="star" size="s" />
                Destacado
              </Button>
            </Flex>
          </div>
        </Column>
      </Row>

      {/* Sección de imágenes */}
      <div>
        <Text variant="body-default-s" onBackground="neutral-strong">
          Imágenes del proyecto (máximo 2)
        </Text>
        <Row gap="m" marginTop="s">
          {[0, 1].map((index) => (
            <Column key={index} flex={1} gap="s">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Imagen {index + 1}
              </Text>
              {images[index] ? (
                <div className="relative">
                  <img
                    src={images[index]}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <input
                      ref={(el) => fileInputRefs.current[index] = el}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, index);
                      }}
                      className="hidden"
                      aria-label={`Cambiar imagen ${index + 1} del proyecto`}
                      title={`Cambiar imagen ${index + 1} del proyecto`}
                    />
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => fileInputRefs.current[index]?.click()}
                      disabled={uploadingImages[index]}
                      title="Cambiar imagen"
                    >
                      <Icon name="edit" size="xs" />
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={() => handleRemoveImage(index)}
                      title="Eliminar imagen"
                    >
                      <Icon name="trash" size="xs" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                  <input
                    ref={(el) => fileInputRefs.current[index] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, index);
                    }}
                    className="hidden"
                    aria-label={`Subir imagen ${index + 1} para el proyecto`}
                    title={`Subir imagen ${index + 1} para el proyecto`}
                  />
                  <Button
                    variant="secondary"
                    size="s"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={uploadingImages[index]}
                  >
                    {uploadingImages[index] ? (
                      <>
                        <Icon name="loading" size="s" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Icon name="upload" size="s" />
                        Subir imagen
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Column>
          ))}
        </Row>
      </div>

      {/* Botones de acción */}
      <Flex gap="m" justify="end">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !formData.title || !formData.slug}
        >
          {isLoading ? (
            <>
              <Icon name="loading" size="s" />
              Guardando...
            </>
          ) : (
            isEditing ? 'Actualizar' : 'Crear'
          )}
        </Button>
      </Flex>
    </Column>
  );
};
