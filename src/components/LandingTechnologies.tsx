// New-design landing section three — "Tools I've used." (the
// technologies block below the about section). Same layout grammar as
// LandingAbout (a 1440x900-artboard section): the shared grow headline
// (GrowHead + src/landing.css) over the paper ground, the site's padded
// flow grid, and the chip cloud framed by two solid crimson bars (the
// strip grammar's full-bleed rail slots).
//
// The grid's content row is the CHIP CLOUD: the technologies from the
// legacy (live) site's own list, each as a glaphic-chip — every chip the
// same paint (the line recipe: 1px ink rim, ink caps), with the icon the
// live version shows LEADING it (the chip's `left` icon well). The chips
// print in like the text-collapse treatment (glaphic-collapse's word
// slam): they hold a spread pose (44px gap spans between the chips) and
// when the section first enters every gap collapses to the resting 14px
// with a left-to-right stagger while each chip fades in on its own beat.
//
// The glaphic element (glaphic-chip) is defined by the eager
// '@glaphic/ui' import in GlaphicGallery, which app.tsx imports
// statically.
import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';
import { Icon } from './Icon';
import { landingTechnologies as technologies } from '../data/technologies';

const INK = '#0D0221';
const INK_DARK = '#242821'; // the strip slabs' ink-dark — the now strips' --ln-border value

/* the roll's base beat: each chip's fade and gap ride this base after their
   noisy --lt-d, so the wave's first chip lands a fraction of a second after
   the cloud's own entry — the reveal fires on the cloud's first pixels, and
   the reader sees the box settle in view before the roll begins */
const ROLL_BEAT = '0.15s';

// the roll's variable lag: --lt-d is each chip's beat — the flat 40ms
// march wobbled ±32ms by a deterministic hash (mean drift zero, so the
// tail keeps its overall pace) — the series reads hand-rolled instead
// of metronomic, and each chip's gap keeps rolling behind its own beat
const beat = (i: number) => {
  const h = Math.sin((i + 1) * 127.1) * 43758.5453;
  const jitter = (h - Math.floor(h) - 0.5) * 64;
  return Math.round(i * 40 + jitter);
};


