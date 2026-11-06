import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-switch.js';

const meta: Meta = {
  title: 'Controls/Switch',
  component: 'glaphic-switch',
  tags: ['autodocs'],
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

const switches = (...specs: TemplateResult[]) =>
  html`<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">${specs}</div>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Variants: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row(
        'NEUTRAL',
        'default — warm track / cool keyline, on runs deep sage',
        html`<div style="display:flex;gap:18px;align-items:center">
          <glaphic-switch></glaphic-switch>
          <glaphic-switch checked></glaphic-switch>
        </div>`,
      )}
      ${row(
        'PRIMARY',
        'off holds cool greys — on runs brand-fluro with an ink knob',
        html`<div style="display:flex;gap:18px;align-items:center">
          <glaphic-switch variant="primary"></glaphic-switch>
          <glaphic-switch variant="primary" checked></glaphic-switch>
        </div>`,
      )}
      ${row(
        'SECONDARY',
        'off holds warm greys and an ink keyline — on runs brand-dark',
        html`<div style="display:flex;gap:18px;align-items:center">
          <glaphic-switch variant="secondary"></glaphic-switch>
          <glaphic-switch variant="secondary" checked></glaphic-switch>
        </div>`,
      )}
      ${row(
        'DANGER',
        'off holds the danger surface — on runs danger-base',
        html`<div style="display:flex;gap:18px;align-items:center">
          <glaphic-switch variant="danger"></glaphic-switch>
          <glaphic-switch variant="danger" checked></glaphic-switch>
        </div>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Four variants off the Figma Switch set, off and on side by side. Every fill is opaque with a 1px keyline, and the keyline is its own decision per state — neutral strokes cool-400 in both positions, primary strokes its ink on the fluro track, secondary strokes brand-dark, danger strokes text on the base. The word at the right reads the state: Off here, On there. Draft copy.',
      },
    },
  },
};

