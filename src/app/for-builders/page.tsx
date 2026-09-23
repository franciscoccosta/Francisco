import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SupplierForm } from "./SupplierForm";

export const metadata: Metadata = {
  title: "For Builders — Offer Material",
  description: "Have reusable wood on a renovation or demolition project in Lisbon? Tell ReMade about it — it's free.",
};

const BENEFITS = [
  { t: "Free to submit", d: "Offering material costs nothing. No account, no commitment." },
  { t: "Lower disposal costs", d: "Material that is sold is material you don’t pay to take away." },
  { t: "Stays on site", d: "Whenever possible, the wood stays where it is until a buyer is found." },
  { t: "We find the buyers", d: "ReMade connects your material with Lisbon’s architects and designers." },
  { t: "Circular construction", d: "Evidence of reuse for your project, your clients and your reporting." },
];

export default function ForBuilders() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal text-cream">
        <Image src="/images/rm-lx-004-a.jpg" alt="" fill priority sizes="100vw" className="animate-slow-zoom object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />
        <div className="relative container-x pt-40 pb-20 md:pt-52 md:pb-28">
          <p className="eyebrow animate-fade-up !text-cream/70">For construction, renovation &amp; demolition companies</p>
          <h1 className="display animate-fade-up mt-6 max-w-4xl text-6xl [animation-delay:120ms] md:text-[7.5rem]">
            Don&rsquo;t throw value away.
          </h1>
          <p className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-cream/85 [animation-delay:240ms]">
            If your project has reusable wood, tell us about it. ReMade helps give it a second life.
          </p>
          <a href="#offer" className="btn btn-light animate-fade-up mt-10 min-h-14 px-8 text-base [animation-delay:360ms]" data-cta="builders hero: have wood">
            I have wood to offer
          </a>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map((b, i) => (
            <Reveal as="li" key={b.t} delay={i * 80} className="bg-cream p-7">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <p className="display mt-8 text-3xl leading-tight">{b.t}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b.d}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Wood that needs work can go to one of our partner workshops before it reaches its next project.
        </p>
      </section>

      <section id="offer" className="scroll-mt-20 bg-linen">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Report material</p>
            <h2 className="display mt-6 text-5xl md:text-6xl">Tell us what you have.</h2>
            <p className="mt-6 leading-relaxed text-ink">
              Two minutes is enough. Rough numbers are fine — we&rsquo;ll follow up to check details and, if useful, visit
              the site.
            </p>
            <p className="mt-6 text-sm text-muted">Currently Lisbon and surrounding areas, wood only.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <SupplierForm />
          </div>
        </div>
      </section>
    </>
  );
}
