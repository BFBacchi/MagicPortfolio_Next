"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";
import { useLanguage } from "@/contexts/LanguageContext";
import { stripLocalePrefix } from "@/i18n/locale";

interface RouteGuardProps {
	children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);
      setIsPasswordRequired(false);
      setIsAuthenticated(false);

      const normalizePath = (path: string | null): string | null => {
        if (!path) return null;
        const withoutLocale = stripLocalePrefix(path);
        if (withoutLocale !== "/" && withoutLocale.endsWith("/")) {
          return withoutLocale.replace(/\/+$/, "") || "/";
        }
        return withoutLocale;
      };

      const checkRouteEnabled = () => {
        const path = normalizePath(pathname);
        if (!path) return false;

        if (path in routes) {
          return routes[path as keyof typeof routes];
        }

        const dynamicRoutes = ["/noticias", "/work"] as const;
        for (const route of dynamicRoutes) {
          if (path.startsWith(route) && routes[route]) {
            return true;
          }
        }

        return false;
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);

      const pathForProtection = normalizePath(pathname) ?? pathname;
      if (protectedRoutes[pathForProtection as keyof typeof protectedRoutes]) {
        setIsPasswordRequired(true);

        const response = await fetch("/api/check-auth");
        if (response.ok) {
          setIsAuthenticated(true);
        }
      }

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError(t("routeGuard.wrong_password"));
    }
  };

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
		return <NotFound />;
	}

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          {t("routeGuard.protected_title")}
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label={t("routeGuard.password_label")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>{t("routeGuard.submit")}</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
