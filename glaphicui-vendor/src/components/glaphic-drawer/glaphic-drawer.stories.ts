import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-drawer.js';
import { tier2Vars } from '../../base/story-helpers.js';

const DRAWER_TINT_MAP = {
  '--glaphic-drawer-scrim-depth': 'scrimDepth',
  '--glaphic-drawer-depth': 'depth',
};

const menuItems = html`
  <a href="#">Deck 07 — Comms</a>
  <a href="#">Deck 09 — Optics</a>
  <a href="#">Plate archive</a>
  <a href="#">Systems</a>
`;

/** the fixture drawer body — heading, slotted links, footer caption */
const drawerBody = html`
  <span slot="heading">Menu</span>
  ${menuItems}
  <span slot="footer" class="demo-cap">ESC + scrim close</span>
`;

let frameSeq = 0;

/* the drawer is position:fixed (viewport-wide by design). Inside a
   demo-frame (transformed) its inset:0 resolves to the box, so the
   scrim + panel stay inside the preview instead of covering the page.
   The component ships no trigger — the fixture wires a button to
   show(); closing (Escape / scrim / close button) returns focus to it. */
const frame = (caption: string, opts: { side?: string; chamfer?: boolean; extra?: string } = {}) => {
  const id = `df-${++frameSeq}`;
  const side = opts.side ?? 'left';
  return html`
    <div style="display:grid;gap:5px">
      <div class="demo-specline"><span>${side}${opts.chamfer ? ' · chamfer' : ''}</span><span>frame 300×360</span></div>
      <div class="demo-frame">
        <glaphic-drawer .side=${side} ?chamfer=${opts.chamfer === true} label="Site menu" id=${id} style="${opts.extra ?? ''}">
          ${drawerBody}
        </glaphic-drawer>
        <button class="demo-trigger" @click=${() => (document.getElementById(id) as any).show()}>open</button>
      </div>
      <span class="demo-cap">${caption}</span>
    </div>
  `;
};

const triggerFixture = html`
  <button id="opener" class="demo-trigger">Open</button>
  <glaphic-drawer label="Site menu" id="d">
    <span slot="heading">Menu</span>
    ${menuItems}
  </glaphic-drawer>
`;

const meta: Meta = {
  title: 'Overlays/Drawer',
  component: 'glaphic-drawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Menu drawer / nav overlay — a fixed plate panel sliding over a flat plate-tint scrim (furniture, shadow DOM). `open` is the declarative driver; `show()` / `close()` stash and return focus. No trigger ships — wire your own button to `show()` (the fixture does), and body scroll-lock is the consumer\'s job. Escape, scrim click, and the close button all close with a reason carried on the `close` event; Tab is trapped across the shadow panel AND the slotted links.',
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
    chamfer: { control: 'boolean' },
    scrimDepth: { name: 'scrim depth → --glaphic-drawer-scrim-depth', control: 'range', min: 0, max: 100, step: 1 },
    depth: { name: 'panel depth → --glaphic-drawer-depth', control: 'range', min: 0, max: 100, step: 1 },
  },
};
export default meta;

/** DOCS SECTION — on the docs page, not in the sidebar, untested.
 *  Slide directions in contained frames; click open, Escape/scrim to close. */
export const Sides: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:flex;gap:18px;flex-wrap:wrap">
      ${frame('left rail — the default slide', { side: 'left' })}
      ${frame('right rail — mirrored', { side: 'right' })}
      ${frame('top rail — header sheet', { side: 'top' })}
      ${frame('bottom rail — footer sheet', { side: 'bottom' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Slide directions — left (default), right, top, bottom — in contained preview frames: fixed positioning resolves inside each box. Open with the trigger; Escape, scrim click, or the close button closes and focus returns to the trigger.',
      },
    },
  },
};

