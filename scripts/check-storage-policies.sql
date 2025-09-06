-- Script para verificar y configurar políticas de storage para el bucket magicportfolio

-- Verificar si las políticas existen
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%magicportfolio%';

-- Si no existen las políticas, ejecutar estas líneas una por una:

-- 1. Política para permitir subidas (INSERT)
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'magicportfolio' AND auth.role() = 'authenticated');

-- 2. Política para permitir actualizaciones (UPDATE)
-- CREATE POLICY "Allow authenticated updates" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'magicportfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Política para permitir eliminaciones (DELETE)
-- CREATE POLICY "Allow authenticated deletes" ON storage.objects
--     FOR DELETE USING (bucket_id = 'magicportfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Política para permitir lectura pública (SELECT)
-- CREATE POLICY "Allow public read access" ON storage.objects
--     FOR SELECT USING (bucket_id = 'magicportfolio');

-- Verificar que el bucket existe y está configurado correctamente
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'magicportfolio'; 