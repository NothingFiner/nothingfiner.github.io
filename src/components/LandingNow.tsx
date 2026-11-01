// New-design landing section four — "What I'm up to." (the now block;
// #now, which the sidebar's nav jumps to). Same layout grammar as the
// sections above it (a 1440x900-artboard section over the paper ground,
// the padded flow grid), carrying both Eliot's 2026-10-30 brief (the
// carousel out, the three project bands in) and that day's round-A
// feedback (the section rebuilt over the bands' photos):
//   header    the bloom BAND: the strip is a solid grey band (2px ink
//             borders kept top+bottom) and the headline's fill rides the
//             SAME grey — the band reads empty at rest. The fill turns
//             over to the warm white as the ink shadows BLOOM OUTWARD
//             from the glyphs — the x+- axis: the rungs travel BOTH ways
//             now (right as before, and left — mirrored pairs). The
//             printed stack is still the library's fib ladder; the
//             reveal transitions it on the light-DOM copy span, because
//             a shadow list can only transition on the element carrying
//             it and the slot that carries the printed one is
//             unreachable from the page's tree (the slotted span is not)
//   bands     Rite · glaphicUI · Novel, 30vh tall at desktop: the LEFT
//             62% is the project's photo, filling the band as one
//             background and chamfered on its right edge (the plates'
//             20px cuts — the clip also scopes the title's difference
//             blend to what sits inside the shot); the title sits OVER
//             it, left justified at the band-height fill size (26vh,
//             stepped down per name by --ln-name-fit so a long run
//             keeps across its photo), blended difference so the photo's
//             inks print through the fill; the 12px crimson line rides
//             the band's vertical middle UNDER the glyphs. The RIGHT 38%
//             is the fluro block — the plate paints the tone, the copy
//             and the "go to ->" CTA print on it (Rite + glaphicUI only;
//             novel carries none) to the project's detail route
//   marquees  two full-bleed TICKER instances BETWEEN the bands — NO
//             ride of their own: they are the bands' borders, present
//             before the reveal and untouched by it; strings/speed ride
//             imperatively — JSX attributes can't carry the arrays
//   entry     the strip + bands RISE into place, each band overshooting
//             an alternate +/-2deg rotation on the way (odd bands
//             counter-clockwise, even clockwise — the second band turns
//             opposite the first) and settling level
// The reveal: all two-way on the section's .landing-now--in flag.
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
const GREY = '#686474'; // the site's solid grey — the bloom band's ground

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
// are the landing's draft lines. cta is the brief's read: novel
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
// 26vh; --ln-name-fit steps a long name below it just enough to keep
// its run inside NAME_SHARE of the band's width — the share of the
// photo the title may run across (the shot's 62% minus air) — the
// Projects card's --pc-fit step-down, generalized to the bands. The
// measured pass tunes this pair once
const NAME_SHARE = 58; // the name run's max share of the band (%)
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
  // on return — the ride is the section's own signature, kept)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  const bands = BANDS.map((band, i) => ({
    ...band,
    project: projectByTitle(band.title),
    fit: `${nameFit(band.title)}cqw`,
    // the entry's overshoot: odd bands counter-rotate — the second
    // band's entrance turns the opposite way, per the brief
    tilt: i % 2 ? '-2deg' : '2deg',
  }));

  return (
    <section
      id="now"
      ref={hostRef}
      class={`landing-now ${inView ? 'landing-now--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-now {
          position: relative;
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .landing-now * { margin: 0; box-sizing: border-box; }

        /* the full non-sidebar flush (the strip grammar): the header
           band + the bands hold ONE flush — a full-span flow item with
           negative margins, hard left at the viewport's edge, hard
           right at the parked panel's left edge (the flow's 3.9vw
           padding + the panel's 24vw = the 20.1vw right pull). The
           reveal holds each piece 14vh below its seat and rides it up
           as one move, each band overshooting its alternate rotation
           (--ln-tilt) before settling level; a TRANSITION, not a
           forwards fill — a filled wrapper stays composited and
           isolates its blends (the pool plates' trap), and the two-way
           flag reverses the ride with the scroll */
        .landing-now__header-strip,
        .landing-now__band {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          transform: translateY(14vh) rotate(var(--ln-tilt, 0deg));
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s;
        }
        .landing-now--in .landing-now__header-strip,
        .landing-now--in .landing-now__band {
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-now__header-strip, .landing-now__band { transition: none; transform: none; }
        }

        /* the bloom band: solid grey, 2px ink borders top+bottom, the
           headline centered */
        .landing-now__header-strip {
          margin-top: 3.6vh;
          display: grid;
          place-items: center;
          padding-block: 3.2vh;
          border-block: 2px solid ${INK};
          background: ${GREY};
        }
        .landing-now__bloom {
          --glaphic-text-font: 700 clamp(34px, 4.9vw, 70px)/1.05
            var(--f-disp, 'Space Grotesk', sans-serif);
          letter-spacing: -0.02em;
        }
        /* the resting read: the fill the SAME grey as its band (the
           glyphs vanish), no shadows out of the glyphs. The reveal
           flips the fill to the warm white while the shadows print
           outward from the glyphs and back in — the library's fib
           rungs (1 2 4 7 12 20 33 54 88) at its infinite fade alphas,
           INK's channels, mirrored to a pair per rung so BOTH ways
           travel. The resting list carries the arrived list's length
           at alpha 0 and offset 0: equal-length lists transition
           rung-for-rung on every engine, where the none-to-list pad
           behavior is not guaranteed — the 0-in-alpha channels are
           exactly the shadow ink's */
        .landing-now__bloom-copy {
          color: ${GREY};
          text-shadow:
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0,
            rgba(13, 2, 33, 0) 0 0, rgba(13, 2, 33, 0) 0 0;
          transition:
            text-shadow 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s,
            color 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s;
        }
        .landing-now--in .landing-now__bloom-copy {
          color: ${PAPER};
          text-shadow:
            rgba(13, 2, 33, 0.64) 1px 0, rgba(13, 2, 33, 0.64) -1px 0,
            rgba(13, 2, 33, 0.56) 2px 0, rgba(13, 2, 33, 0.56) -2px 0,
            rgba(13, 2, 33, 0.48) 4px 0, rgba(13, 2, 33, 0.48) -4px 0,
            rgba(13, 2, 33, 0.4) 7px 0, rgba(13, 2, 33, 0.4) -7px 0,
            rgba(13, 2, 33, 0.32) 12px 0, rgba(13, 2, 33, 0.32) -12px 0,
            rgba(13, 2, 33, 0.25) 20px 0, rgba(13, 2, 33, 0.25) -20px 0,
            rgba(13, 2, 33, 0.18) 33px 0, rgba(13, 2, 33, 0.18) -33px 0,
            rgba(13, 2, 33, 0.12) 54px 0, rgba(13, 2, 33, 0.12) -54px 0,
            rgba(13, 2, 33, 0.08) 88px 0, rgba(13, 2, 33, 0.08) -88px 0;
        }
        /* the reduce path: no bloom ride and no band rise — both states
           apply instantly (these sit AFTER the base rules so they win
           the cascade) */
        @media (prefers-reduced-motion: reduce) {
          .landing-now__bloom-copy { transition: none; }
        }

        /* the project bands (30vh at desktop) */
        .landing-now__band {
          position: relative;
          height: 30vh;
          margin-top: 2.2vh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          /* the band is its own inline-size container: the name fit,
             the copy's share and the CTA's inset read off the band's
             own width, so long names scale inside it at every viewport */
          container-type: inline-size;
        }
        /* the left 62%: the photo fills the band as one background,
           chamfered on its right edge (the plates' 20px cuts); the clip
           also scopes the title's difference blend to what sits inside
           the shot (a clip-path is its own stacking context) */
        .landing-now__band-shot {
          position: relative;
          flex: 0 0 62%;
          overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
        .landing-now__band-shot img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* the crimson midline: the 12px stroke riding the band's
           vertical middle — where the fill-size title centers its run —
           under the glyphs (z 1; the title rides at 2) */
        .landing-now__band-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 12px;
          margin-top: -6px;
          background: ${RED};
          z-index: 1;
        }
        /* the title: difference-blended over the photo (the photo's
           inks print through the fill, inverted — and a third color
           prints where the run crosses the crimson line), left
           justified at the fill size, which fills the band's height
           whole — the em box rides the 30vh band and --ln-name-fit
           steps a long name down to stay across its photo; the ink
           sits inside the em box with measured air (the driver's
           ink-fit check holds) */
        .landing-now__band-name {
          position: absolute;
          inset-block: 0;
          left: 0;
          display: flex;
          align-items: center;
          z-index: 2;
          mix-blend-mode: difference;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: min(30vh, var(--ln-name-fit, 30vh));
          line-height: 1;
          white-space: nowrap;
          color: ${PAPER};
        }
        /* the right 38%: the fluro block — the plate paints the tone,
           the copy and the CTA print above the paint */
        .landing-now__band-fluro {
          position: relative;
          flex: 0 0 38%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 2cqw 1.8cqw;
          gap: 2.6vh;
        }
        .landing-now__band-plate {
          position: absolute;
          inset: 0;
        }
        .landing-now__band-copy {
          position: relative;
          font-size: clamp(11px, 1.05vw, 15px);
          line-height: 1.5;
        }
        .landing-now__band-cta {
          position: relative;
        }

        /* the two TICKER marquees — the bands' borders, and so NO ride
           of their own: present before the reveal, the bands rise
           between them. Full-bleed at BOTH edges (the panel rides over
           the right run) */
        .landing-now__marquee {
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
        }

        /* the draft tag on the band copy (today's treatment — mirrors
           the detail plate's project-detail__draft: honest provenance printed so
           draft copy can't pass as sourced; it binds to the entry's
           copy flag). Block display: it owns its line above the copy.
           Its margins beat the root's * reset — same block, later */
        .landing-now__draft {
          display: block;
          margin: 0 0 10px;
          border: 2px solid ${INK};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding: 3px 8px;
        }

        /* mobile: the bands become stacked cards (photo title-card,
           copy, CTA — the DOM order reads it in one flex column); the
           order value = the Phase-4 map's now slot (the journey's 3rd
           section) */
        @media (max-width: 899px) {
          .landing-now { height: auto; /* the Phase-4 map's now slot (the journey's 3rd section) */ order: 2; }
          .landing-now__header-strip,
          .landing-now__band { margin-inline: -6vw 0; }
          .landing-now__header-strip { margin-top: 8vh; padding-block: 2.6vh; }
          .landing-now__band { height: auto; flex-direction: column; }
          /* the column's % flex-basis would fight the explicit heights
             (a basis resolves against the column's indefinite height and
             collapses the absolute-only shot to 0): the heights are the
             drivers here */
          .landing-now__band-shot { flex: 0 0 auto; height: 52vw; }
          .landing-now__band-name { font-size: min(24vw, var(--ln-name-fit, 24vw)); }
          .landing-now__band-fluro { flex: 0 0 auto; padding: 18px 16px; }
          .landing-now__band-copy { font-size: 13px; }
          .landing-now__marquee { margin-inline: -6vw; }
        }
      `}</style>

      <div class="landing-flow" ref={flowRef}>
        {/* the bloom band — the headline is the band's one content */}
        <h2 class="landing-now__header-strip">
          <glaphic-text class="landing-now__bloom" variant="infinite" axis="x+-">
            <span class="landing-now__bloom-copy">What I'm up to.</span>
          </glaphic-text>
        </h2>

        {bands.map((band, i) => (
          <Fragment key={band.title}>
            <article
              class="landing-now__band"
              style={{ '--ln-name-fit': band.fit, '--ln-tilt': band.tilt }}
            >
              {/* the photo half — the title over it, the line under
                  the title's glyphs */}
              <div class="landing-now__band-shot">
                <img src={band.project.image} alt={band.project.title} loading="lazy" />
                <span class="landing-now__band-line" aria-hidden="true" />
                <h3 class="landing-now__band-name">{band.project.title}</h3>
              </div>
              {/* the fluro half — the plate is paint-only: the copy and
                  the CTA print above it */}
              <div class="landing-now__band-fluro">
                <glaphic-plate class="landing-now__band-plate" tone="cyan" aria-hidden="true" />
                <p class="landing-now__band-copy">
                  {band.project.copy === 'draft' && (
                    <span class="landing-now__draft">DRAFT COPY — AWAITING ELIOT</span>
                  )}
                  {band.copy}
                </p>
                {band.cta && (
                  <glaphic-button
                    class="landing-now__band-cta"
                    variant="solid"
                    chamfered
                    style={{ ...GO_TO }}
                    onClick={() => navigate('/projects/' + band.project.id)}
                  >
                    {'go to ->'}
                  </glaphic-button>
                )}
              </div>
            </article>
            {/* the marquees ride BETWEEN the bands (none after the last) */}
            {i < bands.length - 1 && (
              <glaphic-marquee
                class="landing-now__marquee"
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