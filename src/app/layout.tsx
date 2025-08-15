import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';
import '@/resources/dark-theme.css';
import '@/resources/background-effect.css';
import '@/resources/override-blue.css';

import classNames from "classnames";

import { Background, Column, Flex, Meta, opacity, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard } from '@/components';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Providers } from '@/providers';
import { baseURL, effects, fonts, style, dataStyle, home } from '@/resources';

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

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
                  
                  // Override any blue/cyan colors with dark green and apply correct background
                  const style = document.createElement('style');
                  style.textContent = \`
                    [data-theme="dark"] {
                      --page-background: #000000 !important;
                      --surface-background: #000000 !important;
                      --scheme-brand-600: #008000 !important;
                      --scheme-brand-700: #009900 !important;
                      --scheme-brand-800: #00b300 !important;
                      --scheme-accent-600: #008040 !important;
                      --scheme-accent-700: #00994d !important;
                      --scheme-accent-800: #00b35a !important;
                    }
                    
                    [data-theme="dark"] body,
                    [data-theme="dark"] [data-background="page"] {
                      background: radial-gradient(circle at center, #001a00 0%, #000000 30%, #000000 100%) !important;
                    }
                    
                    [data-theme="dark"] .auth-button {
                      background-color: #000000 !important;
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
        <LanguageProvider>
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
        </LanguageProvider>
      </Providers>
    </Flex>
  );
}
