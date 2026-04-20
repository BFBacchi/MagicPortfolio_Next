"use client";

import { useEffect, useMemo, useState } from "react";
import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

type PageView = {
  id: string;
  path: string;
  country: string | null;
  city: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  created_at: string;
};

type StatItem = {
  label: string;
  value: number;
};

type DashboardState = {
  totalViews: number;
  views7d: number;
  viewsToday: number;
  topCountry: string;
  recentViews: PageView[];
  topPages: StatItem[];
  topCountries: StatItem[];
  topReferrers: StatItem[];
};

const INITIAL_STATE: DashboardState = {
  totalViews: 0,
  views7d: 0,
  viewsToday: 0,
  topCountry: "-",
  recentViews: [],
  topPages: [],
  topCountries: [],
  topReferrers: [],
};

function aggregateTop(items: Array<string | null | undefined>, limit = 5): StatItem[] {
  const map = new Map<string, number>();
  for (const raw of items) {
    const key = (raw || "").trim() || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function AdminPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadAnalytics = async () => {
      setLoading(true);
      const now = new Date();
      const start7d = new Date(now);
      start7d.setDate(now.getDate() - 7);
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [
        totalRes,
        weekRes,
        todayRes,
        recentRes,
        aggregateRes,
      ] = await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }),
        supabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .gte("created_at", start7d.toISOString()),
        supabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startToday.toISOString()),
        supabase
          .from("page_views")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("page_views")
          .select("path,country,referrer")
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);

      const recentViews = (recentRes.data || []) as PageView[];
      const aggRows = aggregateRes.data || [];
      const topPages = aggregateTop(aggRows.map((r) => r.path), 5);
      const topCountries = aggregateTop(aggRows.map((r) => r.country), 5);
      const topReferrers = aggregateTop(aggRows.map((r) => r.referrer), 5);

      setState({
        totalViews: totalRes.count || 0,
        views7d: weekRes.count || 0,
        viewsToday: todayRes.count || 0,
        topCountry: topCountries[0]?.label || "-",
        recentViews,
        topPages,
        topCountries,
        topReferrers,
      });
      setLoading(false);
    };

    void loadAnalytics();
  }, [authLoading, user]);

  const summaryCards = useMemo(
    () => [
      { label: t("admin.total_views"), value: String(state.totalViews) },
      { label: t("admin.views_7d"), value: String(state.views7d) },
      { label: t("admin.views_today"), value: String(state.viewsToday) },
      { label: t("admin.top_country"), value: state.topCountry },
    ],
    [state, t]
  );

  if (authLoading || loading) {
    return (
      <Column maxWidth="l" fillWidth gap="l" padding="xl">
        <Heading>{t("admin")}</Heading>
        <Text>{t("admin.loading")}</Text>
      </Column>
    );
  }

  if (!user) {
    return (
      <Column maxWidth="l" fillWidth gap="l" padding="xl">
        <Heading>{t("admin")}</Heading>
        <Text>{t("admin.must_login")}</Text>
      </Column>
    );
  }

  const renderTopList = (title: string, list: StatItem[]) => (
    <Column
      fillWidth
      gap="s"
      padding="m"
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      radius="m"
    >
      <Text variant="heading-strong-s">{title}</Text>
      {list.length === 0 ? (
        <Text onBackground="neutral-weak">{t("admin.no_data")}</Text>
      ) : (
        list.map((item) => (
          <Flex key={`${title}-${item.label}`} horizontal="space-between" fillWidth>
            <Text>{item.label}</Text>
            <Text>{item.value}</Text>
          </Flex>
        ))
      )}
    </Column>
  );

  return (
    <Column maxWidth="l" fillWidth gap="l" padding="xl">
      <Heading>{t("admin")}</Heading>
      <Text onBackground="neutral-weak">{t("admin_description")}</Text>

      <Flex fillWidth wrap gap="m">
        {summaryCards.map((card) => (
          <Column
            key={card.label}
            minWidth={18}
            padding="m"
            border="neutral-alpha-medium"
            background="neutral-alpha-weak"
            radius="m"
            gap="xs"
          >
            <Text onBackground="neutral-weak">{card.label}</Text>
            <Text variant="display-strong-s">{card.value}</Text>
          </Column>
        ))}
      </Flex>

      <Column
        fillWidth
        gap="s"
        padding="m"
        border="neutral-alpha-medium"
        background="neutral-alpha-weak"
        radius="m"
      >
        <Text variant="heading-strong-s">{t("admin.recent_views")}</Text>
        {state.recentViews.length === 0 ? (
          <Text onBackground="neutral-weak">{t("admin.no_data")}</Text>
        ) : (
          <Column fillWidth gap="xs">
            <Flex fillWidth horizontal="space-between" gap="s">
              <Text>{t("admin.col_time")}</Text>
              <Text>{t("admin.col_path")}</Text>
              <Text>{t("admin.col_country")}</Text>
              <Text>{t("admin.col_city")}</Text>
              <Text>{t("admin.col_device")}</Text>
              <Text>{t("admin.col_browser")}</Text>
              <Text>{t("admin.col_referrer")}</Text>
            </Flex>
            {state.recentViews.map((view) => (
              <Flex key={view.id} fillWidth horizontal="space-between" gap="s">
                <Text>{formatDateTime(view.created_at)}</Text>
                <Text>{view.path}</Text>
                <Text>{view.country || "Unknown"}</Text>
                <Text>{view.city || "Unknown"}</Text>
                <Text>{view.device || "Unknown"}</Text>
                <Text>{view.browser || "Unknown"}</Text>
                <Text>{view.referrer || "Directo"}</Text>
              </Flex>
            ))}
          </Column>
        )}
      </Column>

      <Flex fillWidth wrap gap="m">
        {renderTopList(t("admin.top_pages"), state.topPages)}
        {renderTopList(t("admin.top_countries"), state.topCountries)}
        {renderTopList(t("admin.top_referrers"), state.topReferrers)}
      </Flex>
    </Column>
  );
}
