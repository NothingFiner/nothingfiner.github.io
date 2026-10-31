// The eee logo's echoed pair (the hero's rows 1-5 band): crimson print +
// cyan echo offset right of it by a fraction of the logo's width, the pair
// centered on screen, both capped to the band's height, multiply overlap.
// They slide in from off-screen on load; every few seconds each copy runs
// a short signal-loss glitch burst (steps(1) makes the jitter read as
// signal loss, not drift) on its own period, so the pair visibly detaches.
//
// The eee logo (public/assets/logo.svg, single path, ~2.088:1 viewBox) is
// consumed directly as a CSS mask by the glyph boxes, so the copies always
// stay in sync with that file.
//
// Glyph geometry: the band spans the top 5 grid rows. The boxes' height
// is capped at 100% of the band (the mask's `contain` fit keeps the logo
// inside it, so it can never spill into the hero text below no matter the
// viewport shape). Each copy fills one box of the logo's own width; the
// echo is offset by ECHO_OFFSET — a fraction of that logo width, NOT of
// the screen — so the amount of overlap between the two reads the same
// at every viewport size. The whole composition (logo width + offset)
// is centered on the screen. Tune ECHO_OFFSET freely.
const ECHO_OFFSET = '22%';
// the box shift that centers a logo + echo-offset-wide composition: half of
// (one logo width + the echo overhang)
const PAIR_SHIFT = -(0.5 + parseFloat(ECHO_OFFSET) / 200);

function GlyphDiv({ copy }: { copy: 'base' | 'echo' }) {
  return <div class={`glyph-pair__glyph glyph-pair__glyph--${copy}`} />;
}

export function GlyphPair() {
  return (
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
          /* center the whole composition — the box holds one logo and the
             echo hangs past its right edge, so shift left by half of
             (logo width + the echo overhang). Number x length only in calc:
             a percentage x length product would be an invalid, dropped rule. */
          left: 50%;
          margin-left: calc(var(--gl-w) * -${Math.abs(PAIR_SHIFT)});
        }
        .glyph-pair__glyph {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          mix-blend-mode: multiply;
          -webkit-mask: url('/assets/logo.svg') top / contain no-repeat;
          mask: url('/assets/logo.svg') top / contain no-repeat;
        }
        .glyph-pair__glyph.glyph-pair__glyph--base {
          left: 0;
          background: #A6022A;
          animation: glyph-pair-slide-l 1s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both
        }
        .glyph-pair__glyph.glyph-pair__glyph--echo {
          left: ${ECHO_OFFSET}; /* a fraction of the LOGO width, not the screen */
          background: #14F1C8;
          animation: glyph-pair-slide-r 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both
        }
        @keyframes glyph-pair-slide-l { from { transform: translateX(-110vw); } to { transform: translateX(0); } }
        @keyframes glyph-pair-slide-r { from { transform: translateX(110vw); } to { transform: translateX(0); } }
       
        @media (max-width: 767px) {
          .glyph-pair__band { height: 42vh; flex: none; grid-area: auto; }
          .glyph-pair__pair { width: 115vw; }
        }
      `}</style>
      <div class="glyph-pair__pair">
        <GlyphDiv copy="base" />
        <GlyphDiv copy="echo" />
      </div>
    </div>
  );
}