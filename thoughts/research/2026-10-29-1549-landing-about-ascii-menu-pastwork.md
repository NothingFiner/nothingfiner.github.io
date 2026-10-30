# Research — landing-about ASCII components · pool-menu open size · past-work page

- **Date:** 2026-10-29 15:49 (amended 16:49 — Topic 2 re-researched)
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **HEAD at research:** `38c3c17` ("docs: use Eliot's pronouns (she/her) in the landing's DRAFT-note comment")
- **Tree state:** clean (no uncommitted changes)
- **Method:** read-only subagents (locator/analyzer/pattern-survey), reports merged; every claim carries a file:line or commit citation. Live captures in /tmp (drawer-capture.mjs — superseded appendix; poolmenu-open-390{,-2}.png, poolmenu-open-1440.png).
- **Correction note (2026-10-29 16:49):** the sizing request targets **glaphicUI's `glaphic-pool-menu`** (the pool-menu patch in the footer band), NOT the legacy MenuDrawer drawer. MenuDrawer's findings are archived in the appendix; the section below is the pool menu.
- **Scope discipline:** facts only. No design decisions, no changes — decisions belong to the plan phase (`/create_plan`).

---

## Topic 1 — the landing-about ASCII animations

**Found on day one: nothing is animated by JavaScript.** The two ASCII figures (the asteroid "shell rises, flashes, bursts" run and the "2012 → C0DE → job ticker" run) are pure CSS cycle machines: frame data in module-scope arrays, one `<span>` per frame stacked in a single inline-grid cell, visibility flicked by generated `step-end` keyframes with per-frame `animation-delay` off an `--i` custom property. No setInterval, no rAF, no preact state for frames.

### Components
| Piece | Where | Nature |
|---|---|---|
| `FRAMES` (9 strings, the burst) | src/components/LandingAbout.tsx:37-47 | inline data, module scope |
| `JOB_FRAMES` (30 strings, the ticker) | src/components/LandingAbout.tsx:49-81 | inline data, module scope |
| `sparkAnim(count, tag)` keyframe generator | src/components/LandingAbout.tsx:91-114 | the generic machinery |
| `BURST_ANIM` / `JOB_ANIM` evaluated once | src/components/LandingAbout.tsx:115-116 | module-scope CSS strings |
| `.spark-burst` cell-stack core CSS | src/components/LandingAbout.tsx:337-358 | inline-grid, shared cell, `white-space: pre` |
| styling block (whole component) | src/components/LandingAbout.tsx:180-368 | template-literal `<style>` in light DOM |
| in-view latch + ride-out choreography | src/components/LandingAbout.tsx:119-171, landing-shared.ts:14-47 | page machinery, NOT the animation |

### Facts
- Frame data is content, machinery is generic. The in-file comment explains the historic bug the generator exists to avoid: a 9-frame burst and a 30-frame ticker "can't share hardcoded percentages (the shared set desynced the job's loop)" (LandingAbout.tsx:83-90). `n = count + 2` holds the final frame (line 92).
- DOM footprint: plain spans, `role="img"` + per-widget `aria-label` (LandingAbout.tsx:405-407, 421-423). Display: `inline-grid; align-items: end; width: 7ch` (:339-341); `^` row bottoms (355).
- Metrics: hardcoded system-mono stack `ui-monospace, "SF Mono", Menlo, …` (:342) — NOT the library's `--glaphic-font-family-mono` (`../glaphicUI/src/tokens/tokens.css:108` = IBM Plex Mono); `font-size: 48px` fixed (:346); NO letter-spacing; line-height 1.3 (:343).
- Inks are literals: `INK = '#0D0221'`, `RED = '#A6022A'` (:34-35), `.spark-burst` border `#A6022A` / background `#14F1C8` / `color: white` (:348-351). No site-token or glaphic-token use.
- Speed: per-widget `--sb-step` — default `0.16s` (:338) overridden INLINE to `0.2s` on BOTH instances (:404, :420).
- Reduced motion: cycle stops, final frame shown (LandingAbout.tsx:364-367); shared `.grow-drop` box-shadow build lives in src/landing.css:45-47 + keyframes :519+ with its own 1ms reduce override (:53-58).
- At 390px: the single 899px breakpoint (:323-336) changes layout only — the art itself stays 48px / 7ch.
- Gate inconsistency (fact, for the planner to weigh): the spark cycle and `.grow-drop` start at element insertion; only the `.ab-fade` opacity staggers are `.ab-in`-gated (inView state :119-171, classes :177, :403, :419). GrowHead's headline build IS inView-gated (GrowHead.tsx:8-12); the marquee drop is `.ab-in`-gated (:260).
- Page CSS depends on the marquee's internals: `.ab-marquee::part(rail-top)` (LandingAbout.tsx:329).
- The spans carry the duplicated class literal `class="spark-burst spark-burst grow-drop"` (:403) — intentional specificity or typo, not answerable from code.
- Cleanup is clean today: timer-free mechanic; rideOutUp unbinds rAF + listeners on unmount (landing-shared.ts:41-46); IO disconnects (LandingAbout.tsx:170); the marquee prop-setting effect (:127-134) is mount-once, no teardown needed for what it does.

