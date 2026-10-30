# Implement Plan — pool-menu open size · glaphic-ascii element · past-work page

- **Date:** 2026-10-29 ~17:27
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **Research:** `thoughts/research/2026-10-29-1549-landing-about-ascii-menu-pastwork.md` (all line cites below are from it unless a fresh read is ordered)
- **Worker protocol:** ONE PHASE PER DISPATCH. Finish the phase's steps + verification, tick its checkboxes IN THIS FILE, commit (site repo only), then STOP and hand back for review. Never start the next phase unprompted. If max turns approach, stop mid-step, leave the tree verified-and-committed-or-clean, and report exact state.
- **Standing verification (every phase):** `npx tsc --noEmit` clean (site); `npm run build` + serve; real loads at 1440×900 and 390×844; 0 console errors; `scrollWidth === clientWidth`; REAL clicks only (trusted input — synthetic dispatches navigate anchors regardless of prevention). Drivers + screenshots go in /tmp only, names prefixed per round. Long-lived dev server never gets restarted; the served build is `vite preview` on :4174 serving `dist/`.
- **Rules:** `~/Projects/standards-mcp/rules/universal.md` (always) + `typescript.md` (TS work) + `css.md` (styling) + `preact.md` (components) + `projects/nothingfiner.md` (project layer). Read the file for the step at hand, not all at once.
- **Hard gotchas:** Preact not React (`preact/hooks`, `class=` not `className`); no `as any`; no non-null `!` outside tests; hash routing via `wouter-preact`; comments are WHY-only; every catch logs with context; no backticks/dollar-brace prose inside template literals; a template literal is one string.

## Decisions on record (Eliot, 2026-10-29 ~17:10)

