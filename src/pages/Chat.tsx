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

const RED = '#A6022A';

export function Chat() {
  return (
    <div class="chat-page">
      <style>{`
        /* ONE SCREEN: the band mounts in flow after this page's slot —
           so the MAIN (the stage's flow parent) flexes to the viewport
           height and the stage fills the rest: the chat + the footer's
           foot read as one screen, no scroll, at any size. The stage's
           own wrapper div (its real flow parent) rides the fill too —
           the stage's min-height:100% chain needs it */
        #main-content:has(.chat-page) {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        #main-content:has(.chat-page) > div {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }
        /* EXCEPT the band itself (also a div child): it keeps its own
           height — the stage's the one filling */
        #main-content:has(.chat-page) > .lf-band {
          flex: 0 0 auto;
        }
        #main-content:has(.chat-page) .chat-page {
          flex: 1 1 auto;
          min-height: 0;
        }
        .chat-page {
          position: relative;
          /* the ground is the site's lava lamp (recolored to the new
             inks on its paper base, behind this page's plates) — the
             page itself stays CLEAR so the lamp's paper shows through */
          min-height: 100%;
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .chat-page * { margin: 0; box-sizing: border-box; }

        /* ── the headline — the entered mock's top-left pose from load ── */
        .chat-head {
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
          .chat-page { padding-bottom: 120px; }
          .chat-head { position: static; padding: 56px 6vw 0; }
        }
      `}</style>

      {/* the headline: solid crimson, top-left, from load */}
      <h2 class="chat-head">Resume RAG</h2>

      <ChatInterface />
    </div>
  );
}