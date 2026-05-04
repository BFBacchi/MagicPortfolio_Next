import { supabase } from "../supabase";
import { Introduction, WorkExperience, Study, TechnicalSkill } from "./queries";

// Generic helper
type Nullable<T> = { [K in keyof T]?: T[K] | null };

async function updateOrInsertByLocale(
  table:
    | "introduction_translations"
    | "work_experience_translations"
    | "studies_translations"
    | "technical_skills_translations",
  keyField:
    | "introduction_id"
    | "work_experience_id"
    | "study_id"
    | "technical_skill_id",
  keyValue: number,
  locale: "es" | "en",
  payload: Record<string, string | number | null>
) {
  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select("id")
    .eq(keyField, keyValue)
    .eq("locale", locale)
    .limit(1);

  if (selectError) throw selectError;

  if (existing && existing.length > 0) {
    const { error: updateError } = await supabase
      .from(table)
      .update(payload)
      .eq("id", existing[0].id);
    if (updateError) throw updateError;
    return;
  }

  const { error: insertError } = await supabase
    .from(table)
    .insert([{ [keyField]: keyValue, locale, ...payload }]);
  if (insertError) throw insertError;
}

export async function upsertIntroduction(payload: Nullable<Introduction>) {
  const basePayload = {
    id: payload.id,
    name: payload.name,
    role: payload.role,
    description: payload.description,
    avatar_url: payload.avatar_url,
  };

  const { data, error } = await supabase
    .from("introduction")
    .upsert(basePayload, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    const details = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    };
    throw new Error(`upsertIntroduction:introduction ${JSON.stringify(details)}`);
  }
  if (payload.translations && data?.id) {
    const rows = Object.entries(payload.translations)
      .filter(([locale, value]) => (locale === "es" || locale === "en") && value?.description)
      .map(([locale, value]) => ({
        locale: locale as "es" | "en",
        role: value?.role || payload.role || "",
        description: value?.description || payload.description || "",
      }));

    for (const row of rows) {
      try {
        await updateOrInsertByLocale(
          "introduction_translations",
          "introduction_id",
          data.id,
          row.locale,
          {
            role: row.role,
            description: row.description,
            updated_at: new Date().toISOString(),
          }
        );
      } catch (trError: unknown) {
        const e = trError as { code?: string; message?: string; details?: string; hint?: string };
        // Permite guardar sin bloquear UI si solo falla la tabla de traducciones por RLS.
        if (e?.code === "42501" || e?.message?.includes("row-level security")) {
          console.warn("Skipping introduction_translations write due to RLS policy", {
            code: e.code,
            message: e.message,
            details: e.details,
            hint: e.hint,
          });
          continue;
        }
        throw trError;
      }
    }
  }
  return data as Introduction;
}

export async function upsertWorkExperience(payload: Nullable<WorkExperience>) {
  const { data, error } = await supabase
    .from("work_experience")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  if (data?.id) {
    const rows = [
      payload.position_es || payload.description_es
        ? {
            locale: "es" as const,
            position: payload.position_es || payload.position || "",
            description: payload.description_es || payload.description || "",
          }
        : null,
      payload.position_en || payload.description_en
        ? {
            locale: "en" as const,
            position: payload.position_en || payload.position || "",
            description: payload.description_en || payload.description || "",
          }
        : null,
    ].filter(Boolean);
    for (const row of rows) {
      const translation = row as { locale: "es" | "en"; position: string; description: string };
      await updateOrInsertByLocale(
        "work_experience_translations",
        "work_experience_id",
        data.id,
        translation.locale,
        {
          position: translation.position,
          description: translation.description,
          updated_at: new Date().toISOString(),
        }
      );
    }
  }
  return data as WorkExperience;
}

export async function upsertStudy(payload: Nullable<Study>) {
  const { data, error } = await supabase
    .from("studies")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  if (data?.id) {
    const rows = [
      payload.degree_es || payload.description_es
        ? {
            locale: "es" as const,
            degree: payload.degree_es || payload.degree || "",
            description: payload.description_es || payload.description || "",
          }
        : null,
      payload.degree_en || payload.description_en
        ? {
            locale: "en" as const,
            degree: payload.degree_en || payload.degree || "",
            description: payload.description_en || payload.description || "",
          }
        : null,
    ].filter(Boolean);
    for (const row of rows) {
      const translation = row as { locale: "es" | "en"; degree: string; description: string };
      await updateOrInsertByLocale(
        "studies_translations",
        "study_id",
        data.id,
        translation.locale,
        {
          degree: translation.degree,
          description: translation.description,
          updated_at: new Date().toISOString(),
        }
      );
    }
  }
  return data as Study;
}

export async function upsertTechnicalSkill(payload: Nullable<TechnicalSkill>) {
  console.log('Upserting technical skill with payload:', payload);
  
  // Validate required fields
  if (!payload.name || !payload.level || !payload.category || !payload.user_id) {
    throw new Error('Missing required fields: name, level, category, and user_id are required');
  }
  
  let result;
  
  if (payload.id) {
    // Update existing record
    console.log('Updating existing technical skill with id:', payload.id);
    const { data, error } = await supabase
      .from("technical_skills")
      .update({
        name: payload.name,
        level: payload.level,
        category: payload.category,
        user_id: payload.user_id
      })
      .eq('id', payload.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating technical skill:', error);
      throw new Error(`Error updating technical skill: ${error.message || JSON.stringify(error)}`);
    }
    
    result = data;
  } else {
    // Insert new record
    console.log('Inserting new technical skill');
    const { data, error } = await supabase
      .from("technical_skills")
      .insert({
        name: payload.name,
        level: payload.level,
        category: payload.category,
        user_id: payload.user_id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting technical skill:', error);
      throw new Error(`Error inserting technical skill: ${error.message || JSON.stringify(error)}`);
    }
    
    result = data;
  }
  
  console.log('Successfully saved technical skill:', result);
  if (result?.id) {
    const rows = [
      payload.name_es || payload.category_es
        ? {
            locale: "es" as const,
            name: payload.name_es || payload.name || "",
            category: payload.category_es || payload.category || "",
          }
        : null,
      payload.name_en || payload.category_en
        ? {
            locale: "en" as const,
            name: payload.name_en || payload.name || "",
            category: payload.category_en || payload.category || "",
          }
        : null,
    ].filter(Boolean);
    for (const row of rows) {
      const translation = row as { locale: "es" | "en"; name: string; category: string };
      await updateOrInsertByLocale(
        "technical_skills_translations",
        "technical_skill_id",
        result.id,
        translation.locale,
        {
          name: translation.name,
          category: translation.category,
          updated_at: new Date().toISOString(),
        }
      );
    }
  }
  return result as TechnicalSkill;
}
