import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-carousel.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const CAROUSEL_TINT_MAP = {
  '--glaphic-carousel-tint': 'tint',
  '--glaphic-carousel-depth': 'depth',
};

/* mini plate figure — a slide in the carousel's own visual language */
const slideFixture = (word: string, readout: string) => html`
  <div class="demo-slide-fig">
    <div class="demo-head">
      <span class="demo-label">slide</span>
      <span class="demo-readout">${readout}</span>
    </div>
    <div class="demo-slide-word" style="margin:auto 0">${word}</div>
    <span class="demo-cap">plate film — slotted light child</span>
  </div>
`;

const threeSlides = html`
  <div>${slideFixture('ALPHA', 'S 01')}</div>
  <div>${slideFixture('BRAVO', 'S 02')}</div>
  <div>${slideFixture('CHARLIE', 'S 03')}</div>
`;

const carousel = (args: Record<string, unknown>) => html`
  <glaphic-carousel
    style="max-width:420px;${tier2Vars(args as Record<string, unknown>, CAROUSEL_TINT_MAP)}"
    .index=${(args.index as number) ?? 0}
    ?loop=${Boolean(args.loop)}
    ?trim=${args.trim !== false}
  >${threeSlides}</glaphic-carousel>
`;

const meta: Meta = {
  title: 'Media/Carousel',
  component: 'glaphic-carousel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Plate-framed slide track. Prev/next buttons, dash indicators (hot when current), and a tabular readout in the control row. Advances emit the composed `change` event (`detail.index`); the stage carries keyboard (ArrowLeft/Right) and pointer drag. Slides are slotted light children flexed to full width — no gap on the track, slides carry their own padding and style from the page.',
      },
    },
  },
  argTypes: {
    index: { control: 'number', min: 0, max: 4, step: 1 },
    loop: { control: 'boolean' },
    trim: { control: 'boolean' },
    tint: { name: 'tint → --glaphic-carousel-tint', control: { type: 'color', presetColors: TIER1_COLORS } },
    depth: { name: 'depth → --glaphic-carousel-depth', control: 'range', min: 0, max: 100, step: 1 },
  },
};
export default meta;

/** DOCS SECTION — on the docs page, not in the sidebar, untested.
 *  The control row. */
export const TrimSection: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Trim',
  render: (args) => carousel(args),
  parameters: {
    docs: {
      description: {
        story: 'The control row: prev/next buttons, dash indicators (hot when current), and the tabular readout — the carousel\'s trim; `trim=off` strips all of it.',
      },
    },
  },
};

/** DOCS SECTION — loop wrap + keyboard/drag with trim off. */
export const LoopAndInput: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Loop & keyboard',
  args: { index: 2, loop: true, trim: true },
  render: (args) => carousel(args),
  parameters: {
    docs: {
      description: {
        story: 'Looping and input. `loop=true` wraps past the ends instead of clamping (shown at the last slide); with the trim off (Example page) the stage still answers ArrowLeft/Right and pointer drag.',
      },
    },
  },
};

/** DOCS SECTION — the slotted slide contract. */
export const Slides: StoryObj = {
  tags: ['!dev', '!test'],
  args: { index: 0, loop: false, trim: true },
  render: () => html`
    <div class="ig" style="gap:18px">
      <glaphic-carousel style="max-width:420px">
        <div>${slideFixture('SOLO', 'S 01')}</div>
      </glaphic-carousel>
      <span class="demo-cap">one slide — buttons disable, readout pins at 01 / 01</span>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The slide contract: any child you mount becomes a slide — the track flexes each to full width with no gap, so slides own their padding. A single slide disables the buttons and pins the readout.',
      },
    },
  },
};

/** combinations one-pager (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true }, controls: { disable: true } },
  render: () => html`
    <div class="ig" style="gap:18px;max-width:440px">
      ${carousel({ index: 0, loop: false, trim: true })}
      ${carousel({ index: 1, loop: false, trim: true })}
      ${carousel({ index: 0, loop: true, trim: false })}
      ${carousel({ index: 0, loop: false, trim: true, tint: '#2A2622', depth: 14 })}
    </div>
  `,
};

/** every knob live (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { index: 0, loop: false, trim: true, tint: '#17140E', depth: 8 },
  render: (args) => carousel(args),
};

/** hidden test story — guards advance, clamp, loop wrap, keyboard */
export const Interactions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: (args) => carousel(args),
  play: async ({ canvasElement, step }) => {
    const { expect, userEvent } = await import('storybook/test');
    const root = canvasElement as HTMLElement;
    const el = root.querySelector('glaphic-carousel') as any;
    await step('next advances: index 1, change {index:1}, readout 02', async () => {
      const changed = new Promise<CustomEvent>((resolve) =>
        el.addEventListener('change', (ev: Event) => resolve(ev as CustomEvent), { once: true }),
      );
      await userEvent.click(el.shadowRoot!.querySelector('.next')!);
      expect(el.index).toBe(1);
      expect((await changed).detail).toEqual({ index: 1 });
      expect(el.shadowRoot!.querySelector('.readout')!.textContent).toContain('02');
    });
    await step('clamped at bounds when loop=false', async () => {
      const next = el.shadowRoot!.querySelector('.next') as HTMLButtonElement;
      await userEvent.click(next);
      await userEvent.click(next);
      expect(el.index).toBe(2);
      expect(next.disabled).toBe(true);
      await userEvent.click(el.shadowRoot!.querySelector('.prev')!);
      expect(el.index).toBe(1);
    });
    await step('wraps when loop=true', async () => {
      el.loop = true;
      el.index = el.count - 1;
      await userEvent.click(el.shadowRoot!.querySelector('.next')!);
      expect(el.index).toBe(0);
    });
    await step('ArrowRight on the stage advances', async () => {
      await el.shadowRoot!.querySelector('.stage')!.focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(el.index).toBe(1);
    });
    await step('slides stay slotted light children', async () => {
      expect(el.querySelectorAll(':scope > div').length).toBe(3);
    });
  },
};