import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-tape.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const TAPE_TINT_MAP = {
  '--glaphic-tape-hot': 'hot',
  '--glaphic-tape-height': 'height',
  '--glaphic-tape-pitch': 'pitch',
};

const PATTERNS = ['ladder', 'swell', 'pulse', 'ramp', 'decay-55', 'decay-34'];

const meta: Meta = {
  title: 'Surfaces/Tape',
  component: 'glaphic-tape',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], table: { category: 'content' } },
    pattern: { control: 'select', options: PATTERNS, table: { category: 'content' } },
    hot: { name: 'hot → --glaphic-tape-hot', control: { type: 'color', presetColors: TIER1_COLORS } },
    height: { name: 'height → --glaphic-tape-height', control: 'text' },
    pitch: { name: 'pitch → --glaphic-tape-pitch', control: 'text' },
  },
};
export default meta;

const TAPE = (size: string, vars = '', pattern = '') =>
  html`<glaphic-tape size=${size} pattern=${pattern || undefined} style="width:420px;${vars}"></glaphic-tape>`;

const row = (label: string, spec: string, tape: ReturnType<typeof html>) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--rimsoft,rgba(23,20,14,.14))">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${tape}
  </div>
`;

const cap = (text: string) => html`<span class="demo-cap">${text}</span>`;

/** DOCS SECTION — the size ladder with labels. */
export const Sizes: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      ${row('S', 'pitch = 0.55× --hz', TAPE('s'))}
      ${row('M', 'pitch = 1× --hz (default)', TAPE('m'))}
      ${row('L', 'pitch = 1.8× --hz', TAPE('l'))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The hazard tape size ladder. `size` scales the stripe pitch off the Tier-1 grid pitch --hz — the height stays one voice (default 16px, retune via --glaphic-tape-height); an explicit --glaphic-tape-pitch beats the whole ladder.',
      },
    },
  },
};

/** DOCS SECTION — the ink. */
export const Colors: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      ${row('HOT', 'default — var(--hot)', TAPE('m'))}
      ${row('COLD', '→ --glaphic-tape-hot: cold', TAPE('m', tier2Vars({ hot: 'var(--cold)' }, TAPE_TINT_MAP)))}
      ${row('INK', '→ --glaphic-tape-hot: ink', TAPE('m', tier2Vars({ hot: 'var(--ink)' }, TAPE_TINT_MAP)))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'One ink knob: --glaphic-tape-hot colors the stripes over a transparent ground, so the tape reads in overprint against whatever it sits on. Defaults to Tier-1 --hot.',
      },
    },
  },
};

/** DOCS SECTION — the fibonacci patterns. */
export const Fibonacci: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      ${row('SWELL', 'solid + gap both climb — full ink from 377px', TAPE('m', '', 'swell'))}
      ${row('PULSE', '5px pulses, gaps climb — bare space from 377px', TAPE('m', '', 'pulse'))}
      ${row('RAMP', 'solids climb, gaps fixed 3px — full ink from 377px', TAPE('m', '', 'ramp'))}
      ${row('DECAY-55', 'gaps decay 55 → 1, solids climb — full ink after the run', TAPE('m', '', 'decay-55'))}
      ${row('DECAY-34', 'the decay shape starting from 34 — full ink after the run', TAPE('m', '', 'decay-34'))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Five built alternations off the fibonacci ladder. Each holds its run to 377px — a run that would pass the limit is clamped there — and the tail carries the rest of the band: full ink or bare space. Height still scales via --glaphic-tape-height; the size ladder\'s pitch only matters without a pattern. (The runs are animation-ready — a later pass can march them in.)',
      },
    },
  },
};

/** full combination grid (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;gap:18px;max-width:420px">
      <div class="ig">
        ${row('S · hot', '', TAPE('s'))}
        ${row('S · cold', '', TAPE('s', tier2Vars({ hot: 'var(--cold)' }, TAPE_TINT_MAP)))}
      </div>
      <div class="ig">
        ${row('M · hot', '', TAPE('m'))}
        ${row('M · cold', '', TAPE('m', tier2Vars({ hot: 'var(--cold)' }, TAPE_TINT_MAP)))}
      </div>
      <div class="ig">
        ${row('L · hot', '', TAPE('l'))}
        ${row('L · cold', '', TAPE('l', tier2Vars({ hot: 'var(--cold)' }, TAPE_TINT_MAP)))}
      </div>
      ${cap('sizes × the two live inks — hot over the page, cold over the page')}
    </div>
  `,
};

/** every knob live (sidebar only) — ladder vs the five fibonacci
 *  runs, ink, height, an explicit pitch. 'ladder' in the select means
 *  no pattern: the repeating ladder stands (an empty attribute). */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { size: 'm', pattern: "decay-55", hot: '#E03A0B', height: '16px', pitch: '' },
  render: (args) => html`
    <glaphic-tape
      style="width:420px;${tier2Vars(args, TAPE_TINT_MAP)}"
      size=${args.size as string}
      pattern=${args.pattern === 'ladder' ? undefined : (args.pattern as string)}
    ></glaphic-tape>
  `,
};