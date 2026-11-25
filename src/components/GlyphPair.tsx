// The eee logo's echoed pair (the hero's rows 1-5 band): crimson print +
// cyan echo offset right of it by a fraction of the logo's width, the pair
// centered on screen, both capped to the band's height, multiply overlap.
// They slide in from off-screen on load.
//
// The eee logo (public/assets/logo.svg, single path, ~2.088:1 viewBox) is
// consumed directly as a CSS mask by the glyph boxes, so the copies always
// stay in sync with that file.
//
// GLYPH GEOMETRY: the band spans the top 5 grid rows. The boxes' height is
// capped at 100% of the band (the mask's `contain` fit keeps the logo
// inside it, so it can never spill into the hero text below no matter the
// viewport shape). Each copy fills one box of the logo's own width; the
// echo is offset by ECHO_OFFSET — a fraction of that logo width, NOT of
// the screen — so the amount of overlap between the two reads the same at
// every viewport size. The whole composition (logo width + offset) is
// centered on the screen. Tune ECHO_OFFSET freely.
//
// ROUND 9 — TRUE MULTIPLY, IN THE GROUND'S CONTEXT. <Landing> mounts
// inside a `relative z-40` shell that walls the page off the fixed hatch —
// blending is stacking-context-local, so the pair's multiply never reached
// the ground (measured, probe 9: the ink rendered the RAW token
// 166,2,42 — its ⊗paper value would be 157,2,39). The v3 knockout cuts
// (a phase formula seating transparent holes on the ground's lattice,
// fold-true only) are RETIRED and replaced: the in-page pair box stays as
// the layout RULER — the box alone carries the hero's responsive geometry
// (50vw−K·gl-w / 5vh / 62.5vh / max(72vw, 640px)) — and the actual copies
// render via portal into the document's END, where their blends meet the
// ground for real: the sage lines pass THROUGH the letterforms at every
// scroll (crimson⊗paper (157,2,39) base with crimson⊗sage (146,2,36)
// lines; the echo compounds onto that backdrop, so the navy overlap is a
// hair darker than the in-page navy was — expected: true multiply runs
// both passes). No phase math, no cuts: with a blend the lattice is
// decoration, not a constraint.
// GUARD 1 — the mirror's whole ancestor chain (body wrapper → html) must
// stay free of stacking contexts (no z-index / transform / filter /
// opacity<1 on the wrapper or body) or the blends wall off again.
// GUARD 2 — the mirror RIDES with the hero's ride-out (rideOutUp) via the
// --gl-hero-ride layout var (a `top` calc), never a transform of its own:
// a transformed mirror would re-stack and re-isolate the blend.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';

const ECHO_OFFSET = '22%';
// the box shift that centers a logo + echo-offset-wide composition: half of
// (one logo width + the echo overhang)
const PAIR_SHIFT = -(0.5 + parseFloat(ECHO_OFFSET) / 200);

// the in-page copies: mobile's painters (≤899px renders the pair solid,
// logo-masked, blending each other) — on desktop the pair div is the
// invisible ruler the mirror measures.
function GlyphDiv({ copy }: { copy: 'base' | 'echo' }) {
  return <div class={`glyph-pair__glyph glyph-pair__glyph--${copy}`} />;
}

