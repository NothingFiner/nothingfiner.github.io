// New-design landing section three — "Tools I've used." (the
// technologies block below the about section). Same layout grammar as
// LandingAbout (a 1440x900-artboard section): the shared grow headline
// (GrowHead + src/landing.css) over the paper ground, the glaphic-marquee
// ticker band under it (the same band — strings, speed, rule bars — the
// about runs), and the site's padded flow grid.
//
// The grid's content row is the CHIP CLOUD: the technologies from the
// legacy (live) site's own list, each as a glaphic-chip — every chip the
// same paint (the line recipe: 1px ink rim, ink caps), with the icon the
// live version shows LEADING it (the chip's `left` icon well). The chips
// print in like the text-collapse treatment (glaphic-collapse's word
// slam): they hold a spread pose (44px gap spans between the chips) and
// when the section first enters every gap collapses to the resting 14px
// with a left-to-right stagger while each chip lands through a translate
// overshoot keyframe (arrive past home, snap back) — no fade at all.
//
// The glaphic elements (marquee, chip) are defined by the eager
// '@glaphic/ui' import in GlaphicGallery, which app.tsx imports
// statically — same source of registration as the about's marquee.
import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';
import { Icon } from './Icon';
import { landingTechnologies as technologies } from '../data/technologies';
import { TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A';

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
  const [inView, setInView] = useState(false);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);

  // the marquee takes array properties, which JSX attributes can't carry
  // reliably to Lit — set them imperatively once (same as the about)
  useEffect(() => {
    const el = marqueeRef.current as unknown as { strings: string[]; speed: number } | null;
    if (!el) return;
    el.strings = TICKER;
    el.speed = 26;
  }, []);

  // reveal the grow + fades when the section scrolls into view — and LATCH
  // it once seen (a two-way flag faded the chips and the band straight back
  // to their pre-reveal poses behind the reader on any scroll past)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      /* the same gate the about runs: fire when the section's TOP reaches
         the viewport's upper area (top 36%), so the headline's grow and
         the band's drop play with the content in the upper part of the
         screen. The plain 25%-of-section threshold fired ~550px deep —
         by then the build had played off-screen */
      { rootMargin: '0px 0px -64% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="technologies"
      ref={hostRef}
      class={`landing-technologies ${inView ? 'landing-technologies--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-technologies {
          position: relative;
          /* natural height — no forced single screens (as the about); the
             tail keeps the sticky band's resting slot clear of the cloud */
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .landing-technologies * { margin: 0; box-sizing: border-box; }

        /* ── reveal ───────────────────────────────────────────────
           the chips' print-in as a ROLL (glaphic-collapse's shrink-
           span mechanic, re-paced and interleaved — not staged): the
           gaps hold the 44px spread while the chips POP in one after
           the other with VARIABLE LAG (--lt-d is each chip's beat,
           see the hash above the component); a chip's own gap span
           starts closing 0.24s in — as THAT chip lands — while the
           chips still to its right keep popping, so the cloud
           compacts continuously from the left under the ongoing
           series and the wrap re-flows as the wave passes */
        .landing-technologies__cloud glaphic-chip { opacity: 0; }
        .landing-technologies--in .landing-technologies__cloud glaphic-chip {
          animation: landing-technologies-pop 0.32s cubic-bezier(0.25, 1.4, 0.45, 1) var(--lt-d, 0ms) both;
        }
        @keyframes landing-technologies-pop {
          0% { opacity: 0; transform: scale(0.7); }
          45% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: none; }
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
          transition: width 90ms ease calc(var(--lt-d, 0ms) + 0.24s);
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-technologies--in .landing-technologies__cloud glaphic-chip { animation: none; opacity: 1; }
          .landing-technologies__cloud glaphic-chip { opacity: 1; } /* the cloud is content: visible pre-gate too */
          .landing-technologies--in .landing-technologies__gap { transition: none; }
        }

        /* marquee — the same band the about runs; the rules are the COMPONENT'S
           (its own seated rails) and the band drops whole */
        .landing-technologies__marquee { transform: translateY(-22vh); }
        .landing-technologies__marquee {
          position: absolute;
          left: 0;
          /* full bleed like the about's band (Eliot 10-30): the panel rides over the right run — an edge stop against the sidebar's slide reads odd */
          right: 0;
          /* the band IS the 48px zone; its own rails sit at the edges */
          top: 16vh;
          height: 48px;
          z-index: 2;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the component's — no overlays */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
        }
        /* the print-in: the band drops whole (its rules ride with it) */
        .landing-technologies--in .landing-technologies__marquee {
          animation: landing-marquee-drop 0.7s cubic-bezier(0.25, 1, 0.4, 1) both;
        }
        /* reduced motion: the band seats instantly (the base transform must
           clear too — animation:none alone leaves it parked at its -22vh
           hold, clipped off the section's top). These sit AFTER the drop
           rule so they win the cascade */
        @media (prefers-reduced-motion: reduce) {
          .landing-technologies .landing-technologies__marquee { transform: none; }
          .landing-technologies--in .landing-technologies__marquee { animation: none; }
        }

        /* ── the chip cloud ────────────────────────────────────────
           wraps like a scatter on the same grid span the about's story
           uses (1-9); the cascade staggers each chip a beat apart */
        .landing-technologies__cloud {
          grid-column: 1 / span 9;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          gap: 18px 0; /* columns come from the .landing-technologies__gap spans */
          margin-top: 13.8vh;
          max-width: 52vw;
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
          .landing-technologies__marquee { position: static; }
          /* the component's own rails; the top one rests on mobile */
          .landing-technologies__marquee::part(rail-top) { display: none; }
          .landing-technologies__marquee { right: 0; margin-inline: -6vw; }
          .landing-technologies__cloud { margin-bottom: 40px; max-width: none; gap: 14px 0; }
        }
      `}</style>

      {/* flow grid: the grow headline + the chip cloud */}
      <div class="landing-flow">
        <GrowHead text="Tools I've used." inView={inView} class="landing-technologies__head" />

        <div class="landing-technologies__cloud">
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
      </div>

      {/* decorative full-bleed: the band extends to the page's edge so the read stays good as the crimson sidebar slides over it — the marquee runs the full viewport, the panel riding on top of its right end */}
      <glaphic-marquee
        ref={marqueeRef}
        class="landing-technologies__marquee"
        aria-hidden="true"
      />
    </section>
  );
}