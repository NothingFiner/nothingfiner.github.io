import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-plate.js';

const meta: Meta = {
  title: 'Surfaces/Plate',
  component: 'glaphic-plate',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A paint-only rectangle: one tone of fill (brand · fluro · cyan · pale · yellow — every tone a live token), absolutely positioned, aria-hidden, pointer-events none, zero layout participation, parked behind the flow at z-index −1. It is how the decorative visual squares ride a card or the page background without touching the dom.',
      },
    },
  },
  argTypes: {
    tone: { control: 'radio', options: ['brand', 'fluro', 'cyan', 'pale', 'yellow'] },
  },
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

const swatch = (tone: string, w: number, h: number, x: number) =>
  html`<glaphic-plate tone=${tone} style="inset-block-start:0;inset-inline-start:${x}px;width:${w}px;height:${h}px"></glaphic-plate>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** DOCS SECTION — the five tones, a card carrying them, and the
 *  page-background read. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row(
        'TONES',
        'the five fill tones — every one a live token',
        html`<div style="position:relative;isolation:isolate;height:24px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          ${swatch('brand', 80, 24, 0)}${swatch('fluro', 80, 24, 88)}${swatch('cyan', 80, 24, 176)}${swatch('pale', 80, 24, 264)}${swatch('yellow', 80, 24, 352)}
        </div>`,
      )}
      ${row(
        'IN A CARD',
        'the card\'s visual squares: plates pinned to the panel\'s padding box, content above',
        html`<glaphic-card style="width:320px;min-height:180px">
          <glaphic-plate tone="brand" style="left:24px;top:30px;width:100px;height:96px"></glaphic-plate>
          <glaphic-plate tone="cyan" style="left:104px;top:106px;width:66px;height:60px"></glaphic-plate>
          <glaphic-frame top-left="TITLE" top-right="Label">
            <div style="font:700 24px/1.1 var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);color:var(--glaphic-ink-brand-dark, #a6022a)">Plates underneath</div>
          </glaphic-frame>
        </glaphic-card>`,
      )}
      ${row(
        'PAGE BACKGROUND',
        'the site-background read: the plate behind a section\'s flow, host isolated',
        html`<div style="position:relative;isolation:isolate;padding:18px 20px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          <glaphic-plate tone="yellow" style="inset-block-end:0;inset-inline-end:0;width:150px;height:44px"></glaphic-plate>
          <glaphic-plate tone="cyan" style="inset-block-start:0;inset-inline-start:12px;width:70px;height:70px"></glaphic-plate>
          <div style="position:relative;font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">flow copy above the plates</div>
        </div>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The plate paints one fill and nothing else — no children render, no border, no radius — and never enters the layout: it is absolute, pointer-events none and aria-hidden, with its size coming from two stretched insets or pinned width/height. Inside a card the plates anchor to the panel\'s padding box (top:0 is full bleed against the rim). The page-background read teaches the one stacking rule: the −1 default trusts the container to be its own stacking context — an isolated section (as here) holds the plate above its own fill and under the flow. Draft copy.',
      },
    },
  },
};

/** DOCS SECTION — placement: the logical insets, the physical
 *  overrides, the stretch, the full bleed. */
