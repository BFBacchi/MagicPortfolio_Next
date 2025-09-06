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
  const { data, error } = await supabase
    .from("technical_skills")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as TechnicalSkill;
}
