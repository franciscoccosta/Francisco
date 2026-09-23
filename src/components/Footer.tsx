"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export const CONTACT_EMAIL = "hello@remade.pt";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Logo />
            <p className="display mt-8 max-w-md text-5xl md:text-6xl">
              Giving the past <em className="text-wood-light">a future.</em>
            </p>
            <p className="mt-6 text-sm text-cream/60">Lisbon, Portugal</p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-cream/50">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <Link href="/materials" className="hover:text-wood-light">Browse Materials</Link>
              </li>
              <li>
                <Link href="/offer" data-cta="footer_offer_material" className="hover:text-wood-light">Offer Material</Link>
              </li>
              <li>
                <Link href="/designers" data-cta="footer_designers" className="hover:text-wood-light">For Architects &amp; Designers</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-wood-light">About</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-cream/50">Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 block text-[0.95rem] hover:text-wood-light">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-cream/40">Placeholder address</p>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50 md:flex-row md:justify-between">
          <p>ReMade is currently validating its first circular material marketplace in Lisbon.</p>
          <p>Material images are illustrative renders. Anonymous usage statistics only — no cookies.</p>
        </div>
      </div>
    </footer>
  );
}
