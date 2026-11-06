import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-button-group.js';

const meta: Meta = {
  title: 'Controls/Button Group',
  component: 'glaphic-button-group',
  tags: ['autodocs'],
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

const GROUP = (value = '', options = 'On,Off,Question?') =>
  html`<glaphic-button-group options=${options} value=${value || undefined} style="width:max-content"></glaphic-button-group>`;

const VGROUP = (value = '', options = 'On,Off,Question?') =>
  html`<glaphic-button-group options=${options} orientation="vertical" value=${value || undefined} style="width:max-content"></glaphic-button-group>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px;display:grid;gap:18px;justify-items:start">
      ${row('HORIZONTAL · no selection', "options, value empty — the spec's Default state", GROUP())}
      ${row('VERTICAL · no selection', 'orientation="vertical" — the segments stack', VGROUP())}
      ${row('SOLID · all segments solid', 'appearances="solid,solid,solid" — the fluro fills', html`
        <glaphic-button-group options="On,Off,Question?" appearances="solid,solid,solid" value="On" style="width:max-content"></glaphic-button-group>`)}
      ${row('MIXED · solid + outline', 'appearances="solid,outline,solid" — the recipes mix in one bar', html`
        <glaphic-button-group options="On,Off,Question?" appearances="solid,outline,solid" force-hover="Off" style="width:max-content"></glaphic-button-group>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A segmented bar: 1px ink-black edge, 1px dividers between the segments, mono labels — with its corners riding the base radius (2px; the knob overrides). The orientation attribute lays the segments in a row (default) or stacks them in a column — the vertical bar\'s dividers ride the stacked axis and its segments stretch to one equal width, the first and last corners kept by the same host clip in both axes. Each segment carries an appearance: the positional `appearances` attribute (mapped onto `options`, unlisted = outline) reads outline — the frame\'s transparent segment, its label and the bar edges one shared ink (the group\'s border system IS the outline\'s frame) — or solid — the fluro fill and ink-black label of the primary solid recipe. Hover and selected print the SAME pair on every appearance (#e9ede0 / #0d0221 — the Tier-1 tokens the outline buttons read), and a selected segment holds it: a selection is a hover that stays, appearance-agnostic. `value` selects a segment (empty = no selection, the spec\'s Default state) and selecting fires a bubbling `change` with `detail.value`. The segments are internally rendered rather than slotted glaphic-button components — a slotted button drags its own fill/border/radius into a bar that paints one edge — but they share the button vocabulary\'s tokens (flagged: chamfered and text buttons have no reading inside a bordered group; color recipes beyond the primary fill on solid segments would need their own call). Draft copy.',
      },
    },
  },
};

/* hidden test story — selection model + the paper-deep/ink-black pair
   + the vertical stack and the base-radius corners + the per-segment
   appearances (solid fills, mixed bars, the shared state pair) */
