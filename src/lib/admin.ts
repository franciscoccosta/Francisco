/**
 * The metrics page and CSV export are protected by a shared key
 * (ADMIN_KEY env var). In development they are open when no key is set.
 */
export function isAdmin(key: string | null | undefined) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return process.env.NODE_ENV !== "production";
  return key === expected;
}
