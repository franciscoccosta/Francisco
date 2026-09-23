/** Wordmark: growth rings cut by a straight line — old timber, new cut. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="16" cy="16" r="14.5" />
        <path d="M16 6.5a9.5 9.5 0 1 1-9.5 9.5" />
        <path d="M16 11a5 5 0 1 1-5 5" />
        <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <span className="font-display text-[1.65rem] leading-none tracking-tight">
        Re<span className="italic">Made</span>
      </span>
    </span>
  );
}
