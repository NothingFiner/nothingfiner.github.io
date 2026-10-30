# Implement Plan — crimson panel to 24vw · nav type scale · below-fold re-tune

- **Date:** 2026-10-30 ~13:22
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **Research:** `thoughts/research/2026-10-30-1314-panel-24vw-nav-scale-below-fold-retune.md` (all line cites below are from it unless fresh reads noted)
- **Worker protocol:** ONE PHASE PER DISPATCH. Finish the phase's steps + verification, tick its checkboxes IN THIS FILE, commit (site repo only), then STOP and hand back for review. Never start the next phase unprompted. If max turns approach, stop mid-step, leave the tree verified-and-committed-or-clean, and report exact state.
- **Standing verification (every phase):** `npx tsc --noEmit` clean (site); `npm run build` + serve (`vite preview`; if the :4174 server from the 10-29 plan is still up, reuse it); REAL loads at **1440×900**, **1024×900** (the tight desktop band — NEW for this plan), and **390×844**; 0 console errors; `scrollWidth === clientWidth`; REAL clicks only. Drivers + screenshots in /tmp only.
- **Rules:** `~/Projects/standards-mcp/rules/universal.md` (always) + `css.md` (styling) + `preact.md` (components) + `projects/nothingfiner.md` (project layer). Read the file for the step at hand, not all at once.
- **Hard gotchas:** Preact not React (`preact/hooks`, `class=` not `className`); no `as any`; no non-null `!`; hash routing via `wouter-preact`; comments are WHY-only — but a comment whose numbers go stale because you touched its code MUST be updated in the same edit (e.g. "the last four" span comments); a template literal is ONE string — the panel's `<style>` is a template literal, so no backticks/dollar-brace prose inside it; `vite.config.ts` stays diff-free vs HEAD after every phase.

## In-scope brief (Eliot, 2026-10-30 ~13:14)

1. The desktop landing's crimson sidebar (LandingPanel) goes to **~24vw**.
2. The nav's **font-size scale decreases** so the links take up a **similar amount of the bar** as now — the proportional re-read, not a bespoke measure.
3. The **below-fold elements' sizing adjusts to compensate** — every piece anchored to the old 33.47vw edge follows the panel, and the compositions sized in the panel era keep their edge discipline.

## Defaults set by this plan (veto points — each is a one-line change to reverse)

Every value is the research's proportional interpolation (× 0.7173, 24 / 33.47):

