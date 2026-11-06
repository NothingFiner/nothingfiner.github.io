import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-accordion.js';
import './glaphic-accordion-item.js';

const meta: Meta = {
  title: 'Surfaces/Accordion',
  component: 'glaphic-accordion',
  tags: ['autodocs'],
  argTypes: {
    multi: { name: 'multi → every row keeps its own state', control: 'boolean' },
  },
};
export default meta;

const copy = (text: string) => html`<p style="margin:0">${text}</p>`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** the closed stack — the design's first artifact. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      <glaphic-accordion>
        <glaphic-accordion-item label="Baby 1">${copy('The archive keeps three prints of the reveal — the exposing sheet, the contact card, and the wide. Ask at the desk after four.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 2">${copy('Labels ride the mono voice at the row’s left edge; the hollow diamond holds its point either way — the pale pair of shadows on the label is the open tell.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 3">${copy('The wide is the last to print: the sheet sits in the developer rack overnight and the grain settles by morning.')}</glaphic-accordion-item>
      </glaphic-accordion>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'An accordion is a wrapper plus rows: `glaphic-accordion` stacks `glaphic-accordion-item`s flush over one cool-200 hairline apiece (the first row tops itself, the last ends on the stack radius), each row a paper fill with the label in the mono cool-600 voice at the left edge and the hollow 10px diamond at the right — static in both states, because the open tell is the label’s pair of hard 1px shadows (warm-200 on the right of the glyphs, warm-300 on the left), not a rotated caret. Every row is a multiply layer over the page; the `multiply` presence attribute on a row toggles it (on by default — the band pattern). Draft copy.',
      },
    },
  },
};

/** the open row — the design's exploded middle artifact. */
export const Open: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      <glaphic-accordion>
        <glaphic-accordion-item label="Baby 1">${copy('The archive keeps three prints of the reveal — the exposing sheet, the contact card, and the wide. Ask at the desk after four.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 2" open>${copy('Opening a row lifts it from the stack: sixteen pixels of ground above and below, the warm-200 rule at the body’s top edge, and the copy dropping to the ink-black cast.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 3">${copy('The wide is the last to print: the sheet sits in the developer rack overnight and the grain settles by morning.')}</glaphic-accordion-item>
      </glaphic-accordion>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The open row (the `open` attribute) lifts out of the stack — 16px of ground above and below, confirmed intentional — carrying its body behind a warm-200 top rule: the slotted copy reads in the page’s body voice with the ink-black cast. The header keeps its paper and its ink; only the shadow pair marks it open. Single-open is the default — the wrapper closes every other row when one opens — and `multi` on the wrapper opts out. Body copy here is drafted placeholder prose; the slot takes anything. Draft copy.',
      },
    },
  },
};

