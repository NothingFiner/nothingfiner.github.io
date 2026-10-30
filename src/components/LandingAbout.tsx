// New-design landing section two — "I've been Coding." (the story/about
// block below the hero), built from Eliot's Figma mock (a 1440x900
// artboard); layout follows the mock's 900-unit vertical grid, so mock
// measurements map to vh at the same scale. Reading the mock top to
// bottom:
//   headline  — "I've been Coding." in off-paper with the five-tier
//               print-stack shadow (ink at falling alphas, offsets 1 to
//               12px), top-left above the marquee; it grows out of the
//               page (the line rises out of an overflow-clipped mask)
//   marquee   — the framework glaphic-marquee band, crimson mono ticker;
//               the ticker text stops at the crimson panel's edge (as in
//               the mock); the BAND'S OWN seated rails print over the
//               panel (they just darken there through the multiply)
//   columns   — the two story rows: each story's text rides one side of
//               an ink divider with ITS spark widget on the other (the
//               asteroid shell's rise/burst, the 2012→C0DE ticker) —
//               the rows map the landing's own column rhythm; the flow
//               grid carries the site gutter; only the decorative
//               absolutes (panel, marquee, glyphs) sit flush
//   story     — the poetry/programming paragraph, crimson lead over ink
//   panel     — the NAV TOOL: a full-height crimson column flush right
//               that slides in from being invisible between page 1 and
//               page 2 — NOT this section's child: it lives once, in
//               LandingPanel (a component alongside this one), so it
//               covers every part of the landing flow beyond the first
//               fold, full viewport height, desktop only. The nav's fan
//               choreography and its hysteresis live there too, as does
//               the rule that hands the corner over to the sticky
//               footer's pool menu while that is open
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';
import { rideOutUp, TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A';

/* the widgets' frame content (multi-line ASCII, real newlines): what the
   two glaphic-ascii cycles show — data, not machinery */
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


export function LandingAbout() {
  const [inView, setInView] = useState(false);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  // the content's ride-out: as the section leaves the viewport its
  // content translates up with the scroll (the next section's arrival
  // reads as the previous one leaving up), reversing on the way back
  const flowRef = useRef<HTMLDivElement | null>(null);

  const burstRef = useRef<HTMLElement | null>(null);
  const jobRef = useRef<HTMLElement | null>(null);
  // the marquee takes array properties, which JSX attributes can't carry
  // reliably to Lit — set them imperatively once
  useEffect(() => {
    const el = marqueeRef.current as unknown as { strings: string[]; speed: number } | null;
    if (!el) return;
    el.strings = TICKER;
    el.speed = 26;
  }, []);

  // the ascii widgets take the FRAMES arrays (content staying with the
  // page) — these are array properties too, so they set imperatively once
  useEffect(() => {
    const burst = burstRef.current as unknown as { frames: string[] } | null;
    const job = jobRef.current as unknown as { frames: string[] } | null;
    if (burst) burst.frames = FRAMES;
    if (job) job.frames = JOB_FRAMES;
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
         with the "I've been Coding." headline in the UPPER part of the
         screen (the grow's shadow print + the band's drop then play
         fully on screen, above the hero's retreating bottom edge). Two
         earlier gates failed in opposite directions — the plain
         25%-of-section threshold fired ~550px deep (the build played
         off-screen on arrival) and the -30% lower-third margin fired
         with the headline still at ~73% of the viewport (the build
         played in the screen's bottom sliver, half-lost under the hero).
         Headline lands at ~40% vh at fire on every viewport height: the
         3.6vh padding-top and this margin are both vh units */
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
             clear of the story */
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .landing-about * { margin: 0; box-sizing: border-box; }

        /* ── reveal ─────────────────────────────────────────────── */
        .ab-fade { opacity: 0; }
        .landing-about.ab-in .ab-fade {
          opacity: 1;
          transition: opacity 0.7s ease-out;
          transition-delay: var(--ab-d, 0s);
        }
        /* reduced motion: the story is content, not the show — show it
           immediately (the marquee's own reduce overrides sit below the
           drop rule, where they win the cascade) */
        @media (prefers-reduced-motion: reduce) {
          .ab-fade { opacity: 1; transition: none; }
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

        .ab-head {
          /* the headline's box also stops at the panel's edge (its
             glyphs sit left, but the box stays separate like the rest
             of the content — nothing of the section reads under the
             sidebar at desktop) */
          grid-column: 1 / -4;
          padding-top: 3.6vh;
        }
        /* the headline's type/ink treatment + the stepped shadow-print
           grow are shared with the technologies section — see GrowHead
           and src/landing.css */

        /* marquee — full-bleed decorative band; the ticker stops at the
           crimson panel's edge; the two rule bars keep running over the
           panel through the multiply. On reveal BOTH ride down into
           place (no fade): held up off the section's top by the base
           transform, the shared gl-marquee-drop drops them in together */
        .ab-marquee {
          transform: translateY(-22vh);
        }
        .ab-marquee {
          /* the band is a FLOW ROW now, inside the grid — and FULL BLEED
             AT BOTH EDGES now (Eliot: it extends to the page's edge so
             the read stays good as the crimson sidebar slides over it —
             the marquee runs the full viewport, the panel riding on top
             of its right end as it arrives) */
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

        /* ruled columns across the grid — they start below the marquee
           band (the mock's columns sit ~26vh down, the band ends ~22vh).
           The columns ride the landing's own GRID TRACKS now (Eliot: no
           vw literals — the width reads are spans of the same 12-column
           rhythm the rest of the page uses): the band maps the 12
           columns it holds (span 8 of the flow) onto eight 1fr tracks,
           colA = 3, the rule = its own, colB = 4 */
        .ab-cols {
          /* the story CONTENT stays separate from the crimson sidebar
             (Eliot: nothing rides under the panel at desktop) — the
             rows stop at the panel's edge like the band and the story
             block: cols 1..9 of the 12-track flow (the panel = the
             last three); mobile flows full-width anyway */
          grid-column: 1 / -4;
          /* the story rows sit BELOW the flow's band (the columns' mock read: ~26vh from the section's top — the band eats the old 13.8vh gap) */
          margin-top: 4.4vh;
          margin-bottom: 5.9vh;
        }
        .ab-row {
          display: grid;
          align-items: center;
          /* the landing's own rhythm: text · rule · spark (4 · 1px · 3) */
          grid-template-columns: 4fr 1px 3fr;
          column-gap: 1.6vw;
          margin-bottom: 6vh;
        }
        .ab-row-b { grid-template-columns: 3fr 1px 4fr; }  /* the mirror */
        .ab-row:last-child { margin-bottom: 0; }
        .ab-rule { width: 1px; height: 100%; background: ${INK}; opacity: 0.85; }
        .ab-spark { min-width: 0; text-align: center; }
        .ab-cols h3, .ab-lead {
          font-family: var(--f-body, 'Inter', sans-serif);
          font-weight: 700;
          font-size: clamp(15px, 1.53vw, 22px);
          margin-bottom: 0.5vh;
        }
        .ab-cols p, .ab-story p {
          font-size: clamp(12px, 1.18vw, 17px);
          line-height: 1.55;
        }

        /* the poetry/programmer block — crimson lead, ink body; ends at
           the panel's left edge (grid span 9), as in the mock */
        .ab-story {
          grid-column: 1 / span 9;
          padding-top: 0.5vh;
        }
        .ab-lead { color: ${RED}; }

        /* ── mobile: the flow stacks (the sidebar panel and the sticky
           band each join the flow with their own mobile rules) ── */
        @media (max-width: 899px) {
          .landing-about { height: auto; }
          .ab-flow { display: flex; flex-direction: column; padding-inline: 6vw; }
          .ab-head { margin-bottom: 24px; padding-top: 44px; }
          .ab-marquee { position: static; }
          /* the component's own rails; the top one rests on mobile */
          .ab-marquee::part(rail-top) { display: none; }
          .ab-marquee { right: 0; margin-inline: -6vw; }
          .ab-cols { margin-bottom: 40px; }
          .ab-row { grid-template-columns: 1fr; margin-bottom: 28px; }
          .ab-rule { display: none; }
          .ab-spark { text-align: left; }
          .ab-story { margin-bottom: 48px; }
        }
      `}</style>

      {/* the nav tool panel is LandingPanel (a component alongside this
          one) — it pairs with the sticky footer band */}

      {/* flow grid: headline, columns, story — padded content; the WHOLE content rides up on the section's exit */}
      <div class="ab-flow" ref={flowRef}>
        <GrowHead text="I've been Coding." inView={inView} class="ab-head" />
        {/* the band rides IN the flow (the mock's band = the columns'
            upper bound) — a grid row, full-bleed left, the ticker's own
            seated rails printing its edges */}
        <glaphic-marquee
          ref={marqueeRef}
          class="ab-marquee"
          aria-hidden="true"
        />
        {/* the two story rows: each story's text on one side of the
            ink divider, ITS spark widget on the other (the asteroid
            shell's rise/burst; the 2012→C0DE ticker). The rows map the
            landing's tracks (4 · rule · 3, mirrored); the spark cycles
            live in the glaphic-ascii element now — the page feeds
            frames and reads nothing else */}
        <div class="ab-cols">
          <div class="ab-row ab-row-a">
            <div class="ab-colA ab-fade" style={{ '--ab-d': '0.2s' }}>
              <h3>The first thing I ever coded</h3>
              <p>
                was an attempt at an asteroid clone on a casio graphing
                calculator. I never could get it past enemy rendering: it
                got too slow. I'm sure I had a fundamental misunderstanding
                of how to implement a game loop.
              </p>
            </div>
            <div class="ab-rule" />
            <div class="ab-spark ab-fade" style={{ '--ab-d': '0.3s' }}>
              <glaphic-ascii
                ref={burstRef}
                role="img"
                label="A shell rises, flashes, and bursts into sparks"
              />
            </div>
          </div>
          <div class="ab-row ab-row-b">
            <div class="ab-spark ab-fade" style={{ '--ab-d': '0.3s' }}>
              <glaphic-ascii
                ref={jobRef}
                role="img"
                label="A year types out, glitches, and resolves a job started"
              />
            </div>
            <div class="ab-rule" />
            <div class="ab-colB ab-fade" style={{ '--ab-d': '0.2s' }}>
              <h3>I started coding professionally in 2013,</h3>
              <p>
                went to AppAcademy in 2017 and spent more than 8 years
                working in e-commerce &amp; SaaS. I built everything from
                webstores to custom web apps. I'm looking for my next
                challenge in the product space.
              </p>
            </div>
          </div>
        </div>

        <div class="ab-story">
          <p class="ab-lead ab-fade" style={{ '--ab-d': '0.4s' }}>
            Through my formal education, I'm a trained poet.
          </p>
          <p class="ab-fade" style={{ '--ab-d': '0.5s' }}>
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