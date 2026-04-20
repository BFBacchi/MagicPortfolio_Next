import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type TrackPayload = {
  path?: string;
  referrer?: string;
};

function isDevHost(host: string | null): boolean {
  if (!host) return false;
  return host.includes("localhost") || host.includes("127.0.0.1");
}

function parseClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const low = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(low)) return "tablet";
  if (/mobi|android|iphone|ipod|blackberry|phone/.test(low)) return "mobile";
  return "desktop";
}

function detectBrowser(ua: string): string {
  const low = ua.toLowerCase();
  if (low.includes("edg/")) return "Edge";
  if (low.includes("opr/") || low.includes("opera")) return "Opera";
  if (low.includes("firefox/")) return "Firefox";
  if (low.includes("samsungbrowser/")) return "Samsung Internet";
  if (low.includes("chrome/")) return "Chrome";
  if (low.includes("safari/")) return "Safari";
  return "Unknown";
}

function normalizeReferrer(referrer?: string): string {
  const value = (referrer || "").trim();
  if (!value) return "Directo";
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("google")) return "Google";
    if (host.includes("github")) return "GitHub";
    if (host.includes("facebook")) return "Facebook";
    if (host.includes("twitter") || host.includes("x.com")) return "X/Twitter";
    return host;
  } catch {
    return value;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackPayload;
    const path = (body.path || "").trim();
    if (!path) return NextResponse.json({ ok: false, reason: "path_required" }, { status: 400 });
    if (path.startsWith("/api") || path.startsWith("/admin")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const ua = req.headers.get("user-agent") || "";
    const host = req.headers.get("host");
    const ip = parseClientIp(req);

    let country = "Unknown";
    let city = "Unknown";

    if (isDevHost(host)) {
      country = "Local";
      city = "Dev";
    } else {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (geoRes.ok) {
          const geo = (await geoRes.json()) as { country_name?: string; city?: string };
          country = geo.country_name || country;
          city = geo.city || city;
        }
      } catch {
        // Keep Unknown values on geo failure.
      }
    }

    const { error } = await supabase.from("page_views").insert({
      path,
      country,
      city,
      referrer: normalizeReferrer(body.referrer),
      device: detectDevice(ua),
      browser: detectBrowser(ua),
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
