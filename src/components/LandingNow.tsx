// New-design landing section four — "What I'm up to." (the now block
// between the technologies and the footer band; #now, which the
// sidebar's nav jumps to). Same layout grammar as the sections above it
// (a 1440x900-artboard section: the shared grow headline over the paper
// ground, the padded flow grid), carrying the framework's
// glaphic-card-carousel — the carousel is the component's own:
//   carousel mode — the strip runs the section's content width (flush to
//     the sidebar's left edge), every slide an equal third of the row's
//     303px depth (a slide may claim `square` — the depth as its own
//     width), each showing its image layer; the strip DRIFTS left
//     continuously (one card per interval, the component builds the
//     pattern's ghost second half so the loop wraps seamlessly) and
//     pauses while the pointer or keyboard holds it; the giant label
//     print REVEALS while a slide is held — hover/keyboard-focus types
//     it in, release wipes it — in blend difference (the block cursor
//     is the vanish kind; it drops when the print finishes).
//   card mode — click a slide and it composes into ONE content card:
//     that slide holds the left panel (its image + its print, now
//     permanent), the next slide arrives on the ink-brand-dark
//     (crimson) description plate under the bracket frame — the
//     arrival's a blend FLICKER (difference → exclusion → color-dodge,
//     no wipes) — the next into the fluro (teal) actions plate, the
//     button recipes stacked with air between them. The card's
//     controls sit UNDERNEATH (the 01/03 readout left, prev/next +
//     the close × right, under a separating rule; the arrow keys
//     step). Back out there or with a click outside the strip.
// The reveal: the strip RIDES UP into place (from +14vh, no fade) once
// the section first enters — the same "rides into place" move the
// marquee bands play on reveal, mirrored for this section's block.
//
// The glaphic elements (card carousel, slides, buttons) are defined by
// the eager '@glaphic/ui' import in GlaphicGallery, which app.tsx
// imports statically.
//
// COPY NOTE: the Rite slide's copy is the live site's own; slides two
// and three are DRAFT placeholders awaiting Eliot's real copy.
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { GrowHead } from './GrowHead';

const INK = '#0D0221';

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

export function LandingNow() {
  const flowRef = useRef<HTMLDivElement | null>(null);
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
      id="now"
      ref={hostRef}
      class={`landing-now ${inView ? 'ln-in' : ''}`}
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

        /* the shared flow grid + head slot print from landing.css's
           shared layer (this block keeps only this section's privates) */

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
          /* the shared flow/head variants print from landing.css */
          .ln-strip { margin-inline: -6vw 0; margin-top: 8vh; }
        }
      `}</style>

      <div class="ln-flow" ref={flowRef}>
        <GrowHead text="What I'm up to." inView={inView} class="ln-head" />

        <glaphic-card-carousel
          class="ln-strip"
          label="What I'm up to"
          style={{ '--glaphic-card-carousel-height': '303px' }}
        >
          {/* slide one — Rite (the live site's own copy + image) */}
          <glaphic-card-slide label="Rite">
            <img src="./assets/rite/rite-hero.png" alt="Rite, the writing environment" />
            <p slot="description">
              Right now, I'm writing a novel. While writing it, I grew frustrated with
              Google Docs — so I decided to build my own word processor, Rite: a first
              of its kind integrated writing environment. Still in development, but
              coming along well.
            </p>
            <div slot="actions">
              <glaphic-button
                variant="solid"
                style={VIOLET_SOLID}
                onClick={() => navigate('/projects/1')}
              >
                View project
              </glaphic-button>
              <glaphic-button
                variant="outline"
                style={RED_OUTLINE}
                onClick={() => window.open('https://github.com/NothingFiner/rite', '_blank', 'noopener')}
              >
                GitHub
              </glaphic-button>
            </div>
          </glaphic-card-slide>

          {/* DRAFT slides two + three — placeholder copy awaiting the
              real write-ups(Eliot's images are in; the draft copy
              stands until he writes the real lines) */}
          <glaphic-card-slide label="The novel">
            <img src="./assets/novel.png" alt="The novel's manuscript" />
            <p slot="description">
              The novel itself — the writing Rite is being built for. Draft copy.
            </p>
            <div slot="actions">
              <glaphic-button
                variant="solid"
                style={VIOLET_SOLID}
                onClick={() => (window.location.href = 'mailto:e.a.finer@gmail.com')}
              >
                Ask me about it
              </glaphic-button>
              <glaphic-button variant="outline" style={RED_OUTLINE}>
                Excerpts
              </glaphic-button>
            </div>
          </glaphic-card-slide>
          <glaphic-card-slide label="glaphic">
            <img src="./assets/glaphicUI.png" alt="glaphic UI, the web-component library" />
            <p slot="description">
              glaphic — the web-component library this landing is built from,
              growing component by component. Draft copy.
            </p>
            <div slot="actions">
              <glaphic-button
                variant="solid"
                style={VIOLET_SOLID}
                onClick={() => window.open('https://github.com/NothingFiner', '_blank', 'noopener')}
              >
                See it live
              </glaphic-button>
              <glaphic-button variant="outline" style={RED_OUTLINE}>
                The library
              </glaphic-button>
            </div>
          </glaphic-card-slide>
        </glaphic-card-carousel>
      </div>
    </section>
  );
}