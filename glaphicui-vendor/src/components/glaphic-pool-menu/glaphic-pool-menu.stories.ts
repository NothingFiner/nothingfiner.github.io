import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-pool-menu.js';

const meta: Meta = {
  title: 'Overlays/Pool Menu',
  component: 'glaphic-pool-menu',
  tags: ['autodocs'],
  argTypes: {
    label: { name: 'label → the pool trigger’s accessible name', control: 'text' },
    open: { name: 'open → the panel plates grown (reflect)', control: 'boolean' },
  },
};
export default meta;

/* DOCS SECTIONS — hidden in the sidebar. Prose is a draft: the
   section copy is reviewed/edited with the user before merge. */

/** pool menu — the trigger plate, closed. Expands on toggle. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-pool-menu label="Menu">
      <a href="/works">Works</a>
      <a href="/about">About</a>
      <a href="/contacts">Let's talk</a>
    </glaphic-pool-menu>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The pool menu is the plate-stack navigation from the design: a small trigger plate — ink-brand-dark in front, the ink-brand-fluro twin 4px behind and two paper lines on it — that expands, anchored at its top-left corner, into the panel: the same film print at panel scale, both plates at panel size with the twin offset 8px behind (`--glaphic-pool-menu-panel-offset-inline` / `-block`) — one dark plate, the red’s sliver on the anti-growth side, the fluro’s fringe on the growth side, the crossed X inside the printed overlap. The plates print multiply — the overlap reads as the red × fluro ink, on the page too. The entries print ABOVE the plates, unblended paper matching the X. Entries are light children — plain anchors or buttons; the anchor navigation stays native. Toggle: the trigger is one persistent button whose plate patch stays put as the panel grows, so the two lines shift into an X and the same button closes (aria-expanded rides it the whole time); the entries start past the patch strip, left-aligned below the X in every anchor — the crossed X stays inside the plates’ printed overlap. Escape, a click outside, and activating an entry close the panel. The plates grow over `-motion` (0.35s cubic) — never a fade; the entries slide in from the right with a 40ms stagger. Reduced motion: plates at size, lines crossed, entries in place. Tier-2: `--glaphic-pool-menu-surface` / `-back-surface` / `-line-ink` / `-line-size` / `-line-width` / `-line-pitch` / `-trigger-width` / `-trigger-height` / `-trigger-offset` / `-panel-width` / `-panel-height` / `-panel-offset-inline` / `-panel-offset-block` / `-item-ink` / `-item-hover-ink` / `-item-size` / `-item-gap` / `-item-start` / `-item-inset` / `-item-slide` / `-motion` / `-stagger`. Draft copy.',
      },
    },
  },
};

/** pool menu — the panel pose, open. */
export const Open: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-pool-menu open label="Menu">
      <a href="/works">Works</a>
      <a href="/about">About</a>
      <a href="/contacts">Let's talk</a>
    </glaphic-pool-menu>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The open pose (the `open` attribute): the film print at panel scale — both plates at panel size, one dark plate with the twin’s fringe on the growth side — the lines crossed into the X on the trigger’s patch (the close control), the entries printed above the plate in the X’s paper, starting past the patch strip. Draft copy.',
      },
    },
  },
};

/** pool menu — the open-up pose: anchored bottom-right. */
export const OpenUp: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div
      style="min-height:560px;display:flex;justify-content:flex-end;align-items:flex-end;padding:24px 24px 40px"
    >
      <glaphic-pool-menu open anchor="bottom-right" label="Menu">
        <a href="/works">Works</a>
        <a href="/about">About</a>
        <a href="/contacts">Let's talk</a>
      </glaphic-pool-menu>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The open-up pose (`anchor="bottom-right"`): the same film print mirrored — the panel opens leftward and upward, the twin’s fringe pokes 8px past it on the left and top, the crossed X rides the patch’s bottom-right corner, and the entries keep their LEFT alignment (Eliot: left on the up-openers too — the items always line up on the left). Only the open pose mirrors — the closed trigger holds the plain down-right arrangement in every corner, the light plate at the bottom just like the down-openers (Eliot: it looks better). The host belongs at the corner the panel opens away from — an end-anchored trigger in a footer grows into the room. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the plate stack's paints, the toggle's
   aria, the panel pose, the X morph, the items' slide + stagger,
   the wrapper-held hover, select/close, and the back-out paths */

