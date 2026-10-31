// New-design landing hero (above the fold), built from the Figma mock
// (a 1440x970 artboard): one echoed pair of the eee logo on the top five
// grid rows (crimson print, cyan echo offset right by a fraction of the
// logo's width, the pair centered on screen, multiply overlap), sliding
// in from off-screen — then, every few seconds, a short signal-loss
// glitch burst (each copy on its own period, so the pair visibly
// detaches).
//
// The lower grid rows hold the fold's OWN strip (back from the shared
// band per Eliot's call): the typed copy block — cursor-typed "Hi,"
// (cyan) then " I'm Elie." (crimson), the role/experience lines fading
// in once the print lands, then the typed "Let me help you tell your
// story." — with room left below it for the grey `////` copyright line.
// The LEARN MORE card and the pool-menu/icons cluster stay downstream in
// the sticky SiteFooter band (one copy across the journey); the fold's
// `////` legal is composed from the footer's own FooterLegal piece.
//
// The section itself paints no background: the site's line-hatch ground
// (LavaLampBackground) shows through — the hatch reads across the hero.
import { useEffect, useRef, useState } from 'preact/hooks';
import { GlyphPair } from './GlyphPair';
import { FooterLegal } from './SiteFooter';
import { rideOutUp } from './landing-shared';

const INK = '#0D0221';
const CYAN = '#89F3FF';
const CRIMSON = '#A6022A'; // brand-dark crimson ink (the site's brand-dark token)

// Staggered cursor-in choreography: "Hi," types on load; " I'm Elie."
// mounts the instant "Hi," finishes; the rest of the copy waits for that
// print. (The pool-menu arrival in the sticky band keeps its own timer.)
const tHi = 700, chHi = 55, chElie = 55;
const tElie = tHi + 'Hi,'.length * chHi + 10;
const tElieEnd = tElie + ' I\'m Elie.'.length * chElie + 10;

