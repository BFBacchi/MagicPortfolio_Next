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
  return data as Introduction;
}

export async function upsertWorkExperience(payload: Nullable<WorkExperience>) {
  const { data, error } = await supabase
    .from("work_experience")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as WorkExperience;
}

export async function upsertStudy(payload: Nullable<Study>) {
  const { data, error } = await supabase
    .from("studies")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
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
  return result as TechnicalSkill;
}
