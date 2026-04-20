"use client";

import { usePageTracking } from "@/hooks/usePageTracking";

export function TrackingReporter() {
  usePageTracking();
  return null;
}
