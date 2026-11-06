import { html, type TemplateResult, LitElement } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-frame.js';
import '../glaphic-card/glaphic-card.js';

const meta: Meta = {
  title: 'Surfaces/Frame',
  component: 'glaphic-frame',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The corner-captions wrapper: a flex column of top corners / children / bottom corners. Each corner speaks an attribute caption (top-left="TITLE" …) or its named slot for rich content — slots replace the same corner\'s caption. Corners with no content take no space: an empty corner generates no boxes, so its row collapses to zero height.',
      },
    },
  },
  argTypes: {
    topLeft: { name: 'top-left', control: 'text', table: { category: 'captions' } },
    topRight: { name: 'top-right', control: 'text', table: { category: 'captions' } },
    bottomLeft: { name: 'bottom-left', control: 'text', table: { category: 'captions' } },
    bottomRight: { name: 'bottom-right', control: 'text', table: { category: 'captions' } },
  },
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

const body = (text: string) =>
  html`<div style="font:400 11px/1.6 var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">${text}</div>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** DOCS SECTION — the sketch, corner subsets, and the frame inside a
 *  card. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row(
        'SKETCH',
        'one top corner + children + one bottom corner — the inactive corners leave no space',
        html`<glaphic-frame top-left="TITLE" bottom-right="FOOT 02">${body('The three-row flex: top corners, children, bottom corners.')}</glaphic-frame>`,
      )}
      ${row(
        'ALL FOUR',
        'both rows live — space-between on each row',
        html`<glaphic-frame top-left="TITLE" top-right="Label" bottom-left="FIG 01" bottom-right="Note">${body('All four captions read; each row spaces its two corners apart.')}</glaphic-frame>`,
      )}
      ${row(
        'IN A CARD',
        'the frame carries a card\'s caption anatomy while the panel keys the edge',
        html`<glaphic-card style="width:320px;--glaphic-card-padding: 14px 18px">
          <glaphic-frame top-left="TITLE" top-right="Label">
            <div style="font:700 28px/1.1 var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);color:var(--glaphic-ink-brand-dark, #a6022a)">Frame + plate card</div>
            <div style="margin-top:10px;font:400 10px/1.6 var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-500, #817d8f)">Captions ride the frame; the card stays a flat panel.</div>
          </glaphic-frame>
        </glaphic-card>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The wrapper is the sketch itself: a flex column whose first and last rows hold the two corners each (space-between) with the children between them. Corners without content leave no space — the one-corner read measures the empty row at exactly zero height. No paint crosses the host: the wrapper only organizes. Draft copy.',
      },
    },
  },
};

/** DOCS SECTION — rich corners: the named slots replacing the
 *  attribute captions, late-bound content, the caption knobs. */
