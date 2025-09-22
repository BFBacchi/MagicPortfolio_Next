"use client";

import { AvatarPanel } from "./AvatarPanel";
import { IntroductionSection } from "./sections/IntroductionSection";
import { ImageGallery } from "./ImageGallery";
import { Introduction, WorkExperience, Study, TechnicalSkill } from "@/lib/supabase/queries";
import { Column, Text, Button, Dialog, Input, Row, Icon } from "@once-ui-system/core";
import styles from "./about.module.scss";
import { useState, useEffect } from "react";
import { uploadAvatar, getProfile } from "@/lib/supabase/storage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";
import { WorkExperienceSection } from "./sections/WorkExperienceSection";
import { StudiesSection } from "./sections/StudiesSection";
import { TechnicalSkillsSection } from "./sections/TechnicalSkillsSection";

interface AboutClientProps {
  introduction: Introduction | null;
  workExperience: WorkExperience[];
  studies: Study[];
  technicalSkills: TechnicalSkill[];
}

//

export const AboutClient = ({ introduction, workExperience, studies, technicalSkills }: AboutClientProps) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<Partial<Introduction> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Function to trigger a refresh of the data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string): void => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  

  // Extend the Introduction type to include avatar_url and social links
  type ExtendedIntroduction = Introduction & {
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    discord_url?: string;
    email_url?: string;
  };

  const [tempData, setTempData] = useState<{
    name: string;
    role: string;
    description: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    discord_url?: string;
    email_url?: string;
  }>({
    name: introduction?.name || '',
    role: introduction?.role || '',
    description: introduction?.description || '',
    avatar_url: (introduction as any)?.avatar_url || '',
    github_url: (introduction as any)?.github_url || '',
    linkedin_url: (introduction as any)?.linkedin_url || '',
    discord_url: (introduction as any)?.discord_url || '',
    email_url: (introduction as any)?.email_url || ''
  });

  useEffect(() => {
    // Initialize profileData when dialog opens
    if (isProfileDialogOpen && introduction) {
      setProfileData({
        name: introduction.name || '',
        role: introduction.role || '',
        description: introduction.description || ''
      });
    }
  }, [introduction, isProfileDialogOpen]);

  useEffect(() => {
    // Initialize tempData when introduction changes
    if (introduction) {
      setTempData({
        name: introduction.name || '',
        role: introduction.role || '',
        description: introduction.description || '',
        avatar_url: (introduction as any)?.avatar_url || ''
      });
    }
  }, [introduction]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profile = await getProfile(user.id);
      setTempData({
        name: profile?.name || '',
        role: profile?.role || '',
        description: profile?.description || '',
        avatar_url: profile?.avatar_url || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempData || !user) return;

    try {
      setIsLoading(true);
      // Update the profile data in the database
      const { error } = await supabase
        .from('introduction')
        .update({
          name: tempData.name,
          role: tempData.role,
          description: tempData.description,
          avatar_url: tempData.avatar_url,
          github_url: tempData.github_url,
          linkedin_url: tempData.linkedin_url,
          discord_url: tempData.discord_url,
          email_url: tempData.email_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1); // Assuming there's only one introduction record

      if (error) throw error;

      // Update local state
      if (introduction) {
        (introduction as any).name = tempData.name || '';
        (introduction as any).role = tempData.role || '';
        (introduction as any).description = tempData.description || '';
        (introduction as any).avatar_url = tempData.avatar_url || '';
        (introduction as any).github_url = tempData.github_url || '';
        (introduction as any).linkedin_url = tempData.linkedin_url || '';
        (introduction as any).discord_url = tempData.discord_url || '';
        (introduction as any).email_url = tempData.email_url || '';
      }

      // Close the dialog
      setIsProfileDialogOpen(false);
      
      // You might want to add a toast notification here
      // toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsLoading(true);
      const avatarUrl = await uploadAvatar(file, user.id);
      setTempData(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      // Actualizar también el introduction para que se refleje inmediatamente
      if (introduction) {
        introduction.avatar_url = avatarUrl;
      }
      
      // Recargar la página para obtener los datos actualizados
      window.location.reload();
      
      // Mostrar mensaje de éxito
      addToast('Imagen de perfil actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      addToast('Error al subir la imagen', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (imageUrl: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Actualizar la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        addToast('Error al actualizar el perfil', 'danger');
        return;
      }

      // Actualizar la tabla introduction
      const { error: introError } = await supabase
        .from('introduction')
        .update({ 
          avatar_url: imageUrl
        })
        .eq('id', 1);

      if (introError) {
        console.error('Error updating introduction:', introError);
        // No lanzamos error aquí porque el perfil ya se actualizó
      }

      // Actualizar el estado local
      setTempData(prev => ({ ...prev, avatar_url: imageUrl }));
      if (introduction) {
        introduction.avatar_url = imageUrl;
      }
      
      setShowImageGallery(false);
      addToast('Imagen de perfil actualizada correctamente', 'success');
      
      // Recargar la página para mostrar los cambios
      window.location.reload();
      
    } catch (error) {
      console.error('Error selecting image:', error);
      addToast('Error al seleccionar la imagen', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <aside className={styles.sidebar}>
        <AvatarPanel 
          name={introduction?.name || 'Tu Nombre'} 
          role={introduction?.role || 'Tu Rol'}
          location=""
          languages={[]}
          avatarUrl={introduction?.avatar_url || "/images/avatar.jpg"}
          socialLinks={{
            github_url: (introduction as any)?.github_url,
            linkedin_url: (introduction as any)?.linkedin_url,
            discord_url: (introduction as any)?.discord_url,
            email_url: (introduction as any)?.email_url
          }}
          onEdit={!loading && user ? () => setIsProfileDialogOpen(true) : undefined}
        />
        <nav className={styles.navLinks}>
          <button onClick={() => scrollToSection('introduction')} className={styles.navLink}>
            <Icon name="introduction" size="s" />
            Introducción
          </button>
          <button onClick={() => scrollToSection('work')} className={styles.navLink}>
            <Icon name="experience" size="s" />
            Experiencia
          </button>
          <button onClick={() => scrollToSection('studies')} className={styles.navLink}>
            <Icon name="studies" size="s" />
            Estudios
          </button>
          <button onClick={() => scrollToSection('skills')} className={styles.navLink}>
            <Icon name="skills" size="s" />
            Habilidades
          </button>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.sections}>
          <IntroductionSection introduction={introduction} onUpdate={handleRefresh} />

          <WorkExperienceSection 
            workExperience={workExperience} 
            onUpdate={handleRefresh} 
          />

          <StudiesSection 
            studies={studies} 
            onUpdate={handleRefresh} 
          />

          <TechnicalSkillsSection 
            technicalSkills={technicalSkills} 
            onUpdate={handleRefresh} 
          />
        </div>

        {/* Modal for editing profile */}
        <Dialog
          isOpen={isProfileDialogOpen}
          onClose={() => !isLoading && setIsProfileDialogOpen(false)}
          title="Editar Perfil"
        >
          <Column fillWidth gap="16" marginTop="12">
            <form onSubmit={handleSave}>
              <Column gap="16">
                <Input
                  id="edit-name"
                  label="Nombre"
                  value={tempData?.name || ''}
                  onChange={(e) => setTempData({ ...tempData!, name: e.target.value })}
                  required
                />
                <Input
                  id="edit-role"
                  label="Rol"
                  value={tempData?.role || ''}
                  onChange={(e) => setTempData({ ...tempData!, role: e.target.value })}
                  required
                />
                
                {/* Enlaces Sociales */}
                <div>
                  <Text variant="body-default-s" marginBottom="s">Enlaces Sociales</Text>
                  <Column gap="s">
                    <Input
                      id="edit-github"
                      label="GitHub URL"
                      placeholder="https://github.com/tu-usuario"
                      value={tempData?.github_url || ''}
                      onChange={(e) => setTempData({ ...tempData!, github_url: e.target.value })}
                    />
                    <Input
                      id="edit-linkedin"
                      label="LinkedIn URL"
                      placeholder="https://www.linkedin.com/in/tu-perfil"
                      value={tempData?.linkedin_url || ''}
                      onChange={(e) => setTempData({ ...tempData!, linkedin_url: e.target.value })}
                    />
                    <Input
                      id="edit-discord"
                      label="Discord URL"
                      placeholder="https://discord.gg/tu-servidor"
                      value={tempData?.discord_url || ''}
                      onChange={(e) => setTempData({ ...tempData!, discord_url: e.target.value })}
                    />
                    <Input
                      id="edit-email"
                      label="Email"
                      type="email"
                      placeholder="tu@email.com"
                      value={tempData?.email_url || ''}
                      onChange={(e) => setTempData({ ...tempData!, email_url: e.target.value })}
                    />
                  </Column>
                </div>
                
                <div>
                  <Text variant="body-default-s" marginBottom="s">Imagen de perfil</Text>
                  
                  {/* Botones para gestionar imágenes */}
                  <Row gap="s" marginBottom="m">
                    <label htmlFor="avatar-upload" className={styles.fileUploadButton}>
                      <Button 
                        size="s" 
                        weight="default" 
                        variant="secondary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Subiendo...' : 'Subir nueva imagen'}
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className={styles.hiddenFileInput}
                      title="Seleccionar imagen de perfil"
                    />
                    
                    <Button 
                      size="s" 
                      variant="tertiary"
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setShowImageGallery(!showImageGallery);
                      }}
                      disabled={isLoading}
                    >
                      {showImageGallery ? 'Ocultar galería' : 'Ver imágenes subidas'}
                    </Button>
                  </Row>
                  
                  {/* Galería de imágenes */}
                  {showImageGallery && (
                    <ImageGallery 
                      onSelectImage={handleImageSelect}
                      currentImageUrl={tempData?.avatar_url}
                    />
                  )}
                </div>
                <Row fillWidth vertical="center" gap="8">
                  <Button 
                    variant="tertiary" 
                    type="button" 
                    onClick={() => setIsProfileDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </Button>
                </Row>
              </Column>
            </form>
          </Column>
        </Dialog>
      </div>
    </div>
  );
};
