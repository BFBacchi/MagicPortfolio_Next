'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
    'blog': 'Blog',
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
    'blog': 'Blog',
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
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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