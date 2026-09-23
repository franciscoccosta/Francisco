"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const TOPIC_KEYS = ["topicOrder", "topicDelivery", "topicAssembly", "topicProduct", "topicMaterial", "topicReturns", "topicProAssembly"] as const;

export function SupportWidget() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const greeting = t("support", "initialGreeting");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: t("support", "offlineNotice") }]);
    }, 500);
  };

  const sendTopic = (key: (typeof TOPIC_KEYS)[number]) => {
    const label = t("support", key);
    setMessages((m) => [...m, { from: "user", text: label }]);
    window.setTimeout(() => {
      const replies: Record<string, { pt: string; en: string }> = {
        topicOrder: { pt: "Pode acompanhar o estado da sua encomenda em Conta → Encomendas.", en: "You can track your order under Account → Orders." },
        topicDelivery: { pt: "Entrega normal: 5–8 dias úteis. Expresso: 2–3 dias úteis.", en: "Standard delivery: 5–8 business days. Express: 2–3 business days." },
        topicAssembly: { pt: "As instruções de montagem ficam disponíveis em Conta → Montagem após a compra.", en: "Assembly instructions become available under Account → Assembly after purchase." },
        topicProduct: { pt: "Cada peça é única — veja a história do material na página do produto.", en: "Every piece is unique — see the material's story on the product page." },
        topicMaterial: { pt: "Os materiais vêm diretamente de obras parceiras avaliadas antes da transformação.", en: "Materials come directly from partner construction sites, evaluated before transformation." },
        topicReturns: { pt: "Devoluções avaliadas caso a caso nos primeiros 14 dias — contacte-nos.", en: "Returns are handled case by case within the first 14 days — contact us." },
        topicProAssembly: { pt: "Pode pedir montagem profissional na página do produto ou na sua encomenda.", en: "You can request professional assembly on the product page or your order." },
      };
      const r = replies[key];
      const text = locale === "pt" ? r.pt : r.en;
      setMessages((m) => [...m, { from: "bot", text }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-paper shadow-2xl animate-fade-up">
          <div className="flex items-center justify-between bg-charcoal px-4 py-3">
            <p className="text-sm font-semibold text-paper">{t("support", "title")}</p>
            <button onClick={() => setOpen(false)} aria-label={t("common", "close")} className="text-paper/70 hover:text-paper">
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-stone px-3 py-2 text-sm text-charcoal">{greeting}</div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === "user" ? "ml-auto rounded-br-sm bg-ember text-paper" : "rounded-bl-sm bg-stone text-charcoal"
                }`}
              >
                {m.text}
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TOPIC_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => sendTopic(k)}
                    className="rounded-full border border-charcoal/15 px-2.5 py-1 text-xs text-ink-soft hover:border-ember hover:text-ember"
                  >
                    {t("support", k)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-charcoal/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("support", "placeholder")}
              className="flex-1 rounded-full border border-charcoal/15 bg-white px-3 py-2 text-sm outline-none focus:border-ember"
            />
            <button type="submit" className="rounded-full bg-ember px-3 py-2 text-sm font-medium text-paper">
              {t("support", "send")}
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("support", "title")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-paper shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
