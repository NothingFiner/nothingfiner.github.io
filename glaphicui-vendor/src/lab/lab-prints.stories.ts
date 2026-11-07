import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

/* THE PRINTS LAB — the portfolio's shared type prints, lifted from the
   site (nothingfiner.github.io) into the system's vocabulary:

   1. THE GROW PRINT — warm-white type a hair off the paper ground whose
      ink shadow ladder builds in steps on the reveal (the landing's
      section heads ride it as `.grow-head`, statement copy as
      `.grow-text`). The tiers land at 1/2/4/7/12px; the mobile read
      caps the stack at 7px over four tiers.
   2. THE NEXT-CTA HOVER PRINT — the chamfered keyline card whose
      two-tier drop-shadow stack glides both ways. The rest pose holds
      the hover's SAME two-function filter list (the grey tier parked
      transparent) — mismatched lists drop out of pairwise
      interpolation and the tier pops instead of gliding.

   The stage reads light (the paper print): the theme toolbar rides the
   tokens' own dual blocks, which flip every var this sheet reads with
   it. NOT a graduation — NOTHING here is wired into index.ts. */

const meta: Meta = {
  title: 'Lab/Prints',
  tags: ['autodocs'],
};
export default meta;

/* the inks ride the library's tokens — the site reads the same values */
const INK = 'var(--glaphic-ink-black, #0d0221)';
const PAPER = 'var(--glaphic-neutral-paper, #f2f5eb)';
const GROUND = 'var(--glaphic-neutral-paper-elevated, #f9faf4)';
const GREY = 'var(--glaphic-neutral-grey-cool-600, #686474)';
const KEYLINE = '#9d99ab'; /* the index cards' keyline (site constant) */

/* one ladder tier: the ink at its alpha, hard-edge at its own offset */
const tier = (offset: number, alpha: number) =>
  `color-mix(in srgb, ${INK} ${Math.round(alpha * 100)}%, transparent) ${offset}px ${offset}px 0`;

