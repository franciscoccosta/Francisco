import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect x="12" y="16" width="24" height="24" rx="4" transform="rotate(-8 12 16)" fill="currentColor" opacity="0.35" />
      <circle cx="40" cy="38" r="13" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  href = "/discover",
  tone = "dark",
  className = "",
}: {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-display text-xl tracking-tight ${
        tone === "dark" ? "text-charcoal" : "text-paper"
      } ${className}`}
    >
      <LogoMark className={`h-7 w-7 ${tone === "dark" ? "text-ember" : "text-ember-light"}`} />
      ReMade
    </Link>
  );
}
