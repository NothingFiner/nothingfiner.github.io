// New-design landing section two — the About rebuilt as Eliot's three
// bands (the 2026-10-30 revamp brief; the Figma-mock era's story rows
// and its old reading retired):
//   band 1  a TICKER above a 245px-tall middle row — the headline
//           "Trained Poet; Experienced Developer" on the left (the
//           section-header grow/print voice; the second phrase flashing
//           one-shot to the dark brand crimson once the reveal settles)
//           and the ASCII-portraits cycler on the right — then a second
//           TICKER whose track runs the OPPOSITE direction
//   band 2  "I've been Coding." grow-head + the row: the shell/burst
//           glaphic-ascii widget left of the asteroid opening line
//   band 3  a third TICKER + "My professional Journey." grow-head + the
//           seven-node journey timeline (a 1px ink rail, nodes printing
//           on the 160ms ladder), then the chamfered fluro plate holding
//           the poetry/programming paragraph verbatim
// The portraits are REAL art: thirty text frames dropped into
// public/assets/ascii-portraits/ by Eliot — every frame exactly 49 lines
// x 90 columns, numbering skipping 4 and 9. The frames fetch at runtime
// and set on the element's ref only when ALL resolve; array properties
// can't carry to Lit from JSX attributes (the marquee precedent). Until
// they're in, the slot sits empty by design.
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';
import { rideOutUp, TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A'; // dark brand crimson — the flash + the ticker inks
const PAPER = '#F2F5EB'; // the grow-heads' warm-white fill

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
/* the .ab-fade transition's own tail — part of the plate's chain count */
const FADE_TAIL_MS = 700;
/* the plate arrives AFTER the ladder settles: the last node's own moment
   + its fade's tail + a 240ms beat — the story reads to its end, then
   the plate */
const PLATE_DELAY_MS = (JOURNEY.length - 1) * NODE_STEP_MS + FADE_TAIL_MS + 240;

export function LandingAbout() {
  const [inView, setInView] = useState(false);
  // three ticker instances (band 1 top, band 1's reversed runner, band
  // 3) — all one voice, each needing its own ref for the imperative set
  const marqueeLeadRef = useRef<HTMLElement | null>(null);
  const marqueeRevRef = useRef<HTMLElement | null>(null);
  const marqueeTailRef = useRef<HTMLElement | null>(null);
  const portraitsRef = useRef<HTMLElement | null>(null);
  const burstRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
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
  // stays empty (no frames set) until every one of them resolves — a
  // half-set cycle would print torn frames, and a caught failure is
  // logged with its URL rather than silently skipped. The array property
  // set ONCE all resolve — never as JSX attributes. Async outliving the
  // render must cancel: the alive flag + an AbortController stop ghost
  // writes after teardown.
  useEffect(() => {
    const el = portraitsRef.current as unknown as { frames: string[] } | null;
    if (!el) return undefined;
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
      if (frames.every((f): f is string => f !== null)) el.frames = frames;
    };
    void load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  // the ascii widget takes the FRAMES array (content staying with the
  // page) — an array property too, so it sets imperatively once
  useEffect(() => {
    const burst = burstRef.current as unknown as { frames: string[] } | null;
    if (burst) burst.frames = FRAMES;
  }, []);

  // the ride-out wiring
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // Reveal the fades when the section scrolls into view — and LATCH it.
  // A plain boolean flips back to false once the section's intersection ratio
  // drops below the threshold (i.e. when you scroll past it), which faded the
  // body copy back to opacity 0 behind the reader and left it invisible on
  // anchor jumps and restored scroll positions. Once seen, it stays seen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      /* the reveal fires when the section's TOP reaches the viewport's
         UPPER area (top 36% of the screen). Both reads are
         viewport-proportional: the hero is 100vh, so the section's top
         enters at the screen's bottom and climbs; the reveal must land
         with band 1 playable on screen — the ticker's drop, the headline's
         grow print and, a beat later, the crimson flash all under it
         (the journey's ladder + the plate then print on the same flag).
         Two earlier gates failed in opposite directions — the plain
         25%-of-section threshold fired ~550px deep (the build played
         off-screen on arrival) and the -30% lower-third margin fired
         with the headline still at ~73% of the viewport (the build
         played in the screen's bottom sliver, half-lost under the hero).
         Headline lands at ~40% vh at fire on every viewport height: this
         margin and the reveals' inner spacing are both vh units */
      { rootMargin: '0px 0px -64% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={hostRef}
      class={`landing-about ${inView ? 'ab-in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-about {
          position: relative;
          /* natural height — the sections don't force single screens; the
             tail keeps the sticky band's resting slot (its last 37.5vh)
             clear of the plate */
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
          /* band 1's middle row: D8's 245px as the ROW's height — the two
             48px ticker bands sandwich it, so band 1 totals ~341px. The
             veto read (245px = the whole band) swaps this seat for
             calc(245px - 96px); everything under this var follows */
          --ab-band1-mid: 245px;
          /* the headline's crimson flash: one-shot ~1.2s after the reveal
             latch — the grow print (0.45s + its 0.15s beat) has settled
             by then, so the crimson lands as a second, deliberate mark
             on the finished headline */
          --ab-flash-delay: 1.2s;
        }
        .landing-about * { margin: 0; box-sizing: border-box; }

        /* ── reveal ─────────────────────────────────────────────── */
        .ab-fade { opacity: 0; }
        .landing-about.ab-in .ab-fade {
          opacity: 1;
          transition: opacity 0.7s ease-out;
          transition-delay: var(--ab-d, 0s);
        }
        /* reduced motion: the content is content, not the show — show it
           immediately (the marquee's own reduce overrides sit below the
           drop rule, where they win the cascade) */
        @media (prefers-reduced-motion: reduce) {
          .ab-fade { opacity: 1; transition: none; }
          .ab-flash { transition: none; }
        }

        /* the nav tool panel is LandingPanel now (a component alongside
           this one) — a fixed column covering every landing stretch beyond
           the first fold; the sticky footer band's CSS (.lf-band) pairs
           with it ── */

        /* ── the padded flow grid (content gets the gutter) ──────── */
        .ab-flow {
          position: relative;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 1.1vw; /* the slight gutter */
          padding-inline: 3.9vw;
        }

        /* ── the full-bleed ticker band (three instances, one voice) ──
           the band is a FLOW ROW, FULL BLEED AT BOTH EDGES (Eliot: it
           extends to the page's edge so the read stays good as the
           crimson sidebar slides over it — the marquee runs the full
           viewport, the panel riding on top of its right end as it
           arrives). On reveal each band rides down into place (no
           fade): held up off the section's top by the base transform,
           the shared gl-marquee-drop drops them in together */
        .ab-marquee {
          grid-column: 1 / -1;
          margin-inline: -3.9vw -3.9vw;
          margin-top: 4.4vh;
          height: 48px;
          z-index: 2;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the COMPONENT'S — no overlays */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
          transform: translateY(-22vh);
        }
        /* the print-in: the band drops whole (its rules ride with it) */
        .landing-about.ab-in .ab-marquee {
          animation: gl-marquee-drop 0.7s cubic-bezier(0.25, 1, 0.4, 1) both;
        }
        /* reduced motion: no drop — the band seats instantly (the base
           transform must clear too; animation:none alone leaves it parked
           at its -22vh hold, clipped off the section's top). These sit
           AFTER the drop rule so they win the cascade */
        @media (prefers-reduced-motion: reduce) {
          .landing-about .ab-marquee { transform: none; }
          .landing-about.ab-in .ab-marquee { animation: none; }
        }

        /* band 1's sandwich reads TIGHT: the middle row hugs the leader
           band above it, and the reversed runner hugs the row below */
        .ab-band1-mid { margin-top: 0; }
        .ab-band1-mid + .ab-marquee { margin-top: 0; }

        /* the second instance's track runs the OPPOSITE direction — D1's
           one-liner on the library's EXPOSED part: the shadow's scroll
           keyframes still translate 0 to -50%, the reversed direction
           plays them the other way; nothing in the library changes.
           Runtime-verified by the driver (computed direction + drift) */
        .ab-marquee-rev::part(track) { animation-direction: reverse; }

        /* ── band 1's middle row: headline left, portraits right ─────
           full non-sidebar width via the strip grammar (flush left, flush
           AT the parked panel's edge — the phase-1 bands' settled read);
           the headline keeps the flow's gutter inside */
        .ab-band1-mid {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          padding-left: 3.9vw;
          /* the small inset right: the portrait's print shadow breathes
             off the parked panel's edge instead of painting over it */
          padding-right: 2.2vw;
          height: var(--ab-band1-mid);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          column-gap: 2.5vw;
          align-items: center;
        }
        /* the headline rides the shared grow/print treatment (the
           grow-head clamp scale + the shadow-stack grow live in
           landing.css); only its seat + the flash are this section's */
        .ab-band1-head { min-width: 0; }
        .ab-flash {
          /* the second phrase starts at the headline's own warm-white
             fill; when .ab-in latches, the transition's delay holds the
             flip ~1.2s — the latch makes it ONE-SHOT by construction
             (the class never leaves again) */
          color: ${PAPER};
          transition: color 0.25s ease-out var(--ab-flash-delay);
        }
        .landing-about.ab-in .ab-flash { color: ${RED}; }

        /* the portraits' real grid. The .frame's boxes-era fixed width
           (7ch) opens through the exposed part to hold the art at its
           own size — 90 columns x 49 lines, every frame identical. The
           type derives from the SEAT: the row's height minus the
           frame's own 4px of 2px borders (border-box), split over the
           49 lines; the shadow's 1.3 line-height would push the art
           taller than the seat, so the part pins line-height 1. The
           width is the 90-column run plus the borders' 4px — without
           the add the 90th column clips under the right border */
        .ab-portraits::part(box) {
          height: var(--ab-band1-mid);
          font-size: calc((var(--ab-band1-mid) - 4px) / 49);
          line-height: 1;
          width: calc(90ch + 4px);
          /* centered in its track at the mobile stack (a no-op at the
             desktop auto track) */
          justify-self: center;
        }

        /* ── band 2: "I've been Coding." + the widget/copy row ───── */
        .ab-head {
          /* the headline's box also stops at the panel's edge (its
             glyphs sit left, but the box stays separate like the rest of
             the content — nothing of the section reads under the sidebar
             at desktop) */
          grid-column: 1 / -4;
          padding-top: 3.6vh;
        }
        .ab-coding {
          grid-column: 1 / -4;
          margin-top: 4.4vh;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          column-gap: 3vw;
          align-items: center;
        }
        .ab-coding-copy {
          /* the opening line: a clear notch under the headline's clamp
             scale (34-70px) so the row reads headline-then-line */
          font-size: clamp(22px, 2.8vw, 40px);
          line-height: 1.2;
          max-width: 34ch;
        }

        /* ── band 3: the journey timeline + the chamfered plate ──── */
        /* full non-sidebar width (the strip grammar); the rail spans the
           strip edge-to-edge, the nodes' text keeps the flow's gutter */
        .ab-journey {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          margin-top: 4.4vh;
          position: relative;
          padding-inline: 3.9vw;
        }
        .ab-rail {
          position: absolute;
          top: 5px; /* the ticks' knot centers: the 11px tick's middle */
          left: 0;
          right: 0;
          height: 1px;
          background: ${INK};
          opacity: 0.85;
        }
        .ab-nodes {
          position: relative;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          column-gap: 1.6vw;
        }
        .ab-node {
          position: relative;
          padding-top: 2.8vh; /* the tick zone; the text clears it */
        }
        .ab-tick {
          position: absolute;
          top: 0;
          left: 0;
          width: 11px;
          height: 11px;
          background: ${INK};
        }
        .ab-node-year {
          display: block;
          font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', Menlo, monospace);
          font-weight: 600;
          font-size: clamp(12px, 1.15vw, 16px);
          margin-bottom: 0.6vh;
        }
        .ab-node-label {
          display: block;
          font-size: clamp(12px, 1.18vw, 17px);
          line-height: 1.45;
          max-width: 22ch;
        }

        /* the chamfered fluro plate: the container CLIPS two corners and
           isolates a stacking context (the paint-only plate's -1 z-index
           would drop under a plain block otherwise); the glaphic-plate
           paints the surface, the paragraph prints ink on it */
        .ab-plate {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          margin-top: 4.4vh;
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
        .ab-plate-paint { position: absolute; inset: 0; }
        .ab-plate-copy {
          position: relative;
          padding: 2.6vh 3.9vw;
          font-size: clamp(12px, 1.18vw, 17px);
          line-height: 1.55;
          /* print lines past ~70ch stop reading — the plate spans the
             whole non-sidebar width, the copy keeps a book's measure */
          max-width: 72ch;
        }

        /* ── mobile: the three bands stack full-width ─────────────── */
        @media (max-width: 899px) {
          .landing-about { height: auto; }
          .ab-flow { display: flex; flex-direction: column; padding-inline: 6vw; }
          .ab-marquee { margin-inline: -6vw; }
          /* the component's own rails; the top one rests on mobile */
          .ab-marquee::part(rail-top) { display: none; }
          /* band 1's stack: headline over the portraits, breathing kept */
          .ab-band1-mid {
            /* the stack: headline block over the portraits box, one track */
            grid-template-columns: 1fr;
            row-gap: 16px;
            align-items: start;
            padding-left: 6vw;
            padding-right: 0;
            margin-top: 18px;
          }
          .ab-band1-head { margin-bottom: 18px; }
          .ab-coding { grid-template-columns: 1fr; row-gap: 22px; }
          .ab-coding-spark { justify-self: center; }
          .ab-coding-copy { max-width: none; }
          .ab-head { padding-top: 44px; }
          /* the timeline reads as a strip along a vertical rail: the
             nodes stack, the ticks ride the left line — a horizontal
             ladder can't cross into wrapped rows */
          .ab-journey { padding-inline: 6vw; }
          .ab-rail { top: 0; bottom: 0; right: auto; width: 1px; height: auto; }
          .ab-nodes { grid-template-columns: 1fr; row-gap: 14px; }
          .ab-node { padding-top: 0; padding-left: 26px; }
          .ab-tick { top: 5px; }
          .ab-plate-copy { padding: 18px 16px; font-size: 13px; }
        }
      `}</style>

      {/* the nav tool panel is LandingPanel (a component alongside this
          one) — it pairs with the sticky footer band */}

      {/* flow grid: the three bands — the WHOLE content rides up on the
          section's exit */}
      <div class="ab-flow" ref={flowRef}>
        {/* ── band 1: the ticker, the headline + portraits row, the
            reversed ticker ─────────────────────────────────────── */}
        <glaphic-marquee
          ref={marqueeLeadRef}
          class="ab-marquee"
          aria-hidden="true"
        />
        {/* the sandwich's middle row: the headline rides the shared
            grow/print treatment (its own markup here — the flash span
            needs span structure GrowHead can't carry) */}
        <div class="ab-band1-mid">
          <h2 class="ab-band1-head grow-head">
            <span class={`grow-head-in ${inView ? 'grow-on' : ''}`}>
              <span class="ab-phrase">Trained Poet;</span>{' '}
              <span class="ab-flash">Experienced Developer</span>
            </span>
          </h2>
          {/* the portraits: slot empty until the runtime fetch resolves */}
          <glaphic-ascii
            ref={portraitsRef}
            class="ab-portraits"
            label="A cycling ASCII portrait, thirty drawn frames"
          />
        </div>
        {/* the reversed runner: same band voice, track running the other
            way (see the ::part rule above) */}
        <glaphic-marquee
          ref={marqueeRevRef}
          class="ab-marquee ab-marquee-rev"
          aria-hidden="true"
        />

        {/* ── band 2: the coding headline + the widget/copy row ───── */}
        <GrowHead text="I've been Coding." inView={inView} class="ab-head" />
        <div class="ab-coding">
          {/* the shell's rise/burst cycle — the FRAMES array + the
              imperative-ref pattern, as before */}
          <div class="ab-coding-spark">
            <glaphic-ascii
              ref={burstRef}
              role="img"
              label="A shell rises, flashes, and bursts into sparks"
            />
          </div>
          <p class="ab-coding-copy ab-fade" style={{ '--ab-d': '0.35s' }}>
            It started with cloning asteroids on my middle school graphic calculator.
          </p>
        </div>

        {/* ── band 3: the third ticker, the journey headline, the
            timeline, then the chamfered plate ───────────────────── */}
        <glaphic-marquee
          ref={marqueeTailRef}
          class="ab-marquee"
          aria-hidden="true"
        />
        <GrowHead text="My professional Journey." inView={inView} class="ab-head" />
        {/* the journey: a 1px rail + seven nodes printing on the
            160ms ladder (JOURNEY/NODE_STEP_MS at module scope); 'NOW
            ???' is the terminal readout — plain text, no affordance */}
        <div class="ab-journey">
          <div class="ab-rail" />
          <ol class="ab-nodes">
            {JOURNEY.map((node, i) => (
              <li
                key={node.year + node.label}
                class="ab-node ab-fade"
                style={{ '--ab-d': `${i * NODE_STEP_MS}ms` }}
              >
                <span class="ab-tick" aria-hidden="true" />
                <span class="ab-node-year">{node.year}</span>
                <span class="ab-node-label">{node.label}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* the chamfered fluro plate: the paint is the glaphic-plate tone;
            the paragraph (verbatim from the old .ab-story, the lead line
            retired) prints ink on it; the reveal chain: the plate's fade
            delay = the ladder's settle + beat (PLATE_DELAY_MS) */}
        <div class="ab-plate ab-fade" style={{ '--ab-d': `${PLATE_DELAY_MS}ms` }}>
          <glaphic-plate class="ab-plate-paint" tone="cyan" aria-hidden="true" />
          <p class="ab-plate-copy">
            I like to joke that poetry and coding are similar in practice, but it is true: both
            crafts hinge upon collapsing complicated ideas into succinct patterns of symbols. A poet
            folds a singular human experience into as few words as possible. A programmer takes a
            complicated problem and reduces it to (hopefully) comprehensible code. Instead of
            unfolding into emotion, a program ends up as streams of binary running through some
            device's threads. Both too often intimidate the uninitiated.
          </p>
        </div>
      </div>

    </section>
  );
}