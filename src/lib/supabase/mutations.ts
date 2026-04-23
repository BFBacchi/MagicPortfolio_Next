import { supabase } from "../supabase";
import { Introduction, WorkExperience, Study, TechnicalSkill } from "./queries";

// Generic helper
type Nullable<T> = { [K in keyof T]?: T[K] | null };

export async function upsertIntroduction(payload: Nullable<Introduction>) {
  const { data, error } = await supabase
    .from("introduction")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  if (payload.translations && data?.id) {
    const upserts = Object.entries(payload.translations)
      .filter(([locale, value]) => (locale === "es" || locale === "en") && value?.description)
      .map(([locale, value]) => ({
        introduction_id: data.id,
        locale,
        role: value?.role || payload.role || "",
        description: value?.description || payload.description || "",
      }));
    if (upserts.length > 0) {
      const { error: trError } = await supabase
        .from("introduction_translations")
        .upsert(upserts, { onConflict: "introduction_id,locale" });
      if (trError) throw trError;
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
    const upserts = [
      payload.position_es || payload.description_es
        ? {
            work_experience_id: data.id,
            locale: "es",
            position: payload.position_es || payload.position || "",
            description: payload.description_es || payload.description || "",
          }
        : null,
      payload.position_en || payload.description_en
        ? {
            work_experience_id: data.id,
            locale: "en",
            position: payload.position_en || payload.position || "",
            description: payload.description_en || payload.description || "",
          }
        : null,
    ].filter(Boolean);
    if (upserts.length > 0) {
      const { error: trError } = await supabase
        .from("work_experience_translations")
        .upsert(upserts, { onConflict: "work_experience_id,locale" });
      if (trError) throw trError;
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
    const upserts = [
      payload.degree_es || payload.description_es
        ? {
            study_id: data.id,
            locale: "es",
            degree: payload.degree_es || payload.degree || "",
            description: payload.description_es || payload.description || "",
          }
        : null,
      payload.degree_en || payload.description_en
        ? {
            study_id: data.id,
            locale: "en",
            degree: payload.degree_en || payload.degree || "",
            description: payload.description_en || payload.description || "",
          }
        : null,
    ].filter(Boolean);
    if (upserts.length > 0) {
      const { error: trError } = await supabase
        .from("studies_translations")
        .upsert(upserts, { onConflict: "study_id,locale" });
      if (trError) throw trError;
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
    const upserts = [
      payload.name_es || payload.category_es
        ? {
            technical_skill_id: result.id,
            locale: "es",
            name: payload.name_es || payload.name || "",
            category: payload.category_es || payload.category || "",
          }
        : null,
      payload.name_en || payload.category_en
        ? {
            technical_skill_id: result.id,
            locale: "en",
            name: payload.name_en || payload.name || "",
            category: payload.category_en || payload.category || "",
          }
        : null,
    ].filter(Boolean);
    if (upserts.length > 0) {
      const { error: trError } = await supabase
        .from("technical_skills_translations")
        .upsert(upserts, { onConflict: "technical_skill_id,locale" });
      if (trError) throw trError;
    }
  }
  return result as TechnicalSkill;
}
