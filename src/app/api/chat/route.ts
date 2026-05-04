import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 4000;

function extractReply(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string") {
    const s = data.trim();
    return s.length ? s : null;
  }
  if (typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const keys = [
    "reply",
    "message",
    "text",
    "output",
    "response",
    "answer",
    "content",
  ];
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  if (o.json && typeof o.json === "object") {
    return extractReply(o.json);
  }
  if (Array.isArray(o)) {
    for (const item of o) {
      const r = extractReply(item);
      if (r) return r;
    }
  }
  const dataArr = o.data;
  if (Array.isArray(dataArr) && dataArr[0] != null) {
    return extractReply(dataArr[0]);
  }
  return null;
}

export async function POST(request: NextRequest) {
  const webhook = process.env.N8N_CHAT_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json(
      { error: "chat_not_configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { message, sessionId, messages } = body as {
    message?: unknown;
    sessionId?: unknown;
    messages?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "message_required" }, { status: 400 });
  }

  const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);

  const forward = {
    message: trimmed,
    ...(typeof sessionId === "string" && sessionId
      ? { sessionId: sessionId.slice(0, 128) }
      : {}),
    ...(Array.isArray(messages) ? { messages } : {}),
  };

  let upstream: Response;
  try {
    upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forward),
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  const rawText = await upstream.text();
  let parsed: unknown = rawText;
  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    /* plain text response */
  }

  if (!upstream.ok) {
    const reply =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : undefined;
    return NextResponse.json(
      { error: "upstream_error", status: upstream.status, detail: reply },
      { status: 502 }
    );
  }

  const reply = extractReply(parsed) ?? (typeof rawText === "string" && rawText.trim() ? rawText.trim() : null);
  if (!reply) {
    return NextResponse.json(
      { error: "empty_reply", hint: "Return JSON with reply, message, or text" },
      { status: 502 }
    );
  }

  return NextResponse.json({ reply });
}
