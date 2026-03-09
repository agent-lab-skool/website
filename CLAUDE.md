# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run lint     # Run ESLint
bun start        # Start production server
```

Package manager is **Bun** (bun.lock).

## Architecture

- **Next.js 16** with App Router, React 19, TypeScript
- **React Server Components** enabled by default
- Source lives in `src/` with path alias `@/*` → `./src/*`

### Routing

- `/` — Main landing page (`src/app/page.tsx`)
- `/guides` — Index of all guides (`src/app/guides/page.tsx`)
- `/guides/[slug]` — Individual guide pages, statically generated (`src/app/guides/[slug]/page.tsx`)
- `/content` — Content directory for lead magnets and free resources (`src/app/content/page.tsx`)

### Page Folder Structure

Every route folder (`src/app/<route>/`) follows this convention:

```
src/app/<route>/
├── page.tsx           # Page component
├── actions.ts         # Server Actions
├── schemas.ts         # Zod / validation schemas
├── types.d.ts         # Local type definitions
├── _components/       # Page-specific components
└── _utils/            # Page-specific utility functions
```

Only create files as needed. `page.tsx` is the only required file.

### Styling & Components

- **Tailwind CSS v4** via PostCSS (no `tailwind.config.ts`; theme defined inline in `globals.css`)
- **shadcn/ui** (new-york style, neutral base color) -- components in `src/components/ui/`
- **Magic UI** available via MCP and shadcn registry alias `@magicui`
- `cn()` utility in `src/lib/utils.ts` merges classes with clsx + tailwind-merge
- Animation library: **motion** (Framer Motion successor)
- Icons: **lucide-react**

### Guides Content System

Guides use **JSON files** in `content/guides/*.json` (not MDX). Each JSON file defines a `Guide` with structured blocks:

- **Types:** `Guide` → `GuideSection[]` → `GuideBlock[]`
- **Block types:** `text`, `code`, `heading3`, `bullet`, `link`, `image`
- **Logic:** `src/app/guides/_lib/guides.ts` — `getAllGuides()` and `getGuide(slug)`
- **Static generation:** Uses `generateStaticParams()` from the JSON filenames
- **Guide components:** `src/app/guides/_components/`

To add a new guide, create a JSON file in `content/guides/<slug>.json` matching the `Guide` interface.

### Constants

- `src/lib/constants/links.ts` — `SKOOL_URL` (all CTAs link here)
- `src/lib/constants/vsl.ts` — `CTA_APPEAR_TIME` (in-player CTA delay)

### Fonts

- `Inter_Tight` — Primary sans-serif
- `Geist_Mono` — Monospace
- `Instrument_Serif` — Serif accents

### Analytics

`@vercel/analytics` and `@vercel/speed-insights` are integrated in the root layout.

### shadcn Configuration

Registry config in `components.json`. To add a shadcn component:
```bash
bunx shadcn@latest add <component-name>
```

## Product Context

### Agent Lab -- `/` page

The `/` page is a conversion-focused sales page for **Agent Lab**, a paid community targeting builders and founders who want to use AI to grow their businesses. The community is hosted on **Skool**.

**Traffic flow:** Instagram/TikTok -> ManyChat -> this page -> Skool

**What the community offers:**
- AI playbooks & workflows for automating business ops, content, sales
- Weekly live implementation calls
- Curated AI tool stack & prompt library
- Plug-and-play templates and SOPs
- Private community of builders
- Founding member pricing locked in forever

**Who's behind it:** @aflekkas, a founder who built a $50K/mo company using AI, 2M+ monthly views, no dev team.

**Page structure:** Hero (rotating headlines) -> Social Proof Bar -> Problem -> Offer -> Testimonials -> About -> FAQ. All CTAs link to the Skool URL defined in `src/lib/constants/links.ts`.

### Guides and Content

**Guides** (`/guides`) are free educational content that double as SEO entry points and conversion funnels. Each guide includes strategically placed CTAs and a testimonials section.

**Content directory** (`/content`) is a hub for lead magnets and free resources (guides, breakdowns, playbooks) designed to capture leads and drive traffic to the community.

## Copy Style

- **Never use em dashes** in any copy, text, or content. Use commas, periods, or restructure the sentence instead.

## Design Style

- **Black and white only.** The site uses a monochrome palette. Do not introduce colors (no emerald, blue, red, etc.). Icons, text, borders, accents should all be white/neutral shades on the dark background.
