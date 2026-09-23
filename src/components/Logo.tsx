/** Wordmark with a growth-ring mark — the end grain of a reclaimed beam. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="18" cy="21" r="4" />
        <circle cx="19" cy="20" r="9.5" />
        <circle cx="20" cy="19.5" r="16" />
        <circle cx="18" cy="21" r="1" fill="currentColor" stroke="none" />
      </svg>
      <span className="font-display text-[1.7rem] leading-none tracking-tight">ReMade</span>
    </span>
  );
}
