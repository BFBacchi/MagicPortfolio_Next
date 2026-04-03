"use client";

import { Heading } from "@once-ui-system/core";
import { useLanguage } from "@/contexts/LanguageContext";

export function BlogPageHeading() {
  const { t } = useLanguage();
  return (
    <Heading marginBottom="l" variant="display-strong-s">
      {t("news.title")}
    </Heading>
  );
}
