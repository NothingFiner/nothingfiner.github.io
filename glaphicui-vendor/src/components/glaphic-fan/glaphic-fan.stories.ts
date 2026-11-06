import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-fan.js';

const meta: Meta = {
  title: 'Foundations/Typography/Fan',
  component: 'glaphic-fan',
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: 'inline-radio', options: ['click', 'hover'] },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:760px">${el}</div>`;

const plate = (el: TemplateResult) => html`
  <div style="padding:56px 40px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">${el}</div>`;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;

/* DOCS SECTION — hidden in the sidebar, untested prose. Draft copy. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${caption('BLOOM · CLICK — the whole ladder scales out together off one eased value (click again to collapse)')}
    ${plate(html`<glaphic-fan trigger="click"></glaphic-fan>`)}
    ${caption('BLOOM · HOVER — enter fans, leave collapses')}
    ${plate(html`<glaphic-fan trigger="hover"></glaphic-fan>`)}
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The FAN treatment (Eliot: "fan is fine but only the bloom hover one is good — the staged ones all look bad"): a fluro headline carrying an eight-deep ladder fanned symmetrically up and down — rings at ±18 ±36 ±54 ±72, ink weights stepping 0.64 / 0.56 / 0.48 / 0.40 outward, hard-edged, no blur, no alpha (the weights ride the same multiply layers the cast treatment builds). One reading ships — BLOOM: the ladder hangs tucked behind the core (the opaque fluro glyphs hide it exactly) and a single eased value scales every ring\'s offset 0→full together on the trigger; the trigger collapses it back through the same ease. The staged/spawn reading (copies materializing one ring at a time) was killed with the lab — it ships nowhere. The click trigger toggles fan-out/fan-in; the hover trigger fans on entry and collapses on leave. COLOR FLAG: the frame\'s shadow ink reads #17140E, which is not a token — the layers derive from --glaphic-ink-black #0d0221; say the word and the literal joins. Tier-2: --glaphic-fan-core-ink (the headline ink) and -size. The host paints nothing — seat it on the surface you want it to read against. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the bloom ladder anatomy, both triggers
   and the collapse-back pose */
export const FanInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div id="fan-rest" style="display:inline-block;width:120px;height:80px"></div>
    <div style="padding:24px;background:var(--glaphic-neutral-paper-elevated, #f9faf4)">
      <glaphic-fan id="fan-click" trigger="click"></glaphic-fan>
      <glaphic-fan id="fan-hover" trigger="hover"></glaphic-fan>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* the fan's trigger rides real pointer flows — CDP-backed moves
       (pointerenter/leave are browser-computed, synthetic dispatch
       would miss the leave's hover target change) */
    const { userEvent: realPointer } = await import('vitest/browser');
    /* poll for the animated pose to settle — bloom runs on wall
       clock, ~500ms per direction */
    const settle = async (probe: () => boolean, tries = 90) => {
      for (let i = 0; i < tries; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(r));
        if (probe()) return true;
      }
      return false;
    };
    /* the fan's own dy read: the browser's CSSOM drops the written
       ".00" (toFixed(2) '72.00px' serializes back '72px'), so read
       the number, not the string */
    const dyOf = (shade: HTMLElement) =>
      parseFloat((shade.style.transform.match(/-?\d+(?:\.\d+)?/) ?? ['0'])[0]);
    await step('anatomy: eight shades in four rings, two per ring, up then down', async () => {
      const host = canvasElement.querySelector('#fan-click') as HTMLElement;
      const shades = [...host.querySelectorAll<HTMLElement>('.shade')];
      expect(shades.length).toBe(8);
      expect(shades.map((s) => s.dataset.up).filter((u, i) => i % 2 === 0).every((u) => u === 'up')).toBe(true);
      expect(shades.map((s) => s.dataset.ring)).toEqual(['0', '0', '1', '1', '2', '2', '3', '3']);
      // core reads fluro
      expect(getComputedStyle(host.querySelector('.core')!).color).toBe('rgb(20, 241, 200)');
    });
    await step('rest pose: the ladder hangs tucked (unpainted = dy 0)', async () => {
      const host = canvasElement.querySelector('#fan-click') as HTMLElement;
      for (const shade of host.querySelectorAll<HTMLElement>('.shade'))
        expect(dyOf(shade)).toBe(0); // unpainted inline transform = the tuck
    });
    await step('click: the bloom stretches every ring out, the far pair to ±72', async () => {
      const host = canvasElement.querySelector('#fan-click') as HTMLElement;
      (host.querySelector('.core') as HTMLElement).click();
      await settle(() => dyOf([...host.querySelectorAll<HTMLElement>('.shade')][6]) === -72);
      const [up3, down3] = [...host.querySelectorAll<HTMLElement>('.shade')].filter((s) => s.dataset.ring === '3');
      expect(dyOf(up3)).toBe(-72);
      expect(dyOf(down3)).toBe(72);
      const nearest = [...host.querySelectorAll<HTMLElement>('.shade')][0];
      expect(dyOf(nearest)).toBe(-18);
    });
    await step('click again: the collapse returns every ring to the tuck', async () => {
      const host = canvasElement.querySelector('#fan-click') as HTMLElement;
      (host.querySelector('.core') as HTMLElement).click();
      await settle(() => dyOf([...host.querySelectorAll<HTMLElement>('.shade')][0]) === 0);
    });
    await step('hover trigger: entry fans, leaving to a sibling collapses', async () => {
      const host = canvasElement.querySelector('#fan-hover') as HTMLElement;
      const rest = canvasElement.querySelector('#fan-rest') as HTMLElement;
      const seen: string[] = [];
      for (const name of ['pointerenter', 'pointermove', 'pointerover', 'mouseenter', 'mouseover']) {
        host.addEventListener(name, () => seen.push(name));
      }
      await realPointer.hover(host);
      const ok = await settle(() => dyOf([...host.querySelectorAll<HTMLElement>('.shade')][6]) === -72);
      expect(ok, 'hover entry never fanned the ladder to -72').toBe(true);
      await realPointer.hover(rest);
      const collapsed = await settle(() => dyOf([...host.querySelectorAll<HTMLElement>('.shade')][6]) === 0);
      expect(collapsed, 'the leave never collapsed the ladder to the tuck').toBe(true);
    });
    await step('shades never eat the pointer and stay out of the AX tree', async () => {
      const host = canvasElement.querySelector('#fan-click') as HTMLElement;
      for (const shade of host.querySelectorAll<HTMLElement>('.shade')) {
        expect(getComputedStyle(shade).pointerEvents).toBe('none');
        expect(shade.getAttribute('aria-hidden')).toBe('true');
      }
    });
  },
};