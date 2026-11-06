import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-chip.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const CHIP_TINT_MAP = {
  '--glaphic-chip-ink': 'ink',
  '--glaphic-chip-plate': 'plate',
  '--glaphic-chip-plate-ink': 'plate-ink',
  '--glaphic-chip-rim': 'rim',
  '--glaphic-chip-well-fill': 'well-fill',
};

const meta: Meta = {
  title: 'Surfaces/Chip',
  component: 'glaphic-chip',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', table: { category: 'content' } },
    variant: { control: 'radio', options: ['line', 'solid', 'cyan', 'brand'] },
    wide: { control: 'boolean' },
    multiply: { control: 'boolean' },
    ink: { name: 'ink → --glaphic-chip-ink', control: { type: 'color', presetColors: TIER1_COLORS } },
    plate: { name: 'plate → --glaphic-chip-plate', control: { type: 'color', presetColors: TIER1_COLORS } },
    plateInk: { name: 'plate-ink → --glaphic-chip-plate-ink', control: { type: 'color', presetColors: TIER1_COLORS } },
    rim: { name: 'rim → --glaphic-chip-rim', control: { type: 'color', presetColors: TIER1_COLORS } },
    wellFill: { name: 'well-fill → --glaphic-chip-well-fill', control: { type: 'color', presetColors: TIER1_COLORS } },
  },
};
export default meta;

const row = (label: string, el: TemplateResult) => html`
  <div style="display:flex;gap:8px;align-items:center;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <span style="flex:0 0 120px;font:600 11px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">${label}</span>
    ${el}
  </div>
`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Kinds: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Kinds',
  render: () => html`
    <div style="max-width:560px">
      ${row('LINE', html`<glaphic-chip>spec 001</glaphic-chip>`)}
      ${row('SOLID', html`<glaphic-chip variant="solid">armed</glaphic-chip>`)}
      ${row('CYAN', html`<glaphic-chip variant="cyan">cyan plate</glaphic-chip>`)}
      ${row('BRAND', html`<glaphic-chip variant="brand">brand plate</glaphic-chip>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Four paint recipes at the 25px fixed height, the 1.5px radius, the mono caps. `line` — page-ground fill behind a 1px ink-black rim, ink-black label. `solid` — the ink-black plate with the paper-elevated label. `cyan` — the ink-cyan plate, ink-black rim and label. `brand` — the ink-brand-dark plate, the paper-deep label. The cyan and brand plates run the multiply blend; line and solid stay literal. Chips run a flex row; spacing is the consumer\'s gap. Draft copy.',
      },
    },
  },
};

export const Wide: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Wide',
  render: () => html`
    <div style="max-width:560px">
      ${row('WIDE · LINE', html`<glaphic-chip wide>wide line</glaphic-chip>`)}
      ${row('WIDE · SOLID', html`<glaphic-chip variant="solid" wide>wide solid</glaphic-chip>`)}
      ${row('WIDE · CYAN', html`<glaphic-chip variant="cyan" wide>wide cyan</glaphic-chip>`)}
      ${row('WIDE · BRAND', html`<glaphic-chip variant="brand" wide>wide brand</glaphic-chip>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The wide body adds the trailing icon well: the label keeps its 11px inline padding, then a 1px divider rides the chip\'s full height and opens the 26px channel. The channel\'s 18×18 square is the `slot="icon"` area — real content replaces the aria-hidden placeholder fill the state seats in it. FLAGGED off the decode: the placeholder fills (#d9d9d9 on line/brand/cyan, #ffe7eb on the wide solid) are Figma placeholder reads, the #d9d9d9 is not a token, and the wide line chip strokes AND inks at grey-cool-900 where the small line chips run ink-black — carried as decoded, for Eliot to normalize at the frame check. Draft copy.',
      },
    },
  },
};

/** combinations one-pager (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true }, controls: { disable: true } },
  render: () => html`
    <div style="display:flex;gap:8px;max-width:460px;flex-wrap:wrap">
      <glaphic-chip>spec 001</glaphic-chip>
      <glaphic-chip>pitch 18px</glaphic-chip>
      <glaphic-chip variant="solid">armed</glaphic-chip>
      <glaphic-chip variant="cyan" wide>fluro pass</glaphic-chip>
      <glaphic-chip variant="brand" wide>plate 8%</glaphic-chip>
    </div>
  `,
};

/** full audition (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { text: 'signal lost', variant: 'line', wide: false, multiply: true, ink: '#0d0221', plate: '#0d0221', plateInk: '#f9faf4', rim: '#0d0221', wellFill: '#d9d9d9' },
  render: (args) => html`
    <glaphic-chip
      style="${tier2Vars(args as Record<string, unknown>, CHIP_TINT_MAP)}"
      variant=${args.variant as string}
      ?wide=${args.wide as boolean}
      ?multiply=${args.multiply as boolean}
    >${args.text}</glaphic-chip>
  `,
};

/* hidden test story — guards the variant paints (fill / ink / rim
   per recipe), the multiply toggle, the wide well geometry (divider,
   channel, placeholder square) and the slotted icon */
