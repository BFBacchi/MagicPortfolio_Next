"use client";

import { ThemeProvider, DataThemeProvider, IconProvider } from "@once-ui-system/core";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { iconLibrary } from "./resources/icons";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <IconProvider icons={iconLibrary}>
              {children}
            </IconProvider>
          </ToastProvider>
        </AuthProvider>
      </DataThemeProvider>
    </ThemeProvider>
  );
}
