import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-film-button.js';

const meta: Meta = {
  title: 'Controls/Film Button',
  component: 'glaphic-film-button',
  tags: ['autodocs'],
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

// color-contrast is disabled on the film stories: the label rides
// soft-light over a composited overprint, so axe sees only the static
// computed color — its verdict here is meaningless in either
// direction. Contrast on the label remains a human / design-review
// item, tracked in the visual acceptance checklist.
const filmA11y = {
  a11y: {
    config: { rules: [{ id: 'color-contrast', enabled: false }] },
  },
};

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Forms: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row('BRAND', 'default — brand-fluro over brand-dark', html`<glaphic-film-button>learn more</glaphic-film-button>`)}
      ${row('INFO', 'cyan over magenta', html`<glaphic-film-button variant="info">learn more</glaphic-film-button>`)}
    </div>
  `,
  parameters: {
    ...filmA11y,
    docs: {
      description: {
        story: 'Two overprinted opaque films: one at the box, one offset down-right printing MULTIPLY, so a 4px fringe of each layer shows at opposite corners. Zero alpha — the overprint is blend modes all the way down. Draft copy.',
      },
    },
  },
};

export const States: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row('BRAND', 'hover (forced) — misregistration flips corner', html`<glaphic-film-button force-hover>learn more</glaphic-film-button>`)}
      ${row('INFO', 'hover (forced)', html`<glaphic-film-button variant="info" force-hover>learn more</glaphic-film-button>`)}
      ${row('BRAND', 'disabled — films and label grey out', html`<glaphic-film-button disabled>learn more</glaphic-film-button>`)}
    </div>
  `,
  parameters: {
    ...filmA11y,
    docs: {
      description: {
        story: 'The films swap transforms on hover — the misregistration flips corner and the films never leave multiply — while the label rides color-dodge at rest and flips to difference; the label follows the top film to its new corner, so the whole button reads as pressing down into the hovered corner (its follow distance dials via `--glaphic-film-button-label-shift`, defaulting to a 2px nudge). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the multiply physics (the legacy film
   asserted multiply→difference; the new film is multiply, always) */
export const FilmButtonInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { ...filmA11y, docs: { disable: true } },
  render: () => html`<glaphic-film-button>learn more</glaphic-film-button>`,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const btn = canvasElement.querySelector('glaphic-film-button')!;
    // film renders into light DOM (page-level blends) — queryable by design
    const f1 = btn.querySelector('.f1')! as HTMLElement;
    const f2 = btn.querySelector('.f2')! as HTMLElement;
    await step('rest: f1 at the box, f2 offset, f2 blends multiply', async () => {
      expect(getComputedStyle(f1).transform).toBe('none');
      expect(getComputedStyle(f2).transform).toContain('4');
      expect(getComputedStyle(f2).mixBlendMode).toBe('multiply');
      // opaque layers — no alpha plates survive the rebuild.
      // Fill assignment per the current paint: f1 = brand-dark at
      // the box, f2 = brand-fluro offset down-right
      expect(getComputedStyle(f2).backgroundColor).toBe('rgb(20, 241, 200)');
    });
    await step('force-hover: transforms swap, blend stays multiply', async () => {
      btn.setAttribute('force-hover', '');
      await new Promise((r) => setTimeout(r, 450)); /* let the 280ms film transition settle */
      expect(getComputedStyle(f1).transform).toContain('4');
      expect(getComputedStyle(f2).transform).toBe('none');
      expect(getComputedStyle(f2).mixBlendMode).toBe('multiply');
      expect(getComputedStyle(f1).mixBlendMode).toBe('normal');
      /* the label's blend flips on hover: color-dodge → difference …
         and the label follows the top film down to the corner */
      const lbHover = btn.querySelector('.lb')! as HTMLElement;
      expect(getComputedStyle(lbHover).mixBlendMode).toBe('difference');
      await new Promise((r) => setTimeout(r, 450)); /* the label's follow transition */
      expect(getComputedStyle(lbHover).translate).toBe('2px 2px');
      /* release the mirror so the rest state reads clean after */
      btn.removeAttribute('force-hover');
      await new Promise((r) => setTimeout(r, 450));
      expect(getComputedStyle(lbHover).translate).toBe('0px');
    });
    await step('the label rides color-dodge at rest', async () => {
      const lb = btn.querySelector('.lb')! as HTMLElement;
      expect(getComputedStyle(lb).mixBlendMode).toBe('color-dodge');
    });
  },
};