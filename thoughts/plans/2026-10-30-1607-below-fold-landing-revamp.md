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
>> (Phase 2 run — 2026-10-30 ~16:46, the D5 SUBSTITUTION: the REAL portraits dropped on disk
    (30 frames, every frame 49 lines x 90 columns; numbering minus 4 and 9), so the placeholder-
    frames strategy retired — the section fetches the art at runtime and sets the frames array
    imperatively once all resolve; the art set is committed WITH this phase. Measured, desktop 1440:
    mid row 245.00px, band-1 total 341px (48 + 245 + 48, flush) — the veto read (245 as the TOTAL)
    is the one-line --ab-band1-mid swap noted in the code. The D1 reverse trick RUNTIME-VERIFIED:
    computed animation-direction "reverse" on ::part(track) + ~1.1s drift -101.53px vs +101.52px
    (opposite); no library ask needed. Glyph coverage: 89 unique non-space glyphs, 0 outliers at the
    reference and painted sizes against the site's effective mono stack. Portraits cycle 6.4s/loop
    (30 frames + the hold steps at the 0.2s step).)

- [x] Fresh read of the file + the marquee/ascii/plate/text source cites from the research's library survey (glaphic-ascii needs nothing new — already registered).
- [x] **Band 1 (245px, D8):** marquee instance 1 (TICKER, speed 26) on top; the ~245-tall middle row: the headline "Trained Poet; Experienced Developer" (Space Grotesk at the grow-head clamp size, ink fill) with a one-shot crimson flash on the second phrase (keyframe color→#A6022A riding .ab-in, delay ~1.2s — constant + rationale) + the ASCII-portraits cycler (D5) right; marquee instance 2 BELOW — its track reversed via D1's `::part(track)` class-scoped rule. The band sandwiched by both bands' rails, full non-sidebar width.
- [x] **Band 2:** GrowHead "I've been Coding." (reuse) + the row: the glaphic-ascii fluro-plate widget (the existing FRAMES, imperative ref) LEFT of the ink copy line "It started with cloning asteroids on my middle school graphic calculator." (slightly smaller, ink).
- [x] **Band 3:** another full-bleed marquee instance; GrowHead "My professional Journey."; the timeline (D4: rail + 7 nodes sequential print on .ab-in, node data module-scope); then the chamfered fluro plate (D3) holding the poetry paragraph (verbatim from today's .ab-story; D13: the lead line retires) — full non-sidebar width; the plate's reveal chained after the timeline's settle.
- [x] The old machinery retires WITH its comments: the two story rows, .ab-cols/.ab-row/.ab-rule grid, .ab-story grids, the JOB_FRAMES array + its widget (the timeline supersedes it), the old col-spans block. The FRAMES array + the imperative-ref pattern stay (band 2).
- [x] Keep: id="about", .ab-in latched reveal, rideOutUp, 37.5vh tail, the ≤899px block re-derived for the three bands (full-width stacks, rules/marquees static).
- [x] **Verify:** tsc; build; 1440/1024: band-1 measured ~245px mid-row; the two marquee tracks scroll OPPOSITE (assert computed animation-direction + two-frame captures showing the drift); the flash lands ~1.2s after the reveal (recorded timeline of the fill color or a two-frame capture); the portraits cycler cycles (two distinct frames captured) on its fluro box; band-2's widget + copy read; band-3: the nodes print in sequence (frame captures at node 1 → mid → last) and the plate reveals only after; the plate's chamfered corners + fluro read (capture); the paragraph is verbatim; 390: three bands stack full-width (capture). 0 errors; overflow clean. Screenshots nf31p2-*.
- [x] Tick + commit: "the About section's three bands — marquees, the portraits slot, the journey timeline, the chamfered plate".

## Feedback round A — the About section (Eliot, 2026-10-30 ~16:57)

Amends Phase 2 in place; every item is her call with a plan default. Scope: `src/components/LandingAbout.tsx` ONLY. Phases 3-5 unchanged.

- F1 **The portrait's styling is the CONSUMER's** — "isolate the framestyles from the ascii slide component": the burst/band-2 widget keeps the library's plate/border/shadow; the PORTRAIT instance prints **ink glyphs, no background, no border, no multiply** (her words: "ink colored text and no background or border"). Default: site-side `::part(box/frame)` overrides for this instance only; if the shadow CSS wins the cascade, STOP and report — that gap becomes a first-class style-knob ask (her repo).
- F2 **Bigger**: the portrait's seat ≈ **2× the current 245px → ~490px**; type recomputed from the seat (≈ the seat ÷ 49 lines); the box widens with the grid (~2× ≈ 536px).
- F3 **Slower**: `--glaphic-ascii-step` 0.2s → **0.4s** (the frame hold; cycle doubles to ~12.8s).
- F4 **The headline may overlap the art at its edge** ("the word developer can overlap the image at the edge") — no column reserve between the headline block and the art; the capture gates the read.
- F5 **Band 1 sits at the MIDDLE of the page when the sidebar has fully animated in, not at the top** — a leading spacer (default `calc(50vh - band1-total/2)` as the about's padding-top, named constant + rationale) places band-1 mid-screen AT the park point; the driver samples the parked point and band-1's center together (record the pair). Band-1's reveal gate retunes so its animations fire as it comes into view just before the park.
- F6 **Band-1 headline: NO grow shadows** — plain ink fill both phrases; the crimson flash (F-phrase) stays as its span.
- F7 **Band-2 headline cursors IN, justified right** — the hero's cursor-type composition pattern (real text in the sr-only span + typed copies aria-hidden + the cursor-ink knobs), right-justified. Copy stays "I've been Coding." (her lowercase read as informal; veto = lowercase).
- F8 **Band-2's rows**: the body text start-aligns WITH widget-1's plate left edge (one left x); widget-1 smaller (type ≈ 32px, named constant); then a **SECOND ascii widget aligned RIGHT with text to its left: "Since then things have gotten serious."** — widget-2's frames default to the retired JOB_FRAMES (the 2012→C0DE→job cycle IS that story; restored for this instance from the pre-rebuild data).
- F9 **Band-3's plate gets a lot more margin** between the copy and its edges (default ~8vh block / ~8vw inline — measured on capture).
- F10 **More space between ALL the bands** (default +~6vh — a section-level spacing constant; measured).
- F11 **Every band's animations trigger only when THAT band comes into view** — per-band latched IntersectionObservers (the section idiom, -64% rootMargin, band-level flags). Band 1's gate pairs with the sidebar-park point (measured together per F5).

- [x] F1-F4, F6-F9 applied and verified at 1440/1024 (the portrait's ink/no-plate computed read, its ~2× box, the slower cycle duration read, the overlap read, the typed headline's cursor behavior + right alignment, the two-row band-2 with the restored job widget, the plate's margins).
- [x] F5/F11: the per-band gates wired; the band-1 reveal↔park pairing measured (park px at the reveal fire — recorded).
- [x] Standing verification (3 widths, 0 errors, overflow clean; reverse-marquee still holding; the cycle's slower step read); captures nf31p2b-* vp-suffixed.
- [x] Commit: "About feedback round A: the portrait's ink restyle, the mid-page arrival, the typed headers, the second widget, the view-gated bands".

>> (Round-A run — 2026-10-30 ~17:2x, recorded: F1 the part-override verdict is a WIN
>> (portrait box computed color rgb(13,2,33), border 0px, background transparent,
>> blend normal, no drop ladder; the burst AND restored job widgets keep the library
>> plate exactly — 2px border, rgb(20,241,200), multiply, ladder(5) — per-instance),
>> F2 box 540×490 (fs 10 = seat/49; scrollW==540==clientW), F3 step 0.4s, span
>> duration 12.8s, F4 reserve gap 0.0 (boxes touch at 1440 — the metrics leave
>> 60.78px of daylight to the flash's end; at 1024 the flash strides 115.02px ACROSS
>> the art's edge), F5 fire at scroll 736 (@ --ab-p 0.7397) → park 904 (@ 1, the
>> analytic 900 within one 8px step; band-1 center at the park = the viewport's
>> middle; the lead marquee's transform read matrix(…,0,0) — the drop landed by
>> the park), F7 typed prints at the fire (caught "I" at the fire step; settled
>> "I've been Coding.", cursor-vanish held, right-justify delta 0), F8 rowA one
>> shared left x (Δ 0.0/0.08 @1440, 0 @1024/390), rowB flush right (Δ 0; the copy
>> left of the widget at all three widths), job frames 31 restored, F9 computed
>> padding 72px/115.2px (glyph inset 115.19), F10 gaps 54px = 6vh, F11 fires per
>> band at 736/1376/2152, reverse drift −100.01/+100.01/−100.01, 0 errors ×3,
>> overflow clean ×3. Mobile retunes: the 390's seat recomputed to FIT the column
>> ((88vw−8px)/54×49 — the first pass caught the fit ÷49 double-dipped at
>> 0.1267px type, fixed), the band-2 rows' tracks capped (minmax(0,1fr)) or the
>> max-content copies painted the right-hugged widget off-viewport; at 390 the
>> 34ch copies run max-content wide so rowB's pair squeezes (copy 199px left of
>> the 134px widget, flush right 367) — the pool-menu patch (the fixed chrome)
>> clears the copy once squeezed.)


## Feedback round B — the About section, refined (Eliot, 2026-10-30 ~17:32)

Amends round A in place; scope stays `src/components/LandingAbout.tsx` ONLY. Phases 3-5 unchanged.

- B1 **The chamfered text box floats — it no longer spans the whole non-sidebar space.** Default: the chamfer/paint/copy stay but ~8vw inline margins BOTH sides (the box floats inside the strip); the measured width goes in the record; centered-vs-offset is a one-line tweak.
- B2 **"I've been Coding." returns to the grow header style** (revert round-A's typed headline; the section's left-aligned grow voice) — and **the cursor-typing moves to the text beside the ascii panels** (both beside-texts cursor in; the hero's sr-only-real-text + typed-copies composition; cursor ink = each line's ink).
- B3 **"Trained Poet;" = fluro green** (#14F1C8; no grow shadows — round-A's F6 holds); "Experienced Developer" keeps its ink→crimson flash.
- B4 **The ascii panels sit NEXT TO their respective text** (the mirror rows return: panel·text / text·panel; round-A's above/below start-pairing yields to adjacency).
- B5 **"It started with cloning asteroids…" tabs over** — a text-indent (default 3ch) on that line.
- B6 **All the About bands need MORE room — the section breathes**: inter-band spacing up from 6vh to ~12vh (the section's spacing constant).

- [x] B1-B5 applied and verified at 1440/1024 (the plate's float width, the grow headline's return, both beside-texts typing with cursors, the fluro-green phrase, the mirrored adjacency, the indent).
- [x] B6: the breathing spacing measured at all widths.
- [x] Standing verification (3 widths, 0 errors, overflow clean; the reverse marquee + the park-pairing still holding); captures nf31p2c-* vp-suffixed.
- [x] Commit: "About feedback round B: the floating plate, the grow header back, the beside-texts type in, the fluro-green phrase, the mirrored panels, room to breathe".

>> (Round-B run — 2026-10-30 ~17:5x: TWO driver passes (run 1 measured a
>> WRONG VOICE on the typed beside-lines — the shadow's mono default
>> reflowed the asteroid line to 4 lines/193px at 1440 — fixed mid-round
>> with the hero-lead's body-voice font override; run 2 = the landed
>> state; the supervisor's earlier "1440/1024 done" had left no
>> artifacts on disk, so the full pass re-ran with the fix in).
>> RECORDED — B1: the plate floats STRIP-CENTERED (the vetoable read:
>> ~8vw inside the strip's edges, left inset measured off the viewport,
>> right inset off the parked panel — an offset read is the one-line
>> margin tweak): computed margins 59.04px/404.64px (the --ab-plate-float
>> 8vw converted by the 3.9vw flow pad / the 20.1vw standoff), box
>> 115.19→979.22 = 864.03px (60vw) with the parked panel's edge at
>> 1094.41 — clearance 115.19 (8vw); 1024: margins 41.98px/287.74px, box
>> 81.89→696.34 = 614.45px, clearance 81.91; the chamfer clip-path + the
>> fluro paint rgb(20,241,200) unchanged; 390: the float is a desktop
>> strip read — the stacked plate spans the mobile column (343.22px at
>> margin 0/0). B2: the headline is back in the grow voice at BOTH
>> widths (.grow-head-in.grow-on, animationName gl-grow, shadow
>> ladder(5), rgb(242,245,235), ZERO cursor-type children, left-aligned
>> Δ0, text "I've been Coding.") and the typing MOVED onto the two
>> beside-lines — the catch loads fired straight at band-2's own gate:
>> PRE-fire both mounts SILENT (text ' ', cursor-ink knob transparent,
>> cursors already vanished after the 1-space mount's print), MID-PRINT
>> at ~680ms: "It started with cloning a" (25/73 chars) AND "Since then
>> things have go" (25/38), both knobs at #0D0221, cursor blocks live;
>> SETTLED full (73/38) with cursor-vanish holding ([hidden]); the walk's
>> band2-fire step itself caught both typings at 2 chars (aLen 2/bLen 2).
>> The scripts are pre-broken (\n) against the .row's pre-wrap; box
>> reserves HOLD pre→mid→settled: 96px/48px at 1440 (= 2.4em/1.2em),
>> 68.81/34.41 at 1024. B3: "Trained Poet;" computes rgb(20,241,200) at
>> both widths, the band-1 head has NO grow animation (animationName
>> none — F6 holds) and the flash settles crimson rgb(166,2,42). B4: the
>> mirror rows measured at 1440 — rowA widget 56.16→190.55 · copy
>> 226.55→~880 (gap 36 = 2.5vw, vertical centers Δ0, adjacent true);
>> rowB copy 56.16→879.38 (its own box 657.79) · widget 915.38→1049.77
>> flush at the band's 1049.76 right edge (Δ0); 1024: rowAGap 25.59
>> (= 2.5vw), both rows adjacent, the squeeze tracks still capped. B5:
>> the 3ch tab lands ONLY on the asteroid line: 73.59px at 1440
>> (3 × 24.53, the ch of the body voice), 53.03px at 1024, 41.12px at
>> 390 — the serious line's text-indent reads 0px. B6: the breathing —
>> computed margin-top 108px AND rect gaps 108/108 at 1440 (12vh of
>> 900), 108px at 1024, 101.28px at the 844-height 390 (= 12vh there);
>> band-1's own total (586px: 48 + 490 + 48) is untouched by the retune.
>> PARK PAIRING RE-VERIFIED after B6: IDENTICAL to round A — band-1
>> fires at scroll 736 (@ --ab-p 0.7397) and the sidebar parks at 904
>> (@ 1) at BOTH desktop widths, band-1's center at the park step =
>> 446px (the 900-viewport middle, one 8px step shy), the F5 spacer
>> computed 157px; band-2 fires at 1432 (both widths) and band-3 at
>> 2152 (1440)/2128 (1024) — shifted only by the B6 deltas as designed.
>> STANDING: the reverse marquee holds (dirs normal/reverse/normal;
>> drift −100.01/+100.01/−100.01 over ~1.1s), the portraits cycle
>> distinct frames, the journey's 160ms ladder + the plate's chained
>> delay ride unchanged, the paragraph is verbatim (464 chars). 0
>> console errors / 0 pageerrors across ALL loads (1440, 1024, 390 +
>> the two catch loads); scrollWidth===clientWidth at every stop,
>> including 390's three stops (the pool-menu patch keeps the squeezed
>> rowB clear). Captures nf31p2c-*: band1-park-1440 (the parked band-1,
>> the fluro phrase + the settled crimson + the no-plate portraits),
>> band2-typed-mid-1440 + band2-typed-settled-1440 (the mid-print catch
>> + the settled mirror), band3-plate-1440 (the floating plate at the
>> journey's foot), band2-1024 + plate-1024, band2-typed-mid-1024 +
>> band2-typed-settled-1024, stack-stop1/stop2/stop3-390; numbers in
>> /tmp/nf31p2c-results.json (drivers nf31p2c-driver.mjs,
>> nf31p2c-catch.mjs); the :4178 preview reused alive throughout.)

## Iteration C — About, refined again (Eliot, 2026-10-30 ~17:59)

Amends round B in place; scope stays `src/components/LandingAbout.tsx` ONLY. Phases 3-5 unchanged.

- C1 **Band 1's riders animate in TOGETHER** — the two marquees, the header print, and the ascii portrait arrive in lockstep on the band's single fire (no per-rider delay differences; one shared beat, capture gates the read).
- C2 **"I've been Coding." becomes right-justified** (the grow header stays, the alignment flips: the ladder prints against the strip's RIGHT edge).
- C3 **Two rows below, both left-anchored, each row's elements start-aligned** (the B4 mirror yields: rowA = panel·text, rowB = panel·text, all flex-start; the cursored text TOP-aligns against its panel's start edge).
- C4 **The beside-texts run ~50% their round-B size** (default ~20px at 1440 — half the measured 40px, one named constant).
- C5 **The panels never collapse and carry no shadows**: full height from first paint (reserved seats, pre-fire too — the round-B reserves didn't hold visually) and the drop/shadow ladder retires from band-2's widgets per-instance (the fluro plate + border STAY; the portrait's isolated ink look unchanged).
- C6 **Row-2's text types after row-1's completes** (chained delay = row-1's pace end + beat, named constants).
- C7 **Band-3's separations**: marquee→title ≈ **15vh** · title→timeline ≈ **5vh** · timeline→plate ≈ **10vh**.
- C8 **The plate hugs the text — padding 16px all around** (the chamfer keeps its cut close to the box edge; measured).
- C9 **Plate → next section ≈ 15vh** (the about's bottom margin — measured so the visual gap from the plate to the next section's head lands ~15vh over the tail reservation).

- [x] C1-C6 applied and verified at 1440/1024 (the lockstep arrival, the right-justified ladder, the two start-aligned rows, the 20px typing, the full-height no-shadow panels, the row-2 chaining).
- [x] C7-C9: the three separations measured at all widths (record px).
- [x] Standing verification (3 widths, 0 errors, overflow clean; the park-pairing + reverse drift still holding); captures nf31p2d-* vp-suffixed.
- [x] Commit: "About iteration C: the lockstep intro, the right-justified ladder, the start-aligned typing rows, the full-height unshadowed panels, the journey's measured separations".


>> (Iteration-C run — 2026-10-30 ~18:2x: ONE driver pass (nf31p2d-driver.mjs + the nf31p2d-mini.mjs
>> parked-pairing/cycle pass) against the alive :4178 preview (reused; the dist rebuilt before it).
>> RECORDED — C1 the LOCKSTEP: band-1 fires at 736 (@ --ab-p 0.7397) at BOTH desktop widths and ALL
>> THREE riders read identical at the fire — the lead marquee, the reversed marquee, .ab-band1-mid all
>> animationName gl-marquee-drop, 0.7s, delay 0s, transform matrix(1,0,0,1,0,-198) (the shared hold —
>> equal delays, one shared beat, no per-rider differences) — settling to matrix(…,0) by the park; the
>> portraits' 30 frames land AT the fire. PARK PAIRING re-verified: park @ --ab-p 1 lands y 900-904 at
>> both widths, band-1's center AT the park step = 450px @1440 (the 4px-step parkSample read) / 446px
>> @1024 (the 8px-step read, one step shy) — the spacers' computed 157px holds band-1 at the viewport's
>> middle at the park EXACTLY (C7/C9 moved nothing above band 1; the pairing is round-A/B-identical).
>> C2: the grow ladder prints against the strip's RIGHT edge — the span's right = the strip's right =
>> 1049.77 @1440 (Δ 0) / 746.52 @1024 (Δ 0), warm-white rgb(242,245,235), text "I've been Coding.".
>> C3: BOTH rows left-anchored start-aligned panels-first: the panels flush at the band's content edge
>> (rowA Δ 0, rowB Δ 0, starts equal), the cursored lines TOP-aligned (top Δ 0 in all three row reads at
>> 1440 AND 1024); the copy reserves hold (rowA 48px = 2.4em @20px; rowB 24px = 1.2em). C4: the type
>> reads 20px @1440 / 14.336px @1024 (1.4vw) / 11px @390 (the floor) — half of round B's clamp at every
>> width. C5: the widgets hold 212px boxes (the border-box seat = 6.5 × 32px + the library's 4px border
>> pair; scrollH 208 = clientH 208 — five 41.6px lines inside) at PRE-fire (mount), MID-print and
>> SETTLED, box-shadow none and animationName none at every phase (the drop/shadow ladder retired
>> per-instance) while the fluro surface rgb(20,241,200) + border solid 2px rgb(166,2,42) + multiply
>> STAY; the portrait's isolation untouched (ink rgb(13,2,33), border 0, bg transparent, box 490). C6
>> the CHAIN: row-2 types only AFTER row-1's settle — @1440: row-1 settles 73/73 at 2139ms from the
>> band-2 fire, row-2's first growth 2387ms (gap 248 ≈ the 240ms beat); @1024: 2120 → 2362 (gap 242);
>> finals 73 & 38; the mid captures show row-1 printing with row-2 silent, the chained captures show
>> row-1 settled with row-2 printing. C7: marquee→title 135px · title→timeline 45px · timeline→plate
>> 90px @1440 AND @1024 (= exactly 15/5/10 of the 900 viewport); @390: 126.59/42.19/84.39. C8: the
>> computed padding 16px (the copy box flush on the plate: 0/0/0/0; the 20px chamfer keeps its cut).
>> C9: plate → next section head = 472.5px @1440 AND @1024 (= the 37.5vh tail + the 15vh exhale =
>> 52.5vh; computed padding-bottom 472.5px; the tech's head child .lt-flow sits AT the section's top) /
>> 443.09px @390 (52.5vh of 844; pad-bottom 443.1px). STANDING: 0 console errors / 0 pageerrors on ALL
>> loads (1440, 1024, 390); scrollWidth === clientWidth at every stop (top, the three band stops, page
>> end) INCLUDING 390's three stops; the reverse marquee holds (dirs normal/reverse/normal; drift
>> −101.53/+101.53/−101.53 over ~1.1s); the paragraph is verbatim (485 chars as the DOM reads);
>> the portraits' cycle RUNS (the flip's animation clock read 1117 → 2050 → 3700ms). The 390's stack:
>> band-1 559px · band-2 637px · band-3 958px; the rows STACK (the widget above its line; rowA's copy
>> 184px at the floor type — round-B's squeezed 34ch rowB read is gone with the halved type). Captures
>> nf31p2d-*: band1-park-1440/1024, band2-typed-mid-1440/1024, band2-chained-1440/1024,
>> band2-settled-1440/1024, band3-plate-1440/1024, stack-stop1/2/3-390, portraits-a/b-1440; numbers in
>> /tmp/nf31p2d-results.json (drivers /tmp/nf31p2d-driver.mjs + /tmp/nf31p2d-mini.mjs); the :4178
>> preview reused alive throughout.)

## Feedback round A — the Now section (Eliot, 2026-10-30 ~18:23)

Amends the Phase-2 build in place; scope stays `src/components/LandingNow.tsx` ONLY. Phases 3-5 unchanged. Landed as N1-N8:

- [x] N1 the bloom band: the strip is a SOLID GREY band (site grey #686474; the 2px ink borders kept) and the headline's fill rides the SAME grey at rest — the band reads empty until the reveal.
- [x] N2 the reveal: the fill turns over to the warm white as the INK shadows bloom OUTWARD from the glyphs (a transition on the light-DOM copy span — a shadow list can only transition on the element carrying it, and the slot that holds the library's printed stack is unreachable from the page's tree; the equal-length resting list (18 transparent zero rungs) makes the paired interpolation engine-proof).
- [x] N3 the shadows run BOTH ways: the x+- axis — the fib rungs (1 2 4 7 12 20 33 54 88) mirrored to a plus/minus pair per rung at the infinite fade alphas.
- [x] N4 the bands rebuilt over their photos: 30vh tall; the LEFT 62% = the project photo as one background, chamfered on its right edge (the plates' 20px cuts, both right corners — the clip also scopes the title's difference blend to the shot); the title sits OVER the photo (mix-blend-mode difference), left justified AT the band edge, fill-size = the band's height (30vh em; --ln-name-fit steps a long run down to stay across its photo, NAME_SHARE 58).
- [x] N5 the 12px crimson midline riding the band's vertical middle UNDER the glyphs (z 1 vs the title's 2; a third color prints where the difference fill crosses it).
- [x] N6 the copy + the "go to ->" CTA sit on the RIGHT 38%: the fluro block (plate cyan) carries the copy and the button stacked, left-aligned on the plate's padding; novel still carries none.
- [x] N7 the marquees' ride REMOVED (base pose, transition, drop animation and their reduce overrides all retired): they are the bands' borders — present before the reveal, the bands rise between them.
- [x] N8 the entry's alternate rotation: each band overshoots +/-2deg on the rise (--ln-tilt per band: + - +), the SECOND band turning the OPPOSITE way, all settling level (interpretation read: the brief's "rotate" landed on the ENTRANCE, not a static tilt — a static full-bleed tilt would leave paper wedges at the band's edges at rest; vetoable to a static read with the same var).
- [x] Verify: tsc clean; build clean; the full pass + a 1440 probe (the CTA's rect left == the copy's left, both fluro-flush) below. 0 console/page errors at all three widths; overflow clean everywhere; images loaded.
- [x] Commit: "Now feedback round A: the grey bloom band with the outward two-way shadows, the photo bands over the difference titles, the midline, the bordered marquees, the alternate-turn entry".

>> (Round-A run — 2026-10-30 ~18:3x: driver /tmp/nf31nowa-driver.mjs, results
>> /tmp/nf31nowa-results.json, against the alive :4178 preview reused from round C.
>> PRE-REVEAL (all widths): strip bg rgb(104,100,116) == the copy's fill (invisible,
>> grey-on-grey); the copy's resting shadow list = 18 transparent zero rungs; the bands'
>> matrices carry the tilts directly — b = +0.0349 / -0.0349 / +0.0349 (+2 / -2 / +2deg,
>> the second turning opposite); BOTH marquees transform none + animationName none
>> (static, pre and post). ENTRY pump: 17 strong samples per band mid-flight, signs
>> 1/-1/1, settled transform none at all widths. SETTLED: bands 270.0px (30vh of 900) at
>> 1440 AND 1024; the shot ratio 0.62 exact / fluro 0.38; clip-path polygon with calc
>> 20px cuts; blend difference; nameLeft 0; runs 516.52 / 613.42 / 645.81 @1440 (all
>> inside the 678.5 shot right edge — the fit machinery holds); titles 270 (fill) /
>> 135.6 (fit-capped) / 244.16; ink stays in-band (inkPx 196.56 / 123.93 / 174.33 on a
>> 270 band — fits true); the midline: height 12px, crimson rgb(166,2,42), center
>> offset 0.0 from the band's middle at ALL bands/widths, z 1 under the title's 2;
>> fluro plate rgb(20,241,200); CTA present bands 1-2 / absent band 3, its left flush
>> with the copy's (698.22 == the copy's 698.22 @1440 — the padding rides the block,
>> not the paragraph). 390: the stacked cards (382 / 357 / 292 tall — the first
>> driver pass caught the shot COLLAPSED by the mobile % flex-basis (basis resolved
>> against the column's indefinite height, the absolute-only shot went 0 tall; fixed
>> flex basis auto, heights drive); the midline rides the TITLE (shot) middle in the
>> card (-89.7px vs the band middle is the copy block below, per card design).
>> CTA REAL click -> #/projects/1, back restores #now. Captures nf31nowa-*:
>> header-1440/1024/390, band1/2/3-1440, band1/band2-1024, stack1/2/3-390 + the
>> junction crops (the line stops at the photo's clipped edge; the plate untouched).)

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