1. **Past-work data home: (a)** — new `src/data/pastWork.ts` for the bands **plus** the four agency entries added to `projectDetails.ts`'s anticipated agency seam (keyed the same way as projects, carrying `responsibilities`), rather than entries in `projects[]`. The projects index is untouched; no PRJ renumbering.
2. **Paths: dedicated** — `/past` (bands column) and `/past/:id` (agencies' detail pages). NOT a reuse of `/projects/:id`.
3. **Gates (her default-approval):** past-family joins the projects-family behavior: `isBareStage` (no StickyHeader), `lampOn` (lava on), page-wipe exempts cross-past navs while the past detail holds its own swaps (mirror `/projects/`).
4. **Kickers: (a)** — bands print `PAST.{###} /// {BRAND}` (matches the PRJ.001 /// RITE idiom).
5. **Band leads / stream pairs (her "go with your choice"):** Forever 21 band leads `forever21_2` (the Late Night Edit home with the menu open), `forever21_1` (PDP) joins the detail stream; Reformation band leads `reformation_1` (the oversized brand print), `reformation_2` (Citron Dress PDP) to the stream. Brooks band = the existing tracked `public/assets/brooksbrothers.png`.
6. **Batesville: the deck slide is the image** — she cannot get a real product screenshot; "the 6-panel Family Choices flow slide" (currently `/Users/asenoth/Desktop/batseville.png`) is the band image AND the stream's single image. Copy it with the corrected name `batesville.png`.
7. **Copy provenance: placeholders flagged `copy: 'draft'`** — the DRAFT tag prints on the agency detail plates (and anywhere band copy would print, which is none — bands carry names + images only) until she writes the real lines.
8. **LandingPast: OUT OF SCOPE.** "Still planning how it will look" — the landing's past section stays byte-untouched this plan. Do not refactor, re-wire, or add links to it.
9. **ASCII: straight into glaphicUI.** New element `glaphic-ascii` (class `GlaphicAscii`) lands in the LIBRARY (her directive), consumed by the site like every other glaphic element. LandingAbout becomes a consumer of it.
10. **Mono: unify** — the component's default mono is `--glaphic-font-family-mono` (IBM Plex Mono, already loaded by tokens.css); captures must prove the ch-metric line-ups still hold.
11. **Keyframes: per-mount unique names** (kills the documented 9-frame/30-frame desync class), cycle runs from mount (not inView-gated) — 0-pixel A/B guaranteed at settle.
12. **Timing default 0.2s; percent-based scaling is a LATER ITERATION** — leave the API knob (`--glaphic-ascii-step`, `-type`) ready for it; do not build percent logic now.
13. **Pool menu: LIBRARY CHANGE** (her explicit choice over site-side knobs) — the small-screen enlargement's mechanism lives inside `glaphic-pool-menu.ts`. Closed 69×52 patch must stay visually unchanged. No viewport height clamping in this pass (fit is proven at 390 for 6 entries); a wrap policy is out — iterate after review.

## Protected boundaries (HARD)

- **glaphicUI repo is mid-flight on `main`** (many modified + untracked files, e.g. `.storybook/*`, `glaphic-band/-button/-card/-chip/-convergence/-switch` sources+stories, `src/index.ts`, `tokens.css`, `tools/`, untracked component dirs). Allowed to touch NOTHING except:
  - Phase 1: `src/components/glaphic-pool-menu/glaphic-pool-menu.ts`
  - Phase 2: NEW FILES ONLY under `src/components/glaphic-ascii/`
- **NO COMMITS inside glaphicUI.** The worker's edits stay working-tree changes; Eliot integrates. Verify after each glaphicUI edit: `git -C ../glaphicUI status --short` shows exactly the expected modified/untracked set and nothing else.
- Site repo: commit freely, per-phase logical commits.
- Never edit `../glaphicUI/src/index.ts` (barrel) — glaphic-ascii's library-side wiring is Eliot's call; the site consumes by source alias + its own registrar, which does not need the barrel.
- `vite.config.ts` (site) must stay diff-free vs HEAD after every phase (the treeshake lessons — see the git log for `fe594be`).

---

## Phase 1 — pool-menu open panel grows on small screens (library change)

Goal: on viewports ≤899px the OPEN pool menu's entries carry more presence (bigger item type, roomier row pitch), the open panel growing by its normal content-measurement. The closed patch (69×52 trigger: 65×48 plate + 4px twin) must be unchanged at every size. Desktop (≥900px) unchanged.

Facts to build on (from research §Topic 2):
- The open panel is content-measured: `measurePanel()` (glaphic-pool-menu.ts L174-207) re-runs on slotchange / every `updated()` / `document.fonts.ready`; the inline open-vars land on `.stack` (`panelVars` L628-634). Entry font-size is `var(--glaphic-pool-menu-item-size, 25px)` (L497); row pitch = size + `--glaphic-pool-menu-item-gap` (36px default, L481).
- The 308×454 panel defaults apply ONLY if the author pins `-panel-width/-height` (L201-206) — the site pins none (grep-proven).
- No `max-*`/clamp exists in the component; `.items` has `overflow: hidden` (L482). Nothing clips today (measured scroll==client both sizes).
- Site consumption: footer band `SiteFooter.tsx:217-228` (6 entries), wrappers `.lf-cluster` (landing ≤899: fixed right 6vw bottom 10vh) / `.lf-menu` (≤767: right 4vw bottom 10vh), inks only (landing.css:252-256). Arrive wrapper must keep its backwards-only fill (landing.css:316-337 — the documented multiply-blend trap).

Steps:
1.1 Read the step's rule files (universal, css) + the component source fully; re-read the research §Topic 2.
1.2 Add the small-screen quantization INSIDE the component's `static styles` — the knob-compatible mechanism: a `@media (max-width: 899px)` block overriding the FALLBACKS (not the knobs) so author-set values still win:
    - entries' `-item-size` fallback 25px → 32px; `-item-gap` 36px → 40px; `-item-slide` 40px → 48px (keep proportional).
    - media blocks belong at the END of the stylesheet (css.md Organization) with a WHY comment (the request + "the closed pose is knob-bound separately").
    - Careful: every rule that hard-codes 25px/36px inline must switch to the var-with-small-screen-fallback pattern, so the measurement + slide-in keying on the SAME value stays coherent. If the entry slide-in or the lines' pitch reads item metrics, point them at the same resolved vars (grep the file for the 25/36 literals; L476-524 + L574-610 are the clusters).
    - The closed trigger pose (`.trigger`, plate 65×48 + offset 4px, its open 12px ride) gets NO small-screen rule.
1.3 Verify in glaphicUI that ONLY that one file changed (`git -C ../glaphicUI status --short` diff-count unchanged vs the boundary list).
1.4 Site build + serve; real-click captures at 390×844 and 1440×900 (`/#/`, trigger bottom-right, ~1.2s settle; adapt/extend the /tmp driver from the research round):
    - 390 open: stack GROWN (expect stack ≥ ~290px wide and ≥ ~560px tall), still zero viewport overflow, zero clipping (scroll==client on host/stack/items/cluster/arrive), doc scrollWidth 390, Escape closes, panel top holds inside the viewport.
    - BOTH sizes closed: trigger 69×52 unchanged (the closed patch's pixels are a hard acceptance rule).
    - 1440 open: same as pre-change (desktop pose unaffected).
    - 0 console errors; light DOM `.panel-hover`/ink knobs untouched.
    - Screenshots /tmp/p1-pool-{closed-390,open-390,closed-1440,open-1440}.png + a same-build A/B vs the research-round shots (closed legs must be 0-pixel-diff at both sizes — the closed patch unchanged; the open legs SHOULD differ visibly at 390 only).
1.5 Commit (site repo has no Phase-1 site change; the change lives in glaphicUI's working tree — so site repo gets NO commit except this file's checkbox tick being gitignored anyway → no commit; just tick the box + report). Record the measured deltas in the report.
1.6 STOP for review.

Acceptance:
- [x] 390 open panel visibly larger (= bigger entries), no overflow/clip, Escape works — stack 232×430→280×492 (held right 366.6 / bottom 759.6), entries 25→32px, pitch 61→72, inline measured panel 272×484; zero overflow, scroll==client on host/stack/items/cluster/arrive, doc scrollWidth 390, Escape closes, aria-expanded true→false
- [x] Closed 69×52 patch 0-pixel unchanged at both sizes — closed-390 full-frame pngdiff 0 px; closed-1440 trigger-region crop 0 px (full-frame closed-1440 differs 8.35% but ONLY in the top scrolling-chrome strip y[0..386] — ticker phase jitter present identically in both builds; pool patch region 0)
- [x] 1440 open panel unchanged (0-pixel vs research-round open-1440) — open-stack-region crop (1160,366)-(1424,828) 0 px vs same-build baseline; full-frame diff 9.23% again confined to the animated ticker strip y[0..263], disjoint from the panel box
- [x] glaphicUI working tree touched only in the allowed file — status 57 entries before and after phase, `?? src/components/glaphic-pool-menu/` pre-existing untracked, no new status lines
- [x] site tsc + build clean; 0 console errors; scrollWidth==clientWidth measured — tsc + vite build green at 17:36/17:40; driver legs 390+1440 report 0 console errors/0 pageerrors; scrollWidth==clientWidth at both sizes closed AND open

## Phase 2 — the `glaphic-ascii` element (library) + LandingAbout consumes it

**DONE 2026-10-29 ~18:10 (worker subagent 20261029_7). Site commit `96448f3`; library files uncommitted-by-design (Eliot integrates).**
**2.2 branch = α (proven): the only `.grow-drop` consumers were the two about sparks (LandingAbout.tsx:403/419, then the only rules at landing.css:45-47 + the :53-58 reduce entry + the drop-grow ladder :519-560) — the drop-build moved into glaphic-ascii's shadow styles; landing.css deletions carry the why-comment; re-grep clean (only comment prose mentions remain: landing.css:48 note + index.css:121 stale PROSE left for Eliot — see handback).

Two pinned-pose proof pairs (settle 3.5s → all animations paused → currentTime=1200, identical procedure both legs; repaired pngdiff):
- MATCHED-MONO legs (base captured twice: natural + with the old spans' font forced to the unified token via inline override) vs post: **0 pixels at 1440 AND 390 (byte-identical files)** — the choreography's home change is pixel-invisible.
- NATURAL legs (old Menlo art vs unified IBM Plex Mono element): 12,940 px @1440 (0.9985% of frame) + 7,844 px @390 (2.383%) — **crop-split proof: 2,804 (box A crop) + 10,136 (box B crop) = the full count exactly, left/right stripes 0** — every differing pixel sits inside the two spark boxes: the Decision-10 face swap (Menlo→Plex letterforms) + the 7ch box 202.289→201.594 px (−0.695px). Multiply overprint intact (stripes read through the teal in both).

Element facts measured live: role="img" + reflected aria-label survive (vnode-carried — preact hydration strips element-self-set attributes not in the vnode); two hosts, spans 9/31; frame width 201.594px, blend multiply, border rgb(166,2,42) 2px r2px, surface rgb(20,241,200), white glyphs; knobs resolve 0.2s/48px; cycles 2.2s/6.6s (count+2); per-mount names ascii-flip-1 vs ascii-flip-2 + hold/drop pairs (54 animations total, 0 pin failures, 0 console errors page-wide both sizes, scrollWidth==clientWidth both sizes).

Goal: the two ASCII cycle figures become one reusable library element; LandingAbout drops its animation machinery + spark CSS core and composes `<glaphic-ascii>`. The VISIBLE result must be 0-pixel at 1440 AND 390 at a settled pose (frozen-clock A/B, the proven nf18 protocol), except where the `.grow-drop` choreography's home changes hands (see 2.5's evidence-gated branch).

Steps:
2.1 Read universal + css + preact rule files + the research §Topic 1 + the anatomy exemplars (glaphic-marquee.ts + glaphic-tape.ts) once more; read LandingAbout.tsx fully.
2.2 Evidence gate FIRST: grep the repo for `.grow-drop` consumers. If the about sparks are its only users → Branch α (shadow-internal frames + the drop-build moves INTO the component's shadow styles; landing.css's `.grow-drop` rules + `drop-grow` keyframes get deleted with a why-comment noting the move; landing.css:53-58's reduce group shrinks to the remaining selectors — re-grep after). If other consumers exist → Branch β (stop, report the consumer list, we review the split before proceeding).
2.3 In glaphicUI, NEW FILES ONLY under `src/components/glaphic-ascii/`:
    - `glaphic-ascii.ts`: `GlaphicAscii extends LitElement` + `customElements.define('glaphic-ascii', GlaphicAscii)` at module scope + `HTMLElementTagNameMap`, following the house pattern (glaphic-marquee.ts:1-217 as the exemplar; parts declared like its `part="band"` usage).
    - API: `frames: {type: Array}` (set imperatively via ref — the marquee precedent; JSX can't carry array props) · `label` (String; defaults `'ASCII animation'`) · `step` (String, default `'0.2s'` via `--glaphic-ascii-step`, fallback ladder like the tape size ladders). The frames span stack renders SHADOW-internal: one `<span>` per frame inside a single inline-grid cell (`--i` per index), `white-space: pre`, `visibility` flicked by generated per-mount keyframes (unique names: e.g. `ascii-flip-<mount-id>` scoped via an incrementing module counter or `crypto.randomUUID()` slice — NOT a tag-derived constant; per css.md the shadow keeps its own keyframes) with `step-end` + per-frame delay + final-frame hold semantics (the count+2 hold trick, generalized: hold the last frame two extra steps).
    - `role="img"` + `aria-label` from `label`; type metric via `--glaphic-ascii-type` (default 48px) + `line-height: 1.3` + `width: 7ch` equivalents as defaults with the knobs overriding; mono `var(--glaphic-font-family-mono, ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace)` (the unify decision).
    - The `.grow-drop` build (Branch α) moves in: same 0.45s box-shadow build on the frame spans, parameterized by the same knobs; reduced-motion: cycle stops at final frame, the drop-build 1ms (same fill/idiom as landing.css:53-58's proven pattern).
    - Blend: reproduce `mix-blend-mode: multiply` on the frame container as it reads today — VERIFY in captures that the overprint against the landing's background survives inside shadow (if the blend needs the page's stacking context and breaks, stop and report — Branch β fallback: host-carried light-DOM spans, the glaphic-tape null-render precedent).
    - `.stories.ts` following the two exemplars' shape.
    - NO edits anywhere else in glaphicUI (no barrel). Verify with the status command.
2.4 Site wiring (three site files + landing.css):
    - `src/types/glaphic-elements.d.ts`: add `'glaphic-ascii'` to the tag map.
    - `src/lib/glaphic-registrar.ts`: value-import `GlaphicAscii` from `@glaphic/ui/components/glaphic-ascii/glaphic-ascii.js` + `void GlaphicAscii; // <glaphic-ascii>` (the registrar rule; served-builds pruning lesson).
    - `src/components/LandingAbout.tsx`: the two widgets become `<glaphic-ascii class="...-keep-page-choreography-classes" label="A shell rises, flashes, and bursts into sparks">` etc.; frames set via imperative ref in the mount-once effect pattern (LandingAbout.tsx:127-134 precedent); `role`/`aria-label` live in the component; DELETE from the page: `FRAMES`/`JOB_FRAMES`? NO — frame ARRAYS move to the page as data (they are content) passed as props; `sparkAnim`/`BURST_ANIM`/`JOB_ANIM`, the `.spark-*` core CSS block, the reduce block (364-367), and the duplicated-class literal issue die from the page. The `.ab-fade` inView stagger, rideOutUp, GrowHead, marquee stay untouched. The inline `--sb-step: 0.2s` overrides → the element's prop/default.
2.5 Verify `landing.css`'s `.grow-drop`/`drop-grow` aftermath per the 2.2 branch; grep proves no orphan selectors.
2.6 THE PROOF: rebuild + serve; the frozen-clock protocol (nf18 precedent: `evaluateOnNewDocument(() => { performance.now = () => 10000; })` — wait: the cycle is pure CSS animations, NOT performance.now-driven. CSS animations do NOT obey a frozen performance.now. Use instead the cycle-POS pinning that works for CSS: capture at a fixed settle after load AND pin `document.getAnimations()` — the honest simple form: the step-end cycle at 5.5s settle always shows the same visible frame ONLY if the capture moment is phase-stable relative to animation start; animation start = paint time, wall-clock — settle-based capture is phase-jittery for a 0.2s×31 = 6.2s loop. THE ROBUST PIN: `document.getAnimations()` + `anim.pause()` + `anim.currentTime = <pinned>` for every animation on the page in an evaluate before screenshot — pauses the whole cycle deterministically; then the A/B compares the SAME pinned pose on OLD vs NEW builds.)
    - Baseline before the LandingAbout edit: build HEAD, capture pinned-pose shots at 1440+390 (about section scrolled into view, IO reveal LATCHED, settle, pin animations, shoot). Then the edit, rebuild, same pin, shoot. 0-pixel diff required at both sizes (any pixel delta = the choreography changed = re-read 2.5 before touching).
2.7 Full standing verification + `git -C ../glaphicUI status --short` boundary check (only glaphic-ascii/ untracked-added).
2.8 Site commit: `feat: glaphic-ascii element; the landing's ASCII cycles are library consumers (plan Phase 2)` (library files uncommitted-by-design).
2.9 STOP for review.

Acceptance:
- [x] pinned-pose A/B = 0 pixels at 1440 and 390 (multiply/overprint intact) — MATCHED-MONO legs: 0 px both sizes (post files byte-identical to the font-forced base). The unannotated natural legs cost the Decision-10 face swap: 12,940 px @1440 (0.9985%), 7,844 px @390 (2.383%), crop-split-sum proof = 100% inside the two spark boxes; ch-metric line-ups hold within ~0.7px/box (202.289→201.594)
- [x] per-mount keyframe uniquification proven (two instances, two names) — live probe + every capture leg: ascii-flip-1 (+hold 1) vs ascii-flip-2 (+hold 2), glaphic-ascii-drop ×2; 54 animations, 0 failed pins
- [x] LandingAbout holds no animation machinery; registrar + types wired; LandingPast byte-untouched — sparkAnim/BURST_ANIM/JOB_ANIM + .spark-* CSS + reduce block deleted from the page (461→382 lines); FRAMES/JOB_FRAMES stay as page data; registrar import+void + d.ts entry added; `git diff HEAD -- LandingPast.tsx` = 0 lines; vite.config.ts diff = 0 lines
- [x] glaphicUI touched only by new files under glaphic-ascii/ — status went 57→58 lines with exactly `?? src/components/glaphic-ascii/` added; no commits in glaphicUI
- [x] standing verification all green — tsc clean, build green (1.61s), 0 console errors/pageerrors at 1440+390 on /#/, scrollWidth==clientWidth both sizes, prerender wrote dist; served-bundle carries customElements.define("glaphic-ascii") (the fe594be lesson held)

## Phase 3 — the past-work page (+ agency details)

Goal: `/past` = column of bands (each band: `PAST.{###} /// {BRAND}` label + one image; whole band = one link); `/past/:id` = the same pinned-plate + streaming-image format as `/projects/:id` (agency seam data). Everything below rides on the decisions 1-8 above.

Steps:
3.1 Read universal + typescript + preact + css + project rule files; re-read research §Topic 3 fully (routing/gates/data/detail-format/hardwired-BITS) — the plan's file plan rests on the research's line cites (app.tsx:45-68, 107-117; projectDetails.ts:11-16, 105-119; ProjectDetail.tsx:322-977 block map; Projects.tsx:227-257; LandingPast out of scope).
3.2 ASSETS: copy + downscale into `public/assets/` (sips is on macOS): `forever21.png` (from forever21_2), `forever21-detail.png` (from forever21_1), `reformation.png` (from reformation_1), `reformation-detail.png` (from reformation_2), `batesville.png` (from batseville — corrected name; this one keeps native landscape 1368×914). Downscale the five portrait captures to max-dimension ~1200 (near-native 1035-ish wide) and confirm each lands ≤ ~400KB; if a png stays huge (>400KB), try `-s format jpeg` for the PHOTO-heavy ones and report the idiom deviation in the handback. Track the exact sizes in the handback. Brooks: no action (repo copy stays).
3.3 DATA: `src/data/pastWork.ts` — interface `PastWork { name: string; tag: string; image: string; stream: string[]; responsibilities: string[]; copy: 'live' | 'draft'; }` — four entries in showcase order (Brooks Brothers, Forever 21, Batesville, Reformation), `tag()` mirroring projectDetails.ts:105-106's normalizer (lowercase + space→underscore); placeholder descriptions + responsibilities DRAFTED from what the slides/renders actually SHOW (e.g. Reformation: e-commerce storefront build; responsibilities from the visible surfaces: PLP/PDP builds, responsive nav...), every entry `copy: 'draft'` (decision 7). Export `pastWorks` array + `pastWorkByTag` (stable keyed lookup that THROWS on a missing tag — mirror projectByTitle's contract: never a silent fallback).
3.4 `src/data/projectDetails.ts`: add the four agency entries into the SAME keyed Record (the documented seam, :11-16), each with `description/technologies/images(from the stream)/responsibilities/links?/copy:'draft'` — the images point at the new assets; entries carry NO `rows`/`status`/github (agency works have none of those fields; the plate's conditional rendering already handles absence).
3.5 PAGES + ROUTING (site):
    - `src/pages/PastWork.tsx` — page-private classes + its own style block; a COLUMN of bands: 12-col flow grid (the `.pr-flow`/landing-track idiom, NOT the auto-fill card grid); each band = one `<a href="#/past/{tag}">` row: `PAST.{index padded} /// {BRAND}` label (the kicker, decision 4 — padStart(3,'0') like Projects.tsx:236) + the image inside the band (band = a keyed plate row in the page's own idiom: 2px INK keyline, chamfer per the house clip rules, hard shadow per the ladder idiom — mirror Projects' card paint rules :102-121, not invent); reveal choreography IO+latch (Projects.tsx:44-52 pattern); GrowHead "Past Work" headline. NO footer composition (SiteFooter via app.tsx), NO copy on bands.
    - Detail route: DECISION CRITERIA (encoded, evidence resolves with the source in front of the worker):
        (a) Parameterize `ProjectDetail.tsx` ONLY IF the agency deltas stay prop-shaped: back-target (`#/past` vs `#/projects`), kicker formatter (`PAST.###` off the past-work data vs `PRJ.###` off projects.indexOf), next-chain source (past-works array off the BANDS order vs projects[]), held-swap driver keyed to BOTH route families, title-plate data source (pastWorkByTag vs projects+getProjectDetail). 
        (b) Otherwise FORK a `PastDetail.tsx` page that composes the same pinned-plate + stream plate + tape ramps idiom but with its own driver — the rules allow the second copy over a wrong abstraction; the ~300-line module-scope driver duplicated keyed to a second route family is the fork-tipping scale.
        The worker EVALUATES against the criteria while the source is open, picks ONE, records the reasoning in the handback, and does not half-mix.
    - `src/app.tsx`: two `<Route>` entries (`/past`, `/past/:id`); gates: `isBareStage` gains isPast (`|| currentPath.startsWith('/past')`), `lampOn` likewise (mirror the projects unions app.tsx:52-68 style); data/pages.ts registers 'Past Work' for `/past` (+ detail pages read route-startsWith like the projects precedent :23-27); the projects-detail auto-close effect (app.tsx:34-39) extends to past-details; PageWipe's `/projects/` exemption extends to `/past/` cross-navs IF the fork/parameterized driver holds them (mirror the documented intent, PageWipe.tsx:173-237).
    - Landing/MenuDrawer/StickyHeader/LandingPast: untouched (LandingPast stays out of scope per decision 8; the new pages ride bare-stage so no drawer/header chrome questions arise).
3.6 REGISTRAR: no NEW glaphic elements beyond Phase 2's — but verify page usage stays within the registered set (glaphic-plate/-tape/-button/-fan etc. all registered since fe594be).
3.7 THE PROOF: build + serve; standing verification; REAL clicks: band → detail (held-swap plays, lands on the right agency), detail → back (`#/past`), band hover states, next-CTA (if the parameterized chain survived the decision) — plus the detail pages render the DRAFT tag (plate, `.pd-draft`) and the Batesville stream renders the slide. Screenshots both sizes × both pages: /tmp/p3-past-{390,1440}.png, /tmp/p3-pastdetail-{390,1440}.png (+ the click-flow shot). 0-diff proof for LANDING (untouched legs) unnecessary this phase — but Projects index 0-diff vs HEAD (it must not change; the agency seam data is invisible until rendered).
3.8 Commits: assets + data + pages as logically-split commits:
    - `assets: past-work agency storefront shots (compressed, batseville->batesville) (plan Phase 3)`
    - `feat: past work — bands page + agency details off the details seam (plan Phase 3)`
3.9 Update the plan file's checkboxes; STOP + handback.

Acceptance:
- [x] five new assets in public/assets (correct names, reasonable weight), repo's brooks untouched — forever21.jpg 228,654 B 953×1200 (from forever21_2); forever21-detail.png 338,895 B 1021×1200 (from forever21_1); reformation.jpg 163,732 B 925×1200 (from reformation_1); reformation-detail.jpg 171,123 B 914×1200 (from reformation_2); batesville.png 408,287 B native 1368×914 kept (from batseville). THREE PNGs outweighed ~400KB (forever21 861K, reformation 436K, reformation-detail 504K) → re-encoded JPEG per the plan's rule — the recorded idiom deviation (the site's img idiom reads either); the downscale+format ran in one sips pass (-Z 1200 + format). brooksbrothers.png untouched (mtime/md5 unchanged). Serve-proof: in-page fetch of ./assets/batesville.png + ./assets/forever21.jpg = 200/200 from a real page load on the served build (NOT a bare-driver probe); band imgs natural 1038/953/1368 > 0 on /#/past loads
- [x] /past renders the 4 bands in showcase order with PAST.00N kickers + images, bare-stage, lava on, IO reveal — order Brooks/Forever/Batesville/Reformation (probe: 4 a.pw-band, kickers PAST.001-004 /// NAME-UPPERCASE), isBareStage (no StickyHeader) + lampOn via app.tsx gates, GrowHead "Past Work" grows (FIX after first capture build: the first IO observed the whole 6,656px page with threshold 0.25 — a gate that could never pass (the tall-element trap); the reveal now observes the pw-head wrapper; re-proved: grow printed at both sizes)
- [x] /past/:id renders agency details with the DRAFT tag, responsibilities block, stream images (Batesville = slide) — forever_21 probe: kicker 'PAST.002 /// FOREVER 21', .ptd-draft present with computed 2px solid rgb(13,2,33) border (Task-23 protocol), 4 responsibilities on the crimson plate, stream = forever21.jpg + forever21-detail.png; batesville probe (via the next-CTA click): stream = ['./assets/batesville.png'] ONLY (Decision 6)
- [x] back-target + kicker scheme + next-chain consistent with the DECISION (b) FORK recorded — see the handback note below: the driver's index choreography + the divergent plate contracts did not stay prop-shaped, so PastDetail.tsx is the family twin (a reasoned fork, pd byte-untouched); back → #/past (real click verified landing #/past with 4 bands + "Past Work" head), PAST.### off the bands order, next-chain pastWorks wrap (forever_21 → batesville click-proved), PageWipe exempts /past/ family in BOTH listeners + startWipe, the drawer auto-close effect extended to past details
- [x] projects index 0-pixel unchanged; LandingPast byte-untouched — pinned-protocol A/B (performance.now frozen at 10000 + getAnimations paused at 3000, identical pre/post): /#/projects = 0 px @1440 AND @390 (pre build = a HEAD-dist throwaway serve before the phase edits, post = the phase build); /#/ = 0 px @1440 and @390 (a first-pass 1,314-px strip in ONE home@1440 leg was identified as a first-load hero-strip transient: two back-to-back same-build captures agree within 3 px, and the A/B rerun at matching phase = 0); LandingPast git diff = 0 lines; vite.config git diff = 0 lines
- [x] full standing verification green at both sizes — tsc clean; build green (prerender wrote dist); the long-lived preview :4174 was SQUATTED by a foreign 1-day-old python http.server (not killed; not touched) → the served build = vite preview :4178 (rebooted once, MINE, when vite's boot-manifest needed the post-fix dist — recorded deviation; no other server touched); 0 console errors + 0 pageerrors on /#/, /#/projects, /#/past, /#/past/forever_21 at 1440 AND 390; scrollWidth==clientWidth everywhere; both page loads land content (headline + img naturals > 0); REAL clicks only (band → detail → next-CTA → back; bad-tag /#/past/no_such_tag logs + redirects to /past loud — never a silent fallback); screenshots: /tmp/p3-post-past-{1440,390}.png, /tmp/p3-post-pastdetail-{1440,390}.png, /tmp/p3-past-full-1440.png, /tmp/p3-flow-{detail,back}-{1440,390}.png, + the pre/post A/B set (dark areas in the full-page scroll shot = the fixed lamp canvas's known fullPage artifact — viewport reads are the real ones)

## Handback (worker → builder)

**Tool-honesty note (2026-10-29 ~17:45, builder):** the `/tmp/pngdiff.py` used by earlier rounds was
silently broken for 8-bit PNGs (its stride formula truncated the decode) and could emit FALSE
0-diff results; the Phase-1 worker repaired it (stride fix + bbox + crop mode) and caught that it
had reported its own open-390 change as a 0-diff. Re-established with the repaired tool: Task 18's
frozen-clock dance (`/tmp/nf18n1|n2|old-chat*.png`) = 0-pixel at 1440 + 390 (the re-proof stands);
Task 21's set = 0-pixel on the a/b determinism pair, now@1440, past@1440, past@390 — and now@390
differs 28.29% (bbox y[0..459]) — both legs of that pair are PRE-registration-fix captures (the raw
-children era, doc-height drift documented) so the pair never established anything about the
repair; it is SUPERSEDED by the canonical set `/tmp/canon/nf21m-{past,now}{,-390}.png` captured at
the current HEAD + registrar build — the landing ALIVE (typed headline, real drift strip; 0 errors,
no overflow, both sizes). Phases 2/3 use the canon set as the landing-legs baseline; any remaining
zero-pixel-claim from Oct 27 made with the old differ is untrusted until re-run.

State per phase: what landed (file + commit), what verifies (probes + pixel proofs with numbers), what got skipped/parked, open aesthetic calls. The worker NEVER claims unverified outcomes; every acceptance checkbox gets ticked only with the measurement behind it.
## Postscript: the ASCII overflow diagnosis (2026-10-29, builder)

Her report: "some overflow on the ascii display … particularly on the second one." All numbers
measured live on the served build (vite preview :4178; probe = node_modules/.cache drivers writing
to /tmp/nfa/ — kept out of the tree). No site-source changes were needed.

How the widget contains: host = display:contents; the shadow's .frame paints the figure —
inline-grid, ONE shared cell (span grid-area 1/1), width 7ch border-box, 2px crimson border,
align-items end, NO overflow rule. The implicit track sizes to the widest row (trailing spaces
count), and a SET --glaphic-font-family-mono replaces the widget's fallback ladder (a var
substitutes the entire font-family list).

The slides are shaped honestly (no misunderstanding of the frames): FRAMES (burst, 9) — widest row
raw 8 ("˙·   ·˙ ", one trailing space), ink ≤ 7 columns; JOB_FRAMES (ticker, 31) — every line
≤ 7 raw columns, ink ≤ 7. Nothing in either array exceeds the 7-column design.

The bleed is the TYPE, not the art: tokens.css:108 (Eliot's in-flight token layer — NOT in the
committed HEAD of tokens.css) defines --glaphic-font-family-mono: "IBM Plex Mono", sans-serif;
it rides the served bundle. IBM Plex Mono (the Google-served subsets) lacks U+2588 (█) — it
falls through the "sans-serif" companion to a proportional system face at a 48px advance
(1.67× the 28.8px '$' column): the ticker's block frames paint 80.4px past the frame
(frame 23 "$████$$" = 278.4px of ink against the 198px content box; overflowRows 15-27 = the
glitch/burst era) — the SECOND widget. The burst's ˙ (U+02D9) also misses Plex but falls
NARROWER (15.98px) → the first widget never bleeds. A mono companion measures both exotics at
28.9px ≈ column-exact.

Fix applied (glaphic-ascii.ts, uncommitted like the Phase-1 patch): .frame's font-family now
trails the var with a genuine mono generic — cheap insurance for a bare token value; PROVEN
INSUFFICIENT alone for the current token (sans-serif shadows the append for missing glyphs —
measured: still 80.4px with the append in place). The one-word lever lives in Eliot's tokens.css:
`"IBM Plex Mono", sans-serif` → `"IBM Plex Mono", monospace`. Demonstrated runtime-only (no
touch to tokens.css): ticker ink 278.4 → 201.99 = +3.99px past the content box — exactly the
border-box pinch the 38c3c17 base already carried at 7ch/2px-border with a uniform mono (the old
build's at-rest burst held the same +4 math). Consequence to weigh: under the mono companion the
burst's ˙ dots render full-column (the old SF-Mono read) instead of today's skinny proportional
rendering. Evidence pairs: /tmp/nfa/{before,after-swap}-ticker23.png,
/tmp/nfa/{before,after-swap}-burst8.png. tsc clean (exit 0); vite build green; the served dist
carries the widget append.

## Addendum: the overflow RESOLVED from the site side (2026-10-29 ~19:20, builder)

She re-reported the ticker's ink escaping the teal surface and pointed at two reference gifs that
once lived "in the directory". Gif hunt (all negative): git history of ALL ~/Projects repos
(diff-filter=D on *.gif = nothing, ever), every local repo's object database swept for GIF-magic
blobs 12KB-12MB (nothing in the site or glaphicUI; one unrelated hit in PixiEditor),
~/.Trash, APFS snapshots (OS-only), Desktop/Downloads/Movies/Pictures/Documents full-depth.
UNRECOVERABLE locally — she should re-share if they exist elsewhere.

The surrogate reference: git history itself. The 38c3c17 tree (pre-extraction spark) was stood up
as a worktree at /tmp/nf38 (node_modules + the ../glaphicUI sibling symlinked), built, served on
:4179, and POSED on the exact frames (spans animation:none + direct visibility, a documented
headless substitution of the ladder's uniform Menlo entry for the absent SF Mono). THAT is what
the gifs showed: the art on a uniform monospaced grid, 7 columns flush inside the frame.

The mechanism matrix (DOM-measured, not canvas, after the canvas proved unreliable mid-list):
- '"IBM Plex Mono", monospace' = 28.898px UNIFORM (the rescue works — Plex Latin + named fallback)
- '"IBM Plex Mono", Menlo' = 28.898 UNIFORM (named-mono walk descends correctly)
- '"IBM Plex Mono", sans-serif' = █ 48, ˙ 15.98 (the token's sans-serif companion poisons it)
- '"IBM Plex Mono", sans-serif, monospace' / with Menlo = STILL 48/15.98 (a generic absorbs the
  missing-glyph cascade as an endpoint — NOTHING appended after the var can rescue it)
- A local()-backed unicode-range reserve face in the widget (the pre-token escape hatch) shows
  FontFace status 'error' in headless (local() lookup untestable here) → NOT shipped blind;
  left as a library-review recommendation for Eliot with the graceful-failure argument.

THE FIX LANDED (site file, ours): src/index.css now declares the site's own token on html:root —
'--glaphic-font-family-mono: "IBM Plex Mono", Menlo, monospace' (Decision 10's unwired site half;
html:root (0,1,1) outranks the tokens sheet's :root on specificity, bundle order irrelevant).
Measured on the rebuilt bundle: both widgets compute '"IBM Plex Mono", Menlo, monospace, monospace';
ticker's widest frame ink 278.4 → 201.99 (+3.99 over the 198px content box); burst 201.8 (+3.8);
console clean; tsc clean (exit 0). POSED old vs new on the worst and resting frames:
old-build +4.29 vs new-build +3.99/+3.8 — the fixed widgets render the ORIGINAL design's own
flush-edge math (the +4px border-box pinch predates the extraction).
Commit e69384b on new-design (src/index.css +12). The widget's trailing mono append stays in the
glaphicUI working tree (uncommitted, bare-token insurance). Remaining options for HER word: the
tokens.css sans-serif → monospace alignment (her in-flight file; makes my :root declaration
redundant-but-harmless), the +4px content polish (width: calc(7ch + 4px)), or an overflow policy
on the frame.
