// New-design past-work page — the agencies' flat index: a column of
// BANDS (Eliot's showcase order) on the landing's 12-column flow grid
// (the projects page's own grid, never the auto-fill card tiles):
//
//   head    the shared grow headline "Past Work" (the landing
//           sections'/projects' GrowHead, revealed by the page's IO
//           flag)
//   bands   one full-width row per agency: the 2px keyline is the
//           band's own paint around the plate (the project cards'
//           recipe: the house 20px top-left chamfer with the parallel
//           inset clip riding the cut face), a mono kicker row
//           (PAST.00N /// BRAND-UPPERCASE), then the lead image at its
//           natural aspect. One <a> per band to #/past/{tag}; no copy
//           on bands (the names + the shots carry them).
//   chrome  the shared footer band (SiteFooter) — mounted once per
//           route by app.tsx, never composed here. The route is bare
//           stage (app.tsx's isPast gate) and the lamp blobs read
//           under it (app.tsx's lampOn), like the projects stage.
//
// The past-family page-choreography (the held band->detail swaps) is
// driven by src/pages/PastDetail.tsx's own driver, the /projects/
// family's mirror — its index-side sheet styles the .past-work/.past-work__band
// nodes this page names. No other choreography lives here.
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from '../components/GrowHead';
import { pastWorks } from '../data/pastWork';

// the band inks (the project cards' palette — solid paints only)
const KEYLINE = '#9D99AB';
const PLATE = '#F2F5EB';
const GREY = '#686474';
const INK = '#0D0221';
const FLURO = '#14F1C8';

export function PastWork() {
  const [inView, setInView] = useState(false);
  // the reveal observes the HEAD WRAPPER, never the page root: the
  // four-band page outruns any viewport (~6.6 viewports at 1440), so
  // a 0.25 threshold on the whole page computed to a gate that could
  // NEVER pass (the tall-element observer trap). The wrapper is what
  // arrives — the head re-arms on re-arrival (a toggle observer: it
  // never disconnects, the projects page's whole-page gate idiom).
  const headRef = useRef<HTMLDivElement | null>(null);

  // reveal the grow once the page's fold enters (the projects page's
  // own gate: an observer that means toggle — it never disconnects)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const head = headRef.current;
    if (head) io.observe(head);
    return () => io.disconnect();
  }, []);

  return (
    <div class="past-work">
      <style>{`
        .past-work {
          position: relative;
          min-height: 100vh;
          /* the stage is clear over the site's lava lamp (app.tsx
             lights the blobs for the past family, as it does for the
             projects/chat stages) — the bands' solid plates carry
             themselves */
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .past-work * { margin: 0; box-sizing: border-box; }

        /* the padded flow grid (as the landing sections) */
        .past-work__flow {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 1.1vw;
          row-gap: 0;
          /* the shared band below is in flow (the footer pose) —
             nothing to reserve for it here, like the projects page */
          padding: 3.6vh 3.9vw 4vh;
        }
        .past-work__head { grid-column: 1 / -1; }

        /* the bands column: one full-width row per agency (a column
           of bands on the 12-col flow idiom — never the auto-fill
           card tiles). The gaps breathe vertically (vh-scaled like
           the flow grid's own rhythm); the column stacks at 390. */
        .past-work__bands {
          grid-column: 1 / -1;
          margin-top: 12.6vh;
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 4vh, 56px);
        }

        /* the band: the project card's paint recipe at full width —
           the 2px keyline is the band's own paint (this background
           showing around the plate), the plate sits inside with the
           parallel inset clip (18.83px on the cut's diagonal, the
           card's exact pair). No 3:2 box: the lead image rides at its
           natural aspect, so the tall storefront shots read whole. */
        .past-work__band {
          display: block;
          position: relative;
          padding: 2px;
          background: ${KEYLINE};
          clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
          container-type: inline-size;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.18s ease-out, filter 0.18s ease-out,
            background-color 0.18s ease-out;
        }
        /* the lift is a hard fluro print (drop-shadow rides the clip)
           and the keyline goes full ink — the project cards' hover */
        .past-work__band:hover,
        .past-work__band:focus-visible {
          filter: drop-shadow(4px 4px 0 ${FLURO});
          background-color: ${INK};
        }
        .past-work__band:focus-visible {
          outline: none;
        }
        .past-work__band-plate {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: ${PLATE};
          /* straight edges inset by the band's 2px padding; the cut's
             diagonal reads the keyline on the face (18.83px — the
             card's measured pair) */
          clip-path: polygon(18.83px 0, 100% 0, 100% 100%, 0 100%, 0 18.83px);
          overflow: hidden;
        }

        /* the mono kicker row (PAST.001 /// BROOKS BROTHERS) — the
           card's meta row voice, sized off the band's own width */
        .past-work__band-meta {
          display: flex;
          align-items: center;
          justify-content: flex-start;
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

        /* the lead image fills the plate below the kicker */
        .past-work__band-shot {
          display: block;
          width: 100%;
          height: auto;
        }

        /* mobile: the flow stacks (as the landing sections) */
        @media (max-width: 899px) {
          .past-work__flow { display: flex; flex-direction: column; padding: 44px 6vw 6vh; }
          .past-work__bands { margin-top: 5vh; }
        }
      `}</style>

      <div class="past-work__flow">
        {/* the reveal gate wraps the head (see headRef above) — the
            GrowHead composes bare inside the tracked wrapper */}
        <div class="past-work__head" ref={headRef}>
          <GrowHead text="Past Work" inView={inView} />
        </div>

        <div class="past-work__bands">
          {pastWorks.map((work, i) => (
            // one band = the whole row is the link to its detail
            <a
              key={work.tag}
              class="past-work__band"
              href={`#/past/${work.tag}`}
              aria-label={`${work.name} — view the agency work`}
            >
              <span class="past-work__band-plate">
                <span class="past-work__band-meta">
                  <span>{`PAST.${String(i + 1).padStart(3, '0')} /// ${work.name.toUpperCase()}`}</span>
                </span>
                <img
                  class="past-work__band-shot"
                  src={work.image}
                  alt={work.name}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}