const sheet = `
  .stage {
    display: grid;
    min-height: 300px;
    padding: 48px 32px;
    place-items: center;
    align-content: center;
    gap: 22px;
    background: ${GROUND};
  }
  .stage__label {
    margin: 0;
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 11px;
    letter-spacing: 0.14em;
    color: ${GREY};
  }
  .replay {
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.14em;
    color: ${INK};
    background: transparent;
    border: 1px solid ${INK};
    padding: 8px 14px;
    cursor: pointer;
  }
  .replay:hover,
  .replay:focus-visible {
    background: ${INK};
    color: ${GROUND};
  }

  /* ── the grow print ──────────────────────────────────────────────
     the head and the text share the type + the ladder; the blocks
     keep their BEM space apart (the head prints headers, the text
     prints statements that only borrow the treatment) */
  .grow-head,
  .grow-text {
    margin: 0;
    font-family: var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);
    font-weight: 700;
    font-size: clamp(34px, 4.9vw, 70px);
    line-height: 1.05;
    letter-spacing: -0.02em;
  }
  .grow-head__in,
  .grow-text__in {
    display: inline-block;
    /* the warm-white fill — a hair off the paper ground so the letters
       read as a paler print over it */
    color: ${PAPER};
    /* multiline heads ride hard breaks: pre-line preserves them */
    white-space: pre-line;
  }
  .grow-head__in.grow-head--on,
  .grow-text__in.grow-text--on {
    animation: landing-grow 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) 0.15s both;
  }
  /* the mobile's four-tier cap: the same ladder minus its 12px rung */
  .grow-cap-4 .grow-head__in.grow-head--on,
  .grow-cap-4 .grow-text__in.grow-text--on {
    animation-name: landing-grow-4;
  }
  @keyframes landing-grow {
    0% {
      /* empty on purpose: the build starts from the base (no shadow) */
    }
    8.3% {
      text-shadow: ${tier(1, 0.64)}, ${tier(1, 0.56)}, ${tier(1, 0.48)}, ${tier(1, 0.4)}, ${tier(1, 0.32)};
    }
    16.6% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(2, 0.48)}, ${tier(2, 0.4)}, ${tier(2, 0.32)};
    }
    24.9% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(3, 0.48)}, ${tier(3, 0.4)}, ${tier(3, 0.32)};
    }
    33.2% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(4, 0.4)}, ${tier(4, 0.32)};
    }
    41.5% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(5, 0.4)}, ${tier(5, 0.32)};
    }
    49.8% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(6, 0.4)}, ${tier(6, 0.32)};
    }
    58.1% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(7, 0.32)};
    }
    66.4% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(8, 0.32)};
    }
    74.7% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(9, 0.32)};
    }
    83% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(10, 0.32)};
    }
    91.3% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(11, 0.32)};
    }
    100% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)}, ${tier(12, 0.32)};
    }
  }
  @keyframes landing-grow-4 {
    0% {
      /* empty on purpose: the build starts from the base (no shadow) */
    }
    8.3% {
      text-shadow: ${tier(1, 0.64)}, ${tier(1, 0.56)}, ${tier(1, 0.48)}, ${tier(1, 0.4)};
    }
    16.6% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(2, 0.48)}, ${tier(2, 0.4)};
    }
    24.9% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(3, 0.48)}, ${tier(3, 0.4)};
    }
    33.2% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(4, 0.4)};
    }
    41.5% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(5, 0.4)};
    }
    49.8% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(6, 0.4)};
    }
    58.1%,
    100% {
      text-shadow: ${tier(1, 0.64)}, ${tier(2, 0.56)}, ${tier(4, 0.48)}, ${tier(7, 0.4)};
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .grow-head__in.grow-head--on,
    .grow-text__in.grow-text--on {
      /* no timed build: a 1ms run keeps the fill parking the element
         at its final state — none would strip the parked stack */
      animation-duration: 1ms;
      animation-delay: 0s;
    }
  }

  /* ── the two-tier hover print (the detail routes' next CTA) ──────
     the shadow runs on the UNCLIPPED wrapper (an element's own
     clip-path cuts a drop-shadow's output), and the rest pose carries
     the hover's SAME two-function list so the tiers pair up and
     interpolate both ways */
  .print-card__wrap {
    display: block;
    width: min(560px, 92%);
    filter: drop-shadow(0 0 0 ${INK}) drop-shadow(0 0 0 transparent);
    transition: filter 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  }
  .print-card__wrap:hover,
  .print-card__wrap:focus-within {
    filter: drop-shadow(1px 1px 0 ${INK}) drop-shadow(3px 3px 0 ${GREY});
  }
  .print-card {
    display: block;
    width: 100%;
    padding: 2px;
    background: ${KEYLINE};
    border: 0;
    font: inherit;
    cursor: pointer;
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  }
  .print-card__in {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 26px;
    background: ${PAPER};
    clip-path: polygon(18.83px 0, 100% 0, 100% calc(100% - 18.83px), calc(100% - 18.83px) 100%, 0 100%, 0 18.83px);
  }
  .print-card__label {
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: ${GREY};
  }
  .print-card__title {
    font-family: var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);
    font-size: clamp(20px, 2vw, 30px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${INK};
  }
`;

/* the build plays on mount (the --on class rides the initial markup);
   Build again re-arms it: strip the class, kick one reflow, re-add */
const replay = (event: Event) => {
  event.preventDefault();
  const stage = (event.currentTarget as HTMLElement).closest('.stage') as HTMLElement;
  const runners = stage.querySelectorAll<HTMLElement>('[data-grow-run]');
  runners.forEach((el) => el.classList.remove('grow-head--on', 'grow-text--on'));
  void stage.offsetWidth; /* the reflow makes the re-add restart the run */
  runners.forEach((el) => {
    el.classList.add(el.dataset.growBlock === 'grow-text' ? 'grow-text--on' : 'grow-head--on');
  });
};

