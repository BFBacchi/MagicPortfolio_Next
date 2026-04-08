"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Text, Column } from "@once-ui-system/core";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase/storage";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./about.module.scss";

const PROFILE_PREFIX = "profileimage";
const SIGNED_URL_TTL_SEC = 3600;

interface GalleryRow {
  name: string;
  previewUrl: string;
}

function isGalleryFile(name: string): boolean {
  if (!name || name === ".emptyFolderPlaceholder") return false;
  if (name.endsWith("/")) return false;
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
}

function getPersistentPublicUrl(imageName: string): string {
  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(`${PROFILE_PREFIX}/${imageName}`);
  return data.publicUrl;
}

/** La URL guardada en BD es la pública; puede diferir en encoding de la generada al vuelo. */
function currentUrlMatchesFile(
  currentImageUrl: string | undefined,
  imageName: string
): boolean {
  if (!currentImageUrl?.trim()) return false;
  const needle = `${PROFILE_PREFIX}/${imageName}`;
  try {
    const decoded = decodeURIComponent(currentImageUrl);
    return (
      currentImageUrl.includes(needle) ||
      decoded.includes(needle) ||
      currentImageUrl.endsWith(`/${imageName}`)
    );
  } catch {
    return currentImageUrl.includes(imageName);
  }
}

export const ImageGallery = ({
  onSelectImage,
  currentImageUrl,
}: {
  onSelectImage: (url: string) => Promise<void>;
  currentImageUrl?: string;
}) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .list(PROFILE_PREFIX, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching images:", error);
        return;
      }

      const files = (data || []).filter((f) => isGalleryFile(f.name));

      const withPreviews = await Promise.all(
        files.map(async (f) => {
          const path = `${PROFILE_PREFIX}/${f.name}`;
          const { data: signed, error: signError } = await supabase.storage
            .from(SUPABASE_STORAGE_BUCKET)
            .createSignedUrl(path, SIGNED_URL_TTL_SEC);

          const previewUrl =
            !signError && signed?.signedUrl
              ? signed.signedUrl
              : getPersistentPublicUrl(f.name);

          return { name: f.name, previewUrl };
        })
      );

      setRows(withPreviews);
    } catch (e) {
      console.error("Error fetching images:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteImage = async (imageName: string) => {
    if (!user) return;

    try {
      setActionLoading(`delete-${imageName}`);

      const { error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .remove([`${PROFILE_PREFIX}/${imageName}`]);

      if (error) {
        console.error("Error deleting image:", error);
        return;
      }

      await fetchImages();

      if (selectedImage === imageName) {
        setSelectedImage(null);
      }
    } catch (e) {
      console.error("Error deleting image:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageSelect = async (imageName: string) => {
    try {
      setActionLoading(`select-${imageName}`);
      const persistentUrl = getPersistentPublicUrl(imageName);
      setSelectedImage(imageName);
      await onSelectImage(persistentUrl);
    } catch (e) {
      console.error("Error selecting image:", e);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  if (loading) {
    return <Text>Cargando imágenes...</Text>;
  }

  return (
    <Column gap="m">
      <Text variant="display-strong-s">Imágenes disponibles</Text>

      {rows.length === 0 ? (
        <Text variant="body-default-m" onBackground="neutral-weak">
          No hay imágenes subidas
        </Text>
      ) : (
        <div className={styles.imageGrid}>
          {rows.map((image) => {
            const isSelected = selectedImage === image.name;
            const isCurrent = currentUrlMatchesFile(
              currentImageUrl,
              image.name
            );

            return (
              <div
                key={image.name}
                className={`${styles.imageItem} ${isSelected ? styles.selected : ""} ${isCurrent ? styles.current : ""}`}
              >
                <img
                  src={image.previewUrl}
                  alt={image.name}
                  onClick={() => handleImageSelect(image.name)}
                  className={styles.galleryImage}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

                <div className={styles.imageActions}>
                  <Button
                    size="s"
                    variant="secondary"
                    onClick={() => handleImageSelect(image.name)}
                    disabled={
                      isCurrent || actionLoading === `select-${image.name}`
                    }
                  >
                    {actionLoading === `select-${image.name}`
                      ? "Seleccionando..."
                      : isCurrent
                        ? "Actual"
                        : "Seleccionar"}
                  </Button>

                  <Button
                    size="s"
                    variant="tertiary"
                    onClick={() => deleteImage(image.name)}
                    disabled={
                      isCurrent || actionLoading === `delete-${image.name}`
                    }
                  >
                    {actionLoading === `delete-${image.name}`
                      ? "Eliminando..."
                      : "Eliminar"}
                  </Button>
                </div>

                {isCurrent && (
                  <div className={styles.currentBadge}>
                    <Text variant="body-default-xs">Actual</Text>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Column>
  );
};
