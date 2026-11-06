import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { Title, Stories } from '@storybook/addon-docs/blocks';
import React from 'react';
import './glaphic-textfield.js';

const meta: Meta = {
  title: 'Controls/Text Field',
  component: 'glaphic-textfield',
  tags: ['autodocs'],
  /* the docs page composes the Title plus every story block (its
     name, its prose, its canvas) — the built-in autodocs page doubles
     the primary story: a top canvas plus the same one under STORIES */
  parameters: {
    docs: {
      page: () =>
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Title),
          React.createElement(Stories),
        ),
    },
  },
  argTypes: {
    variant: { control: 'radio', options: ['bubble', 'line'] },
  },
};
export default meta;

/* the stacked grid: a column per variant (bubble, line), the states
   stacked in the rows — the 18px row gap is the floated label's
   clearance above each row's stroke */
interface VariantRow {
  label: string | null;
  field: (variant: 'bubble' | 'line') => TemplateResult;
}
const variantColumns = (rows: readonly VariantRow[]): TemplateResult => {
  const gutter = rows.some((r) => r.label !== null);
  return html`
    <div
      style="display:grid;grid-template-columns:${gutter ? 'max-content ' : ''}200px 200px;column-gap:36px;row-gap:18px;align-items:center"
    >
      ${gutter ? html`<span></span>` : ''}
      <div class="demo-specline"><span>BUBBLE</span></div>
      <div class="demo-specline"><span>LINE</span></div>
      ${rows.map(
        ({ label, field }) => html`
          ${label
            ? html`<div class="demo-specline"><span>${label}</span></div>`
            : ''}
          ${field('bubble')}
          ${field('line')}
        `,
      )}
    </div>
  `;
};

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:700px">
      ${variantColumns([
        {
          label: null,
          field: (variant) => html`<glaphic-textfield label="label" variant=${variant}></glaphic-textfield>`,
        },
      ])}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A text field is a native <input> wearing one of two variants — the bubble (200×54, paper fill, 0.5px cool-400 stroke) or the line (200×30.5, no fill, a 0.5px bottom line that grows to 1px on focus, the value text padding ~4px off it) — and the label is ALWAYS there: it is not a separate option. It starts in-field at the value position; click into either field and watch it float MUI-style above the stroke and scale to 0.75. On focus the label and border turn the focus color; on the bubble, once the label reaches its floated position, a violet plate (#8447ff) drops behind it and its ink turns paper-elevated. The line keeps its own quiet set: it turns the info-text ink (#5a1fcc) on focus and cool grey when it holds a value — no violet, no plate. Draft copy.',
      },
    },
  },
};

export const FormProps: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:700px">
      ${variantColumns([
        {
          label: 'DISABLED',
          field: (variant) =>
            html`<glaphic-textfield label="label" variant=${variant} disabled></glaphic-textfield>`,
        },
        {
          label: 'REQUIRED',
          field: (variant) =>
            html`<glaphic-textfield label="label" variant=${variant} required></glaphic-textfield>`,
        },
        {
          label: 'PLACEHOLDER',
          field: (variant) =>
            html`<glaphic-textfield label="label" variant=${variant} placeholder="placeholder"></glaphic-textfield>`,
        },
      ])}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled, the field holds: paper-elevated fill under a cool-200 1px stroke — dotted instead of solid on the line, drawn in cool-400 — and every ink drops to cool-400, including the in-field label and any typed value. A disabled field that holds a value keeps the label floated, its plate gone cool-200, with its fill stepped back to paper. Required is NOT a paint state: until it engages or holds a value, a required field reads exactly like every other; a * rides the label (floating up with it) and the input carries required/aria-required under it. The placeholder: where one is defined, the label starts floated above the stroke and the placeholder renders at the value position — the label and the placeholder never share a line. Draft copy.',
      },
    },
  },
};