export function LandingTechnologies() {
  const [headInView, setHeadInView] = useState(false);
  const [cloudInView, setCloudInView] = useState(false);
  const hostRef = useRef<HTMLElement | null>(null);
  const cloudRef = useRef<HTMLDivElement | null>(null);

  // the cloud's box freezes at its SPREAD height: the roll's gap
  // collapse (44px → 14px) re-wraps the chips and the wrap sheds rows —
  // measured 48px at ≥1200, 96px narrower — so an unreserved box
  // shrinks under the roll and lurches the tail bar (with the page's
  // end) up into view — the pop. Read once at mount, while the gaps
  // still hold the spread pose (the mount layout IS the spread state),
  // the floor outlives the roll: the compacted chips sit top-anchored
  // in the frozen box and the bar's seat holds. Mount-frozen by design
  // — the post-reveal layout reads the compacted wrap, so a re-measure
  // would shrink the floor; a mid-session resize keeps this bound as
  // the stale-but-safe seat and the next load re-freezes true
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;
    cloud.style.minHeight = `${cloud.getBoundingClientRect().height}px`;
  }, []);

  // the entry gates: the head and the chip cloud each fire on their OWN
  // first pixels crossing the viewport's bottom edge (the section gate
  // fired 25vh above the fold — the roll played while the cloud was
  // still below the reader). Each latches once; one observer watches
  // both, hanging up when both have fired, and the roll's base beat
  // (ROLL_BEAT) holds the start a fraction after the cloud's entry
  useEffect(() => {
    const targets = [
      [hostRef.current?.querySelector<HTMLElement>('.landing-technologies__head') ?? null, setHeadInView],
      [hostRef.current?.querySelector<HTMLElement>('.landing-technologies__cloud') ?? null, setCloudInView],
    ] as const;
    const latched = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || latched.has(entry.target)) continue;
        latched.add(entry.target);
        for (const [el, set] of targets) {
          if (el === entry.target) set(true);
        }
        // both seen → the observer's job is done
        if (latched.size === targets.length) io.disconnect();
      }
    });
    for (const [el] of targets) {
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="technologies"
      ref={hostRef}
      class={`landing-technologies ${cloudInView ? 'landing-technologies--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-technologies {
          position: relative;
          /* the section's own floor: the tail bar anchors at the content
             edge (below) and the band's rest read holds even when the
             cloud's rows sit few — height stays content-driven above it */
          min-height: 100vh;
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .landing-technologies * { margin: 0; box-sizing: border-box; }

        /* ── reveal ───────────────────────────────────────────────
           the chips' print-in as a ROLL (glaphic-collapse's shrink-
           span mechanic, re-paced and interleaved — not staged): the
           gaps hold the 44px spread while the chips FADE in one after
           the other with VARIABLE LAG (--lt-d is each chip's beat,
           see the hash above the component); the wave carries the
           base beat (ROLL_BEAT) past the cloud's own entry gate, so
           the compaction starts a fraction of a second after the
           cloud scrolls into view; a chip's own gap span
           starts closing 0.24s in — as THAT chip lands — while the
           chips still to its right keep fading in, so the cloud
           compacts continuously from the left under the ongoing
           series and the wrap re-flows as the wave passes */
        /* the line-variant chip's ink is the library's cool-900 dark —
           invisible on this section's ink plate (computed 1.2:1). The
           cloud's chips print the site's on-ink paper instead */
        .landing-technologies__cloud glaphic-chip {
          --glaphic-chip-ink: #F2F5EB;
          --glaphic-chip-rim: #F2F5EB;
        }
        .landing-technologies__cloud glaphic-chip { opacity: 0; }
        /* the arrival is a plain opacity fade — the roll's beats and
           the gap collapse carry the pattern, no scale on the chip */
        .landing-technologies--in .landing-technologies__cloud glaphic-chip {
          animation: landing-technologies-fade 0.32s ease-out calc(${ROLL_BEAT} + var(--lt-d, 0ms)) both;
        }
        @keyframes landing-technologies-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .landing-technologies__gap {
          display: block;
          height: 30px;
          flex: none;
          width: 44px;
        }
        .landing-technologies--in .landing-technologies__gap {
          width: 14px;
          /* each gap joins the roll behind its own chip — chained to
             the same noisy beat, so the lag carries into the slide */
          transition: width 90ms ease calc(${ROLL_BEAT} + var(--lt-d, 0ms) + 0.24s);
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-technologies--in .landing-technologies__cloud glaphic-chip { animation: none; opacity: 1; }
          .landing-technologies__cloud glaphic-chip { opacity: 1; } /* the cloud is content: visible pre-gate too */
          .landing-technologies--in .landing-technologies__gap { transition: none; }
        }

        /* ── the ink-dark bars ─────────────────────────────────────
           the two solid slabs enclosing the chip cloud, on the strip
           grammar's full-bleed rail slots (flush left at the page's
           edge, flush AT the parked panel). Ink-dark #242821, the
           now strips' slab ink — the bars read as that family's rails
           against the crimson panel past them */
        .landing-technologies__bar {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          height: 1rem;
          background: ${INK_DARK};
        }
        .landing-technologies__bar--lead { margin-top: 4vh; }
        /* the tail bar rides the cloud's box, which the mount effect
           freezes at the roll's spread height (see the ref hook) — the
           gap collapse re-wraps rows inside that box, so the bar's seat
           holds through the roll instead of lurching up into view */
        .landing-technologies__bar--tail { margin-top: 2vh; }
        /* ── the chip cloud ────────────────────────────────────────
           wraps like a scatter on the same grid span the about's story
           uses (1-9); the cascade staggers each chip a beat apart.
           The 2vh top owns the seam the rail band used to hold */
        .landing-technologies__cloud {
          grid-column: 1 / span 9;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          gap: 18px 0; /* columns come from the .landing-technologies__gap spans */
          /* the cloud rides 2vh inside the bars' frame */
          margin-top: 2vh;
          max-width: 52vw;
          margin-block: 1rem;
        }
        /* a nudge up from the spec's 25px chip for the showcase scale */
        .landing-technologies__cloud glaphic-chip {
          --glaphic-chip-height: 30px;
          --glaphic-chip-label-size: 12px;
          --glaphic-chip-well-size: 20px;
          --glaphic-chip-well-width: 30px;
          align-items: center;
        }
        .landing-technologies__cloud glaphic-chip .landing-technologies__chip-icon {
          display: inline-grid;
          place-items: center;
        }

        /* ── mobile: the flow stacks (as the about) ── */
        @media (max-width: 899px) {
          .landing-technologies { height: auto; /* the Phase-4 map's tech slot (the last mobile stop) */ order: 4; }
          /* the bars ride the mobile flow full-bleed (the flow's 6vw
             gutters pulled back); the frame replaces the tail margin
             the cloud used to carry itself */
          .landing-technologies__bar { margin-inline: -6vw; }
          .landing-technologies__cloud { max-width: none; gap: 14px 0; }
        }
      `}</style>

      {/* flow grid: the grow headline, the crimson bars enclosing the
          chip cloud */}
      <div class="landing-flow">
        <GrowHead text="Tools I've used." inView={headInView} class="landing-technologies__head" />

        <div class="landing-technologies__bar landing-technologies__bar--lead" aria-hidden="true" />

        <div class="landing-technologies__cloud" ref={cloudRef}>
          {technologies.map((tech, i) => (
            <Fragment key={tech.name}>
              <glaphic-chip
                style={{ '--lt-d': `${beat(i)}ms` }}
                variant="line"
                left
                wide
              >
                {tech.name}
                <span slot="icon" class="landing-technologies__chip-icon">
                  <Icon name={tech.icon} size={18} />
                </span>
              </glaphic-chip>
              <i class="landing-technologies__gap" aria-hidden="true" style={{ '--lt-d': `${beat(i)}ms` }} />
            </Fragment>
          ))}
        </div>

        <div class="landing-technologies__bar landing-technologies__bar--tail" aria-hidden="true" />
      </div>
    </section>
  );
}