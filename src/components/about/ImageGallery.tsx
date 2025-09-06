"use client";

import { useState, useEffect } from "react";
import { Button, Text, Column, Row, Flex } from "@once-ui-system/core";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./about.module.scss";

interface ImageFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: any;
}

export const ImageGallery = ({ 
  onSelectImage, 
  currentImageUrl 
}: { 
  onSelectImage: (url: string) => Promise<void>;
  currentImageUrl?: string;
}) => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Listar archivos en el bucket magicportfolio en la carpeta profileimage
      const { data, error } = await supabase.storage
        .from('magicportfolio')
        .list('profileimage', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageName: string) => {
    if (!user) return;
    
    try {
      setActionLoading(`delete-${imageName}`);
      
      const { error } = await supabase.storage
        .from('magicportfolio')
        .remove([`profileimage/${imageName}`]);

      if (error) {
        console.error('Error deleting image:', error);
        return;
      }

      // Recargar la lista de imágenes
      await fetchImages();
      
      // Limpiar la selección si la imagen eliminada estaba seleccionada
      if (selectedImage === imageName) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getImageUrl = (imageName: string) => {
    const { data } = supabase.storage
      .from('magicportfolio')
      .getPublicUrl(`profileimage/${imageName}`);
    
    return data.publicUrl;
  };

  const handleImageSelect = async (imageName: string) => {
    try {
      setActionLoading(`select-${imageName}`);
      const imageUrl = getImageUrl(imageName);
      setSelectedImage(imageName);
      
      // Llamar a la función de selección
      await onSelectImage(imageUrl);
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [user]);

  if (loading) {
    return <Text>Cargando imágenes...</Text>;
  }

  return (
    <Column gap="m">
      <Text variant="display-strong-s">Imágenes disponibles</Text>
      
      {images.length === 0 ? (
        <Text variant="body-default-m" onBackground="neutral-weak">
          No hay imágenes subidas
        </Text>
      ) : (
        <div className={styles.imageGrid}>
          {images.map((image) => {
            const imageUrl = getImageUrl(image.name);
            const isSelected = selectedImage === image.name;
            const isCurrent = currentImageUrl === imageUrl;
            
            return (
              <div 
                key={image.name} 
                className={`${styles.imageItem} ${isSelected ? styles.selected : ''} ${isCurrent ? styles.current : ''}`}
              >
                <img 
                  src={imageUrl} 
                  alt={image.name}
                  onClick={() => handleImageSelect(image.name)}
                  className={styles.galleryImage}
                />
                
                <div className={styles.imageActions}>
                  <Button 
                    size="s" 
                    variant="secondary"
                    onClick={() => handleImageSelect(image.name)}
                    disabled={isCurrent || actionLoading === `select-${image.name}`}
                  >
                    {actionLoading === `select-${image.name}` ? 'Seleccionando...' : (isCurrent ? 'Actual' : 'Seleccionar')}
                  </Button>
                  
                  <Button 
                    size="s" 
                    variant="tertiary"
                    onClick={() => deleteImage(image.name)}
                    disabled={isCurrent || actionLoading === `delete-${image.name}`}
                  >
                    {actionLoading === `delete-${image.name}` ? 'Eliminando...' : 'Eliminar'}
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