-- Bucket y políticas de Storage (bucket: magicportfolio).
-- Ejecutar en Supabase → SQL Editor (completo).
--
-- Error "new row violates row-level security policy" al subir:
-- → No hay políticas en storage.objects, o falta WITH CHECK en UPDATE (upsert).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'magicportfolio',
  'magicportfolio',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = COALESCE(EXCLUDED.file_size_limit, storage.buckets.file_size_limit);

-- Quitar políticas anteriores del mismo nombre (por si re-ejecutas el script)
DROP POLICY IF EXISTS "magicportfolio_public_read" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_all" ON storage.objects;

-- Lectura pública (visitantes ven avatares / imágenes)
CREATE POLICY "magicportfolio_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'magicportfolio');

-- Usuarios logueados: subir, reemplazar (upsert) y borrar en este bucket
-- USING + WITH CHECK en UPDATE es obligatorio para que upsert no falle
CREATE POLICY "magicportfolio_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'magicportfolio');

CREATE POLICY "magicportfolio_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'magicportfolio')
  WITH CHECK (bucket_id = 'magicportfolio');

CREATE POLICY "magicportfolio_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'magicportfolio');
