"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const TOPICS: Record<string, Record<string, string>> = {
  collection: { pt: "Recolha de material", en: "Material collection" },
  registration: { pt: "Registo de projeto", en: "Project registration" },
  status: { pt: "Estado do material", en: "Material status" },
  documentation: { pt: "Documentação", en: "Documentation" },
  account: { pt: "Conta", en: "Account" },
  platform: { pt: "Suporte da plataforma", en: "Platform support" },
};

export default function PartnerSupportPage() {
  const { t, locale } = useLanguage();
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-paper">{t("partner", "supportTitle")}</h1>
      <p className="mt-2 text-sm text-slate-light">{t("support", "offlineNotice")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(TOPICS).map(([key, labels]) => (
          <button
            key={key}
            onClick={() => setTopic(key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              topic === key ? "border-ember bg-ember text-paper" : "border-graphite-line text-slate-light hover:border-slate"
            }`}
          >
            {labels[locale] ?? labels.en}
          </button>
        ))}
      </div>

      {sent ? (
        <p className="mt-6 rounded-xl bg-good/10 px-4 py-3 text-sm text-good">✓ {t("support", "offlineNotice")}</p>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <Label className="!text-slate-light">{t("support", "placeholder")}</Label>
            <Textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="!bg-graphite-soft !border-graphite-line !text-paper"
            />
          </div>
          <Button type="submit">{t("support", "send")}</Button>
        </form>
      )}
    </div>
  );
}