/** multi mode — the wrapper opt-out. */
export const Multi: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:420px">
      <glaphic-accordion multi>
        <glaphic-accordion-item label="Baby 1" open>${copy('In multi mode every row keeps its own state — open rows beside open rows share the seam and stay flush.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 2">${copy('The archive keeps three prints of the reveal — the exposing sheet, the contact card, and the wide.')}</glaphic-accordion-item>
        <glaphic-accordion-item label="Baby 3" open>${copy('The wide is the last to print: the sheet sits in the developer rack overnight and the grain settles by morning.')}</glaphic-accordion-item>
      </glaphic-accordion>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The wrapper’s `multi` presence attribute opts out of the single-open hold: every row toggles independently. Adjacent open rows collapse into one shared 16px seam (CSS margin collapse takes the max, not the sum). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the closed-stack paints (paper fill /
   cool-200 hairlines / outer radius), the mono label + diamond, the
   open read (gaps, body rule, ink-black copy, shadow pair), the
   single-open hold and the multi opt-out, and the multiply toggle */
type RowHost = HTMLElement & { open: boolean; multiply: boolean; updateComplete: Promise<boolean> };
type AccordionHost = HTMLElement & { multi: boolean };

export const AccordionInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;gap:8px;max-width:420px">
      <glaphic-accordion id="acc">
        <glaphic-accordion-item id="row-1" label="Baby 1">${copy('First row’s body copy reads three lines in the archive voice.')}</glaphic-accordion-item>
        <glaphic-accordion-item id="row-2" label="Baby 2">${copy('Second row’s body copy reads behind the warm-200 rule.')}</glaphic-accordion-item>
        <glaphic-accordion-item id="row-3" label="Baby 3">${copy('Third row’s body copy.')}</glaphic-accordion-item>
      </glaphic-accordion>
      <glaphic-accordion id="acc-multi" multi>
        <glaphic-accordion-item id="mrow-1" label="Baby 1">${copy('Multi first.')}</glaphic-accordion-item>
        <glaphic-accordion-item id="mrow-2" label="Baby 2">${copy('Multi second.')}</glaphic-accordion-item>
      </glaphic-accordion>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const row = (sel: string) => canvasElement.querySelector(sel) as RowHost;
    const shadow = (host: RowHost, sel: string) => host.shadowRoot!.querySelector(sel) as HTMLElement;
    /* the open/close transitions ride 300ms — settle past them */
    const settle = (ms = 420) => new Promise((done) => setTimeout(done, ms));
    const clickHead = async (sel: string) => {
      const host = row(sel);
      shadow(host, '.head').click();
      await host.updateComplete;
    };

    await step('closed stack: paper rows over cool-200 hairlines, the ends rounded', async () => {
      const first = row('#row-1');
      expect(getComputedStyle(first).backgroundColor).toBe('rgb(242, 245, 235)');
      expect(getComputedStyle(first).borderTopColor).toBe('rgb(213, 210, 222)');
      expect(getComputedStyle(first).borderTopWidth).toBe('1px');
      const middle = row('#row-2');
      expect(getComputedStyle(middle).borderBottomColor).toBe('rgb(213, 210, 222)');
      expect(getComputedStyle(middle).borderBottomWidth).toBe('1px');
      const last = row('#row-3');
      expect(getComputedStyle(last).borderBottomWidth).toBe('0px');
      expect(getComputedStyle(first).borderRadius).toContain('2px 2px');
      expect(getComputedStyle(first).borderRadius).toContain('0px 0px');
      expect(getComputedStyle(last).borderRadius).toContain('0px 2px');
    });
    await step('closed row: mono label at cool-600, 44 tall, the hollow 10px diamond', async () => {
      const host = row('#row-2');
      const head = shadow(host, '.head');
      const label = shadow(host, '.head-label');
      expect(getComputedStyle(head).fontFamily).toContain('IBM Plex Mono');
      expect(getComputedStyle(head).fontSize).toBe('16px');
      expect(getComputedStyle(head).color).toBe('rgb(104, 100, 116)');
      expect(head.getAttribute('aria-expanded')).toBe('false');
      expect(getComputedStyle(host).height).toBe('45px'); // 44 header + the bottom hairline
      const diamond = shadow(host, '.diamond');
      expect(getComputedStyle(diamond).width).toBe('10px');
      expect(getComputedStyle(diamond).borderWidth).toBe('1px');
      expect(getComputedStyle(diamond).borderColor).toBe('rgb(104, 100, 116)');
      expect(label.getAttribute('aria-hidden')).toBeNull();
      expect(label.textContent).toBe('Baby 2');
    });
    await step('open: the row lifts 16/16, the body rule + ink-black copy show, the label takes its shadow pair', async () => {
      const host = row('#row-2');
      await clickHead('#row-2');
      await settle();
      const head = shadow(host, '.head');
      expect(head.getAttribute('aria-expanded')).toBe('true');
      expect(getComputedStyle(host).marginTop).toBe('16px');
      expect(getComputedStyle(host).marginBottom).toBe('16px');
      const body = shadow(host, '.body');
      expect(getComputedStyle(body).visibility).toBe('visible');
      const panel = shadow(host, '.panel');
      expect(getComputedStyle(panel).borderTopColor).toBe('rgb(222, 226, 211)');
      const copy2 = canvasElement.querySelector('#row-2 p') as HTMLElement;
      expect(getComputedStyle(copy2).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(copy2).fontSize).toBe('16px');
      expect(getComputedStyle(copy2).lineHeight).toBe('19.04px');
      const label = shadow(host, '.head-label');
      const shadows = getComputedStyle(label).textShadow;
      expect(shadows).toContain('rgb(222, 226, 211) 1px 0px');
      expect(shadows).toContain('rgb(200, 205, 189) -1px 0px');
      /* the open row keeps the paper — the fill rides the item host,
         the header button itself paints nothing */
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(242, 245, 235)');
    });
    await step('single-open: opening another row closes the last (default)', async () => {
      await clickHead('#row-1');
      await settle();
      const first = row('#row-1');
      const second = row('#row-2');
      expect(first.shadowRoot!.querySelector('.head')!.getAttribute('aria-expanded')).toBe('true');
      expect(second.shadowRoot!.querySelector('.head')!.getAttribute('aria-expanded')).toBe('false');
      expect(getComputedStyle(second).marginTop).toBe('0px');
      /* the wrapper holds the grip — the accordion itself carries multi off */
      expect(row('#acc').hasAttribute('multi')).toBe(false);
    });
    await step('multi: rows keep their own state', async () => {
      const wrapper = canvasElement.querySelector('#acc-multi') as AccordionHost;
      await clickHead('#mrow-1');
      await clickHead('#mrow-2');
      await settle();
      expect(wrapper.hasAttribute('multi')).toBe(true);
      for (const sel of ['#mrow-1', '#mrow-2']) {
        const host = row(sel);
        expect(host.shadowRoot!.querySelector('.head')!.getAttribute('aria-expanded')).toBe('true');
      }
    });
    await step('multiply: the row blends, the toggle drops flat', async () => {
      const host = row('#row-3');
      expect(host.hasAttribute('multiply')).toBe(true);
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
      host.multiply = false;
      await host.updateComplete;
      expect(host.hasAttribute('multiply')).toBe(false);
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
      host.multiply = true;
      await host.updateComplete;
    });
    await step('physics: no alpha, no masks, no glass', async () => {
      const host = row('#row-2');
      expect(getComputedStyle(host).opacity).toBe('1');
      expect(getComputedStyle(host).backdropFilter).toBe('none');
      expect((host.shadowRoot as ShadowRoot).querySelector('svg, mask')).toBeFalsy();
    });
  },
};