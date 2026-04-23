import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';
import '@/resources/dark-theme.css';
import '@/resources/background-effect.css';


import classNames from "classnames";
import type { Metadata } from "next";

import { Background, Column, Flex, opacity, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard, TrackingReporter } from '@/components';
import { Providers } from '@/providers';
import { effects, fonts, style, dataStyle } from '@/resources';

/** Favicon / metadata leen `introduction`: no congelar en build tras cambiar avatar en Supabase. */
export const revalidate = 60;
const canonicalUrl = "https://brunodev.cloud";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: "Bruno | Full Stack Developer",
    template: "%s | Bruno",
  },
  description:
    "Portfolio de Bruno, Full Stack Developer. Desarrollo soluciones web modernas con Next.js, React, TypeScript y Supabase, optimizadas para performance, SEO y conversión.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    siteName: "Bruno Dev",
    title: "Bruno | Full Stack Developer",
    description:
      "Creo productos web escalables y veloces con Next.js y Supabase: arquitectura, frontend, backend y despliegue en Vercel.",
    images: [
      {
        url: "/api/og/generate?title=Bruno%20%7C%20Full%20Stack%20Developer",
        width: 1200,
        height: 630,
        alt: "Bruno - Full Stack Developer",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'dark';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    'solid-style': style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    'viz-style': dataStyle.variant,
                  })};
                  
                  // Apply default values immediately to prevent flickering
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Set dark theme as default to prevent blue flash
                  root.setAttribute('data-theme', 'dark');
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return 'dark'; // Default to dark instead of system
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme if exists, otherwise keep dark
                  const savedTheme = localStorage.getItem('data-theme');
                  if (savedTheme && savedTheme !== 'system') {
                    const resolvedTheme = resolveTheme(savedTheme);
                    root.setAttribute('data-theme', resolvedTheme);
                  }
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                  
                  // Apply clean background like original Magic Portfolio
                  const style = document.createElement('style');
                  style.textContent = \`
                    [data-theme="dark"] {
                      --page-background: #0a0a0a !important;
                      --surface-background: #0a0a0a !important;
                      --scheme-brand-600: #3b82f6 !important;
                      --scheme-brand-700: #2563eb !important;
                      --scheme-brand-800: #1d4ed8 !important;
                      --scheme-accent-600: #8b5cf6 !important;
                      --scheme-accent-700: #7c3aed !important;
                      --scheme-accent-800: #6d28d9 !important;
                    }
                    
                    [data-theme="dark"] body,
                    [data-theme="dark"] [data-background="page"] {
                      background: #0a0a0a !important;
                    }
                    
                    [data-theme="dark"] .auth-button {
                      background-color: #0a0a0a !important;
                      color: #ffffff !important;
                      border: 1px solid #ffffff !important;
                    }
                  \`;
                  document.head.appendChild(style);
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <Column as="body" background="page" fillWidth style={{minHeight: "100vh"}} margin="0" padding="0" horizontal="center">
            <Background
              position="fixed"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <Flex fillWidth minHeight="16" hide="s"/>
            <Header />
            <TrackingReporter />
            <Flex
              zIndex={0}
              fillWidth
              padding="l"
              horizontal="center"
              flex={1}
            >
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>
                  {children}
                </RouteGuard>
              </Flex>
            </Flex>
            <Footer/>
          </Column>
      </Providers>
    </Flex>
  );
}
