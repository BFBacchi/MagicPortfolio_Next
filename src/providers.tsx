"use client";

import { ThemeProvider, DataThemeProvider, IconProvider } from "@once-ui-system/core";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { iconLibrary } from "./resources/icons";
import { AppLanguage } from "./i18n/messages";

export function Providers({
  children,
  defaultLanguage = "es",
}: {
  children: React.ReactNode;
  defaultLanguage?: AppLanguage;
}) {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <LanguageProvider defaultLanguage={defaultLanguage}>
          <AuthProvider>
            <ToastProvider>
              <IconProvider icons={iconLibrary}>
                {children}
              </IconProvider>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </DataThemeProvider>
    </ThemeProvider>
  );
}
