-- Crear la tabla profiles para almacenar información del usuario
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON profiles
    FOR SELECT USING (true);

-- Crear política para permitir inserción y actualización solo para usuarios autenticados
CREATE POLICY "Allow authenticated insert" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated update" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'Desarrollador');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para insertar automáticamente en profiles cuando se registra un usuario
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Configurar políticas para el bucket de storage
-- Nota: Estas políticas deben ejecutarse en el dashboard de Supabase

-- Política para permitir subir archivos (solo usuarios autenticados)
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'magicportfolio' AND auth.role() = 'authenticated');

-- Política para permitir actualizar archivos (solo el propietario)
-- CREATE POLICY "Allow authenticated updates" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'magicportfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir eliminar archivos (solo el propietario)
-- CREATE POLICY "Allow authenticated deletes" ON storage.objects
--     FOR DELETE USING (bucket_id = 'magicportfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir lectura pública
-- CREATE POLICY "Allow public read access" ON storage.objects
--     FOR SELECT USING (bucket_id = 'magicportfolio'); 