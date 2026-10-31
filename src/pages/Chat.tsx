// New-design chat page — "Resume RAG." (the design/ chat artboards,
// settled: Eliot's call — the page loads in ONE pose, no pose dance).
// The page is a clear stage over the site's lava lamp (recolored to the
// new inks on its paper base) with NO crimson sidebar and NO sticky
// header (app.tsx skips the chrome for this route):
//
//   headline     solid crimson at the page's top-left from load —
//                the entered mock's pose and style, from the start.
//   compose      the paper input row pinned low-center; the model-status
//                tab hangs under it once the user has entered the chat
//                (clicked in / focused it) — nothing model-status shows
//                before that — and the note under the tab is the yellow
//                download warning until the first send, the violet
//                disclaimer after ("its 'resume' jumps to the site's
//                resume page"). The card (ChatInterface) is the only
//                thing that arrives on send.
//   chrome       the shared footer band (SiteFooter) — the pool
//                menu over the contact icons bottom-right, the `////`
//                copyright bottom-left, all in from load (menuDelay 0 —
//                the fold's arrival timer is the landing's). The band
//                REPLACED this page's own bespoke footer (its aee pose
//                mark, its `///` line and its stroke-outlined icons rode
//                on the band's grammar but were a second implementation —
//                Eliot: one menu element everywhere; the band's classed
//                treatment carries the corner instead).
import ChatInterface from '../components/ChatInterface';

// the page's inks: the site's named inks, plus the chat's state plates
// and the library's neutral-ramp levels the recipes use (trailing
// comments name the --glaphic-* token each value matches)
const INK = '#0D0221';
const RED = '#A6022A';
const PAPER = '#F2F5EB';             // var(--glaphic-neutral-paper)
const PAPER_DEEP = '#E9EDE0';        // var(--glaphic-neutral-paper-deep)
const CARD_RIM = '#D5D2DE';          // var(--glaphic-neutral-grey-cool-200)
const RIM = '#9D99AB';               // var(--glaphic-neutral-grey-cool-400)
const COOL_100 = '#E9E7EF';          // var(--glaphic-neutral-grey-cool-100)
const COOL_300 = '#BAB6C7';          // var(--glaphic-neutral-grey-cool-300)
const GREY = '#686474';
const YELLOW = '#FFE873';
const VIOLET = '#5A1FCC';
const VIOLET_PALE = '#EFE8FF';

// the arrow button's reactive recipe — the glaphic outline button's
// states with the brand-dark (crimson) ink: transparent fill at rest,
// paper-deep pouring in on hover (the rim's ink holds), the press
// stepping to the plate's offset, disabled greying to the cool ramp
const OUTLINE = {
  surface: 'transparent',
  text: RED,
  border: RED,
  'hover-surface': PAPER_DEEP, // var(--glaphic-neutral-paper-deep)
  'disabled-surface': COOL_100, // var(--glaphic-neutral-grey-cool-100)
  'disabled-text': COOL_300, // var(--glaphic-neutral-grey-cool-300)
  'disabled-border': COOL_300,
};