export const Rich: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row(
        'SLOT OVER CAPTION',
        'the top-right slot\'s content replaces the top-right="Label" caption',
        html`<glaphic-frame top-left="TITLE" top-right="Label" bottom-left="FIG 01">
          <span slot="top-right" style="font:600 10px var(--glaphic-font-family-mono, monospace);letter-spacing:0.14em;color:var(--glaphic-ink-brand-dark, #a6022a)">RICH CORNER</span>
          ${body('Assign content to a named corner slot and its attribute caption yields.')}
        </glaphic-frame>`,
      )}
      ${row(
        'RICH CAPTION',
        'the bottom-right slot carries markup, not text',
        html`<glaphic-frame top-left="TITLE" bottom-right="NOTE">
          <span slot="bottom-right" style="display:flex;gap:6px;font:600 9px var(--glaphic-font-family-mono, monospace);letter-spacing:0.14em;color:var(--glaphic-neutral-grey-cool-600, #686474)">
            <i style="display:block;width:8px;height:8px;background:var(--glaphic-ink-yellow, #ffff41)"></i> LIVE 01
          </span>
          ${body('Any element the consumer writes; the caption voice stays theirs.')}
        </glaphic-frame>`,
      )}
      ${row(
        'CAPTION KNOBS',
        '--glaphic-frame-ink + caption size/tracking and the row spacing retuned',
        html`<glaphic-frame
          top-left="TITLE"
          bottom-right="FOOT"
          style="--glaphic-frame-ink: var(--glaphic-ink-brand-dark, #a6022a); --glaphic-frame-caption-size: 12px; --glaphic-frame-caption-tracking: 0.06em; --glaphic-frame-row-spacing: 18px"
        >
          ${body('Tier-2 rides the element: ink, size, tracking, row spacing, per-row over the shared gap.')}
        </glaphic-frame>`,
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Rich corners speak the four named slots — top-left · top-right · bottom-left · bottom-right — and an assigned slot replaces that corner\'s attribute caption (the caption is the slot\'s fallback). Content added after mount lights its corner too: the slots stay mounted, so the assignment is heard whenever it lands. The caption voice is Tier-2: --glaphic-frame-ink (cool-600 default), -font-family, -caption-size (10px), -caption-tracking (the tracked chip read), and the row spacing (--glaphic-frame-row-spacing, per-row over the top/bottom variants). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the sketch: the one-corner read (empty
   sibling rows at zero height), all four corners, slots replacing
   attribute captions, late-bound corner content, the caption ink and
   the no-paint physics */
export const FrameInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;gap:10px;max-width:400px">
      <glaphic-frame id="f-one" top-left="TITLE">
        <div id="f-one-body" style="font:400 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">children land here</div>
      </glaphic-frame>
      <glaphic-frame id="f-all" top-left="TITLE" top-right="Label" bottom-left="FIG" bottom-right="NOTE">
        <div style="font:400 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-neutral-grey-cool-600, #686474)">all four</div>
      </glaphic-frame>
      <glaphic-frame id="f-slot" top-right="Label">
        <span id="f-slot-rich" slot="top-right" style="font:600 10px var(--glaphic-font-family-mono, monospace);color:var(--glaphic-ink-brand-dark, #a6022a)">RICH</span>
        <div style="font:400 10px var(--glaphic-font-family-mono, monospace)">body</div>
      </glaphic-frame>
      <glaphic-frame id="f-ink" top-left="TITLE"><div>ink</div></glaphic-frame>
      <glaphic-frame id="f-late"><div>body only, for now</div></glaphic-frame>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const frame = (sel: string) => canvasElement.querySelector(sel) as LitElement;
    await step('one corner: its row reads, the empty sibling rows measure zero', async () => {
      const host = frame('#f-one');
      await host.updateComplete;
      const rows = (edge: string) => host.shadowRoot!.querySelector(`.frame-row[data-edge="${edge}"]`) as HTMLElement;
      const top = rows('top');
      const bottom = rows('bottom');
      expect(top.getBoundingClientRect().height).toBeGreaterThan(0);
      /* caption line + the 10px spacing knob (baseline rounding) */
      expect(top.getBoundingClientRect().height).toBeLessThan(30);
      expect(bottom.getBoundingClientRect().height).toBe(0);
      const bodyChild = canvasElement.querySelector('#f-one-body') as HTMLElement;
      expect(bodyChild.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await step('all four: two live rows, space-between, tracked cool-600 captions', async () => {
      const host = frame('#f-all');
      await host.updateComplete;
      const row = host.shadowRoot!.querySelector('.frame-row') as HTMLElement;
      expect(getComputedStyle(row).justifyContent).toBe('space-between');
      const caps = [...host.shadowRoot!.querySelectorAll('span.cap')] as HTMLElement[];
      expect(caps.length).toBe(4);
      const cap = caps[0];
      expect(getComputedStyle(cap).color).toBe('rgb(104, 100, 116)');
      expect(getComputedStyle(cap).letterSpacing).toBe('1.4px'); /* 0.14em on the 10px size */
      expect(getComputedStyle(cap).fontFamily).toMatch(/IBM Plex Mono|monospace/);
    });
    await step('slots replace the attribute captions', async () => {
      const host = frame('#f-slot');
      await host.updateComplete;
      const slot = host.shadowRoot!.querySelector('slot[name="top-right"]') as HTMLSlotElement;
      const assigned = slot.assignedNodes({ flatten: false });
      expect(assigned.length).toBe(1);
      /* the attribute caption survives only as the slot's fallback —
         the assignment is what paints */
      expect(slot.querySelector('span.cap')!.textContent).toBe('Label');
      const rich = canvasElement.querySelector('#f-slot-rich') as HTMLElement;
      expect(rich.getBoundingClientRect().width).toBeGreaterThan(0);
      expect(getComputedStyle(rich).color).toBe('rgb(166, 2, 42)');
    });
    await step('caption ink: the Tier-2 ink retunes', async () => {
      const host = frame('#f-ink');
      host.style.setProperty('--glaphic-frame-ink', 'var(--glaphic-ink-brand-dark, #a6022a)');
      await host.updateComplete;
      const cap = host.shadowRoot!.querySelector('span.cap') as HTMLElement;
      expect(getComputedStyle(cap).color).toBe('rgb(166, 2, 42)');
    });
    await step('late corner: content assigned after mount lights its corner', async () => {
      const host = frame('#f-late');
      await host.updateComplete;
      const before = (host.shadowRoot!.querySelector('.frame-row[data-edge="bottom"]') as HTMLElement).getBoundingClientRect().height;
      expect(before).toBe(0);
      const late = document.createElement('span');
      late.setAttribute('slot', 'bottom-left');
      late.textContent = 'ASSIGNED LATE';
      host.appendChild(late);
      await new Promise((r) => setTimeout(r, 60));
      await host.updateComplete;
      const bottom = host.shadowRoot!.querySelector(`.frame-row[data-edge="bottom"]`) as HTMLElement;
      expect(bottom.getBoundingClientRect().height).toBeGreaterThan(0);
    });
    await step('physics: the frame paints nothing', async () => {
      for (const id of ['#f-one', '#f-all']) {
        const host = frame(id);
        expect(getComputedStyle(host).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(getComputedStyle(host).borderWidth).toBe('0px');
        expect(host.shadowRoot!.querySelector('mask, svg')).toBeFalsy();
      }
    });
  },
};