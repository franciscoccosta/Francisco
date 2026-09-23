import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[3px] font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ember text-paper hover:bg-ember-dark active:scale-[0.98]",
  secondary: "bg-charcoal text-paper hover:bg-ink active:scale-[0.98]",
  ghost: "bg-transparent text-charcoal hover:bg-stone/50",
  outline: "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal/5 active:scale-[0.98]",
  dark: "bg-paper text-graphite hover:bg-white active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  target,
}: CommonProps & { href: string; target?: string }) {
  return (
    <Link
      href={href}
      target={target}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