export const PoolMenuInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-pool-menu id="pool-1" label="Menu">
      <a id="item-a" href="/works">Works</a>
      <a id="item-b" href="/about">About</a>
      <a id="item-c" href="/contacts">Let's talk</a>
    </glaphic-pool-menu>
    <glaphic-pool-menu id="pool-br" anchor="bottom-right" label="Menu">
      <a id="item-br-a" href="/works">Works</a>
      <a id="item-br-b" href="/about">About</a>
      <a id="item-br-c" href="/contacts">Let's talk</a>
    </glaphic-pool-menu>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const menu = canvasElement.querySelector('#pool-1') as HTMLElement & {
      label: string;
      shadowRoot: ShadowRoot;
      requestUpdate(): void;
    };
    const shadow = () => menu.shadowRoot!;
    const settle = async (probe: () => boolean, tries = 80): Promise<boolean> => {
      for (let i = 0; i < tries; i++) {
        if (probe()) return true;
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
      }
      return false;
    };
    /* the entries carry real hrefs — swallow their navigation */
    for (const a of canvasElement.querySelectorAll('a')) {
      a.addEventListener('click', (e) => e.preventDefault());
    }
    const trigger = () => shadow().querySelector('.trigger') as HTMLButtonElement;
    const bars = () => Array.from(shadow().querySelectorAll('.lines i')) as HTMLElement[];

    await step('trigger chrome: plate 65×48, the fluro twin 4px behind, two paper bars', async () => {
      await settle(() => trigger() !== null);
      const front = getComputedStyle(shadow().querySelector('.plate-front') as HTMLElement);
      const back = getComputedStyle(shadow().querySelector('.plate-back') as HTMLElement);
      expect(front.width).toBe('65px');
      expect(front.height).toBe('48px');
      expect(front.backgroundColor).toBe('rgb(166, 2, 42)');
      expect(back.left).toBe('4px');
      expect(back.top).toBe('4px');
      expect(back.backgroundColor).toBe('rgb(20, 241, 200)');
      const [one, two] = bars();
      const ocs = getComputedStyle(one);
      expect(ocs.width).toBe('44px');
      expect(ocs.height).toBe('4px');
      expect(ocs.backgroundColor).toBe('rgb(242, 245, 235)');
      /* the bar pair pitches 10px apart (the design's line pitch) */
      const r1 = one.getBoundingClientRect();
      const r2 = two.getBoundingClientRect();
      expect(r2.top - r1.top).toBeCloseTo(10, 0);
      expect(ocs.transform).toBe('none');
    });

    /* the slide and bar-ride transitions approach their end value
       asymptotically (the bezier tail computes to e-9px residues) —
       settle on a round-off threshold, not an exact string, or the
       probe loses the race one frame before a transition lands */
    const landed = (el: HTMLElement) =>
      Math.abs(parseFloat(getComputedStyle(el).translate) || 0) < 0.01;
    await step('hover: the plates’ misregistration flips (the film-button read)', async () => {
      const front = shadow().querySelector('.plate-front') as HTMLElement;
      const back = shadow().querySelector('.plate-back') as HTMLElement;
      menu.setAttribute('force-hover', '');
      await settle(() => getComputedStyle(front).translate === '4px 4px');
      expect(getComputedStyle(front).translate).toBe('4px 4px');
      expect(getComputedStyle(back).translate).toBe('-4px -4px');
      /* the bars ride 2px toward the hovered corner too */
      const lines = shadow().querySelector('.lines') as HTMLElement;
      expect(getComputedStyle(lines).translate).toBe('2px 2px');
      menu.removeAttribute('force-hover');
      await settle(
        () =>
          getComputedStyle(front).translate === 'none' &&
          landed(shadow().querySelector('.lines') as HTMLElement),
      );
      expect(getComputedStyle(front).translate).toBe('none');
      expect(landed(shadow().querySelector('.lines') as HTMLElement)).toBe(true);
      /* the open pose holds still under the pointer */
      menu.setAttribute('force-hover', '');
      trigger().click();
      await settle(() => menu.hasAttribute('open') && landed(lines));
      expect(getComputedStyle(front).translate).toBe('none');
      expect(landed(lines)).toBe(true);
      menu.removeAttribute('force-hover');
      trigger().click();
      await settle(() => !menu.hasAttribute('open'));
    });

    await step('toggle: the trigger opens, aria-expanded rides it, change fires', async () => {
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      let detail: { index: number; open: boolean } | null = null;
      menu.addEventListener('change', (e) => (detail = (e as CustomEvent).detail));
      trigger().click();
      await settle(() => menu.hasAttribute('open'));
      expect(menu.hasAttribute('open')).toBe(true);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect((detail as unknown as { index: number; open: boolean } | null)!.open).toBe(true);
      expect((detail as unknown as { index: number } | null)!.index).toBe(-1);
    });

    await step('panel pose: the film print at panel scale, twin 4/4 behind', async () => {
      /* the panel measures itself to its entries — the widest entry
         plus the sheet's insets (the patch strip on the patch side,
         the twin's fringe on the growth sides) and paddings — so the
         pose's box is asserted as the sum, not a hardcoded number */
      const items = ['item-a', 'item-b', 'item-c'].map(
        (id) => canvasElement.querySelector(`#${id}`) as HTMLElement,
      );
      const itemsEl = shadow().querySelector('.items') as HTMLElement;
      const cs = getComputedStyle(itemsEl);
      const width =
        Math.max(...items.map((el) => el.offsetWidth)) +
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.left) +
        parseFloat(cs.right);
      const height =
        parseFloat(cs.top) +
        parseFloat(cs.bottom) +
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        items.reduce((sum, el) => sum + el.offsetHeight, 0) +
        (items.length - 1) * parseFloat(cs.rowGap);
      const stack = shadow().querySelector('.stack') as HTMLElement;
      /* the stack carries the twin's open peek (+8/+8, the film
         read) on top of the measured panel box; the plates are BOTH
         the panel box — the twin offset 8/8 behind the front along
         the growth direction */
      await settle(
        () =>
          getComputedStyle(stack).width === `${width + 8}px` &&
          getComputedStyle(stack).height === `${height + 8}px`,
      );
      const scs = getComputedStyle(stack);
      expect(scs.width).toBe(`${width + 8}px`);
      expect(scs.height).toBe(`${height + 8}px`);
      /* the twin's left/top ride the same 0.35s ease (4px → 8px) —
         their bezier tail can read an e-8px residue one frame past
         the stack's landing, so settle on a round-off threshold */
      const bofc = () => getComputedStyle(shadow().querySelector('.plate-back') as HTMLElement);
      await settle(
        () =>
          Math.abs(parseFloat(bofc().left) - 8) < 0.01 && Math.abs(parseFloat(bofc().top) - 8) < 0.01,
      );
      expect(Math.abs(parseFloat(bofc().left) - 8)).toBeLessThan(0.01);
      expect(Math.abs(parseFloat(bofc().top) - 8)).toBeLessThan(0.01);
      const front = getComputedStyle(shadow().querySelector('.plate-front') as HTMLElement);
      expect(front.left).toBe('0px');
      expect(front.width).toBe(`${width}px`);
      expect(getComputedStyle(itemsEl).visibility).toBe('visible');
    });

    await step('author pin: -panel-width/height beat the measurement', async () => {
      menu.style.setProperty('--glaphic-pool-menu-panel-width', '200px');
      menu.style.setProperty('--glaphic-pool-menu-panel-height', '300px');
      menu.requestUpdate();
      await settle(
        () =>
          getComputedStyle(shadow().querySelector('.stack') as HTMLElement).width === '208px' &&
          getComputedStyle(shadow().querySelector('.stack') as HTMLElement).height === '308px',
      );
      const stack = getComputedStyle(shadow().querySelector('.stack') as HTMLElement);
      expect(stack.width).toBe('208px');
      expect(stack.height).toBe('308px');
      menu.style.removeProperty('--glaphic-pool-menu-panel-width');
      menu.style.removeProperty('--glaphic-pool-menu-panel-height');
      menu.requestUpdate();
    });

    await step('the X: the bars crossed at the pair’s center', async () => {
      const [one, two] = bars();
      const t1 = getComputedStyle(one).transform;
      const t2 = getComputedStyle(two).transform;
      expect(t1).not.toBe('none');
      expect(t2).not.toBe('none');
      /* rotate(±45°) reads the 2×2 part as cos = ±0.707… */
      const a1 = parseFloat(t1.slice(t1.indexOf('(') + 1));
      expect(a1).toBeCloseTo(0.7071, 3);
      const a2 = parseFloat(t2.slice(t2.indexOf('(') + 1));
      expect(a2).toBeCloseTo(0.7071, 3);
      /* the cross: both bars' centers meet at the pair's midpoint */
      const r1 = one.getBoundingClientRect();
      const r2 = two.getBoundingClientRect();
      expect(r1.x + r1.width / 2).toBeCloseTo((r2.x + r2.width / 2), 0);
      expect(r1.y + r1.height / 2).toBeCloseTo((r2.y + r2.height / 2), 0);
      /* closing uncrosses — the attribute and the bars' own
         transition both have to have landed before the assert */
      trigger().click();
      await settle(() => !menu.hasAttribute('open') && getComputedStyle(one).transform === 'none');
      expect(getComputedStyle(one).transform).toBe('none');
      trigger().click();
      await settle(() => menu.hasAttribute('open'));
    });

    await step('items: paper 25px display type, slid in, staggered 40ms apart', async () => {
      const itemB = canvasElement.querySelector('#item-b') as HTMLElement;
      const itemC = canvasElement.querySelector('#item-c') as HTMLElement;
      /* the slide-in is in flight right after the open — settle it */
      await settle(() => landed(itemB) && landed(itemC));
      const cs = getComputedStyle(itemB);
      expect(cs.color).toBe('rgb(242, 245, 235)');
      expect(cs.fontSize).toBe('25px');
      expect(landed(itemB)).toBe(true);
      expect(getComputedStyle(itemC).transitionDelay).toBe('0.08s');
    });

    await step('hover: the entry under the pointer flips to the fluro ink', async () => {
      const itemB = canvasElement.querySelector('#item-b') as HTMLElement;
      itemB.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, composed: true }));
      expect(itemB.hasAttribute('data-hover')).toBe(true);
      expect(getComputedStyle(itemB).color).toBe('rgb(20, 241, 200)');
      itemB.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, composed: true }));
      expect(itemB.hasAttribute('data-hover')).toBe(false);
      expect(getComputedStyle(itemB).color).toBe('rgb(242, 245, 235)');
    });

    await step('select: activating an entry closes the panel with its index', async () => {
      let detail: { index: number; open: boolean } | null = null;
      menu.addEventListener('change', (e) => (detail = (e as CustomEvent).detail));
      (canvasElement.querySelector('#item-b') as HTMLElement).click();
      await settle(() => !menu.hasAttribute('open'));
      expect(menu.hasAttribute('open')).toBe(false);
      expect((detail as unknown as { index: number; open: boolean } | null)!.index).toBe(1);
      expect((detail as unknown as { index: number; open: boolean } | null)!.open).toBe(false);
    });

    await step('back-out: outside click and Escape both close', async () => {
      trigger().click();
      await settle(() => menu.hasAttribute('open'));
      canvasElement.click();
      await settle(() => !menu.hasAttribute('open'));
      trigger().click();
      await settle(() => menu.hasAttribute('open'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle(() => !menu.hasAttribute('open'));
    });

    await step('physics: no alpha, the plates print multiply', async () => {
      expect(getComputedStyle(menu).opacity).toBe('1');
      const front = getComputedStyle(shadow().querySelector('.plate-front') as HTMLElement);
      expect(front.opacity).toBe('1');
      expect(front.mixBlendMode).toBe('multiply');
      expect(getComputedStyle(shadow().querySelector('.plate-back') as HTMLElement).mixBlendMode).toBe(
        'multiply',
      );
    });

    await step(
      'open-up: the closed trigger stays uniform, the open pose mirrors — left-aligned patch and entries',
      async () => {
        /* the second menu renders closed — the steps above click the
           canvas (outside clicks close every open pool). Its own step
           opens it, then asserts the mirrored film pose: red plate
           inset 8px on the growth side (left + top here), twin flush
           at the stack origin, entries left-aligned (Eliot: left on
           the up-openers too), the X on the patch's right edge.
           The closed trigger BEFORE it holds the uniform arrangement
           (Eliot: the light plate at the bottom in every corner —
           "just like the one that opens down"), so the closed swap
           takes the same deltas as the down-openers */
        const br = canvasElement.querySelector('#pool-br') as HTMLElement & {
          shadowRoot: ShadowRoot;
        };
        const bshadow = () => br.shadowRoot!;
        const settleBr = async (probe: () => boolean, tries = 80): Promise<boolean> => {
          for (let i = 0; i < tries; i++) {
            if (probe()) return true;
            await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
          }
          return false;
        };
        const btrigger = () => bshadow().querySelector('.trigger') as HTMLButtonElement;
        /* the closed plate arrangement is uniform now — the twin +4/4,
           the front at the origin — in the bottom-right corner too */
        const bfrontBase = () => bshadow().querySelector('.plate-front') as HTMLElement;
        await settleBr(
          () =>
            getComputedStyle(bfrontBase()).left === '0px' &&
            getComputedStyle(bshadow().querySelector('.plate-back') as HTMLElement).left === '4px',
        );
        expect(getComputedStyle(bfrontBase()).left).toBe('0px');
        expect(getComputedStyle(bshadow().querySelector('.plate-back') as HTMLElement).left).toBe(
          '4px',
        );
        /* the closed swap: force-hover, the plates trade offsets — the
           same down-right deltas as the down-openers */
        br.setAttribute('force-hover', '');
        await settleBr(
          () =>
            getComputedStyle(bshadow().querySelector('.plate-front') as HTMLElement).translate ===
            '4px 4px',
        );
        expect(getComputedStyle(bshadow().querySelector('.plate-front') as HTMLElement).translate).toBe(
          '4px 4px',
        );
        expect(getComputedStyle(bshadow().querySelector('.plate-back') as HTMLElement).translate).toBe(
          '-4px -4px',
        );
        expect(getComputedStyle(bshadow().querySelector('.lines') as HTMLElement).translate).toBe(
          '2px 2px',
        );
        br.removeAttribute('force-hover');
        /* the close: settle only the front's swap-out — the open-up
           step's next click re-poses it */
        await settleBr(
          () =>
            getComputedStyle(bshadow().querySelector('.plate-front') as HTMLElement).translate ===
            'none',
        );
        btrigger().click();
        await settleBr(() => br.hasAttribute('open'));
        const bfront = getComputedStyle(bshadow().querySelector('.plate-front') as HTMLElement);
        await settleBr(() => bfront.left === '8px' && bfront.top === '8px');
        expect(bfront.left).toBe('8px');
        expect(bfront.top).toBe('8px');
        expect(bfront.mixBlendMode).toBe('multiply');
        /* the back plate rides the same 0.35s ease from 4px down to
           0px — its tail computes to e-8px residues one frame past
           the front's landing, so settle both on a round-off
           threshold, not exact strings */
        const bback = getComputedStyle(bshadow().querySelector('.plate-back') as HTMLElement);
        await settleBr(
          () =>
            Math.abs(parseFloat(bback.left) || 0) < 0.01 &&
            Math.abs(parseFloat(bback.top) || 0) < 0.01,
        );
        expect(Math.abs(parseFloat(bback.left) || 0)).toBeLessThan(0.01);
        expect(Math.abs(parseFloat(bback.top) || 0)).toBeLessThan(0.01);
        const itemsEl = bshadow().querySelector('.items') as HTMLElement;
        await settleBr(() => getComputedStyle(itemsEl).alignItems === 'flex-start');
        expect(getComputedStyle(itemsEl).alignItems).toBe('flex-start');
        const brEntry = canvasElement.querySelector('#item-br-b') as HTMLElement;
        expect(getComputedStyle(brEntry).textAlign).toBe('left');
        const lines = getComputedStyle(bshadow().querySelector('.lines') as HTMLElement);
        expect(lines.right).toBe('12px');
      });
  },
};