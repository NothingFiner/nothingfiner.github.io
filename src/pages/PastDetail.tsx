// New-design PAST-WORK detail page — the agency-works arm of the
// /projects/:id detail format, keyed to the /past/ route family.
//
// THIS FILE IS A FORK, not a parameterization of ProjectDetail.tsx —
// the deliberate call (evaluated against ProjectDetail.tsx with the
// source open, plan Phase 3): the family deltas do not stay
// prop-shaped. Two axes entangle:
//   (1) the module-scope held-swap driver's index choreography is
//       written against the OTHER family's concrete page classes
//       (.projects/.projects__card fade-out, .grow-head__in reverse): a shared
//       driver would grow route-family branches keyed to a SECOND
//       index's page classes — page-private CSS does not share.
//   (2) the plate data sources have divergent error contracts: the
//       projects lookup silently falls back to the array head on an
//       unmatched id, while the past contracts throw/redirect loud
//       (pastWorkByTag, never a silent fallback). Unifying means
//       threading a Project|PastWork union with dead branches through
//       the component.
// The rules let the second copy win over the wrong abstraction; the
// /projects/ family's file stays byte-untouched, its behavior pinned
// by A/B captures.
//
// The format, same grammar as /projects/:id — the pinned-corner /
// streaming-images split on the site's chamfer/solid-ink vocabulary:
//
//   pinned   the text does NOT ride the scroll — the corner pieces
//            hold their corners while the images stream under them:
//     top-left     the fluro (#14F1C8) plate: the agency's name + the
//                  description + the DRAFT tag (the past plates' copy
//                  is drafted awaiting Eliot — never dressed as
//                  sourced), BARE (rimless), BOTTOM-RIGHT chamfered on
//                  desktop; mobile flips it (the green plate cuts
//                  TOP-LEFT)
//     top-right    the back button — the glaphic-button OUTLINE
//                  recipe at the pool-menu button's offsets, pointing
//                  back to #/past (the bands page)
//     bottom-left  the crimson (#A6022A) plate: the agency DETAILS —
//                  the technologies list and, when the seam entry
//                  carries one, the responsibilities section the
//                  agency seam exists for. BARE plate, TOP-RIGHT
//                  chamfer on desktop (mobile: BOTTOM-RIGHT); the
//                  separator prints as the glaphic-tape RAMP. No
//                  status/source rows: agency works carry none.
//   stream   the plate entry's IMAGES ride the scroll as ONE
//            CONTINUOUS TALL PLATE inside a single block container
//            on the grid's columns 5-12 (the fluro rim, the double
//            chamfer, RAMP tape separators between the blocks)
//   ground   the stage stays CLEAR (no opaque page background) so
//            app.tsx's lava lamp on lamp=true prints under everything
//
// Also mounted on this route by app.tsx (NEVER duplicated here): the
// shared lower band (SiteFooter). No header chrome: the past routes
// are all bare stage (the app.tsx isPast gate).
//
// ── PAGE-CHANGE CHOREOGRAPHY ─ the past-family routes own their
// swaps: PageWipe's capture listener EXEMPTS every nav touching a
// /past/:id route (the mirror of its /projects/ exemption), and the
// driver below holds the swap in the wipe's own held-swap protocol:
//
//   A  bands → detail     the held click fades the bands out and runs
//                         the "Past Work" grow-head IN REVERSE (the
//                         stepped shadow un-prints); at the exit's end
//                         the hash applies and the detail mounts with
//                         the entrance below (the images/tapes block
//                         slides DOWN from ABOVE the viewport, the
//                         green + red boxes in from fully OFF the
//                         left edge, the tape separators fade in once
//                         the block sets)
//   B  detail → bands     the boxes slide FULLY OUT past the left
//                         edge, the image block drifts DOWN/AWAY; the
//                         hash applies at the exit's end and the bands
//                         page mounts with its bands fading IN
//   C  detail → detail    the same exit plays fully, the hash applies
//                         at its end, and the arriving detail replays
//                         the entrance — one leftward conveyance, the
//                         swap seam off-screen (the plates solid all
//                         the way)
//
// NO FADES in any plate or box move — a physical swap (Eliot); the
// swap seam sits outside the viewport. NAVS WITH NO HELD SWAP — the
// browser's back/forward and programmatic navigate() apply the hash
// with nothing to hold: the PLAIN ENTRANCE only. A route id with no
// band behind it logs loud and stands the reader on /past instead of
// dressing a fallback as the target. Reduced motion: the driver skips
// the hold entirely and the media queries park every keyframe.
import { useEffect, useRef } from 'preact/hooks';
import { Fragment } from 'preact';
import { useRoute, useLocation } from 'wouter-preact';
import { pastWorks, pastWorkByTag, type PastWork } from '../data/pastWork';
import { projectDetails, type ProjectDetailContent } from '../data/projectDetails';

