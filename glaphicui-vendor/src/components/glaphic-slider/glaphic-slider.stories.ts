import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-slider.js';

const meta: Meta = {
  title: 'Controls/Slider',
  component: 'glaphic-slider',
  tags: ['autodocs'],
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Anatomy: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row(
        'SLIDER',
        'value readout → 8px rail → notched knob',
        html`<glaphic-slider value="90"></glaphic-slider>`,
      )}
      ${row(
        'RANGE',
        'min 0 · max 255 · step 1',
        html`<glaphic-slider min="0" max="255" step="1" value="90"></glaphic-slider>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The value readout stands left of the rail in 16px mono and follows the knob. The rail is an 8px line in cool-600, and the knob is a 15×15 sharp notch of the same grey, marked only by a 1px paper keyline on its left edge — it reads as a cut in the bar, not an on top of it. An inner 3px cool-400 line runs from the knob to the rail\'s far end, marking the active area from the notch out. The readout reserves its widest value\'s digits: a readout that resizes mid-drag would shift the rail under the pointer and rubber-band the value around the digit boundary. Under the paint it is a native range input: drag, click, and arrow keys all speak to it. Draft copy.',
      },
    },
  },
};

export const Chip: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px;padding-top:12px">
      ${row(
        'LABEL',
        'the "fov" chip rides the row\'s top-left',
        html`<glaphic-slider label="fov" min="0" max="255" step="1" value="90"></glaphic-slider>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Set label and a grey chip — cool-600 ground, paper-deep text — floats at the row\'s top-left, dipping into its top padding. The chip doubles as the accessible name of the underlying input. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the value binding, the retargeted native
   events, the inner active-area line, and the derived disabled hold */
export const SliderInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-slider id="sl" value="90"></glaphic-slider>
    <glaphic-slider id="sl-chip" label="fov" min="0" max="255" step="1" value="90"></glaphic-slider>
    <glaphic-slider id="sl-disabled" disabled value="40"></glaphic-slider>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* the range's arrow-key dispatch is a browser default action —
       storybook/test's userEvent synthesizes events that do not
       trigger it, so keyboard steps drive REAL keystrokes through
       vitest's CDP-backed browser userEvent */
    const { userEvent: realKeys } = await import('vitest/browser');
    const parts = (id: string) => {
      const host = canvasElement.querySelector(id) as HTMLElement & { value: number };
      const input = host.shadowRoot!.querySelector('input')!;
      const rail = host.shadowRoot!.querySelector('.rail')!;
      return { host, input, rail, readout: host.shadowRoot!.querySelector('output')! };
    };
    await step('value binds to the input and the readout', async () => {
      const { input, readout } = parts('#sl');
      expect(input.value).toBe('90');
      expect(readout.textContent).toBe('90');
    });
    await step('arrow keys step the value and move the knob', async () => {
      const { host, input, readout } = parts('#sl');
      input.focus();
      await realKeys.keyboard('{ArrowRight}');
      await new Promise((r) => setTimeout(r, 20));
      expect(input.value).toBe('91');
      expect(host.value).toBe(91);
      expect(readout.textContent).toBe('91');
    });
    await step('the inner line runs from the knob to the rail end', async () => {
      const { host, input, rail } = parts('#sl');
      const after = getComputedStyle(rail, '::after');
      const fill = (host.value - 0) / (100 - 0);
      const expectedLeft = fill * (parseFloat(getComputedStyle(input).width) - 15) + 15;
      expect(Math.abs(parseFloat(after.left) - expectedLeft)).toBeLessThan(1.5);
      expect(after.backgroundColor).toBe('rgb(157, 153, 171)');
      expect(parseFloat(after.height)).toBe(3);
      expect(parseFloat(after.width)).toBeGreaterThan(0);
    });
    await step('the readout reserves the max value\'s digits so the rail never shifts', async () => {
      const { readout } = parts('#sl');
      const cs = getComputedStyle(readout);
      expect(cs.textAlign).toBe('right');
      /* #sl runs 0..100 — the widest value ("100") is three digits */
      expect(readout.style.minWidth).toBe('3ch');
      expect(parseFloat(cs.minWidth)).toBeGreaterThan(20);
    });
    await step('the native input event retargets to the host', async () => {
      const { host, input } = parts('#sl');
      let seen = 0;
      host.addEventListener('input', () => seen++);
      input.dispatchEvent(
        new Event('input', { bubbles: true, composed: true }),
      );
      expect(seen).toBe(1);
    });
    await step('the chip carries the label and names the input for a11y', async () => {
      const { host } = parts('#sl-chip');
      const chip = host.shadowRoot!.querySelector('label')!;
      const input = host.shadowRoot!.querySelector('input')!;
      expect(chip.textContent).toBe('fov');
      expect(chip.getAttribute('for')).toBe(input.id);
      expect(input.getAttribute('aria-label')).toBe('fov');
    });
    await step('disabled (derived): grey hold, no stepping', async () => {
      const { host, input, readout } = parts('#sl-disabled');
      expect(input.disabled).toBe(true);
      /* getComputedStyle cannot resolve color on webkit range
         pseudos, so the hold is asserted through the re-seated
         Tier-2 tokens the track and knob consume */
      expect(
        getComputedStyle(input).getPropertyValue('--glaphic-slider-rail-color').trim(),
      ).toBe('#d5d2de');
      expect(
        getComputedStyle(input).getPropertyValue('--glaphic-slider-knob-color').trim(),
      ).toBe('#9d99ab');
      input.focus();
      await realKeys.keyboard('{ArrowRight}');
      await new Promise((r) => setTimeout(r, 20));
      expect(readout.textContent).toBe('40');
      expect(host.value).toBe(40);
    });
  },
};