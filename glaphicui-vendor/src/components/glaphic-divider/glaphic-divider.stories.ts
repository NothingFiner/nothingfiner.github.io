import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-divider.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const DIVIDER_TINT_MAP = {
  '--glaphic-divider-ink': 'ink',
  '--glaphic-divider-height': 'height',
};

const meta: Meta = {
  title: 'Surfaces/Divider',
  component: 'glaphic-divider',
  tags: ['autodocs'],
  argTypes: {
    ink: {
      name: '--glaphic-divider-ink',
      control: { type: 'color', presetColors: TIER1_COLORS },
      description: 'Tier-2 — the rule’s paint; default rides the rim token',
    },
    height: {
      name: '--glaphic-divider-height',
      control: 'text',
      description: 'Tier-2 — the rule’s cross; default 1px (multiples of the grid pitch --hz sit it on tape-band sizes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'The plain rule — the simpler sibling of the glaphic-tape ladder. A full-width bar whose cross is a Tier-2 knob and whose paint is a Tier-2 ink; decorative, so it carries no semantics.',
      },
    },
  },
};
export default meta;

// DOCS SECTION — rules section; description copy to come from the user
export const Rules: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:block">
      <span class="demo-cap">hairline</span>
      <div style="margin:10px 0 22px"><glaphic-divider></glaphic-divider></div>
      <span class="demo-cap">3 cells of the pitch</span>
      <div style="margin:10px 0 22px">
        <glaphic-divider style="--glaphic-divider-height: calc(var(--hz, 18px) * 3)"></glaphic-divider>
      </div>
    </div>
  `,
};

// DOCS SECTION — ink choices; description copy to come from the user
export const Accents: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:block">
      <glaphic-divider
        style="${tier2Vars({ ink: 'var(--hot, #E03A0B)' }, DIVIDER_TINT_MAP)}"
      ></glaphic-divider>
      <div style="margin:22px 0"><glaphic-divider></glaphic-divider></div>
      <glaphic-divider
        style="${tier2Vars({ ink: 'var(--cold, #0780B8)' }, DIVIDER_TINT_MAP)}"
      ></glaphic-divider>
    </div>
  `,
};

/** fixed combinations (sidebar only, controls off) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true }, controls: { disable: true } },
  render: () => html`
    <div style="display:block;max-width:480px">
      <div style="margin:10px 0"><glaphic-divider></glaphic-divider></div>
      <glaphic-divider
        style="${tier2Vars({ ink: 'var(--hot, #E03A0B)' }, DIVIDER_TINT_MAP)}"
      ></glaphic-divider>
      <div style="margin:22px 0"><glaphic-divider></glaphic-divider></div>
      <glaphic-divider
        style="--glaphic-divider-height: calc(var(--hz, 18px) * 3); ${tier2Vars(
          { ink: 'var(--cold, #0780B8)' },
          DIVIDER_TINT_MAP,
        )}"
      ></glaphic-divider>
    </div>
  `,
};

/** full audition (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { ink: '#17140E', height: '' },
  render: (args) => html`
    <div style="padding:22px 0">
      <glaphic-divider style="${tier2Vars(args as Record<string, unknown>, DIVIDER_TINT_MAP)}"></glaphic-divider>
    </div>
  `,
};

/** hidden test story — guards the two knobs */
export const Interactions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`<glaphic-divider></glaphic-divider>`,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const divider = canvasElement.querySelector('glaphic-divider')!;
    await step('the rule is a 1px hairline riding the rim ink by default', async () => {
      const s = getComputedStyle(divider);
      expect(s.display).toBe('block');
      expect(s.height).toBe('1px');
      expect(s.opacity).toBe('1');
    });
    await step('the height knob resizes the cross without any property', async () => {
      divider.style.setProperty('--glaphic-divider-height', '6px');
      expect(getComputedStyle(divider).height).toBe('6px');
    });
    await step('the ink knob repaints it', async () => {
      divider.style.setProperty('--glaphic-divider-ink', 'var(--hot, #E03A0B)');
      expect(getComputedStyle(divider).backgroundColor).toBe('rgb(224, 58, 11)');
    });
  },
};