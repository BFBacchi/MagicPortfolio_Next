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
  const { language, t } = useLanguage();

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
      setIntroEs(
        introduction.translations?.es?.description ||
          introduction.description_es ||
          ""
      );
      setIntroEn(introduction.translations?.en?.description || introduction.description_en || "");
      setRoleEs(introduction.translations?.es?.role || introduction.role_es || introduction.role || "");
      setRoleEn(introduction.translations?.en?.role || introduction.role_en || "");
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

  useEffect(() => {
    setIntroText(editingLocale === "es" ? introEs : introEn);
  }, [editingLocale, introEs, introEn]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentDescription = editingLocale === "es" ? introEs : introEn;
    if (!currentDescription.trim()) return;

    try {
      setIsSaving(true);
      const activeTranslation =
        editingLocale === "es"
          ? { es: { role: roleEs, description: introEs } }
          : { en: { role: roleEn, description: introEn } };

      if (introduction?.id) {
        await upsertIntroduction({
          ...introduction,
          // Mantener la base en español evita fallback en EN sobre /es.
          role: roleEs || introduction.role,
          description: introEs || introduction.description,
          translations: activeTranslation,
        } as Partial<Introduction> as Introduction);
      } else {
        await upsertIntroduction({
          id: 1,
          name: "Tu Nombre",
          role: roleEs || roleEn,
          description: introEs || introEn,
          created_at: new Date().toISOString(),
          avatar_url: "",
          translations: activeTranslation,
        } as Introduction);
      }

      addToast(t("about.intro_saved"), "success");
      setIsDialogOpen(false);
      onUpdate?.();
    } catch (error: unknown) {
      const errorText =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error, Object.getOwnPropertyNames(error as object));
      const supabaseError = error as { message?: string; details?: string; hint?: string; code?: string };
      console.error("Error saving introduction:", {
        errorText,
        message: supabaseError?.message,
        details: supabaseError?.details,
        hint: supabaseError?.hint,
        code: supabaseError?.code,
        raw: error,
      });
      const isRlsTranslationsError =
        errorText.includes("42501") ||
        errorText.toLowerCase().includes("row-level security");

      if (isRlsTranslationsError) {
        addToast(
          "Guardado parcial: se actualizo la introduccion base, pero faltan permisos RLS para guardar traducciones.",
          "error"
        );
      } else {
        addToast(`${t("about.intro_save_error")} ${errorText || ""}`.trim(), "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Section
        id="introduction"
        title={t("about.intro_title")}
        onEdit={!loading && !!user ? () => setIsDialogOpen(true) : undefined}
      >
        <p className={styles.sectionText}>
          {introText || t("about.intro_placeholder")}
        </p>
      </Section>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => !isSaving && setIsDialogOpen(false)}
        title={t("about.intro_edit_title")}
        description={t("about.intro_edit_desc")}
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
                label={`${t("about.intro_description_label")} (${editingLocale.toUpperCase()})`}
                value={editingLocale === "es" ? introEs : introEn}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const value = e.target.value;
                  if (editingLocale === "es") setIntroEs(value);
                  else setIntroEn(value);
                  setIntroText(value);
                }}
                disabled={isSaving}
                required
                description={t("about.intro_description_hint")}
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
                  {t("cancel")}
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? t("about.saving") : t("about.save")}
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


