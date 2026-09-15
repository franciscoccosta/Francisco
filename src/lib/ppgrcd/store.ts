import type { PpgrcdStatus } from "@/lib/types";

export interface PpgrcdDraftItem {
  materialTypeId: string;
  estimatedTons: number;
  reusable: boolean;
}

export interface PpgrcdRecord {
  status: PpgrcdStatus;
  draft: PpgrcdDraftItem[];
}

const KEY = "remade.ppgrcd";

function readAll(): Record<string, PpgrcdRecord> {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, PpgrcdRecord>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getPpgrcdRecord(projectId: string): PpgrcdRecord | null {
  return readAll()[projectId] ?? null;
}

export function savePpgrcdRecord(projectId: string, record: PpgrcdRecord) {
  const all = readAll();
  all[projectId] = record;
  writeAll(all);
}
