import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../glaphic-card/glaphic-card.js';
import './glaphic-text.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const TEXT_INK_MAP = {
  '--glaphic-text-ink': 'ink',
  '--glaphic-text-stroke': 'stroke',
  '--glaphic-text-shadow-ink': 'shadowInk',
};

/* the font selector's three faces — the Tier-1 font stacks */
const FONT_STACKS: Record<string, string> = {
  display: "var(--f-disp, 'Space Grotesk', 'Plus Jakarta Sans', sans-serif)",
  body: "var(--f-body, 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif)",
  mono: "var(--f-mono, 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace)",
};

const meta: Meta = {
  title: 'Foundations/Typography',
  component: 'glaphic-text',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'glass', 'infinite', 'echo'] },
    noStroke: { name: 'no-stroke', control: 'boolean', if: { arg: 'variant', eq: 'glass' } },
    axis: {
      name: 'axis → both shadows',
      control: 'select',
      options: ['x+', 'y+', 'y-', 'xy', 'x+-', 'y+-'],
      table: { category: 'content' },
      defaultValue: { summary: 'infinite xy · echo y+' },
    },
    step: {
      name: 'step → fib | px distance',
      control: 'select',
      options: ['fib', '1', '3', '5', '9', '18', '36', '64'],
      table: { category: 'content' },
    },
    copies: {
      name: 'copies → 1·3·5·9 (fib holds 9) · 18·36 on a distance',
      control: 'select',
      options: ['1', '3', '5', '9', '18', '36'],
      table: { category: 'content' },
    },
    text: { control: 'text', table: { category: 'content' } },
    size: { control: 'number', table: { category: 'content' } },
    font: { name: 'font → --glaphic-text-font', control: 'select', options: ['', 'display', 'body', 'mono'] },
    ink: { name: 'ink → --glaphic-text-ink', control: { type: 'color', presetColors: TIER1_COLORS }, table: { category: 'ink' } },
    stroke: { name: 'stroke → --glaphic-text-stroke', control: { type: 'color', presetColors: TIER1_COLORS }, table: { category: 'ink' } },
    shadowInk: { name: 'shadow ink → --glaphic-text-shadow-ink', control: { type: 'color', presetColors: TIER1_COLORS }, table: { category: 'ink' } },
  },
};
export default meta;

/* each voice's live CSS font value with fallback for tokens-less pages */
const F = {
  display: "var(--t-display, 800 clamp(40px, 5.6vw, 60px)/0.95 var(--f-disp, 'Space Grotesk', 'Plus Jakarta Sans', sans-serif))",
  heading: "var(--t-heading, 700 20px/1.3 var(--f-body, 'Plus Jakarta Sans', sans-serif))",
  body: "var(--t-body, 400 13.5px/1.45 var(--f-body, 'Plus Jakarta Sans', sans-serif))",
  label: "var(--t-label, 500 10.5px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace))",
  caption: "var(--t-caption, 500 9.5px/1.5 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace))",
  readout: "var(--t-readout, 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace))",
};

const VOICE = (name: string, spec: string, sample: ReturnType<typeof html>, font: string) => html`
  <div style="display:grid;gap:5px;padding:10px 0;border-bottom:1px solid var(--rimsoft,rgba(23,20,14,.14))">
    <div class="demo-specline"><span>${name}</span><span>${spec}</span></div>
    <span style="font:${font}">${sample}</span>
  </div>
`;

const cap = (text: string) => html`<span class="demo-cap">${text}</span>`;

/** DOCS SECTION — on the docs page, not in the sidebar, untested.
 *  The canonical type scale — the --t-* voices, resolved live. */
export const Scale: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div class="ig" style="max-width:560px">
      ${VOICE('Display', '800 · clamp 40–60px / 0.95 · f-disp', html`PLATE 8%`, F.display)}
      ${VOICE('Heading', '700 · 20px / 1.3 · f-body', html`Survey racks — bay 04`, F.heading)}
      ${VOICE('Body', '400 · 13.5px / 1.45 · f-body', html`The plate archive holds roll 118 under the press line; negatives checked out at dusk.`, F.body)}
      ${VOICE('Label', '500 · 10.5px / 1 · f-mono · .16em', html`SURVEY RACKS`, F.label)}
      ${VOICE('Caption', '500 · 9.5px / 1.5 · f-mono · .14em', html`DARKROOM · FIXER BARRELS — LOW INK`, F.caption)}
      ${VOICE('Readout', '600 · 11px / 1 · f-mono · tabular', html`88 · 01.7PX · MASK 0.93`, F.readout)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The --t-* voices from tokens.css (display · heading · body · label · caption · readout), resolved live so the theme toolbar flips them. Font shorthands only — tracking/case/color stay consumer-side.',
      },
    },
  },
};

/** DOCS SECTION — the treatments as page headings — their home. */
export const Treatments: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div class="ig" style="max-width:560px;gap:18px">
      <div class="ig" style="gap:6px">
        <span class="demo-specline"><span>GLASS</span><span>heading · stroked · no-stroke</span></span>
        <glaphic-text variant="glass" style="font-size:clamp(40px,5vw,54px);margin:6px 0">GLASS, CUT.</glaphic-text>
        <glaphic-text variant="glass" no-stroke style="font-size:44px">CLEAR INK</glaphic-text>
        ${cap('transparent glyphs held by a 1.2px stroke + a whisper of the text color (spec .knock); no-stroke drops the outline and the text color fills alone, bared — --glaphic-text-stroke colors the stroke, --glaphic-text-glass-fill retunes the whisper depth')}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The treatments as page headings — their home. Glass: transparent glyphs held by the stroke + a 16% whisper of the text color, reading as poster ink — with `no-stroke` the outline drops and the text color fills alone, bared.',
      },
    },
  },
};

