import { html, LitElement } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-marquee.js';

const meta: Meta = {
  title: 'Surfaces/Marquee',
  component: 'glaphic-marquee',
  tags: ['autodocs'],
  argTypes: {
    strings: { name: 'strings → the ticker phrases (array, 20 max)', control: 'object' },
    speed: { name: 'speed → seconds for one full loop', control: 'number' },
    reverse: { name: 'reverse → the track runs the other way', control: 'boolean' },
  },
};
export default meta;

/* DOCS SECTIONS — hidden in the sidebar. Prose is a draft: the
   section copy is reviewed/edited with the user before merge. */

/** basic band — the ticker scrolls its `///`-joined phrases. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-marquee
      .strings=${['the marquee scrolls the band', 'phrases join around the /// separator']}
    ></glaphic-marquee>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A marquee is the ticker band from the design: a thin strip bounded by two full-width rules (4px ink-brand-dark) with dense mono ticker text scrolling inside, short phrases joined around the `///` separator. Content is the `strings` array property — 20 phrases max, extras drop with a console warn. The line repeats enough copies to fill the container, and the track runs two identical halves so the loop is seamless — the strip translates half its length a `speed` seconds per loop (default 20, linear). The `-speed` tier-2 var is the fallback when `speed` is unset. Reduced motion freezes the scroll: one full run of phrases sits in its band, no twins. Tier-2: `--glaphic-marquee-ink` (the text), `-rule-ink`, `-rule-size`, `-text-size`, `-pad-block`, `-gap`, `-speed`. Draft copy.',
      },
    },
  },
};

/** ticker copy — a longer band of phrases at the design's density. */
export const Ticker: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-marquee style="--glaphic-marquee-speed: 14s"
      .strings=${['12+ years of experience', 'react · typescript · lit', 'available for new projects', 'portfolio 2026']}
    ></glaphic-marquee>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The denser read — more phrases joined around the separator, the band at the design\'s `///`-ticker pitch; `--glaphic-marquee-speed` set inline moves the loop to 14s. Draft copy.',
      },
    },
  },
};

/** the reversed read — the same band with the track running the
    other way (`reverse` attribute). */
export const Reversed: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-marquee reverse
      .strings=${['the track runs the other way', 'same keyframes, opposite direction']}
    ></glaphic-marquee>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The `reverse` boolean attribute flips the track\'s scroll — the component\'s own direction control (the scroll keyframes translate 0 → -50%, and the two-half loop reverses cleanly, so the flip is one declaration on the track). Same duration rules, same tier-2 knobs; this is the about band\'s second runner\'s ask, now owned by the component. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the band's chrome, the joined ticker,
   the twin halves, the cap, the speed property, the loop's motion
   signature, the tier-2 paints, and the gapless-loop condition */

