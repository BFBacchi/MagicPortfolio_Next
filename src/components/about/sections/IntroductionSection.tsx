"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Introduction } from "@/lib/supabase/queries";
import { upsertIntroduction } from "@/lib/supabase/mutations";
import { Section } from "../Section";
import { Column, Row, Button, Textarea, Dialog } from "@once-ui-system/core";
import styles from "../about.module.scss";

interface IntroductionSectionProps {
  introduction: Introduction | null;
  onUpdate?: () => void;
}

export const IntroductionSection = ({ introduction, onUpdate }: IntroductionSectionProps) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [introText, setIntroText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (introduction?.description) {
      setIntroText(introduction.description);
    } else {
      setIntroText("Agrega una descripción sobre ti y tu experiencia...");
    }
  }, [introduction]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!introText.trim()) return;

    try {
      setIsSaving(true);

      if (introduction?.id) {
        await upsertIntroduction({
          ...introduction,
          description: introText,
        } as Partial<Introduction> as Introduction);
      } else {
        await upsertIntroduction({
          name: "Tu Nombre",
          role: "Tu Rol",
          description: introText,
          created_at: new Date().toISOString(),
          avatar_url: "",
        } as Introduction);
      }

      addToast("Introducción guardada correctamente", "success");
      setIsDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error saving introduction:", error);
      addToast("Error al guardar la introducción", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Section
        id="introduction"
        title="Introducción"
        onEdit={!loading && !!user ? () => setIsDialogOpen(true) : undefined}
      >
        <p className={styles.sectionText}>
          {introText || "Agrega una descripción sobre ti y tu experiencia..."}
        </p>
      </Section>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => !isSaving && setIsDialogOpen(false)}
        title="Editar Introducción"
        description="Actualiza la descripción de tu perfil"
      >
        <Column fillWidth gap="16" marginTop="12">
          <form onSubmit={handleSave}>
            <Column gap="16">
              <Textarea
                id="intro-description"
                label="Descripción"
                value={introText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntroText(e.target.value)}
                disabled={isSaving}
                required
                description="Escribe tu introducción aquí..."
                style={{
                  resize: "vertical",
                  minHeight: "120px",
                  height: "auto",
                  overflow: "hidden",
                }}
                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <Row fillWidth vertical="center" gap="8" style={{ justifyContent: "flex-end" }}>
                <Button variant="tertiary" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </Row>
            </Column>
          </form>
        </Column>
      </Dialog>
    </>
  );
};

export default IntroductionSection;


