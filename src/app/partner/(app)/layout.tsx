import type { ReactNode } from "react";
import { PartnerShell } from "@/components/partner/PartnerShell";

export default function PartnerAppLayout({ children }: { children: ReactNode }) {
  return <PartnerShell>{children}</PartnerShell>;
}
