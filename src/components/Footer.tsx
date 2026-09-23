import Link from "next/link";
import { Logo } from "./Logo";

export const CONTACT_EMAIL = "hello@remade.pt";

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="display mt-8 max-w-sm text-4xl md:text-5xl">Giving the past a future.</p>
          <p className="mt-6 text-sm text-cream/60">Lisbon, Portugal</p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="eyebrow !text-cream/50">Explore</p>
          <ul className="mt-5 space-y-3 text-[0.95rem]">
            <li><Link className="link-underline" href="/materials">Browse Materials</Link></li>
            <li><Link className="link-underline" href="/for-builders">Offer Material</Link></li>
            <li><Link className="link-underline" href="/for-designers">For Architects &amp; Designers</Link></li>
            <li><Link className="link-underline" href="/about">About</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow !text-cream/50">Contact</p>
          <a className="link-underline mt-5 inline-block text-[0.95rem]" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="container-x py-6 text-xs text-cream/50">
          ReMade is currently validating its first circular material marketplace in Lisbon.
        </p>
      </div>
    </footer>
  );
}
