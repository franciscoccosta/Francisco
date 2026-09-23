import type { Metadata } from "next";
import Link from "next/link";
import { MaterialCard } from "@/components/MaterialCard";
import { DesignerForm } from "@/components/forms/DesignerForm";
import { MATERIALS } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Find reclaimed wood — for architects & designers",
  description: "Tell ReMade what your next project needs. Reclaimed wood from Lisbon with character, provenance and measurable impact.",
};

export default function DesignersPage() {
  // Show what is closest to being usable first.
  const order = { available: 0, "coming-soon": 1, reserved: 2, potential: 3 } as const;
  const shown = [...MATERIALS].sort((a, b) => order[a.status] - order[b.status]).slice(0, 3);

  return (
    <div className="pt-18">
      <header className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 md:px-10 md:pt-24">
        <p className="eyebrow animate-fade-up text-wood">For architects &amp; interior designers</p>
        <div className="mt-5 grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="display animate-fade-up text-6xl [animation-delay:100ms] md:col-span-7 md:text-8xl">Find material with a story.</h1>
          <div className="animate-fade-up [animation-delay:200ms] md:col-span-5">
            <p className="text-lg leading-relaxed text-ink-soft">
              Tell us what your next project needs. We&rsquo;ll help you find reclaimed wood with character, provenance and measurable
              impact.
            </p>
            <a
              href="#join"
              data-cta="designers_hero_jump"
              className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold hover:border-wood hover:text-wood"
            >
              Skip to the form
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M10 3v13M5 11l5 5 5-5" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="flex items-end justify-between border-t border-line pt-8">
          <h2 className="display text-4xl">Available now &amp; coming soon</h2>
          <Link href="/materials" className="text-sm font-semibold underline underline-offset-4 hover:text-wood">
            All {MATERIALS.length} materials
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((m) => (
            <MaterialCard key={m.id} m={m} />
          ))}
        </div>
      </section>

      <section id="join" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-wood">Join ReMade</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">Tell us about your next project.</h2>
            <p className="mt-6 text-ink-soft">
              We&rsquo;re building ReMade&rsquo;s first catalogue around what Lisbon&rsquo;s architects and designers actually need. Your
              answers decide which materials we recover first.
            </p>
            <ul className="mt-10 space-y-4 border-t border-line pt-8 text-sm text-ink-soft">
              <li className="flex gap-3">
                <span className="font-mono text-wood">→</span> Every material comes with a Material Passport.
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-wood">→</span> Sourced from buildings in Lisbon and surrounding areas.
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-wood">→</span> Refurbishment through partner workshops where needed.
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <DesignerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
