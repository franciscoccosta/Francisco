"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/materials", label: "Browse Wood" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/offer", label: "For Builders" },
  { href: "/designers", label: "For Designers" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  if (pathname.startsWith("/admin")) return null;

  // Over the full-bleed home hero the bar is transparent with light text.
  const overlay = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        overlay ? "bg-transparent text-cream" : "border-b border-line/70 bg-cream/90 text-ink backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Link href="/" aria-label="ReMade — home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => {
            const active = l.href !== "/#how-it-works" && pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-[0.9rem] font-medium transition-opacity hover:opacity-100 ${
                    active ? "opacity-100" : "opacity-75"
                  } after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 ${
                    active ? "after:w-full" : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/offer"
            data-cta="nav_offer_material"
            className={`hidden rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-colors sm:inline-flex ${
              overlay ? "bg-cream text-ink hover:bg-paper" : "bg-ink text-cream hover:bg-wood-dark"
            }`}
          >
            Offer Material
          </Link>
          <button
            type="button"
            className="-mr-2 p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-cream px-5 pb-8 pt-4 lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-line/70 py-4 font-display text-3xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/offer"
            data-cta="nav_offer_material"
            className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
          >
            Offer Material
          </Link>
        </div>
      )}
    </header>
  );
}