export const ErrorHandling: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:700px">
      ${variantColumns([
        {
          label: 'ERROR',
          field: (variant) =>
            html`<glaphic-textfield label="label" variant=${variant} error></glaphic-textfield>`,
        },
      ])}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Error recolors the field: the fill pours to danger-surface (#ffe7eb), the stroke goes danger-base (#f81d41), any value in the field reads danger-text (#a30825), and the label sits floated in the danger plate, its ink the surface pink. The error holds its paint even focused; the line variant takes the danger stroke at the line\'s 0.5px width with an un-plated danger label (derived — no line-error state is drawn). The validation copy and the value/error pairing land in an expanded pass later. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the floating-label machine end to end:
   the default paints, the label's on-focus float and its delayed
   violet plate, the with-value mirror (elevated fill + cool plate),
   required's asterisk, the placeholder pin, both disabled states,
   the line's info-text focus, the dotted disabled line, and the
   error set */
export const TextfieldInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-textfield id="tf" label="label"></glaphic-textfield>
    <glaphic-textfield id="tf-ph" label="label" placeholder="placeholder"></glaphic-textfield>
    <glaphic-textfield id="tf-req" label="label" required></glaphic-textfield>
    <glaphic-textfield id="tf-dis" label="label" disabled></glaphic-textfield>
    <glaphic-textfield id="tf-dis-f" label="label" disabled value="swagman"></glaphic-textfield>
    <glaphic-textfield id="tf-line" label="label" variant="line"></glaphic-textfield>
    <glaphic-textfield id="tf-line-req" label="label" variant="line" required></glaphic-textfield>
    <glaphic-textfield id="tf-line-dis" label="label" variant="line" disabled></glaphic-textfield>
    <glaphic-textfield id="tf-err" label="label" error></glaphic-textfield>
    <glaphic-textfield id="tf-err-f" label="label" value="swagman" error></glaphic-textfield>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* typing must drive REAL keystrokes — vitest's CDP-backed browser
       userEvent (the slider's lesson: synthetic events fire no native
       default actions) */
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
      const field = host.shadowRoot!.querySelector('.label') as HTMLElement;
      const input = host.shadowRoot!.querySelector('input')!;
      return { host, field, input };
    };
    await step('defaults: paper fill, cool-400 0.5px, the label in-field', async () => {
      const { host, field, input } = parts('#tf');
      expect(host.value).toBe('');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(242, 245, 235)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(157, 153, 171)');
      /* 0.5px: Chromium rounds fractional border widths in computed
         style — read the width through its var instead */
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-textfield-stroke-width').trim(),
      ).toBe('0.5px');
      expect(getComputedStyle(host).height).toBe('54px');
      expect(getComputedStyle(host).width).toBe('200px');
      expect(field.textContent).toBe('label');
      expect(getComputedStyle(field).color).toBe('rgb(104, 100, 116)');
      expect(getComputedStyle(field).transform).toBe('none');
      expect(input.getAttribute('required')).toBe(null);
    });
    await step('focus: violet 1px, paper-elevated, the label floats then plates', async () => {
      const { host, field, input } = parts('#tf');
      input.focus();
      await settlePaint(() => getComputedStyle(host).backgroundColor, 'rgb(249, 250, 244)');
      await settlePaint(() => getComputedStyle(host).borderColor, 'rgb(132, 71, 255)');
      expect(getComputedStyle(host).borderWidth).toBe('1px');
      /* the float: 0.75-scaled, 32px up — the chip's bottom kisses the
         1px FOCUS band's outer edge (the focus band pushes the label's
         padding-box anchor +0.5, so the focus float parks at -5 - 27
         rather than the rest sets' -4.5 - 27) */
      await settlePaint(
        () => getComputedStyle(field).transform,
        'matrix(0.75, 0, 0, 0.75, 0, -32)',
      );
      /* the plate lands after the float: violet plate, paper-elevated ink */
      await settlePaint(() => getComputedStyle(field).backgroundColor, 'rgb(132, 71, 255)');
      expect(getComputedStyle(field).color).toBe('rgb(249, 250, 244)');
    });
    await step('typed value: filled mirrors, with-value grey on blur', async () => {
      const { host, field, input } = parts('#tf');
      /* document.activeElement is the host in shadow DOM — read the
         focus through the shadow root */
      expect(host.shadowRoot!.activeElement).toBe(input);
      await realKeys.keyboard('swagman');
      await new Promise((r) => setTimeout(r, 20));
      expect(host.value).toBe('swagman');
      /* the mirror the with-value paint hangs on */
      expect(host.hasAttribute('filled')).toBe(true);
      /* leave focus — the value holds its grey, the text stays dark:
         the fill lightens to paper-elevated and the floated label
         sits on its cool-600 plate */
      input.blur();
      await settlePaint(() => getComputedStyle(host).borderColor, 'rgb(104, 100, 116)');
      await settlePaint(() => getComputedStyle(host).backgroundColor, 'rgb(249, 250, 244)');
      await settlePaint(() => getComputedStyle(field).backgroundColor, 'rgb(104, 100, 116)');
      expect(getComputedStyle(field).color).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(input).color).toBe('rgb(13, 2, 33)');
      /* the focus → with-value float parks differ now (-32 → -31.5,
         the 1px focus band's half pixel) — settle the blur transition */
      await settlePaint(
        () => getComputedStyle(field).transform,
        'matrix(0.75, 0, 0, 0.75, 0, -31.5)',
      );
    });
    await step('required: no paint until engagement — the label sits in-field with the asterisk', async () => {
      const { host, field, input } = parts('#tf-req');
      expect(field.textContent).toBe('label*');
      expect(input.required).toBe(true);
      expect(input.getAttribute('aria-required')).toBe('true');
      /* an empty, unfocused required field reads exactly like every
         other: default paper fill under the cool-400 0.5px stroke,
         the in-field label in the default ink, NO float, NO plate */
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(242, 245, 235)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(157, 153, 171)');
      expect(getComputedStyle(field).transform).toBe('none');
      expect(getComputedStyle(field).color).toBe('rgb(104, 100, 116)');
      /* the line variant carries required the same way — in-field,
         no float (its line inks sit one step cooler) */
      const lineReq = parts('#tf-line-req');
      expect(lineReq.field.textContent).toBe('label*');
      expect(getComputedStyle(lineReq.field).transform).toBe('none');
      expect(getComputedStyle(lineReq.field).color).toBe('rgb(129, 125, 143)');
    });
    await step('placeholder pins the label from the start', async () => {
      const { host, field, input } = parts('#tf-ph');
      expect(host.value).toBe('');
      expect(input.placeholder).toBe('placeholder');
      expect(getComputedStyle(field).transform).toBe('matrix(0.75, 0, 0, 0.75, 0, -31.5)');
      expect(getComputedStyle(field).color).toBe('rgb(104, 100, 116)');
    });
    await step('disabled: cool hold; with a value the plate goes cool-200', async () => {
      const { host, field, input } = parts('#tf-dis');
      expect(input.disabled).toBe(true);
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(213, 210, 222)');
      expect(getComputedStyle(host).borderWidth).toBe('1px');
      expect(getComputedStyle(host).borderStyle).toBe('solid');
      expect(getComputedStyle(field).color).toBe('rgb(157, 153, 171)');
      /* disabled with value: the fill steps back to paper, the floated
         label's plate is cool-200, its ink still cool-400, the value
         text cool-400 too */
      const withValue = parts('#tf-dis-f');
      expect(withValue.host.value).toBe('swagman');
      expect(withValue.host.hasAttribute('filled')).toBe(true);
      expect(getComputedStyle(withValue.host).backgroundColor).toBe('rgb(242, 245, 235)');
      await settlePaint(
        () => getComputedStyle(withValue.field).backgroundColor,
        'rgb(213, 210, 222)',
      );
      /* disabled fields wear the 1px band: their floated chip parks one
         extra half pixel up (bottom still kisses the band's outer edge) */
      expect(getComputedStyle(withValue.field).transform).toBe(
        'matrix(0.75, 0, 0, 0.75, 0, -32)',
      );
      expect(getComputedStyle(withValue.field).color).toBe('rgb(157, 153, 171)');
      expect(getComputedStyle(withValue.input).color).toBe('rgb(157, 153, 171)');
    });
    await step('the line: bottom line only, focus turns the info-text ink', async () => {
      const { host, field, input } = parts('#tf-line');
      expect(getComputedStyle(host).height).toBe('30.5px');
      expect(getComputedStyle(host).borderRadius).toBe('0px');
      /* the line paints bottom-line ONLY — the sides read 0 — and the
         rest band rides 0.5px (the frame probes half the bubble's
         band); Chromium rounds fractional widths in computed style,
         so the band's width reads through its var */
      expect(getComputedStyle(host).borderLeftWidth).toBe('0px');
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-textfield-stroke-width').trim(),
      ).toBe('0.5px');
      expect(getComputedStyle(host).paddingLeft).toBe('4px');
      /* the fill is seated through the surface var (computed returns
         the rgba-ified transparent — no literal rgba in the asserts) */
      expect(
        getComputedStyle(host).getPropertyValue('--glaphic-textfield-surface').trim(),
      ).toBe('transparent');
      expect(getComputedStyle(field).color).toBe('rgb(129, 125, 143)');
      /* focus moves the stroke + label to the info-text ink — NO violet
         plate, and the float parks 1px higher (baseline on the stroke) */
      input.focus();
      await settlePaint(() => getComputedStyle(host).borderColor, 'rgb(90, 31, 204)');
      /* focus grows the line's band to 1px (bottom only) */
      expect(getComputedStyle(host).borderBottomWidth).toBe('1px');
      await settlePaint(
        () => getComputedStyle(field).transform,
        'matrix(0.75, 0, 0, 0.75, 0, -18.25)',
      );
      expect(getComputedStyle(field).color).toBe('rgb(90, 31, 204)');
    });
    await step('disabled line: the dotted small line in cool-400', async () => {
      const { host } = parts('#tf-line-dis');
      expect(getComputedStyle(host).borderStyle).toBe('dotted');
      expect(getComputedStyle(host).borderColor).toBe('rgb(157, 153, 171)');
      expect(getComputedStyle(host).borderBottomWidth).toBe('1px');
    });
    await step('error: the danger set — surface fill, danger plate, danger value', async () => {
      const { host, field } = parts('#tf-err');
      expect(getComputedStyle(host).borderColor).toBe('rgb(248, 29, 65)');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(255, 231, 235)');
      await settlePaint(() => getComputedStyle(field).backgroundColor, 'rgb(248, 29, 65)');
      expect(getComputedStyle(field).color).toBe('rgb(255, 231, 235)');
      expect(getComputedStyle(field).transform).toBe('matrix(0.75, 0, 0, 0.75, 0, -31.5)');
      /* a value held in the error field reads danger-text */
      const withValue = parts('#tf-err-f');
      expect(withValue.host.hasAttribute('filled')).toBe(true);
      expect(getComputedStyle(withValue.input).color).toBe('rgb(163, 8, 37)');
    });
  },
};