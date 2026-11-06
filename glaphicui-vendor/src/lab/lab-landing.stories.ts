import { css, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../components/glaphic-tape/glaphic-tape.js';
import '../components/glaphic-chip/glaphic-chip.js';
import '../components/glaphic-button/glaphic-button.js';
import '../components/glaphic-card/glaphic-card.js';
import '../components/glaphic-band/glaphic-band.js';
import '../components/glaphic-text/glaphic-text.js';
import '../components/glaphic-accordion/glaphic-accordion.js';
import '../components/glaphic-accordion/glaphic-accordion-item.js';
import '../components/glaphic-crumbs/glaphic-crumbs.js';
import '../components/glaphic-crumbs/glaphic-crumb.js';

/* THE LANDING PAGE LAB — three recompositions of Eliot's own
   portfolio (nothingfiner.github.io) in the glaphic system: the
   content is the site's, the surface is the look's. Options, not a
   graduation — NOTHING here is wired into index.ts. Sidebar-visible
   so the compositions can be played live. */

const meta: Meta = {
  title: 'Lab/Landing',
  tags: ['autodocs'], // so the per-story descriptions render (Draft copy. for review)
};
export default meta;

const socials = (place = '') => html`
  <div class="socials">
    <glaphic-button variant="text" color="primary">→ resume</glaphic-button>
    <glaphic-chip variant="line">linkedin ${place}</glaphic-chip>
    <glaphic-chip variant="line">github · nothingfiner</glaphic-chip>
    <glaphic-chip variant="line">e.a.finer@gmail.com</glaphic-chip>
  </div>
`;

const tech =
  'JavaScript · TypeScript · Vue.js · React · Next.js · Node.js · Ruby · Tailwind CSS · Redux · TanStack Query · Material UI · Git · PostgreSQL · Python';

const techChips = () => html`
  <div class="tech">
    ${tech.split(' · ').map(
      (name) => html`<glaphic-chip variant="line">${name}</glaphic-chip>`
    )}
  </div>
`;

const sheet = css`
  .page {
    max-width: 720px;
    margin: 0 auto;
    display: grid;
    gap: 28px;
    font-family: var(--glaphic-font-family-sans, 'Plus Jakarta Sans', sans-serif);
    color: var(--glaphic-ink-black, #0d0221);
  }
  .headline {
    margin: 0;
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 44px;
    font-weight: 500;
    line-height: 1.05;
    color: var(--glaphic-ink-brand-dark, #a6022a);
  }
  .tagline {
    margin: 0;
    font-size: 18px;
    line-height: 1.4;
    max-width: 52ch;
  }
  .subline {
    margin: 0;
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 12px;
    letter-spacing: 0.4px;
    color: var(--glaphic-neutral-grey-cool-600, #686474);
  }
  .section-label {
    margin: 0 0 10px;
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    font-size: 12px;
    letter-spacing: 1.2px;
    color: var(--glaphic-neutral-grey-cool-600, #686474);
  }
  .socials,
  .tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .rite-copy {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
  }
`;

/* ── OPTION 1 — THE SHEET ──────────────────────────────────────────
   the straight recomposition: the site's own order (nav crumbs →
   name → headline → pitch → about stack → Rite card → tech chips →
   contact), each piece wearing its nearest glaphic garment. */
export const TheSheet: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      ${sheet}
    </style>
    <div class="page">
      <glaphic-crumbs label="Elie Asenoth Gaspar-Finer — site">
        <glaphic-crumb href="#">Home</glaphic-crumb>
        <glaphic-crumb href="#">Projects</glaphic-crumb>
        <glaphic-crumb>Chat with Bot</glaphic-crumb>
      </glaphic-crumbs>
      <div>
        <h1 class="headline">Hello, I'm Elie.</h1>
        <p class="tagline">
          I'm a (mostly) frontend developer with 12+ years of experience.
          Let me help you tell your story.
        </p>
      </div>
      ${socials('_efiner')}
      <glaphic-accordion>
        <glaphic-accordion-item label="The poet bit" open>
          I'm a trained poet — poetry and code both hinge upon collapsing
          complicated ideas into succinct patterns of symbols. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="The calculator bit">
          I wrote an Asteroids clone on a Casio graphing calculator. I never
          could get it past enemy rendering: it got too slow. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="The commerce bit">
          Coding professionally since 2013, AppAcademy 2017, then 8+ years in
          e-commerce and SaaS. Draft copy.
        </glaphic-accordion-item>
      </glaphic-accordion>
      <glaphic-card chamfer="tr" multiply="false">
        <glaphic-band tone="brand" size="compact" style="border-radius:1px">
          <span style="font-family:var(--glaphic-font-family-mono,'IBM Plex Mono',monospace);font-size:16px;font-weight:500">Rite — a first of its kind integrated writing environment</span>
        </glaphic-band>
        <p class="rite-copy" style="padding:14px 16px">
          While writing a novel I grew frustrated with Google Docs, so I
          started building the writing environment I wanted. Still in
          development. Draft copy.
        </p>
        <div style="padding:0 16px 16px">
          <glaphic-button variant="outline">View project</glaphic-button>
        </div>
      </glaphic-card>
      <div>
        <p class="section-label">SOME OF THE TECHNOLOGIES I'VE WORKED WITH</p>
        ${techChips()}
      </div>
      <div style="border-top:1px solid var(--glaphic-neutral-grey-cool-200,#d5d2de); padding-top:20px">
        <h2 class="headline" style="font-size:28px">Don't Be a Stranger!</h2>
        ${socials()}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Option 1 — the straight recomposition. The site\'s own order (crumb nav → "Hello, I\'m Elie" → the 12+ years pitch → about → Rite → tech list → contact) wearing its nearest glaphic garment: the nav becomes a crumbs trail, the headline rides the mono ink-brand-dark voice, the three personality paragraphs (the poet bit, the calculator bit, the commerce bit) live in the accordion, Rite is a chamfered opaque card with a brand band for its header strip, and the tech list and socials are line chips. Draft copy.',
      },
    },
  },
};

