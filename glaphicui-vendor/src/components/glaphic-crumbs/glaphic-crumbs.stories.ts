import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-crumbs.js';
import './glaphic-crumb.js';

const meta: Meta = {
  title: 'Surfaces/Crumbs',
  component: 'glaphic-crumbs',
  tags: ['autodocs'],
  argTypes: {
    label: { name: 'label → the nav\'s accessible name', control: 'text' },
  },
};
export default meta;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** the trail — the design's artifact: Read / More / Books. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-crumbs>
      <glaphic-crumb href="#">Read</glaphic-crumb>
      <glaphic-crumb href="#">More</glaphic-crumb>
      <glaphic-crumb>Books</glaphic-crumb>
    </glaphic-crumbs>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A breadcrumbs trail is a wrapper plus crumbs: `glaphic-crumbs` slots `glaphic-crumb`s flush along one line, each crumb a 12px mono label riding the cool-600 voice and trailing the `///` separator — three 0.86px bars on a 2.395px pitch, skewed to lean right going up. The last crumb among the slotted siblings IS the current page automatically: it drops the separator, takes the ink-black cast and carries aria-current="page" — the read is DOM order, so no attribute is authored. Give an ancestor crumb `href` and its label renders as an anchor (underline on hover); the current crumb is normally href-less, because it\'s where you are, not where you go. The wrapper carries the nav semantics and takes `label` for its accessible name. Draft copy.',
      },
    },
  },
};

/** links — the ancestors navigate, the current page doesn't. */
export const Links: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-crumbs>
      <glaphic-crumb href="/read">Read</glaphic-crumb>
      <glaphic-crumb href="/read/more">More</glaphic-crumb>
      <glaphic-crumb>Books</glaphic-crumb>
    </glaphic-crumbs>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The same trail with the ancestors\' `href` set: each linked crumb\'s label is an anchor — underline under the glyphs on hover, the violet focus ring on keyboard focus — while the current page stays plain text. Knobs cascade from the page (`--glaphic-crumbs-size`, `-ancestor-ink`, `-current-ink`, `-separator-ink`, `-gap`, `-font`). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the trail paints (the mono label /
   cool-600 ink), the last-crumb cast (ink-black + aria-current), the
   href anchor, the separator bar geometry, and the suppressed last
   separator */
type CrumbHost = HTMLElement & { href: string };

export const CrumbsInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-crumbs id="trail">
      <glaphic-crumb id="crumb-1" href="/read">Read</glaphic-crumb>
      <glaphic-crumb id="crumb-2" href="/read/more">More</glaphic-crumb>
      <glaphic-crumb id="crumb-3">Books</glaphic-crumb>
    </glaphic-crumbs>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const crumb = (sel: string) => canvasElement.querySelector(sel) as CrumbHost;

    await step('trail: nav wrapper, 12px mono labels riding cool-600', async () => {
      const wrapper = canvasElement.querySelector('#trail') as HTMLElement;
      const nav = wrapper.shadowRoot!.querySelector('nav') as HTMLElement;
      expect(getComputedStyle(nav).display).toBe('flex');
      expect(nav.getAttribute('aria-label')).toBe('Breadcrumbs');
      const host = crumb('#crumb-2');
      const label = host.shadowRoot!.querySelector('.label') as HTMLElement;
      expect(getComputedStyle(label).fontFamily).toContain('IBM Plex Mono');
      expect(getComputedStyle(label).fontSize).toBe('12px');
      expect(getComputedStyle(label).color).toBe('rgb(104, 100, 116)');
    });
    await step('current page: the last crumb takes ink-black and aria-current, and drops its separator', async () => {
      const host = crumb('#crumb-3');
      expect(host.getAttribute('aria-current')).toBe('page');
      const label = (host.shadowRoot!.querySelector('.label') as HTMLElement);
      expect(getComputedStyle(label).color).toBe('rgb(13, 2, 33)');
      const lastSep = host.shadowRoot!.querySelector('.sep') as HTMLElement;
      expect(getComputedStyle(lastSep).display).toBe('none');
      /* the anchor crumbs carry no aria-current */
      expect(crumb('#crumb-1').getAttribute('aria-current')).toBeNull();
    });
    await step('the /// separator: three 0.86px bars on the 2.395px pitch, skewed', async () => {
      const host = crumb('#crumb-1');
      const sep = host.shadowRoot!.querySelector('.sep') as HTMLElement;
      expect(parseFloat(getComputedStyle(sep).width)).toBeCloseTo(5.654, 1);
      expect(parseFloat(getComputedStyle(sep).height)).toBeCloseTo(10.776, 1);
      expect(getComputedStyle(sep).transform).toContain('matrix');
      expect(parseFloat(getComputedStyle(sep).marginRight)).toBeCloseTo(6.09, 1);
      expect(host.getAttribute('aria-current')).toBeNull();
    });
    await step('href: the ancestor label is an anchor, the current page is not', async () => {
      const host = crumb('#crumb-2');
      expect(host.shadowRoot!.querySelector('a.label')).toBeTruthy();
      expect(crumb('#crumb-3').shadowRoot!.querySelector('a.label')).toBeFalsy();
    });
    await step('physics: no alpha, no masks, no glass', async () => {
      const host = crumb('#crumb-1');
      expect(getComputedStyle(host).opacity).toBe('1');
      expect((host.shadowRoot as ShadowRoot).querySelector('mask')).toBeFalsy();
    });
  },
};