export const States: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row(
        'NEUTRAL',
        'off · hover (forced) previews the on-look · on · on hover · disabled',
        html`${switches(
          html`<glaphic-switch></glaphic-switch>`,
          html`<glaphic-switch force-hover></glaphic-switch>`,
          html`<glaphic-switch checked></glaphic-switch>`,
          html`<glaphic-switch checked force-hover></glaphic-switch>`,
          html`<glaphic-switch disabled></glaphic-switch>`,
        )}`
      )}
      ${row(
        'PRIMARY',
        'off · hover (forced) picks up the fluro knob · disabled',
        html`${switches(
          html`<glaphic-switch variant="primary"></glaphic-switch>`,
          html`<glaphic-switch variant="primary" force-hover></glaphic-switch>`,
          html`<glaphic-switch variant="primary" checked></glaphic-switch>`,
          html`<glaphic-switch variant="primary" disabled></glaphic-switch>`,
        )}`
      )}
      ${row(
        'DANGER',
        'hover (forced) deepens keyline + knob to base',
        html`${switches(
          html`<glaphic-switch variant="danger"></glaphic-switch>`,
          html`<glaphic-switch variant="danger" force-hover></glaphic-switch>`,
        )}`
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'States pinned declaratively. The neutral hover previews the position you are about to land on — the off track warms to the deep sage the on track wears, and the on track washes to paper-deep under a dark knob. Disabled holds the cool hold under the pointer: no hover state, no opacity. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the state tables and the event contract */
export const SwitchInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-switch id="sw-neutral"></glaphic-switch>
    <glaphic-switch id="sw-primary" variant="primary"></glaphic-switch>
    <glaphic-switch id="sw-secondary" variant="secondary"></glaphic-switch>
    <glaphic-switch id="sw-danger" variant="danger"></glaphic-switch>
    <glaphic-switch id="sw-disabled" disabled></glaphic-switch>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect, userEvent } = await import('storybook/test');
    /* a bare 250ms settle still lands mid-flight on the 0.12s track
       transition, so poll until the paint reaches the target color
       (2s deadline) before asserting it */
    const settlePaint = async (read: () => string, expected: string): Promise<string> => {
      let got = read();
      if (got === expected) return got;
      const deadline = Date.now() + 2000;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 25));
        got = read();
        if (got === expected) return got;
      }
      return got;
    };
    const parts = (id: string) => {
      const host = canvasElement.querySelector(id) as HTMLElement & { checked: boolean };
      return {
        host,
        toggle: host.shadowRoot!.querySelector('button')!,
        knob: host.shadowRoot!.querySelector('i')!,
      };
    };
    await step('click: checked flips, aria-checked follows, change carries detail', async () => {
      const { host, toggle } = parts('#sw-neutral');
      const detail: Array<{ checked: boolean }> = [];
      host.addEventListener('change', (e) => detail.push((e as CustomEvent).detail));
      toggle.click();
      await new Promise((r) => setTimeout(r, 20)); /* let the re-render flush */
      expect(host.checked).toBe(true);
      expect(host.hasAttribute('checked')).toBe(true);
      expect(toggle.getAttribute('aria-checked')).toBe('true');
      expect(detail).toEqual([{ checked: true }]);
      /* the track paints through a 0.12s transition — read it only
         once the paint has reached the on-track target */
      expect(
        await settlePaint(() => getComputedStyle(toggle).backgroundColor, 'rgb(86, 92, 79)'),
      ).toBe('rgb(86, 92, 79)');
    });
    await step('Space toggles back off through the keyboard', async () => {
      const { host, toggle } = parts('#sw-neutral');
      toggle.focus();
      await userEvent.keyboard(' ');
      await new Promise((r) => setTimeout(r, 20)); /* let the re-render flush */
      expect(host.checked).toBe(false);
      expect(toggle.getAttribute('aria-checked')).toBe('false');
    });
    await step('neutral hover: the off track previews the on-look', async () => {
      const { host, toggle, knob } = parts('#sw-neutral');
      host.setAttribute('force-hover', '');
      expect(
        await settlePaint(() => getComputedStyle(toggle).backgroundColor, 'rgb(86, 92, 79)'),
      ).toBe('rgb(86, 92, 79)');
      expect(
        await settlePaint(() => getComputedStyle(knob).backgroundColor, 'rgb(236, 239, 230)'),
      ).toBe('rgb(236, 239, 230)');
      host.removeAttribute('force-hover');
    });
    await step('variant paints: primary on runs fluro, secondary brand-dark, danger base', async () => {
      const primary = parts('#sw-primary');
      const secondary = parts('#sw-secondary');
      const danger = parts('#sw-danger');
      primary.host.setAttribute('checked', '');
      expect(
        await settlePaint(
          () => getComputedStyle(primary.toggle).backgroundColor,
          'rgb(20, 241, 200)',
        ),
      ).toBe('rgb(20, 241, 200)');
      expect(
        await settlePaint(
          () => getComputedStyle(primary.knob).backgroundColor,
          'rgb(13, 2, 33)',
        ),
      ).toBe('rgb(13, 2, 33)');
      secondary.host.setAttribute('checked', '');
      expect(
        await settlePaint(
          () => getComputedStyle(secondary.toggle).backgroundColor,
          'rgb(166, 2, 42)',
        ),
      ).toBe('rgb(166, 2, 42)');
      danger.host.setAttribute('checked', '');
      expect(
        await settlePaint(() => getComputedStyle(danger.toggle).backgroundColor, 'rgb(248, 29, 65)'),
      ).toBe('rgb(248, 29, 65)');
    });
    await step('disabled: holds the grey, ignores click and hover, blocks the toggle', async () => {
      const { host, toggle } = parts('#sw-disabled');
      toggle.click();
      expect(host.checked).toBe(false);
      expect(getComputedStyle(toggle).backgroundColor).toBe('rgb(233, 231, 239)');
      expect(getComputedStyle(toggle).borderColor).toBe('rgb(213, 210, 222)');
      expect(getComputedStyle(toggle).opacity).toBe('1');
      host.setAttribute('force-hover', '');
      expect(
        await settlePaint(
          () => getComputedStyle(toggle).backgroundColor,
          'rgb(233, 231, 239)',
        ),
      ).toBe('rgb(233, 231, 239)');
    });
  },
};