"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PARTNERS } from "@/lib/data/partners";

const STORAGE_KEY = "remade.partner";

export interface PartnerSession {
  partnerId: string;
  email: string;
}

interface PartnerAuthContextValue {
  session: PartnerSession | null;
  ready: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const PartnerAuthContext = createContext<PartnerAuthContextValue | null>(null);

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PartnerSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSession(JSON.parse(stored));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string) => {
    const partnerId = PARTNERS[0]?.id ?? "partner-1";
    const next: PartnerSession = { email, partnerId };
    setSession(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ session, ready, login, logout }), [session, ready, login, logout]);

  return <PartnerAuthContext.Provider value={value}>{children}</PartnerAuthContext.Provider>;
}

export function usePartnerAuth() {
  const ctx = useContext(PartnerAuthContext);
  if (!ctx) throw new Error("usePartnerAuth must be used within PartnerAuthProvider");
  return ctx;
}