export function LandingHero() {
  const [showElie, setShowElie] = useState(false);
  // the hero's content rides out the top as the about arrives (the same ride every landed section carries)
  const heroRideRef = useRef<HTMLDivElement | null>(null);
  const [copyIn, setCopyIn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowElie(true), tElie);
    const t2 = setTimeout(() => setCopyIn(true), tElieEnd);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // the hero's content rides out the top as the about arrives (the
  // same ride every landed section carries)
  useEffect(() => {
    const section = document.querySelector('.landing-hero') as HTMLElement | null;
    return rideOutUp({ current: section }, heroRideRef, 0.5);
  }, []);

  return (
    <section class="landing-hero relative w-full overflow-hidden">
      {/* the ride group: everything inside rides up on the section's exit.
          THE RIDE GROUP IS THE GRID: the hero's grid placement (the
          glyph band's grid-area, the strip's rows) needs a grid parent —
          this wrapper carries the same 12×8 tracks + full height, so
          the placements stay live while the wrapper's transform rides */}
      <div ref={heroRideRef} class="hf-ride">
      <style>{`
        .landing-hero {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(8, minmax(0, 1fr));
          /* definite height: fr rows need one to resolve to viewport eighths */
          height: 100vh;
          /* the section's ink — the fold's copy prints INK on the hatch */
          color: ${INK};
        }
        @media (max-width: 767px) {
          .landing-hero {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative; }
        }

        /* the ride wrapper: THE RIDE GROUP IS THE GRID — the hero's grid
           placements (the glyph band's grid-area, the strip's rows) need a
           grid parent, so this wrapper carries the same 12×8 tracks + full
           height and the placements stay live while the wrapper's transform
           rides (see the JSX comment) */
        .hf-ride {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(8, minmax(0, 1fr));
          grid-area: 1 / 1 / 9 / 13;
          height: 100%;
        }

        /* ── the fold's own lower strip (grid rows 6-8) ───────────── */
        .hf-strip {
          grid-area: 6 / 1 / 9 / 13;
          /* a flex stage and the copy sits on its floor (the sticky ////'
             line parks below it) — it lands here however the fr rows resolve */
          display: flex;
          align-items: flex-end;
          /* the floor rides 12.5vh up the viewport bottom: clearance for
             the sticky '////' line parked under the copy */
          padding-bottom: 5vh;
        }
        @media (max-width: 767px) {
          .hf-strip { display: block; margin-top: 20px; padding-bottom: 28px; }
        }

        /* the typed copy block — the strip's bottom edge; the right 32vw
           stays clear for the band's menu / icons cluster */
        .hf-copy {
          width: 100%;
          padding-right: 32vw;
          display: flex;
          align-items: center;
          gap: 0;
        }
        /* neither side of the row ever flex-shrinks: a squeezed headline
           would tip "Hi, I'm Elie." into a mid-type line-break (the wrap
           flash) — they overflow the row instead */
        .hf-copy .gl-title { flex: none; }
        .hf-copy .gl-lead { flex: none; }
        @media (max-width: 767px) {
          .hf-copy {
            flex-direction: column;
            align-items: flex-start;
            width: auto;
            gap: 10px;
            margin: 0 6vw;
            padding-right: 0;
          }
          .hf-copy .gl-lead { padding-left: 0; padding-bottom: 0; gap: 6px; }
        }
        .gl-title {
          padding-left: 2.3vw;
          font-family: var(--f-disp, sans-serif);
          font-weight: 700;
          font-size: clamp(48px, 8vw, 116px);
          letter-spacing: -0.02em;
          min-height: 1.05em;
          margin: 0;
          /* the staged cursor-type mounts never re-flow the headline */
          white-space: nowrap;
        }
        .gl-lead {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-left: 2.5vw;
          padding-bottom: 0.6vh;
          font-family: var(--f-body, sans-serif);
          font-size: clamp(13px, 1.15vw, 17px);
        }

        /* the typed cuts — the two headline mounts ("Hi," in cyan,
           " I'm Elie." in crimson) and the lead's typed line print at the
           same display/body voice their row already carries; the wraps
           hold the ink, the cursor-type hosts ride as inline-block cuts
           of the line (their block cursors print the copy's own ink) */
        .hf-type-hi, .hf-type-elie {
          font-family: var(--f-disp, sans-serif);
          font-size: 1em;
        }
        .hf-type-hi { color: ${CYAN}; }
        .hf-type-elie { color: ${CRIMSON}; }
        .hf-type-lead { color: ${INK}; font-weight: 600; }
        .hf-type-hi > glaphic-cursor-type,
        .hf-type-elie > glaphic-cursor-type,
        .hf-type-lead > glaphic-cursor-type {
          font-size: 1em;
          font-weight: 700;
          display: inline-block;
          line-height: 1;
        }
        .hf-type-hi > glaphic-cursor-type {
          color: ${CYAN};
          font-family: var(--f-disp, sans-serif);
          --glaphic-cursor-type-cursor-ink: ${CYAN};
        }
        .hf-type-elie > glaphic-cursor-type {
          color: ${CRIMSON};
          font-family: var(--f-disp, sans-serif);
          --glaphic-cursor-type-cursor-ink: ${CRIMSON};
        }
        .hf-type-lead > glaphic-cursor-type {
          color: ${INK};
          font-family: var(--f-body, sans-serif);
          font-weight: 600;
        }
        /* the grey '////' copyright IS here now — the HERO's own
           from-load instance (Eliot's redraw: the landing's legal reads
           ONLY at the top (this one; inside the hero's flow, so it
           scrolls away with the hero — nothing legal pins mid-scroll)
           and at the band's foot at the very bottom). Same floor
           rhythm the fold riders park at */
        .landing-hero__legal {
          position: absolute;
          left: 0;
          bottom: 4.4vh;
          padding-left: 2.3vw;
        }
        @media (max-width: 767px) {
          .landing-hero__legal { position: static; display: block; margin: 40px 6vw 0; padding-left: 0; opacity: 1; }
          .gl-title {
            padding-left: 0;
          }
        }

        /* on-load fades */
        .hero-fade { opacity: 0; animation: hero-fade-in 0.7s ease-out forwards; }
        .gl-hold { opacity: 0; }
        .gl-hold.gl-in { animation: hero-fade-in 0.7s ease-out forwards; }
        @keyframes hero-fade-in { to { opacity: 1; } }
      `}</style>

      {/* rows 1-5 — glyph band: one echoed pair; box height capped at 100%
          (mask `contain` fits the logo inside, so it can't spill downward) */}
      <GlyphPair />

      {/* rows 6-8 — the fold's typed copy (the sticky band's `////`
          copyright parks just below it at the page top) */}
      <div class="hf-strip">
        <div class="hf-copy">
          <h2 class="gl-title">
            {/* The heading's real text. It must exist at first paint: the two
                cursor-type components below only render their string into a
                shadow root after a typing delay, which left this h2 with an
                EMPTY accessible name and empty innerText (blank to screen
                readers, to the prerender snapshot, and to any non-JS fetcher).
                The visible typed copies are aria-hidden because they are a
                performance of these same words. */}
            <span class="sr-only">Elie Gaspar-Finer — frontend-focused senior engineer</span>
            <span aria-hidden="true" class="gl-typewrap hf-type-hi">
              <glaphic-cursor-type
                text="Hi,"
                speed={chHi}
                cursor-vanish
              />
            </span>
            {showElie && (
              <span aria-hidden="true" class="gl-typewrap hf-type-elie">
                <glaphic-cursor-type
                  text=" I'm Elie."
                  speed={chElie}
                  cursor-vanish
                />
              </span>
            )}
          </h2>

          <div class="gl-lead">
            {/* same words as the h1's accessible text — hidden here so the role
                isn't announced twice */}
            <div class={`gl-hold ${copyIn ? 'gl-in' : ''}`} aria-hidden="true">
              FRONTEND_FOCUSED_SENIOR_ENGINEER
            </div>
            <div class={`gl-hold ${copyIn ? 'gl-in' : ''}`} style={{ animationDelay: '0.2s' }}>
              12+ Years of Experience.
            </div>
            {/* always mounted: keeps the line box stable so the column doesn't
                shift up when the line starts typing; text="" -> re-types on
                change is the component's documented behavior */}
            <div class="gl-typewrap hf-type-lead">
              <glaphic-cursor-type
                text={copyIn ? 'Let me help you tell your story.' : ' '}
                speed={28}
                style={{ '--glaphic-cursor-type-cursor-ink': copyIn ? INK : 'transparent' }}
              />
            </div>
          </div>
        </div>
        {/* the hero's own `////` legal — the fold's from-load instance,
            composed from the footer's own piece (SiteFooter's
            FooterLegal; the landing's OTHER instance lives at the
            band's foot, at the page's end; Eliot's redraw: two
            positions, nothing between) */}
        <FooterLegal fade class="landing-hero__legal" />
      </div>
      </div>

    </section>
  );
}