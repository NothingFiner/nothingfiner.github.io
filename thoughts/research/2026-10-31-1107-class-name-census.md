# Research — the class-name census (BEM / utility reconciliation, scoping only)

- **Date:** 2026-10-31 11:07
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`, HEAD `9c78484`
- **Trigger:** Eliot's directive — "we need to refactor non-bem and atomic/utility class names."
- **Method:** read-only census. All `class:`/`class=`/`className` strings in `src/**/*.tsx` (~25 files) greped + normalized; Tailwind config, `package.json`, and `src/index.css` inspected for what the utility camp actually resolves to; the rules' naming law re-read (`universal.md`, `css.md`, `projects/nothingfiner.md`). Companion doc: the glaphic-styles census of 10:51 (same session, component-style findings).
- **⚠ GATE — active edit in flight:** `src/components/LandingAbout.tsx` is DIRTY and the dirty diff GREW BETWEEN READS (3→5 changed lines mid-pass): Eliot is converting rows to utilities in it right now (`ab-code-rows`→`grid grid-rows-2`, `ab-row-a/b`→`grid grid-cols-6`, plus a label-wording edit). The file is READ-ONLY for me (universal: concurrent work lives in other files) — any rename tranche that touches it needs a release or commit first.
- **Inventory limitation:** single-line class strings fully counted; multi-line template literals are captured per-sitecheck (SiteFooter's `lf-band`-line etc. all read fine; nothing known to be missed).

## Topic 0 — the law the refactor must land on (css.md "Naming", verbatim)

- "Conventional DOM: use **BEM or utility/atomic (Tailwind). Prefer utility/atomic where available.**"
- "**Layout — grid/flex tracks, gutters, and display (e.g. sticky) — always uses utility/atomic classes.**"
- "**Component-scoped CSS uses BEM class names (the component name is the block).**"
- Shadow roots use "BEM-Lite": keep `block__element` and `--modifier`, drop the anti-collision prefixes (already the glaphicUI side's own convention).
- Utilities never cross the shadow boundary; the cross-boundary contract (custom props, `part` names, slot names, `:host`) is where naming matters most.
- Universal's naming adds the spirit-law the shorthands break: "No abbreviations except ones the whole team reads at a glance (url, dom, id)" — `ab-`/`ln-`/`ptd-` are wiki-required abbreviations.

## Topic 1 — the census: what actually exists (285 distinct names · 466 uses · ~25 files)

**Camp A — real Tailwind utilities (~healthy, keep):** `flex`, `items-center`, `justify-*`, `min-h-screen`, `mx-auto`, `p-8`, `rounded-xl`, `text-sm`, `text-theme`, `text-grey`, `text-accent-green`, `font-heading`, `font-bold`, `transition-all`, `transition-transform`, `duration-200/300/500`, `ease-in-out`, `grid`, `grid-rows-2`, `grid-cols-6` (Eliot's in-flight edit), `gap-*`, `mb-*`, `px-*`/`py-*`, `relative`, `fixed`, `inset-0`, `z-0/10/40`, `overflow-hidden`, `w-full`, `self-end`, `space-y-4`, `block`, `flex-1`, `flex-col`, `flex-shrink-0`, `items-baseline`, `md:p-8`, `lg:col-span-2`, `hover:scale-105`, `hover:scale-[1.02]`, `focus:outline-none`, `cursor-pointer`, `h-5`, `w-5`, `max-w-4xl`, `max-w-none`, `max-w-3xl`, `text-center`, `text-2xl/3xl`, `mt-4`, `p-6`, `px-4`, `py-2`, `rounded-2xl`, `rounded-lg`, `border`, `underline`, `sr-only`, arbitrary values `h-[80vh]`, `border-[var(--panel-keyline)]` (both legitimate Tailwind-3 patterns). Concentrated in the legacy surface (app.tsx, MenuDrawer, StickyHeader, ThemeToggle, About, Blog, BlogPost, Chat, Resume, DarkForest page) — the camps do exist in this repo.

**Camp B — the house shorthand (the non-BEM bulk):** 13 two-to-five-letter block prefixes, dash-chained, no `__`/`--` separators, zero canonical BEM anywhere in src (the only `__` hit is `dangerouslySetInnerHTML`; the one historical BEM form, `.landing-past__image`, died with the Phase-3 placeholder — research doc 10-30, Topic 4). Blocks: `ab-*` (24 names), `ln-*` (15), `lp-*` (13), `lt-*` (7), `hf-*` (10), `lf-*` (17 + interpolated extras), `gl-*` (6 + one interpolated `gl-${copy}` — GlyphPair.tsx:26 builds it in code, so that one is a logic edit, not a string swap), `pc-*/pr-*` (13), `pd-*` (28), `ptd-*` (28), `pw-*` (9), `stky-*` (7), `chat-*` (14). Root classes already carry the component name (`landing-about`, `landing-hero`, `landing-now`, `landing-past`, `landing-tech`, `landing-panel`, `lf-band`'s file is SiteFooter) — so the BEM target blocks exist; the children don't follow them.

**Camp C — the in-between (neither camp, the directive's real targets):**
1. **Dead utility names**: `prose`, `prose-lg`, `prose-sm` — ~8 uses across About/Blog/BlogPost — with `plugins: []` in tailwind.config.js:33 and NO typography plugin in package.json, these resolve to NOTHING today (styled for real by `blog-content` CSS + page sheets).
2. **A generic look-layer outside both camps**: `.panel`/`.panel-hover` — hand-rolled in index.css (:88-89, :136-144), used across 5+ files (About, Blog, MenuDrawer, ThemeToggle, Resume) — a shared look with an unscoped generic name, sitting exactly where "the cross-boundary contract is where naming matters most."
3. **Page ad-hocs**: `button`, `button-container`, `status`, `menu-container` (DarkForestGame.tsx), `blog-content` (BlogPost), `chat-page`/`chat-head` (Chat page layer) — names without a block discipline.
4. **Naming drift under shared pieces**: `ln-flow` and `ln-head` are the LANDING's shared layer (landing.css: "the padded flow grid… LandingPast and LandingNow co-use") — the "now" prefix names what the whole landing shares (LandingPast.tsx:274 renders `class="ln-head"`; `ln-flow` rides both sections; `.ln-in` is the shared reveal flag the past/now bands gate on).
5. **Two prefixes on one page**: Projects.tsx carries `pr-*` for the page layer (`pr-flow`, `pr-grid`, `pr-head`) AND `pc-*` for its cards (`pc-card`, `pc-title`, `pc-shot`…) — one block, two vocabularies.
6. **Foreign-prefixed keyframes in the site's sheet**: `@keyframes gl-grow` / `gl-marquee-drop` (landing.css:474, :477) — the `gl-` prefix means "GlyphPair block" in class-land and "generic site animation" in keyframe-land; the library's own convention names keyframes after their component (`glaphic-ascii-drop`).
7. **State-flag grammar is ad-hoc per file**: `.ab-on`, `.ln-in`, `.lt-in`, `.lf-shown`, `.lf-foot-in`, `.ptd-enter-on`, `.ptd-exit-on`, `.pr-in-on`, `.pr-exit-on`, `.near` (SiteFooter.tsx:255 — a bare one-word state riding `lf-learn-more`), `.grow-on` — no shared state grammar at all.

## Topic 2 — the interpretation (VETOABLE, like the ±2deg read)

"Refactor non-bem and atomic/utility class names" = **land every name on the css.md two-camp law**:
- (a) component-scoped CSS → **canonical BEM, block = the component name**: `.landing-about__marquee`-style; state modifiers ride BEM (`--on`) or a stated flag grammar — exact grammar is Eliot's call;
- (b) **layout** (tracks/gutters/display) → utility/atomic — the dirty edit's direction, extended codebase-wide;
- (c) the dead/generic/one-off names → real utilities, the owning component's BEM, or death;
- (d) the shared landing layer gets its OWN shared block name (no more `ln-*` naming the shared flow);
- (e) keyframe names follow their sheet/component.

The alternative reading (only strict-BEM rename, utilities untouched) leaves camps C1/C2/C3 unrefactored — which contradicts the directive's own words "and atomic/utility."

## Topic 3 — the execution shape (plan-ready; NOT started)

The rename is mechanical and behavior-neutral — CSS selectors ≡ JSX strings swap 1:1, so **the test is the BEFORE/AFTER screenshot diff at 1440/1024/390: any visual delta = a missed selector.** Phased by blast radius, one phase per dispatch, tick + commit + STOP (the revamp plan's protocol):

| Phase | Tranche | Contents |
|---|---|---|
| 1 | the freebies | C1 dead `prose` sweep; C4 `ln-flow`/`ln-head`/`ln-in` → the shared landing block name; C6 the site keyframes' names; `.near` and the one-off state grammar regularized. All behavior-neutral, no visuals. |
| 2 | chrome + shared | MenuDrawer, StickyHeader (`stky-*`), ThemeToggle, GlyphPair (`gl-`), GrowHead, LavaLampBackground, app.tsx — BEM per component + utilities stay. |
| 3 | the landing (six sections) | LandingHero, LandingPanel, LandingNow, LandingPast, LandingTechnologies, **LandingAbout LAST — gated on the dirty file's release**; landing.css retargeted in the same phase. Biggest tranche; the screenshots matter most here. |
| 4 | pages | Projects (merge `pc-`/`pr-`), PastWork (`pw-`), ProjectDetail (`pd-`), PastDetail (`ptd-`), Chat + ChatInterface/ChatLog, Blog/BlogPost, About, Resume, DarkForest (+ its game classes), the `.panel` layer's fate. |
| 5 | verification sweep | full route matrix, both widths families, scrollWidth checks, tsc + build per phase every time. |

Every phase: `npx tsc --noEmit` + `npm run build` + screenshot-diff + zero console errors; the Tailwind content scan (`content: ["./src/**/*.{ts,tsx}"]`, tailwind.config.js:4-8) picks utility additions up automatically — no config change needed.

## Topic 4 — what I need back

1. **Veto/confirm the target grammar**: strict `component__element` + how states are written (--modifier classes vs the existing compound `block.state` multi-class usage — hundreds of `.ab-band.ab-on`-form selectors would rewrite either way).
2. **The layout→utility depth**: the bleed margins (`margin-inline: -3.9vw 20.1vw` etc.) are parameterized page-geometry; Tailwind arbitrary values can carry them but read worse. Which reads as "the law": arbitrary-value utilities everywhere, or true-BEM placement classes for the parameterized ones (with utilities for tracks/gutters/display)?
3. **Release `LandingAbout.tsx`** (commit or finish the utilities edit) before its tranche — the two-agents-one-file rule.
4. **The `.panel` look-layer's fate**: shared utility-look (stays with a real name + documentation) or per-component BEM (duplicated per the second-copy rule).
## Addendum — the camps marked all-clear (2026-10-31, the close-out round)

- C1 (the dead `prose` names): killed at Phase 1 (3 class strings, 6 name-tokens; the plugin-less death re-checked fresh before removal).
- C2 (the generic `.panel` look-layer): renamed `site-panel`/`site-panel--hover` — D7's named-shared-look verdict; index.css + 7 JSX consumers in one pass; StickyHeader's straggler caught by the close-out sweep.
- C3 (the page ad-hocs): `blog-content` → `blog-post__content` (Phase 2); the chat page layer on the `chat` block's grammar (Phase 2, the code's own anatomy comment read); DarkForest's camp-C names STAY by Eliot's 11:23 "leave darkforest alone" order (on record).
- C4 (the shared landing layer): `ln-flow`/`ln-head`/`ln-in` → the shared `landing-*` layer with D4's per-section head split (Phase 4).
- C5 (the two projects vocabularies): `pr-*`/`pc-*` merged onto `projects` (5B).
- C6 (the foreign keyframes): `gl-grow`/`gl-marquee-drop` → `landing-grow`/`landing-marquee-drop`, every consumer in the same pass (Phase 4; the prerender's ready-marker included).
- C7 (the ad-hoc state grammar): the `--modifier` form everywhere; the panel nav's five link flags (`active/wipe/was/fanned`) the last out (the close-out round).
