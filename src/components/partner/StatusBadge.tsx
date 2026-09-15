import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/i18n/context";
import type { MaterialStatus, CollectionStatus } from "@/lib/types";

const MATERIAL_TONE: Record<MaterialStatus, "warn" | "good" | "info" | "ember" | "charcoal" | "bad"> = {
  processing: "warn",
  available: "good",
  matched: "info",
  collection: "ember",
  sold: "charcoal",
  recycled: "info",
  rejected: "bad",
};

const MATERIAL_KEY: Record<MaterialStatus, "statusProcessing" | "statusAvailable" | "statusMatched" | "statusCollection" | "statusSold" | "statusRecycled" | "statusRejected"> = {
  processing: "statusProcessing",
  available: "statusAvailable",
  matched: "statusMatched",
  collection: "statusCollection",
  sold: "statusSold",
  recycled: "statusRecycled",
  rejected: "statusRejected",
};

export function MaterialStatusBadge({ status }: { status: MaterialStatus }) {
  const { t } = useLanguage();
  return <Badge tone={MATERIAL_TONE[status]}>{t("partner", MATERIAL_KEY[status])}</Badge>;
}

const COLLECTION_TONE: Record<CollectionStatus, "warn" | "good" | "info" | "bad"> = {
  scheduled: "info",
  confirmed: "good",
  delayed: "bad",
  completed: "warn",
};

export function CollectionStatusBadge({ status }: { status: CollectionStatus }) {
  const { locale } = useLanguage();
  const labels: Record<CollectionStatus, Record<string, string>> = {
    scheduled: { pt: "Agendado", en: "Scheduled" },
    confirmed: { pt: "Confirmado", en: "Confirmed" },
    delayed: { pt: "Atrasado", en: "Delayed" },
    completed: { pt: "Concluído", en: "Completed" },
  };
  return <Badge tone={COLLECTION_TONE[status]}>{labels[status][locale] ?? labels[status].en}</Badge>;
}