| Piece | Today | New | Where |
|---|---|---|---|
| Panel width | `33.47vw` | **`24vw`** | LandingPanel.tsx:201 |
| Nav link font | `clamp(30px, 3.6vw, 52px)` | **`clamp(22px, 2.6vw, 37px)`** | LandingPanel.tsx:228 |
| `--ab-slot` (the fan's unit) | `calc(clamp(30px, 3.6vw, 52px) * 1.1 + 1.9vh)` | **`calc(clamp(22px, 2.6vw, 37px) * 1.1 + 1.36vh)`** | LandingPanel.tsx:222 |
| Nav gap | `1.9vh` | **`1.36vh`** (0.7173 × 1.9 — the column keeps its relative height on the bar) | LandingPanel.tsx:219 |
| Nav `top: 38.7vh`, `left: 0.9vw` | — | **HOLD** (vertical pose; left inset unchanged) | LandingPanel.tsx:214-215 |
| Tech marquee edge | `right: 33.47vw` | **`right: 24vw`** | LandingTechnologies.tsx:151 |
| Now strip's right margin | `29.6vw` | **`20.1vw`** (= 24 − 3.9 gutter) | LandingNow.tsx:109 |
| About head box | `1 / -5` | **`1 / -4`** | LandingAbout.tsx:205 |
| About rows | `1 / -5` | **`1 / -4`** | LandingAbout.tsx:264 |
| About story | `1 / span 8` | **`1 / span 9`** | LandingAbout.tsx:295 |
| Tech cloud span | `1 / span 8` | **`1 / span 9`** (its `max-width: 52vw` cap HOLDS — the cloud's own wrap read is text-sized, not panel-scaled) | LandingTechnologies.tsx:180 |
| Carousel depth | `--glaphic-card-carousel-height: 303px` | **HOLD** (slides widen ~338→~383px against it; the `square` claim is per-slide if a rebalance is wanted later) | LandingNow.tsx:150 |
| Grow/body type clamps, row fr ratios, all vertical margins | — | **HOLD** | — |

**Unaffected by design (verified — touch NOTHING here):** the 106% self-relative flight (LandingPanel.tsx:208), the `--ab-p` clock + the band's `--lf-x` crossfade, the `:has(+ .lf-band)` hand-back, the about marquee's full-bleed (rides UNDER the panel on purpose, LandingAbout.tsx:226-243), the whole `.lf-*` footer-band corner stack (edge-pinned above the panel, z 45 > 40), the hero (above the fold — no panel), and mobile (panel `display: none` ≤899px). **LandingPast is OUT OF SCOPE** (the 10-29 plan's Decision 8) and glaphicUI is untouched.

## Protected boundaries (HARD)

- glaphicUI repo: touch NOTHING (not even working-tree edits).
- `vite.config.ts` (site): must stay diff-free vs HEAD after every phase.
- `LandingPast.tsx`, `LandingHero.tsx`, `landing.css`, `index.css`, `app.tsx`: this plan edits NONE of them (the landing band's layer lives in landing.css and is edge-pinned, not panel-width-pinned).
- All edits are **style-block CSS + comments only** — no logic, no JSX shape changes, no props.

---

## Phase 1 — the panel: width + nav type scale

**Files:** `src/components/LandingPanel.tsx` (style block only; comments if their numbers go stale — none cite the width today).

- [x] `:201` `.landing-panel` width: `33.47vw` → `24vw`.
- [x] `:228` `.ab-nav a` font-size: `clamp(30px, 3.6vw, 52px)` → `clamp(22px, 2.6vw, 37px)`.
- [x] `:222` `--ab-slot`: `calc(clamp(22px, 2.6vw, 37px) * 1.1 + 1.36vh)` — the ONE edit point the fan measures from; it must carry the SAME clamp as the font, or the in/out fans and overshoots desync (:256-292).
- [x] `:219` gap: `1.9vh` → `1.36vh`.
- [x] Verify `top: 38.7vh` / `left: 0.9vw` untouched; the 106% flight untouched; `:330-333` mobile block untouched.
- [x] **Verify (1440×900):** scroll to the about — the panel parks at 24vw; the active link + the fan-out land the four links INSIDE the bar (no glyph clipped, no wrap); the longest link (`What I'm up to.`) fills ~83% of the bar (≈ old ratio — screenshot for the record); fan-in, hand-over wipe (`Technologies.` → `About.` via scroll), pool-menu-open fade, and Home. ride-out all play in-row. Then 1024×900: link fits the 246px bar at the 2.6vw mid-form. Then 390×844: panel absent, flow unchanged. *(ticked on Eliot's approval of this box, round 2: the pool-fade played only after the hand-back selector went adjacent-plus → general sibling — LandingPast, seated between the panel and the band since b79528d, had killed the adjacent match; the fix lands in the commit below and everything in this box re-measured clean)*
- [x] `scrollWidth === clientWidth` at all three widths; `tsc` clean; build + preview serve fine.
- [x] Tick these boxes, commit (`panel: 33.47vw → 24vw, the nav's type scale joins the bar's read`).

## Phase 2 — the hard edge couplings follow the panel

**Files:** `src/components/LandingTechnologies.tsx`, `src/components/LandingNow.tsx`.

- [x] `LandingTechnologies.tsx:151` `.lt-marquee` right: `33.47vw` → `24vw` (the ticker stops at the panel's NEW edge; the band's `top: 16vh`/`height: 48px` hold).
- [x] `LandingNow.tsx:109` `.ln-strip` margin-inline: `-3.9vw 29.6vw` → `-3.9vw 20.1vw` (the strip ends flush at the panel's new edge; `margin-top: 12.6vh` holds).
- [x] The comments: neither cites the literal — verify nothing went stale (`LandingNow.tsx:6-10` "flush to the sidebar's left edge" is number-free; add no numbers to comments per WHY-only).
- [x] **Verify (1440×900):** scroll — the about's marquee still runs full-bleed under the panel (unchanged pose); the TECH marquee's right end kisses the panel's left edge (screenshot); the now strip ends flush at that edge (no gutter, no underhang); the carousel's 303px depth + wider slides read (three visible, no squash); the card-mode compose still sits inside the widened strip.
- [x] Standing verification incl. 1024×900 (the strip's flush read is the most vw-sensitive there) + 390×844 (mobile: `.lt-marquee { right: 0; margin-inline: -6vw }` and `-6vw 0` poses hold).
- [x] Tick + commit (`the edge-locked riders follow the panel: tech marquee 24vw, now strip 20.1vw`).

## Phase 3 — the below-fold compositions widen one track

**Files:** `src/components/LandingAbout.tsx`, `src/components/LandingTechnologies.tsx`.

- [ ] `LandingAbout.tsx:205` `.ab-head`: `1 / -5` → `1 / -4`.
- [ ] `:264` `.ab-cols`: `1 / -5` → `1 / -4`.
- [ ] `:295` `.ab-story`: `1 / span 8` → `1 / span 9`.
- [ ] `:262-263` the cols comment says "cols 1..8 … the panel = the last four" → update to cols 1..9 / the panel = the last three (the comment's numbers MUST follow the spans it explains).
- [ ] `LandingTechnologies.tsx:180` `.lt-cloud`: `1 / span 8` → `1 / span 9`; `max-width: 52vw` HOLDS; the cloud's span comment (if any cites 1-8) updates likewise.
- [ ] Touch NOTHING else: row fr ratios, `.ab-rule`, type clamps, all vertical margins (the defaults table above).
- [ ] **Verify (1440×900):** about — headline box, the two story rows, and the story block each end ~3vw shy of the panel (the old flush tolerance, one track wider); text lines measure ~12% longer — read them (story paragraph, both rows) and screenshot for the line-length check; tech — the chip cloud keeps its 52vw cap exactly (wrap count UNCHANGED vs a pre-phase-3 capture — take that capture first); the marquee/head positions unchanged.
- [ ] Standing verification (incl. 1024×900: spans + 24vw bar leave the least slack there; 390×844: mobile `flex` pose untouched).
- [ ] Tick + commit (`the panel-era spans widen one track; the panel reads as the last three columns`).

## After all phases

- [ ] Final report: one screenshot set (1440 / 1024 / 390) of the full journey, the occupancy measurement (longest link vs bar at both widths), and the settled numbers list for Eliot's review — especially the veto points (gap 1.36vh, cloud cap holds, carousel 303px holds, `top: 38.7vh` holds).