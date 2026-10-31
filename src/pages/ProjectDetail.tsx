// New-design project detail page — the glenncatteeuw.com/coca-cola-x-
// marshmello grammar, on the site's chamfer/solid-ink vocabulary:
//
//   pinned   the text does NOT ride the scroll — the corner pieces hold
//            their corners while the images stream under them (the
//            inspiration's pinned-corners / streaming-images split):
//     top-left     the fluro (#14F1C8) plate: the project title + the
//                  description, BARE (rimless — Eliot's plate read; the
//                  chamfer cut stays), BOTTOM-RIGHT chamfered on
//                  desktop (mobile flips it: the green plate cuts
//                  TOP-LEFT — Eliot's scheme)
//     top-right    the back-to-index button — the glaphic-button OUTLINE
//                  recipe (the Controls/Button docs' ink outline: 1px
//                  ink keyline, transparent fill, paper-deep hover, mono
//                  label), pinned to the corner at the pool-menu
//                  button's exact offsets, pointing back to #/projects
//     bottom-left  the crimson (#A6022A) plate: the project DETAILS —
//                  the languages/technologies list (and, when an entry
//                  carries one, the responsibilities section the coming
//                  agency-works page will use — data-driven seam). BARE
//                  plate, TOP-RIGHT chamfer on desktop (mobile flips
//                  it: the red plate cuts BOTTOM-RIGHT); the row rules
//                  print as glaphic-tape RAMP separators, not borders.
//   stream   the project's IMAGES ride the scroll as ONE CONTINUOUS
//            TALL PLATE (Eliot's own structure: every image and every
//            RAMP tape separator lives inside a single block container
//            on the grid's columns 5-12, flush — the plate reads with
//            the TOP-LEFT cut at its start and the BOTTOM-RIGHT cut at
//            its end, its 2px rim the fluro paint; the 5-12 line
//            itself stops short of the shared band's pool-menu patch,
//            so the button never overlays the plate), composed on the
//            landing's 12-column flow grid (same tracks + 3.9vw inline
//            padding + 1.1vw gutter as the flow pieces)
//   ground   the page's stage stays CLEAR (no opaque page background,
//            the landing/chat pattern) so app.tsx's lava lamp on
//            LavaLampBackground lamp=true prints under everything
//
// Also mounted on this route by app.tsx (NEVER duplicated here): the
// shared sticky lower band (SiteFooter — pool menu + contact icons
// + the `////` line). No header chrome: the projects routes are all
// bare stage (the legacy sticky header is gone, Eliot) — the corner
// pieces pin right up into the reclaimed top.
//
// The glaphic elements need no import here — the components register
// via the eager '@glaphic/ui' import in GlaphicGallery, which app.tsx
// pulls statically.
//
// ── PAGE-CHANGE CHOREOGRAPHY ─ the detail routes own their swaps.
// PageWipe's capture listener EXEMPTS every nav touching a
// /projects/:id route (it returns untouched, with NO preventDefault —
// never a wipe here), and the driver at the top of this module holds
// the swap instead, in the wipe's own held-swap protocol:
//
//   A  index → detail    the held click fades the index's cards out
//                        and runs the "Projects" grow-head IN REVERSE
//                        (the stepped shadow un-prints); at the exit's
//                        end the hash applies and the detail page mounts
//                        with the entrance choreography below (the
//                        images/tapes block slides DOWN into place from
//                        ABOVE the viewport, un-faded; the green + red
//                        boxes slide in from fully OFF the left edge,
//                        un-faded — solid all the way; the tape
//                        separators fade in once the block sets)
//   B  detail → index    the boxes slide FULLY OUT past the viewport's
//                        LEFT edge (un-faded), the image block drifts
//                        DOWN/AWAY (un-faded); the hash applies at the
//                        exit's end and the index mounts with its cards
//                        fading IN (the grow-head re-prints forward
//                        under the index page's own reveal)
//   C  detail → detail   the SAME exit plays FULLY, the hash applies
//                        at its end, and the arriving detail replays
//                        the same entrance — the old plate leaves
//                        through the left edge and the new one enters
//                        from the same fully-off pose, so the two
//                        half-moves chain into ONE leftward conveyance
//                        (the swap seam sits outside the viewport — the
//                        plates are solid the whole way through)
//
// NO FADES in any plate or box move: the plates/boxes/blocks are
// opaque from the first frame to the last (Eliot: a physical swap, not
// a fade) — the held-swap protocol kept; the swap seam is off-screen
// (both poses fully past the viewport edge) so the leave and the
// return READ as simultaneous, one motion. The tape separators keep
// their own fade-in beat (the images/tapes' move is theirs).
//
// NAVS WITH NO HELD SWAP — the browser's back/forward buttons and
// wouter's programmatic navigate() apply the hash with nothing to
// hold: they get the PLAIN ENTRANCE only (no exit). The arriving
// detail plays the same entrance choreography; the arriving index's
// cards fade in through the driver's mount stamp (the previous route
// was a detail). The old page simply vanishes under the entrance.
//
// Reduced motion: the driver skips the hold entirely (the hash applies
// instantly) and the CSS media queries park every choreography key —
// everything instant.
import { useEffect, useRef } from 'preact/hooks';
import { Fragment } from 'preact';
import { useRoute } from 'wouter-preact';
import { projects, type Project } from '../data/projects';
import { getProjectDetail, type ProjectDetailContent } from '../data/projectDetails';