export function Chat() {
  return (
    <div class="chat">
      <style>{`
        /* ONE SCREEN: the band mounts in flow after this page's slot —
           so the MAIN (the stage's flow parent) flexes to the viewport
           height and the stage fills the rest: the chat + the footer's
           foot read as one screen, no scroll, at any size. The stage's
           own wrapper div (its real flow parent) rides the fill too —
           the stage's min-height:100% chain needs it */
        #main-content:has(.chat) {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        #main-content:has(.chat) > div {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }
        /* EXCEPT the band itself (also a div child): it keeps its own
           height — the stage's the one filling */
        #main-content:has(.chat) > .site-footer__band {
          flex: 0 0 auto;
        }
        #main-content:has(.chat) .chat {
          flex: 1 1 auto;
          min-height: 0;
        }
        .chat {
          position: relative;
          /* the ground is the site's lava lamp (recolored to the new
             inks on its paper base, behind this page's plates) — the
             page itself stays CLEAR so the lamp's paper shows through */
          min-height: 100%;
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .chat * { margin: 0; box-sizing: border-box; }

        /* ── the headline — the entered mock's top-left pose from load ── */
        .chat__head {
          position: absolute;
          left: 3.1vw;
          top: 6vh;
          z-index: 2;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(34px, 4.9vw, 70px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: ${RED};
        }

        /* ── mobile: the composition stacks in the flow ─────────── */
        @media (max-width: 899px) {
          .chat { padding-bottom: 120px; }
          .chat__head { position: static; padding: 56px 6vw 0; }
        }

        /* the page's class layer: the stem/card/compose/tab/note rules that
           used to print inside ChatInterface, the page's one section.
           Anatomy: page-private classes live in the page's block; the
           component composes but prints no styles. Moved verbatim; the
           bare hexes now read this module's named inks. */

        /* ── the stem: the centered hold the card + compose live in ─
           the compose block never moves on selection (the pose's
           differences hang off the input, not where it stands); only
           the card's arrival re-anchors the stem (it carries a card +
           its air, which claims the drop the submitted mock shows) */
        .chat__stem {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 27vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
          transition: bottom 0.5s cubic-bezier(0.25, 1, 0.4, 1);
        }
        .chat__stem--card { bottom: 20.8vh; }

        /* ── the chat card (the submitted mock's big light panel) ── */
        .chat__card {
          width: 546px;
          max-width: 88vw;
          height: 364px;
          background: ${PAPER_DEEP};
          border: 1px solid ${CARD_RIM};
          /* the mock's card-to-tab air (the tab rides under the input
             at its own absolute height) */
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .chat__card::-webkit-scrollbar { width: 6px; }
        .chat__card::-webkit-scrollbar-thumb { background: ${RIM}; }

        /* ── the compose block: input + status tab + disclaimer ──── */
        .chat__compose {
          position: relative;
          width: 546px;
          max-width: 88vw;
        }

        /* ── the input row: the mock's paper field + outlined arrow ─ */
        .chat__form {
          position: relative;
          display: flex;
          align-items: center;
          background: ${PAPER};
          border: 1px solid ${RIM};
          height: 55px;
        }
        .chat__field {
          flex: 1;
          padding: 0 20px;
          /* the field's mono type centers in the 55px row */
          line-height: 51px;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 14px;
          color: ${INK};
          white-space: nowrap;
          overflow-x: auto;
        }
        /* the mock's field carries only its 1px rim — the global
           :focus-visible ring stays on the rest of the site's controls,
           not the chat's caret row */
        .chat__field,
        .chat__field:focus,
        .chat__field:focus-visible {
          outline: none;
          caret-color: ${GREY};
        }
        .chat__field:empty::before {
          content: attr(data-placeholder);
          color: ${GREY};
        }

        /* the arrow button — the glaphic outline recipe on the
           brand-dark ink (see OUTLINE above): rim + arrow the same
           crimson, the fill transparent until hover pours paper-deep
           under it, press steps the plate, disabled greys out */
        .chat__send {
          position: absolute;
          right: 9px;
          top: 50%;
          translate: 0 -50%;
          width: 36px;
          height: 37px;
          border: 1px solid ${OUTLINE.border};
          border-radius: 2px;
          background: ${OUTLINE.surface};
          color: ${OUTLINE.text};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.18s ease, translate 0.1s ease, color 0.18s ease;
        }
        .chat__send:hover:not(:disabled) { background: ${OUTLINE['hover-surface']}; }
        .chat__send:active:not(:disabled) { translate: 1px calc(-50% + 1px); }
        .chat__send:disabled {
          background: ${OUTLINE['disabled-surface']};
          color: ${OUTLINE['disabled-text']};
          border-color: ${OUTLINE['disabled-border']};
          cursor: default;
        }

        /* ── the status tab: the small mono readout hanging under the
           input's left edge (the mock's plate, moved below the box) ─ */
        .chat__tab {
          position: absolute;
          top: 100%;
          left: 15px;
          height: 28px;
          min-width: 140px;
          background: ${YELLOW};
          overflow: hidden;
          white-space: nowrap;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 12px;
          line-height: 1;
          color: ${INK};
          padding: 0 10px;
          display: flex;
          align-items: center;
          transition: background 0.3s ease-out;
        }

        /* ── the note under the tab — state-driven: the yellow warning
           plate before the first send (the status tab's warning inks,
           same plate geometry as the violet note), the violet disclaimer
           once the chat has begun ── */
        .chat__note {
          position: absolute;
          top: calc(100% + 50px);
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          max-width: 88vw;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          line-height: 1.35;
          padding: 11px 18px;
        }
        .chat__note--warn {
          background: ${YELLOW};
          border: 1px solid ${INK};
          color: ${INK};
        }
        .chat__note--disclaimer {
          background: ${VIOLET_PALE};
          border: 1px solid ${VIOLET};
          color: ${VIOLET};
        }
        .chat__note a { color: inherit; }

        @media (max-width: 899px) {
          .chat__stem, .chat__stem--card {
            position: static;
            margin-top: 14vh;
            padding: 0 6vw;
          }
          .chat__card { width: 100%; height: 46vh; margin-bottom: 24px; }
          /* mobile flips the tab's hang: it sits ABOVE the input (the
             note is in the flow right below, so hanging down would drop
             the tab onto it) — same plate, same inks, mirrored anchor */
          .chat__tab {
            left: 0;
            min-width: 140px;
            top: auto;
            bottom: calc(100% + 9px);
          }
          .chat__note { position: static; transform: none; margin-top: 44px; }
          .chat__send { width: 44px; height: 44px; }
        }
      `}</style>

      {/* the headline: solid crimson, top-left, from load */}
      <h2 class="chat__head">Resume RAG</h2>

      <ChatInterface />
    </div>
  );
}