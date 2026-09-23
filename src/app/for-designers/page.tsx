import type { Metadata } from "next";
import Link from "next/link";
import { MATERIALS } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";
import { Reveal } from "@/components/Reveal";
import { BuyerForm } from "./BuyerForm";

export const metadata: Metadata = {
  title: "For Architects & Designers",
  description: "Reclaimed wood from Lisbon buildings, with character, provenance and measurable impact.",
};

export default function ForDesigners() {
  return (
    <>
      <section className="container-x pt-36 pb-16 md:pt-48 md:pb-24">
        <p className="eyebrow animate-fade-up">For architects &amp; interior designers</p>
        <h1 className="display animate-fade-up mt-6 max-w-5xl text-6xl [animation-delay:120ms] md:text-[7.5rem]">
          Find material with <span className="italic">a story.</span>
        </h1>
        <div className="animate-fade-up mt-10 grid gap-8 [animation-delay:240ms] md:grid-cols-12">
          <p className="text-lg leading-relaxed text-ink md:col-span-6">
            Tell us what your next project needs. We&rsquo;ll help you find reclaimed wood with character, provenance
            and measurable impact.
          </p>
          <div className="flex gap-3 md:col-span-5 md:col-start-8 md:justify-end">
            <a href="#join" className="btn btn-dark min-h-14 px-8 text-base" data-cta="designers hero: looking for wood">
              I&rsquo;m looking for wood
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-x py-16 md:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">In the catalogue now</p>
              <h2 className="display mt-4 text-4xl md:text-5xl">Materials with a past.</h2>
            </div>
            <Link href="/materials" className="link-underline shrink-0 text-sm" data-cta="designers: browse all">
              Browse &amp; filter →
            </Link>
          </div>
          <div className="mt-12 -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:-mx-10 md:px-10 [scrollbar-width:thin]">
            {MATERIALS.map((m) => (
              <div key={m.id} className="w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[27vw]">
                <MaterialCard m={m} variant="featured" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="scroll-mt-20 bg-linen">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Join ReMade</p>
            <h2 className="display mt-6 text-5xl md:text-6xl">What is your next project looking for?</h2>
            <p className="mt-6 leading-relaxed text-ink">
              We&rsquo;re building the catalogue around real demand. Tell us what you need and we&rsquo;ll look for it on
              Lisbon&rsquo;s renovation and demolition sites.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li>— Every material comes with a Material Passport</li>
              <li>— Sourced in Lisbon and surrounding areas</li>
              <li>— Refurbishment through partner workshops when needed</li>
            </ul>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <BuyerForm />
          </div>
        </div>
      </section>
    </>
  );
}
