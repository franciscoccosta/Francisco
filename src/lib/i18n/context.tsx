"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import pt, { type Dictionary } from "./dictionaries/pt";
import en from "./dictionaries/en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en };

const STORAGE_KEY = "remade.locale";

type Section = keyof Dictionary;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <S extends Section>(section: S, key: keyof Dictionary[S]) => string;
  dict: Dictionary;
  localize: (text: { pt: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && isLocale(stored)) {
        setLocaleState(stored);
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage access issues
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const dict = DICTIONARIES[locale];

  const t = useCallback(
    <S extends Section>(section: S, key: keyof Dictionary[S]) => {
      const value = dict[section][key];
      return typeof value === "string" ? value : String(value);
    },
    [dict]
  );

  const localize = useCallback(
    (text: { pt: string; en: string }) => {
      return text[locale] ?? text.en ?? text.pt;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, dict, localize }),
    [locale, setLocale, t, dict, localize]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