export const Positioned: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row(
        'LOGICAL INSETS',
        '--glaphic-plate-inset-inline-start + -inset-block-end — one corner pin',
        html`<div style="position:relative;isolation:isolate;height:90px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          <glaphic-plate tone="brand" style="--glaphic-plate-inset-inline-start: 12px; --glaphic-plate-inset-block-end: 10px; width: 90px; height: 40px"></glaphic-plate>
        </div>`,
      )}
      ${row(
        'PHYSICAL OVERRIDES',
        '--glaphic-plate-top / -left win over a set logical inset',
        html`<div style="position:relative;isolation:isolate;height:90px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          <glaphic-plate tone="fluro" style="--glaphic-plate-top: 24px; --glaphic-plate-left: 130px; --glaphic-plate-inset-inline-start: 12px; width: 70px; height: 30px"></glaphic-plate>
        </div>`,
      )}
      ${row(
        'STRETCHED',
        'both ends of an axis set — the plate measures the run, no width needed',
        html`<div style="position:relative;isolation:isolate;height:90px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          <glaphic-plate tone="pale" style="inset-block-start:20px;height:40px;inset-inline-start:10px;inset-inline-end:10px"></glaphic-plate>
        </div>`,
      )}
      ${row(
        'FULL BLEED',
        'all four insets 0 — the plate covers its host edge to edge',
        html`<div style="position:relative;isolation:isolate;height:90px;background:var(--glaphic-neutral-paper, #f2f5eb)">
          <glaphic-plate tone="yellow" style="inset-block-start:0;inset-block-end:0;inset-inline-start:0;inset-inline-end:0"></glaphic-plate>
        </div>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Placement rides four logical inset vars — inset-block-start/end and inset-inline-start/end, auto by default — with the physical overrides (--glaphic-plate-top · -right · -bottom · -left) taking precedence per side when both are set. Two ends set on one axis stretch the plate across the run, so a band or a full bleed needs no width; a single pin keeps the consumer\'s width/height. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the fill tones (rgb reads per recipe),
   the paint-only/pointer-through/aria-hidden contract, the logical
   inset behavior, the physical override precedence, and the
   stacking default */
export const PlateInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div id="p-ground" style="position:relative;isolation:isolate;width:520px;height:30px;background:var(--glaphic-neutral-paper, #f2f5eb)">
      ${swatch('brand', 80, 24, 0)}${swatch('fluro', 80, 24, 88)}${swatch('cyan', 80, 24, 176)}${swatch('pale', 80, 24, 264)}${swatch('yellow', 80, 24, 352)}
    </div>
    <div id="p-insets" style="position:relative;isolation:isolate;width:240px;height:120px;background:var(--glaphic-neutral-paper, #f2f5eb)">
      <glaphic-plate id="p-logical" style="--glaphic-plate-inset-inline-start: 12px; --glaphic-plate-inset-block-end: 8px; width: 60px; height: 20px"></glaphic-plate>
      <glaphic-plate id="p-physical" style="--glaphic-plate-top: 24px; --glaphic-plate-left: 30px; --glaphic-plate-inset-inline-start: 99px; width: 40px; height: 16px"></glaphic-plate>
      <glaphic-plate id="p-stacked" tone="cyan" style="--glaphic-plate-stacking: 2; inset-block-start: 60px; inset-inline-start: 0; width: 30px; height: 14px"></glaphic-plate>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const plate = (sel: string) => canvasElement.querySelector(sel) as HTMLElement;
    await step('tones: each recipe reads its token (rgb)', async () => {
      const ground = canvasElement.querySelector('#p-ground') as HTMLElement;
      const gr = ground.getBoundingClientRect();
      const colors = ['rgb(166, 2, 42)', 'rgb(248, 29, 65)', 'rgb(20, 241, 200)', 'rgb(233, 237, 224)', 'rgb(255, 255, 65)'];
      const xs = [0, 88, 176, 264, 352];
      const plates = [...ground.querySelectorAll('glaphic-plate')];
      expect(plates.length).toBe(5);
      plates.forEach((p, i) => {
        expect(getComputedStyle(p).backgroundColor).toBe(colors[i]);
        expect(p.getBoundingClientRect().left - gr.left).toBeCloseTo(xs[i], 5);
      });
    });
    await step('contract: paint-only, pointer-through, aria-hidden, out of flow', async () => {
      const one = plate('#p-logical');
      const cs = getComputedStyle(one);
      expect(one.getAttribute('aria-hidden')).toBe('true');
      expect(cs.pointerEvents).toBe('none');
      expect(cs.position).toBe('absolute');
      // no children render, no extra paint: empty shadow root, no mask
      expect(one.shadowRoot!.querySelectorAll('*').length).toBe(0);
      expect((one.shadowRoot as ShadowRoot).querySelector('mask')).toBeFalsy();
    });
    await step('logical insets pin the corner the consumer names', async () => {
      const host = canvasElement.querySelector('#p-insets') as HTMLElement;
      const hr = host.getBoundingClientRect();
      const plateRect = plate('#p-logical').getBoundingClientRect();
      expect(plateRect.left - hr.left).toBeCloseTo(12, 5);
      expect(hr.bottom - plateRect.bottom).toBeCloseTo(8, 5);
    });
    await step('physical overrides win per side', async () => {
      const host = canvasElement.querySelector('#p-insets') as HTMLElement;
      const hr = host.getBoundingClientRect();
      const pr = plate('#p-physical').getBoundingClientRect();
      expect(pr.top - hr.top).toBeCloseTo(24, 5);
      expect(pr.left - hr.left).toBeCloseTo(30, 5);
    });
    await step('stacking: parked at −1, overridable', async () => {
      expect(getComputedStyle(plate('#p-logical')).zIndex).toBe('-1');
      expect(getComputedStyle(plate('#p-stacked')).zIndex).toBe('2');
    });
  },
};