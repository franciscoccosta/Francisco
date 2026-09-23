import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost-light" | "wood";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-wood-dark",
  secondary: "border border-ink/80 text-ink hover:bg-ink hover:text-cream",
  wood: "bg-wood text-paper hover:bg-wood-dark",
  light: "bg-cream text-ink hover:bg-paper",
  "ghost-light": "border border-cream/70 text-cream hover:bg-cream hover:text-ink",
};

export const buttonClass = (variant: Variant = "primary", extra = "") =>
  `group inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-[0.92rem] font-semibold tracking-wide transition-colors duration-300 ${VARIANTS[variant]} ${extra}`;

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

/**
 * Link styled as a button. `cta` names the conversion action; clicks on any
 * element with data-cta are recorded by <Tracker>.
 */
export function ButtonLink({
  variant = "primary",
  cta,
  arrow = true,
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; cta?: string; arrow?: boolean }) {
  return (
    <Link {...props} data-cta={cta} className={buttonClass(variant, className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