export function GlyphPair() {
  const pairRef = useRef<HTMLDivElement | null>(null);
  const worldPairRef = useRef<HTMLDivElement | null>(null);

  // THE MEASURED HOOK: the ruler's document coords → the mirror's CSS
  // vars. Measured, never derived: the layout is the source of truth, so
  // it survives every viewport, breakpoint and font-metric change. The
  // climb runs on offsetTop/offsetLeft (layout boxes) — immune to the
  // ride transform, which getBoundingClientRect would fold into the read.
  const measure = () => {
    const pair = pairRef.current;
    const mirror = worldPairRef.current;
    if (!pair || !mirror) return;
    let top = 0;
    let left = 0;
    let el: HTMLElement | null = pair;
    while (el) {
      top += el.offsetTop;
      left += el.offsetLeft;
      el = el.offsetParent as HTMLElement | null;
    }
    const box = pair.getBoundingClientRect();
    mirror.style.setProperty('--gl-m-top', `${top}px`);
    mirror.style.setProperty('--gl-m-left', `${left}px`);
    mirror.style.setProperty('--gl-m-w', `${box.width}px`);
    mirror.style.setProperty('--gl-m-h', `${box.height}px`);
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (pairRef.current) ro.observe(pairRef.current);
    window.addEventListener('resize', measure);
    // font swaps move nothing above the band, but the read stays live
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <>
      <div class="glyph-pair__band">
        <style>{`
          .glyph-pair__band {
            /* rows 1-5 (5 rows): grid lines 1 → 6 (line 6 is the row-5/6 boundary) */
            grid-area: 1 / 1 / 6 / 13;
            position: relative;
          }
          .glyph-pair__pair {
            --gl-w: max(72vw, 640px);
            position: absolute;
            top: 0;
            margin-top: 5vh;
            width: var(--gl-w);
            height: 100%;
            /* center the whole composition — the box holds one logo and
               the echo hangs past its right edge, so shift left by half
               of (logo width + the echo overhang). Number x length only
               in calc: a percentage x length product would be an
               invalid, dropped rule. */
            left: 50%;
            margin-left: calc(var(--gl-w) * -${Math.abs(PAIR_SHIFT)});
            /* round 9: on desktop this div is the RULER — the layout box
               the mirror measures. Its paint retired to the world mirror. */
          }
          @media (min-width: 900px) {
            .glyph-pair__pair { visibility: hidden; }
          }
          .glyph-pair__glyph {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            mix-blend-mode: multiply;
          }
          .glyph-pair__glyph.glyph-pair__glyph--base {
            left: 0;
            background: #A6022A;
            animation: glyph-pair-slide-l 1s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
          }
          .glyph-pair__glyph.glyph-pair__glyph--echo {
            left: ${ECHO_OFFSET}; /* a fraction of the LOGO width, not the screen */
            background: #14F1C8;
            animation: glyph-pair-slide-r 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
          }
          @keyframes glyph-pair-slide-l { from { transform: translateX(-110vw); } to { transform: translateX(0); } }
          @keyframes glyph-pair-slide-r { from { transform: translateX(110vw); } to { transform: translateX(0); } }

          /* round 9 — the world-pair mirror: the painting copies, portaled
             to the document's END (tree-last in <body>, outside every
             z-walled shell). The pair element is the ruler's twin: its BOX
             is the measured vars and its ride is the layout var the hero's
             rideOutUp publishes; its CHILDREN blend for real. */
          .world-pair__pair {
            position: absolute;
            left: var(--gl-m-left, 0px);
            top: calc(var(--gl-m-top, 0px) + var(--gl-hero-ride, 0px));
            width: var(--gl-m-w, 0px);
            height: var(--gl-m-h, 0px);
            pointer-events: none;
          }
          .world-pair__glyph {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            mix-blend-mode: multiply;
            /* the copies are the LETTERFORMS only — the hatch shows through
               the ink by the blend itself (measured: the sage lines
               multiply into the crimson at (146,2,36)) */
            mask: url('/assets/logo.svg') center top / contain no-repeat;
          }
          .world-pair__glyph.world-pair__glyph--base {
            left: 0;
            background: #A6022A;
            animation: glyph-pair-slide-l 1s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
          }
          .world-pair__glyph.world-pair__glyph--echo {
            left: ${ECHO_OFFSET};
            background: #14F1C8;
            animation: glyph-pair-slide-r 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
          }

          /* reduced motion: the house 1ms parking run (landing.css's
             grow-head pattern) — the copies land AT their final state on
             first paint, nothing rides, everything at rest, fill intact */
          @media (prefers-reduced-motion: reduce) {
            .glyph-pair__glyph--base,
            .glyph-pair__glyph--echo,
            .world-pair__glyph--base,
            .world-pair__glyph--echo {
              animation-duration: 1ms;
              animation-delay: 0s;
            }
          }

          @media (max-width: 899px) {
            .glyph-pair__band {
              flex: none;
              /* round 9b: the copy's own var, so the band hugs the ink —
                 the pair's margin-top (5vh) + the mask's contain height
                 (0.4807692 × box width) — no dead box below the mark */
              height: calc(5vh + 55.2885vw);
              /* the DESKTOP band spans all 12 columns; the old mobile
                 grid-area auto shrank it to ONE column (32.5px), so the
                 pair's left:50% resolved off a sliver and parked the
                 composition off the left edge. Full width stays. */
              grid-area: auto / 1 / auto / 13;
            }
            /* round 9b: size by the SAME var the centering reads: the box,
               the left margin (−0.61·gl-w) and the echo's 22% offset all
               track one width — the old bug kept --gl-w at the desktop's
               640px floor while the width went 115vw, parking the pair
               ~195px off the left edge */
            .glyph-pair__pair { --gl-w: 115vw; }
            /* the copies render solid in-page (the mirror is off on
               mobile: its read targets the desktop's fold/ride geometry);
               mask-composite add on a single mask layer keeps the
               earlier mobile read */
            .glyph-pair__glyph {
              mask: url('/assets/logo.svg') center top / contain no-repeat;
              mask-composite: add;
            }
            .world-pair__pair { display: none; }
          }
        `}</style>
        {/* the in-page ruler: mobile's painters; desktop's layout anchor */}
        <div ref={pairRef} class="glyph-pair__pair">
          <GlyphDiv copy="base" />
          <GlyphDiv copy="echo" />
        </div>
      </div>
      {/* the mirror: portaled to the document's END — tree-last in <body>,
          outside <Landing>'s z-40 shell, so the blends run against the
          fixed ground in the root context (body wrapper: inert, decor) */}
      {createPortal(
        <div aria-hidden="true">
          <div ref={worldPairRef} class="world-pair__pair">
            <div class="world-pair__glyph world-pair__glyph--base" />
            <div class="world-pair__glyph world-pair__glyph--echo" />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}