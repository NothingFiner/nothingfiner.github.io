import { html, type TemplateResult, LitElement } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-card.js';
import '../glaphic-plate/glaphic-plate.js';
import '../glaphic-frame/glaphic-frame.js';

const meta: Meta = {
  title: 'Surfaces/Card',
  component: 'glaphic-card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ONE flat panel: the paper-elevated fill behind a 1px cool-200 keyline at zero radius, a multiply layer over the page. The composing pieces are separate elements — glaphic-frame carries the corner captions (flex: top corners / children / bottom corners) and glaphic-plate is the decorative flat square that can ride a card or the page background without touching the layout. `chamfer` takes a comma subset of tl · tr · bl · br; `multiply="false"` paints opaque.',
      },
    },
  },
  argTypes: {
    chamfer: { control: 'text' },
    multiply: { control: 'boolean' },
  },
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 112];

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** DOCS SECTION — the panel itself. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px;position:relative;isolation:isolate;background:var(--glaphic-neutral-paper, #f2f5eb)">
      ${row(
        'PANEL',
        'the flat panel — paper-elevated fill, 1px cool-200 keyline, zero radius, multiply',
        html`<glaphic-card style="min-height:140px">
          <div style="font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">content lands in the slot</div>
        </glaphic-card>`,
      )}
      ${row(
        'MULTIPLY OFF',
        'multiply="false" — the same panel painted opaque',
        html`<glaphic-card multiply="false" style="min-height:80px">
          <div style="font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">opaque</div>
        </glaphic-card>`,
      )}
      ${row(
        'PADDED',
        'the panel keeps the consumer\'s box — Tier-2 --glaphic-card-padding sits the inset',
        html`<glaphic-card style="min-height:80px;--glaphic-card-padding: 14px">
          <div style="font:600 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">14px padding</div>
        </glaphic-card>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The card is a panel and nothing else: --glaphic-card-filling (paper-elevated default) behind the --glaphic-card-rim keyline (cool-200) at zero radius. It is a multiply layer over the page — the film of the old card, its depth ladder, the glass lens, the cutout wall and the card-part voice anatomy are all gone; the type voices live in glaphic-text, the captions in glaphic-frame, the decorative squares in glaphic-plate. multiply="false" repoints the blend to normal — the paint itself never gains alpha (no color-mix, no opacity, no masks). Draft copy.',
      },
    },
  },
};

/** DOCS SECTION — the chamfer: each corner and the subsets. */
export const Chamfered: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:18px;max-width:960px">
      ${['tl', 'tr', 'bl', 'br', 'tl,br', 'tl,tr,bl,br'].map(
        (cut) => html`
          <glaphic-card chamfer=${cut} style="width:150px;min-height:110px">
            <div style="font:600 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">${cut}</div>
          </glaphic-card>`,
      )}
      <glaphic-card chamfer="tl,tr,bl,br" style="width:150px;min-height:110px;--glaphic-card-chamfer: 38px">
        <div style="font:600 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">38px cut</div>
      </glaphic-card>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          '`chamfer` takes a comma-separated subset of \'tl\', \'tr\', \'bl\', \'br\' — one lit corner, a diagonal pair, or all four — cut at ~20px by clip-path (a clip, never a mask: nothing but polygon geometry sits in the paint). --glaphic-card-chamfer re-lengths the cut. The keyline runs the straight edges; the diagonal itself carries no rim today — the source art strokes the cut edge, so this line is flagged for the next Figma pass. Draft copy.',
      },
    },
  },
};

/** DOCS SECTION — the two source-art cards, rebuilt from the
 *  panel + plate + frame pieces (reference decode → composition). */
export const Composed: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:24px;max-width:960px">
      <!-- card one: square corners, brand + mint plates, paper-deep
           strip, mono captions over a fluro headline -->
      <div style="display:grid;gap:5px">
        <glaphic-card style="width:432px;min-height:285px">
          <glaphic-plate tone="brand" style="left:62px;top:48px;width:143px;height:140px"></glaphic-plate>
          <glaphic-plate tone="cyan" style="left:172px;top:139px;width:96px;height:90px"></glaphic-plate>
          <glaphic-plate tone="pale" style="left:0;right:0;top:194px;height:92px"></glaphic-plate>
          <glaphic-frame top-left="TITLE" top-right="Label">
            <div style="font:700 42px/1.05 var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);color:var(--glaphic-ink-brand-fluro, #14f1c8);text-shadow:4px 4px 0 var(--glaphic-multiply-magenta-yellow, #f81d41)">GLASS,CUT.</div>
            <div style="margin-top:12px;max-width:36ch;font:400 10px/1.6 var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-500, #817d8f)">Body copy keeps its own voice — the panel only fills and keys the edge; caption, plates and type are separate elements set on top.</div>
            <div style="display:flex;align-items:flex-end;gap:1px;margin-top:16px" aria-hidden="true">
              ${FIB.map((w) => html`<span style="display:block;height:5px;width:${w}px;background:var(--glaphic-ink-yellow, #ffff41)"></span>`)}
            </div>
          </glaphic-frame>
          <div style="position:absolute;left:20px;top:216px;font:600 9px var(--glaphic-font-family-mono, monospace);letter-spacing:0.14em;color:var(--glaphic-neutral-grey-cool-900, #201e28)">TAPE · FIBONACCI STEP</div>
        </glaphic-card>
        <div class="demo-specline"><span>CARD ONE</span><span>card + 3 plates + frame + type</span></div>
      </div>
      <!-- card two: one chamfered corner, the full-bleed fluro band,
           display type on the band, mono ink below -->
      <div style="display:grid;gap:5px">
        <glaphic-card chamfer="tl" style="width:432px;min-height:285px">
          <glaphic-plate tone="fluro" style="left:0;right:0;top:0;height:110px"></glaphic-plate>
          <div style="position:absolute;left:22px;top:34px;font:800 40px/1 var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);color:var(--glaphic-neutral-paper-elevated, #f9faf4);letter-spacing:0.02em">HEAD · HEAD</div>
          <div style="margin-top:150px;max-width:34ch;font:400 10px/1.6 var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-900, #201e28)">A full-bleed plate pinned by its insets: left 0, right 0 stretch the band edge to edge — the plate anchors to the panel\'s padding box, so top 0 rides the rim.</div>
        </glaphic-card>
        <div class="demo-specline"><span>CARD TWO</span><span>card + 1 full-bleed plate + type</span></div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The two source-art cards assembled from the kit — each panel carries glaphic-plate squares (absolute, default parked behind the content at z-index −1; insets anchor them to the panel\'s padding box, so top:0 is full bleed), glaphic-frame for the corner captions, and the type + tape authored consumer-side: the fluro headline\'s hard drop-shadow copy is a text-shadow, the fibonacci tape is static spans (glaphic-tape remains its own element for the living tape). Geometry flags — the headline\'s measured drop-shadow offset, the plate coordinates and the strip line are the decode pass; a Figma pull still owes the frame-true check. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the panel paint (fill / keyline /
   radius), the chamfer clip geometry per corner and subset, the
   multiply toggle (including the fresh-element boolean default), the
   plate-safe stacking root, and slot rendering */
export const CardInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;gap:8px">
      <glaphic-card id="k-card" style="width:300px;min-height:120px">
        <div id="k-body" style="height:40px;font:400 12px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">slotted content</div>
      </glaphic-card>
      <glaphic-card id="k-chamfer-tltr" chamfer="tl,tr" style="width:300px;min-height:120px"></glaphic-card>
      <glaphic-card id="k-chamfer-bl" chamfer="bl" style="width:300px;min-height:120px"></glaphic-card>
      <glaphic-card id="k-opaque" multiply="false" style="width:300px;min-height:80px"></glaphic-card>
      <div id="k-ground" style="position:relative;isolation:isolate;height:60px;background:var(--glaphic-neutral-paper, #f2f5eb)">
        <glaphic-card id="k-nested" style="width:200px">
          <glaphic-plate tone="yellow" style="left:8px;top:8px;width:40px;height:20px" id="k-nested-plate"></glaphic-plate>
          <div style="font:600 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">plate behind</div>
        </glaphic-card>
      </div>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const card = (sel: string) => canvasElement.querySelector(sel) as LitElement & { multiply: boolean };
    await step('panel: paper-elevated fill, 1px cool-200 keyline, zero radius, multiply layer', async () => {
      const host = card('#k-card');
      const cs = getComputedStyle(host);
      expect(cs.backgroundColor).toBe('rgb(249, 250, 244)');
      expect(cs.borderColor).toBe('rgb(213, 210, 222)');
      expect(cs.borderWidth).toBe('1px');
      expect(cs.borderRadius).toBe('0px');
      expect(cs.mixBlendMode).toBe('multiply');
      expect(cs.backdropFilter).toBe('none');
      expect(cs.opacity).toBe('1');
      const body = canvasElement.querySelector('#k-body') as HTMLElement;
      expect(body.getBoundingClientRect().width).toBeGreaterThan(0);
      expect(host.shadowRoot!.querySelector('svg, mask')).toBeFalsy();
    });
    await step('chamfer tl,tr: the two corners are clipped, the others square', async () => {
      const host = card('#k-chamfer-tltr');
      const cs = getComputedStyle(host);
      expect(cs.clipPath).toContain('polygon');
      expect(cs.clipPath).toContain('20px');
      const r = host.getBoundingClientRect();
      /* inside the tl cut — the clip has taken the corner out of the
         card, so the point at the very corner is NOT the card */
      expect(document.elementFromPoint(r.left + 1, r.top + 1)).not.toBe(host);
      expect(document.elementFromPoint(r.left + 1, r.top + 30)).toBe(host); // below the tl cut
      expect(document.elementFromPoint(r.right - 2, r.top + 1)).not.toBe(host); // inside the tr cut
      expect(document.elementFromPoint(r.left + 1, r.bottom - 2)).toBe(host); // bl square
      expect(document.elementFromPoint(r.right - 2, r.bottom - 2)).toBe(host); // br square
    });
    await step('chamfer bl alone: the top corners stay square', async () => {
      const host = card('#k-chamfer-bl');
      const r = host.getBoundingClientRect();
      expect(document.elementFromPoint(r.left + 1, r.top + 1)).toBe(host);
      /* the bl cut sits inside the border box: its diagonal starts at
         (cut, bottom), so the bottom-left 1px corner is clipped away */
      expect(document.elementFromPoint(r.left + 2, r.bottom - 3)).not.toBe(host);
    });
    await step('multiply off: opaque panel, same paint', async () => {
      const host = card('#k-opaque');
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(249, 250, 244)');
      host.multiply = true;
      await host.updateComplete;
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
    });
    await step('boolean default: a fresh element blends multiply before any attribute', async () => {
      const fresh = document.createElement('glaphic-card');
      fresh.textContent = 'fresh';
      canvasElement.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.multiply).toBe(true);
      expect(getComputedStyle(fresh).mixBlendMode).toBe('multiply');
      fresh.multiply = false;
      await fresh.updateComplete;
      expect(fresh.hasAttribute('multiply')).toBe(false);
      expect(getComputedStyle(fresh).mixBlendMode).toBe('normal');
      fresh.remove();
    });
    await step('stacking root: a nested plate rides above the fill, below the content', async () => {
      const host = card('#k-nested');
      const plate = canvasElement.querySelector('#k-nested-plate') as HTMLElement;
      expect(plate.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(plate).zIndex).toBe('-1');
      /* the plate's paint must come out in front of the panel's own
         background — compare the pixel against the bare yellow */
      const pr = plate.getBoundingClientRect();
      expect(document.elementFromPoint(pr.left + pr.width / 2, pr.top + pr.height / 2)).toBe(host);
    });
  },
};