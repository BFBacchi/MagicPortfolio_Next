"use client";

import { useMemo, useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Study } from "@/lib/supabase/queries";
import { Button, Input, Textarea, Column, Dialog, Text, Row } from "@once-ui-system/core";
import { upsertStudy } from "@/lib/supabase/mutations";
import { useToast } from "@/contexts/ToastContext";
import { uploadStudyCertificateImage } from "@/lib/supabase/storage";
import { Section } from "../Section";
import styles from "../about.module.scss";

// Using 'error' instead of 'error' to match the expected ToastVariant type
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type StudyFormData = Partial<Study> & {
  certificate_url: string;
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
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [selectedCertificateUrl, setSelectedCertificateUrl] = useState<string | null>(null);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [formData, setFormData] = useState<StudyFormData>({
    degree: '',
    institution: '',
    description: '',
    start_date: '',
    end_date: '',
    certificate_url: ''
  });

  const handleEdit = (study: Study) => {
    setEditingStudy(study);
    setFormData({
      degree: study.degree,
      degree_es: study.degree_es || study.degree,
      degree_en: study.degree_en || "",
      institution: study.institution,
      description: study.description || '',
      description_es: study.description_es || study.description || "",
      description_en: study.description_en || "",
      start_date: study.start_date,
      end_date: study.end_date || '',
      certificate_url: study.certificate_url || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingStudy(null);
    setFormData({
      degree: '',
      degree_es: '',
      degree_en: '',
      institution: '',
      description: '',
      description_es: '',
      description_en: '',
      start_date: '',
      end_date: '',
      certificate_url: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const certificatePreviewUrl = useMemo(() => {
    if (formData.certificate_url) return formData.certificate_url;
    if (isEditing && editingStudy?.certificate_url) return editingStudy.certificate_url;
    return "";
  }, [formData.certificate_url, isEditing, editingStudy]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return;
      if (!formData.start_date) {
        addToast('La fecha de inicio es obligatoria', 'error');
        return;
      }
      if (!formData.degree_es || !formData.degree_en) {
        addToast("Completa el título en ES y EN", "error");
        return;
      }

      const data = {
        ...formData,
        start_date: formData.start_date,
        end_date: formData.end_date ? formData.end_date : null,
        certificate_url: formData.certificate_url ? formData.certificate_url : null,
        user_id: user.id,
        id: editingStudy?.id
      };

      await upsertStudy(data as Study);
      addToast('Estudio guardado correctamente', 'success');
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving study:', error);
addToast('Error al guardar el estudio', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) {
      addToast('Debes iniciar sesión para subir certificados', 'error');
      return;
    }

    try {
      setIsUploadingCertificate(true);
      const uploadedUrl = await uploadStudyCertificateImage(file, user.id);
      setFormData(prev => ({
        ...prev,
        certificate_url: uploadedUrl
      }));
      addToast('Certificado subido correctamente', 'success');
    } catch (error) {
      console.error('Error uploading certificate image:', error);
      addToast('Error al subir el certificado', 'error');
    } finally {
      setIsUploadingCertificate(false);
      e.target.value = '';
    }
  };

  const handleOpenCertificateModal = (url: string) => {
    setSelectedCertificateUrl(url);
    setIsCertificateDialogOpen(true);
  };

  return (
    <>
      <Section
        id="studies"
        title="Estudios"
        onEdit={!loading && !!user ? handleAddNew : undefined}
      >
        <div className={styles.studiesContainer}>
          {studies.length === 0 ? (
            <p className={styles.sectionText}>
              Agrega tu formación académica y certificaciones...
            </p>
          ) : (
            <div className={styles.studiesList}>
              {studies.map((study) => (
                <div key={study.id} className={styles.studyItem}>
                  <div className={styles.studyContent}>
                    <div className={styles.studyHeader}>
                      <Text as="h3" variant="heading-strong-s" className={styles.studyTitle}>
                        {study.degree}
                      </Text>
                      {!loading && user && (
                        <Button 
                          variant="tertiary" 
                          size="s" 
                          onClick={() => handleEdit(study)}
                          className={styles.editButton}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                    <Text as="p" variant="body-default-m" className={styles.institutionName}>
                      {study.institution}
                    </Text>
                    <Text as="p" variant="body-default-s" className={styles.dateRange}>
                      {new Date(study.start_date).getFullYear()} - {study.end_date ? new Date(study.end_date).getFullYear() : 'Actual'}
                    </Text>
                    {study.description && (
                      <Text as="p" variant="body-default-m" className={styles.studyDescription}>
                        {study.description}
                      </Text>
                    )}
                    {study.certificate_url && (
                      <Text as="p" variant="body-default-s">
                        <button
                          type="button"
                          onClick={() => handleOpenCertificateModal(study.certificate_url as string)}
                          className={styles.certificateLinkButton}
                        >
                          Mostrar certificado
                        </button>
                      </Text>
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
        title={isEditing ? 'Editar Estudio' : 'Añadir Estudio'}
        description="Actualiza tu formación académica"
      >
        <Column fillWidth gap="16" marginTop="12">
          <form onSubmit={handleSubmit}>
            <Column gap="16">
              <Input
                id="degree"
                name="degree"
                label="Título o Certificación"
                value={formData.degree}
                onChange={handleChange}
                required
              />
              <Input
                id="degree_es"
                name="degree_es"
                label="Título o Certificación (ES)"
                value={formData.degree_es || ""}
                onChange={handleChange}
                required
              />
              <Input
                id="degree_en"
                name="degree_en"
                label="Título o Certificación (EN)"
                value={formData.degree_en || ""}
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
              <Textarea
                id="description_es"
                name="description_es"
                label="Descripción (ES)"
                value={formData.description_es || ""}
                onChange={handleChange}
                rows={3}
              />
              <Textarea
                id="description_en"
                name="description_en"
                label="Descripción (EN)"
                value={formData.description_en || ""}
                onChange={handleChange}
                rows={3}
              />
              <Input
                id="certificate_file"
                name="certificate_file"
                type="file"
                label="Imagen del certificado"
                onChange={handleCertificateUpload}
                accept="image/*"
              />
              {isUploadingCertificate && (
                <Text as="p" variant="body-default-s">Subiendo certificado...</Text>
              )}
              {!isUploadingCertificate && certificatePreviewUrl && (
                <Column gap="8">
                  <Text as="p" variant="body-default-s">
                    Certificado cargado correctamente.
                  </Text>
                  <img
                    src={certificatePreviewUrl}
                    alt="Vista previa del certificado"
                    className={styles.certificatePreview}
                  />
                </Column>
              )}
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
      <Dialog
        isOpen={isCertificateDialogOpen}
        onClose={() => {
          setIsCertificateDialogOpen(false);
          setSelectedCertificateUrl(null);
        }}
        title="Certificado"
        description="Vista completa del certificado"
      >
        <Column fillWidth gap="12" marginTop="12">
          {selectedCertificateUrl && (
            <img
              src={selectedCertificateUrl}
              alt="Certificado"
              className={styles.certificateModalImage}
            />
          )}
        </Column>
      </Dialog>
    </>
  );
};

export default StudiesSection;
