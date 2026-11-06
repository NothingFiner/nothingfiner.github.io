import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-collapse.js';

const meta: Meta = {
  title: 'Foundations/Typography/Text Collapse',
  component: 'glaphic-collapse',
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: 'inline-radio', options: ['click', 'hover'] },
    words: { control: 'text' },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:760px">${el}</div>`;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;

/* DOCS SECTION — hidden in the sidebar, untested prose. Draft copy. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${caption('CLICK — click to collapse, click again to spread')}
    <glaphic-collapse trigger="click" words="WORDS SLAM TOGETHER"></glaphic-collapse>
    ${caption('HOVER — enter collapses, leave spreads')}
    <glaphic-collapse trigger="hover" words="GAPS COLLAPSE ON HOVER"></glaphic-collapse>
    ${caption('TUNED — the spread rides the Tier-2 var (16px)')}
    <glaphic-collapse trigger="click" words="SPREAD RIDES THE KNOB"
      style="--glaphic-collapse-spread: 16px"></glaphic-collapse>
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The TEXT COLLAPSE treatment (Eliot: "word slam can be called text collapse"): shrinking gap spans let the words slam together. Every word rides next to a gap span holding the spread --glaphic-collapse-spread (44px by default), and the trigger closes each gap to zero with a left-to-right stagger while its word lands through a translate overshoot keyframe (arrive past home, snap back) so the impact reads as weight. Spreading re-opens the gaps in reverse order, no keyframe. Two triggers ship — a click toggle and a hover enter/leave (the hover row collapses on entry and spreads on leave). Width and transform only: no alpha, no blur. prefers-reduced-motion drops the transition and the landing keyframes. --glaphic-collapse-ink repaints the line. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the gap anatomy, both triggers, the
   stagger order and the spread var */
export const CollapseInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div id="collapse-rest" style="display:inline-block;width:120px;height:80px"></div>
    <div style="padding:24px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">
      <glaphic-collapse id="col-click" trigger="click" words="TWO WORDS"></glaphic-collapse>
      <glaphic-collapse id="col-hover" trigger="hover" words="HOVER SLAMS SHUT"></glaphic-collapse>
      <glaphic-collapse id="col-tuned" trigger="click" words="TUNED SPREAD"
        style="--glaphic-collapse-spread: 16px"></glaphic-collapse>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* the hover trigger rides a real pointer flow — CDP-backed
       pointerenter/leave are computed by the browser */
    const { userEvent: realPointer } = await import('vitest/browser');
    const gaps = (id: string) => [
      ...(canvasElement.querySelector(id) as HTMLElement).shadowRoot!.querySelectorAll<HTMLElement>('.gap'),
    ];
    /* poll for a CSS transition to land */
    const settle = async (probe: () => boolean, tries = 90) => {
      for (let i = 0; i < tries; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(r));
        if (probe()) return true;
      }
      return false;
    };
    await step('anatomy: one gap span after each word, at the spread', async () => {
      const list = gaps('#col-click');
      expect(list.length).toBe(2);
      const host = canvasElement.querySelector('#col-click') as HTMLElement;
      expect(getComputedStyle(host.shadowRoot!.querySelector('.line')!).color).toBe('rgb(13, 2, 33)');
      /* the unit carries the stagger vars (the gap reads them) */
      const units = [
        ...host.shadowRoot!.querySelectorAll<HTMLElement>('.unit'),
      ];
      expect(units[0].style.getPropertyValue('--collapse-i')).toBe('0');
      expect(units[1].style.getPropertyValue('--collapse-n')).toBe('1');
    });
    await step('click collapses every gap, the words land through the overshoot keyframe', async () => {
      const host = canvasElement.querySelector('#col-click') as HTMLElement;
      host.click();
      const settled = await settle(() => gaps('#col-click').every((g) => Math.round(g.getBoundingClientRect().width) === 0));
      expect(settled, 'the click collapse never closed every gap').toBe(true);
      const word = host.shadowRoot!.querySelector<HTMLElement>('.word')!;
      expect(getComputedStyle(word).animationName).toBe('glaphic-collapse-land');
    });
    await step('click again: the gaps re-open in reverse order', async () => {
      const host = canvasElement.querySelector('#col-click') as HTMLElement;
      host.click();
      const settled = await settle(() => gaps('#col-click').every((g) => g.getBoundingClientRect().width > 30));
      expect(settled, 'the click spread never re-opened the gaps').toBe(true);
      expect(host.hasAttribute('collapsed')).toBe(false);
    });
    await step('the spread var retunes the gap at rest', async () => {
      const tuned = gaps('#col-tuned')[0];
      expect(Math.round(tuned.getBoundingClientRect().width)).toBe(16);
    });
    await step('hover: entry collapses, leaving to a sibling spreads', async () => {
      const host = canvasElement.querySelector('#col-hover') as HTMLElement;
      const rest = canvasElement.querySelector('#collapse-rest') as HTMLElement;
      await realPointer.hover(host);
      const collapsed = await settle(() => gaps('#col-hover').every((g) => Math.round(g.getBoundingClientRect().width) === 0));
      expect(collapsed, 'the hover collapse never closed the gaps').toBe(true);
      expect(host.hasAttribute('collapsed')).toBe(true);
      await realPointer.hover(rest);
      const spread = await settle(() => gaps('#col-hover').every((g) => g.getBoundingClientRect().width > 30));
      expect(spread, 'the leave never spread the gaps back').toBe(true);
    });
  },
};