import type { Metadata } from "next";
import Link from "next/link";
import { GRADES, MATERIALS } from "@/lib/materials";
import { MaterialsBrowser } from "./MaterialsBrowser";

export const metadata: Metadata = {
  title: "Browse Wood",
  description: "A small, curated catalogue of reclaimed wood from Lisbon buildings, each with its Material Passport.",
};

export default function MaterialsPage() {
  return (
    <div className="container-x pt-32 pb-24 md:pt-40">
      <header className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow">Browse wood · Lisbon</p>
          <h1 className="display mt-6 text-6xl md:text-8xl">Wood with an address.</h1>
        </div>
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <p className="leading-relaxed text-ink">
            A deliberately small catalogue. Each listing is tied to a real Lisbon building or project undergoing
            rehabilitation — and carries its own Material Passport.
          </p>
        </div>
      </header>

      <aside className="mt-12 grid gap-6 border border-line bg-linen/60 p-6 text-sm md:grid-cols-12 md:p-8">
        <div className="md:col-span-5">
          <p className="font-mono text-[0.65rem] tracking-[0.16em] text-walnut uppercase">About this prototype catalogue</p>
          <p className="mt-3 leading-relaxed text-ink">
            ReMade does not yet hold material from these sites. They are real projects we see as{" "}
            <em>potential recovery sources</em>. Building facts come from public sources, cited on each passport;
            anything unconfirmed says &ldquo;To be verified&rdquo;. Dimensions, quantities, CO₂ figures and
            availability are indicative, and images are illustrative.
          </p>
        </div>
        <dl className="grid gap-3 md:col-span-6 md:col-start-7">
          {GRADES.map((g) => (
            <div key={g.id} className="flex gap-4">
              <dt className="w-16 shrink-0 font-mono text-xs">{g.label}</dt>
              <dd className="text-muted">{g.description}</dd>
            </div>
          ))}
          <p className="pt-2 text-muted">
            Have a site that belongs here?{" "}
            <Link href="/for-builders#offer" className="text-charcoal underline underline-offset-4" data-cta="catalogue: have wood">
              I have wood to offer
            </Link>
          </p>
        </dl>
      </aside>

      <div className="mt-12">
        <MaterialsBrowser materials={MATERIALS} />
      </div>
    </div>
  );
}
