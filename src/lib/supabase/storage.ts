import { supabase } from "./client";

/** Nombre del bucket en Supabase Storage (debe coincidir con scripts/setup-avatar-storage.sql). */
export const SUPABASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "magicportfolio";
export const SUPABASE_STUDIES_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STUDIES_BUCKET ?? "estudios";

function storageErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    const msg = o.message ?? o.error_description ?? o.error;
    if (typeof msg === "string" && msg.trim()) return msg;
    try {
      return JSON.stringify(err);
    } catch {
      return fallback;
    }
  }
  if (typeof err === "string") return err;
  return fallback;
}

export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `profileimage/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    const detail = storageErrorMessage(
      uploadError,
      "Error desconocido al subir a Storage"
    );
    console.error("Storage upload failed:", detail, uploadError);
    throw new Error(
      `${detail}. Crea el bucket "${SUPABASE_STORAGE_BUCKET}" y las políticas (ver scripts/setup-avatar-storage.sql). Debes estar logueado.`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath);

  // Persistir URL en introduction (fila id=1). Si no hay fila, el UPDATE no devuelve error pero 0 filas.
  const { data: updatedRows, error: introUpdateError } = await supabase
    .from("introduction")
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select("id");

  if (introUpdateError) {
    const detail = storageErrorMessage(introUpdateError, "Error al actualizar introduction");
    console.error("Update introduction (avatar):", detail, introUpdateError);
    throw new Error(
      `${detail}. Ejecuta scripts/create-about-tables.sql y revisa políticas RLS de introduction.`
    );
  }

  if (!updatedRows?.length) {
    const { error: insertError } = await supabase.from("introduction").insert({
      id: 1,
      name: "",
      role: "",
      description: "",
      avatar_url: publicUrl,
    });

    if (insertError) {
      const detail = storageErrorMessage(
        insertError,
        "No existe fila introduction id=1 y no se pudo crear"
      );
      console.error("Insert introduction (avatar):", detail, insertError);
      throw new Error(
        `${detail}. Ejecuta scripts/create-about-tables.sql (incluye fila inicial id=1).`
      );
    }
  }

  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (profileUpdateError) {
    console.warn(
      "Avatar subido e introduction actualizado; profiles no actualizado (tabla o RLS):",
      storageErrorMessage(profileUpdateError, "unknown"),
      profileUpdateError
    );
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

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    const detail = storageErrorMessage(uploadError, "Error al subir imagen");
    console.error("Project image upload:", detail, uploadError);
    throw new Error(
      `${detail}. Bucket "${SUPABASE_STORAGE_BUCKET}" y políticas: scripts/setup-avatar-storage.sql`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath);

  return publicUrl;
};

export const uploadStudyCertificateImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop() || "jpg";
  const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  const filePath = `certificados/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_STUDIES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    const detail = storageErrorMessage(uploadError, "Error al subir certificado");
    console.error("Study certificate upload:", detail, uploadError);
    throw new Error(
      `${detail}. Crea el bucket "${SUPABASE_STUDIES_BUCKET}" y configura sus políticas de lectura/escritura.`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_STUDIES_BUCKET).getPublicUrl(filePath);

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