// the plate inks — the same fixed vocabulary the past-work bands and
// the project details print (solid paints only, no alpha, no blur)
const INK = '#0D0221';
const FLURO = '#14F1C8';
const CRIMSON = '#A6022A';
const PAPER = '#F9FAF4';
const PLATE = '#F2F5EB';
const GREY = '#686474';
// the keyline: the stream's rims and the next CTA's border print in
// the bands' keyline grey
const KEYLINE = '#9D99AB';

// the chamfer geometry (the past-work bands'/the project cards' 20 /
// 18.83 pair)
const CUT = 20;
const CUT_IN = 18.83;

const px = (n: number) => `${n}px`;

// ── the page-change choreography driver (module scope) ──────────────
// The past detail routes' swaps are HELD here, the /projects/ family
// driver's mirror (see the header docs): the click is intercepted in
// the CAPTURE phase on WINDOW, the exit plays, and the hash applies
// at the exit's end. The overlay is suppressed across the hold
// (data-wipe="off" on body) and back on just after the swap lands.
// Both drivers register once per page run (the module flag); they are
// mutually unaffected — each one's family guard passes the other's
// navs through untouched.
const parseHashPath = (hash: string): string =>
  '/' + hash.replace(/^#?\/?/, '');
const isPastDetailPath = (path: string): boolean => path.startsWith('/past/');
const reducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* the arriving detail must not stall on image decode (the projects
   driver's measured 49ms stall, on its file's header docs) — the
   prewarm decodes the target's first stream image DURING the hold.
   A miss here fails silently BY DESIGN: a failed prewarm is not a
   nav failure (the decode .catch is the same tolerance). */
const warmPastImage = (to: string): void => {
  if (typeof Image === 'undefined') return;
  const routeTag = to.slice('/past/'.length);
  const work = pastWorks.find((w) => w.tag === routeTag);
  const src = work?.stream[0];
  if (!src) return;
  const img = new Image();
  img.src = src;
  if (typeof img.decode === 'function') img.decode().catch(() => {});
};

/* the held exits' clocks (the classes' durations + a beat for the
   last frame to paint before the swap applies) */
const EXIT_MS = 460;        /* the detail page's 0.4s exit */
const INDEX_EXIT_MS = 510;  /* the grow-head's 0.45s reverse is the
                               bands page's exit long leg */

/** the mounted detail page's exit — registered on mount, cleared on
    unmount; the driver's B/C legs hand it the swap callback */
type PageExit = (done: () => void) => void;
let pageExit: PageExit | null = null;

// a route component mounts per route — this module flag registers
// the driver once per page run, never per mount (preact.md Routing)
let driverOn = false;
function startDriver(): void {
  if (driverOn) return;
  driverOn = true;

  /* the BANDS-side stylesheet — the exit/entrance the /past index
     plays under this driver (PastWork.tsx itself knows nothing about
     it; the sheet names the bands page's own classes — the crossing
     mirrors the projects driver's .projects rules). Its rules
     out-rank the page's own rules by SPECIFICITY (three classes),
     never by sheet order: this sheet lands whenever this module
     evaluates. The grow's REVERSE re-runs the same keyframes
     backwards from the parked full depth — the stepped shadow
     un-prints. */
  const bandsCss = `
    /* A: the bands page's exit — the bands fade out, the grow head
       un-prints */
    .past-work.past-work--exit .past-work__band {
      animation: past-detail-band-out 0.4s ease-in both;
    }
    @keyframes past-detail-band-out { from { opacity: 1; } to { opacity: 0; } }
    .past-work.past-work--exit .grow-head__in {
      animation: landing-grow 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) 0s reverse both;
    }
    /* the arrival (B + the no-held-swap plain entrance): the bands
       fade in — the grow-head's forward re-print is the bands page's
       own reveal */
    .past-work.past-work--in .past-work__band {
      animation: past-detail-band-in 0.4s ease-out both;
    }
    @keyframes past-detail-band-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .past-work.past-work--exit .past-work__band,
      .past-work.past-work--exit .grow-head__in,
      .past-work.past-work--in .past-work__band {
        animation: none;
      }
    }
  `;
  const sheet = document.createElement('style');
  sheet.textContent = bandsCss;
  (document.head ?? document.documentElement).appendChild(sheet);

  /* the arriving bands' fade-in: stamped on every fresh .past-work when
     the previous route was a past detail (B's held swap AND the
     back/forward plain entrance both read as the bands fading in) */
  const stamped = new WeakSet<Element>();
  let tracked = parseHashPath(location.hash);
  let fromDetails = isPastDetailPath(tracked);
  const stamp = (): void => {
    const page = document.querySelector('.past-work');
    if (!page || stamped.has(page)) return;
    stamped.add(page);
    if (fromDetails) page.classList.add('past-work--in');
  };
  new MutationObserver(stamp).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener('hashchange', () => {
    const next = parseHashPath(location.hash);
    fromDetails = isPastDetailPath(tracked);
    tracked = next;
    stamp();
  });

  /* the held swap — the wiping overlay stays off across the hold; the
     arriving page's entrance (never a wipe) is what prints */
  let holding = false;
  const apply = (to: string): void => {
    document.body.dataset.wipe = 'off';
    location.hash = '#' + to;
    window.setTimeout(() => {
      delete document.body.dataset.wipe;
    }, 250);
    holding = false;
  };

  window.addEventListener(
    'click',
    (ev: MouseEvent): void => {
      if (ev.defaultPrevented || ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const el = ev.target instanceof Element ? ev.target : null;
      const a = el?.closest<HTMLAnchorElement>('a[href^="#/"]');
      if (!a || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href) return;
      const to = parseHashPath(href);
      const fromPath = parseHashPath(location.hash);
      if (to === fromPath) return;
      /* only the navs touching a past detail route are this
         driver's — everything else (the projects family's held
         swaps, the wipe's routes) passes untouched */
      if (!isPastDetailPath(to) && !isPastDetailPath(fromPath)) return;

      ev.preventDefault();
      ev.stopPropagation();

      /* the arriving page's first stream image decodes DURING the
         hold (see warmPastImage's comment) */
      warmPastImage(to);
      /* reduced motion, or a second nav mid-hold: everything lands
         instantly */
      if (reducedMotion() || holding) {
        apply(to);
        return;
      }

      /* B / C: a past detail page is on screen — ITS exit plays (the
         boxes slide out left, the block drifts down/away) and the
         hash applies from the exit's end callback */
      if (isPastDetailPath(fromPath) && pageExit) {
        holding = true;
        const start = fromPath;
        pageExit(() => {
          /* dropped if another nav overtook the hold mid-exit */
          if (parseHashPath(location.hash) === start) apply(to);
          else holding = false;
        });
        return;
      }

      /* A: the bands page's exit — the bands fade out and the grow
         head un-prints; the swap lands when the reverse finishes */
      if (fromPath === '/past') {
        holding = true;
        const start = fromPath;
        const page = document.querySelector('.past-work');
        if (page) page.classList.add('past-work--exit');
        window.setTimeout(() => {
          if (parseHashPath(location.hash) === start) apply(to);
          else holding = false;
        }, INDEX_EXIT_MS);
        return;
      }

      /* everywhere else (a landing/chat link into a detail, say): no
         exit choreography is defined — the swap lands and the
         arriving detail plays its plain entrance */
      apply(to);
    },
    true,
  );
}
startDriver();

export function PastDetail() {
  const [, params] = useRoute<{ id: string }>('/past/:id');
  const [, navigate] = useLocation();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const routeTag = params?.id;

  /* the route's id is user-reachable, so the throw contract resolves
     at the ROUTE boundary: unmatched tags log loud and stand the
     reader on /past — never a fallback band dressed as the target */
  let work: PastWork | undefined;
  let missingTag: string | null = null;
  if (routeTag !== undefined) {
    try {
      work = pastWorkByTag(routeTag);
    } catch {
      missingTag = routeTag; // handled by the logged redirect below
    }
  }
  /* the bands order the array holds — the kicker and the next-chain
     ride the same showcase order */
  const index = work === undefined ? -1 : pastWorks.indexOf(work);

  useEffect(() => {
    if (missingTag === null) return;
    console.warn(`past detail: no past-work entry tagged '${missingTag}' — redirecting to /past`);
    navigate('/past', { replace: true });
    // the redirect's re-render unmounts past '/past/:id' matching
  }, [missingTag]);

  // each visit from the bands starts the stream at the top of the
  // ride (hash navigation doesn't always reset the scroll position) —
  // the detail route's remount on detail → detail re-keys the root
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeTag]);

  // the EXIT choreography the driver's B/C legs hold the swap with:
  // the boxes slide out LEFT, the image block drifts DOWN/AWAY; the
  // driver applies the hash from the callback — the exit's end (the
  // entrance itself is pure CSS: the mounted root carries
  // past-detail--enter, so every fresh mount plays it)
  useEffect(() => {
    pageExit = (done) => {
      const root = rootRef.current;
      if (!root) {
        done();
        return;
      }
      root.classList.add('past-detail--exit');
      window.setTimeout(done, EXIT_MS);
    };
    return () => {
      pageExit = null;
    };
  }, []);

  if (work === undefined) return null; // the logged redirect is running

  // the plates' copy: the agency seam's record for this band's tag.
  // A band whose seam entry is missing is a data bug (both halves
  // land in one commit): fail loud — the plate never dresses a
  // fallback as sourced.
  const plate: ProjectDetailContent = projectDetails[work.tag];
  if (plate === undefined) {
    throw new Error(`past detail: no agency-seam record keyed '${work.tag}' — the past plates read projectDetails.ts`);
  }

  const nextWork = pastWorks[(index + 1) % pastWorks.length];

  return (
    <div
      class="past-detail past-detail--enter"
      key={work.tag}
      ref={rootRef}
      data-detail-route={work.tag}
    >
      <style>{`
        .past-detail {
          --ptd-pad: 3.9vw;   /* the landing flow grid's inline padding */
          --ptd-gut: 1.1vw;   /* ...its column gutter */
          position: relative;
          /* the stage is CLEAR over the site's lava lamp (mounted by
             app.tsx for this route) — the pinned plates carry their
             own solid paints, the stream rides the scroll under them */
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          color: ${INK};
          /* the shared band's fractional -37.5vh margin leaks a hair
             of scroll past the page's end — clip it (clip is NOT a
             scroll container: the band's sticky still pins) */
          overflow: clip;
        }
        .past-detail * { margin: 0; box-sizing: border-box; }
        .past-detail img { display: block; }
        .past-detail a { text-decoration: none !important; }

        /* the grid: every piece composes on the landing's 12-column
           flow grid — the same 12 tracks + 3.9vw inline padding +
           1.1vw gutter, so the pinned corners and the stream's
           tracks align with the landing sections' columns */
        .past-detail__stream {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: var(--ptd-gut);
          padding: 0 var(--ptd-pad);
        }

        /* the pinned corner pieces: FLUSH (the plates sit DIRECTLY
           against the viewport's corners, no float): their wrappers
           run the same 12 tracks edge-to-edge with NO inline padding,
           so a plate on column 1 touches the screen's left edge and
           the wrappers pin at 0/0. The text keeps its air in the
           plates' own inner padding; the stream keeps the landing's
           3.9vw pad. */
        .past-detail__pin {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: var(--ptd-gut);
          position: fixed;
          left: 0;
          right: 0;
          z-index: 40;
          pointer-events: none;
          padding: 0;
        }
        .past-detail__pin > * { pointer-events: auto; }
        .past-detail__pin--top { top: 0; }     /* the title plate rides the
                                        viewport's TOP-LEFT corner */
        .past-detail__pin--bottom { bottom: 0; } /* the details plate rides the
                                          viewport's BOTTOM-LEFT corner */

        /* TOP-LEFT — the BARE fluro title plate (no keyline, no rim;
           the rimless plate read — the chamfer cut stays), BOTTOM-
           RIGHT chamfered on DESKTOP (the rest cut); MOBILE carries
           the flipped scheme (the green plate cuts TOP-LEFT) */
        .past-detail__title {
          grid-column: 1 / 5;
          background: ${FLURO};
          color: ${INK};
          padding: 24px 26px 28px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%);
          max-height: min(62vh, 560px);
          overflow: auto;
        }
        .past-detail__kicker {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          margin-bottom: 14px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .past-detail__heading {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(26px, 2.7vw, 40px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          margin: 0 0 14px !important;
        }
        .past-detail__desc {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          font-weight: 400;
          line-height: 1.7;
          margin: 0 !important;
        }
        /* the DRAFT tag: draft copy can't pass as sourced (the copy
           provenance rule) — the past plates all print one today */
        .past-detail__draft {
          display: inline-block;
          margin-top: 14px !important;
          border: 2px solid ${INK};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding: 3px 8px;
        }

        /* BOTTOM-LEFT — the BARE crimson details plate (no keyline,
           no rim), TOP-RIGHT chamfered on DESKTOP (the rest cut);
           MOBILE carries the flipped scheme (the red plate cuts
           BOTTOM-RIGHT) */
        .past-detail__details {
          grid-column: 1 / 4;
          background: ${CRIMSON};
          color: ${PAPER};
          padding: 22px 26px 26px;
          clip-path: polygon(0 0, calc(100% - ${px(CUT)}) 0, 100% ${px(CUT)}, 100% 100%, 0 100%);
          max-height: 58vh;
          overflow: auto;
        }
        .past-detail__details-label {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          margin: 0 0 6px !important;
          /* the label ink: the fluro reads on the crimson ground as
             the plate's one accent — solid paint, no alpha */
          color: ${FLURO};
        }
        .past-detail__tech {
          margin: 0 0 18px !important;
          padding: 0 !important;
          list-style: none !important;
        }
        .past-detail__tech li {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.55;
          color: ${PAPER};
        }
        /* the responsibilities section — the agency seam (renders
           only when the entry carries the list) */
        .past-detail__resp {
          margin: 0 0 18px !important;
          padding: 0 !important;
          list-style: none !important;
        }
        .past-detail__resp li {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          line-height: 1.7;
          color: ${PAPER};
          padding-left: 14px;
          position: relative;
        }
        .past-detail__resp li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 5px;
          height: 5px;
          background: ${FLURO};
        }
        /* the plate's own separator tape (paper over the crimson) —
           prints before the responsibilities section */
        .past-detail__details glaphic-tape {
          --glaphic-tape-hot: ${PAPER};
          --glaphic-tape-height: 6px;
          display: block;
          margin: 14px 0 10px;
        }

        /* TOP-RIGHT — the back button: the glaphic-button's OUTLINE
           recipe, pinned to the viewport's top-right corner at the
           pool-menu button's EXACT pinned offsets (the band wrapper's
           geometry mirrored to the top corner: right 2.3vw, 4.4vh).
           The pin lifts the button out of the 12-col grid's track. */
        .past-detail__back-row {
          position: fixed;
          top: 4.4vh;
          right: 2.3vw;
          z-index: 50;
        }

        /* the image stream: the same 12-column grid — ONE continuous
           tall plate (all of the images and their RAMP tape
           separators inside a single block container on columns
           5-12, no gaps — the plate reads with the TOP-LEFT cut at
           its start and the BOTTOM-RIGHT cut at its end), the images
           traveling under the pinned plates; the plate's right edge
           is the 5-12 line, which already STOPS SHORT of the shared
           band's pool-menu patch (the projects plate's measured air:
           66px at 1440, 31px at 900) */
        .past-detail__stream {
          position: relative;
          z-index: 10;
          padding-top: 6vh;
          padding-bottom: calc(37.5vh + 10vh);
          row-gap: 12vh;
        }
        /* the tall plate: the 2px rim is the plate's own paint (the
           fluro rim), the inner block cuts 2px perpendicular deeper
           along each face (20 / 18.83) — ONLY the plate's two end
           corners carry cuts: the images inside are uncut */
        .past-detail__image-block-container {
          grid-column: 5 / 12;
          padding: 2px;
          background: ${FLURO};
          clip-path: polygon(${px(CUT)} 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%, 0 ${px(CUT)});
        }
        .past-detail__image-block {
          clip-path: polygon(${px(CUT_IN)} 0, 100% 0, 100% calc(100% - ${px(CUT_IN)}), calc(100% - ${px(CUT_IN)}) 100%, 0 100%, 0 ${px(CUT_IN)});
        }
        .past-detail__image { width: 100%; height: auto; }
        /* the ride's separators: RAMP tapes — the plate's OWN seams,
           inside the tall plate, spanning its full inner width */
        .past-detail__image-block-container glaphic-tape {
          --glaphic-tape-hot: ${CRIMSON};
          --glaphic-tape-height: 12px;
          display: block;
        }

        /* the stream's end CTA: the next agency (the bands order) —
           the keyline recipe back on (the plates' bare read skips
           this one: the CTA keeps its border), its hover a smaller
           grow-head print.
           The shadow runs on an UNCLIPPED WRAPPER: an element's own
           clip-path clips its drop-shadow filter's output (the
           shadow paints outside the silhouette and the clip cuts it
           — the projects plate's measured diagnosis). The wrapper
           has no clip-path/overflow, so its drop-shadow follows the
           clipped child's cut silhouette and survives. */
        .past-detail__next-wrap {
          grid-column: 5 / 12;
          display: block;
        }
        .past-detail__next {
          display: block;
          width: 100%;
          padding: 2px;             /* the 2px keyline (the card's own
                                       paint) */
          background: ${KEYLINE};
          cursor: pointer;
          transition: transform 0.18s ease-out;
          clip-path: polygon(${px(CUT)} 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%, 0 ${px(CUT)});
        }
        .past-detail__next-in {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 26px;
          background: ${PLATE};
          clip-path: polygon(${px(CUT_IN)} 0, 100% 0, 100% calc(100% - ${px(CUT_IN)}), calc(100% - ${px(CUT_IN)}) 100%, 0 100%, 0 ${px(CUT_IN)});
        }
        .past-detail__next:hover,
        .past-detail__next:focus-visible {
          transition: none;
        }
        .past-detail__next:focus-visible { outline: none; }
        /* the hover print: the grow headline's stepped shadow stack,
           smaller — three tiers (1/3/6px) stepped in one pass, on
           the WRAPPER (drop-shadow layers compound onto the clipped
           silhouette; the rim paints ink, so the stack reads) */
        .past-detail__next-wrap:has(.past-detail__next:hover),
        .past-detail__next-wrap:has(.past-detail__next:focus-visible) {
          animation: past-detail-grow-s 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) both;
        }
        .past-detail__next-label {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: ${GREY};
        }
        .past-detail__next-title {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-size: clamp(20px, 2vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: ${INK};
        }
        @keyframes past-detail-grow-s {
          0% {
            filter: drop-shadow(0 0 0 ${INK});
          }
          33.3% {
            filter: drop-shadow(1px 1px 0 ${INK});
          }
          66.6% {
            filter: drop-shadow(1px 1px 0 ${INK}) drop-shadow(3px 3px 0 ${GREY});
          }
          100% {
            filter: drop-shadow(1px 1px 0 ${INK}) drop-shadow(3px 3px 0 ${GREY}) drop-shadow(6px 6px 0 ${KEYLINE});
          }
        }

        /* ── the page-change choreography (the past routes' own
           driver — the wipe exempts these routes; see the header)
           ─────────────────────────────────────────────────────────
           ENTRANCE (any arrival — the mounted root carries
           past-detail--enter): the images/tapes block slides DOWN into
           place from ABOVE the viewport (un-faded); the green + red
           boxes slide in from FULLY OFF the left edge (~0.15s after
           the block starts — un-faded, solid all the way); the tape
           separators FADE IN once the block settles */
        @keyframes past-detail-stream-in {
          from { transform: translateY(-13vh); }
        }
        @keyframes past-detail-box-in {
          from { transform: translateX(-115%); }
        }
        @keyframes past-detail-tape-in {
          from { opacity: 0; }
        }
        .past-detail--enter .past-detail__stream {
          animation: past-detail-stream-in 0.4s ease-out both;
        }
        .past-detail--enter .past-detail__title,
        .past-detail--enter .past-detail__details {
          animation: past-detail-box-in 0.4s ease-out 0.15s both;
        }
        .past-detail--enter .past-detail__image-block glaphic-tape {
          animation: past-detail-tape-in 0.3s ease-out 0.5s both;
        }
        /* EXIT (the held swap's shapes): the boxes slide FULLY OUT
           past the viewport's LEFT edge (they rest there, un-faded,
           at the swap — the seam is off-screen), the image block
           drifts DOWN/AWAY (un-faded). Declared AFTER the entrance
           rules: while both classes ride the root, the pair wins the
           cascade and re-seats every animation as its exit form. */
        @keyframes past-detail-stream-out {
          to { transform: translateY(11vh); }
        }
        @keyframes past-detail-box-out {
          to { transform: translateX(-115%); }
        }
        .past-detail--exit .past-detail__stream {
          animation: past-detail-stream-out 0.4s ease-in both;
        }
        .past-detail--exit .past-detail__title,
        .past-detail--exit .past-detail__details {
          animation: past-detail-box-out 0.4s ease-in both;
          transform-origin: left center;
        }
        @media (prefers-reduced-motion: reduce) {
          .past-detail--enter .past-detail__stream,
          .past-detail--enter .past-detail__title,
          .past-detail--enter .past-detail__details,
          .past-detail--enter .past-detail__image-block glaphic-tape,
          .past-detail--exit .past-detail__stream,
          .past-detail--exit .past-detail__title,
          .past-detail--exit .past-detail__details {
            animation: none;
          }
        }

        /* ── mobile: the pinned plates join the flow ─────────────── */
        @media (max-width: 899px) {
          /* the wrappers dissolve (display: contents) so their plate
              children join the page's own stack with orders — the
              read: BOTH plates ride ABOVE the images, touching (no
              gap between/around them), then the images */
          .past-detail { display: flex; flex-direction: column; padding: 72px 6vw 6vh; }
          .past-detail__pin { display: contents; padding: 0; }
          .past-detail__stream { display: flex; flex-direction: column; padding: 0 0 3vh; row-gap: 0; gap: 6vh; }
          .past-detail__title { order: 0; max-height: none; overflow: visible; }
          .past-detail__details { order: 1; max-height: none; overflow: visible; }
          .past-detail__stream { order: 2; }
          /* the MOBILE chamfer scheme: the GREEN (fluro) plate cuts
             at TOP-LEFT, the RED (crimson) plate cuts at
             BOTTOM-RIGHT (desktop keeps the rest cuts) */
          .past-detail__title {
            clip-path: polygon(${px(CUT)} 0, 100% 0, 100% 100%, 0 100%, 0 ${px(CUT)});
          }
          .past-detail__details {
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%);
          }
          /* the stream's plate: full width but it STILL stops at the
             fixed cluster's zone (the pool-menu pins right 4vw from
             10vh up on mobile — the band wrapper's geometry — so the
             button keeps its patch of corner) */
          .past-detail__image-block-container, .past-detail__next-wrap { grid-column: auto; margin-right: 0; margin-top: 6vh; }
          /* the back button rides the pool-menu button's mobile pin
             exactly (12px — the band wrapper's mobile geometry,
             mirrored to the top corner) */
          .past-detail__back-row {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 50;
          }
        }
      `}</style>

      {/* the shared band's foot (app.tsx mounts it in flow after this
          page) clears the pinned crimson details plate: the plate
          rides FIXED at the viewport's bottom-left (z 40, cols 1-4 of
          the 3.9vw-padded 12-col grid ≈ 488px wide) and would print
          over the foot's brand/legal at the page's end — the foot's
          left column shifts right of the plate on desktop (mobile:
          the plates are static, the stacked foot needs no shift) */}
      <style>{`
        @media (min-width: 900px) {
          #main-content:has(.past-detail) .site-footer__band--footer .site-footer__foot {
            padding-left: 37.5vw;
          }
        }
      `}</style>

      {/* the top pin: title plate (cols 1-5) + back button */}
      <div class="past-detail__pin past-detail__pin--top">
        {/* TOP-LEFT pinned plate — the agency's name + the drafted
            description + the DRAFT tag (nothing here is sourced copy
            until Eliot writes the real lines) */}
        <aside class="past-detail__title">
          <div class="past-detail__kicker">{`PAST.${String(index + 1).padStart(3, '0')} /// ${work.name.toUpperCase()}`}</div>
          <h2 class="past-detail__heading">{work.name}</h2>
          <p class="past-detail__desc">{plate.description}</p>
          {plate.copy === 'draft' && <span class="past-detail__draft">DRAFT COPY — AWAITING ELIOT</span>}
        </aside>

        {/* TOP-RIGHT pinned — back to the bands (the glaphic-button
            OUTLINE recipe: the ink keyline, transparent fill) */}
        <nav class="past-detail__back-row">
          <a href="#/past" aria-label="Back to past work">
            <glaphic-button variant="outline" size="lg">← INDEX</glaphic-button>
          </a>
        </nav>
      </div>

      {/* the ride — the seam's stream images under the pinned plates,
          RAMP ramps between the blocks */}
      <section class="past-detail__stream" aria-label={`${work.name} images`}>
        <div class="past-detail__image-block-container">
          <div class="past-detail__image-block">
            {plate.images.map((src, i) => (
              // one fragment per ride step: the shot then (between
              // blocks) the RAMP tape — the fragment's children land
              // on the grid in order, so each tape prints right under
              // its block
              <Fragment key={src}>
                    <img
                      class="past-detail__image"
                      src={src}
                      alt={`${work.name} — image ${i + 1} of ${plate.images.length}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                {i < plate.images.length - 1 && (
                  <glaphic-tape pattern="ramp" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <div class="past-detail__next-wrap">
          <a
            class="past-detail__next"
            href={`#/past/${nextWork.tag}`}
            aria-label={`Next past work: ${nextWork.name}`}
          >
            <span class="past-detail__next-in">
              <span class="past-detail__next-label">NEXT PROJECT</span>
              <span class="past-detail__next-title">{nextWork.name} →</span>
            </span>
          </a>
        </div>
      </section>

      {/* the bottom pin: the crimson details plate (cols 1-4). The
          responsibilities section prints ONLY when the seam entry
          carries it (the agency seam — see src/data/projectDetails.ts;
          every past entry carries one today) */}
      <div class="past-detail__pin past-detail__pin--bottom">
        <aside class="past-detail__details">
          <div class="past-detail__details-label">TECHNOLOGIES</div>
          <ul class="past-detail__tech">
            {plate.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {plate.responsibilities !== undefined && plate.responsibilities.length > 0 && (
            <glaphic-tape pattern="ramp" />
          )}
          {plate.responsibilities !== undefined && plate.responsibilities.length > 0 && (
            <>
              <div class="past-detail__details-label">RESPONSIBILITIES</div>
              <ul class="past-detail__resp">
                {plate.responsibilities.map((respItem) => (
                  <li key={respItem}>{respItem}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}