export const ChipInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px">
      <glaphic-chip>spec 001</glaphic-chip>
      <glaphic-chip id="chip-solid" variant="solid">armed</glaphic-chip>
      <glaphic-chip id="chip-cyan" variant="cyan">cyan</glaphic-chip>
      <glaphic-chip id="chip-brand" variant="brand">brand</glaphic-chip>
      <glaphic-chip id="chip-wide" wide>wide line</glaphic-chip>
      <glaphic-chip id="chip-wide-solid" variant="solid" wide>wide solid</glaphic-chip>
      <glaphic-chip id="chip-wide-slotted" variant="cyan" wide>wide slotted <span slot="icon" style="width:10px;height:10px;background:var(--glaphic-ink-black, #0d0221)"></span></glaphic-chip>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const parts = (sel: string) => {
      const host = canvasElement.querySelector(sel) as HTMLElement;
      const well = host.shadowRoot!.querySelector('.well') as HTMLElement | null;
      const ph = host.shadowRoot!.querySelector('.ph') as HTMLElement | null;
      return { host, well, ph };
    };
    await step('line: page-ground fill, ink-black rim + label, no blend', async () => {
      const { host } = parts('glaphic-chip');
      expect(getComputedStyle(host).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(host).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(host).height).toBe('25px');
      expect(getComputedStyle(host).borderRadius).toBe('1.5px');
      expect(getComputedStyle(host).fontSize).toBe('11px');
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
    });
    await step('solid: the ink-black plate, paper-elevated label', async () => {
      const { host } = parts('#chip-solid');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(host).color).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
    });
    await step('cyan: the ink-cyan plate, ink-black label, multiplied', async () => {
      const host = parts('#chip-cyan').host as HTMLElement & { multiply: boolean; updateComplete: Promise<boolean> };
      await host.updateComplete;
      expect(host.hasAttribute('multiply')).toBe(true);
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(137, 243, 255)');
      expect(getComputedStyle(host).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
    });
    await step('multiply toggle: off reads flat, on re-blends', async () => {
      const host = parts('#chip-cyan').host as HTMLElement & { multiply: boolean; updateComplete: Promise<boolean> };
      host.multiply = false;
      await host.updateComplete;
      expect(host.hasAttribute('multiply')).toBe(false);
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
      host.multiply = true;
      await host.updateComplete;
      expect(host.hasAttribute('multiply')).toBe(true);
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
    });
    await step('brand: the ink-brand-dark plate, paper-deep label, multiplied', async () => {
      const { host } = parts('#chip-brand');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(host).color).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
    });
    await step('wide: the well channel rides the full-height divider', async () => {
      const { host, well, ph } = parts('#chip-wide');
      const hr = host.getBoundingClientRect();
      const wr = well!.getBoundingClientRect();
      expect(hr.height).toBe(25);
      expect(wr.width).toBe(26);
      expect(getComputedStyle(well!).borderLeftWidth).toBe('1px');
      expect(getComputedStyle(well!).borderLeftColor).toBe('rgb(13, 2, 33)');
      /* the channel ends 1px (the host border) inside the host edge */
      expect(hr.right - wr.right).toBeCloseTo(1, 5);
      const pr = ph!.getBoundingClientRect();
      expect(pr.width).toBe(18);
      expect(pr.height).toBe(18);
      expect(getComputedStyle(ph!).backgroundColor).toBe('rgb(217, 217, 217)');
      /* the flagged wide-line decode: rim + label at cool-900 */
      expect(getComputedStyle(host).borderColor).toBe('rgb(32, 30, 40)');
      expect(getComputedStyle(host).color).toBe('rgb(32, 30, 40)');
      expect(host.getAttribute('variant')).toBe('line');
    });
    await step('wide solid: the well placeholder seats the pale square', async () => {
      const { ph } = parts('#chip-wide-solid');
      expect(getComputedStyle(ph!).backgroundColor).toBe('rgb(255, 231, 235)');
    });
    await step('slotted icon: real content replaces the placeholder', async () => {
      const { ph } = parts('#chip-wide-slotted');
      /* fallback content hides when the slot is filled */
      expect(ph!.getBoundingClientRect().width).toBe(0);
    });
  },
};