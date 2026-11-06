import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-cast.js';

const meta: Meta = {
  title: 'Foundations/Typography/Cast',
  component: 'glaphic-cast',
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['multiply', 'flat'] },
    scale: { control: 'number' },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:760px">${el}</div>`;

/* the demo paper plate — the host paints nothing itself (the blend
   layers multiply whatever sits beneath), so the rows sit it on
   paper for the review read */
const plate = (el: TemplateResult) => html`
  <div style="padding:56px 40px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">${el}</div>`;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;

/* DOCS SECTION — hidden in the sidebar, untested prose. Draft copy. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${caption('MULTIPLY — ink weighted by multiply (layers pool where they overlap) — the default')}
    ${plate(html`<glaphic-cast mode="multiply"></glaphic-cast>`)}
    ${caption('FLAT — each layer a flat token ink (ink-black → cool-400), no blending')}
    ${plate(html`<glaphic-cast mode="flat"></glaphic-cast>`)}
    ${caption('The pointer is the light — the shadow falls away from it and stretches with distance. Idle light parks top-left.')}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The CAST treatment (Eliot: "the thing called force right now should be called cast"): a stepped-shadow headline whose light source is the pointer. The core glyphs are ink and behind them the same glyphs repeat five times as hard-edged shadow layers at the design ladder (1,1)(2,2)(4,4)(7,7)(12,12) — no blur, no alpha. Two paintings: multiply (the default — each layer is ink weighted via mix-blend-mode: multiply, so overlapping layers pool darker like the stacked-alpha ladder read) and a flat ramp (each layer a flat token ink, ink-black near to cool-400 far). The shadow falls away from the pointer and stretches with distance — a light overhead collapses the ladder to near zero, a light far off extends the full run. Idle light parks at the top-left corner; prefers-reduced-motion freezes the idle pose. Tier-2: --glaphic-cast-ink (the core ink; the flat ramp stays token-anchored) and -size. The host paints nothing — the multiply layers blend with whatever sits beneath, so seat it on the surface you want it to read against. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the ladder anatomy, both paintings, the
   idle pose and the pointer response */
export const CastInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="padding:24px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">
      <glaphic-cast id="cast-multiply" mode="multiply"></glaphic-cast>
      <glaphic-cast id="cast-flat" mode="flat"></glaphic-cast>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* poll for the animated pose to settle — the ladder lerps
       exponentially per frame (wall-clock derived, never accumulated) */
    const settle = async (probe: () => boolean, tries = 60) => {
      for (let i = 0; i < tries; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(r));
        if (probe()) return true;
      }
      return false;
    };
    const shades = (id: string) =>
      [...(canvasElement.querySelector(id) as HTMLElement).querySelectorAll<HTMLElement>('.shade')];
    await step('anatomy: five hard-edged shadow layers behind the core', async () => {
      expect(shades('#cast-multiply').length).toBe(5);
      const core = (canvasElement.querySelector('#cast-multiply') as HTMLElement).querySelector('.core')!;
      expect(core.textContent).toBe('WHOGGING');
      for (const shade of shades('#cast-multiply')) expect(shade.getAttribute('aria-hidden')).toBe('true');
    });
    await step('multiply: every shade multiplies the page (light DOM by rule)', async () => {
      for (const shade of shades('#cast-multiply')) expect(getComputedStyle(shade).mixBlendMode).toBe('multiply');
    });
    await step('flat: no blending, the ramp inks token-anchored', async () => {
      for (const shade of shades('#cast-flat')) expect(getComputedStyle(shade).mixBlendMode).toBe('normal');
      expect(getComputedStyle(shades('#cast-flat')[0]).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(shades('#cast-flat')[4]).color).toBe('rgb(157, 153, 171)');
    });
    await step('idle pose: the top-left light pushes the ladder down-right', async () => {
      /* idle = light parked at the host's top-left corner, so every
         shadow translate points down-right (positive both axes) */
      const outer = shades('#cast-multiply')[4];
      await settle(() => parseFloat(getComputedStyle(outer).transform.split(',')[4] ?? 'NaN' ) > 2);
      const parts = getComputedStyle(outer).transform.split(',').map(parseFloat);
      expect(parts[4]).toBeGreaterThan(2); // translateX
      expect(parts[5]).toBeGreaterThan(2); // translateY
    });
    await step('the pointer is the light: a move toward the top-left stretches the ladder away', async () => {
      /* CDP hover can aim only at an element's center — a centered
         light returns the dead pose (target 0,0). The directional
         pose needs a point inside the host's padding, so this step
         dispatches a real PointerEvent at a fixed spot: the cast
         listener chain is entirely our own code, no browser default
         action rides pointermove (the keyboard paths in this suite
         are the CDP-backed ones). */
      const host = canvasElement.querySelector('#cast-flat') as HTMLElement;
      const box = host.getBoundingClientRect();
      host.dispatchEvent(new PointerEvent('pointermove', {
        clientX: box.left + 10, clientY: box.top + 10, bubbles: true,
      }));
      const outer = shades('#cast-flat')[4];
      await settle(() => {
        const parts = getComputedStyle(outer).transform.split(',').map(parseFloat);
        // scale 1 → the outer layer reaches toward the 12px design base
        return parts[4] > 2 && parts[5] > 2;
      });
      const parts = getComputedStyle(outer).transform.split(',').map(parseFloat);
      expect(parts[4]).toBeGreaterThan(2);
      expect(parts[5]).toBeGreaterThan(2);
      /* the pointer inside the run's own near-left light: the ladder
         stretches with distance — the outermost layer leads */
      const inner = getComputedStyle(shades('#cast-flat')[0]).transform.split(',').map(parseFloat);
      expect(parts[4]).toBeGreaterThan(inner[4]);
    });
    await step('core stays ink while the shades lead: the core never transforms', async () => {
      const core = (canvasElement.querySelector('#cast-flat') as HTMLElement).querySelector('.core') as HTMLElement;
      expect(getComputedStyle(core).transform).toBe('none');
    });
  },
};