import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-ascii.js';

/** a compact demo cycle — the shell rising into its burst */
const DEMO_FRAMES = [' o\n\n    ^', ' o|\n\n    ^', ' o|\n   |\n    ^'];

/** a typing demo — the year building letter by letter */
const TYPE_FRAMES = ['2', '20', '201', '2012'];

const meta: Meta = {
  title: 'Surfaces/Ascii',
  component: 'glaphic-ascii',
  tags: ['autodocs'],
  argTypes: {
    frames: { name: 'frames → the ASCII frames (array of strings, set imperatively)', control: 'object' },
    label: { name: 'label → the host aria-label', control: 'text' },
  },
};
export default meta;

/* DOCS SECTIONS — hidden in the sidebar. Prose is a draft: the
   section copy is reviewed/edited with the user before merge. */

/** basic cycle — frames stacked in one cell, step-end flicked. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-ascii
      .frames=${DEMO_FRAMES}
      label="A shell rises, flashes, and bursts into sparks"
    ></glaphic-ascii>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The text-frame cycle machine: one ASCII figure per string in the frames array, all frames stacked in a single shared inline-grid cell and flicked by per-mount generated keyframes — each span shows for its own step (step-end, delay = index times the step), the LAST frame holds three steps so the figure rests a beat before the loop restarts. The loop is count plus 2 steps of --glaphic-ascii-step (0.2s). The host carries the whole box: mono type at --glaphic-ascii-type (48px, line-height 1.3, width 7ch), a 2px ink-brand-dark border over the ink-brand-fluro surface, and the multiply blend — the paper texture overprints through the teal and the white glyphs read as holes. The box-shadow ladder builds in once (0.45s after a 0.15s beat): the drop-build the landing used to carry as grow-drop. Reduced motion parks the cycle ON the final frame and runs the build in 1ms. The frames array travels as a property, not an attribute — set it imperatively (marquee precedent). Draft copy.',
      },
    },
  },
};

/** typing demo — more frames, the ticker-shaped read. */
export const Typing: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-ascii
      .frames=${TYPE_FRAMES}
      label="A year types out, glitches, and resolves a job started"
    ></glaphic-ascii>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A longer cycle read: each frame shows for its own step, so more frames stretch the loop without any percentage edits — the generator derives the keyframes from the count. Draft copy.',
      },
    },
  },
};

/** knobs — the step and type tier-2s, set inline. */
export const Knobs: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-ascii
      .frames=${DEMO_FRAMES}
      label="A smaller, slower shell"
      style="--glaphic-ascii-step: 0.6s; --glaphic-ascii-type: 24px; max-width: none; width: max-content"
    ></glaphic-ascii>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The tier-2s: --glaphic-ascii-step (per-frame time) and --glaphic-ascii-type (font size) — both set inline on the host here; percent-based size scaling is a later iteration (the knobs exist so it can bolt on). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the frames render, the count-derived
   durations and delays, the final-frame hold semantics, the host
   image identity, and the per-mount keyframe-name uniqueness */

export const AsciiInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: (): TemplateResult => html`
    <glaphic-ascii id="ascii-1" label="cycle one" .frames=${['A', 'B', 'C']}></glaphic-ascii>
    <glaphic-ascii id="ascii-2" label="cycle two" .frames=${['one', 'two']}></glaphic-ascii>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const one = canvasElement.querySelector('#ascii-1') as HTMLElement;
    const two = canvasElement.querySelector('#ascii-2') as HTMLElement;
    const shadow = (host: HTMLElement) => host.shadowRoot as ShadowRoot;
    const settle = async (probe: () => boolean, tries = 80): Promise<boolean> => {
      for (let i = 0; i < tries; i++) {
        if (probe()) return true;
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
      }
      return false;
    };
    const spans = (host: HTMLElement) =>
      Array.from(shadow(host).querySelectorAll('span')) as HTMLElement[];
    const animNames = (host: HTMLElement) =>
      Array.from(shadow(host).getAnimations())
        .map((a) => (a as CSSAnimation).animationName || '');
    const flipNames = (host: HTMLElement) =>
      new Set(animNames(host).filter((n) => n.startsWith('ascii-flip-')));

    await step('image identity: role img + the reflecting label', async () => {
      expect(one.getAttribute('role')).toBe('img');
      expect(one.getAttribute('aria-label')).toBe('cycle one');
      expect(two.getAttribute('aria-label')).toBe('cycle two');
    });

    await step('frames: every string is one shadow span, pre-white-space', async () => {
      await settle(() => spans(one).length === 3);
      expect(spans(one).map((s) => s.textContent)).toEqual(['A', 'B', 'C']);
      expect(spans(two).length).toBe(2);
      expect(getComputedStyle(spans(one)[0]).whiteSpace).toBe('pre');
      const frame = shadow(one).querySelector('.frame') as HTMLElement;
      const box = getComputedStyle(frame);
      expect(box.display).toBe('inline-grid');
      expect(box.width).not.toBe('');
      expect(box.mixBlendMode).toBe('multiply');
    });

    await step('cycle: durations and delays derive from the count', async () => {
      /* count 3: the loop is 5 steps of 0.2s (1s); count 2: 4 steps (0.8s) */
      await settle(() => getComputedStyle(spans(one)[1]).animationDuration === '1s');
      expect(getComputedStyle(spans(one)[0]).animationDuration).toBe('1s');
      expect(getComputedStyle(spans(two)[0]).animationDuration).toBe('0.8s');
      expect(getComputedStyle(spans(one)[1]).animationDelay).toBe('0.2s');
      expect(getComputedStyle(spans(one)[2]).animationDelay).toBe('0.4s');
      expect(getComputedStyle(spans(one)[0]).animationIterationCount).toBe('infinite');
      expect(getComputedStyle(spans(one)[0]).animationTimingFunction).toBe('step-end');
    });

    await step('uniqueness: two mounts, two distinct flip names', async () => {
      /* the per-mount counter — never a tag-derived constant: two
         instances in one document must never share a generated name */
      const namesOne = flipNames(one);
      const namesTwo = flipNames(two);
      expect(namesOne.size).toBe(1);
      expect(namesTwo.size).toBe(1);
      expect([...namesOne][0]).not.toBe([...namesTwo][0]);
    });

    await step('hold: the last frame rides a hold keyframe (3 of 5 steps)', async () => {
      const lastOne = spans(one)[2];
      expect(getComputedStyle(lastOne).animationName).toContain('ascii-hold-');
      /* 3/(count+2) of the loop = 60% for a 3-frame run */
      expect(
        Array.from(shadow(one).querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join(''),
      ).toContain('60.000% { visibility: hidden; }');
    });

    await step('tier-2: step and type knobs beat the defaults', async () => {
      one.style.setProperty('--glaphic-ascii-step', '0.5s');
      one.style.setProperty('--glaphic-ascii-type', '24px');
      await settle(() => getComputedStyle(spans(one)[1]).animationDuration === '2.5s');
      expect(getComputedStyle(one).fontSize).toBe('24px');
      expect(getComputedStyle(spans(one)[1]).animationDuration).toBe('2.5s');
      one.style.removeProperty('--glaphic-ascii-step');
      one.style.removeProperty('--glaphic-ascii-type');
    });

    await step('blend: the overprint survives in shadow context', async () => {
      /* the frame's multiply must still reach the page's stacked paint;
         a shadow-internal blend break would show as blend: none */
      const frame = shadow(one).querySelector('.frame') as HTMLElement;
      expect(getComputedStyle(frame).mixBlendMode).toBe('multiply');
    });
  },
};