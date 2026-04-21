ALTER TABLE public.studies
ADD COLUMN IF NOT EXISTS certificate_url TEXT;
