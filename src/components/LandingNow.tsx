// New-design landing section four — "What I'm up to." (the now block;
// #now, which the sidebar's nav jumps to). Same layout grammar as the
// sections above it (a 1440x900-artboard section over the paper ground,
// the padded flow grid), carrying Eliot's 2026-10-30 brief — the
// carousel is out, the three project bands are in:
//   header    the bloom strip: a full non-sidebar-width band with 2px
//             ink borders top+bottom and the headline centered inside
//             as glaphic-text variant="infinite" axis="x+" — the static
//             fibonacci dissolving shadow-stack bloom. The shadow ink
//             is EXPLICIT: it derives from the fill ink by default, and
//             warm-white on the paper ground would read invisible
//   bands     Rite · glaphicUI · Novel, 350px tall at desktop: the
//             project name in big letters left (Space Grotesk 700 at
//             the band-height fill size, fit-capped per band so the
//             fluro block + the image keep their minimums), the fluro
//             block (glaphic-plate tone="cyan" — the site's #14F1C8
//             read) with the band's copy printed on it, the project
//             image filling the rest; a "go to ->" chamfered button
//             over the image (Rite + glaphicUI only — novel carries
//             none) to the project's detail route
//   marquees  two full-bleed TICKER instances BETWEEN the bands (the
//             about's band voice; strings/speed ride imperatively —
//             JSX attributes can't carry the arrays)
// The reveal: the strip + bands RISE into place (the carousel's old
// ride), the marquees DROP (the other sections' band idiom) — all
// two-way on the section's .ln-in flag.
//
// COPY (provenance): Rite's band copy is the live slide description
// verbatim; glaphicUI's and novel's are the landing's draft lines. The
// DRAFT tags bind to the entries' copy flags in src/data/projects.ts —
// flip an entry to 'live' (when Eliot's real line lands) and its tag
// unpins itself.
import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { projectByTitle } from '../data/projects';
import { rideOutUp, TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A';
const FLURO = '#14F1C8';
const PAPER = '#F2F5EB'; // the grow-head's warm white
const PAPER_BRIGHT = '#F9FAF4'; // the CTA recipe's paper

// the CTA's recipe — the --glaphic-button-* token surface at the
// site's inks: ink surface, paper label, fluro hover with the label
// flipping to ink. The rim tokens ride the library's solid defaults,
// which are exactly these two inks as well (ink at rest, fluro on
// hover)
const GO_TO = {
  '--glaphic-button-surface': INK,
  '--glaphic-button-text': PAPER_BRIGHT,
  '--glaphic-button-hover-surface': FLURO,
  '--glaphic-button-hover-text': INK,
};

// the three bands in the brief's order; the image, the id and the
// provenance flag resolve through projectByTitle (a missing title is a
// data error — the lookup throws). The copy is the section's own:
// Rite's line is the live slide description verbatim; the other two
// are the landing's draft lines. `cta` is the brief's read: novel
// carries no button and no route
const BANDS = [
  {
    title: 'Rite',
    cta: true,
    copy: "Right now, I'm writing a novel. While writing it, I grew frustrated with Google Docs — so I decided to build my own word processor, Rite: a first of its kind integrated writing environment. Still in development, but coming along well.",
  },
  {
    title: 'glaphicUI',
    cta: true,
    copy: 'glaphic — the web-component library this landing is built from, growing component by component.',
  },
  {
    title: 'Novel',
    cta: false,
    copy: 'The novel itself — the writing Rite is being built for.',
  },
] as const;

// the big name's fit — one advance-width model: a Space Grotesk 700
// glyph runs ~ADVANCE_EM em on average, so a name's run is
// ~ADVANCE_EM x chars em. The default size is the band-height fill
// min(24vw, 345px); --ln-name-fit steps a long name below it just
// enough to keep its run inside NAME_SHARE of the band's width,
// reserving the fluro block + the image their minimums — the Projects
// card's --pc-fit step-down, generalized to the bands. The measured
// pass tunes this pair once
const NAME_SHARE = 60; // the name run's max share of the band (%)
// 0.52 = the measured pass's model (run 1's rendered advances averaged
// ~0.50 em: Rite 0.479 · glaphicUI 0.502 · Novel 0.529) — held above
// the widest so no name's run overshoots its share
const ADVANCE_EM = 0.52; // the model's average glyph advance (em)
const nameFit = (title: string) => (NAME_SHARE / (ADVANCE_EM * title.length)).toFixed(2);

export function LandingNow() {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const marqueeEls = useRef<(HTMLElement | null)[]>([]);
  const [, navigate] = useLocation();
  const [inView, setInView] = useState(false);

  // the ride-out wiring: the content translates up as the section
  // exits (the sections' idiom), reversing on the way back
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // the marquees take array properties, which JSX attributes can't
  // carry reliably to Lit — both ticker instances set them imperatively
  useEffect(() => {
    for (const el of marqueeEls.current) {
      const m = el as unknown as { strings: string[]; speed: number } | null;
      if (!m) continue;
      m.strings = TICKER;
      m.speed = 26;
    }
  }, []);

  // the two-way reveal — NO latch on purpose: the section's flag shows
  // and toggles (the about/technologies latch theirs; this section's
  // rides hand the pre-reveal poses back behind the reader and replay
  // on return — the old carousel's read, kept)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  const bands = BANDS.map((band) => ({
    ...band,
    project: projectByTitle(band.title),
    fit: `${nameFit(band.title)}cqw`,
  }));

  return (
    <section
      id="now"
      ref={hostRef}
      class={`landing-now ${inView ? 'ln-in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-now {
          position: relative;
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .landing-now * { margin: 0; box-sizing: border-box; }

        /* the full non-sidebar flush (the strip grammar): the header
           strip + the bands hold ONE flush — a full-span flow item with
           negative margins, hard left at the viewport's edge, hard
           right at the parked panel's left edge (the flow's 3.9vw
           padding + the panel's 24vw ≈ the 20.1vw right pull). The
           reveal holds each piece 14vh below its seat and rides it up
           as one move; a TRANSITION, not a forwards fill — a filled
           wrapper stays composited and isolates its blends (the pool
           plates' trap), and the two-way flag reverses the ride with
           the scroll */
        .ln-header-strip,
        .ln-band {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          transform: translateY(14vh);
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s;
        }
        .landing-now.ln-in .ln-header-strip,
        .landing-now.ln-in .ln-band {
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ln-header-strip, .ln-band { transition: none; transform: none; }
        }

        /* the bloom strip: 2px ink borders top+bottom, the headline
           centered — the element's tokens are explicit: the fill ink
           the section's warm-white print, the shadow ink INK (the
           element derives the shadow from the fill by default, which
           would read invisible on paper), the font the grow-head clamp
           scale */
        .ln-header-strip {
          margin-top: 3.6vh;
          display: grid;
          place-items: center;
          padding-block: 3.2vh;
          border-block: 2px solid ${INK};
        }
        .ln-bloom {
          --glaphic-text-ink: ${PAPER};
          --glaphic-text-shadow-ink: ${INK};
          --glaphic-text-font: 700 clamp(34px, 4.9vw, 70px)/1.05
            var(--f-disp, 'Space Grotesk', sans-serif);
          letter-spacing: -0.02em;
        }

        /* the project bands (350px at desktop) */
        .ln-band {
          position: relative;
          height: 350px;
          margin-top: 2.2vh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          /* the band is its own inline-size container: the name fit,
             the fluro block's share and the CTA's inset read off the
             band's own width, so long names scale inside it at every
             viewport */
          container-type: inline-size;
        }
        /* the big name: the band-height fill size, fit-capped per band
           via --ln-name-fit so long names keep the fluro block + the
           image their minimums */
        .ln-band-name {
          flex: 0 1 auto;
          min-width: 0;
          align-self: center;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: min(24vw, 345px, var(--ln-name-fit, 345px));
          line-height: 0.92;
          white-space: nowrap;
        }
        /* the fluro block: the plate paints the tone, the copy prints
           ink on it (the plate is paint-only — the copy sits above the
           paint) */
        .ln-band-fluro {
          position: relative;
          flex: 0 0 auto;
          width: 26cqw;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ln-band-plate {
          position: absolute;
          inset: 0;
        }
        .ln-band-copy {
          position: relative;
          padding: 2cqw 1.8cqw;
          font-size: clamp(11px, 1.05vw, 15px);
          line-height: 1.5;
        }
        /* the shot fills the rest, covering the media's box whole (the
           fill read the carousel's slotted slides carried) */
        .ln-band-media {
          position: relative;
          flex: 1 1 auto;
          min-width: 0;
        }
        .ln-band-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* the CTA rides over the shot, right-aligned with an inset,
           vertically centered; novel renders none (the band map
           carries the read) */
        .ln-band-cta {
          position: absolute;
          right: 2.4cqw;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        /* the two TICKER marquees — the about's band voice, full-bleed
           at BOTH edges (the panel rides over the right run), between
           the bands, in the flow; each drops from above on the reveal
           and hands the pose back through the base transition when the
           two-way flag flips off */
        .ln-marquee {
          grid-column: 1 / -1;
          margin-top: 2.2vh;
          margin-inline: -3.9vw -3.9vw;
          height: 48px;
          z-index: 2;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the component's */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
          transform: translateY(-22vh);
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1);
        }
        .landing-now.ln-in .ln-marquee {
          animation: gl-marquee-drop 0.7s cubic-bezier(0.25, 1, 0.4, 1) both;
        }
        /* reduced motion: no drop and no rise — the pieces seat
           instantly (the base transforms must clear too, or they hold
           clipped out of place; these sit AFTER the gated rules so
           they win the cascade) */
        @media (prefers-reduced-motion: reduce) {
          .ln-marquee { transform: none; }
          .landing-now.ln-in .ln-marquee { animation: none; }
        }

        /* the draft tag on the band copy (today's treatment — mirrors
           the detail plate's pd-draft: honest provenance printed so
           draft copy can't pass as sourced; it binds to the entry's
           copy flag). Block display: it owns its line above the copy.
           Its margins beat the root's * reset — same block, later */
        .ln-draft {
          display: block;
          margin: 0 0 10px;
          border: 2px solid ${INK};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding: 3px 8px;
        }

        /* mobile: the bands become stacked cards (title, text, image,
           CTA — the DOM order reads it in one flex column); the
           order:2 rule rides (the journey's mobile order map is
           Phase 4's) */
        @media (max-width: 899px) {
          .landing-now { height: auto; order: 2; }
          .ln-header-strip,
          .ln-band { margin-inline: -6vw 0; }
          .ln-header-strip { margin-top: 8vh; padding-block: 2.6vh; }
          .ln-band {
            height: auto;
            flex-direction: column;
            gap: 16px;
          }
          .ln-band-fluro { width: auto; }
          .ln-band-copy { padding: 18px 16px; font-size: 13px; }
          /* the card image's depth — the cover crop fills it */
          .ln-band-media { height: 52vw; }
          .ln-band-cta {
            position: static;
            transform: none;
            align-self: flex-start;
          }
          .ln-marquee { margin-inline: -6vw; }
        }
      `}</style>

      <div class="ln-flow" ref={flowRef}>
        {/* the bloom strip — the headline is the strip's one content */}
        <h2 class="ln-header-strip">
          <glaphic-text class="ln-bloom" variant="infinite" axis="x+">
            What I'm up to.
          </glaphic-text>
        </h2>

        {bands.map((band, i) => (
          <Fragment key={band.title}>
            <article class="ln-band" style={{ '--ln-name-fit': band.fit }}>
              <h3 class="ln-band-name">{band.project.title}</h3>
              <div class="ln-band-fluro">
                {/* the plate is paint-only: the copy sits above it */}
                <glaphic-plate class="ln-band-plate" tone="cyan" aria-hidden="true" />
                <p class="ln-band-copy">
                  {band.project.copy === 'draft' && (
                    <span class="ln-draft">DRAFT COPY — AWAITING ELIOT</span>
                  )}
                  {band.copy}
                </p>
              </div>
              <div class="ln-band-media">
                <img src={band.project.image} alt={band.project.title} loading="lazy" />
              </div>
              {band.cta && (
                <glaphic-button
                  class="ln-band-cta"
                  variant="solid"
                  chamfered
                  style={{ ...GO_TO }}
                  onClick={() => navigate('/projects/' + band.project.id)}
                >
                  {'go to ->'}
                </glaphic-button>
              )}
            </article>
            {/* the marquees ride BETWEEN the bands (none after the last) */}
            {i < bands.length - 1 && (
              <glaphic-marquee
                class="ln-marquee"
                aria-hidden="true"
                ref={(el) => { marqueeEls.current[i] = el; }}
              />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}