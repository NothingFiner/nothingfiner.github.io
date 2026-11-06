import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-ink-stroke.js';

/* NOTE — the typography treatments Eliot listed and their build
   state: CAST, TEXT COLLAPSE, FAN, CURSOR TYPE and CLEAR INK FOR
   STROKE (this file) all ship as their own elements under
   Foundations/Typography. TWO TREATMENTS ARE STILL OUTSTANDING —
   'clear ink and fade' and 'echo' (pull from Figma, rate-limited at
   build time). They get real sections when the Figma window opens —
   NOT dead placeholder rows. If they read as the same element with
   different paint they may land as variants on this element (its
   name is pending Eliot's review anyway). */

const meta: Meta = {
  title: 'Foundations/Typography/Clear Ink for Stroke',
  component: 'glaphic-ink-stroke',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:760px">${el}</div>`;

const plate = (el: TemplateResult) => html`
  <div style="padding:56px 40px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">${el}</div>`;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;

/* DOCS SECTION — hidden in the sidebar, untested prose. Draft copy. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${caption('SOLID REFERENCE — the fluro pass, filled')}
    ${plate(html`<glaphic-ink-stroke text="CLEAR INK"
      style="--glaphic-ink-stroke-ink: var(--glaphic-ink-brand-fluro, #14f1c8)"></glaphic-ink-stroke>`)}
    ${caption('STROKE — the clear-fill pass: the ink rides only the glyph outline (grey-cool-400)')}
    ${plate(html`<glaphic-ink-stroke text="CLEAR INK"></glaphic-ink-stroke>`)}
    ${caption('TUNED — the stroke ink and width ride the Tier-2 vars')}
    ${plate(html`<glaphic-ink-stroke text="TUNED INK"
      style="--glaphic-ink-stroke-ink: var(--glaphic-neutral-grey-cool-500, #817d8f); --glaphic-ink-stroke-width: 2.5px"></glaphic-ink-stroke>`)}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The CLEAR INK FOR STROKE treatment — element name pending Eliot\'s review — decoded from Eliot\'s SVG: the same word painted twice in place, one solid pass (the fluro ink) and one clear-fill pass whose ink rides only the glyph outline (the stroke, grey-cool-400). This element is the clear-fill pass alone: the glyphs\' fill is transparent (-webkit-text-fill-color) and the ink paints only the contour, via -webkit-text-stroke with no alpha paint and no masks — the stroke is the outline ink, the fill lets the surface behind show through. The reference row above holds the solid fluro pass beside it; the two read together exactly like Eliot\'s reference (the solid pass sits on the same word the outline carries). Tier-2: --glaphic-ink-stroke-ink · -width · -fill (the clear read — set it to keep it) · -size. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the stroke anatomy: the clear fill, the
   outline ink and the width (read through the owning vars where the
   renderer rounds) */
export const InkStrokeInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="padding:24px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">
      <glaphic-ink-stroke id="ink-default"></glaphic-ink-stroke>
      <glaphic-ink-stroke id="ink-tuned"
        style="--glaphic-ink-stroke-ink: #a6022a; --glaphic-ink-stroke-width: 2.5px"></glaphic-ink-stroke>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const glyph = (id: string) =>
      (canvasElement.querySelector(id) as HTMLElement).shadowRoot!.querySelector('.glyph')!;
    await step('anatomy: the word renders in the display voice', async () => {
      const g = glyph('#ink-default');
      expect(g.textContent).toBe('CLEAR INK');
      expect(getComputedStyle(g).fontFamily).toContain('Space Grotesk');
    });
    await step('the clear read: a transparent fill carries the ink on the outline only', async () => {
      const cs = getComputedStyle(glyph('#ink-default'));
      expect(cs.webkitTextFillColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(glyph('#ink-default')).getPropertyValue('--glaphic-ink-stroke-fill')).toBe('transparent');
    });
    await step('the stroke: the outline ink rides grey-cool-400 at the 1.5px default', async () => {
      const cs = getComputedStyle(glyph('#ink-default'));
      /* computed custom props read RESOLVED (the var's value, not the
         chain), and 1.5px fractional width device-rounds on read —
         so assert the resolved stroke ink and a sane width span */
      expect(cs.webkitTextStrokeColor).toBe('rgb(157, 153, 171)');
      const w = parseFloat(cs.webkitTextStrokeWidth);
      expect(w).toBeGreaterThan(1);
      expect(w).toBeLessThan(2);
    });
    await step('tier-2: the ink and width repaint the outline', async () => {
      const cs = getComputedStyle(glyph('#ink-tuned'));
      expect(cs.webkitTextStrokeColor).toBe('rgb(166, 2, 42)');
      const w = parseFloat(cs.webkitTextStrokeWidth);
      expect(w).toBeGreaterThanOrEqual(2);
      expect(w).toBeLessThanOrEqual(3);
    });
  },
};