export const MarqueeInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-marquee id="band-1" .strings=${['one', 'two', 'three']}></glaphic-marquee>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const band = canvasElement.querySelector('#band-1') as HTMLElement & {
      strings: string[];
      speed: number;
      shadowRoot: ShadowRoot;
    };
    const shadow = () => band.shadowRoot!;
    const settle = async (probe: () => boolean, tries = 80): Promise<boolean> => {
      for (let i = 0; i < tries; i++) {
        if (probe()) return true;
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
      }
      return false;
    };
    const track = () => shadow().querySelector('.track') as HTMLElement;
    const half = (n: number) => shadow().querySelectorAll('.half')[n] as HTMLElement;
    const run = (n: number) => half(0).querySelectorAll('.run')[n] as HTMLElement;

    await step('band chrome: twin seated 4px ink-brand-dark rails, hidden overflow', async () => {
      /* the rules are the component's own seated rails now (shadow bars,
         part-exposed — not the host's border-block): same inks, same
         placement at the band's edges, seats as the tier-2 insets */
      const band = shadow().querySelector('.band') as HTMLElement;
      const cs = getComputedStyle(band);
      expect(cs.overflow).toBe('hidden');
      const top = band.querySelector('.rail-top') as HTMLElement;
      const bottom = band.querySelector('.rail-bottom') as HTMLElement;
      const topCs = getComputedStyle(top);
      expect(topCs.height).toBe('4px');
      expect(topCs.position).toBe('absolute');
      expect(topCs.top).toBe('0px');
      expect(getComputedStyle(bottom).bottom).toBe('0px');
      expect(topCs.backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(bottom).backgroundColor).toBe('rgb(166, 2, 42)');
      /* the seats are tier-2: the insets park a rail anywhere inside */
      band.style.setProperty('--glaphic-marquee-rule-inset-bottom', '12px');
      expect(getComputedStyle(bottom).bottom).toBe('12px');
      band.style.removeProperty('--glaphic-marquee-rule-inset-bottom');
    });

    await step('ticker: phrases join around the /// separator in order', async () => {
      /* the line ends on the separator too — every repetition opens
         on a /// (Eliot: "a '///' divider before it repeats"); the
         trailing space survives in textContent (it collapses only in
         paint, against the -gap margin) */
      expect((run(0) as HTMLElement).textContent).toBe('one /// two /// three /// ');
    });

    await step('twins: two identical halves, the second aria-hidden', async () => {
      /* template indentation and the run joins ride the textContent —
         strip ALL whitespace for the twin equality (the phrases carry
         no whitespace of their own here) */
      expect(half(0).textContent!.replace(/\s/g, '')).toBe(half(1).textContent!.replace(/\s/g, ''));
      expect(half(1).hasAttribute('aria-hidden')).toBe(true);
      /* gapless loop: one half covers the container's width */
      const halfWidth = half(0).getBoundingClientRect().width;
      expect(halfWidth).toBeGreaterThanOrEqual(band.getBoundingClientRect().width);
    });

    await step('cap: 25 strings uses the first 20', async () => {
      const before = Array.from({ length: 25 }, (_, i) => `phrase ${i + 1}`);
      band.strings = before;
      await settle(() => run(0).textContent === before.slice(0, 20).join(' /// ') + ' /// ');
      expect(run(0).textContent).toBe(before.slice(0, 20).join(' /// ') + ' /// ');
      band.strings = ['one', 'two', 'three'];
      await settle(() => run(0).textContent === 'one /// two /// three /// ');
    });

    await step('motion: infinite linear scroll along the track', async () => {
      await settle(() => getComputedStyle(track()).animationName === 'glaphic-marquee-scroll');
      const cs = getComputedStyle(track());
      expect(cs.animationName).toBe('glaphic-marquee-scroll');
      expect(cs.animationIterationCount).toBe('infinite');
      expect(cs.animationTimingFunction).toBe('linear');
      expect(cs.animationDuration).toBe('20s');
    });

    await step('speed: the property moves the loop duration', async () => {
      band.speed = 3;
      /* the property re-renders on lit's update cycle — settle for it */
      await settle(() => getComputedStyle(track()).animationDuration === '3s');
      expect(getComputedStyle(track()).animationDuration).toBe('3s');
      band.speed = 0;
      await settle(() => getComputedStyle(track()).animationDuration === '20s');
    });

    await step('tier-2: ink, rule ink, rule size, text size', async () => {
      band.style.setProperty('--glaphic-marquee-ink', 'rgb(2, 102, 112)');
      band.style.setProperty('--glaphic-marquee-rule-ink', 'rgb(132, 71, 255)');
      band.style.setProperty('--glaphic-marquee-rule-size', '6px');
      band.style.setProperty('--glaphic-marquee-text-size', '16px');
      const cs = getComputedStyle(run(0));
      const bandCs = getComputedStyle(shadow().querySelector('.band') as HTMLElement);
      expect(cs.color).toBe('rgb(2, 102, 112)');
      expect(cs.fontSize).toBe('16px');
      /* the rails read their ink through the rail elements now */
      const railCs = getComputedStyle(shadow().querySelector('.rail-top') as HTMLElement);
      expect(railCs.backgroundColor).toBe('rgb(132, 71, 255)');
      expect(railCs.height).toBe('6px');
      band.style.removeProperty('--glaphic-marquee-ink');
      band.style.removeProperty('--glaphic-marquee-rule-ink');
      band.style.removeProperty('--glaphic-marquee-rule-size');
      band.style.removeProperty('--glaphic-marquee-text-size');
    });

    await step('physics: no alpha, no masks, the twin rides visible and unfaded', async () => {
      /* the twin is the loop's on-screen continuation at normal
         motion (hiding it blanked mid-scroll), so its guard is
         opacity, not visibility — the hiding lives in reduced motion */
      expect(getComputedStyle(band).opacity).toBe('1');
      expect(getComputedStyle(half(1)).opacity).toBe('1');
      expect(half(1).getAttribute('aria-hidden')).toBe('true');
      expect(shadow().querySelectorAll('mask').length).toBe(0);
    });
  },
};