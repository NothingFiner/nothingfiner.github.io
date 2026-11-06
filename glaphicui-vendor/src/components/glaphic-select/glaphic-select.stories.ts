import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-select.js';

const meta: Meta = {
  title: 'Controls/Select',
  component: 'glaphic-select',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['bubble', 'line'] },
  },
};
export default meta;

const row = (spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:18px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${spec}</span></div>
    ${el}
  </div>
`;

const BINGUS = html`<option value="bongus">bongus</option>
  <option value="chingus">chingus</option>
  <option value="chongus">chongus</option>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row(
        'BUBBLE · field name "bingus"',
        html`<glaphic-select label="bingus">${BINGUS}</glaphic-select>`,
      )}
      ${row(
        'LINE · extrapolated from the text field',
        html`<glaphic-select label="bingus" variant="line">${BINGUS}</glaphic-select>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A select is a floating-label combobox: only the bubble variant is designed — the trigger field wears the text-field bubble anatomy at 171 wide, in the paper-elevated fill (#f9faf4) under a 0.5px cool-400 stroke — so the line variant here is extrapolated from the bubble→line differences on the text field (no fill, a bottom line only, the thin row) and flagged as derived. The label is ALWAYS there: it starts in-field, and on open it floats above the stroke and scales to 0.75, with the violet plate landing behind it once the motion settles — and once the select holds a value the label is always floated, in the text-field position. The icon is a 1px-stroked chevron sitting beside the value text at the field\'s right edge: it points down at rest and swings 180° up while the panel is open, turning violet (the state frame draws a hollow diamond instead — the chevron swing is the call; flagged). The options are the component\'s children: drop plain <option> rows inside and the panel becomes a hand-built listbox on the listbox ARIA pattern — Enter, Space, ArrowDown or ArrowUp opens, the arrows and Home and End walk it, Enter or Space picks, Escape closes, and a click outside closes it too. Picking fires change with the value. Draft copy.',
      },
    },
  },
};

export const DropdownOpen: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px;padding-top:20px;min-height:280px">
      ${row(
        'OPEN · label floated + violet panel drop flush',
        html`<glaphic-select label="bingus" open>${BINGUS}</glaphic-select>`,
      )}
      ${row(
        'PICKED · value "bongus"',
        html`<glaphic-select label="bingus" value="bongus">${BINGUS}</glaphic-select>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Open, the field holds its paper-elevated fill under a violet 1px stroke, the chevron swings up and turns violet, the label floats up onto the violet plate in the paper-deep ink (#e9ede0), and the options panel drops flush under the field — a violet plate (#8447ff), three 53px rows inset 1px each side in the paper-deep ink, as wide as the field. The row under the keyboard (or the pointer) sits in the same paper-deep with the info-text ink (#5a1fcc). Once the select holds a value the label is ALWAYS floated — same position as the text field\'s — on the cool-600 plate in the paper-deep ink, and the stroke stays unchanged (the state frame draws no grey step). Draft copy.',
      },
    },
  },
};

