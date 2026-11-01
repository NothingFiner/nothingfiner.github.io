// New-design landing section two — the About rebuilt as Eliot's three
// bands (the 2026-10-30 revamp brief; the Figma-mock era's story rows
// and its old reading retired), amended in place by feedback round A
// (2026-10-30 ~16:57, F1-F11), feedback round B (2026-10-30 ~17:32,
// B1-B6) and iteration C (2026-10-30 ~17:59, C1-C9):
//   band 1  a TICKER above the ~490px portrait seat — the headline
//           "Trained Poet; Experienced Developer" keeps its shadow-less
//           read (F6) but "Trained Poet;" now paints the FLURO GREEN
//           (B3) while the second phrase keeps its one-shot crimson
//           flash, with no column reserve from the art (F4: the head's
//           track ends at the art's left edge, and a line may stride
//           across it) — and the ASCII-portraits cycler right, still
//           CONSUMER-STYLEd: ink glyphs straight on the page's hatch,
//           no surface/border/blend (F1's per-instance part overrides —
//           the widgets' library plates are left untouched), sized 2×
//           (F2) and holding each frame twice as long (F3) — then a
//           second TICKER whose track runs the OPPOSITE direction; the
//           whole band leads the section with a spacer that seats
//           band-1 at the viewport's middle exactly when the sidebar
//           parks (F5, re-verified after the B6 retune)
//   band 2  "I've been Coding." in the grow header treatment (B2),
//           RIGHT-JUSTIFIED for round C (C2: the ladder prints against
//           the strip's right edge); the two widget rows are BOTH
//           LEFT-ANCHORED start-aligned pairs (C3 — round B's mirror
//           yields): panel·text / panel·text, each row's cursored line
//           top-aligned against its panel's top edge; the beside-lines
//           run at HALF their round-B size (C4: ~20px at 1440 via
//           --ab-copy-type), and row 2's line types only AFTER row 1's
//           print completes (C6's chained delay: row-1's pace end + a
//           beat); the widgets reserve FULL-HEIGHT seats from first
//           paint and shed the library's drop/shadow ladder
//           per-instance (C5: fluro surface + border stay; the
//           portrait keeps its isolated ink/no-plate look)
//   band 3  a third TICKER + "My professional Journey." grow-head + the
//           seven-node journey timeline, then the chamfered fluro
//           plate — it still floats ~8vw inside the strip (B1) and its
//           copy now hugs the field at 16px (C8); band 3's internals
//           breathe on measured separations (C7: marquee→title 15vh ·
//           title→timeline 5vh · timeline→plate 10vh), and the plate
//           exhales 15vh to the next section over the 37.5vh tail
//           reservation (C9)
// Band 1's riders — the two marquees, the headline print, the portrait
// cycler — arrive in LOCKSTEP on the band's single fire (C1: the mid
// row shares the marquees' held pose and drop; no per-rider delays).
// Every band's animations trigger only when THAT band enters the
// viewport — one latched IntersectionObserver watching all three band
// wrappers, each latching its own flag (F11; the section's own .landing-about--in
// latch and the rideOutUp stay). Bands breathe 12vh apart (B6, up from
// round A's 6vh).
// The portraits are REAL art: thirty text frames dropped into
// public/assets/ascii-portraits/ by Eliot — every frame exactly 49 lines
// x 90 columns, numbering skipping 4 and 9. The frames fetch at runtime
// and set on the element's ref only when ALL resolve AND band 1 has
// fired (the cycle is a band-gated animation); array properties can't
// carry to Lit from JSX attributes (the marquee precedent).
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';
import { rideOutUp, TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A'; // dark brand crimson — the flash + the ticker inks
const FLURO = '#14F1C8'; // the site's fluro green — B3's band-1 lead phrase

/* the portraits' frame numbers in NUMERIC order: the export's own gaps at
   4 and 9 (no files) — a lexicographic sort would strand 10..32 after 5..8
   differently than the film counts, so the order is written out as numbers */
const PORTRAIT_NUMBERS = [
  1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
];

/* the widgets' frame content (multi-line ASCII, real newlines): what the
   shell/burst cycle shows — data, not machinery */
const FRAMES = [
  " o\n\n   \n    ^  ",
  "  o\n\n   |\n   ^   ",
  "   o\n   |\n   |\n   ^   ",
  "   *\n   |\n\n  ^    ",
  "   \n   \n\n ^     ",
  " \n  ·:·\n   \n\n  ^    ",
  "   \n ·:˙:·\n   ˙\n\n   ^   ",
  "   \n ·:˙:·\n   ˙\n\n    ^  ",
  " . · .\n˙·   ·˙ \n   ˙\n\n     ^"
];

/* RESTORED for band 2's second instance (F8) — the job ticker the first
   About rebuild retired with the old story rows: 2012 NYC types out,
   glitches, prints C0DE, then dissolves through job codes into a wall of
   currency. It told exactly this story, so it is back to tell the new
   line ("Since then things have gotten serious.") — verbatim from the
   pre-rebuild file (git e9525d8), nothing re-authored. */
const JOB_FRAMES = [
 "█\n\n       \n\n",
 "2█\n\n       \n\n",
 "20█\n\n       \n\n",
 "201█\n\n       \n\n",
 "2012█\n\n       \n\n",
 "2012\n█\n       \n\n",
 "2012\nN█\n       \n\n",
 "2012\nNY█\n       \n\n",
 "2012\nNYC█\n       \n\n",
 "2012\nNYC \n       \n\n",
 "2X12\nNYB \n       \n\n",
 "2X0*\nN8B \n       \n\n",
 "2█0*\nC8█3 \n       \n\n",
 "201█\nC█D3\n       \n\n",
 "2013\nC0D3 \n       \n$  $\n",
 "2013\nCoDE \n       \n$$ $$ $\n$  $",
 "2013\nC0DE \n       \n$$ $$ $\n$ $$ $$",
 "2$1$ $$\nC0DE \n       \n$$ $$ $\n$ $$ $",
 "$$1$ $\nC$$$  $\n $   $ \n$$$$$$$\n$$$$ $$",
 "$$1$$$$\nJ$$$$$$\n $ $ $ \n$$$$$$$\n$$$$$$$",
 "$█$$$$$\n$$$$$$$\n$$$$$$$\n$$$$$$$\n$$$$$$$",
 "$██$$$$\n$$$$$$$\n$$$$$$$\n$$$$$$$\n$$$$$$$",
 "$███$$$\n$$$$$$$\n$$$$$$$\n$   $  \n$$$$$$$",
 "$████$$\n$$$$$$$\n$$$$$$$\n       \n$  $",
 "$2███$$\n$$$$$$$\n$$$$$$$\n       \n$  $",
 "$20██$$\n$$$$$$$\n$$$$$$$\n       \n  ",
 " 201█\n$J$$$$$\n$$$$$$$\n       \n  ",
 " 201█\n$JX$$  \n$$$$$$$\n       \n  ",
 " 201█\n J08\n$$$$$$ \n       \n  ",
 " 2014\n JOb\n$ $$$$ \n       \n  ",
 " 2014\n J0B\n\n\n"
]

/* the journey's nodes (Eliot's copy): each node's readout splits the
   two parts — the year/period, then what happened — so the strip reads
   year-line over label-line. 'NOW ???' is the terminal readout node:
   printed last, plain text, no affordance (none was briefed). */
const JOURNEY: ReadonlyArray<{ readonly year: string; readonly label: string }> = [
  { year: '2012', label: 'NYC' },
  { year: 'SPRING 2013', label: 'Design Intern @ DreamIt' },
  { year: 'FALL 2013', label: 'RoR Contractor' },
  { year: 'SUMMER 2014', label: 'First Full-Time Role' },
  { year: 'WINTER 2016', label: 'AppAcademy' },
  { year: 'SUMMER 2017', label: 'AGENCY' },
  { year: 'NOW', label: '???' },
];

/* the timeline's print ladder: 160ms per node — fast enough all seven
   settle inside ~1s of the reveal, slow enough the left-to-right print
   reads as a sequence rather than one simultaneous fade */
const NODE_STEP_MS = 160;
/* the .landing-about__fade transition's own tail — part of the plate's chain count */
const FADE_TAIL_MS = 700;
/* the one print-to-print beat — the pause between a finished print and
   the next arrival; the plate's chain and row 2's chain (C6) share it */
const PRINT_BEAT_MS = 240;
/* the plate arrives AFTER the ladder settles: the last node's own moment
   + its fade's tail + the beat — the story reads to its end, then the
   plate */
const PLATE_DELAY_MS = (JOURNEY.length - 1) * NODE_STEP_MS + FADE_TAIL_MS + PRINT_BEAT_MS;

/* band 2's typed beside-lines (B2): the hero's lead's own pacing —
   28ms/char, the body-copy pace the hero's typed lead types at; the
   scripts are PRE-BROKEN with hard breaks (the element's .row is
   pre-wrap) so the desktop never re-flows mid-print — every line box
   holds its place; the cursor-ink knob carries each line's ink */
const COPY_CHAR_MS = 28;
const ASTEROID_SCRIPT = 'It started with cloning asteroids\non my middle school graphic calculator.';
const SERIOUS_SCRIPT = 'Since then things have gotten serious.';
/* C6, the chain: row 2's typing WAITS for row 1 — its delay is row-1's
   pace end (the script's own char count at the shared pace) + the beat;
   the armed flag flips once, in a timer the band-2 effect cleans up */
const ROW2_DELAY_MS = ASTEROID_SCRIPT.length * COPY_CHAR_MS + PRINT_BEAT_MS;

export function LandingAbout() {
  // the section's own arrival latch (stays per F11's contract) — the
  // per-band flags below now own every animation's gate
  const [inView, setInView] = useState(false);
  // the three bands' latched reveals (F11): each flips once, in its own
  // observer entry, and never again
  const [in1, setIn1] = useState(false);
  const [in2, setIn2] = useState(false);
  const [in3, setIn3] = useState(false);
  // C6: row 2's line arms only after row 1's print settles — ' ' until
  // the flag lands (see the chain effect below the widgets' frames)
  const [rowBTypes, setRowBTypes] = useState(false);
  // the portraits' resolved art (null until every fetch lands) — the set
  // onto the element waits for BOTH this and band 1's fire
  const [portraitFrames, setPortraitFrames] = useState<string[] | null>(null);
  // three ticker instances (band 1 top, band 1's reversed runner, band
  // 3) — all one voice, each needing its own ref for the imperative set
  const marqueeLeadRef = useRef<HTMLElement | null>(null);
  const marqueeRevRef = useRef<HTMLElement | null>(null);
  const marqueeTailRef = useRef<HTMLElement | null>(null);
  const portraitsRef = useRef<HTMLElement | null>(null);
  const burstRef = useRef<HTMLElement | null>(null);
  const jobRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  // the bands are the observer targets AND the spacing spines (F10/F11)
  const band1Ref = useRef<HTMLDivElement | null>(null);
  const band2Ref = useRef<HTMLDivElement | null>(null);
  const band3Ref = useRef<HTMLDivElement | null>(null);
  // the content's ride-out: as the section leaves the viewport its
  // content translates up with the scroll (the next section's arrival
  // reads as the previous one leaving up), reversing on the way back
  const flowRef = useRef<HTMLDivElement | null>(null);

  // the marquee takes array properties, which JSX attributes can't carry
  // reliably to Lit — set them imperatively once (all three instances
  // ride the same TICKER at the section's speed)
  useEffect(() => {
    const marquees = [marqueeLeadRef, marqueeRevRef, marqueeTailRef];
    for (const ref of marquees) {
      const el = ref.current as unknown as { strings: string[]; speed: number } | null;
      if (!el) return;
      el.strings = TICKER;
      el.speed = 26;
    }
  }, []);

  // the portraits' load: 30 runtime fetches from public/assets; the slot
  // stays empty (no frames set) until every one of them resolves AND the
  // band has fired — a half-set cycle would print torn frames, and a
  // caught failure is logged with its URL rather than silently skipped.
  // The array property set once both facts hold — never as JSX
  // attributes. Async outliving the render must cancel: the alive flag +
  // an AbortController stop ghost writes after teardown.
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const load = async () => {
      const frames = await Promise.all(
        PORTRAIT_NUMBERS.map(async (n) => {
          // the art's names carry spaces + parens — URL-encode every one;
          // document-relative paths ride the site's './'-base deploy (hash
          // routing never changes the page's pathname)
          const url = `./assets/ascii-portraits/${encodeURIComponent(`ascii-art (${n}).txt`)}`;
          try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return await res.text();
          } catch (err) {
            console.error(`[LandingAbout] the portraits' fetch failed for ${url} (frame order ${n}): ${err}`);
            return null;
          }
        }),
      );
      if (!alive) return;
      // a miss leaves the slot empty; the error logged above — the every-
      // predicate narrows the nulls into real strings without a cast
      if (frames.every((f): f is string => f !== null)) setPortraitFrames(frames);
    };
    void load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  // the portraits' cycle is band 1's animation (F11): the frames land on
  // the element only once the band's own reveal fired AND the art
  // resolved — the cycle starts with the band, not at page mount. The
  // empty-length read makes the write idempotent (the property never
  // re-sets and the cycle never restarts mid-view).
  useEffect(() => {
    const el = portraitsRef.current as unknown as { frames: string[] } | null;
    if (in1 && portraitFrames && el && el.frames.length === 0) el.frames = portraitFrames;
  }, [in1, portraitFrames]);

  // the ascii widgets take their FRAMES arrays (content staying with the
  // page) — array properties too, so they set imperatively — and their
  // cycles are band 2's animations (F11): nothing cycles until band 2's
  // own reveal fires. widget-1 = the asteroid shell; widget-2 = the
  // restored JOB_FRAMES (the 2012→C0DE→jobs ticker IS the serious line)
  useEffect(() => {
    if (!in2) return;
    const burst = burstRef.current as unknown as { frames: string[] } | null;
    const job = jobRef.current as unknown as { frames: string[] } | null;
    if (burst && burst.frames.length === 0) burst.frames = FRAMES;
    if (job && job.frames.length === 0) job.frames = JOB_FRAMES;
  }, [in2]);

  // C6: row 2's line arms AFTER row 1's print settles — the flag flips
  // once at the chain's delay (ROW2_DELAY_MS); the timer's cleanup
  // cancels it on teardown; the second line's cursor-type mounts
  // silent (' ') and re-types-on-change when the flag lands
  useEffect(() => {
    if (!in2) return;
    const timer = setTimeout(() => setRowBTypes(true), ROW2_DELAY_MS);
    return () => clearTimeout(timer);
  }, [in2]);

  // the ride-out wiring
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // the section's own latched arrival latch (kept per F11) — with the
  // F5 leading spacer its -64% line now crosses the spacer, so it fires
  // a little ahead of band 1's own gate; the bands' flags below do the
  // animation gating
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      /* the LATCHED idiom: this one means once — the disconnect in the
         callback is its whole point (sticky reveal). The -64% band is
         the site's section-arrival gate: the observed top must reach the
         viewport's upper 36%; earlier gates failed in opposite
         directions (the plain 25% threshold fired ~550px deep, the
         -30% lower-third margin played the build in the screen's
         bottom sliver). The BANDS' gates carry the same band below */
      { rootMargin: '0px 0px -64% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  // the bands' latched reveals (F11): all the animations keyed above
  // wait for their OWN wrapper's entry. One observer watches all three
  // wrappers through the same -64% band (each fires as its TOP clears
  // the viewport's upper 36% — band 1's fire lands just before the
  // sidebar's park, the F5 pairing), latching each band's flag once and
  // disconnecting entirely only when all three have fired.
  useEffect(() => {
    const bands = [
      [band1Ref, setIn1],
      [band2Ref, setIn2],
      [band3Ref, setIn3],
    ] as const;
    const latched = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || latched.has(entry.target)) continue;
        latched.add(entry.target);
        for (const [ref, set] of bands) {
          if (ref.current === entry.target) set(true);
        }
        // all three seen → the observer's job is done (the per-band
        // latch's shared hang-up)
        if (latched.size === bands.length) io.disconnect();
      }
    }, { rootMargin: '0px 0px -64% 0px' });
    for (const [ref] of bands) {
      const el = ref.current;
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={hostRef}
      class={`landing-about ${inView ? 'landing-about--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-about {
          position: relative;
          /* natural height — the sections don't force single screens; the
             tail keeps the sticky band's resting slot (its last 37.5vh)
             clear of the plate */
          height: auto;
          /* F5, the leading spacer: band-1 seats MID-viewport the exact
             moment the sidebar parks (--ab-p hits 1 when this section's
             top reaches 0) — the spacer holds half of band-1 (the two
             48px ticker bands + the seat) above and below the 50vh line
             at that scroll point */
          padding-top: calc(50vh - (var(--ab-band1-mid) + 2 * var(--ab-marquee-h)) / 2);
          /* the tail's 37.5vh + C9's exhale: the plate clears the next
             section's head ~15vh over the band's resting slot */
          padding-bottom: calc(37.5vh + var(--ab-bottom-gap));
          overflow: hidden;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          /* F2, the portrait's seat ≈ 2×: the mid row's height — and the
             art's own box follows it exactly (the frame's borders are
             retired on this instance, so the 49-type-line column fills
             the seat with no border accounting); everything under this
             var (the art's font-size, line-height, height) follows it */
          --ab-band1-mid: 490px;
          /* the ticker bands' own height (the seat math above counts it) */
          --ab-marquee-h: 48px;
          /* B6, the bands' breathing: round A's +6vh felt tight — the
             section breathes at 12vh between every band (the band
             wrappers' leading margins) */
          --ab-band-gap: 12vh;
          /* C4, the beside-lines at HALF their round-B size: the round-B
             body clamp bisected (22/2.8vw/40 → 11/1.4vw/20) — ~20px at
             1440; the floor holds the smallest width's read */
          --ab-copy-type: clamp(11px, 1.4vw, 20px);
          /* C5, the widgets' reserved seats: full height from FIRST
             paint — the pair's frames' tallest run is 5 lines at the
             library's 1.3 line-height, and the border-box seat counts
             the library's 2px border pair, so the boxes hold before,
             during and after the type */
          --ab-widget-seat: calc(6.5 * var(--ab-code-ascii-type) + 4px);
          /* C7, band 3's measured separations: marquee→title ·
             title→timeline · timeline→plate */
          --ab-b3-gap-head: 15vh;
          --ab-b3-gap-rail: 5vh;
          --ab-b3-gap-plate: 10vh;
          /* C9, the exhale after the plate: the about's bottom gap in
             ADDITION to the 37.5vh tail reservation */
          --ab-bottom-gap: 15vh;
          /* band 1's crimson flash: one-shot ~1.2s after the band's own
             reveal — the band's drop (0.7s) has settled and a beat
             passes, so the crimson lands as a second, deliberate mark
             on the finished plain-ink headline */
          --ab-flash-delay: 1.2s;
          /* F8, the widget pair's print size: 32px ≈ two-thirds of the
             library's 48px default — the pair reads junior to the
             headline while staying legible on the mono grid */
          --ab-code-ascii-type: 32px;
          /* C8, the plate's hug: 16px on every side (the round-B
             8vh/8vw breath retires) */
          --ab-plate-pad: 16px;
          /* F3, the portrait's slower cycle: the frame hold doubles —
             31 steps (30 frames + 2 hold steps) at 0.4s ≈ 12.8s/loop */
          --ab-ascii-step: 0.4s;
          /* B1: the plate's float inset — ~8vw measured off the strip's
             inner edges BOTH sides (the 3.9vw flow padding and the
             20.1vw panel standoff below convert it in place) */
          --ab-plate-float: 8vw;
          /* B5: the asteroid line's opening tab — 3ch, the round-B
             default */
          --ab-copy-indent: 3ch;
        }
        .landing-about * { margin: 0; box-sizing: border-box; }

        /* the bands: one flow box each (the observer targets + the
           spacing spines); bands 2 and 3 lead with the F10 gap — band 1
           leads with the section's F5 spacer instead */
        .landing-about__band { grid-column: 1 / -1; }
        .landing-about__band2, .landing-about__band3 { margin-top: var(--ab-band-gap); }

        /* ── reveal ─────────────────────────────────────────────── */
        /* the fades + drops + flash key off each band's own landing-about__band--on flag
           (F11): the section's .landing-about--in latch no longer fires these */
        .landing-about__fade { opacity: 0; }
        .landing-about__band--on .landing-about__fade {
          opacity: 1;
          transition: opacity 0.7s ease-out;
          transition-delay: var(--ab-d, 0s);
        }
        /* reduced motion: the content is content, not the show — show it
           immediately (the marquee's own reduce overrides sit below the
           drop rule, where they win the cascade) */
        @media (prefers-reduced-motion: reduce) {
          .landing-about__band .landing-about__fade { opacity: 1; transition: none; }
          .landing-about__band .landing-about__flash { transition: none; }
        }

        /* the nav tool panel is LandingPanel now (a component alongside
           this one) — a fixed column covering every landing stretch beyond
           the first fold; the sticky footer band's CSS (.site-footer__band) pairs
           with it ── */

        /* ── the full-bleed ticker band (three instances, one voice) ──
           the band is a FLOW ROW, FULL BLEED AT BOTH EDGES (Eliot: it
           extends to the page's edge so the read stays good as the
           crimson sidebar slides over it — the marquee runs the full
           viewport, the panel riding on top of its right end as it
           arrives). In-band the marquee leads at zero (the band's own
           wrapper owns the spacing); on the band's reveal each band
           rides down into place (no fade): held up off the section's
           top by the base transform, the shared landing-marquee-drop drops
           them in together */
        .landing-about__marquee {
          margin-inline: -3.9vw -3.9vw;
          height: var(--ab-marquee-h);
          z-index: 2;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the COMPONENT'S — no overlays */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
          transform: translateY(-22vh);
        }
        /* the print-in: the band drops whole — the mid row's riders ride
           the same beat with the marquees (C1) */
        .landing-about__band--on .landing-about__marquee,
        .landing-about__band--on .landing-about__band1-mid {
          animation: landing-marquee-drop 0.7s cubic-bezier(0.25, 1, 0.4, 1) both;
        }
        /* reduced motion: no drop — the band seats instantly (the base
           transform must clear too; animation:none alone leaves it parked
           at its -22vh hold, clipped off the section's top). These sit
           AFTER the drop rule so they win the cascade */
        @media (prefers-reduced-motion: reduce) {
          .landing-about .landing-about__marquee { transform: none; }
          .landing-about__band--on .landing-about__marquee { animation: none; }
          .landing-about .landing-about__band1-mid { transform: none; }
          .landing-about__band--on .landing-about__band1-mid { animation: none; }
        }

        /* band 1's sandwich reads TIGHT: the middle row hugs the leader
           band above it, and the reversed runner hugs the row below (the
           wrapper owns every other gap) */
        /* ── band 1's middle row: headline left, portraits right ─────
           full non-sidebar width via the strip grammar (flush left, flush
           AT the parked panel's edge — the phase-1 bands' settled read);
           the headline keeps the flow's gutter inside */
        /* C1: the headline's print and the cycle's seat hold the
           marquees' drop pose — band 1's riders (the two marquees, this
           row's contents) arrive as ONE piece on the band's single fire,
           no per-rider delay differences */
        .landing-about__band1-mid {
          transform: translateY(-22vh);
          margin-inline: -3.9vw 20.1vw;
          padding-left: 3.9vw;
          /* the small inset right: the portrait keeps its own breath off
             the parked panel's edge instead of painting over it */
          padding-right: 2.2vw;
          height: var(--ab-band1-mid);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          /* F4, NO column reserve: the head's track ends AT the art's
             left edge — a headline line longer than its track paints
             across the art's left edge ("Developer" may overlap the
             image at the edge); the capture + the driver's edge pair
             gate what actually happens at these metrics */
          column-gap: 0;
          align-items: center;
        }
        /* the headline: shadow-less still (F6 — the shared .grow-head
           class here carries only the type voice; no .grow-head__in
           mount, so the grow shadow ladder never plays on this h2).
           B3 paints the lead phrase fluro green; the one-shot crimson
           flash span stays the headline's only animation */
        .landing-about__band1-head {
          min-width: 0;
          /* the overlapping word reads whole: its ink sits over the
             art's glyphs at the edge */
          position: relative;
          z-index: 1;
        }
        .landing-about__phrase { color: ${FLURO}; }
        .landing-about__flash {
          /* starts at the headline's own plain ink; when band 1 latches,
             the transition's delay holds the flip ~1.2s — the band's own
             class makes it ONE-SHOT by construction (the flag never
             leaves again) */
          color: ${INK};
          transition: color 0.25s ease-out var(--ab-flash-delay);
        }
        .landing-about__band--on .landing-about__flash { color: ${RED}; }

        /* the portraits: F1 — the frame-style isolation lives on THIS
           instance only, via the parts the library exposes. The phase-2
           driver established the cascade fact in this Chrome (document
           ::part rules beat the shadow's plain .frame rules: the size
           rules landed as written) — these overrides retire the whole
           frame look on this instance: no fluro surface, no ink border,
           no multiply (the glyphs then color straight — ink on the
           page's hatch), no drop-ladder shadow. The burst widget below
           keeps every one of them: the isolation is per-instance,
           consumer-side, no library ask. The spans (part="frame") take
           the ink by inheritance and keep their own flip sheet — no
           ::part(frame) rule, the machine's animation is untouched. */
        .landing-about__portraits {
          /* F3, the slower hold lives on the instance's knob */
          --glaphic-ascii-step: var(--ab-ascii-step);
        }
        .landing-about__portraits::part(box) {
          /* F1: the library's frame look retires here (see above) */
          color: ${INK};
          background: none;
          border: none;
          mix-blend-mode: normal;
          box-shadow: none;
          animation: none;
          /* F2: the seat's exact fill — the type is the seat ÷ 49 lines
             (borders gone, no −4 accounting); width is the 90-column
             run (every frame is 90 columns × 49 lines) */
          height: var(--ab-band1-mid);
          font-size: calc(var(--ab-band1-mid) / 49);
          line-height: 1;
          width: 90ch;
          /* centered in its track at the mobile stack (a no-op at the
             desktop auto track) */
          justify-self: center;
        }

        /* ── band 2: the grow headline + the two widget rows ───────── */
        /* the band's content keeps its round-A standoff: the parked
           panel's edge (20.1vw) + ~3vw clear of it — the right-hugged
           widget pair never kisses the panel */
        .landing-about__band2 {
          margin-inline: 0 var(--ab-band2-inset);
          --ab-band2-inset: calc(20.1vw + 3.1vw);
        }
        /* B2: the headline is the shared grow voice again (GrowHead's
           own markup, band 3's .landing-about__head twin), its shadow ladder keyed
           to THIS band's flag; C2 flips the alignment — the ladder
           prints against the STRIP'S RIGHT edge */
        .landing-about__code-head {
          text-align: right;
          padding-top: 3.6vh;
        }
        /* C3: the two rows are BOTH left-anchored start-aligned pairs
           (round B's mirror yields) — panel first, the line after, and
           the line TOP-aligns against its panel's top edge */
        .landing-about__code-rows {
          margin-top: 4.4vh;
          display: grid;
          row-gap: 4.4vh;
        }
        .landing-about__row-a, .landing-about__row-b {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          column-gap: 2.5vw;
        }
        .landing-about__widget {
          /* the pair's print size comes off the named var (the library's
             knob channel — an inherited set beats its :host default) */
          --glaphic-ascii-type: var(--ab-code-ascii-type);
          /* C5: the boxes hold FULL-HEIGHT seats from first paint — the
             reserved heights sit on the shadow's frame via the
             per-instance part overrides below */
        }
        .landing-about__widget::part(box) {
          /* the reserved seat: --ab-widget-seat = the frames' tallest
             5-line run at the library's 1.3 line-height, border-boxed
             (the boxes hold before, during and after the type) */
          height: var(--ab-widget-seat);
          /* C5: the drop/shadow ladder retires on THESE instances — the
             fluro surface + border + multiply stay the library's look
             (the portrait's isolation above is band 1's only); the base
             paints no shadow, so killing the build parks everything at
             the unshadowed rest */
          animation: none;
          box-shadow: none;
        }
        /* B2: the beside-lines now type (see the JSX idiom note): the
           cursor-type host rides as an inline-block cut of the row (the
           hero's lead cut), voiced by the body type; the scripts'
           hard-broken lines own their widths (the round-A 34ch cap
           retired — the typed line is the arrival now, no .landing-about__fade
           mount, and its inline --ab-d delays left with the fades) */
        .landing-about__code-copy {
          /* C4: the constant halved from round B's 2.8vw/40px clamp */
          font-size: var(--ab-copy-type);
          line-height: 1.2;
        }
        .landing-about__code-copy glaphic-cursor-type {
          display: inline-block;
          font-size: 1em;
          line-height: 1.2;
          /* the body voice: the shadow :host's mono default is the
             terminal machine's, not these lines' voice — the hero's
             typed LEAD cut (their model) overrides it to the body face
             the same way; the desktop then holds exactly the scripts'
             2/1 pre-broken line boxes */
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        /* the typed boxes' line reserves: the pre-broken scripts print a
           known line count desktop, so the <p> holds that height from
           mount — the widget beside it never shifts while it types */
        .landing-about__dent { min-height: 2.4em; }
        /* B5: the asteroid line opens on a 3ch tab — the indent rides on
           the host itself, inheriting into the shadow's first row (a
           light-DOM wrapper would shift the whole pre-broken block) */
        .landing-about__dent glaphic-cursor-type { text-indent: var(--ab-copy-indent); }

        /* ── band 3: the journey timeline + the chamfered plate ──── */
        /* C7's separations ride the named constants: the grow title
           exhales off the marquee (15vh), the timeline off the title
           (5vh), the plate off the timeline (10vh) */
        .landing-about__head { margin-top: var(--ab-b3-gap-head); }
        /* full non-sidebar width (the strip grammar); the rail spans the
           strip edge-to-edge, the nodes' text keeps the flow's gutter */
        .landing-about__journey {
          margin-inline: -3.9vw 20.1vw;
          margin-top: var(--ab-b3-gap-rail);
          position: relative;
          padding-inline: 3.9vw;
        }
        .landing-about__rail {
          position: absolute;
          top: 5px; /* the ticks' knot centers: the 11px tick's middle */
          left: 0;
          right: 0;
          height: 1px;
          background: ${INK};
          opacity: 0.85;
        }
        .landing-about__nodes {
          position: relative;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          column-gap: 1.6vw;
        }
        .landing-about__node {
          position: relative;
          padding-top: 2.8vh; /* the tick zone; the text clears it */
        }
        .landing-about__tick {
          position: absolute;
          top: 0;
          left: 0;
          width: 11px;
          height: 11px;
          background: ${INK};
        }
        .landing-about__node-year {
          display: block;
          font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', Menlo, monospace);
          font-weight: 600;
          font-size: clamp(12px, 1.15vw, 16px);
          margin-bottom: 0.6vh;
        }
        .landing-about__node-label {
          display: block;
          font-size: clamp(12px, 1.18vw, 17px);
          line-height: 1.45;
          max-width: 22ch;
        }

        /* the chamfered fluro plate: the container CLIPS two corners and
           isolates a stacking context (the paint-only plate's -1 z-index
           would drop under a plain block otherwise); the glaphic-plate
           paints the surface, the paragraph prints ink on it */
        .landing-about__plate {
          /* B1: the plate FLOATS — no longer the strip's full span: ~8vw
             inside the strip's edges BOTH sides (the 3.9vw flow padding
             and the 20.1vw panel standoff convert the left/right wants:
             left edge at 8vw, right edge 8vw shy of the parked panel —
             the centered read is the default; an offset read is a
             one-line margin tweak) */
          margin-inline: calc(var(--ab-plate-float) - 3.9vw) calc(20.1vw + var(--ab-plate-float));
          margin-top: var(--ab-b3-gap-plate); /* C7: the timeline → the plate */
          position: relative;
          isolation: isolate;
          /* the two chamfers, at the card's 20px amount: top-left +
             bottom-right, the 45-degree cut the cards carried */
          clip-path: polygon(
            20px 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%,
            0 20px
          );
        }
        .landing-about__plate-paint { position: absolute; inset: 0; }
        .landing-about__plate-copy {
          position: relative;
          /* C8: the plate HUGS its copy — 16px on every side, the
             chamfer's 20px cut riding the box edge (F9's 8vh/8vw
             breath retires) */
          padding: var(--ab-plate-pad);
          font-size: clamp(12px, 1.18vw, 17px);
          line-height: 1.55;
          /* print lines past ~70ch stop reading — the plate spans the
             whole non-sidebar width, the copy keeps a book's measure */
          max-width: 72ch;
        }

        /* ── mobile: the three bands stack full-width ─────────────── */
        @media (max-width: 899px) {
          .landing-about {
            height: auto;
            /* the Phase-4 map's about slot (hero -1, band 0, about 1,
               now 2, past 3, tech 4) — re-derived once, here */
            order: 1;
            /* the same F5 spacer math, with the seat recomputed to FIT
               the column: the art is 90 columns at the mono advance
               (0.6em, so the fitting type is 54em wide ÷ the column),
               and the seat is that fitting type spread over its 49
               lines; the 8px slack holds whether or not the part
               overrides retired the 2px border pair */
            --ab-band1-mid: calc((88vw - 8px) / 54 * 49);
          }
          .landing-about__marquee { margin-inline: -6vw; }
          /* the component's own rails; the top one rests on mobile */
          .landing-about__marquee::part(rail-top) { display: none; }
          /* band 1's stack: headline over the portraits, breathing kept;
             the row's height goes auto (the stack's natural height) while
             the seat var drives the art's box alone */
          .landing-about__band1-mid {
            /* the stack: headline block over the portraits box, one track */
            grid-template-columns: 1fr;
            height: auto;
            row-gap: 16px;
            align-items: start;
            padding-left: 6vw;
            padding-right: 0;
            margin-top: 18px;
          }
          .landing-about__band1-head { margin-bottom: 18px; }
          /* the band's content runs the full mobile flow (no panel to
             stand off on mobile) */
          .landing-about__band2 { margin-inline: 0; }
          .landing-about__code-head { padding-top: 44px; }
          /* the column caps the rows: the pairs must clamp or the
             copies' typed blocks run max-content past the 390 column
             and the right-hugged widget paints off-viewport, clipped by
             the section's overflow */
          .landing-about__code-rows { grid-template-columns: minmax(0, 1fr); }
          /* both rows stack on mobile (C3's start-alignment is a
             desktop read): the widget above its line; the p's typed
             reserve holds through the print either way */
          .landing-about__row-a, .landing-about__row-b { flex-direction: column; align-items: start; row-gap: 10px; }
          /* B1's float is a desktop strip read — the stacked mobile
             plate spans the column again */
          .landing-about__plate { margin-inline: 0; }
          /* the timeline reads as a strip along a vertical rail: the
             nodes stack, the ticks ride the left line — a horizontal
             ladder can't cross into wrapped rows */
          .landing-about__journey { padding-inline: 6vw; }
          .landing-about__rail { top: 0; bottom: 0; right: auto; width: 1px; height: auto; }
          .landing-about__nodes { grid-template-columns: 1fr; row-gap: 14px; }
          .landing-about__node { padding-top: 0; padding-left: 26px; }
          .landing-about__tick { top: 5px; }
        }
      `}</style>

      {/* the nav tool panel is LandingPanel (a component alongside this
          one) — it pairs with the sticky footer band */}

      {/* flow grid: the three bands — the WHOLE content rides up on the
          section's exit */}
      <div class="landing-flow" ref={flowRef}>
        {/* ── band 1: the ticker, the headline + portraits row, the
            reversed ticker — the band's own flag gates its drop, the
            flash, and the portraits' cycle (F11) ─────────────────── */}
        <div class={`landing-about__band landing-about__band1 ${in1 ? 'landing-about__band--on' : ''}`} ref={band1Ref}>
          <glaphic-marquee
            ref={marqueeLeadRef}
            class="landing-about__marquee"
            aria-hidden="true"
          />
          {/* the sandwich's middle row: plain ink (F6), no reserve from
              the art (F4) — the phrases print straight from the
              section's ink; the flash span carries the one crimson
              moment */}
          <div class="landing-about__band1-mid">
            <h2 class="landing-about__band1-head grow-head">
              <span class="landing-about__phrase">Trained Poet;</span>{' '}
              <span class="landing-about__flash">Experienced Developer</span>
            </h2>
            {/* the portraits: F1's own instance look; the frames land
                only once the fetch resolves AND this band fires */}
            <glaphic-ascii
              ref={portraitsRef}
              class="landing-about__portraits"
              label="A cycling ASCII portrait, thirty drawn frames"
            />
          </div>
          {/* the reversed runner: same band voice, the track's direction
              rides the component's own `reverse` attribute now (the
              library owns the behavior) */}
          <glaphic-marquee
            ref={marqueeRevRef}
            class="landing-about__marquee"
            reverse
            aria-hidden="true"
          />
        </div>

        {/* ── band 2: the grow headline + the mirrored typed rows ── */}
        <div class={`landing-about__band landing-about__band2 ${in2 ? 'landing-about__band--on' : ''}`} ref={band2Ref}>
          {/* B2: "I've been Coding." back in the shared grow voice — the
              GrowHead band 3's journey head composes too (the stepped
              shadow ladder plays once when THIS band's flag lands).
              Round A's typed headline retired alongside its right-justify
              rules; the cursor typing moved onto the two beside-lines
              below (their idiom note carries the whys) */}
          <GrowHead text="I've been Coding." inView={in2} class="landing-about__code-head" />
          {/* B2 + C3: the two rows are LEFT-ANCHORED start-aligned pairs
              (round B's mirror yields) — each row runs panel first, its
              cursored line after, tops aligned. The typing is
              the hero's exact idiom: the real text rides the sr-only
              span (it must exist at first paint — the cursor-type prints
              into a shadow root on a timer, which left the hero's h2
              with an empty accessible name until the span carried the
              words), the aria-hidden typed copy is a performance of the
              same words, the ' ' mount keeps the box, the element's
              documented re-types-on-change fires the print the moment
              THIS band's flag lands, and the cursor block paints each
              line's own ink */}
          <div class="landing-about__code-rows">
            <div class="landing-about__row-a">
              <glaphic-ascii
                ref={burstRef}
                class="landing-about__widget"
                role="img"
                label="simple characters: a ship fires a laser, destroying an asteroid."
              />
              {/* the asteroid line: the B5 tab rides the typed host's own
                  first row (.landing-about__dent) — the scripts are pre-broken so
                  desktop line boxes hold stable while it prints */}
              <p class="landing-about__code-copy landing-about__dent">
                <span class="sr-only">It started with cloning asteroids on my middle school graphic calculator.</span>
                <span aria-hidden="true">
                  <glaphic-cursor-type
                    text={in2 ? ASTEROID_SCRIPT : ' '}
                    speed={COPY_CHAR_MS}
                    cursor-vanish
                    style={{ '--glaphic-cursor-type-cursor-ink': in2 ? INK : 'transparent' }}
                  />
                </span>
              </p>
            </div>
            <div class="landing-about__row-b">
              <glaphic-ascii
                ref={jobRef}
                class="landing-about__widget"
                role="img"
                label="A monospace log types 2012 NYC, glitches through job codes, and drowns in a wall of currency — the work got serious"
              />
              {/* C6: the second line arms only after row 1's print
                  settles (the chain flag flips once — ROW2_DELAY_MS) */}
              <p class="landing-about__code-copy">
                <span class="sr-only">Since then things have gotten serious.</span>
                <span aria-hidden="true">
                  <glaphic-cursor-type
                    text={rowBTypes ? SERIOUS_SCRIPT : ' '}
                    speed={COPY_CHAR_MS}
                    cursor-vanish
                    style={{ '--glaphic-cursor-type-cursor-ink': rowBTypes ? INK : 'transparent' }}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── band 3: the third ticker, the journey headline, the
            timeline, then the chamfered plate — the band's own flag
            gates every one of them (F11) ─────────────────────────── */}
        <div class={`landing-about__band landing-about__band3 ${in3 ? 'landing-about__band--on' : ''}`} ref={band3Ref}>
          <glaphic-marquee
            ref={marqueeTailRef}
            class="landing-about__marquee"
            aria-hidden="true"
          />
          <GrowHead text="My professional Journey." inView={in3} class="landing-about__head" />
          {/* the journey: a 1px rail + seven nodes printing on the
              160ms ladder (JOURNEY/NODE_STEP_MS at module scope) the
              moment band 3 fires; 'NOW ???' is the terminal readout —
              plain text, no affordance */}
          <div class="landing-about__journey">
            <div class="landing-about__rail" />
            <ol class="landing-about__nodes">
              {JOURNEY.map((node, i) => (
                <li
                  key={node.year + node.label}
                  class="landing-about__node landing-about__fade"
                  style={{ '--ab-d': `${i * NODE_STEP_MS}ms` }}
                >
                  <span class="landing-about__tick" aria-hidden="true" />
                  <span class="landing-about__node-year">{node.year}</span>
                  <span class="landing-about__node-label">{node.label}</span>
                </li>
              ))}
            </ol>
          </div>
          {/* the chamfered fluro plate (B1: it floats ~8vw inside the
              strip on both sides — no longer its full span): the paint is
              the glaphic-plate tone; the paragraph prints ink on it; the
              reveal chain: the plate's fade delay = the ladder's settle +
              beat (PLATE_DELAY_MS), counted from band 3's own fire */}
          <div class="landing-about__plate landing-about__fade" style={{ '--ab-d': `${PLATE_DELAY_MS}ms` }}>
            <glaphic-plate class="landing-about__plate-paint" tone="cyan" aria-hidden="true" />
            <p class="landing-about__plate-copy">
              I like to joke that poetry and coding are similar in practice, but it is true: both
              crafts hinge upon collapsing complicated ideas into succinct patterns of symbols. A poet
              folds a singular human experience into as few words as possible. A programmer takes a
              complicated problem and reduces it to (hopefully) comprehensible code. Instead of
              unfolding into emotion, a program ends up as streams of binary running through some
              device's threads. Both too often intimidate the uninitiated.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}