/* ── GROW HEAD ──────────────────────────────────────────────────────
   the site's section-head read: the header prints with the five-tier
   ladder. ("Past Work." — the landing's third section's own copy.) */
export const GrowHead: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      ${sheet}
    </style>
    <div class="stage">
      <h2 class="grow-head">
        <span data-grow-run data-grow-block="grow-head" class="grow-head__in grow-head--on">Past Work.</span>
      </h2>
      <button class="replay" type="button" @click=${replay}>Build again</button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The grow head — the landing's section headers (Past Work., Tools I've used., Blog) print warm-white on the paper ground and grow their ink shadow out of the page: the five-tier ladder lands at 1/2/4/7/12px in one 0.45s stepped run, parked by the both fill. Reduced motion keeps the full stack at rest (a 1ms run, never an animation strip).",
      },
    },
  },
};

/* ── GROW TEXT ──────────────────────────────────────────────────────
   the copy read: statement text that only borrows the grow treatment.
   The site's real statement (the about section's band 2). */
export const GrowText: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      ${sheet}
    </style>
    <div class="stage stage--top">
      <h2 class="grow-text">
        <span data-grow-run data-grow-block="grow-text" class="grow-text__in grow-text--on">I've come a long way
since cloning asteroids
on my middle school
graphing calculator.</span>
      </h2>
      <button class="replay" type="button" @click=${replay}>Build again</button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The grow text — statement copy that only borrows the grow treatment (the head's mobile bump + field read is not its read). Hard breaks ride the pre-line read; the ladder runs identical to the head's.",
      },
    },
  },
};

/* ── THE MOBILE CAP ─────────────────────────────────────────────────
   the ≤899px read: the same ladder minus its 12px rung, parking at 7px */
export const GrowTextMobileCap: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      ${sheet}
    </style>
    <div class="stage grow-cap-4">
      <h2 class="grow-text">
        <span data-grow-run data-grow-block="grow-text" class="grow-text__in grow-text--on">I've come a long way
since cloning asteroids
on my middle school
graphing calculator.</span>
      </h2>
      <p class="stage__label">THE MOBILE READ — THE STACK PARKS AT 7PX OVER FOUR TIERS</p>
      <button class="replay" type="button" @click=${replay}>Build again</button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The mobile cap — on ≤899px the site swaps the head's animation-name to the four-tier ladder (the stack parks at 7px instead of 12), so the print never outgrows the phone's read.",
      },
    },
  },
};

/* ── THE NEXT-CTA HOVER PRINT ───────────────────────────────────────
   the detail routes' end-of-stream card: the hover builds a two-tier
   drop-shadow stack (1px ink, then 3px grey) on an eased filter
   transition, and the leave glides it back */
export const NextCtaHover: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      ${sheet}
    </style>
    <div class="stage">
      <div class="print-card__wrap">
        <button class="print-card" type="button" tabindex="0">
          <span class="print-card__in">
            <span class="print-card__label">NEXT PROJECT</span>
            <span class="print-card__title">glaphicUI →</span>
          </span>
        </button>
      </div>
      <p class="stage__label">HOVER OR FOCUS THE CARD — THE TIERS GLIDE IN AND BACK</p>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The next-CTA hover print — the card's two-tier shadow stack glides both ways on the wrapper's 0.4s eased filter transition. The non-obvious rule lives in the rest pose: it carries the hover's SAME two-function list with the grey tier parked at drop-shadow(0 0 0 transparent). A one-function rest list against a two-function hover drops the pair out of CSS filter interpolation entirely — the second tier pops in mid-hover instead of gliding (measured: tier2 alpha 0 → 0.5 → 0.8 → 1 when the lists pair).",
      },
    },
  },
};
