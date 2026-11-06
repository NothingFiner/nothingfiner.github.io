import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-corners.js';

const meta: Meta = {
  title: 'Surfaces/Corners',
  component: 'glaphic-corners',
  tags: ['autodocs'],
  argTypes: {
    corners: { control: 'text' },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:560px">${el}</div>`;

const wrapped = (content: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    ${content}
  </div>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${wrapped(html`
      <glaphic-corners style="padding:16px 20px">
        <glaphic-band tone="brand" size="display">who is glaphica?</glaphic-band>
      </glaphic-corners>
    `)}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The drawer\'s floating corner brackets as reusable furniture: a frameless wrapper — the host paints nothing, the default slot carries the wrapped content, and four L-brackets pin themselves just inside the corners (6px in from the edges, 1.5px ink). pointer-events none, so the brackets never eat clicks. Draft copy.',
      },
    },
  },
};

export const BracketSubset: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${wrapped(html`
      <div style="display:flex;gap:12px">
        <glaphic-corners corners="tl" style="padding:14px 16px">
          <div style="width:120px;height:44px;display:grid;place-items:center;background:var(--glaphic-neutral-paper-elevated, #f9faf4);border:1px solid var(--glaphic-ink-black, #0d0221);font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-ink-black, #0d0221)">one corner</div>
        </glaphic-corners>
        <glaphic-corners corners="tr,bl" style="padding:14px 16px">
          <div style="width:120px;height:44px;display:grid;place-items:center;background:var(--glaphic-neutral-paper-elevated, #f9faf4);border:1px solid var(--glaphic-ink-black, #0d0221);font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-ink-black, #0d0221)">two corners</div>
        </glaphic-corners>
      </div>
    `)}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The corners attribute takes a comma-separated subset of \'tl\', \'tr\', \'bl\', \'br\' — one lit corner for a highlighted read, or a diagonal pair. Draft copy.',
      },
    },
  },
};

export const Tuned: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${wrapped(html`
      <glaphic-corners
        style="padding:16px 20px; --glaphic-corners-ink: var(--glaphic-ink-brand-dark, #a6022a); --glaphic-corners-size: 18px; --glaphic-corners-inset-block: 4px; --glaphic-corners-inset-inline: 4px;">
        <div style="height:36px;display:grid;place-items:center;font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-ink-black, #0d0221)">tuned via the tier-2 knobs</div>
      </glaphic-corners>
    `)}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The Tier-2 knobs ride the element: --glaphic-corners-ink (ink-black by default — the drawer instance\'s accent is the retiring legacy token), -size (bracket arm), -thickness, and the block/inline insets. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the wrapper anatomy: bracket count/geometry,
   the subset attribute, the ink, the click-through, and slot rendering */
export const CornersInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-corners id="c-default" style="width:200px;height:80px">
      <div id="c-default-body" style="width:100%;height:100%;background:var(--glaphic-neutral-paper-elevated, #f9faf4)"></div>
    </glaphic-corners>
    <glaphic-corners id="c-subset" corners="tl,br" style="width:200px;height:80px">
      <div style="width:100%;height:100%"></div>
    </glaphic-corners>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const parts = (sel: string) => {
      const host = canvasElement.querySelector(sel) as HTMLElement;
      const brackets = new Map(
        [...host.shadowRoot!.querySelectorAll('.bk')].map((el) => [
          [...el.classList].find((c) => c.startsWith('bk-'))!,
          el as HTMLElement,
        ]),
      );
      return { host, brackets };
    };
    await step('default: four L-brackets in the ink, inset the drawer geometry', async () => {
      const { host, brackets } = parts('#c-default');
      expect(brackets.size).toBe(4);
      expect(new Set(brackets.keys())).toEqual(new Set(['bk-tl', 'bk-tr', 'bk-bl', 'bk-br']));
      expect(getComputedStyle(brackets.get('bk-tl')!).borderLeftColor).toBe('rgb(13, 2, 33)');
      /* 1.5px fractional width: Chromium device-rounds pixel reads —
         assert the var the browser resolves, not .borderWidth */
      expect(getComputedStyle(brackets.get('bk-tl')!).getPropertyValue('--glaphic-corners-thickness')).toBe('1.5px');
      const hr = host.getBoundingClientRect();
      const tl = brackets.get('bk-tl')!.getBoundingClientRect();
      expect(tl.top - hr.top).toBeCloseTo(6, 5);
      expect(tl.left - hr.left).toBeCloseTo(8, 5);
      /* 10px arm, L of two borders */
      expect(tl.width).toBeCloseTo(10, 5);
      expect(brackets.get('bk-tl')!.getBoundingClientRect().height).toBeCloseTo(10, 5);
      for (const el of brackets.values()) {
        expect(getComputedStyle(el).pointerEvents).toBe('none');
        expect(el.getAttribute('aria-hidden')).toBe('true');
      }
    });
    await step('subset attribute: the named corners only', async () => {
      const { brackets } = parts('#c-subset');
      expect(new Set(brackets.keys())).toEqual(new Set(['bk-tl', 'bk-br']));
    });
    await step('slots: the wrapped content renders in the frame', async () => {
      const body = canvasElement.querySelector('#c-default-body') as HTMLElement;
      expect(body.getBoundingClientRect().width).toBeCloseTo(200, 5);
    });
  },
};