"use client";

import { useState, useEffect, useRef } from 'react';
import { Button, Icon, Flex, Text, Media, RevealFx } from '@once-ui-system/core';
import { getYouTubeThumbnail } from '@/lib/supabase/storage';

interface ProjectCarouselProps {
  images: string[];
  videoUrl?: string;
  title: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  images,
  videoUrl,
  title,
  onEdit,
  showEditButton = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Función para validar si una URL de imagen es válida
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    // Verificar si es una URL válida
    try {
      new URL(url);
      return true;
    } catch {
      // Si no es una URL completa, verificar si es una ruta relativa válida
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }
  };

  // Filtrar solo imágenes válidas
  const validImages = images.filter(isValidImageUrl);

  // Crear array de elementos del carrusel (imágenes + video si existe)
  const carouselItems = [
    ...validImages.map((image, index) => ({
      type: 'image' as const,
      src: image,
      alt: `${title} - Image ${index + 1}`,
      index
    })),
    ...(videoUrl ? [{
      type: 'video' as const,
      src: videoUrl,
      thumbnail: getYouTubeThumbnail(videoUrl),
      alt: `${title} - Video`,
      index: validImages.length
    }] : [])
  ];

  // Función para extraer ID de video de YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Auto scroll cada 5 segundos
  useEffect(() => {
    if (isAutoPlaying && carouselItems.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));
        setShowVideo(false);
      }, 5000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, carouselItems.length]);

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1));
    setShowVideo(false);
    setIsAutoPlaying(false); // Pausar auto play al navegar manualmente
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));
    setShowVideo(false);
    setIsAutoPlaying(false); // Pausar auto play al navegar manualmente
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setShowVideo(false);
    setIsAutoPlaying(false); // Pausar auto play al navegar manualmente
  };

  const handleVideoClick = () => {
    setShowVideo(true);
    setIsAutoPlaying(false); // Pausar auto play al reproducir video
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const currentItem = carouselItems[currentIndex];

  // Debug: Log carousel items
  console.log('ProjectCarousel - Original Images:', images);
  console.log('ProjectCarousel - Valid Images:', validImages);
  console.log('ProjectCarousel - Video URL:', videoUrl);
  console.log('ProjectCarousel - Carousel Items:', carouselItems);
  console.log('ProjectCarousel - Current Item:', currentItem);

  if (carouselItems.length === 0) {
    return (
      <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="16">
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <Text variant="body-default-m" onBackground="neutral-weak">
            No hay imágenes disponibles
          </Text>
        </div>
      </RevealFx>
    );
  }

  return (
    <div className="relative w-full">
      {/* Botón de editar */}
      {showEditButton && onEdit && (
        <Button
          variant="secondary"
          size="s"
          onClick={onEdit}
          className="absolute top-4 right-4 z-10"
        >
          <Icon name="edit" size="s" />
          Editar
        </Button>
      )}

      {/* Contenido principal del carrusel */}
      <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="16">
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          {currentItem.type === 'image' ? (
            <img
              src={currentItem.src}
              alt={currentItem.alt}
              className="w-full h-full object-cover object-center rounded-lg"
              onError={(e) => {
                // Silenciar el error y usar placeholder
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          ) : (
            <div className="w-full h-full">
              {showVideo ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentItem.src)}?autoplay=1&rel=0`}
                  title={currentItem.alt}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group"
                  onClick={handleVideoClick}
                >
                  <img
                    src={currentItem.thumbnail}
                    alt={currentItem.alt}
                    className="w-full h-full object-cover object-center rounded-lg"
                    onError={(e) => {
                      // Fallback si la miniatura no carga
                      const target = e.target as HTMLImageElement;
                      target.src = `https://img.youtube.com/vi/${getYouTubeVideoId(currentItem.src)}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
                    <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon name="play" size="l" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </RevealFx>

      {/* Controles de navegación */}
      {carouselItems.length > 1 && (
        <>
          {/* Botón de auto play */}
          <RevealFx delay={0.1} horizontal="start">
            <Button
              variant="secondary"
              size="s"
              onClick={toggleAutoPlay}
              className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white shadow-lg border border-gray-200"
              title={isAutoPlaying ? "Pausar auto scroll" : "Iniciar auto scroll"}
            >
              <Icon name={isAutoPlaying ? "pause" : "play"} size="s" />
            </Button>
          </RevealFx>

          {/* Indicadores */}
          <RevealFx delay={0.3} horizontal="center">
            <Flex justify="center" gap="s" marginTop="m">
              {carouselItems.map((item, index) => (
                <RevealFx key={index} delay={0.1 * index} horizontal="center">
                  <Button
                    variant="tertiary"
                    size="xs"
                    onClick={() => handleItemClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentIndex 
                        ? 'bg-blue-500 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir a ${carouselItems[index].type === 'image' ? 'imagen' : 'video'} ${index + 1}`}
                    title={`Ir a ${carouselItems[index].type === 'image' ? 'imagen' : 'video'} ${index + 1}`}
                  />
                </RevealFx>
              ))}
            </Flex>
          </RevealFx>

          {/* Información del elemento actual */}
          <RevealFx delay={0.4} horizontal="center">
            <Flex justify="center" marginTop="s">
              <Text variant="body-default-s" onBackground="neutral-weak">
                {currentItem.type === 'image' 
                  ? `Imagen ${currentItem.index + 1} de ${images.length}`
                  : 'Video de YouTube'
                }
                {isAutoPlaying && (
                  <Text variant="body-default-s" onBackground="primary" marginLeft="xs">
                    • Auto scroll activo
                  </Text>
                )}
              </Text>
            </Flex>
          </RevealFx>
        </>
      )}
    </div>
  );
};
