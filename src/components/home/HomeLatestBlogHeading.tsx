"use client";

import { Flex, Heading } from "@once-ui-system/core";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomeLatestBlogHeading() {
  const { t } = useLanguage();
  return (
    <Flex flex={1} paddingLeft="l" paddingTop="24">
      <Heading as="h2" variant="display-strong-xs" wrap="balance">
        {t("home.latest_blog")}
      </Heading>
    </Flex>
  );
}
