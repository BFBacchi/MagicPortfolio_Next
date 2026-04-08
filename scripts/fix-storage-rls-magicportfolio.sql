-- SOLO si ya tienes el bucket "magicportfolio" y falla la subida por RLS.
-- Pégalo en Supabase → SQL Editor → Run.

DROP POLICY IF EXISTS "magicportfolio_public_read" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "magicportfolio_auth_all" ON storage.objects;

CREATE POLICY "magicportfolio_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'magicportfolio');

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
