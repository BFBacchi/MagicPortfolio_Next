"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { language } = useLanguage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [introText, setIntroText] = useState("");
  const [introEs, setIntroEs] = useState("");
  const [introEn, setIntroEn] = useState("");
  const [roleEs, setRoleEs] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [editingLocale, setEditingLocale] = useState<"es" | "en">("es");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (introduction?.description) {
      setIntroText(introduction.description);
      setIntroEs(introduction.translations?.es?.description || introduction.description);
      setIntroEn(introduction.translations?.en?.description || "");
      setRoleEs(introduction.translations?.es?.role || introduction.role || "");
      setRoleEn(introduction.translations?.en?.role || "");
    } else {
      setIntroText("Agrega una descripción sobre ti y tu experiencia...");
      setIntroEs("");
      setIntroEn("");
      setRoleEs("");
      setRoleEn("");
    }
  }, [introduction]);

  useEffect(() => {
    setEditingLocale(language);
  }, [language]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!introEs.trim() || !introEn.trim()) return;

    try {
      setIsSaving(true);

      if (introduction?.id) {
        await upsertIntroduction({
          ...introduction,
          description: editingLocale === "es" ? introEs : introEn,
          translations: {
            es: { role: roleEs, description: introEs },
            en: { role: roleEn, description: introEn },
          },
        } as Partial<Introduction> as Introduction);
      } else {
        await upsertIntroduction({
          id: 1,
          name: "Tu Nombre",
          role: editingLocale === "es" ? roleEs : roleEn,
          description: editingLocale === "es" ? introEs : introEn,
          created_at: new Date().toISOString(),
          avatar_url: "",
          translations: {
            es: { role: roleEs, description: introEs },
            en: { role: roleEn, description: introEn },
          },
        } as Introduction);
      }

      addToast("Introducción guardada correctamente", "success");
      setIsDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error saving introduction:", error);
      addToast("Error al guardar la introducción", "error");
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
              <Row gap="8">
                <Button type="button" variant={editingLocale === "es" ? "primary" : "secondary"} onClick={() => setEditingLocale("es")}>ES</Button>
                <Button type="button" variant={editingLocale === "en" ? "primary" : "secondary"} onClick={() => setEditingLocale("en")}>EN</Button>
              </Row>
              <Textarea
                id="intro-description"
                label={`Descripción (${editingLocale.toUpperCase()})`}
                value={editingLocale === "es" ? introEs : introEn}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const value = e.target.value;
                  if (editingLocale === "es") setIntroEs(value);
                  else setIntroEn(value);
                  setIntroText(value);
                }}
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