export const FormProps: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row(
        'DISABLED · BUBBLE',
        html`<glaphic-select label="bingus" disabled>${BINGUS}</glaphic-select>`,
      )}
      ${row(
        'DISABLED · LINE',
        html`<glaphic-select label="bingus" variant="line" disabled>${BINGUS}</glaphic-select>`,
      )}
      ${row(
        'REQUIRED · BUBBLE',
        html`<glaphic-select label="bingus" required>${BINGUS}</glaphic-select>`,
      )}
      ${row(
        'REQUIRED · LINE',
        html`<glaphic-select label="bingus" variant="line" required>${BINGUS}</glaphic-select>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled, the trigger holds: the paper-elevated fill unchanged under a cool-200 stroke drawn at the select\'s 0.5px width (the frame draws the disabled band at half the text field\'s 1px — flagged), the caret dropped to cool-300 and every ink to cool-400; the line draws the dotted cool-400 1px small line. Nothing opens and nothing navigates. A disabled select that holds a value keeps the label floated, its plate gone cool-200 (derived from the text field\'s disabled-with-value state). Required changes NO paint — until it engages or holds a value, a required select reads exactly like every other; a * rides the label (floating up with it) and the trigger carries aria-required under it. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the combobox end to end: the default
   paints, the open violet set + the diamond caret's recolor + the
   label float, the listbox keyboard walk, picking (keyboard + click +
   escape + outside-close), the picked with-value chip, required,
   both disabled states, and the extrapolated line */
export const SelectInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-select id="sel" label="bingus">${BINGUS}</glaphic-select>
    <glaphic-select id="sel-line" label="bingus" variant="line">${BINGUS}</glaphic-select>
    <glaphic-select id="sel-line-dis" label="bingus" variant="line" disabled>${BINGUS}</glaphic-select>
    <glaphic-select id="sel-req" label="bingus" required>${BINGUS}</glaphic-select>
    <glaphic-select id="sel-dis" label="bingus" disabled>${BINGUS}</glaphic-select>
    <glaphic-select id="sel-dis-f" label="bingus" disabled value="bongus">${BINGUS}</glaphic-select>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* the listbox's keyboard flow must drive REAL keystrokes —
       vitest's CDP-backed browser userEvent (the slider's lesson) */
    const { userEvent: realKeys } = await import('vitest/browser');
    const settlePaint = async (read: () => string, expected: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        let elapsed = 0;
        const tick = () => {
          const seen = read();
          if (seen === expected) return resolve();
          elapsed += 25;
          if (elapsed > 2000) return reject(new Error(`expected ${expected}, saw ${seen}`));
          setTimeout(tick, 25);
        };
        tick();
      });
    };
    const parts = (id: string) => {
      const host = canvasElement.querySelector(id) as HTMLElement & { value: string };
      const field = host.shadowRoot!.querySelector('.field') as HTMLElement;
      const panel = host.shadowRoot!.querySelector('.panel')!;
      const label = host.shadowRoot!.querySelector('.label') as HTMLElement;
      const caret = host.shadowRoot!.querySelector('.caret') as HTMLElement;
      return { host, field, panel, label, caret };
    };
    await step('defaults: paper-elevated fill, cool-400 0.5px, caret cool-700, label in-field', async () => {
      const { host, field, label, caret } = parts('#sel');
      expect(host.value).toBe('');
      expect(field.querySelector('.placeholder')).toBe(null);
      expect(field.querySelector('.value')).toBe(null);
      expect(getComputedStyle(field).backgroundColor).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(field).borderColor).toBe('rgb(157, 153, 171)');
      /* 0.5px: Chromium rounds fractional border widths in computed
         style — read the width through its var instead */
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-select-stroke-width').trim(),
      ).toBe('0.5px');
      expect(getComputedStyle(field).height).toBe('54px');
      expect(getComputedStyle(caret).color).toBe('rgb(80, 76, 90)');
      expect(field.getAttribute('aria-expanded')).toBe('false');
      expect(label.textContent).toBe('bingus');
      expect(getComputedStyle(label).color).toBe('rgb(104, 100, 116)');
    });
    await step('open: violet panel, the diamond caret recolors, the label floats onto it', async () => {
      const { host, field, panel, label, caret } = parts('#sel');
      (field as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-expanded')).toBe('true');
      expect(host.hasAttribute('open')).toBe(true);
      expect(panel.classList.contains('open')).toBe(true);
      /* the panel drops on the violet plate */
      await settlePaint(() => getComputedStyle(panel).backgroundColor, 'rgb(132, 71, 255)');
      /* the field keeps its elevated fill under the violet 1px stroke */
      await settlePaint(() => getComputedStyle(field).backgroundColor, 'rgb(249, 250, 244)');
      await settlePaint(() => getComputedStyle(field).borderColor, 'rgb(132, 71, 255)');
      expect(getComputedStyle(field).borderWidth).toBe('1px');
      /* the caret swings 180° open and turns violet (the frame draws
         a static diamond — the swing is the call, flagged) */
      await settlePaint(() => getComputedStyle(caret).color, 'rgb(132, 71, 255)');
      await settlePaint(
        () => getComputedStyle(caret).transform,
        'matrix(-1, 0, 0, -1, 0, 0)',
      );
      /* the label floats (row 54 → -4 - 27: the chip kisses the field's
         top edge) then lands on the plate */
      await settlePaint(
        () => getComputedStyle(label).transform,
        'matrix(0.75, 0, 0, 0.75, 0, -31)',
      );
      await settlePaint(() => getComputedStyle(label).backgroundColor, 'rgb(132, 71, 255)');
      expect(getComputedStyle(label).color).toBe('rgb(233, 237, 224)');
      /* the rows: three options on the design's 53px pitch (the
         options are light-DOM children — read them off the host);
         opening marks NO row active — the panel reads unwalked, every
         row in its plain paper-deep ink */
      const rows = canvasElement.querySelectorAll('glaphic-select#sel option');
      expect(rows.length).toBe(3);
      expect(getComputedStyle(rows[0] as HTMLElement).height).toBe('53px');
      expect((rows[0] as HTMLElement).classList.contains('active')).toBe(false);
      expect(getComputedStyle(rows[0] as HTMLElement).color).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(rows[1] as HTMLElement).color).toBe('rgb(233, 237, 224)');
    });
    await step('arrows walk the rows and mark the active one', async () => {
      const { field } = parts('#sel');
      /* the panel is open from the previous step; focus the trigger —
         the keyboard lives on the field, not on the rows */
      field.focus();
      /* the first ArrowDown lands on the first row from an unwalked
         panel */
      await realKeys.keyboard('{ArrowDown}');
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-activedescendant')).toBe('option-0');
      const row = canvasElement.querySelectorAll('glaphic-select#sel option')[0] as HTMLElement;
      expect(row.classList.contains('active')).toBe(true);
      /* the active row carries the paper inverse */
      await settlePaint(() => getComputedStyle(row).backgroundColor, 'rgb(233, 237, 224)');
    });
    await step('enter picks the row and fires change', async () => {
      const { host, field } = parts('#sel');
      let seen: string | null = null;
      host.addEventListener('change', (e) => (seen = (e as CustomEvent).detail.value));
      await realKeys.keyboard('{Enter}');
      await new Promise((r) => setTimeout(r, 20));
      expect(host.value).toBe('bongus');
      expect(seen).toBe('bongus');
      expect(field.getAttribute('aria-expanded')).toBe('false');
      /* picking keeps focus on the trigger (it was open + focused) —
         blur for a clean read of the picked-with-value paint */
      (field as HTMLButtonElement).blur();
      const value = field.querySelector('.value')!;
      expect(value.textContent).toBe('bongus');
      /* the with-value stroke stays the default cool-400 (the frame
         draws no grey step); the label sits on the cool-600 chip in
         the paper-deep ink */
      await settlePaint(() => getComputedStyle(field).borderColor, 'rgb(157, 153, 171)');
      await settlePaint(
        () => getComputedStyle(parts('#sel').label).transform,
        'matrix(0.75, 0, 0, 0.75, 0, -31)',
      );
      expect(getComputedStyle(parts('#sel').label).backgroundColor).toBe('rgb(104, 100, 116)');
      expect(getComputedStyle(parts('#sel').label).color).toBe('rgb(233, 237, 224)');
    });
    await step('clicking an option selects it; escape closes', async () => {
      const { host, field, panel } = parts('#sel');
      (field as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      const rows = canvasElement.querySelectorAll('glaphic-select#sel option');
      (rows[2] as HTMLElement).click();
      await new Promise((r) => setTimeout(r, 20));
      expect(host.value).toBe('chongus');
      expect(field.getAttribute('aria-expanded')).toBe('false');
      /* reopen, then escape — the trigger's keydown handler closes */
      (field as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      field.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }),
      );
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-expanded')).toBe('false');
      expect(panel.classList.contains('open')).toBe(false);
    });
    await step('a click outside closes the panel', async () => {
      const { field, panel } = parts('#sel');
      (field as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-expanded')).toBe('true');
      document.body.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, composed: true }),
      );
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-expanded')).toBe('false');
      expect(panel.classList.contains('open')).toBe(false);
    });
    await step('required: no paint until engagement — the label sits in-field with the asterisk', async () => {
      const { field, label } = parts('#sel-req');
      expect(field.getAttribute('aria-required')).toBe('true');
      expect(label.textContent).toBe('bingus*');
      /* an empty, unfocused required field reads exactly like every
         other: the label in-field, the default ink, NO float */
      expect(getComputedStyle(label).transform).toBe('none');
      expect(getComputedStyle(label).color).toBe('rgb(104, 100, 116)');
      expect(field.getAttribute('aria-expanded')).toBe('false');
    });
    await step('disabled: cool hold, no open; with value the plate goes cool-200', async () => {
      const { host, field, caret } = parts('#sel-dis');
      expect((field as HTMLButtonElement).disabled).toBe(true);
      (field as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      expect(field.getAttribute('aria-expanded')).toBe('false');
      expect(getComputedStyle(field).backgroundColor).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(field).borderColor).toBe('rgb(213, 210, 222)');
      /* 0.5px: the frame draws the select's disabled band at half the
         text field's 1px (flagged) — Chromium rounds fractional
         widths in computed style, so the width reads through its var */
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-select-stroke-width').trim(),
      ).toBe('0.5px');
      expect(getComputedStyle(caret).color).toBe('rgb(186, 182, 199)');
      /* disabled with a value: the floated label's plate is cool-200,
         its ink cool-400, the picked value text cool-400 too */
      const withValue = parts('#sel-dis-f');
      expect(withValue.host.value).toBe('bongus');
      expect(withValue.field.querySelector('.value')!.textContent).toBe('bongus');
      expect(getComputedStyle(withValue.label).backgroundColor).toBe('rgb(213, 210, 222)');
      expect(getComputedStyle(withValue.label).color).toBe('rgb(157, 153, 171)');
      expect(
        getComputedStyle(withValue.field.querySelector('.value')!).color,
      ).toBe('rgb(157, 153, 171)');
    });
    await step('the line variant (extrapolated): thin, bottom-only 0.5px, dotted disabled', async () => {
      const { host, field } = parts('#sel-line');
      expect(getComputedStyle(field).height).toBe('30.5px');
      expect(getComputedStyle(field).borderRadius).toBe('0px');
      /* the line paints bottom-line ONLY and rides 0.5px at rest — the
         width reads through its var (Chromium rounds fractional
         widths in computed style) */
      expect(getComputedStyle(field).borderLeftWidth).toBe('0px');
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-select-stroke-width').trim(),
      ).toBe('0.5px');
      /* the fill is seated through the surface var (computed returns
         the rgba-ified transparent — no literal rgba in the asserts) */
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-select-surface').trim(),
      ).toBe('transparent');
      expect(getComputedStyle(field).borderStyle).toBe('solid');
      /* the disabled line draws the dotted small line */
      const lineDisabled = parts('#sel-line-dis');
      expect(
        (lineDisabled.field as HTMLButtonElement).disabled,
      ).toBe(true);
      expect(
        getComputedStyle(lineDisabled.field).borderStyle,
      ).toBe('dotted');
      /* cool-400 dotted — the text field's disabled-line ink */
      expect(
        getComputedStyle(lineDisabled.field).borderColor,
      ).toBe('rgb(157, 153, 171)');
    });
  },
};