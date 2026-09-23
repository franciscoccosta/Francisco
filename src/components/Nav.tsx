"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/materials", label: "Browse Wood" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/for-builders", label: "For Builders" },
  { href: "/for-designers", label: "For Designers" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // Menu is tied to the path it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((typeof v === "function" ? v(open) : v) ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        transparent ? "text-cream" : "bg-cream/92 text-charcoal backdrop-blur-md border-b border-line/70"
      }`}
    >
      <nav className="container-x flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label="ReMade — home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 text-[0.88rem] lg:flex">
          {LINKS.map((l) => {
            const active = l.href === pathname;
            return (
              <li key={l.href}>
                <Link href={l.href} className={`link-underline pb-0.5 ${active ? "bg-[length:100%_1px]" : ""}`}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/for-builders#offer"
            data-cta="nav: offer material"
            className={`btn hidden min-h-10 px-5 text-[0.85rem] sm:inline-flex ${transparent ? "btn-light" : "btn-dark"}`}
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
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <ul className="container-x flex flex-col py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-display block py-3 text-3xl" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link href="/for-builders#offer" data-cta="nav: offer material" className="btn btn-dark w-full">
                Offer Material
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
