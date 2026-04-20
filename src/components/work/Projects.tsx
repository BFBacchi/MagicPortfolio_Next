"use client";

import { useState, useEffect } from 'react';
import { Column, Row, Heading, Button, Icon, RevealFx, Flex, Text, Dialog } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import {
  Project,
  getProjectsFromDB,
  deleteProject,
  type ProjectsOrderBy,
} from "@/lib/supabase";
import { ProjectForm } from "./ProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { person } from "@/resources";
import { hrefForWorkProject } from "@/lib/projects";

interface ProjectsProps {
  range?: [number, number?];
  showManagementButtons?: boolean;
  /** En inicio suele usarse `created_at` para mostrar el último proyecto creado primero. */
  orderBy?: ProjectsOrderBy;
}

export function Projects({
  range,
  showManagementButtons = false,
  orderBy,
}: ProjectsProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, [orderBy]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await getProjectsFromDB(
        orderBy ? { orderBy } : undefined
      );
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      addToast(t("work.load_error"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setShowAddForm(true);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowAddForm(false);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!user) return;
    
    if (
      confirm(t("work.delete_confirm", { title: project.title }))
    ) {
      try {
        await deleteProject(project.id);
        setProjects(prev => prev.filter(p => p.id !== project.id));
        addToast(t("work.deleted_ok"), "success");
      } catch (error) {
        console.error("Error deleting project:", error);
        addToast(t("work.delete_error"), "error");
      }
    }
  };

  const handleSaveProject = (savedProject: Project) => {
    if (editingProject) {
      // Actualizar proyecto existente
      setProjects(prev => prev.map(p => p.id === savedProject.id ? savedProject : p));
    } else {
      // Agregar nuevo proyecto
      setProjects(prev => [savedProject, ...prev]);
    }
    
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProject(null);
  };

  const displayedProjects = range
    ? projects.slice(range[0] - 1, range[1] ?? projects.length)
    : projects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {/* Header con título y botón de añadir proyecto */}
      {showManagementButtons && user && (
        <RevealFx fillWidth horizontal="start" paddingBottom="24">
          <Row 
            fillWidth 
            horizontal="space-between" 
            vertical="center"
            gap="16"
          >
            <Heading variant="display-strong-xs" wrap="balance">
              {t("work.page_heading", { name: person.name })}
            </Heading>
            <Button
              variant="primary"
              size="m"
              weight="default"
              arrowIcon={false}
              className="shrink-0"
              onClick={handleAddProject}
            >
              <Flex gap="8" vertical="center">
                <Icon name="plus" size="s" />
                {t("work.add_project")}
              </Flex>
            </Button>
          </Row>
        </RevealFx>
      )}

      {/* Lista de proyectos */}
      {displayedProjects.length === 0 ? (
        <RevealFx fillWidth horizontal="center" paddingY="xl">
          <Column align="center" gap="m">
            <Text variant="body-default-m" onBackground="neutral-weak">
              {t("work.no_projects")}
            </Text>
            {showManagementButtons && user && (
              <Button variant="secondary" onClick={handleAddProject}>
                <Flex gap="8" vertical="center">
                  <Icon name="plus" size="s" />
                  {t("work.create_first")}
                </Flex>
              </Button>
            )}
          </Column>
        </RevealFx>
      ) : (
        displayedProjects.map((project, index) => (
          <RevealFx key={project.slug} delay={0.1 * index} horizontal="start">
            <ProjectCard
              priority={index < 2}
              href={hrefForWorkProject(project.slug)}
              images={project.images}
              title={project.title}
              description={project.summary}
              content={project.content}
              avatars={[]} // We'll need to add team members to the database if needed
              link={project.link || ""}
              onEdit={user && showManagementButtons ? handleEditProject : undefined}
              showEditButton={!!(user && showManagementButtons)}
              project={project}
            />
          </RevealFx>
        ))
      )}

      {/* Modal para agregar/editar proyecto */}
      {showManagementButtons && user && (
        <Dialog
          isOpen={showAddForm || editingProject !== null}
          onClose={handleCancel}
          title={
            editingProject ? t("work.dialog_edit") : t("work.dialog_new")
          }
          maxWidth={80}
        >
          <ProjectForm
            project={editingProject || undefined}
            onSave={handleSaveProject}
            onCancel={handleCancel}
            isEditing={!!editingProject}
          />
        </Dialog>
      )}
    </Column>
  );
}
