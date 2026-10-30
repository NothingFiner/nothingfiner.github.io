# Research — crimson panel to 24vw · the nav type scale · the below-fold re-tune

- **Date:** 2026-10-30 13:14
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **HEAD at research:** `e69384b` ("fix: the site defines its mono token on html:root …")
- **Tree state:** clean except untracked `thoughts/` (the research/plans docs themselves)
- **Method:** full read of the landing journey's surface — LandingPanel, Landing(Hero/About/Technologies/Now/Past), SiteFooter, landing.css, index.css, Landing.tsx — grep sweeps for width literals (`33.47`, `29.6vw`, `2.3vw`, `482`) and `--ab-` consumers.
- **Scope discipline:** facts only, no design decisions. Decisions belong to the plan phase (`/create_plan`). Every claim carries a file:line cite.

---

## Topic 1 — the panel's width: one literal, one self-relative flight

The sidebar is LandingPanel (landing only, desktop only — `projects/nothingfiner.md` Anatomy), a fixed full-height crimson column. Its geometry:

| Fact | Cite |
|---|---|
| `.landing-panel { width: 33.47vw }` — the only width literal; 481.97px at the mock's 1440 artboard | LandingPanel.tsx:201 |
| Slide-in flight `translate: calc((1 - var(--ab-p, 0)) * 106%) 0` — **self-relative (%) of the panel's own box**; a narrower panel shrinks its own off-screen distance automatically. No recalibration needed. | LandingPanel.tsx:208 |
| Desktop-only: `@media (max-width: 899px) { .landing-panel { display: none } }` — the width change cannot affect tablet/mobile | LandingPanel.tsx:330-333 |
| The `--ab-p` journey clock (0→1 over the about's 70vh approach) and the band's crossfade read of it (`--lf-x`, 0.25→0.75) are TIME-space, not width-space — unaffected | LandingPanel.tsx:160-166, landing.css:101-103 |
| Panel z 40; the sticky band z 45 above it — ordering holds at any width | LandingPanel.tsx:203-205, landing.css:97-99 |
| Pool-menu hand-back selector `.landing-panel:has(+ .lf-band …)` — sibling structure, unaffected | LandingPanel.tsx:325-327 |

**The 33.47vw number has exactly one other consumer** (grep, whole src): the technologies marquee — see Topic 3a.

## Topic 2 — the nav type scale ("the links take up a similar amount of the bar")

The nav lives inside the panel, left-anchored at the panel's left edge (its position does NOT depend on the panel's width; its *occupancy ratio* does):

| Fact | Cite |
|---|---|
| `.ab-nav { left: 0.9vw; top: 38.7vh; gap: 1.9vh }` | LandingPanel.tsx:214-219 |
| `--ab-slot: calc(clamp(30px, 3.6vw, 52px) * 1.1 + 1.9vh)` — the fan's flight unit | LandingPanel.tsx:222 |
| `.ab-nav a { font-size: clamp(30px, 3.6vw, 52px); line-height 1.1; }` — Space Grotesk 700 | LandingPanel.tsx:226-230 |
| The fan measures every flight in `--ab-slot` heights (in- and out-fans, overshoots) — **all choreography auto-follows `--ab-slot`; the slot calc is the ONE edit point** — it must be rewritten in the same terms as the new font/gap or the fan desyncs | LandingPanel.tsx:256-292 |

Occupancy facts at 1440 (all interpolated, not decided):

