/** Tiny shared-secret gate for the internal metrics page and CSV export. */
export function isAdmin(key: string | null | undefined) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return process.env.NODE_ENV !== "production";
  return key === expected;
}