/* ── OPTION 2 — THE TICKER ─────────────────────────────────────────
   the landing as press sheet: every section opens with a tape
   ladder, the name marches (the echo treatment), and the whole tech
   list is one solid band of chips. Weirder, still legible. */
export const TheTicker: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      .ticker {
        max-width: 720px;
        margin: 0 auto;
        display: grid;
        gap: 6px;
      }
      .ticker h3,
      .ticker p {
        margin: 0;
      }
      .ticker h3 {
        font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.4px;
      }
      .ticker p {
        font-family: var(--glaphic-font-family-sans, 'Plus Jakarta Sans', sans-serif);
        font-size: 15px;
        line-height: 1.45;
        color: var(--glaphic-ink-black, #0d0221);
        max-width: 60ch;
      }
      .ticker .pitch {
        font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
        font-size: 14px;
        line-height: 1.5;
      }
    </style>
    <div class="ticker">
      <glaphic-tape pattern="pulse" size="compact"></glaphic-tape>
      <glaphic-text
        variant="echo"
        copies="5"
        step="18"
        style="font-family:var(--glaphic-font-family-mono,'IBM Plex Mono',monospace);font-size:56px;font-weight:600;margin-bottom:100px;--glaphic-text-ink:var(--glaphic-ink-brand-dark,#a6022a)">
        Hello, I'm Elie
      </glaphic-text>
      <p class="pitch">
        I'm a (mostly) frontend developer with 12+ years of experience. Let me
        help you tell your story.
      </p>
      ${socials()}
      <glaphic-tape pattern="swell" size="compact"></glaphic-tape>
      <h3>Rite — a first of its kind integrated writing environment</h3>
      <p>
        While writing a novel I grew frustrated with Google Docs, so I started
        building the writing environment I wanted. Still in development. Draft
        copy.
      </p>
      <glaphic-button variant="solid">View project</glaphic-button>
      <glaphic-tape pattern="pulse" size="compact"></glaphic-tape>
      <h3>SOME OF THE TECHNOLOGIES I'VE WORKED WITH</h3>
      ${techChips()}
      <glaphic-tape pattern="swell" size="compact"></glaphic-tape>
      <h3>Don't Be a Stranger!</h3>
      ${socials()}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Option 2 — the ticker. The landing as press sheet: tape ladders (pulse and swell) open every section, the name rides the echo treatment in ink-brand-dark, and the copy drops to the mono pitch voice. The tech list keeps its chips; the contact repeats the socials. Draft copy.',
      },
    },
  },
};

/* ── OPTION 3 — ONE SHEET ──────────────────────────────────────────
   the whole landing collapsed into the single-open accordion: one
   section open at a time, so reading the portfolio is an editorial
   act. Above the stack, the convergence plates fly the hero
   together. Weirdest. */
export const OneSheet: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <style>
      .one {
        max-width: 720px;
        margin: 0 auto;
        display: grid;
        gap: 16px;
      }
      .one .hero {
        position: relative;
        padding: 26px 16px 16px;
        overflow: hidden;
      }
      .one .hero glaphic-convergence {
        position: absolute;
        inset: 0;
      }
      .one .hero h2 {
        position: relative;
        margin: 0;
        font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
        font-size: 40px;
        font-weight: 600;
        color: var(--glaphic-ink-brand-dark, #a6022a);
      }
    </style>
    <div class="one">
      <div class="hero">
        <glaphic-convergence hold style="--glaphic-convergence-progress:0.5;width:100%">
          <p style="margin:0;text-align:center;font-family:var(--glaphic-font-family-mono,'IBM Plex Mono',monospace);font-size:12px;letter-spacing:0.4px">
            linkedin · github · nothingfiner · e.a.finer@gmail.com
          </p>
        </glaphic-convergence>
        <h2>Hello, I'm Elie</h2>
        <glaphic-tape pattern="pulse" size="compact" style="position:relative;margin-top:14px"></glaphic-tape>
      </div>
      <glaphic-accordion>
        <glaphic-accordion-item label="the pitch" open>
          I'm a (mostly) frontend developer with 12+ years of experience. Let
          me help you tell your story. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="the poet bit">
          Trained poet — poetry and code both hinge upon collapsing complicated
          ideas into succinct patterns of symbols. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="the calculator bit">
          An Asteroids clone on a Casio graphing calculator; it got too slow
          past enemy rendering. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="the résumé bit">
          Coding professionally since 2013, AppAcademy 2017, 8+ years in
          e-commerce and SaaS. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="Rite *">
          A first of its kind integrated writing environment, built out of
          novel-writing frustration. Still in development. Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="technologies *">
          ${tech} Draft copy.
        </glaphic-accordion-item>
        <glaphic-accordion-item label="don't be a stranger!">
          linkedin · github · nothingfiner · e.a.finer@gmail.com Draft copy.
        </glaphic-accordion-item>
      </glaphic-accordion>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Option 3 — one sheet. The whole landing collapsed into the single-open accordion: the portfolio reads one section at a time under the single-open grip, the convergence plates hold the hero behind the name, and Rite and the tech list become items ("*" marks Rite\'s view-project tie). Weirdest option: the site becomes an act of opening, not scrolling. Draft copy.',
      },
    },
  },
};