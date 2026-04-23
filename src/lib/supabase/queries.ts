import { supabase } from "../supabase";
import { AppLocale } from "@/i18n/config";

// Tipos para los datos del About
export interface Introduction {
  id: number
  name: string
  role: string
  description: string
  avatar_url?: string
  created_at: string
  translations?: Partial<Record<AppLocale, {
    role: string
    description: string
  }>>
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  start_date: string
  end_date: string | null
  description: string
  technologies: string[]
  created_at: string
  position_es?: string
  position_en?: string
  description_es?: string
  description_en?: string
}

export interface Study {
  id: number
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  description: string
  certificate_url?: string | null
  created_at: string
  degree_es?: string
  degree_en?: string
  description_es?: string
  description_en?: string
}

export interface TechnicalSkill {
  id?: number
  name: string
  category: string
  level: string
  user_id: string
  created_at?: string
  name_es?: string
  name_en?: string
  category_es?: string
  category_en?: string
}

function localeOrder(locale: AppLocale): AppLocale[] {
  return locale === "es" ? ["es", "en"] : ["en", "es"];
}

export async function getIntroduction(locale: AppLocale = "es"): Promise<Introduction | null> {
  const { data, error } = await supabase
    .from("introduction")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching introduction:", error);
    return null;
  }

  if (!data) return null;

  const { data: translations } = await supabase
    .from("introduction_translations")
    .select("locale, role, description")
    .eq("introduction_id", data.id)
    .in("locale", localeOrder(locale));

  const preferred = translations?.find((row) => row.locale === locale);
  const fallback = translations?.find((row) => row.locale === "es");
  const tr = preferred ?? fallback;

  return {
    ...data,
    role: tr?.role || data.role,
    description: tr?.description || data.description,
    translations: {
      es: translations?.find((row) => row.locale === "es")
        ? {
            role: translations.find((row) => row.locale === "es")!.role,
            description: translations.find((row) => row.locale === "es")!.description,
          }
        : undefined,
      en: translations?.find((row) => row.locale === "en")
        ? {
            role: translations.find((row) => row.locale === "en")!.role,
            description: translations.find((row) => row.locale === "en")!.description,
          }
        : undefined,
    },
  };
}

// Función para obtener experiencia laboral
export async function getWorkExperience(locale: AppLocale = "es"): Promise<WorkExperience[]> {
  const { data, error } = await supabase
    .from('work_experience')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching work experience:', error)
    return []
  }

  const items = data || [];
  if (items.length === 0) return [];

  const { data: translations } = await supabase
    .from("work_experience_translations")
    .select("work_experience_id, locale, position, description")
    .in("work_experience_id", items.map((item) => item.id))
    .in("locale", localeOrder(locale));

  return items.map((item) => {
    const preferred = translations?.find((row) => row.work_experience_id === item.id && row.locale === locale);
    const fallback = translations?.find((row) => row.work_experience_id === item.id && row.locale === "es");
    const tr = preferred ?? fallback;
    const esTr = translations?.find((row) => row.work_experience_id === item.id && row.locale === "es");
    const enTr = translations?.find((row) => row.work_experience_id === item.id && row.locale === "en");
    return {
      ...item,
      position: tr?.position || item.position,
      description: tr?.description || item.description,
      position_es: esTr?.position,
      description_es: esTr?.description,
      position_en: enTr?.position,
      description_en: enTr?.description,
    };
  });
}

// Función para obtener estudios
export async function getStudies(locale: AppLocale = "es"): Promise<Study[]> {
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching studies:', error)
    return []
  }

  const items = data || [];
  if (items.length === 0) return [];

  const { data: translations } = await supabase
    .from("studies_translations")
    .select("study_id, locale, degree, description")
    .in("study_id", items.map((item) => item.id))
    .in("locale", localeOrder(locale));

  return items.map((item) => {
    const preferred = translations?.find((row) => row.study_id === item.id && row.locale === locale);
    const fallback = translations?.find((row) => row.study_id === item.id && row.locale === "es");
    const tr = preferred ?? fallback;
    const esTr = translations?.find((row) => row.study_id === item.id && row.locale === "es");
    const enTr = translations?.find((row) => row.study_id === item.id && row.locale === "en");
    return {
      ...item,
      degree: tr?.degree || item.degree,
      description: tr?.description || item.description,
      degree_es: esTr?.degree,
      description_es: esTr?.description,
      degree_en: enTr?.degree,
      description_en: enTr?.description,
    };
  });
}

// Función para obtener habilidades técnicas
export async function getTechnicalSkills(userId?: string, locale: AppLocale = "es"): Promise<TechnicalSkill[]> {
  let query = supabase
    .from('technical_skills')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    // Si no se pasa userId, obtener todas las habilidades (para compatibilidad)
    console.log('No userId provided, fetching all technical skills')
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching technical skills:', error)
    return []
  }

  const items = data || [];
  if (items.length === 0) return [];

  const { data: translations } = await supabase
    .from("technical_skills_translations")
    .select("technical_skill_id, locale, name, category")
    .in("technical_skill_id", items.map((item) => item.id))
    .in("locale", localeOrder(locale));

  const mapped = items.map((item) => {
    const preferred = translations?.find((row) => row.technical_skill_id === item.id && row.locale === locale);
    const fallback = translations?.find((row) => row.technical_skill_id === item.id && row.locale === "es");
    const tr = preferred ?? fallback;
    const esTr = translations?.find((row) => row.technical_skill_id === item.id && row.locale === "es");
    const enTr = translations?.find((row) => row.technical_skill_id === item.id && row.locale === "en");
    return {
      ...item,
      name: tr?.name || item.name,
      category: tr?.category || item.category,
      name_es: esTr?.name,
      category_es: esTr?.category,
      name_en: enTr?.name,
      category_en: enTr?.category,
    };
  });

  console.log('Fetched technical skills:', mapped.length, 'records')
  return mapped
} 