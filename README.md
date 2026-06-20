# BuildLens AI

**Snap the idea. Scan the space. Build it right.**

BuildLens AI turns inspiration photos and a quick scan of your space into precise blueprints,
optimized cut lists, local pricing, and a guided, safety-first build plan. This repository is the
MVP, built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui**.

The app ships pre-loaded with a fully worked **raised garden bed** demo project so every tool can be
explored end-to-end.

## Features

- **Landing page** with hero, feature tour, and project list
- **New Project Wizard** (type → details → units → review)
- **Project Dashboard** with a stat strip and section tabs
- **Inspiration upload** & **Build-site upload** (drag-and-drop, image previews, scan files)
- **Manual measurement entry** with **confidence badges** (high / medium / low / AI / manual) and source tags
- **Good / Better / Best** design tiers that drive the rest of the plan
- **SVG blueprint preview** (to-scale plan view) and a **3D / VR preview placeholder**
- **Materials list** grouped by category with line-item pricing
- **Mock local pricing** across several simulated retailers
- **Obsessive cut optimizer** — first-fit-decreasing bin packing with **kerf logic**
- **Cost comparison** across retailers with availability + distance
- **Project timeline** and **guided build steps** with inline safety badges
- **TWI Job Instruction** and **Job Breakdown Sheet** training documents
- **Export build packet** (live JSON export today; printable PDF on the roadmap)
- **Safety warning system** ranked by severity with PPE callouts

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  lib/
    types.ts          # core domain model (serialization-friendly)
    demoProject.ts    # the raised garden bed demo data
    store.tsx         # React context store (localStorage-backed)
    cutOptimizer.ts   # kerf-aware 1D cutting-stock optimizer
    deriveCuts.ts     # turns measurements + tier into a concrete cut list
    pricing.ts        # mock local retailer pricing engine
    utils.ts          # cn(), currency & imperial formatting
  components/
    ui/               # shadcn/ui primitives
    sections/         # dashboard sections (upload, measurements, cut optimizer, ...)
  pages/
    Landing.tsx
    NewProjectWizard.tsx
    Dashboard.tsx
```

## Built to integrate

The data model and module boundaries were designed so these can drop in later without a rewrite:

| Area | Where it plugs in |
| --- | --- |
| **AI vision** | `UploadSection` → derive measurements & style from inspiration/site photos |
| **Supabase** | `lib/store.tsx` swaps localStorage for Supabase persistence + auth |
| **AR / LiDAR** | `Measurement.source = "lidar"` already modeled; feed scans into measurements |
| **3D / VR** | `components/sections/Preview3D.tsx` placeholder ready for a WebXR/3D renderer |
| **Retailer pricing** | `lib/pricing.ts` swaps the mock engine for a live, ZIP-aware API |

> Pricing and AI features are mocked for the MVP and clearly labeled in the UI.
