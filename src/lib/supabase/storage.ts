import { supabase } from './client';

export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `profileimage/${fileName}`;

  console.log('Uploading file to bucket magicportfolio:', filePath);

  // Subir el archivo al bucket 'magicportfolio'
  const { error: uploadError } = await supabase.storage
    .from('magicportfolio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log('File uploaded successfully');

  // Obtener la URL pública
  const { data: { publicUrl } } = supabase
    .storage
    .from('magicportfolio')
    .getPublicUrl(filePath);

  console.log('Public URL:', publicUrl);

  // Actualizar el perfil con la nueva URL del avatar
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      avatar_url: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Update profile error:', updateError);
    throw updateError;
  }

  console.log('Profile updated successfully');

  // También actualizar la tabla introduction
  const { error: introUpdateError } = await supabase
    .from('introduction')
    .update({ 
      avatar_url: publicUrl
    })
    .eq('id', 1); // Asumiendo que solo hay una introducción

  if (introUpdateError) {
    console.error('Update introduction error:', introUpdateError);
    // No lanzamos error aquí porque la subida del archivo ya fue exitosa
  } else {
    console.log('Introduction updated successfully');
  }

  return publicUrl;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: { name?: string; role?: string }) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) throw error;
};

// Función para subir imágenes de proyectos
export const uploadProjectImage = async (file: File, projectSlug: string, imageIndex: number) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${projectSlug}-${imageIndex}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  console.log('Uploading project image to bucket magicportfolio:', filePath);

  // Subir el archivo al bucket 'magicportfolio'
  const { error: uploadError } = await supabase.storage
    .from('magicportfolio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log('Project image uploaded successfully');

  // Obtener la URL pública
  const { data: { publicUrl } } = supabase
    .storage
    .from('magicportfolio')
    .getPublicUrl(filePath);

  console.log('Project image public URL:', publicUrl);

  return publicUrl;
};

// Función para obtener thumbnail de YouTube
export const getYouTubeThumbnail = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  if (!videoId) {
    return '';
  }
  
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};