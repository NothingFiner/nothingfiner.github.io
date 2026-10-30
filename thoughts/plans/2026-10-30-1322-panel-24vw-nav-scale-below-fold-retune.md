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

- [x] `LandingAbout.tsx:205` `.ab-head`: `1 / -5` → `1 / -4`.
- [x] `:264` `.ab-cols`: `1 / -5` → `1 / -4`.
- [x] `:295` `.ab-story`: `1 / span 8` → `1 / span 9`.
- [x] `:262-263` the cols comment says "cols 1..8 … the panel = the last four" → update to cols 1..9 / the panel = the last three (the comment's numbers MUST follow the spans it explains).
- [x] `LandingTechnologies.tsx:180` `.lt-cloud`: `1 / span 8` → `1 / span 9`; `max-width: 52vw` HOLDS; the cloud's span comment (if any cites 1-8) updates likewise.
- [x] Touch NOTHING else: row fr ratios, `.ab-rule`, type clamps, all vertical margins (the defaults table above).
- [x] **Verify (1440×900):** about — headline box, the two story rows, and the story block each end ~3vw shy of the panel (the old flush tolerance, one track wider); text lines measure ~12% longer — read them (story paragraph, both rows) and screenshot for the line-length check; tech — the chip cloud keeps its 52vw cap exactly (wrap count UNCHANGED vs a pre-phase-3 capture — take that capture first); the marquee/head positions unchanged.
- [x] Standing verification (incl. 1024×900: spans + 24vw bar leave the least slack there; 390×844: mobile `flex` pose untouched).
- [x] Tick + commit (`the panel-era spans widen one track; the panel reads as the last three columns`).

## After all phases

- [x] Final report: one screenshot set (1440 / 1024 / 390) of the full journey, the occupancy measurement (longest link vs bar at both widths), and the settled numbers list for Eliot's review — especially the veto points (gap 1.36vh, cloud cap holds, carousel 303px holds, `top: 38.7vh` holds). *(ticked ~14:45 — the full record landed below; three clean full-journey passes + spot-checks all green at 5dcd191)*

## After all phases — final record (2026-10-30 ~14:45)

Recorded at `new-design` @ **5dcd191** — the four-commit arc: `9c9edbc` panel → `de3a725` pool-fade → `8f276e5` riders → `5dcd191` spans. The :4178 preview's dist verified current at 5dcd191 (HEAD's `24vw` / clamp / hold values all inlined in the served bundle). **Full journey per width** — load (hero fold) → about (panel parked) → technologies → now → page bottom (the band's foot pose) → back to top — one pass each at 1440×900, 1024×900, 390×844, reusing the phase drivers' template. **Every stop, every width: 0 console errors, 0 pageerrors, `scrollWidth === clientWidth` (root + body)** — `journeyClean = true ×3`.

### Journey passes (errors / overflow per stop)

| stop | 1440×900 | 1024×900 | 390×844 |
|---|---|---|---|
| load (hero fold) | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |
| about (panel parked) | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |
| technologies | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |
| now | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |
| page bottom | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |
| back to top | 0 · 1440/1440 | 0 · 1024/1024 | 0 · 390/390 |

### Settled numbers (fresh spot-check on THIS head)

| piece | 1440×900 | 1024×900 | verdict |
|---|---|---|---|
| Panel geometry — 24vw parked | w **345.59**, left **1094.4**, `transform: none` | w **245.76**, left **778.24** (measured 778.2 @1dp) | holds exactly |
| Nav pose (HOLD) — `top: 38.7vh` / `left: 0.9vw` / gap 1.36vh | 348.3px / 12.96px / 12.24px | same | the holds hold |
| Nav computed font | **37px** (clamp cap) | **26.624px** (2.6vw mid-form) | holds |
| Longest link — `What I'm up to.` | **263.89px** | **189.86px** | measured |
| Occupancy vs the old 33.47vw scale | **76.36%** (old ≈ 76.76% — Δ 0.40pp) | **77.25%** (old ≈ 76.63% — Δ 0.60pp) | old-ratio read holds |
| Tech marquee at panel edge | right 1094.4, **gap 0.00** (`right: 24vw`) | right 778.2, gap 0.00 | flush holds |
| Now strip at panel edge | right 1094.4, **gap 0.00, underhang 0** | right 778.3, gap −0.01 (0.01px underhang) | flush holds |
| Carousel depth (HOLD 303px) | style **303px** (renders 305px with border) | same | holds — slides **364.8** / **259.4**, **3 exactly fill the strip** (1094.4 / 778.2) |
| About spans shy of panel | head / cols / story all **46.41px = 3.22vw** | **33.04px = 3.23vw** | ≈3.2vw holds, all three tracks identical |
| Text line-lengths (phase-3 measure vs its pre-capture) | cols ×1.1345, story ×1.1273 | ×1.1361 / ×1.1262 | ≈ +11–14% — the widened tracks, no blowout |
| Chip cloud (HOLD cap 52vw) | **6 rows** / 27 chips, cap 748.8px = 52vw **binds** | **8 rows** / 27 chips, cap 532.48px binds | row counts + cap hold |
| @390 mobile | — | — | panel `display: none`; marquee `margin-inline: −23.4px` (−6vw), strip `−23.4px 0px` — poses hold |

**Invariants re-saw on the journey:** the about marquee still runs full-bleed UNDER the parked panel by exactly the panel's width (345.6 / 245.8 — on purpose); the band owns the foot at page bottom (`.lf-band.lf-band-journey.lf-foot-in`, full width, z 45 over the panel); the fixed panel contributes no scrollable overflow at any stop.

### Holds ledger (veto points — never touched, re-fenced at 5dcd191)

- nav `top: 38.7vh` · `left: 0.9vw`
- the panel's 106% self-relative flight — `translate: calc((1 − var(--ab-p, 0)) * 106%)`; the hero fold measured it off-viewport right at p=0, parked only after the about hand-in
- carousel `--glaphic-card-carousel-height: 303px`
- chip cloud `max-width: 52vw`
- grow/body type clamps, row fr ratios, ALL vertical margins (tech band `top: 16vh`/48px, strip `margin-top: 12.6vh`, every entry in the Defaults table)

### Known-estimate note

The research's **~83%** occupancy interpolation was off — the link actually fills **76.36%** @1440 (77.25% @1024). But 83% was never the goal; the goal was the **same occupancy ratio as the old scale**, and that is what landed: measured 76.36% vs the old scale's ≈76.76% (derived from the phase-1 font math) — **within 0.4pp**. (@1024: 77.25% vs ≈76.63%, ≈0.6pp.) Both widths read the same "fills most of the bar" beat the old design had — no further type retune warranted.

### Screenshots (full journey, /tmp only)

- 1440×900: `/tmp/nf30r-w1440-hero.png` · `-panel.png` · `-tech.png` · `-now.png` · `-end.png`
- 1024×900: `/tmp/nf30r-w1024-hero.png` · `-panel.png` · `-tech.png` · `-now.png` · `-end.png`
- 390×844: `/tmp/nf30r-m390-hero.png` · `-panel.png` · `-tech.png` · `-now.png` · `-end.png`
- driver + capture JSON: `/tmp/nf30r-record.mjs` · `/tmp/nf30r-record.json`