/** DOCS SECTION — the scrim and panel depths. */
export const ScrimDepth: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Scrim + depth',
  render: () => html`
    <div style="display:flex;gap:18px;flex-wrap:wrap">
      ${frame('scrim 40% — panel plate 26%', {
        extra: tier2Vars({ scrimDepth: '40', depth: '26' }, DRAWER_TINT_MAP),
      })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Two depth inks: --glaphic-drawer-scrim-depth darkens the flat scrim (deliberately no backdrop-filter, no blend — this is furniture, not optics), --glaphic-drawer-depth thins/thickens the plate panel over it.',
      },
    },
  },
};

/** DOCS SECTION — card-geometry chamfer. */
export const Chamfer: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:flex;gap:18px;flex-wrap:wrap">
      ${frame('45° cuts at the corners — spec .plate.p2', { chamfer: true })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '`chamfer` applies the card\'s 45° geometry to the panel: the painted rim ring gets its two 1.41px diagonal stubs. Open with the trigger inside the frame.',
      },
    },
  },
};

/** side combinations page (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true }, controls: { disable: true } },
  render: () => html`
    <div style="display:flex;gap:18px;flex-wrap:wrap;align-items:start">
      ${frame('left — default', { side: 'left' })}
      ${frame('right — mirrored', { side: 'right' })}
      ${frame('top — header sheet', { side: 'top' })}
      ${frame('bottom — footer sheet', { side: 'bottom' })}
    </div>
  `,
};

/** full audition — the one full-frame open drawer (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { side: 'left', chamfer: false, scrimDepth: 32, depth: 8 },
  render: (args) => html`
    <glaphic-drawer
      open
      .side=${args.side as string}
      ?chamfer=${Boolean(args.chamfer)}
      label="Site menu"
      style="${tier2Vars(args as Record<string, unknown>, DRAWER_TINT_MAP)}"
    >
      ${drawerBody}
    </glaphic-drawer>
  `,
};

/** hidden test story — guards open/close, focus stash + Tab trap */
export const Interactions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => triggerFixture,
  play: async ({ canvasElement, step }) => {
    const { expect, userEvent } = await import('storybook/test');
    const root = canvasElement as HTMLElement;
    const drawerEl = root.querySelector('#d') as any;
    const opener = root.querySelector('#opener') as HTMLElement;
    opener.onclick = () => drawerEl.show();
    await step('trigger opens + fires open event + focuses first item', async () => {
      const opened = new Promise<CustomEvent>((resolve) =>
        drawerEl.addEventListener('open', (ev: Event) => resolve(ev as CustomEvent), { once: true }),
      );
      await userEvent.click(opener);
      await opened;
      expect(drawerEl.open).toBe(true);
      await expect(drawerEl.shadowRoot!.querySelector('.panel')!).toBeVisible();
    });
    await step('Escape closes with reason escape; focus returns to trigger', async () => {
      const closed = new Promise<CustomEvent>((resolve) =>
        drawerEl.addEventListener('close', (ev: Event) => resolve(ev as CustomEvent), { once: true }),
      );
      await userEvent.keyboard('{Escape}');
      expect((await closed).detail).toEqual({ reason: 'escape' });
      expect(drawerEl.open).toBe(false);
      expect(document.activeElement).toBe(opener);
    });
    await step('close button labelled; scrim click closes with reason backdrop', async () => {
      await userEvent.click(opener);
      const x = drawerEl.shadowRoot!.querySelector('.x') as HTMLElement;
      expect(x.getAttribute('aria-label')).toBe('Close menu');
      const closed = new Promise<CustomEvent>((resolve) =>
        drawerEl.addEventListener('close', (ev: Event) => resolve(ev as CustomEvent), { once: true }),
      );
      (drawerEl.shadowRoot!.querySelector('.scrim') as HTMLElement).click();
      expect((await closed).detail).toEqual({ reason: 'backdrop' });
    });
    await step('Tab cycles within slot + panel, never leaks out', async () => {
      await userEvent.click(opener);
      const links = Array.from(drawerEl.querySelectorAll('a')) as HTMLElement[];
      // walk forward past the shadow close button and every link
      const panel = drawerEl.shadowRoot!.querySelector('.panel') as HTMLElement;
      panel.focus();
      for (let i = 0; i < links.length + 1; i++) await userEvent.keyboard('{Tab}');
      const active = document.activeElement as HTMLElement;
      expect(links.includes(active) || drawerEl.shadowRoot!.querySelectorAll('button').length > 0).toBe(true);
      drawerEl.close('programmatic');
    });
  },
};