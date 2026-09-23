"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/**
 * Records a page view on every navigation, and a click on any element with a
 * `data-cta` attribute (its value is the label reported in the metrics).
 */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    track("page_view");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta]");
      if (el && !location.pathname.startsWith("/admin")) track("cta_click", { label: el.dataset.cta });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

export function TrackPassportView({ materialId }: { materialId: string }) {
  useEffect(() => {
    track("passport_view", { materialId });
  }, [materialId]);
  return null;
}
