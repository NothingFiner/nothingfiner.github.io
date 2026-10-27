import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { GrowHead } from './GrowHead';
import { GlaphicAccordion } from '@glaphic/ui';

const INK = '#0D0221';
const RED = '#A6022A';
const GREY = '#686474';

// the actions plate's tag-panel recipes (the mock's violet solid and
// the red outline under it) — the stories' own Log-in pairs
const VIOLET_SOLID = {
  '--glaphic-button-surface': 'var(--glaphic-ink-violet, #8447ff)',
  '--glaphic-button-border': 'var(--glaphic-ink-violet, #8447ff)',
  '--glaphic-button-text': 'var(--glaphic-neutral-paper, #f2f5eb)',
  '--glaphic-button-hover-surface': 'var(--glaphic-semantic-info-text, #5a1fcc)',
  '--glaphic-button-hover-border': 'var(--glaphic-semantic-info-text, #5a1fcc)',
};
const RED_OUTLINE = {
  '--glaphic-button-border': 'var(--glaphic-ink-brand-dark, #a6022a)',
  '--glaphic-button-text': 'var(--glaphic-ink-brand-dark, #a6022a)',
  '--glaphic-button-hover-surface': 'var(--glaphic-neutral-paper, #f2f5eb)',
  '--glaphic-button-hover-text': 'var(--glaphic-ink-brand-dark, #a6022a)',
  '--glaphic-button-hover-border': 'var(--glaphic-ink-brand-dark, #a6022a)',
};

export function LandingPast() {
  const [, navigate] = useLocation();
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLElement | null>(null);

  // reveal the grow + the strip's rise when the section scrolls in
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
    <section
      id="past"
      ref={hostRef}
      class={`landing-past ${inView ? 'ln-in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-now {
          position: relative;
          height: auto;
          padding-bottom: calc(37.5vh + 8vh);
          overflow: hidden;
          font-family: var(--f-body, 'Inter', sans-serif);
        }
        .landing-now * { margin: 0; box-sizing: border-box; }

        /* ── the padded flow grid (content gets the gutter) ──────── */
        .ln-flow {
          position: relative;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 1.1vw;
          padding-inline: 3.9vw;
        }
        .ln-head { grid-column: 1 / -1; padding-top: 3.6vh; }

        /* ── the card strip ────────────────────────────────────────
           the mock's strip: full-bleed from the screen's LEFT edge,
           ending flush at the sidebar's left edge (no gutter either
           side). The reveal rides the strip up from below (no fade).
           A TRANSITION, not a forwards-filled animation: a "both"
           fill keeps the wrapper composited, which ISOLATES it — the
           composed card's blend flicker then reads against the deck's
           empty interior instead of the page and the strobe dies (the
           same trap the pool plates hit in the footer band) */
        .ln-strip {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 29.6vw;
          margin-top: 12.6vh;
          transform: translateY(14vh);
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.1s;
        }
        .landing-now.ln-in .ln-strip {
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ln-strip { transition: none; transform: none; }
        }

        /* ── mobile: the flow stacks (as the sections above) ─────── */
        @media (max-width: 899px) {
          .landing-now { height: auto; order: 2; }
          .ln-flow { display: flex; flex-direction: column; padding-inline: 6vw; }
          .ln-head { margin-bottom: 24px; padding-top: 44px; }
          .ln-strip { margin-inline: -6vw 0; margin-top: 8vh; }
        }
      `}</style>

      <div class="ln-flow">
        <GrowHead text="Past Work" inView={inView} class="ln-head" />
        <glaphic-plate tone="brand" />
        <glaphic-tape />
        <div class="grid-col-5 grid-row-3">
            <div class="row-span-3 col-span-2">
                <div class="past__image-container">
                    <img src="./assets/brooksbrothers.png" />
                </div>
                <div class="past__image-container">
                    
                </div>
                <div class="past__image-container">
                    
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}