export const ButtonGroupInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-button-group options="On,Off,Question?" value="On"></glaphic-button-group>
    <glaphic-button-group id="group-empty" options="On,Off,Question?"></glaphic-button-group>
    <glaphic-button-group id="group-vert" options="On,Off,Question?" orientation="vertical" value="Off"></glaphic-button-group>
    <glaphic-button-group id="group-solid" options="On,Off,Question?" appearances="solid,solid,solid" value="On"></glaphic-button-group>
    <glaphic-button-group id="group-mixed" options="On,Off,Question?" appearances="solid,outline,solid"></glaphic-button-group>
  `,
  play: async ({ canvasElement, step }) => {
    const { userEvent, expect } = await import('storybook/test');
    /* the hover paint rides a REAL pointer move — vitest's CDP-backed
       browser userEvent (the keyboard lesson applies to hover too) */
    const { userEvent: realPointer } = await import('vitest/browser');
    const group = canvasElement.querySelector('glaphic-button-group') as HTMLElement;
    const buttons = group.shadowRoot!.querySelectorAll('button');
    await step('initial: On selected with the paper-deep fill + ink-black text', async () => {
      expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
      expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
      expect(getComputedStyle(buttons[0]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(buttons[0]).color).toBe('rgb(13, 2, 33)');
      /* the unselected segments stay transparent */
      expect(getComputedStyle(buttons[1]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      /* the corners ride the base radius */
      expect(getComputedStyle(group).borderRadius).toBe('2px');
    });
    await step('hover prints the same pair on an unselected segment', async () => {
      const empty = canvasElement.querySelector('#group-empty') as HTMLElement;
      const emptyButtons = empty.shadowRoot!.querySelectorAll('button');
      await realPointer.hover(emptyButtons[0]);
      await new Promise((r) => setTimeout(r, 250)); /* let the 120ms transition settle */
      expect(getComputedStyle(emptyButtons[0]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(emptyButtons[0]).color).toBe('rgb(13, 2, 33)');
      /* the selected segment holds its own pair (identical paint) */
      expect(getComputedStyle(buttons[0]).backgroundColor).toBe('rgb(233, 237, 224)');
    });
    await step('click Off: value updates and change fires with detail.value', async () => {
      let detail: unknown;
      group.addEventListener('change', (e: Event) => { detail = (e as CustomEvent).detail.value; });
      await userEvent.click(buttons[1]);
      expect((group as unknown as { value: string }).value).toBe('Off');
      expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
      expect(detail).toBe('Off');
    });
    await step('vertical: the bar stacks, dividers ride the stacked axis, corners ride the base radius', async () => {
      const vert = canvasElement.querySelector('#group-vert') as HTMLElement;
      expect(getComputedStyle(vert).flexDirection).toBe('column');
      expect(getComputedStyle(vert).borderRadius).toBe('2px');
      const vButtons = vert.shadowRoot!.querySelectorAll('button');
      /* the dividers ride the stacked axis: a 1px top edge between
         rows, none on the first, and NO side borders */
      expect(getComputedStyle(vButtons[0]).borderTopWidth).toBe('0px');
      expect(getComputedStyle(vButtons[1]).borderTopWidth).toBe('1px');
      expect(getComputedStyle(vButtons[1]).borderLeftWidth).toBe('0px');
      /* the rows stack flush: row 1's top touches row 0's bottom
         (rects — the paint level reads geometry where rects can) */
      const r0 = vButtons[0].getBoundingClientRect();
      const r1 = vButtons[1].getBoundingClientRect();
      expect(Math.abs(r1.top - r0.bottom)).toBeLessThan(0.5);
      /* the segments stretch to one equal width */
      expect(Math.abs(r1.width - r0.width)).toBeLessThan(0.5);
      /* and the held selection paints the same pair down the column */
      expect(vButtons[1].getAttribute('aria-pressed')).toBe('true');
      expect(getComputedStyle(vButtons[1]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(vButtons[1]).color).toBe('rgb(13, 2, 33)');
    });
    await step('appearances: solid fills rest, mixed bars split, the shared pair owns the states', async () => {
      const solidBar = canvasElement.querySelector('#group-solid') as HTMLElement;
      const solidButtons = solidBar.shadowRoot!.querySelectorAll('button');
      /* the selected solid segment holds the SHARED pair, not its fill */
      expect(getComputedStyle(solidButtons[0]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(solidButtons[0]).color).toBe('rgb(13, 2, 33)');
      /* unselected solid segments paint the primary solid recipe */
      expect(getComputedStyle(solidButtons[1]).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(getComputedStyle(solidButtons[2]).backgroundColor).toBe('rgb(20, 241, 200)');
      /* the mixed bar: solid bookends, an outline centre */
      const mixedBar = canvasElement.querySelector('#group-mixed') as HTMLElement;
      const mixedButtons = mixedBar.shadowRoot!.querySelectorAll('button');
      expect(getComputedStyle(mixedButtons[0]).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(mixedButtons[1].getAttribute('appearance')).toBe('outline');
      expect(getComputedStyle(mixedButtons[1]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(mixedButtons[1]).color).toBe('rgb(13, 2, 33)');
      /* hover over the outline segment pours the shared pair */
      await realPointer.hover(mixedButtons[1]);
      await new Promise((r) => setTimeout(r, 250)); /* let the 120ms transition settle */
      expect(getComputedStyle(mixedButtons[1]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(mixedButtons[1]).color).toBe('rgb(13, 2, 33)');
      /* and hover over the SOLID bookend lifts its fill to the same
         pair (LOCKED DECISION: appearance owns the rest paint, the
         group owns the states) */
      await realPointer.hover(mixedButtons[0]);
      await new Promise((r) => setTimeout(r, 250));
      expect(getComputedStyle(mixedButtons[0]).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(mixedButtons[0]).color).toBe('rgb(13, 2, 33)');
    });
  },
};