- Panel: `33.47vw` = 481.97px; target `24vw` = 345.6px ⇒ **ratio 0.717**.
- Longest link `What I'm up to.` (15 glyphs): at the 52px cap the line's advance ≈ 52px × ~0.51em/glyph ≈ ~400px ≈ **~83% of the bar** (0.9vw inset leaves 469px).
- Same occupancy at 24vw ⇒ font × 0.717: `3.6vw → ~2.58vw`, cap `52px → ~37px`, floor `30px → ~21.5px`. (The narrow desktop band still works: at 900px viewport, 24vw = 216px vs the line at ~2.6vw/floor 22px ≈ ~185px.)
- `gap: 1.9vh` and `top: 38.7vh` are **vh-scaled — they inherit none of the width change**. A fully proportional re-read would shrink the gap to ~1.36vh so the four-link column holds its relative height on the bar; `top` is a vertical pose decision (Eliot's).

## Topic 3 — hard couplings: geometry anchored to the old edge (MUST change)

Two elements anchor to the literal edge. The panel covers the viewport's right 33.47vw from the about stretch down; their new counterparts:

| Element | Today | Counterpart at 24vw | Cite |
|---|---|---|---|
| **(a) Technologies marquee** `.lt-marquee { right: 33.47vw }` — the ticker "stops at the crimson panel's edge" | right: 33.47vw (left:0, absolute, top: 16vh, 48px band) | `right: 24vw` — otherwise the band's right end either tucks under the panel's new left edge or shows a gap | LandingTechnologies.tsx:147-165 (esp. :151) |
| **(b) Now carousel** `.ln-strip { margin-inline: -3.9vw 29.6vw }` — the strip ends **flush at the panel's edge**; 29.6 = 33.47 − 3.9 (the flow's right padding, landing.css:531) | right margin 29.6vw | `24 − 3.9 = 20.1vw`. Strip width grows ~70.4vw → ~79.9vw (1440: ~1014 → ~1150px) | LandingNow.tsx:107-114 (esp. :109) |

Knock-on of (b): the carousel's slides are exact thirds of the strip (the component's own geometry, LandingNow.tsx:6-10) — a third goes ~338px → ~383px against the strip's fixed **303px depth** (`--glaphic-card-carousel-height: 303px`, LandingNow.tsx:150, inline) — the square-ish read gets wider unless the depth scales. Plan's call.

Knock-ON of (a): the **about's** marquee has no edge rule — it is deliberately FULL-BLEED (`margin-inline: -3.9vw -3.9vw`, runs "under" the panel; the panel rides over its right end): LandingAbout.tsx:226-243. The two bands are intentionally different poses; only the tech one is edge-locked.

## Topic 4 — soft couplings: compositions sized in the panel era (re-tune candidates)

Everything below is desktop, below the fold, currently tuned against "the panel = the last four of the 12" (the flow-grid mapping, LandingAbout.tsx:261-263). Track facts (12 × 1fr, gap 1.1vw, padding-inline 3.9vw — LandingAbout.tsx:196-197, landing.css:531): at 1440 a track is ~6.58vw. The OLD edge (66.53vw) sat just inside col 9 ⇒ content spans ended at `-5` (65.36vw). The NEW edge (76vw) sits inside col 10 ⇒

