# nothingfiner.github.io

Eliot Asenoth Gaspar-Finer's portfolio site: Preact + TypeScript + Tailwind
+ Vite, hash-routed via `wouter-preact` for GitHub Pages compatibility.
The interactive components come from the glaphicUI web-component library,
consumed by source through a Vite alias to a sibling checkout
(`../glaphicUI/src`) — never copied into this repo.

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Run the dev server (sibling checkout paths must exist):

```bash
yarn dev
```

3. Production build (runs Vite, then the prerender pass populates
   `dist/index.html` for non-JS fetchers):

```bash
yarn build
```

## Structure

- `src/pages/` — route components (`*.tsx`, lazy-loaded in `app.tsx`)
- `src/components/` — the landing's section components and shared pieces
- `src/landing.css` — the landing's shared class layer (band, marquee, reveals)
- `src/lib/` — in-site infrastructure (incl. the glaphic element registrar)
- `public/assets/` — project images, logo, resume PDF
- `design/` — mockups referenced during build-out

## Content and copy

Project copy lives in `src/data/projects.ts` (index cards) and
`src/data/projectDetails.ts` (detail plates); the past-work bands'
responsibilities live in `src/data/pastWork.ts`.

## Deployment

Deploy the built `dist/` folder to GitHub Pages (hash routing keeps
deep links one path).