/** DOCS SECTION — the shadow treatments. */
export const Shadows: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div class="ig" style="max-width:560px;gap:18px">
      <div class="ig" style="gap:6px">
        <span class="demo-specline"><span>INFINITE</span><span>fading copies · fib · xy</span></span>
        <glaphic-text variant="infinite" style="font-size:44px;margin:8px 0">GLASS, CUT.</glaphic-text>
        ${cap('copies fade at cumulative fibonacci offsets (1·2·4·7 … 88px) — ink dissolving into the ground; axis points the march (x+ · y+ · y- · xy default · x+- · y+-), step takes a fixed px distance (1·3·5·9·18·36·64) in place of the ladder, copies runs 1·3·5·9·18·36 — the ladder holds 9')}
      </div>
      <div class="ig" style="gap:6px">
        <span class="demo-specline"><span>ECHO</span><span>y+ · y- · y+- · xy — full ink</span></span>
        <glaphic-text variant="echo" axis="y+" style="font-size:30px;margin:8px 0">GLASS, CUT.</glaphic-text>
        <glaphic-text variant="echo" axis="y-" style="font-size:30px;margin:8px 0">GLASS, CUT.</glaphic-text>
        <glaphic-text variant="echo" axis="y+-" style="font-size:30px;margin:8px 0">GLASS, CUT.</glaphic-text>
        <glaphic-text variant="echo" axis="xy" style="font-size:30px;margin:8px 0">GLASS, CUT.</glaphic-text>
        ${cap('the repeat at full ink — y+ drops below, y- rises, y+- mirrors both sides, xy takes the poster diagonal; x+ and x+- march along the line; the same axis · step · copies knobs as infinite, and both shadows ride the one shadow ink (--glaphic-text-shadow-ink) apart from the glyph ink')}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The shadow treatments. `infinite` — copies at cumulative fibonacci offsets, alpha washing out: the dissolving drop shadow. `echo` — the repeat at full ink. Both take the same three knobs: `axis` (x+ · y+ · y- · xy · x+- · y+- — infinite defaults xy, echo y+), `step` (the fib ladder, or a fixed px distance 1·3·5·9·18·36·64) and `copies` (1·3·5·9·18·36, default 9 — the fib ladder holds 9). Both shadows ride the one shadow ink (--glaphic-text-shadow-ink), so they can read apart from the glyph\'s text color.',
      },
    },
  },
};

/** combinations one-pager (sidebar only) */
export const Example: StoryObj = {
  render: () => html`
    <div class="ig" style="max-width:560px;gap:18px">
      <div class="ig" style="gap:6px">
        <span class="demo-specline"><span>GLASS</span><span>stroked · no-stroke — spec .knock</span></span>
        <glaphic-text variant="glass" style="font-size:clamp(40px,5vw,54px)">GLASS, CUT.</glaphic-text>
        <glaphic-text variant="glass" no-stroke style="font-size:44px">CLEAR INK</glaphic-text>
        ${cap('transparent glyphs at whisper fill — and the bared fill the moment the stroke drops')}
      </div>
      <span class="demo-specline"><span>SHADOWS</span><span>infinite · echo (step 9 · copies 5 · cold shadows)</span></span>
      <glaphic-text variant="infinite" style="font-size:40px;margin:4px 0">COLD INK</glaphic-text>
      <glaphic-text variant="echo" step="9" copies="5" style="font-size:40px;margin:10px 0 4px;${tier2Vars({ shadowInk: 'var(--cold, #0780B8)' }, TEXT_INK_MAP)}">COLD INK</glaphic-text>
      ${cap('the shadows read apart from the glyphs — ink-on-ink here, the shadow running in cold')}
      <span class="demo-specline"><span>OVER THE CARD</span><span>flat card staging</span></span>
      <glaphic-card style="max-width:420px">
        <div class="ig" style="justify-content:center;min-height:150px">
          <span class="demo-cap">SPEC 001</span>
          <glaphic-text variant="glass" style="font-size:clamp(40px,5vw,54px)">GLASS,<br>CUT.</glaphic-text>
        </div>
      </glaphic-card>
      ${cap('glass over the flat card panel — stroke and fill read against the paper')}
    </div>
  `,
  parameters: {
    docs: {
      disable: true,
      description: {
        story: 'The glass treatment plus the glass plate case (spec fig-glass) — stroke and fill read against the film.',
      },
    },
  },
};

/** full audition (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: {
    variant: 'echo',
    noStroke: false,
    axis: 'y+-',
    step: 'fib',
    copies: '9',
    text: 'GLASS, CUT.',
    size: 54,
    font: '',
    ink: '#17140E',
    stroke: '',
    shadowInk: '#17140E',
  },
  render: (args) => html`
    <glaphic-text
      style="font-size:${args.size}px;${(args as { font?: string }).font && (args as { font?: string }).font !== ''
        ? `--glaphic-text-font: 800 ${args.size}px/1 ${FONT_STACKS[(args as { font?: string }).font as string]};`
        : ''}${tier2Vars(args as Record<string, unknown>, TEXT_INK_MAP)}"
      variant=${args.variant as string}
      ?no-stroke=${Boolean(args.noStroke)}
      axis=${args.axis as string}
      step=${args.step as string}
      copies=${args.copies as string}
    ><span>${args.text}</span></glaphic-text>
  `,
};