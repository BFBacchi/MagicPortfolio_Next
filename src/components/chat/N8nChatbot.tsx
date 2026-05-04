"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatRobotIcon } from "./ChatRobotIcon";
import styles from "./n8n-chatbot.module.css";

type Role = "user" | "assistant";

interface ChatLine {
  role: Role;
  content: string;
}

const SESSION_KEY = "n8n-chat-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s-${Date.now()}`;
  }
}

export function N8nChatbot() {
  const { t } = useLanguage();
  const titleId = useId();
  const panelDomId = "n8n-chatbot-panel";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [sessionId, setSessionId] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const scrollToEnd = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, loading, open, scrollToEnd]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.welcome") }]);
    }
  }, [open, messages.length, t]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userLine: ChatLine = { role: "user", content: text };
    setMessages((prev) => [...prev, userLine]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          ...(sessionId ? { sessionId } : {}),
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      const obj = data as { reply?: string; error?: string };

      if (!res.ok) {
        const fallback =
          res.status === 503 && obj.error === "chat_not_configured"
            ? t("chat.unavailable")
            : t("chat.error");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallback },
        ]);
        return;
      }

      const reply =
        typeof obj.reply === "string" && obj.reply.trim()
          ? obj.reply.trim()
          : t("chat.error");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.error") },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, t]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className={styles.wrap}>
      {open && (
        <section
          id={panelDomId}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className={styles.panelHeader}>
            <div className={styles.panelHeaderMini}>
              <ChatRobotIcon title={t("chat.robot_alt")} size={32} />
            </div>
            <h2 id={titleId} className={styles.panelTitle}>
              {t("chat.title")}
            </h2>
            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setOpen(false)}
              aria-label={t("chat.close")}
            >
              ×
            </button>
          </header>
          <div
            ref={listRef}
            className={styles.messages}
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}-${m.content.slice(0, 24)}`}
                className={`${styles.bubble} ${
                  m.role === "user" ? styles.bubbleUser : styles.bubbleBot
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className={styles.typing}>{t("loading")}</div>
            )}
          </div>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("chat.placeholder")}
              disabled={loading}
              autoComplete="off"
              aria-label={t("chat.placeholder")}
            />
            <button
              type="submit"
              className={styles.send}
              disabled={loading || !input.trim()}
            >
              {t("chat.send")}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("chat.close") : t("chat.open")}
      >
        <ChatRobotIcon size={40} />
      </button>
    </div>
  );
}
