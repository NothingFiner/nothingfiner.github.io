# Implement Plan — the below-fold landing revamp (About rebuilt · What I'm up to rebuilt · Past Work joins · sidebar reorder)

- **Date:** 2026-10-30 ~16:00
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **Research:** `thoughts/research/2026-10-30-1549-below-fold-landing-revamp.md` (all cites below are from it unless a fresh read is ordered; the site survey's facts carried file:line cites — re-verify line numbers on fresh reads, files have moved since)
- **Worker protocol:** ONE PHASE PER DISPATCH. Finish the phase's steps + verification, tick its checkboxes IN THIS FILE, commit (site repo only), then STOP and hand back for review. Never start the next phase unprompted. If max turns approach, stop mid-step, leave the tree verified-and-committed-or-clean, and report exact state.
- **Standing verification (every phase):** `npx tsc --noEmit` clean; `npm run build` + serve (`vite preview`; the prior :4178 server was DOWN at ~15:40 — if none is live, start a fresh long-lived one and note the port; never kill a server another round is using); REAL loads at **1440×900**, **1024×900**, **390×844**; 0 console errors / 0 pageerrors; `scrollWidth === clientWidth` (root + body) at every stop; REAL trusted clicks only; drivers + screenshots in /tmp, every capture viewport-suffixed.
- **Rules:** `~/Projects/standards-mcp/rules/universal.md` (always) + `typescript.md` (the data-file work) + `css.md` + `preact.md` + `projects/nothingfiner.md` (project layer). Read the file for the step at hand.
- **Hard gotchas:** Preact not React (`preact/hooks`, `class=` not `className`); no `as any`; no non-null `!`; hash routing via `wouter-preact`; comments WHY-only — update every comment whose numbers/claims this round makes stale (the research's stale-comment audit list is §Topic 7); a template literal is ONE string (the sections' `<style>` blocks — no backticks/dollar-brace prose inside); glaphic array properties (marquee `strings`, ascii `frames`) ride imperatively via refs — **never** as JSX attributes. **A newly composed glaphic element needs a registrar line + a typed element declaration** (`src/lib/glaphic-registrar.ts` + `src/types/glaphic-elements.d.ts`) — glaphic-text is new to the site (Phase 1).

## Decisions on record (Eliot's brief, 2026-10-30 ~15:48)

1. **New below-fold order:** Hero → About (three bands) → **What I'm up to** (moved up, to #2) → **Past Work** (new; joins the sidebar) → Technologies (unchanged) → footer band.
2. **Sidebar:** five links in that order (Home., About., What I'm up to., Past Work., Technologies.) — technologies moves to the BOTTOM.
3. **Both marquee bands full-bleed** — "otherwise the animation with the sidebar looks odd" (~14:57; already landed for tech as `e649834`).
4. **The sidebar finishes moving into position a little more quickly** than now.
5. **About = three bands:** (1) ~245px, contained by two marquees (second scrolls the OPPOSITE direction; copy: "Trained Poet; Experienced Developer", the second phrase flashing to dark brand crimson after a moment; right: cycling ASCII portraits — art PENDING from Eliot); (2) "I've been Coding." grow headline + left ink copy "It started with cloning asteroids on my middle school graphic calculator." + the ASCII animation on the fluro plate as it is now; (3) another marquee instance; "My professional Journey." grow header; a full non-sidebar-width animated timeline (7 nodes: **2012 NYC · SPRING 2013 Design Intern @ DreamIt · FALL 2013 RoR Contractor · SUMMER 2014 First Full-Time Role · WINTER 2016 AppAcademy · SUMMER 2017 AGENCY · NOW ???**); after it finishes, a **chamfered fluro plate** with the poetry/programming paragraph (the current .ab-story copy, full non-sidebar width).
6. **What I'm up to:** the carousel is OUT ("just not looking good to me. SO I want to make it something simpler") → a bordered header strip (top+bottom border, centered in the non-sidebar space, the bloom-like horizontal effect — her example resolves to `glaphic-text variant="infinite"`, ink #F2F5EB) + three ~350px project bands (Rite, glaphicUI, Novel) separated by two marquees: project name in big letters filling the band's height left · fluro block with copy · project image zoomed to fill the rest · "go to ->" button over the image, right-aligned, to the project details page — **Novel: no button**. Mobile: cards (title, text, image, CTA).
7. **Past Work:** grow header; two half-non-sidebar-width bands — "E-Commerce" and "Custom Application Development" — each image + bullet points; a see-all button at the bottom → the past work page. Full width on mobile.
8. **Technology: leave as is.**

## Defaults set by the plan (veto points — each a one-line reversal)

| # | Decision | Default + why |
|---|---|---|
| D1 | Marquee reverse | `::part(track){animation-direction:reverse}` scoped to the reversed instance's class (the library exposes `part="track"`; no library change). Runtime-verified in Phase 2 (assert the track's computed animation-direction + capture). |
| D2 | The header's bloom effect | `<glaphic-text variant="infinite" axis="x+">` with `--glaphic-text-ink: #F2F5EB` + `--glaphic-text-shadow-ink: #0D0221` (the storybook example IS this element; on the paper ground the shadow ink must be set EXPLICITLY — the dark-stage default would read invisible), Space Grotesk via `--glaphic-text-font`. Static treatment (the example has no animation); a LIVE animated bloom = a glaphic-fan axis knob = library ask, deferred to Eliot. |
| D3 | Chamfered fluro plate | Compose: `glaphic-plate tone="cyan"` (the site's #14F1C8 fluro — the library's 'fluro' tone is #f81d41 red, so CYAN is the fluro read here) inside a positioned container that clip-path-chamfers two corners (~20px, the card's amount) — site-side, no library work; the paragraph prints ink-on-fluro. |
| D4 | The timeline | Site-side composition (no library piece): a 1px ink rail + 7 nodes printing sequentially on the section's reveal flag, per-node delay ladder (a named constant: 160ms/node + rationale). The terminal plate's reveal is CHAINED: its delay = the ladder's settle + margin (constant with rationale). "NOW ???" = a terminal readout node, non-clickable (no affordance was specified). |
| D5 | ASCII portraits slot | ONE glaphic-ascii instance, frames array at module scope, **placeholder frames + a clear awaiting-portraits comment** (data slot reserved; art lands when Eliot drops it — same imperative-frames idiom as FRAMES). |
| D6 | Novel's data home | NEW entry in `src/data/projects.ts` (next-index id, title 'Novel', image ./assets/novel.png, copy: 'draft') so the DRAFT-tag provenance machinery binds; no route/CTA (the brief: leave it without a button). |
| D7 | Category mapping (Past Work) | E-Commerce = Forever 21, Reformation, Brooks Brothers · Custom Application Development = Batesville; band image = the entry's main image; bullets = the entries' `responsibilities` (all copy:'draft') → drafted bullets print with the established DRAFT-tag treatment (provenance honesty: never dress draft copy as sourced). Eliot can remap with one array edit. |
| D8 | Band geometry | Band 1 = 245px (desktop, px); project bands = 350px; bands/header-strip span full non-sidebar width: the strip-grammar of the old .ln-strip — `margin-inline: -3.9vw 20.1vw` on a `grid-column: 1 / -1` item (flush left, flush AT the panel's parked edge). Mobile stacks re-flow full-width (the ≤899px idiom). |
| D9 | The clock speed-up | The `vh*0.7` divisor (LandingPanel.tsx:102) → **`vh*0.55`** (the slide starts when the about's top is at 55vh — "a little more quickly"; the driver measures pre/post ride lengths). The band's --lf-x crossfade rides the same var unchanged. |
| D10 | Five-link fan ladders | `--afd = dist*0.09s` unchanged; `--afo = (2-dist)*0.09s` → **`(4-dist)*0.09s`** (farthest leaves first, the same 0.09s rhythm generalized to n-1 = 4 steps — no negative delays); fan-memory park timer 1100ms → **1250ms** (0.25 + 4×0.09 + 0.6 + margin, same construction). |
| D11 | CTAs | "go to ->" (her literal ASCII arrow): `glaphic-button variant="solid" chamfered` with the recipe {surface: INK #0D0221, text: #F9FAF4, hover-surface: #14F1C8, hover-text: INK}; see-all: the same recipe (one CTA voice per revamp). Navigation via the wouter `navigate()` hook (the carousel's precedent). |
| D12 | Big letters / header copy | Band names in Space Grotesk 700 at ~the band's height (`font-size: min(24vw, 345px); line-height 0.92` — the driver measures the glyph box vs the 350px band and tunes once); What-I'm-up-to header strip = 2px ink borders top+bottom, its headline the D2 treatment; Past Work's grow header text: "Past Work." (period for the section-voice consistency). |
| D13 | Copy provenance | All briefed copy = 'live' by her authorship; the poetry paragraph moves verbatim (+ its .ab-lead line? — the brief's plate text omits "Through my formal education, I'm a trained poet." — DEFAULT: the plate carries ONLY the paragraph; the lead line retires unless she says keep); glaphicUI/novel copy stays 'draft' + DRAFT tags; the bullets print DRAFT-tagged per D7. |

## Protected boundaries (HARD)

- glaphicUI repo: touch NOTHING (read-only). The horizontal-bloom library ask (D2's deferred option) is Eliot's to integrate.
- `vite.config.ts` (site): diff-free vs HEAD after every phase.
- `LandingHero.tsx`, `SiteFooter.tsx`, `landing.css` (except: no edits — the shared layer already holds everything Phase 1-3 need; a shared addition only if two+ sections need the same new rule, with a note), `index.css`, `app.tsx`: untouched all plan.
- Component APIs stay: `LandingAbout/Technologies/Now/Past` keep their exports, root classes (.landing-about/.landing-tech/.landing-now/.landing-past) and ids (#about/#technologies/#now/#past) — the panel's scroll handlers, the LEARN MORE scroll, and the future sidebar targets key off them.
- The panel + band's DOM relationship: `.lf-band` must remain a LATER sibling of `.landing-panel` (the :has(~) hand-back) — Phase 4's composition keeps panel before the band.

---

## Phase 1 — What I'm up to: the carousel out, three project bands in

**Files:** `src/components/LandingNow.tsx`, `src/data/projects.ts`, `src/lib/glaphic-registrar.ts`, `src/types/glaphic-elements.d.ts`.

- [x] **Prerequisite reads:** the section file in full + the data file + the registrar + the tokens sheet reads of glaphic-text's knobs (glaphic-text.ts:41-66 — tier-2 vars) — fresh read, line numbers moved since the research.
- [x] `src/data/projects.ts`: append the Novel entry per D6 (copy:'draft'; no githubUrl; image ./assets/novel.png). The `copy` flag comment carries the provenance note.
- [x] Registrar + element typings: glaphic-text (D2's element) joins the site composition.
  (already in place: the registrar line + the typed declaration shipped with fe594be/e05d074 and the gallery
  page composes the element — verified live, no edit needed; the now section's composition rides the same registration)
- [x] Rebuild the section's BODY (keep the root class/id export): the bloom-strip header (2px ink borders + centered D2 treatment); then band Rite; marquee (TICKER, speed 26, imperative ref, full-bleed like the other bands — the ab-marquee grammar); band glaphicUI; marquee; band Novel. Each band per D8: name at the height-filling size, fluro block with copy (Rite's = its live description; glaphicUI/novel = today's draft lines + DRAFT tags), image `object-fit: cover` filling the remainder, "go to ->" D11 button over the image (Rite + glaphicUI only; Novel carries none), bands flush: full-bleed left → AT the panel edge.
- [x] The carousel's wiring leaves with the carousel: --glaphic-card-carousel-height, .ln-strip's margin-inline flush rule, the card-mode comment; the components stay in the library untouched.
- [x] Keep: id="now", the .ln-in two-way reveal, the rideOutUp wiring, the 37.5vh tail, and the ≤899px mobile block — the bands become the mobile cards (title, text, image, CTA) in that block (today's order:2 rule rides along; Phase 4 remaps the order map).
- [x] Stale-comment audit in the file's header block (the COPY NOTE provenance lines) — rewritten to the new truth.
- [x] **Verify:** tsc; build; REAL loads: 1440/1024 — the strip's borders + centered bloom headline; three bands at measured 350px (record actual); right edges flush at the panel's left edge (Δ ≤ ~1px, the 20.1vw grammar); the big-name glyph boxes vs band height (tune once, record); images fill (no letterbox); the go-to buttons navigate (REAL clicks) to /projects/1 and /projects/2; the DRAFT tags print on glaphicUI + Novel; the two marquee instances drop on reveal; 0 errors; overflow clean. 390: the card stack reads (capture). Screenshots nf31p1-*.
  (run 2, post-tune — recorded: bands 350.00px/350.00px/350.00px at both 1440 and 1024, panel-edge deltas 0 / 0.02px,
  glyph boxes 290.47/129.06/232.38px vs 350 (83%/37%/66%) and 206.56/91.80/165.25px (59%/26%/47%) after the one tune
  (ADVANCE_EM 0.58 → 0.52 against run 1's measured advances 0.479/0.502/0.529em), image deltas 0/0 (cover, no
  letterbox), strip borders 2px + centered (Δ 0), DRAFT tags 2 (glaphicUI + Novel), both marquees present (strings
  12, speed 26) and dropping (mid-drop −198px → settled 0), REAL clicks → #/projects/1 and #/projects/2,
  scrollWidth === clientWidth at every stop, 0 console errors / 0 pageerrors; 390: the card stack (column,
  title→text→image→CTA, static CTA)
- [x] Tick + commit: "the 'What I'm up to.' section: the carousel out, the three project bands in".

## Phase 2 — About: the three bands

**Files:** `src/components/LandingAbout.tsx` (+ module-scope data inside it). No other files.

- [ ] Fresh read of the file + the marquee/ascii/plate/text source cites from the research's library survey (glaphic-ascii needs nothing new — already registered).
- [ ] **Band 1 (245px, D8):** marquee instance 1 (TICKER, speed 26) on top; the ~245-tall middle row: the headline "Trained Poet; Experienced Developer" (Space Grotesk at the grow-head clamp size, ink fill) with a one-shot crimson flash on the second phrase (keyframe color→#A6022A riding .ab-in, delay ~1.2s — constant + rationale) + the ASCII-portraits cycler (D5) right; marquee instance 2 BELOW — its track reversed via D1's `::part(track)` class-scoped rule. The band sandwiched by both bands' rails, full non-sidebar width.
- [ ] **Band 2:** GrowHead "I've been Coding." (reuse) + the row: the glaphic-ascii fluro-plate widget (the existing FRAMES, imperative ref) LEFT of the ink copy line "It started with cloning asteroids on my middle school graphic calculator." (slightly smaller, ink).
- [ ] **Band 3:** another full-bleed marquee instance; GrowHead "My professional Journey."; the timeline (D4: rail + 7 nodes sequential print on .ab-in, node data module-scope); then the chamfered fluro plate (D3) holding the poetry paragraph (verbatim from today's .ab-story; D13: the lead line retires) — full non-sidebar width; the plate's reveal chained after the timeline's settle.
- [ ] The old machinery retires WITH its comments: the two story rows, .ab-cols/.ab-row/.ab-rule grid, .ab-story grids, the JOB_FRAMES array + its widget (the timeline supersedes it), the old col-spans block. The FRAMES array + the imperative-ref pattern stay (band 2).
- [ ] Keep: id="about", .ab-in latched reveal, rideOutUp, 37.5vh tail, the ≤899px block re-derived for the three bands (full-width stacks, rules/marquees static).
- [ ] **Verify:** tsc; build; 1440/1024: band-1 measured ~245px mid-row; the two marquee tracks scroll OPPOSITE (assert computed animation-direction + two-frame captures showing the drift); the flash lands ~1.2s after the reveal (recorded timeline of the fill color or a two-frame capture); the portraits cycler cycles (two distinct frames captured) on its fluro box; band-2's widget + copy read; band-3: the nodes print in sequence (frame captures at node 1 → mid → last) and the plate reveals only after; the plate's chamfered corners + fluro read (capture); the paragraph is verbatim; 390: three bands stack full-width (capture). 0 errors; overflow clean. Screenshots nf31p2-*.
- [ ] Tick + commit: "the About section's three bands — marquees, the portraits slot, the journey timeline, the chamfered plate".

## Phase 3 — Past Work: joins the landing

**Files:** `src/components/LandingPast.tsx` (+ nothing — its data home already exists).

- [ ] Rebuild the section: the grow header ("Past Work." — D12) + TWO bands per D7: "E-Commerce" (Forever 21 · Reformation · Brooks Brothers) and "Custom Application Development" (Batesville) — at desktop each HALF the non-sidebar width (side by side, the pair spanning 0→panel edge), each band: its image (object-fit cover fill) + the bullet points (the entries' responsibilities, DRAFT-tagged per D7). Mobile: the two bands stack full width.
- [ ] The see-all CTA (D11) at the bottom of the section → wouter-navigate('/past').
- [ ] The section NOW carries: the .ln-in reveal idiom (it reuses it today with no consumer rules — wire the reveal to the bands' print), the 37.5vh tail reservation (today it has NONE — the band's rest slot must clear), the rideOutUp wiring (the sections' idiom), the ≤899px block. Do NOT set any `order` value here (the mobile order map is Phase 4's, re-derived once for the whole journey).
- [ ] `src/data/pastWork.ts` stays UNTOUCHED (no category field invented — the mapping lives in the section's module scope as data, keyed by tag, with a comment naming it a DEFAULT mapping Eliot may remap).
- [ ] **Verify:** tsc; build; 1440/1024: the two bands half-fill the non-sidebar space ending flush at the panel edge; images fill; bullets + DRAFT tags print; the see-all navigation works (REAL click → /past renders the bands); the reveal plays; the tail reserves (the band's foot does not overlap the section's content at page-end); 390: stacked full-width cards (capture). 0 errors; overflow clean. Screenshots nf31p3-*.
- [ ] Tick + commit: "Past Work joins the landing — the two category bands + the see-all".

## Phase 4 — the reorder + the sidebar (the journey lines up)

**Files:** `src/pages/Landing.tsx`, `src/components/LandingPanel.tsx`.

- [ ] Pre-capture FIRST (the speed-up's evidence): at the Phase-3 build, measure the scroll distance for the full --ab-p ride (0→1) at 1440×900 — record the px.
- [ ] `src/pages/Landing.tsx`: compose in the new order — Hero → About → **Now** → **Past** → Panel → Technologies → Band (panel before band holds). Rewrite the JSX comments that encode the order contract (the band's "rides LAST" comment gains the new order read; the panel's comment unchanged except its neighbors' names).
- [ ] `src/components/LandingPanel.tsx`: the NAV per Decision 2 (five links; targets: about / now / past / technologies); index constants ABOUT/NOW/PAST/TECHNOLOGIES (+HOME); the active-follow want-logic reads `.landing-about`/`.landing-now`/`.landing-past`/`.landing-tech` tops vs `vh*0.5` in the new order; D10's fan ladders (`--afo` reshape + the park timer) ; D9's clock divisor (`vh*0.55`); the fan comment's arithmetic mentions the new step counts; the fan's `--fd = active - i` pattern is unchanged.
- [ ] The mobile order map re-derived ONCE in the sections' ≤899px blocks (Phase 1-3 files get their order values here — the ONLY edits to those files in this phase): hero -1 → band 0 (its fold slot, today's intended read) → about 1 → now 2 → past 3 → tech 4. LandingPast's missing order rule (today's live gap) closes.
- [ ] **Verify:** the FULL journey at all three widths: active link follows about → now → past → tech (REAL scroll, assert the class per stretch); the fan-out with five links (assert every `--afo` computed delay ≥ 0 — no negative delays); park timer sanity (the re-fan still resets after the settled flight); every sidebar link scrolls to its anchor (REAL clicks); the clock: post-edit ride length measured — shorter than the pre-capture px (record both); the band's crossfade + the foot still ride correctly at the faster clock (the icons' ink switch + the foot reveal at page end); the pool-menu hand-back still works (the band is still the later sibling); LEARN MORE scrolls to #about. 0 errors; overflow clean everywhere. Screenshots nf31p4-*.
- [ ] Tick + commit: "the journey reorders — About, What I'm up to, Past Work, Technologies; the sidebar grows the fifth link and rides the faster clock".

## Phase 5 — the final record

- [ ] The full-journey capture set ×3 widths (hero → about-parked → what → past → tech → page-end → top: 0 errors, clean overflow per stop, every capture vp-suffixed nf31r-*).
- [ ] The settled numbers table + holds ledger (full-bleed both bands — `e649834`; the unchanged technologies section; the stable component contracts) + the D6/D7/D13 provenance notes (placeholder portraits pending; drafted bullets tagged; novel unrouted) appended as "## After all phases" to this file; tick this phase's boxes.
- [ ] Commit: "docs: the below-fold revamp's plan record (settled numbers + journey captures)". STOP.