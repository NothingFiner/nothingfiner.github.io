// New-design landing section — "Past Work." (the past block; #past, the
// sidebar's new fourth target). Eliot's 2026-10-30 brief, built on D7's
// defaults — the bare placeholder (grow head, an unstyled plate/tape and
// a dead grid item) is out; TWO category bands are in:
//   bands  E-Commerce (Forever 21 · Reformation · Brooks Brothers) and
//          Custom Application Development (Batesville), side by side and
//          filling the full non-sidebar width (hard left at the
//          viewport's edge, hard right at the parked panel). Each: the
//          head entry's image as the left cover-fill shot (the now
//          bands' round-A read — the plates' 20px chamfers on the right
//          edge, the category name difference-blended over the photo),
//          and the copy on the fluro plate right: every entry's drafted
//          responsibility bullets under its own name label, the DRAFT
//          tag leading the copy (D7/D13 — nothing drafted can pass as
//          sourced)
//   entry  the band pair rises into place on the latched arrival (the
//          sections' -64% gate idiom); the see-all CTA (D11's one CTA
//          voice) rides the section's foot to /past
// The category mapping is THIS section's own default (D7): keyed by the
// entries' tags, Eliot remaps with one array edit — the data file stays
// untouched. The bullets are the entries' responsibilities verbatim
// (drafted placeholders — the data file's provenance note owns the why).
import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { GrowHead } from './GrowHead';
import { pastWorkByTag } from '../data/pastWork';
import { rideOutUp } from './landing-shared';

const INK = '#0D0221';
const PAPER = '#F2F5EB'; // the grow-head's warm white (the title's fill)

// the CTA recipe — D11's ONE voice: the same glaphic-button token
// surface LandingNow's go-to buttons carry (ink surface, paper label,
// fluro hover). A per-module copy by design: the revamp's second use —
// the abstraction factors on the third
const GO_TO = {
  '--glaphic-button-surface': INK,
  '--glaphic-button-text': '#F9FAF4',
  '--glaphic-button-hover-surface': '#14F1C8',
  '--glaphic-button-hover-text': INK,
};

// the category mapping (the D7 default): each band lists its members'
// tags in print order; the head entry's main image stands for the band
const CATEGORIES = [
  { name: 'E\u2011Commerce', tags: ['forever_21', 'reformation', 'brooks_brothers'] },
  { name: 'Custom Application Development', tags: ['batesville'] },
] as const;

// the big name's fit — the now bands' advance-width model RETUNED for
// the past names' real advances (the driver's measured runs: E-Commerce
// 0.607 em, Custom Application Development's Application 0.578 — the
// widest governs): the size bounds to the longest UNBREAKABLE chunk
// (the non-breaking hyphen keeps E-Commerce whole, so its chunk is the
// name itself). --lp-name-fit steps the name below the vh cap just
// enough to keep its chunk across its shot — the 2cqw air stays inside
// the shot's 40%
const ADVANCE_EM = 0.62; // the past names' measured advance ceiling (em)
const LP_SHARE = 36; // the name run's max share of its band (%)
const longestChunk = (name: string) =>
  name.split(' ').reduce((acc, word) => (word.length > acc.length ? word : acc), '');
const nameFit = (name: string) => (LP_SHARE / (ADVANCE_EM * longestChunk(name).length)).toFixed(2);

