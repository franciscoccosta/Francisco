# ReMade

ReMade recovers surplus material from construction projects and gives it a second form. Materials with enough volume are routed back into construction; smaller, unusual or leftover materials are transformed into one-of-one furniture. This repository is a full-stack prototype of the product: a public furniture marketplace (World 1 — Customer) and a partner operations platform (World 2 — Partner) for the construction companies that supply the material.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first theme, no config file)
- Client-side state via React Context, persisted to `localStorage` (cart, customer/partner auth, orders, partner-submitted materials, PPGRCD drafts) — structured so it can be swapped for a real backend later
- Custom i18n architecture: Portuguese (default), English, Spanish, French, German, Norwegian

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Customer demo:** any email/password works at checkout or `/account`.
- **Partner demo:** any email/password works at `/partner/login`.

## Structure

- `src/app/(site)` — public marketplace, product pages, cart/checkout, customer account
- `src/app/partner` — partner login and dashboard (materials, AI analysis, projects, collections, PPGRCD)
- `src/lib/data` — structured mock data (products, materials, projects, partners, collections)
- `src/lib/i18n` — dictionaries, category/material taxonomies, language context
- `src/components/visuals` — the before/after material ↔ furniture visual language (generated SVG, no external image assets)

## Notes

This is a prototype. Payment, AI material analysis and image generation are simulated with clearly isolated logic so they can be replaced by real integrations (Stripe, a vision model, a render pipeline) without restructuring the app.
