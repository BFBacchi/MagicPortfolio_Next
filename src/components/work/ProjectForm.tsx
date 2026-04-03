"use client";

import { useState } from 'react';
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
import { MediaUpload } from '@once-ui-system/core/modules';
import { Project } from '@/lib/supabase';
import { uploadProjectImage, getYouTubeThumbnail } from '@/lib/supabase/storage';
import { createProject, updateProject } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (!user) return;

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
      addToast(t("projectForm.image_ok"), "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast(t("projectForm.image_err"), "error");
    } finally {
      setUploadingImages(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
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
    if (!user) {
      addToast(t("projectForm.auth_required"), "error");
      return;
    }

    setIsLoading(true);
    try {
      const projectData = {
        ...formData,
        images,
        published_at: project?.published_at || new Date().toISOString(),
        video_thumbnail: formData.video_url ? getYouTubeThumbnail(formData.video_url) : undefined
      };

      console.log('Submitting project data:', {
        isEditing,
        projectId: project?.id,
        projectData
      });

      let savedProject: Project;
      if (isEditing && project) {
        console.log('Updating project with ID:', project.id);
        savedProject = await updateProject(project.id, projectData);
      } else {
        console.log('Creating new project');
        savedProject = await createProject(projectData);
      }

      addToast(
        isEditing ? t("projectForm.saved_update") : t("projectForm.saved_create"),
        "success"
      );
      onSave(savedProject);
    } catch (error) {
      console.error('Error saving project:', error);
      
      // Mensaje de error más descriptivo
      let errorMessage = t("projectForm.save_error");
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;

        if (errorMessage.includes("permission") || errorMessage.includes("policy")) {
          errorMessage = t("projectForm.err_rls");
        } else if (
          errorMessage.includes("authentication") ||
          errorMessage.includes("auth")
        ) {
          errorMessage = t("projectForm.err_auth");
        } else if (
          errorMessage.includes("duplicate") ||
          errorMessage.includes("unique")
        ) {
          errorMessage = t("projectForm.err_slug");
        }
      }
      
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Column gap="l">

      <Row gap="l">
        <Column flex={1} gap="m">
          <Input
            id="project-title"
            label={t("projectForm.title")}
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            description={t("projectForm.title_hint")}
            required
          />

          <Input
            id="project-slug"
            label={t("projectForm.slug")}
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            description={t("projectForm.slug_hint")}
            required
          />

          <Textarea
            id="project-summary"
            label={t("projectForm.summary")}
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            description={t("projectForm.summary_hint")}
            rows={3}
            required
          />

          <Textarea
            id="project-content"
            label={t("projectForm.content")}
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            description={t("projectForm.content_hint")}
            rows={8}
          />

          <Input
            id="project-link"
            label={t("projectForm.link")}
            value={formData.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            description="https://example.com"
          />

          <Input
            id="project-video"
            label={t("projectForm.video")}
            value={formData.video_url}
            onChange={(e) => handleInputChange("video_url", e.target.value)}
            description={t("projectForm.video_hint")}
          />
        </Column>

        <Column flex={1} gap="m">
          <Input
            id="project-tag"
            label={t("projectForm.tag")}
            value={formData.tag}
            onChange={(e) => handleInputChange("tag", e.target.value)}
            description={t("projectForm.tag_hint")}
          />

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              {t("projectForm.tech_heading")}
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
                id="new-technology"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder={t("projectForm.tech_placeholder")}
                onKeyPress={(e) => e.key === "Enter" && handleAddTechnology()}
              />
              <Button
                variant="secondary"
                size="s"
                onClick={handleAddTechnology}
                disabled={!newTechnology.trim()}
              >
                {t("projectForm.add")}
              </Button>
            </Flex>
          </div>

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              {t("projectForm.status_heading")}
            </Text>
            <Flex gap="s" marginTop="s">
              {(["draft", "published", "archived"] as const).map((status) => (
                <Button
                  key={status}
                  variant={formData.status === status ? "primary" : "secondary"}
                  size="s"
                  onClick={() => handleInputChange("status", status)}
                >
                  {status === "draft"
                    ? t("projectForm.status_draft")
                    : status === "published"
                      ? t("projectForm.status_published")
                      : t("projectForm.status_archived")}
                </Button>
              ))}
            </Flex>
          </div>

          <div>
            <Text variant="body-default-s" onBackground="neutral-strong">
              {t("projectForm.options")}
            </Text>
            <Flex gap="s" marginTop="s">
              <Button
                variant={formData.featured ? "primary" : "secondary"}
                size="s"
                onClick={() => handleInputChange("featured", !formData.featured)}
              >
                <Icon name="star" size="s" />
                {t("projectForm.featured")}
              </Button>
            </Flex>
          </div>
        </Column>
      </Row>

      {/* Sección de imágenes */}
      <Column gap="m">
        <Text variant="body-default-s" onBackground="neutral-strong">
          {t("projectForm.images_heading")}
        </Text>
        <Row gap="m">
          {[0, 1].map((index) => (
            <Column key={index} flex={1} gap="s">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {t("projectForm.image_n", { n: index + 1 })}
              </Text>
              <MediaUpload
                initialPreviewImage={images[index] || null}
                onFileUpload={async (file) => {
                  await handleImageUpload(file, index);
                }}
                loading={uploadingImages[index]}
                accept="image/*"
                aspectRatio="16/9"
                emptyState={
                  <Column gap="8" fill center align="center" padding="l">
                    <Icon name="image" size="m" onBackground="neutral-weak" />
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {uploadingImages[index]
                        ? t("projectForm.uploading")
                        : t("projectForm.upload_image")}
                    </Text>
                  </Column>
                }
              />
              {images[index] && (
                <Flex gap="s" marginTop="s">
                  <Button
                    variant="danger"
                    size="s"
                    onClick={() => handleRemoveImage(index)}
                    disabled={uploadingImages[index]}
                  >
                    <Icon name="trash" size="s" />
                    {t("projectForm.remove")}
                  </Button>
                </Flex>
              )}
            </Column>
          ))}
        </Row>
      </Column>

      {/* Botones de acción */}
      <Flex gap="m" horizontal="end">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {t("cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !formData.title || !formData.slug}
        >
          {isLoading ? (
            <>
              <Icon name="loading" size="s" />
              {t("projectForm.saving")}
            </>
          ) : isEditing ? (
            t("projectForm.update")
          ) : (
            t("projectForm.create")
          )}
        </Button>
      </Flex>
    </Column>
  );
};
