"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/context";
import { CartProvider } from "@/lib/cart/context";
import { AuthProvider } from "@/lib/auth/context";
import { PartnerAuthProvider } from "@/lib/auth/partner-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PartnerAuthProvider>
          <CartProvider>{children}</CartProvider>
        </PartnerAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