### glaphicUI library anatomy (read-only survey — glaphicUI is off-limits for edits)
- 31 component dirs; one dir per element: `glaphic-<name>.ts` + `.stories.ts`. Both `glaphic-marquee` and `glaphic-tape` exist and are consumed by the site.
- Pattern: `import { LitElement, css } from 'lit'` → `export class GlaphicX extends LitElement` → `static properties = {…}` (Lit derives attributes; no manual `observedAttributes`) → declare fields + constructor defaults → `static styles = css`` (shadow styles, own keyframes INSIDE the component: glaphic-marquee.ts:173-180, reduced-motion :181-189) → `render()` → `customElements.define('glaphic-marquee', GlaphicMarquee)` at module scope (marquee.ts:211) → `HTMLElementTagNameMap` declaration. Parts declared (`part="band/rail/…"` marquee.ts:197-205); `render()` returning `null` is a legal pattern when the host carries the visual (glaphic-tape.ts:136-139).
- Tier-2 knobs everywhere with fallbacks, e.g. `--glaphic-font-family-mono` (marquee.ts:165), `:host([size='s'])` ladders (tape.ts:101-103).
- Site consumption: src/lib/glaphic-registrar.ts value-imports each `Glaphic*` class and void-refs it (:24-72) — because glaphicUI's package.json declares `"sideEffects": ["**/*.css"]` (glaphicUI/package.json:7-9) and rollup pruned the registration barrel in served builds until `fe594be` fixed it. A NEW glaphic element means a new registrar line (:18: "The list mirrors the site's JSX. Keep it in step when a page starts
composing a new element").
- Array-valued Lit properties cannot travel as JSX attributes — the marquee precedent sets them imperatively via ref (`el.strings = TICKER; el.speed = 26`, LandingAbout.tsx:127-134, TICKER in landing-shared.ts:4).

### Open questions (for the plan)
1. Frames via property (marquee/imperative-ref precedent) or slotted light-DOM spans? Both precedents exist.
2. Keyframe identity: generated names are module-global tag strings (`spark-flip-burst`) — collision-safe parameterization per mount, or accept today's behavior?
3. Which mono unifies the art: the hardcoded stack or `--glaphic-font-family-mono`?
4. Should the cycle wait for inView (GrowHead pattern) or run from mount behind `.ab-fade` (current)?
5. Is `.grow-drop` part of a spark component or page-level choreography? Both claims exist on the same spans today.
6. Was the unscaled 48px/7ch art at 390 verified on a real device?
7. Which `--sb-step` is spec: the 0.16s default or the 0.2s inline override both instances use?
8. Does `aria-label` copy join a generic API (hardcoded today)?
9. Library placement implies Eliot-authored review + registration changes in an off-limits repo (in-flight files there) — sequencing decision for the plan.

---

## Topic 2 — the `glaphic-pool-menu` open size on smaller screens

(AMENDED 2026-10-29 16:49: this replaces the MenuDrawer section — the sizing request targets the pool-menu patch, not the legacy drawer.)

**The headline fact: the open panel is EXACTLY the same box at 390 and at 1440 — measured 232×430 stack (224×422 plates, 25px entries) at BOTH sizes. No responsive scaling exists anywhere in the component or the site's consumption of it; the only cross-size difference is where the wrapper sits.** Whether "expand on smaller screens" means the panel itself or its contents, today nothing scales.

### Component API (../glaphicUI/src/components/glaphic-pool-menu/glaphic-pool-menu.ts — all refs = that file; READ-ONLY)
- LitElement; props L95-108: `open` (reflect), `label` (trigger aria), `anchor` (default `top-left`; the site uses `bottom-right` — grows left+up holding the trigger's right/bottom edges; docheader L55-69), `count`/`panelWidth`/`panelHeight` (measured, "0 = the tier-2 vars stand" L105), `force-hover` (CSS-only mirror L429-438). Entries = light-DOM `<a>`/`<button>` slotted, one per row (`items()` L209-216); `change` event `{index, open}` per move.
- Open mechanics: persistent shadow trigger `<button class="trigger">` toggles (`onTriggerClick` L285-287); closes on item activation, Escape, click outside (composed path), and ANY hashchange — including the site wipe's capture-phase nav (L128-134). `aria-expanded` rides the trigger (L643-644).
- **Size knobs declared** (docheader L74-89; defaults verified in the CSS): trigger `--glaphic-pool-menu-trigger-width` 65px / `-trigger-height` 48px / `-trigger-offset` 4px; panel `-panel-width` 308px / `-panel-height` 454px / `-panel-offset-inline|block` 8px; items `-item-size` 25px / `-item-gap` 36px / `-item-start` 16px / `-item-inset` 24px / `-item-end` 16px / `-item-slide` 40px; lines `-line-size` 4px / `-line-width` 44px / `-line-first` 17px / `-line-pitch` 10px; motion `-motion` 0.35s cubic-bezier(0.4,0,0.2,1) / `-stagger` 40ms; inks/surfaces `-surface`, `-back-surface`, `-line-ink`, `-item-ink`, `-item-hover-ink`.
- **How the open panel is sized:** CONTENT-MEASURED, not knob-fixed. `measurePanel()` (L174-207) writes width = widest entry + 24px×2 padding + 8px left inset (224 = 168.4 + 56) and height = entries Σ + gaps + insets + the 52px bottom patch strip; re-measured on slotchange (L126), every `updated()` (L227-230) and `document.fonts.ready` (L171 — taller type grows it). The 308×454 defaults apply ONLY if the author pins `-panel-width/-height` (L201-206). Open-only inline vars land on `.stack` (`panelVars` L628-634).
- **No constraint exists anywhere:** zero `max-*`/`clamp`/`min()` in the component CSS; the panel grows up/left from the held edges unbounded. `.items` sheet has `overflow: hidden` (L482) — harmless today (nothing outgrew it: scroll==client measured), but it is the clip that would bite if entries outgrew the sheet. Entry type is `white-space: nowrap` (L502) — long labels auto-grow WIDTH with no wrap fallback.
- Layout when open: vertical plate rows in a flex column (NOT radial), `align-items: flex-start`, gap 36px (L478-481); entry typography Space Grotesk 25px/lh 1/weight 500 (L490-510), slide-in 40px keyed on `[open]` (L507, 515-524). Open trigger rides up 12px for bottom-right (L591-593; measured translate). Parts: `stack/back/front/items` (L636-639). Plates are `mix-blend-mode: multiply` (L369, 390). Reduced motion honored: `transition: none !important` + `translate: none !important` (L612-625).

### Site consumption (READ-ONLY refs)
- The patch: src/components/SiteFooter.tsx:217-228 — wrapper `.lf-menu-arrive.lf-shown` (the 0.5s arrive wrapper's fill is backwards-ONLY by design — landing.css:316-337 + SiteFooter.tsx:214-216 doc the paint trap: a forwards fill kept the wrapper composited and trapped the pool plates' multiply blend) around `<glaphic-pool-menu anchor="bottom-right" label="Menu">` with EXACTLY 6 entries: Home, Projects, Chat with Bot, Blog, Resume, Dark Forest (# paths, SiteFooter.tsx:220-225).
- Placement: landing's journey pose wraps it in `.lf-cluster` (absolute right 2.3vw bottom 4.4vh desktop; **≤899px: fixed right 6vw bottom 10vh, social hidden**, landing.css:238-251, 346-365); every other route's footer pose wraps it in `.lf-menu` (fixed right 2.3vw bottom 11vh z-45, landing.css:127-133; **≤767px: right 4vw bottom 10vh** landing.css:418-421); band pointer-events carve-out landing.css:119-122 + :134-136 (the band itself is pointer-events:none, landing.css:86-88; journey band sticky z-45 37.5vh, :91-116).
- **The site sets ONLY inks today**: `.lf-band glaphic-pool-menu { --glaphic-pool-menu-item-ink: #F9FAF4; --glaphic-pool-menu-item-hover-ink: #14F1C8; --glaphic-pool-menu-line-ink: #F9FAF4; }` (landing.css:252-256). Grep proves NO size knob is set anywhere in src/. Nothing in the wrappers/band has overflow/clip/max-* (all measured `overflow: visible`, `clip-path: none`).
- Site hooks: `menuOpen()` = `!!document.querySelector('glaphic-pool-menu[open]')` + an EXCLUDE selector (SiteFooter.tsx:187-188); the pool's `change` event tucks the LEARN MORE invite on open (SiteFooter.tsx:201-206); the landing's crimson panel hides its nav while the pool is open (LandingPanel.tsx:319-323).

### Measured (real clicks, settled)
- **Common (both sizes):** host `panelWidth=224, panelHeight=422, count=6`; stack inline vars 224×422; trigger closed = 69×52 (65×48 plate + 4px twin offset), crimson front multiply; entries 25×25, pitch 61px (25+36); widest = "Chat with Bot" 168.4px; ALL size knobs resolved EMPTY on the host (defaults + measurement only).
- **390 open:** stack 232×430 at (134.6, 329.6) — grown left+up holding the closed trigger's right edge 366.6 and bottom 759.6. Plates 224×422 (front at 142.6,337.6; back twin peeking −8/−8). `.items` sheet 224×370, insets 8/0/52/8, padding 16px 24px. Entries at x 166.6, tops y 353.6/414.6/475.6/536.6/597.6/658.6. Trigger open at (297.6,695.6) −12px, aria-expanded true. **Viewport overflow: NONE** (84.4px free below the stack, 134.6px free left of it); doc scrollWidth 390 unchanged; **no clipping** on host/stack/items/cluster/arrive (scroll==client everywhere). Escape verified close. The ≤767 static band is inert here (band rect y1390 in flow); the fixed `.lf-cluster` IS the anchor on landing.
- **1440 open (scrolled to band):** stack 232×430 at (1174.9, 381.3) — same box; entries at x 1206.9 from y 405.3. **The panel's top rises ~181px above the sticky journey band's top edge (562.4)** — nothing clips (overflow visible); viewport overflow none. Closed trigger at (1337.9,759.3).

### Open questions (for the plan)
1. Content-measured panel: is "bigger on small screens" a knob-pinned size (site-side, easy), bigger items/gaps (site-side, grows the measurement), or a responsive/viewport-quantized panel (glaphicUI change)?
2. Which knobs should drive it, and must the CLOSED 69×52 patch stay untouched? (`-trigger-*` knobs resize BOTH poses — one shared formula; `-item-size/-item-gap` grow only the measured open panel.)
3. Should height be clamped to the viewport from the bottom-right anchor (today: nothing clamps, unbounded upward growth)? Clamping is a glaphicUI change.
4. Width auto-grows from the widest NOWRAP entry toward viewport overflow with no wrap policy — is a wrap/max-width policy wanted at 390? (glaphicUI change.)
5. Non-landing pages use the footer pose whose ≤767px pin (right 4vw bottom 10vh) was NOT captured — verify the enlargement there too?
6. Paint traps to re-verify after enlargement: the arrive wrapper keeps backwards-only fill (blend trap), the sticky band's z-45 stacking context bounds the multiply blends, and the 12px open-trigger ride must still read at bigger sizes.

---

## Topic 3 — new "past work" page (agency bands → details)

**The big find: the data layer already anticipates this page.** src/data/projectDetails.ts:11-16 documents, in-repo: *"the coming agency-works page will mount this same corner composition with an extra section in the crimson plate: put a `responsibilities: string[]` on an entry… and add the agency entries keyed the same way. No agency route or data exists yet on purpose — this file only leaves the shape ready."* `ProjectDetailContent.responsibilities?: string[]` (projectDetails.ts:30-33) exists and renders only when present (ProjectDetail.tsx:925-949).

**Second big find: the four showcase images exist outside the repo, on the Desktop** — so nothing is lost:
- `/Users/asenoth/Desktop/brooksbrothers.png` (914,787 B, md5 86516f1e…) — a different crop/compress from the repo's tracked `public/assets/brooksbrothers.png` (202,618 B, md5 b5c475a5…)
- `/Users/asenoth/Desktop/forever21_1.png` + `forever21_2.png` (341,481 / 1,050,330 B)
- `/Users/asenoth/Desktop/reformation_1.png` + `reformation_2.png` (555,133 / 668,118 B)
- `/Users/asenoth/Desktop/batseville.png` (408,287 B) — **Batesville, stored under a typo'd filename**
- Git history verdict: no forever/batesville/reformation image was EVER tracked on ANY branch (full-history filename sweep incl. `master` + `gh-pages` found nothing ever deleted). The "deletion" was the pre-redesign handoff.

### Routing + chrome facts (app.tsx)
- Hash routing (`Router hook={useHashLocation}` :141); route table inside one `<Suspense>` (:107-117): /projects, /projects/:id, /chat, /blog(/:id), /games/dark-forest, /about, /resume, /components→GlaphicGallery. Landing has NO route (isSplitLayout renders `<Landing />` wholesale :87-92). Every page is statically imported today — the Suspense fallback is nominal (:11-20).
- Chrome gates are boolean consts (:45-68): dark-forest startsWith; isBareStage = chat||projects||blog||resume (:58 → StickyHeader suppressed :98-104); lampOn = lava blobs ONLY on projects(index+detail)+chat (:62-68); MenuDrawer off under dark-forest (:85); SiteFooter mounted once per route by app.tsx (:130, `menuDelay={isChat ? 0 : 1550}`); `pt-24` skipped for dark-forest+bare (:106).
- PageWipe runs on all routes EXCEPT across `/projects/` navs (PageWipe.tsx:175) — detail navs hold their own swaps.
- A new route touches: page component + `<Route>` entry + gate booleans + data/pages.ts:3-21 (titles).

### Data facts
- `Project` (src/data/projects.ts:2-16): id/title/image/description + optional gallery/githubUrl/status/tags + `copy: 'live' | 'draft'` (:11-15). **ids are positional** (:18-19, "the reorder agent moves them"); `projectByTitle` (:70-76) is the stable lookup, throws on a missing title.
- `projectDetails.ts` keyed by name-tag (:105-106); `getProjectDetail(project)` (:115-119); detail carries its own `copy` (:40-43) printed as the plate's `DRAFT COPY — AWAITING ELIOT` (ProjectDetail.tsx:875, .pd-draft :477-486).
- The four names exist as data only in resume prose (src/data/resume.ts:18; useRAG.ts:28).

### Detail format facts (src/pages/ProjectDetail.tsx — the "same format" to reuse)
- Pinned plates + streaming images: `.pd-title` FLURO plate fixed top-left z-40, grid-col 1/5, chamfered (:419-451; mobile flip :812-817), printing `PRJ.{index+1} /// {TITLE}` off `projects.indexOf` (:858 — hardwired to the index). `.pd-details` CRIMSON plate fixed bottom (:502-510; mobile flip :818-820): TECHNOLOGIES (:931-936), gated RESPONSIBILITIES (:925-949 — the agency seam), STATUS/SOURCE rows reading the INDEX project's fields (:950-968), `detail.rows[]` (:969-976).
- Image stream: `.pd-image-block-container` plate cols 5-12 (FLURO rim, double chamfer :631-636), `streamImages` = detail.images → project.gallery → [project.image] (:341-345), eager-first/lazy-rest (:898-906), `glaphic-tape pattern="ramp"` 12px crimson separators between images (:644-648).
- Held-swap driver (module-scope capture-phase listener :253-318): intercepts ALL `/projects/` navs, exit → hash → first image decode mid-hold (:152-162); reduced-motion parks it (:787-797).
- Hardwired: back → `#/projects` (:880-884); next-CTA = `projects[(i+1)%len]` (:338-339, :911-922) — agency entries inserted into `projects[]` would renumber every PRJ.00N and join the next-chain; `#main-content:has(.pd-page)` foot shift (:845-851); `overflow: clip` (:391-395); unmatched id falls back to `projects[0]` (:325).

### Index format facts (src/pages/Projects.tsx) + LandingPast
- `.pr-grid` = auto-fill minmax(340px) CARD GRID (:83-89) — not a column of bands. Card = one `<a>`, 3:2, keyline/clip/fluro-shadow (:102-121, :227-257), meta row + image + `<glaphic-fan>` difference-blend title (:245-254); no copy on cards.
- LandingPast (src/components/LandingPast.tsx) already carries `GrowHead "Past Work"` (:30) and the single Brooks image (:39-41) — its relationship to the new page is an open question.
- design/ has NO past-work/agency/band mock (only chat-*, landing-hero, projects-card).

### Constraints (standing)
- app.tsx = routes and chrome only; pages compose their own sections + style block; SiteFooter never duplicated (extensions via props); LavaLampBackground site-wide, blobs opt-in; assets → public/assets; copy provenance: draft copy prints a DRAFT tag, never dressed as sourced; z ladder: skip-link 100 / MenuDrawer 60 / StickyHeader 50 / band+panel 45/40 / lamp −10; verification = tsc clean + 1440/390 screenshots + zero console errors + scrollWidth==clientWidth + REAL clicks; drivers/screenshots outside the repo; glaphicUI off-limits (in-flight files).

### Open questions (for the plan)
1. Canonical Desktop copies + the compress/crop step (the repo's Brooks is a different, smaller artifact — what's the spec?) + asset naming (fix the `batseville.png` typo on the way in).
2. One image per band — which of each pair (Forever 21 / Reformation) leads; does the band index both?
3. Data home: `projects[]` (renumbering consequences) vs the anticipated agency entries in `projectDetails.ts` vs a new structure.
4. Route path + gate memberships (bare-stage? lamps?). No route exists; detail-route reuse vs a dedicated path is squarely a plan decision.
5. Back-target + kicker labels are hardwired to the projects index — parameterization needed for an honest past-work reuse.
6. Relationship to LandingPast (replace, link, complement?).
7. "Column of bands" has no mock — define it (or mock it) during the plan.
8. Band index labels (PAST.00N?) and `projectByTitle`'s throw contract.

---

## Appendix — MenuDrawer (researched in error, 2026-10-29 15:49; archived)

The legacy drawer (old-site chrome) was measured in error first: at 390 the OPEN drawer is already full-bleed 390×844 (fixed left-0 top-0 h-full w-full, `translate-x-0/-full` swap, 300ms, z-60, MenuDrawer.tsx:31-34), pills 356×50 with the stack ending ~y405 (bottom ~440px empty, no scroll container), pool-menu patch z-45 fully covered while open, and missing a11y (no dialog/focus-trap/Escape/reduced-motion). Archived in /tmp/drawer-capture.mjs + /tmp/drawer-open-390.png in case its cleanup ever becomes a real task; NOT part of this plan's scope.