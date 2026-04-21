-- Tablas para la página About (perfil, experiencia, estudios, habilidades).
-- Ejecutar en Supabase → SQL Editor (todo el bloque de una vez).
-- Error PGRST205 "Could not find the table ... in the schema cache" desaparece tras crear tablas y refrescar el esquema (a veces unos segundos).

-- ========== introduction (una fila típica; la app usa id=1 en varios updates) ==========
CREATE TABLE IF NOT EXISTS public.introduction (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  avatar_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  discord_url TEXT,
  email_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fila inicial para que exista registro único (opcional)
INSERT INTO public.introduction (id, name, role, description)
VALUES (1, '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ========== work_experience ==========
CREATE TABLE IF NOT EXISTS public.work_experience (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON public.work_experience (user_id);

-- ========== studies ==========
CREATE TABLE IF NOT EXISTS public.studies (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT DEFAULT '',
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studies_user_id ON public.studies (user_id);

-- ========== technical_skills ==========
CREATE TABLE IF NOT EXISTS public.technical_skills (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_technical_skills_user_id ON public.technical_skills (user_id);

-- ========== RLS ==========
ALTER TABLE public.introduction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;

-- introduction: lectura pública; escritura solo usuarios autenticados
DROP POLICY IF EXISTS "introduction_select_public" ON public.introduction;
DROP POLICY IF EXISTS "introduction_insert_auth" ON public.introduction;
DROP POLICY IF EXISTS "introduction_update_auth" ON public.introduction;
DROP POLICY IF EXISTS "introduction_delete_auth" ON public.introduction;

CREATE POLICY "introduction_select_public" ON public.introduction
  FOR SELECT USING (true);

CREATE POLICY "introduction_insert_auth" ON public.introduction
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "introduction_update_auth" ON public.introduction
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "introduction_delete_auth" ON public.introduction
  FOR DELETE TO authenticated USING (true);

-- Tablas por usuario: lectura pública; CRUD solo autenticados (dueño implícito por user_id en la app)
DO $$
BEGIN
  -- work_experience
  DROP POLICY IF EXISTS "we_select" ON public.work_experience;
  DROP POLICY IF EXISTS "we_insert" ON public.work_experience;
  DROP POLICY IF EXISTS "we_update" ON public.work_experience;
  DROP POLICY IF EXISTS "we_delete" ON public.work_experience;
  CREATE POLICY "we_select" ON public.work_experience FOR SELECT USING (true);
  CREATE POLICY "we_insert" ON public.work_experience FOR INSERT TO authenticated WITH CHECK (true);
  CREATE POLICY "we_update" ON public.work_experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "we_delete" ON public.work_experience FOR DELETE TO authenticated USING (true);

  -- studies
  DROP POLICY IF EXISTS "st_select" ON public.studies;
  DROP POLICY IF EXISTS "st_insert" ON public.studies;
  DROP POLICY IF EXISTS "st_update" ON public.studies;
  DROP POLICY IF EXISTS "st_delete" ON public.studies;
  CREATE POLICY "st_select" ON public.studies FOR SELECT USING (true);
  CREATE POLICY "st_insert" ON public.studies FOR INSERT TO authenticated WITH CHECK (true);
  CREATE POLICY "st_update" ON public.studies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "st_delete" ON public.studies FOR DELETE TO authenticated USING (true);

  -- technical_skills
  DROP POLICY IF EXISTS "ts_select" ON public.technical_skills;
  DROP POLICY IF EXISTS "ts_insert" ON public.technical_skills;
  DROP POLICY IF EXISTS "ts_update" ON public.technical_skills;
  DROP POLICY IF EXISTS "ts_delete" ON public.technical_skills;
  CREATE POLICY "ts_select" ON public.technical_skills FOR SELECT USING (true);
  CREATE POLICY "ts_insert" ON public.technical_skills FOR INSERT TO authenticated WITH CHECK (true);
  CREATE POLICY "ts_update" ON public.technical_skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "ts_delete" ON public.technical_skills FOR DELETE TO authenticated USING (true);
END $$;
