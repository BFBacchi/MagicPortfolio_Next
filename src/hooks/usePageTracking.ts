"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function shouldSkip(path: string): boolean {
  return path.startsWith("/api") || path.startsWith("/admin");
}

export function usePageTracking() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    const path = pathname || "/";
    if (!path || shouldSkip(path)) return;
    if (lastTracked.current === path) return;
    lastTracked.current = path;

    const referrer = typeof document !== "undefined" ? document.referrer : "";

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer }),
      keepalive: true,
    }).catch(() => {
      // Silent fail: analytics should never block UX.
    });
  }, [pathname]);
}