| Piece | Today | Read at 24vw | Cite |
|---|---|---|---|
| About headline box `.ab-head` | `grid-column: 1 / -5` | keep `-5`: ~10.6vw of air before the panel; widen to `-4`: ends 73.05vw (~3vw shy of flush, the same "stops at the edge" discipline minus the flush tolerance) | LandingAbout.tsx:203-209 |
| About rows `.ab-cols` | `1 / -5` ("the panel = the last four") | same choice as the head; `-4` is its exact counterpart | LandingAbout.tsx:261-268 |
| About story `.ab-story` | `1 / span 8` (ends at col 8's right edge, line 9) | `span 9` = the `-4` counterpart (ends line 10, 73.05vw) | LandingAbout.tsx:293-298 |
| About row rhythm + story type | `4fr·1px·3fr` / `3fr·1px·4fr`; `clamp(15px, 1.53vw, 22px)` heads, `clamp(12px, 1.18vw, 17px)` body | only touch if the spans widen — wider tracks = longer line lengths; balance is Eliot's call | LandingAbout.tsx:271-292 |
| Tech chip cloud `.lt-cloud` | `1 / span 8`, `max-width: 52vw`, `margin-top: 13.8vh` | the 52vw cap fits the OLD span; more room ⇒ a wider cap is available (also changes the wrap count of the chip roll) | LandingTechnologies.tsx:178-187 |
| Grow headlines (about/tech/now) | `font-size: clamp(34px, 4.9vw, 70px)` (landing.css:29, shared voice); about's box stops at the old edge (`1 / -5`) | the about head's box is the only head anchored to the old edge — `-4` candidate; the FONT is vw-scaled and independent of the panel (keep unless Eliot rebalances the voice) | landing.css:25-30, LandingAbout.tsx:205 |
| Now strip's seat | `margin-top: 12.6vh` | width-following already covered in 3(b); the margin is vertical, hold | LandingNow.tsx:110 |

**Untouched-by-fault (verified, do NOT edit in a 24vw pass):**

- Every below-fold section's tail reserve `padding-bottom: calc(37.5vh + 8vh)` — that reserves the sticky band's slot (37.5vh, landing.css:96), not the panel: LandingAbout.tsx:187-188, LandingTechnologies.tsx:145-146, LandingNow.tsx:70-71.
- The footer band's corner: `.lf-menu { right: 2.3vw }` (landing.css:129), `.lf-cluster { right: 2.3vw; bottom: 4.4vh }` (:240), `.lf-foot` padding `6vh 2.3vw 4vh` (:149), mark `min(8.6vw, 124px)` (:160) — all pinned to the viewport's right EDGE, riding z 45 above the panel's z 40. A 24vw panel clears every one of them exactly as 33.47vw did. (Only the fixed 69×52 patch's *relative* size on the bar grows — library-owned, out of scope.)
- The HERO `.hf-copy { padding-right: 32vw }` (LandingHero.tsx:116) — reserves room for the band's menu/icons cluster at the fold; the fold has NO panel (it arrives between page 1 and 2). Above-the-fold, unrelated to this ask.
- Mobile poses (≤899px): the panel is `display: none`; sections' mobile rules don't read the width: LandingPanel.tsx:330-345, all sections' mobile blocks.

## Topic 5 — out of scope / in flux

- **LandingPast** ("Past Work"): per the 2026-10-29 plan's Decision 8 — OUT OF SCOPE, "still planning how it will look". Its head spans full width (`1 / -1`, landing.css:541) and `.landing-past__image` has **no styles anywhere in src** (grep; unstyled auto-placed grid item, LandingPast.tsx:36-43). No panel-edge discipline exists there yet — re-tuning it for 24vw is premature.
- **glaphicUI (the library)**: mid-flight and edit-protected (2026-10-29 plan's Protected Boundaries). Nothing in the 24vw change needs the library.

## Open questions for the plan (`/create_plan`)

1. **Nav scale** — the proportional interpolation says `clamp(~22px, ~2.58vw, ~37px)` for the same ~83% occupancy; a bespoke value (or keeping the floor higher for the 900–1100px band) is Eliot's call. Does `--ab-slot`'s `1.1` line-height factor rewrite verbatim with the new clamp?
2. **Nav gap/top** — full proportional re-read (gap 1.9vh → ~1.36vh) or hold the vh rhythm? `top: 38.7vh` holds?
3. **Track spans** — widen the about/now-panel-edge spans one track (`1 / -5` → `1 / -4`, `span 8` → `span 9`) or keep them and accept ~5–10vw more crimson air?
4. **Now carousel** — keep the 303px depth with wider slides, or scale `--glaphic-card-carousel-height` to preserve the read?
5. **Tech cloud** — widen the `52vw` cap (and with it the chip roll's wrap), or let the extra room stay as air?
6. **Verification targets** — the standing protocol (1440×900 + 390×844, `scrollWidth === clientWidth`) plus a ~1025px viewport: 24vw = 246px is the bar where the nav's long link + floor font are tightest.