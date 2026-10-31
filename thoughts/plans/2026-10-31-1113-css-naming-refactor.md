# Implement Plan — the CSS-standards naming refactor (BEM + utility reconciliation)

- **Date:** 2026-10-31 ~11:16 (plan 0 drafted 11:13)
- **Repo:** /Users/asenoth/Projects/nothingfiner.github.io, branch `new-design`
- **Research:** `thoughts/research/2026-10-31-1107-class-name-census.md` — 285 distinct class names · 466 uses · ~25 files; the camps, the drift and the dead names with cites. Companion research (the glaphic-styles census, 10:51) — its library asks stay OWNED THERE, not here. Re-verify line numbers on fresh reads; files have moved.
- **Worker protocol:** ONE PHASE PER DISPATCH. Finish the phase's steps + verification, tick its checkboxes IN THIS FILE, commit (site repo only), then STOP and hand back for review. Never start the next phase unprompted. If max turns approach, stop mid-step, leave the tree verified-and-committed-or-clean, and report exact state.
- **Standing verification (every phase):** `npx tsc --noEmit` clean; `npm run build` (+ the prerender's dist write); a long-lived `vite preview` (:4178 when already live — never restart or kill a server another round is using); 0 console errors / 0 pageerrors on every load; `scrollWidth === clientWidth` (root + body) at every stop; drivers + screenshots OUTSIDE the repo (/tmp, per-phase prefixes nfNR1…, viewport-suffixed), `?nowipe` for shot stability, shots BEFORE any real-click flow, REAL trusted clicks only.
- **The rename's own test:** a class refactor is behavior-neutral — **each phase's touched surfaces screenshot BEFORE (pre-phase state) and AFTER, and the pair must be pixel-identical.** Any delta = a missed selector; fix and re-verify before ticking. (CSS-only deltas: none expected; if a phase also converts a layout block to utilities per D2, capture at all three widths 1440×900 / 1024×900 / 390×844.)
- **Rules per step:** `~/Projects/standards-mcp/rules/universal.md` (always) + `css.md` (the law — re-check the step against its Naming section) + `preact.md` (the JSX class edits) + `typescript.md` (only where interpolated classnames live) + `projects/nothingfiner.md`. Read the file for the step at hand.
- **Hard gotchas:** Preact not React (`class=` not className); no `as any`, no non-null `!`; comments WHY-only — update every comment whose class references this round renames stale (comments name classes!); a template literal is ONE string (no backticks/dollar-brace prose inside style blocks — the recurring killer); **do not rename the shadow-boundary contract**: `--glaphic-*` tokens, `part="…"` names, state attributes (`[open]`, `[writing]`), `:host` — they are NOT class names; the panel's `:has(~ …)` coordination and the one-screen `:has` gates rename IN THE SAME PHASE as the classes they reference, never across phases.

## Decisions on record (Eliot's directives, verbatim anchors)

11:07 — "we need to refactor non-bem and atomic/utility class names."
11:13 — "you can revert my non-label updates to that file. it's super important to me that we follow css standards as laid out in CSS.md. we want most layout to be handled by tailwind grid classes. unless it's impossible or goofy to do so."

## Defaults set by the plan (veto points — each a one-line reversal)

| # | Decision | Default + why |
|---|---|---|
| D1 | The target grammar | Canonical BEM: block = the component's kebab name (css.md: "the component name is the block"); elements `block__element`; deeper nesting reads as ONE element name (`.lp-band-name` → `landing-past__band-name`). States/modifiers = `--modifier` ON the node carrying the state; the compound `.block.state` selectors (`.ab-band.ab-on`) rewrite to the modifier form (`.landing-about__band--on`). |
| D2 | Layout → utilities | css.md law + Eliot: display (flex/grid/sticky/fixed), tracks (`grid-rows-N`/`grid-cols-N`, responsive spans), gutters (`gap-*`), alignment, plain spacing = Tailwind classes. **Goofy-stays-BEM** (each with a WHY comment): parameterized page geometry — full-bleed `margin-inline: -3.9vw 20.1vw`, `calc(50vh - …)` band math, `cqw` container-query fits; `mr-[20.1vw]`-form arbitrary values are legal but read worse than a named, commented class. |
| D3 | Dead names die | `prose`/`prose-lg`/`prose-sm` resolve to NOTHING (tailwind.config.js:33 `plugins: []`, no typography plugin in package.json; no `.prose` rule anywhere in site css). Removed in Phase 1 after a fresh resolved-styles re-check; the pages' own styles carry the look. NOT replaced by installing the plugin. |
| D4 | The shared landing layer | Names itself `landing-*` (the landing page is the block; landing.css is its class layer): `ln-flow` → `landing-flow`, `ln-head` → landing section's own placement (`landing-now__head`/`landing-past__head` — the scoping rule splits), the shared reveal flag `ln-in` splits to per-block modifiers (`landing-now--in`, `landing-past--in`), keyframes follow their sheet: `gl-grow` → `landing-grow`, `gl-marquee-drop` → `landing-marquee-drop`. |
| D5 | Section roots rename | Full component kebab names: `landing-tech` → `landing-technologies`; `ab-nav` → `landing-panel__nav`. ids (#about/#now/#past/#technologies) are NOT class names — unchanged. Every cross-reference updates in the same phase (landing.css scoping, the panel's `:has(~ …)`, `.ln-head` placements). |
| D6 | Components' own classes | GrowHead: `grow-head-in` → `grow-head__in`, `grow-on` → `grow-head--on`. GlyphPair's interpolated `gl-${copy}` (GlyphPair.tsx:26) = a LOGIC edit inside its phase (it builds names in code — same mapping, hand-applied). StickyHeader's four name-spans (stky-asenoth/elie/finer/gaspar) — check for interpolation during the phase; same rule if interpolated. |
| D7 | The `.panel` look-layer | DEFERRED to Phase 6 (vetoable): index.css:88-144, 5+ consumers, genuinely cross-cutting. Options at the call: an honest named shared look-layer (`site-panel`, documented) vs BEM duplication per consumer (against the factor rule at this count). The `panel-hover`/focus-visible pairs ride it. |
| D8 | LandingAbout's label edit | Eliot's uncommitted content edit (the label line, kept verbatim incl. its own spelling — "chracters" flagged to him) stays HIS until he commits; Phase 5 gates on that file settling. All class reverts in it are DONE (Phase 0). |

## Protected boundaries (HARD)

- glaphicUI repo: touch NOTHING (read-only). The library asks (marquee reverse, ascii frameless, wipe caption pad, the grow component) live in the 10:51 census doc — not this plan.
- The shadow boundary: token/part/slot/`:host`/state-attribute names unchanged by any phase.
- `src/data/*`: no class names; untouched all plan.
- `vite.config.ts`, `tailwind.config.js` (content list stays; NO plugin additions — D3), `index.html`: diff-free vs HEAD after every phase.
- Component exports, file names, route table (app.tsx's routes), ids, and the panel→later-sibling-band DOM relationship stay — the `:has` selectors rename together with the classes they reference, preserving the relationships exactly.
- Nothing commits except a phase's tick (D8's label edit is Eliot's, never swept into a phase commit).

---

## Phase 0 — the release (DONE this turn)

- [x] `LandingAbout.tsx`: Eliot's non-label edits reverted (ab-code-rows/ab-row-a/ab-row-b restored to HEAD; `lg:col-span-2` on the burst widget removed; the SECOND grid-cols-6 row restored to ab-row-b).
- [x] Diff confirmed label-only: `label="simple chracters: a ship fires a laser, destroying an asteroid."` is the sole dirty line in the repo (plus the plan/research docs).
- [x] `npx tsc --noEmit` clean + `npm run build` ✓ 1.68s + prerender wrote dist/index.html.

## Phase 1 — the dead sweep (prose)

- [x] **Fresh re-check of D3's claim on the working tree:** `grep "\.prose"` over all site css + the three pages + tailwind config/package.json → **zero `.prose` rules in existence** (index.css has none; tailwind.config.js:33 `plugins: []`; package.json 0 typography hits). The names resolve to nothing — removal is safe.
- [x] **The names removed (3 class strings, 6 name-tokens):** About.tsx:6 `prose prose-lg max-w-none text-theme font-body` → `max-w-none text-theme font-body`; Blog.tsx:38 `text-theme prose prose-sm max-w-none` → `text-theme max-w-none`; BlogPost.tsx:50 `prose prose-lg max-w-none text-theme blog-content` → `max-w-none text-theme blog-content` (the plan's census said "8 uses" — the fresh count is 6 name-tokens on 3 elements; the fresh count is the record).
- [x] **Verify: tsc clean; build ✓ 1.70s + prerender wrote; 6/6 loads (about/blog/blog-1 × 1440×900 + 390×844) at 0 console errors / 0 pageerrors; scrollWidth == clientWidth on all six; BEFORE/AFTER pixel-diff: 0 pixels differing on every pair.**
- [x] Commit (`css-standards: phase 1 — the dead prose names out`).

>> **Run record — Phase 1**
>> Driver: /tmp/nfNR1-driver.mjs (`before`/`after`/`diff`/`probe` modes); shots /tmp/nfNR1-{before,after}-<route>-<w>.png; diff runs IN THE BROWSER (two PNGs → canvases → per-pixel compare; no PIL in the environment).
>> **Harness lesson (recorded for every later phase):** the site's real URL form is `http://localhost:4178/?nowipe#/<route>` — hash routing + vite's RELATIVE asset base (`./assets/…`) means path-form loads (`/blog/1`) mix the prerendered snapshot with 404'd modules and read as a fake hero-class overflow (probe artifact: `div.hf-copy w=1674` etc. was the LANDING's prerendered markup under a path URL). All later drivers use the hash form; the path-form shots were purged and re-taken.
>> No holds added: the overflow/404 readings above were driver artifacts, not site findings (hash form: 6/6 clean).

## Phase 2 — legacy pages + chrome

- [x] **Correction recorded mid-phase:** DarkForest is OUT of every later phase by Eliot's order (11:23 "leave darkforest alone") — its `button`/`button-container`/`status`/`menu-container`/`dark-forest` names stay camp-C; the census's C3 list is unchanged for it. No capture taken; nothing touched (`src/games/dark-forest/DarkForestGame.tsx`, `src/pages/DarkForest.tsx` diff-free).
- [x] **Correction — the chat trio's block mapping:** the plan's chat-interface__* read was WRONG; the code's own anatomy comment (Chat.tsx:138-142) declares the page's classes PAGE-PRIVATE ("page-private classes live in the page's block; the component composes but prints no styles. Moved verbatim") — the block is the PAGE: `chat` (root) + `chat__*` across Chat.tsx + ChatInterface.tsx's JSX; ChatLog stays ITS OWN block (its classes + css live in its own sheet): `chat-log` root kept, `chat-log__plate`/`--user`/`--assistant`/`__dots`, keyframe `chat-log-dot-blink`.
- [x] StickyHeader renamed 1:1 with D1's grammar — `stky` → `sticky-header`, `stky-shrunk`/`stky-idle` → `--shrunk`/`--idle` (state modifiers), `stky-titleline` → `sticky-header__titleline`, the four name segments → `sticky-header__name` + `--elie/--asenoth/--gaspar/--finer` (variant modifiers; the four spans are STATIC strings — no interpolation). **Verification posture change, recorded:** StickyHeader + ThemeToggle paint on NO live route (app.tsx's isBareStage gate excludes every non-home route — mounted nowhere), and MenuDrawer mounts but is unopenable (its only opener is StickyHeader's button) — so their renames verify by string-consistency (grep = zero old names) + tsc/build, not pixels; the pixel-proof covers the visible surfaces only.
- [x] MenuDrawer: `menu-drawer__close-btn`.
- [x] Chat page + interface: root `chat`, `chat__head`, `chat__stem`/`--card`, `chat__card` (+ its scrollbar rules), `chat__compose`, `chat__form`, `chat__field` (+ focus + :empty::before), `chat__send` (+ hover/active/disabled), `chat__tab` (+ mobile flip), `chat__note`/`--warn`/`--disclaimer`; the one-screen gates `#main-content:has(.chat)` (×4 selectors, the `> .lf-band` part riding UNTOUCHED until the band's phase 3 rename).
- [x] ChatLog: as above (13 pairs incl. the keyframe + its two nth-child delays).
- [x] BlogPost + index.css: `blog-content` → `blog-post__content` (4 selectors in index.css:112-127 + the JSX token).
- [x] LavaLampBackground: `lava-lamp-background__fallback-blob` (css + JSX; the `lava-fallback-styles` ID is not a class — stays).
- [x] Verify: tsc clean; build ✓ + prerender wrote; 7/7 loads × the standing checks at 0 console errors / 0 pageerrors / scrollWidth == clientWidth; BEFORE/AFTER pixel-diff: **0 pixels on all seven pairs** (chat + blog-index + one post × 1440/390 + one scrolled post at 1440).
- [x] Commit (`css-standards: phase 2 — the chat, blog, header and lamp chrome on the naming law`).

>> **Run record — Phase 2**
>> Driver: /tmp/nfNR2-driver.mjs; steps = chat/post/blog bases at 1440+390 + one scrolled post (covers nothing renamed — kept as coverage; the drawer + open steps CUT: unopenable chrome, see above). The rename itself applied in one verified python batch (~70 exact pairs, count-asserted, abort-without-write semantics); a leaker bug (`fail` shared across files) silently skipped 4 files on the first pass — caught by the leftover grep (ChatInterface still had old names with no abort line); re-applied per-file with per-file fail flags. Lesson recorded: per-file failure isolation in every future batch.
>> **Harness lesson (standing):** the captures run under `reducedMotion: 'reduce'` (Playwright context option) — the lava lamp parks at its first pose (LavaLampBackground.tsx:464-469 `if (reduced) time = 0`), the dots/keyframes land rest-state, and back-to-back shots went 0-diff on a JS-animated route (proved pre-phase with /chat twice). The prior diff noise (131k px on /chat, ~1.4k on the post) was the lamp's rAF blobs — no rename delta at all under the corrected harness.
>> Holds: none new (the path-form/driver lessons carried from Phase 1).

>> **Run record — Phase 3**
>> Driver: /tmp/nfNR3-driver.mjs (before/after/diff as Phase 2's; the pair's pixel compare runs in-browser, no PIL). 22 steps: `/` fold+about-beats(2)+tech+end x1440/1024, about+tech+end x390; `/projects` menu-corner + page-end x1440/390; `/projects/1` + `/past/brooks_brothers` page-end x1440/390 (the detail sheets' `.site-footer__band--footer .site-footer__foot` 37.5vw shift rules live there); `/chat` page-end x1440 (its `> .site-footer__band` one-screen gate + the band-now pose).
>> **Harness lessons (recorded for every later phase):**
>> (1) THE `#//` BUG — a URL template `...?nowipe#/${'{'}route{'}'}` with route '/' yields hash `#//`: wouter matches NO route, the app's chrome mounts and the ROUTE renders nothing (body scrollHeight = viewport height, #about/#technologies missing, 0 console errors — a silently dead page). Drivers normalize the '/' entry before interping into the hash, or use the literal `#/`. This is what burned the prior 11:31 attempt's time (its dead-first-run + idprobe/resolver artifacts).
>> (2) FRESH CONTEXT PER STEP — one shared page across sequentially reloaded+scrolled steps drifts (bodySH 7298->7250->7191 across reloads; cause unpinned, unneeded): each step now opens its own context; fresh loads measured layout-stable (7298 constant over 6 reads, 2 loads; identical section tops) and the machine zone (about b2) diffed 0 pixels against a shot taken ~30min apart on the same pre-phase state — capture determinism proven, not assumed.
>> (3) Anchor fall-through sent hero steps to about-top; anchor 0 now means y=0 explicitly.
>> **Beyond-the-plan touchpoints (the one-name-one-rename sweep found them):** Chat.tsx's `> .lf-band` one-screen part; ProjectDetail/PastDetail's REAL `.lf-band-footer .lf-foot` shift rules + their `.grow-head-in` exit/reverse + reduce selectors (the CLASS side retargets ride phase 3 with the class rename; the `gl-grow` KEYFRAME does NOT rename yet — phase 4 owns it with every consumer, one name one rename); comment fragments naming `.lf-band`/`.grow-head-in`/`.lf-menu` in LandingAbout.tsx (2 lines), index.css (1), Landing.tsx (1), ProjectDetail (2), PastDetail (1). **LandingAbout.tsx was touched for those 2 comment lines ONLY — Eliot's label edit rides uncommitted beside them and the FILE stays OUT of this commit (D8).**
>> **Decisions flagged as veto points:** `lf-foot-in` sits ON the band root (landing.css's own comment: "which sits on the band root, so it reads as a modifier of the same element") -> named `site-footer__band--foot-in` per D1 (the plan's shorthand wrote `__foot--in`); `lf-fade` split per-node (`site-footer__legal--fade` / `site-footer__social--fade`); bare `near` -> `site-footer__learn-more--near`; the band's two keyframes follow their sheet -> `site-footer-fade-in` / `site-footer-menu-in`. The `--lf-x` / `--lf-fold-in` / `--lf-si` / `--gl-w` custom properties are NOT class names — untouched. GlyphPair's own-block keyframes `gl-slide-l/r` -> `glyph-pair-slide-l/r` (single-site, its own sheet).
>> **Hole caught by the standing sweep:** the batch's final list omitted landing.css's grow-head needles (the dry run passed vacuously — nothing was checked) — the post-write grep caught the `.grow-head-in` leftovers and they were fixed out-of-batch. Lesson: the SAFETY sweep is load-bearing; every batch run ends with it regardless of the batch's own report.
>> Verify totals: tsc clean; build 1.60s + prerender wrote; 22/22 loads at 0 console errors / 0 pageerrors / scrollWidth == clientWidth; DIFF 22 x `pixels differing: 0`.

## Phase 3 — the shared band + glyphs

**Files:** `src/components/SiteFooter.tsx`, `landing.css` (its lf-* half), `src/app.tsx` (lf-sr), `src/components/GlyphPair.tsx`, `GrowHead.tsx` (+ landing.css's grow-head half), `src/components/LandingHero.tsx` (lf-hero-legal only).

- [x] SiteFooter: `lf-*` (17 static + interpolated: `lf-band-journey`/`footer`/`now`, `lf-foot-in`, `lf-fade`, the bare `near`) → `site-footer__*` / `site-footer__band--journey` / `--footer` / `site-footer__band--now` / `__foot--in` etc. per D1; landing.css's `.lf-*` selectors retarget in the same phase; app.tsx's `lf-sr` → `site-footer__sr`.
- [x] The panel's `:has(~ .lf-band …)` (LandingPanel.tsx:330) — updates WITH the band rename in ONE edit (the boundary rule: relationships rename together).
- [x] GlyphPair: `gl-pair`/`gl-glyph`/`gl-band` → `glyph-pair__*`; the `gl-${copy}` interpolation (GlyphPair.tsx:26) re-mapped in code (`glyph-pair__glyph ${copy}`-form per D6; read its css first — the gl-* rules live in the component's own block or index.css: retarget there).
- [x] GrowHead (D6): `grow-head-in` → `grow-head__in`, `grow-on` → `grow-head--on`; landing.css's grow-head + grow keyframes section retargets; the reduce 1ms rule follows.
- [x] LandingHero's `lf-hero-legal` → `landing-hero__legal` (the hero's own placement class named under the band's prefix today — the hero renders its OWN legal; hero's block wins).
- [x] Verify: tsc + build + 0 errors; before/after screenshots: `/` at 1440/1024/390 (the band shows everywhere; the hero's legal + glyph pair + grow heads live on it) plus one non-landing route (`/projects`, `/chat`) for the band's footer pose — pixel-identical REQUIRED (3 widths on `/`).
- [x] Tick, commit (`css-standards: phase 3 — the band, glyphs and shared grow on the naming law`), STOP.

## Phase 4 — the landing sections

**Files:** `landing.css` (the rest), `src/components/LandingHero.tsx`, `LandingPanel.tsx`, `LandingNow.tsx`, `LandingPast.tsx`, `LandingTechnologies.tsx`, `src/pages/ProjectDetail.tsx` + `PastDetail.tsx` + `Projects.tsx` (the keyframe consumers only — D4's one-name-one-rename rule).

- [ ] landing.css: `ln-flow` → `landing-flow` (both sections + any other consumer), the head-slot rule splits per D4 (`landing-now__head` / `landing-past__head`), the marquee/ride/out selectors retarget; keyframes (`landing-grow`, `landing-marquee-drop`) + every consumer of those names (Projects/PastDetail/ProjectDetail sheets reference `gl-grow`! — their retargets ride HERE in the same phase as the keyframe rename: one name, one rename, all sites).
- [ ] LandingHero: `hf-*` (10) → `landing-hero__*`.
- [ ] LandingPanel: `ab-nav` → `landing-panel__nav`; the `:has` selectors updated per boundary rule; the five-link NAV/fan internals (JSX + landing.css's panel section if any) stay keyed by the renamed classes.
- [ ] LandingNow: `ln-*` (15) → `landing-now__*`; `ln-in` → `landing-now--in` (D4's split); the past's band shares `.ln-in`? — LandingPast's `.landing-past.ln-in .lp-bands` gate retargets to `landing-past--in` HERE (same file set as the flag's split — one edit each).
- [ ] LandingPast: `lp-*` (13) → `landing-past__*` (incl. `landing-past__band-name` from `lp-band-name`, D1's nesting rule).
- [ ] LandingTechnologies: `lt-*` (7) → `landing-technologies__*` + root `landing-tech` → `landing-technologies` (D5); `chip-icon` → `landing-technologies__chip-icon`; landing.css's `.landing-tech` scoping retargets.
- [ ] Verify: tsc + build + 0 errors; before/after screenshots `/` at 1440/1024/390 + a scroll-through capture set (the sections' reveals + the panel's fan: real trusted scroll steps with holds — the established --ab-p probe pattern); scrollWidth==clientWidth all stops; ANY visual delta = missed selector — fix, re-shoot, re-verify.
- [ ] Tick, commit (`css-standards: phase 4 — the landing sections on the naming law`), STOP.

## Phase 5 — about

**Files:** `src/components/LandingAbout.tsx` — **gates:** the label edit settled (D8) + Eliot release.

- [ ] `ab-*` (24) → `landing-about__*`; the band states (`.ab-band.ab-on` ×3, `.ab-on .ab-band1-mid` etc.) → `landing-about__band--on` form (D1); `ab-flash`'s delay var chain untouched (custom properties are not class names); `grow-head`/`ab-code-head` placements follow D6's GrowHead + the block mapping; the section root `landing-about` stays.
- [ ] The css retargets (the component's own style block; landing.css untouched-by-this-phase unless a rule names an ab-* class — sweep-checked).
- [ ] Verify: tsc + build + 0 errors; before/after `/` at 1440/1024/390 + the about scrolls (the ASCII machines' imperative frames idiom is NOT a class concern — untouched); pixel-identical REQUIRED.
- [ ] Tick, commit (`css-standards: phase 5 — the about section on the naming law`), STOP.

## Phase 6 — close-out

- [ ] **D7's veto call:** `.panel`/`.panel-hover` — the named shared look-layer (`site-panel` + documentation) vs per-component BEM. Eliot decides; the execution edits index.css + the 5+ consumers in one pass.
- [ ] Full route matrix re-run (all 11 routes × the standing verification) + the 3-width `/` matrix one more time end-to-end; the settled-numbers/holds ledger appended here (>> run-record blocks).
- [ ] The state-grammar + drift greps return EMPTY (no bare-word states, no cross-block prefix reuse, zero `__`-less component css names) — the census doc's camp lists marked all-clear.
- [ ] Close-out commit + the plan marked done; Eliot-side pends listed open (D8's label if still uncommitted; the panel call if deferred; the library asks unchanged).