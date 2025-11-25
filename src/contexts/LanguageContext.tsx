'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  es: {
    'login': 'Iniciar Sesión',
    'logout': 'Cerrar Sesión',
    'email': 'Email',
    'password': 'Contraseña',
    'cancel': 'Cancelar',
    'loading': 'Cargando...',
    'login_success': 'Sesión iniciada correctamente',
    'login_error': 'Error al iniciar sesión',
    'logout_success': 'Sesión cerrada correctamente',
    'complete_fields': 'Por favor completa todos los campos',
    'home': 'Inicio',
    'about': 'Acerca de',
    'work': 'Trabajo',
    'noticias': 'Noticias',
    'gallery': 'Galería',
    'db_test': 'Prueba DB',
  },
  en: {
    'login': 'Login',
    'logout': 'Logout',
    'email': 'Email',
    'password': 'Password',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'login_success': 'Successfully logged in',
    'login_error': 'Login error',
    'logout_success': 'Successfully logged out',
    'complete_fields': 'Please complete all fields',
    'home': 'Home',
    'about': 'About',
    'work': 'Work',
    'noticias': 'News',
    'gallery': 'Gallery',
    'db_test': 'DB Test',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'es' 
}) => {
  // Inicializar con el idioma por defecto para SSR
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isMounted, setIsMounted] = useState(false);

  // Cargar idioma desde localStorage después del montaje (solo en cliente)
  useEffect(() => {
    setIsMounted(true);
    // Verificar que estamos en el cliente antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language from localStorage:', error);
      }
    }
  }, []);

  // Guardar idioma en localStorage cuando cambie
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Verificar que estamos en el cliente antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.error('Error saving language to localStorage:', error);
      }
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 