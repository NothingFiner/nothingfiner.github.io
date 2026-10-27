// New-design projects page — the mock's flat-index stage (a 12-col
// 1440x900-artboard page like the landing sections: a clear stage over
// the site's recolored lava lamp, no glass, no alpha). Three moves:
//   head    the shared grow headline "Projects" top-left (the landing
//           sections' GrowHead, revealed on the section's IO flag)
//   cards   the design/projects-card.svg card: a flat 3:2 plate with the
//           20px clipped top-left corner, the 2px keyline around it (the
//           keyline is the card's own paint and the plate sits inside it
//           with the parallel inset clip — on the notch's diagonal that
//           inset runs along the cut, see .pc-plate), a mono meta row
//           (the PRJ index left, the project's lowercase underscore tag
//           right), the screenshot filling the rest (object-fit cover)
//           and the big blend-difference print riding over it — one <a>,
//           whole card is the link to /projects/:id (hash anchor, no
//           buttons)
//   chrome  the landing's own footer band (SiteFooter): pool
//           menu + contact icons bottom-right, the copyright bottom-left
//           — mounted once per route by app.tsx (the page's ground is
//           the band's paper pose; --ab-p never starts on this page, so
//           the band holds its hero pose: the '////' line under the
//           page's left edge, ink icons on the right)
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from '../components/GrowHead';
import { projects } from '../data/projects';

// the card's inks (design/projects-card.svg — solid paints only)
const KEYLINE = '#9D99AB';
const PLATE = '#F2F5EB';
const GREY = '#686474';
const INK = '#0D0221';

// the meta row's lowercase underscore tag — the project name filed
const tag = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

export function Projects() {
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  // reveal the grow once the page's fold enters (as the landing sections)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div class="pr-page" ref={hostRef}>
      <style>{`
        .pr-page {
          position: relative;
          min-height: 100vh;
          /* the stage is clear over the site's lava lamp (mounted
             site-wide by app.tsx for this route) — the lamp prints its
             recolored blobs on its own paper ground, as the chat page's
             stage does; the cards' solid plates carry themselves.
             The shared band is the FOOTER pose now (in flow, no sticky
             pull-up) so no clip is needed for a band margin */
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .pr-page * { margin: 0; box-sizing: border-box; }

        /* ── the padded flow grid (as the landing sections) ──────── */
        .pr-flow {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 1.1vw;
          row-gap: 0;
          /* the band below is in flow (the footer pose) — no sticky
             slot to reserve in the page's own tail */
          padding: 3.6vh 3.9vw 4vh;
        }
        .pr-head { grid-column: 1 / -1; }

        /* ── the card index ─────────────────────────────────────── */
        .pr-grid {
          grid-column: 1 / -1;
          margin-top: 12.6vh;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: clamp(16px, 2vw, 32px);
          align-items: start;
        }

        /* ── the mock's card ──────────────────────────────────────
           flat 3:2 plate: the 2px keyline is the card's own paint (the
           card's background showing around the plate), the plate sits
           inside with the parallel inset clip. On the notch's diagonal
           the inset reads along the cut, not the perpendicular: the
           notch's face is the line x+y=20 (the cut removes x+y<20), so
           the keyline band is x+y ∈ [20, 20+2√2] and the plate cuts at
           18.83px = (22.83 - 2·2) in its own box. The card is the
           container so the mock's 456-wide proportions print at any
           column width. */
        .pc-card {
          display: block;
          position: relative;
          aspect-ratio: 3 / 2;
          padding: 2px;
          background: ${KEYLINE};
          clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
          container-type: inline-size;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.18s ease-out, filter 0.18s ease-out,
            background-color 0.18s ease-out;
        }
        /* the lift is a hard offset print (drop-shadow rides the clip,
           a box-shadow would not) and the keyline goes full ink */
        .pc-card:hover,
        .pc-card:focus-visible {
          filter: drop-shadow(4px 4px 0 #14F1C8);
          background-color: ${INK};
        }
        .pc-card:focus-visible {
          outline: none;
        }
        .pc-plate {
          width: 100%;
          height: 100%;
          background: ${PLATE};
          /* straight edges inset by the card's 2px padding; the notch's
             diagonal cuts 2px wider in (18.83px, see above) so the
             keyline band rides the face of the cut */
          clip-path: polygon(18.83px 0, 100% 0, 100% 100%, 0 100%, 0 18.83px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* the mono meta row (PRJ.001 left, the tag right) */
        .pc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: clamp(30px, 9cqw, 46px);
          padding: 0 3.8cqw;
          flex: none;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: clamp(10px, 2.2cqw, 12px);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: ${GREY};
        }
        .pc-tag {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* the screenshot fills the plate below the meta row */
        .pc-shot {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          /* the blend print blends against the shot only (not the
             page's ground behind the card) */
          isolation: isolate;
        }
        .pc-shot img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* the big print — the mock's ~16%-of-card-width mono title in
           warm white over the shot, difference-blended; long names step
           down so the print stays on the plate */
        .pc-title {
          position: absolute;
          left: 50%;
          top: 56%;
          transform: translate(-50%, -50%);
          z-index: 1;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-weight: 600;
          font-size: min(16cqw, var(--pc-fit, 16cqw));
          line-height: 1;
          letter-spacing: -0.02em;
          color: #F2F5EB;
          mix-blend-mode: difference;
          white-space: nowrap;
        }

        /* the title's glaphic-fan bloom — the core reads as the old print
           exactly (the fan's stack would set 700 / 2px; these overrides
           win on specificity over the component's adopted sheet) and the
           echo rings fan out around it on hover. All rings live inside
           the same blend element (.pc-title's mix-blend-mode isolates
           them as one group), so the stack difference-blends over the
           shot as a unit. */
        .pc-title glaphic-fan .stack {
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
        }

        /* ── mobile: the flow stacks (as the landing sections) ──── */
        @media (max-width: 899px) {
          .pr-flow { display: flex; flex-direction: column; padding: 44px 6vw 6vh; }
          .pr-grid { margin-top: 5vh; grid-template-columns: 1fr; }
        }
      `}</style>

      <div class="pr-flow">
        <GrowHead text="Projects" inView={inView} class="pr-head" />

        <div class="pr-grid">
          {projects.map((project, i) => {
            const t = tag(project.title);
            // one mono cell ≈ 0.6em wide: step the print down when a long
            // name would run past the plate (88% of the card width)
            const fit = (88 / (0.6 * Math.max(t.length, 1))).toFixed(2);
            return (
              <a
                key={project.id}
                class="pc-card"
                href={`#/projects/${project.id}`}
                style={{ '--pc-fit': `${fit}cqw` }}
                aria-label={`${project.title} — view project`}
              >
                <span class="pc-plate">
                  <span class="pc-meta">
                    <span>{`PRJ.${String(i + 1).padStart(3, '0')}`}</span>
                    <span class="pc-tag">{t}</span>
                  </span>
                  <span class="pc-shot">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    {/* the title carries the glaphic-fan bloom (hover fans,
                       leave collapses). 1em size rides .pc-title's stepped
                       print size; the core ink is the print's paper so the
                       rest state reads exactly as before. */}
                    <span class="pc-title">
                      <glaphic-fan
                        text={project.title}
                        trigger="hover"
                        style={{
                          '--glaphic-fan-size': '1em',
                          '--glaphic-fan-core-ink': '#F2F5EB',
                        }}
                      />
                    </span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}