// the plate inks — the new design's fixed vocabulary (same constants
// the landing sections and the projects index print; solid paints
// only, no alpha, no blur)
const INK = '#0D0221';
const FLURO = '#14F1C8';
const CRIMSON = '#A6022A';
const PAPER = '#F9FAF4';
const PLATE = '#F2F5EB';
const GREY = '#686474';
// the keyline: the stream's rims and the next CTA's border print in
// the index cards' keyline grey
const KEYLINE = '#9D99AB';

// the chamfer geometry (the index cards' 20 / 18.83 pair — the inner
// value only matters on the one rimmed piece, the next CTA)
const CUT = 20;
const CUT_IN = 18.83;

const px = (n: number) => `${n}px`;

// ── the page-change choreography driver (module scope) ──────────────
// The detail routes' swaps are HELD here, in the wipe's own held-swap
// protocol: the click is intercepted in the CAPTURE phase (this driver
// registers on WINDOW — ahead of the wipe's document-capture listener,
// which now returns untouched on any nav touching a /projects/:id
// route anyway), the exit plays, and the hash applies at the exit's
// end. The overlay is suppressed across the hold (`data-wipe="off"` on
// <body> — the wipe's own escape hatch) and back on just after the
// swap lands, so the arriving page plays THIS entrance, never a wipe.
//
// The three legs are the module header's A/B/C. NAVS WITH NO HELD
// SWAP — the browser's back/forward buttons and wouter's programmatic
// navigate() apply the hash with no click to hold: they get the PLAIN
// ENTRANCE only (no exit); the arriving index's cards fade in through
// the mount stamp below. Reduced motion: no hold at all — the hash
// applies instantly (the pages' media queries park the keyframes too).
const parseHashPath = (hash: string): string =>
  '/' + hash.replace(/^#?\/?/, '');
const isDetailPath = (path: string): boolean => path.startsWith('/projects/');
const reducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* the arriving entrance must not stall on image decode: the fresh
   plate's first animated frames used to hang while the compositor
   decoded the hero mid-move (measured — a 49ms frame at the move's
   start; zero once the image is decoded). The driver decodes the
   TARGET detail's first stream image during the hold, so the arriving
   layer rasters warm. (The component's own mount decode covers the
   navs with no held swap — back/forward, programmatic navigate.) */
const warmDetailImage = (to: string): void => {
  if (typeof Image === 'undefined') return;
  const id = to.slice('/projects/'.length);
  const project = projects.find((p) => p.id === id);
  if (!project) return;
  const src = getProjectDetail(project)?.images?.[0] ?? project.image;
  if (!src) return;
  const img = new Image();
  img.src = src;
  if (typeof img.decode === 'function') img.decode().catch(() => {});
};

/* the held exits' clocks (the classes' durations + a beat for the
   last frame to paint before the swap applies) */
const EXIT_MS = 460;        /* the detail page's 0.4s exit */
const INDEX_EXIT_MS = 510;  /* the grow-head's 0.45s reverse is the
                               index exit's long leg */

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

  /* the INDEX-side stylesheet — the exit/entrance the projects index
     plays under this driver (the index page itself knows nothing
     about it). Its rules out-rank landing.css's card rules by
     SPECIFICITY (three classes), never by sheet order: this sheet
     lands whenever this module evaluates. The grow's REVERSE re-runs
     the same keyframes backwards from the parked full depth — the
     stepped shadow un-prints. */
  const indexCss = `
    /* A: the index's exit — the cards fade out, the grow head
       un-prints */
    .pr-page.pr-exit-on .pc-card {
      animation: pd-index-card-out 0.4s ease-in both;
    }
    @keyframes pd-index-card-out { from { opacity: 1; } to { opacity: 0; } }
    .pr-page.pr-exit-on .grow-head__in {
      animation: landing-grow 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) 0s reverse both;
    }
    /* the arrival (B + the no-held-swap plain entrance): the index's
       cards fade in — the grow-head's forward re-print is the index
       page's own reveal */
    .pr-page.pr-in-on .pc-card {
      animation: pd-index-card-in 0.4s ease-out both;
    }
    @keyframes pd-index-card-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .pr-page.pr-exit-on .pc-card,
      .pr-page.pr-exit-on .grow-head__in,
      .pr-page.pr-in-on .pc-card {
        animation: none;
      }
    }
  `;
  const sheet = document.createElement('style');
  sheet.textContent = indexCss;
  (document.head ?? document.documentElement).appendChild(sheet);

  /* the arriving index's cards: stamped on every fresh .pr-page when
     the previous route was a detail (B's held swap AND the
     back/forward plain entrance both read as the cards fading in) */
  const stamped = new WeakSet<Element>();
  let tracked = parseHashPath(location.hash);
  let fromDetail = isDetailPath(tracked);
  const stamp = (): void => {
    const page = document.querySelector('.pr-page');
    if (!page || stamped.has(page)) return;
    stamped.add(page);
    if (fromDetail) page.classList.add('pr-in-on');
  };
  new MutationObserver(stamp).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener('hashchange', () => {
    const next = parseHashPath(location.hash);
    fromDetail = isDetailPath(tracked);
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
      /* only the navs that touch a detail page are this driver's —
         everything else is untouched territory (the wipe's) */
      if (!isDetailPath(to) && !isDetailPath(fromPath)) return;

      ev.preventDefault();
      ev.stopPropagation();

      /* the arriving page's first images decode DURING the hold, so the
         entrance's first animated frames never stall on raster (the
         measured 49ms frame at the move's start) */
      warmDetailImage(to);
      /* reduced motion, or a second nav mid-hold: everything lands
         instantly */
      if (reducedMotion() || holding) {
        apply(to);
        return;
      }

      /* B / C: a detail page is on screen — ITS exit plays (the boxes
         slide out left, the block drifts down/away) and the hash
         applies from the exit's end callback */
      if (isDetailPath(fromPath) && pageExit) {
        holding = true;
        const start = fromPath;
        pageExit(() => {
          /* dropped if another nav overtook the hold mid-exit */
          if (parseHashPath(location.hash) === start) apply(to);
          else holding = false;
        });
        return;
      }

      /* A: the index's exit — the cards fade out and the grow head
         un-prints; the swap lands when the reverse finishes */
      if (fromPath === '/projects') {
        holding = true;
        const start = fromPath;
        const page = document.querySelector('.pr-page');
        if (page) page.classList.add('pr-exit-on');
        window.setTimeout(() => {
          if (parseHashPath(location.hash) === start) apply(to);
          else holding = false;
        }, INDEX_EXIT_MS);
        return;
      }

      /* everywhere else (landing → detail, chat → detail): no exit
         choreography is defined — the swap lands and the arriving
         detail plays its plain entrance */
      apply(to);
    },
    true,
  );
}
startDriver();