export function LandingPast() {
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [, navigate] = useLocation();

  // the ride-out wiring: the content translates up as the section
  // exits (the sections' idiom), reversing on the way back
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // the section's own arrival latch — the LATCHED idiom: this one means
  // once, the disconnect in the callback is its whole point (the
  // sections' sticky reveal; the past flag does NOT replay — the now
  // section's two-way ride is that section's own signature). The -64%
  // band is the site's section-arrival gate: the top must reach the
  // viewport's upper 36% (earlier gates failed in both directions —
  // the plain 25% threshold fired ~550px deep)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -64% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  const categories = CATEGORIES.map((cat) => {
    const works = cat.tags.map((t) => pastWorkByTag(t));
    return {
      name: cat.name,
      works,
      image: works[0].image,
      fit: `${nameFit(cat.name)}cqw`,
    };
  });

  return (
    <section
      id="past"
      ref={hostRef}
      class={`landing-past ${inView ? 'landing-past--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-past {
          position: relative;
          height: auto;
          /* the tail reserves the sticky band's page-end slot; the 8vh
             exhale keeps the see-all clear of the landing's rest read */
          padding-bottom: calc(37.5vh + 8vh);
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .landing-past * { margin: 0; box-sizing: border-box; }

        /* the band pair: the full non-sidebar flush (the strip grammar —
           hard left at the viewport's edge, hard right at the parked
           panel's 20.1vw pull), the halves holding a 1.2vw seam. The
           reveal holds the pair 14vh below its seat and rides it up as
           one move; a TRANSITION, not a forwards fill (a filled wrapper
           stays composited and isolates its blends — the pool plates'
           trap) */
        .landing-past__bands {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          margin-top: 2.2vh;
          display: flex;
          gap: 1.2vw;
          align-items: stretch;
          transform: translateY(14vh);
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s;
        }
        .landing-past--in .landing-past__bands { transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .landing-past__bands { transition: none; transform: none; }
        }

        /* one category band: the photo shot left, the copy plate right;
           the pair's height rides the copy's mass (the E-Commerce plate
           drives), the other band's shot stretches to meet it */
        .landing-past__band {
          position: relative;
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          /* the band is its own inline-size container: the name fit and
             the copy's inset read off the band's own width */
          container-type: inline-size;
        }
        .landing-past__band-shot {
          position: relative;
          flex: 0 0 40%;
          overflow: hidden;
          /* the now bands' chamfer: 20px cuts on both right corners —
             the clip also scopes the name's difference blend to the
             shot (a clip-path is its own stacking context) */
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
          min-height: 30vh;
        }
        .landing-past__band-shot img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* the category name: difference-blended over the photo, wrapped
           (the long category fills its lines, balanced) and bounded by
           --lp-name-fit so no chunk crosses onto the copy plate */
        .landing-past__band-name {
          position: absolute;
          inset-block: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          z-index: 1;
          mix-blend-mode: difference;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: min(18vh, var(--lp-name-fit, 18vh));
          line-height: 1.05;
          white-space: normal;
          text-wrap: balance;
          color: ${PAPER};
        }
        /* the copy plate: the plate paints the tone, the draft tag and
           the member groups print above the paint */
        .landing-past__band-fluro {
          position: relative;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2.2vh 2.2cqw 2.6vh;
          gap: 1.6vh;
        }
        .landing-past__band-plate {
          position: absolute;
          inset: 0;
        }
        /* the draft tag — the now bands' honest-provenance treatment,
           copied (the now section owns its class) */
        .landing-past__draft {
          position: relative;
          border: 2px solid ${INK};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding: 3px 8px;
        }
        /* the member label: the entry's name leads its bullets in the
           mono label voice (the draft tag's scale, no border) */
        .landing-past__band-member {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        /* the drafted responsibilities, verbatim: the list voice sits a
           step under the band-copy clamp — the plate's density read */
        .landing-past__band-bullets {
          padding-left: 14px;
          font-size: clamp(10px, 0.78vw, 11px);
          line-height: 1.5;
        }

        /* the see-all CTA (D11's one voice) — a normal flow item at the
           section's left content edge, under the pair */
        .landing-past__see-all {
          grid-column: 1 / -1;
          margin-top: 4.2vh;
          justify-self: start;
        }

        /* mobile: the two bands stack full width; each becomes the
           card read (photo title-card over its bullets) */
        @media (max-width: 899px) {
          /* the tail reserves the sticky band's page-end slot */
          .landing-past {
            /* the Phase-4 map's past slot (the journey's 4th section) */
            order: 3;
            padding-bottom: calc(37.5vh + 8vh);
          }
          .landing-past__bands { margin-inline: -6vw 0; flex-direction: column; gap: 2.2vh; }
          /* the column's % bases fight the explicit heights: the
             auto bases and the heights drive (the now cards' fix;
             a 1 1 0 band basis collapses in the auto-height column) */
          .landing-past__band { flex: 0 0 auto; flex-direction: column; }
          .landing-past__band-shot { flex: 0 0 auto; width: 100%; min-height: 44vw; }
          .landing-past__band-name { font-size: min(24vw, var(--lp-name-fit, 24vw)); }
          .landing-past__band-fluro { width: 100%; padding: 18px 16px; gap: 12px; }
          .landing-past__band-bullets { font-size: 12px; }
          .landing-past__see-all { margin-top: 3vh; }
        }
      `}</style>

      {/* the flow grid + head slot print from landing.css's shared layer */}
      <div class="landing-flow" ref={flowRef}>
        <GrowHead text="Past Work." inView={inView} class="landing-past__head" />

        {/* the pair: two half-width bands in the full-bleed row; the
            row owns the flush and the arrival's rise */}
        <div class="landing-past__bands">
          {categories.map((cat) => (
            <article class="landing-past__band" key={cat.name} style={{ '--lp-name-fit': cat.fit }}>
            {/* the photo shot — the head entry's main image cover-fills
                it whole, the category name over it */}
            <div class="landing-past__band-shot">
              <img src={cat.image} alt={`The ${cat.works[0].name.toLowerCase()} storefront build`} loading="lazy" />
              <h3 class="landing-past__band-name">{cat.name}</h3>
            </div>
            {/* the copy plate — the plate paints, the tag + groups print */}
            <div class="landing-past__band-fluro">
              <glaphic-plate class="landing-past__band-plate" tone="cyan" aria-hidden="true" />
              <span class="landing-past__draft">DRAFT COPY — AWAITING ELIOT</span>
              {cat.works.map((work) => (
                <Fragment key={work.tag}>
                  <b class="landing-past__band-member">{work.name}</b>
                  <ul class="landing-past__band-bullets">
                    {work.responsibilities.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </Fragment>
              ))}
            </div>
          </article>
          ))}
        </div>

        {/* the see-all: the pair's one route out */}
        <glaphic-button
          class="landing-past__see-all"
          variant="solid"
          chamfered
          style={{ ...GO_TO }}
          onClick={() => navigate('/past')}
        >
          {'see all ->'}
        </glaphic-button>
      </div>
    </section>
  );
}