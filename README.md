# ReMade — *Giving the past a future.*

Customer-validation MVP for ReMade, a B2B circular marketplace in Lisbon for reclaimed construction wood. Builders offer reusable wood; architects and designers find it, with its history preserved in a **Material Passport**.

The site tests four things: will builders offer wood, will designers want it, do they value provenance enough to pay a premium, and which types of wood they want.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node **22.13+** because submissions are stored with Node's built-in `node:sqlite`, so no database server is needed.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, problem, how it works, featured materials, Material Passport, CTA |
| `/materials` | Curated catalogue with filters (type, location, condition, availability) |
| `/materials/[slug]` | Material Passport: gallery, passport, story, sources, impact, **interest form** |
| `/for-builders` | "I have wood to offer": supplier form with photo upload |
| `/for-designers` | "I'm looking for wood": catalogue, then signup form (priorities + premium question) |
| `/about` | Story, focus (Lisbon · Wood · B2B), team |
| `/admin?key=…` | Validation metrics + CSV export (not linked from the site) |

## What gets measured

All data goes into `data/remade.sqlite` (git-ignored). Uploaded photos go into `data/uploads/`.

- **submissions**: builder offers, designer signups, material requests (full form payload)
- **events**: anonymous page views, passport views, interest-modal opens, and clicks on every CTA (`data-cta` attribute). Visitors are counted by a random id kept in `localStorage`. No cookies, no personal data. Known bots and headless browsers are ignored.

`/admin` shows the six numbers asked for: visitors, builder submissions, designer signups, material requests, visitor → signup conversion, and passport view → request conversion. It also shows what designers value, their answers to the premium question, the wood types in demand and on offer, per-material funnels, and CTA clicks. The **CSV export** is at `/api/export?key=…`.

## Environment variables

| Variable | Use |
| --- | --- |
| `ADMIN_KEY` | Protects `/admin` and the CSV export. **Required in production** (without it the admin page is locked). In dev it is open when unset. |
| `SUBMISSIONS_WEBHOOK_URL` | Every submission (with photos) and every event is also POSTed here as JSON. **Required on Vercel.** Ready-made Google Sheets receiver: [`docs/google-sheets.md`](docs/google-sheets.md). |
| `REMADE_DATA_DIR` | Optional. Where the SQLite file and uploads live (default `./data`). |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for social-share images. |

**Deploying:**
- **Vercel:** the filesystem is read-only and throwaway, so the SQLite file goes to `/tmp` and only lives as long as one server instance. Connect the Google Sheet ([`docs/google-sheets.md`](docs/google-sheets.md)): it receives every form, photo (saved to Google Drive) and visit, and its **Resumo** tab calculates the validation numbers. Photos are shrunk in the browser before upload, to stay under Vercel's 4.5 MB request limit.
- **VPS, Railway, Render or Fly.io with a volume:** SQLite works as is. Point `REMADE_DATA_DIR` at the volume.

`src/lib/store.ts` is the only file that touches storage.

## Content rules (important)

The catalogue (`src/lib/materials.ts`) uses **real Lisbon projects** that are undergoing or recently completed rehabilitation: Fábrica de Moagem and Fábrica de Pão (former Manutenção Militar, Beato), Pedras Negras House (Sé/Baixa), Formoso (Marvila), the former factory on Rua Maria Luísa Holstein and The Wake at Doca de Alcântara (Alcântara).

- ReMade does **not** hold material from any of them. Every listing is labelled *"Prototype material — potential recovery source"*.
- Building facts and stories only contain information from the public sources cited on each passport.
- Unknowns (species, age of the timber, previous use) say **"To be verified"**.
- Dimensions, quantities, availability status and CO₂ figures are **indicative placeholders**, labelled as such. CO₂ uses a placeholder factor (`CO2_T_PER_M3`) to be replaced by a proper LCA.

When real material comes in, edit `src/lib/materials.ts`. It is the only content source.

## Images

The build environment had no access to photo libraries, so every image in `public/images` is **rendered procedurally** by `scripts/generate-textures.py` (`npm run textures`, needs `numpy` + `pillow`). The site says so wherever the images could be read as documentation ("Illustrative images — not photographs of this site").

To use real photography, replace any file in `public/images/` with a photo of the same name and a similar aspect ratio. No code changes are needed. Good first candidates are `hero-beam.jpg` (full-screen hero) and `editorial-*.jpg`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `node:sqlite`.