export function ProjectDetail() {
  const [, params] = useRoute<{ id: string }>('/projects/:id');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const projectId = params?.id;
  const project: Project =
    projects.find((p) => p.id === projectId) ?? projects[0];
  const detail: ProjectDetailContent = getProjectDetail(project) ?? {
    // no entry yet (the index agent's reorder may move or add ids
    // ahead of this file) — fall back to the index's own copy so the
    // page always reads
    description: project.description,
    technologies: project.tags ?? [],
    images: project.gallery ?? [project.image],
    copy: 'live',
  };

  const currentIndex = projects.indexOf(project);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  // the images that ride the stream: the detail entry's, else the
  // index's gallery, else the index's hero image
  const streamImages = detail.images.length
    ? detail.images
    : (project.gallery ?? [project.image]);

  // each visit from the index starts the stream at the top of the ride
  // (hash navigation doesn't always reset the scroll position)
  useEffect(() => {
    window.scrollTo(0, 0);
    /* the detail route's remount (detail → detail re-keys the root) */
  }, [projectId]);

  // the EXIT choreography the driver's B/C legs hold the swap with:
  // the boxes slide out LEFT, the image block drifts DOWN/AWAY; the
  // driver applies the hash from the callback — the exit's end (the
  // entrance itself is pure CSS: the mounted root carries
  // pd-enter-on, so every fresh mount plays it)
  useEffect(() => {
    pageExit = (done) => {
      const root = rootRef.current;
      if (!root) {
        done();
        return;
      }
      root.classList.add('pd-exit-on');
      window.setTimeout(done, EXIT_MS);
    };
    return () => {
      pageExit = null;
    };
  }, []);

  return (
    <div
      class="pd-page pd-enter-on"
      key={project.id}
      ref={rootRef}
      data-detail-route={project.id}
    >
      <style>{`
        .pd-page {
          --pd-pad: 3.9vw;   /* the landing flow grid's inline padding */
          --pd-gut: 1.1vw;   /* ...its column gutter */
          position: relative;
          /* the stage is CLEAR over the site's lava lamp (mounted by
             app.tsx for this route) — the pinned plates carry their own
             solid paints, the stream rides the scroll under them */
          font-family: var(--f-body, 'Inter', sans-serif);
          color: ${INK};
          /* the shared band's fractional -37.5vh margin leaks a hair of
             scroll past the page's end — clip it (clip is NOT a scroll
             container: the band's sticky still pins to the viewport) */
          overflow: clip;
        }
        .pd-page * { margin: 0; box-sizing: border-box; }
        .pd-page img { display: block; }
        .pd-page a { text-decoration: none !important; }

        /* ── the grid: every piece composes on the landing's 12-column
           flow grid — the same 12 tracks + 3.9vw inline padding + 1.1vw
           gutter, so the pinned corners and the stream's tracks align
           with the landing sections' columns ─────────────────────── */
        .pd-stream {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: var(--pd-gut);
          padding: 0 var(--pd-pad);
        }

        /* the pinned corner pieces: FLUSH (Eliot — the plates sit
           DIRECTLY against the viewport's corners, no 2.3vw/2.3vh
           float): their wrappers run the same 12 tracks edge-to-edge
           with NO inline padding, so a plate starting on column 1
           touches the screen's left edge and the wrappers pin at 0/0
           (top-left / bottom-left corners). The text keeps its air in
           the plates' own inner padding; the flush read is the
           silhouette's. The stream keeps the landing's 3.9vw pad. */
        .pd-pin {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: var(--pd-gut);
          position: fixed;
          left: 0;
          right: 0;
          z-index: 40;
          pointer-events: none;
          padding: 0;
        }
        .pd-pin > * { pointer-events: auto; }
        .pd-pin-top { top: 0; }     /* the title plate rides the
                                       viewport's TOP-LEFT corner */
        .pd-pin-bottom { bottom: 0; } /* the details plate rides the
                                       viewport's BOTTOM-LEFT corner —
                                       the band's foot shifts right of
                                       the plate below */

        /* TOP-LEFT — the BARE fluro title plate (no keyline, no rim;
           Eliot's rimless plate read — the chamfer cut stays), BOTTOM-
           RIGHT chamfered on DESKTOP (the rest cut); MOBILE carries the
           new scheme (the green plate cuts TOP-LEFT — see the media
           block) */
        .pd-title {
          grid-column: 1 / 5;
          background: ${FLURO};
          color: ${INK};
          padding: 24px 26px 28px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%);
          max-height: min(62vh, 560px);
          overflow: auto;
        }
        .pd-kicker {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          margin-bottom: 14px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pd-heading {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(26px, 2.7vw, 40px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          margin: 0 0 14px !important;
        }
        .pd-desc {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          font-weight: 400;
          line-height: 1.7;
          margin: 0 !important;
        }
        .pd-draft {
          display: inline-block;
          margin-top: 14px !important;
          border: 2px solid ${INK};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding: 3px 8px;
        }
        /* the title plate's link buttons (the data's links[] — only
           real targets ride; the library's outline reads on the fluro:
           the ink keyline + label, the paper-deep hover) */
        .pd-links {
          display: flex;
          gap: 10px;
          margin-top: 0.4vh !important;
          flex-wrap: wrap;
        }
        .pd-links a { text-decoration: none; }

        /* BOTTOM-LEFT — the BARE crimson details plate (no keyline, no
           rim), TOP-RIGHT chamfered on DESKTOP (the rest cut); MOBILE
           carries the new scheme (the red plate cuts BOTTOM-RIGHT —
           see the media block) */
        .pd-details {
          grid-column: 1 / 4;
          background: ${CRIMSON};
          color: ${PAPER};
          padding: 22px 26px 26px;
          clip-path: polygon(0 0, calc(100% - ${px(CUT)}) 0, 100% ${px(CUT)}, 100% 100%, 0 100%);
          max-height: 58vh;
          overflow: auto;
        }
        .pd-details-label {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          margin: 0 0 6px !important;
          /* the label ink: the fluro reads on the crimson ground as the
             plate's one accent — solid paint, no alpha */
          color: ${FLURO};
        }
        .pd-tech {
          margin: 0 0 18px !important;
          padding: 0 !important;
          list-style: none !important;
        }
        .pd-tech li {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.55;
          color: ${PAPER};
        }
        .pd-resp {
          margin: 0 0 18px !important;
          padding: 0 !important;
          list-style: none !important;
        }
        .pd-resp li {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          line-height: 1.7;
          color: ${PAPER};
          padding-left: 14px;
          position: relative;
        }
        .pd-resp li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 5px;
          height: 5px;
          background: ${FLURO};
        }
        /* the detail rows' rules print as glaphic-tape RAMP separators
           (paper tape over the crimson — see the elements below) */
        .pd-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin: 0 !important;
        }
        .pd-row dt {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: ${FLURO};
          flex: none;
        }
        .pd-row dd {
          margin: 0 !important;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11px;
          line-height: 1.55;
          color: ${PAPER};
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pd-row a { color: ${PAPER}; }
        .pd-row a:hover { color: ${FLURO}; }
        /* the in-plate separator tape: shorter voice than the page's */
        .pd-details glaphic-tape {
          --glaphic-tape-hot: ${PAPER};
          --glaphic-tape-height: 6px;
          display: block;
          margin: 14px 0 10px;
        }

        /* TOP-RIGHT — the back-to-index button: the glaphic-button's
           OUTLINE recipe, pinned to the viewport's top-right corner at
           the pool-menu button's EXACT pinned offsets — .site-footer__menu's
           geometry mirrored to the top corner (its right 2.3vw and its
           4.4vh corner offset). The pin also lifts the button out of
           the 12-col grid's track, so the label's one line can never
           be squeezed by a column. */
        .pd-back-row {
          position: fixed;
          top: 4.4vh;
          right: 2.3vw;
          z-index: 50;
        }

        /* ── the image stream ─────────────────────────────────────
           the ride: the same 12-column grid — ONE continuous tall
           plate (Eliot's own structure: all of the images and their
           RAMP tape separators live inside a single block container on
           columns 5-12, no gaps — the plate reads with the TOP-LEFT
           cut at its start and the BOTTOM-RIGHT cut at its end), and
           the images travel under the pinned plates (the
           inspiration's pinned-corners / streaming-images split); the
           plate's right edge is the 5-12 line itself, which already
           STOPS SHORT of the shared band's pool-menu patch (measured
           at 1440: plate right edge 1272px, patch left 1338px — 66px
           of air; at 900: 779px vs 810px — 31px) — no extra margin on
           top of the track line */
        .pd-stream {
          position: relative;
          z-index: 10;
          padding-top: 6vh;
          padding-bottom: calc(37.5vh + 10vh);
          row-gap: 12vh;
        }
        /* the tall plate: the 2px rim is the plate's own paint (fluro
           — Eliot's rim read), the inner block cuts 2px perpendicular
           deeper along each face (20 / 18.83) — and ONLY the plate's
           two end corners carry cuts: the images inside are uncut
           (the seams are the tapes, not clipped re-entrant corners) */
        .pd-image-block-container {
          grid-column: 5 / 12;
          padding: 2px;
          background: ${FLURO};
          clip-path: polygon(${px(CUT)} 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%, 0 ${px(CUT)});
        }
        .pd-image-block {
          clip-path: polygon(${px(CUT_IN)} 0, 100% 0, 100% calc(100% - ${px(CUT_IN)}), calc(100% - ${px(CUT_IN)}) 100%, 0 100%, 0 ${px(CUT_IN)});
        }
        .pd-image { width: 100%; height: auto; }
        /* the ride's separators: RAMP tapes — the plate's OWN seams,
           inside the tall plate, spanning its full inner width (no
           right stop of their own: the plate's edge is the stop) */
        .pd-image-block-container glaphic-tape {
          --glaphic-tape-hot: ${CRIMSON};
          --glaphic-tape-height: 12px;
          display: block;
        }

        /* the stream's end CTA: the next project (the index array's
           ride order) — the index cards' rimmed recipe BACK on (the
           plates' bare read skips this one; Eliot: the CTA keeps its
           border), its hover a smaller version of the grow headline's
           stepped shadow print.
           The shadow runs on an UNCLIPPED WRAPPER: an element's own
           clip-path clips the drop-shadow filter's output (the shadow
           paints outside the silhouette and the clip cuts it —
           diagnosed live: the computed filter carried the full four
           tiers while nothing rendered). The wrapper has no
           clip-path/overflow, so its drop-shadow follows the clipped
           child's cut silhouette and survives. */
        .pd-next-wrap {
          grid-column: 5 / 12;      /* Eliot's grid position — stays */
          display: block;
        }
        .pd-next {
          display: block;
          width: 100%;
          padding: 2px;             /* the 2px keyline (the card's own
                                       paint) */
          background: ${KEYLINE};
          cursor: pointer;
          transition: transform 0.18s ease-out;
          clip-path: polygon(${px(CUT)} 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%, 0 ${px(CUT)});
        }
        .pd-next-in {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 26px;
          background: ${PLATE};
          clip-path: polygon(${px(CUT_IN)} 0, 100% 0, 100% calc(100% - ${px(CUT_IN)}), calc(100% - ${px(CUT_IN)}) 100%, 0 100%, 0 ${px(CUT_IN)});
        }
        .pd-next:hover,
        .pd-next:focus-visible {
          transition: none;
        }
        .pd-next:focus-visible { outline: none; }
        /* the hover print: the grow headline's stepped shadow stack,
           SMALLER — a tighter four-tier run (1/2/4/6px, vs the
           headline's five to 12px) — stepped in one pass, on the
           WRAPPER (drop-shadow layers compound onto the clipped
           silhouette — the fluro rim paints ink, so the stack reads) */
        .pd-next-wrap:has(.pd-next:hover),
        .pd-next-wrap:has(.pd-next:focus-visible) {
          animation: pd-grow-s 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) both;
        }
        .pd-next-label {
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: ${GREY};
        }
        .pd-next-title {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-size: clamp(20px, 2vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: ${INK};
        }
        /* the hover print: the grow headline's stepped shadow stack,
           RETUNED (Eliot's verdict: the four-tier run was too dramatic)
           — THREE tiers, 1/3/6px, and the tiers' ink FADES like the
           grow's text print does: each step's ink color-mixes toward
           the paper (solid paints, no alpha), so the far tiers read
           lighter — stepped in one pass, ON THE BUTTON (drop-shadow
           layers compound onto its clipped silhouette; the rim paints
           ink, so the stack reads) */
        @keyframes pd-grow-s {
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

        /* ── the page-change choreography (the detail routes' own
           driver — the wipe exempts these routes; see the module docs)
           ─────────────────────────────────────────────────────────
           ENTRANCE (any arrival — the mounted root carries
           pd-enter-on): the images/tapes block slides DOWN into place
           from ABOVE the viewport (un-faded); the green + red boxes
           slide in from FULLY OFF the left edge (~0.15s after the
           block starts — un-faded, solid all the way: the leave's
           fully-off-pose seam reads as one motion); the tape
           separators FADE IN once the block settles (the tapes' own
           beat) */
        @keyframes pd-stream-in {
          from { transform: translateY(-13vh); }
        }
        @keyframes pd-box-in {
          from { transform: translateX(-115%); }
        }
        @keyframes pd-tape-in {
          from { opacity: 0; }
        }
        .pd-enter-on .pd-stream {
          animation: pd-stream-in 0.4s ease-out both;
        }
        .pd-enter-on .pd-title,
        .pd-enter-on .pd-details {
          animation: pd-box-in 0.4s ease-out 0.15s both;
        }
        .pd-enter-on .pd-image-block glaphic-tape {
          animation: pd-tape-in 0.3s ease-out 0.5s both;
        }
        /* EXIT (the held swap's shapes — the driver plays it and
           applies the hash at its end): the boxes slide FULLY OUT past
           the viewport's LEFT edge (they rest there, un-faded, at the
           swap - the seam is off-screen), the image block drifts
           DOWN/AWAY (un-faded). Declared AFTER the entrance rules:
           while both classes ride the root, the pair wins the cascade
           and re-seats every animation as its exit form. */
        @keyframes pd-stream-out {
          to { transform: translateY(11vh); }
        }
        @keyframes pd-box-out {
          to { transform: translateX(-115%); }
        }
        .pd-exit-on .pd-stream {
          animation: pd-stream-out 0.4s ease-in both;
        }
        .pd-exit-on .pd-title,
        .pd-exit-on .pd-details {
          animation: pd-box-out 0.4s ease-in both;
          transform-origin: left center;
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-enter-on .pd-stream,
          .pd-enter-on .pd-title,
          .pd-enter-on .pd-details,
          .pd-enter-on .pd-image-block glaphic-tape,
          .pd-exit-on .pd-stream,
          .pd-exit-on .pd-title,
          .pd-exit-on .pd-details {
            animation: none;
          }
        }

        /* ── mobile: the pinned plates join the flow ─────────────── */
        @media (max-width: 899px) {
          /* the wrappers dissolve (display: contents) so their plate
              children join the page's own stack with orders — the
              mock's read: BOTH detail boxes ride ABOVE the images,
              touching (no gap between/around the boxes), then the
              images */
          .pd-page { display: flex; flex-direction: column; padding: 72px 6vw 6vh; }
          .pd-pin { display: contents; padding: 0; }
          .pd-stream { display: flex; flex-direction: column; padding: 0 0 3vh; row-gap: 0; gap: 6vh; }
          .pd-title { order: 0; max-height: none; overflow: visible; }
          .pd-details { order: 1; max-height: none; overflow: visible; }
          .pd-stream { order: 2; }
          /* the MOBILE chamfer scheme (Eliot): the GREEN (fluro) plate
             cuts at TOP-LEFT, the RED (crimson) plate cuts at
             BOTTOM-RIGHT (desktop keeps the rest cuts) */
          .pd-title {
            clip-path: polygon(${px(CUT)} 0, 100% 0, 100% 100%, 0 100%, 0 ${px(CUT)});
          }
          .pd-details {
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - ${px(CUT)}), calc(100% - ${px(CUT)}) 100%, 0 100%);
          }
          /* the stream's plate: full width but it STILL stops at
             --pd-clear (the fixed cluster pins bottom-right at 12px on
             mobile — the landing's own rule — so the button keeps its
             patch of corner) */
          .pd-image-block-container, .pd-next-wrap { grid-column: auto; margin-right: 0; margin-top: 6vh; }
          /* the back button rides the pool-menu button's mobile pin
             exactly (12px, .site-footer__menu's mobile geometry, mirrored to the
             top corner) */
          .pd-back-row {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 50;
          }
        }
      `}</style>

      {/* the shared band's foot (app.tsx mounts it in flow after this
          page) clears the pinned crimson details plate: the plate rides
          FIXED at the viewport's bottom-left (z 40, cols 1-4 of the
          3.9vw-padded 12-col grid ≈ 488px wide) and would print over the
          foot's brand/legal at the page's end — the foot's left column
          shifts right of the plate on desktop (mobile: the plates are
          static, the stacked foot needs no shift) */}
      <style>{`
        @media (min-width: 900px) {
          #main-content:has(.pd-page) .site-footer__band--footer .site-footer__foot {
            padding-left: 37.5vw;
          }
        }
      `}</style>

      {/* the top pin: title plate (cols 1-4) + back button (col 12) */}
      <div class="pd-pin pd-pin-top">
        {/* TOP-LEFT pinned plate — title + description (with one DRAFT
            tag so an entry's awaiting copy can't pass as sourced) */}
        <aside class="pd-title">
          <div class="pd-kicker">{`PRJ.${String(currentIndex + 1).padStart(3, '0')} /// ${project.title.toUpperCase()}`}</div>
          <h2 class="pd-heading">{project.title}</h2>
          <p class="pd-desc">{detail.description}</p>
          {detail.links?.length ? (
            <div class="pd-links">
              {detail.links.map((l) => (
                <a
                  href={l.href}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noopener noreferrer' : undefined}
                  key={l.label}
                >
                  <glaphic-button variant="outline" size="sm">{l.label}</glaphic-button>
                </a>
              ))}
            </div>
          ) : null}
          {detail.copy === 'draft' && <span class="pd-draft">DRAFT COPY — AWAITING ELIOT</span>}
        </aside>

        {/* TOP-RIGHT pinned — back to the index (the glaphic-button
            OUTLINE recipe: 1px ink keyline, transparent fill) */}
        <nav class="pd-back-row">
          <a href="#/projects" aria-label="Back to projects">
            <glaphic-button variant="outline" size="lg">← INDEX</glaphic-button>
          </a>
        </nav>
      </div>

      {/* the ride — the images stream under the pinned plates, RAMP
          tapes between the blocks, right edge clear of the band's
          patch */}
      <section class="pd-stream" aria-label={`${project.title} images`}>
        <div class="pd-image-block-container">
          <div class="pd-image-block">
            {streamImages.map((src, i) => (
              // one fragment per ride step: the shot then (between blocks)
              // the RAMP tape — the fragment's children land on the grid in
              // order, so each tape prints right under its block
              <Fragment key={src}>
                    <img
                      class="pd-image"
                      src={src}
                      alt={`${project.title} — image ${i + 1} of ${streamImages.length}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                {i < streamImages.length - 1 && (
                  <glaphic-tape pattern="ramp" class="pd-tape" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <div class="pd-next-wrap">
          <a
            class="pd-next"
            href={`#/projects/${nextProject.id}`}
            aria-label={`Next project: ${nextProject.title}`}
          >
            <span class="pd-next-in">
              <span class="pd-next-label">NEXT PROJECT</span>
              <span class="pd-next-title">{nextProject.title} →</span>
            </span>
          </a>
        </div>
      </section>

      {/* the bottom pin: the crimson details plate (col 1-3). The
          responsibilities section renders ONLY when an entry carries
          it (the coming agency-works page's seam — see
          src/data/projectDetails.ts) */}
      <div class="pd-pin pd-pin-bottom">
        <aside class="pd-details">
          <div class="pd-details-label">TECHNOLOGIES</div>
          <ul class="pd-tech">
            {detail.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {(detail.responsibilities?.length || detail.rows?.length || project.status || project.githubUrl) && (
            <glaphic-tape pattern="ramp" class="pd-tape" />
          )}
          {detail.responsibilities && detail.responsibilities.length > 0 && (
            <>
              <div class="pd-details-label">RESPONSIBILITIES</div>
              <ul class="pd-resp">
                {detail.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            </>
          )}
          {project.status && (
            <dl class="pd-row">
              <dt>STATUS</dt>
              <dd>{project.status}</dd>
            </dl>
          )}
          {project.status && project.githubUrl && (
            <glaphic-tape pattern="ramp" class="pd-tape" />
          )}
          {project.githubUrl && (
            <dl class="pd-row">
              <dt>SOURCE</dt>
              <dd>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </dd>
            </dl>
          )}
          {detail.rows?.map((row) => (
            <dl class="pd-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {row.href ? <a href={row.href}>{row.value}</a> : row.value}
              </dd>
            </dl>
          ))}
        </aside>
      </div>
    </div>
  );
}