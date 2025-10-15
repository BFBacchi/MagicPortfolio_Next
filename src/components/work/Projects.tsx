"use client";

import { useState, useEffect } from 'react';
import { Column, Row, Heading, Button, Icon, RevealFx, Flex, Text, Dialog } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { Project, getProjectsFromDB, deleteProject } from "@/lib/supabase";
import { ProjectForm } from "./ProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface ProjectsProps {
  range?: [number, number?];
  showManagementButtons?: boolean;
}

export function Projects({ range, showManagementButtons = false }: ProjectsProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await getProjectsFromDB();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      addToast('Error al cargar los proyectos', 'error');
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
    
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.title}"?`)) {
      try {
        await deleteProject(project.id);
        setProjects(prev => prev.filter(p => p.id !== project.id));
        addToast('Proyecto eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting project:', error);
        addToast('Error al eliminar el proyecto', 'error');
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
              Projects - Bruno Bacchi
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
                Añadir Proyecto
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
              No hay proyectos disponibles
            </Text>
            {showManagementButtons && user && (
              <Button variant="secondary" onClick={handleAddProject}>
                <Flex gap="8" vertical="center">
                  <Icon name="plus" size="s" />
                  Crear primer proyecto
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
              href={`work/${project.slug}`}
              images={project.images}
              title={project.title}
              description={project.summary}
              content={project.content}
              avatars={[]} // We'll need to add team members to the database if needed
              link={project.link || ""}
              onEdit={user && showManagementButtons ? handleEditProject : undefined}
              showEditButton={!!(user && showManagementButtons)}
            />
          </RevealFx>
        ))
      )}

      {/* Modal para agregar/editar proyecto */}
      {showManagementButtons && user && (
        <Dialog
          isOpen={showAddForm || editingProject !== null}
          onClose={handleCancel}
          title={editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
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
