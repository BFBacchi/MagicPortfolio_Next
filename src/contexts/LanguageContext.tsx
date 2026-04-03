"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  messages,
  interpolate,
  type AppLanguage,
} from "@/i18n/messages";

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: AppLanguage;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = "es",
}) => {
  const [language, setLanguageState] = useState<AppLanguage>(defaultLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("language") as AppLanguage | null;
      if (saved === "es" || saved === "en") {
        setLanguageState(saved);
      }
    } catch (e) {
      console.error("Error loading language from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language === "es" ? "es" : "en";
  }, [language]);

  const handleSetLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("language", lang);
      } catch (e) {
        console.error("Error saving language to localStorage:", e);
      }
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = messages[language][key];
      if (raw === undefined) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Missing key "${key}" for ${language}`);
        }
        return key;
      }
      return interpolate(raw, vars);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
