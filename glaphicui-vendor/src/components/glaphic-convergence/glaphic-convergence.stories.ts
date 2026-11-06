import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-convergence.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const CONVERGENCE_TINT_MAP = {
  '--glaphic-convergence-hot': 'hot',
  '--glaphic-convergence-cold': 'cold',
  '--glaphic-convergence-ink': 'ink',
  '--glaphic-convergence-height': 'height',
  '--glaphic-convergence-progress': 'progress',
  '--glaphic-convergence-meet-offset': 'meet',
  '--glaphic-convergence-dwell': 'dwell',
  '--glaphic-convergence-width': 'width',
};

const CONVERGENCE_COPY = html`<p style="margin:0;padding:0 24px;text-align:center">
  Body copy rides the overlap — legible only while the plates cover it.
</p>`;

// frozen travel state rows read off the published progress var
const stateRow = (progress: string, axis?: string) => html`
  <glaphic-convergence
    hold
    axis=${axis}
    style="--glaphic-convergence-progress: ${progress}"
  >${CONVERGENCE_COPY}</glaphic-convergence>
`;

const meta: Meta = {
  title: 'Convergence Card',
  component: 'glaphic-convergence',
  tags: ['autodocs'],
  argTypes: {
    axis: {
      control: 'inline-radio',
      options: ['diagonal', 'horizontal', 'vertical'],
      description: 'the travel — diagonal is the pitch as pitched',
    },
    hold: { control: 'boolean', description: 'scroll link off; the progress var is yours' },
    progress: {
      name: '--glaphic-convergence-progress',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Tier-2 state — 0 the top enters the viewport, 0.5 the center crossing (full convergence), 1 the bottom leaves',
    },
    hot: { name: '--glaphic-convergence-hot', control: { type: 'color', presetColors: TIER1_COLORS }, description: 'Tier-2 — the hot plate; default hot at 80% (the film button’s strength)' },
    cold: { name: '--glaphic-convergence-cold', control: { type: 'color', presetColors: TIER1_COLORS }, description: 'Tier-2 — the cold plate; default cold at 80%' },
    ink: { name: '--glaphic-convergence-ink', control: { type: 'color', presetColors: TIER1_COLORS }, description: 'Tier-2 — the revealed copy’s ink' },
    height: { name: '--glaphic-convergence-height', control: 'text', description: 'Tier-2 — the section’s cross (minimum); default 12 cells of --hz' },
    meet: { name: '--glaphic-convergence-meet-offset', control: 'text', description: 'Tier-2 — the plates’ vertical meet offset (hot seats above, cold below — the film button’s film-offset move); default 2px' },
    dwell: { name: '--glaphic-convergence-dwell', control: { type: 'range', min: 0, max: 0.35, step: 0.01 }, description: 'Tier-2 — the unified hold: the transit’s middle that keeps the plates held at the meet (progress units; clamped to 0.35 — the fly needs room); default 0.2' },
    width: { name: '--glaphic-convergence-width', control: 'text', description: 'Tier-2 — the holder’s cap; default 480px (card-sized, auto-centered)' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Scroll-converged overprint plates — two square-edged films (one hot, one cold) park one card over and fly together as the section crosses: hot from one side, cold from the other, full overlap at the meet, through and out the far sides. Nothing clips the flights — they sweep the page outside the holder (Eliot unclipped the rig: the old overflow ate the mid-fly sweep and the plates read as appearing at random). The dwell holds the unified composition across the middle of the transit (--glaphic-convergence-dwell, default 0.2 — the plates sit at the meet for that stretch of scroll). Copy rides a default slot locked to the hot film and prints ONLY in the unified region: a mask layer tracks the plates’ intersection, so the text appears as the plates unify and vanishes as they part (Eliot’s mechanic here; visual only — the copy stays in the accessibility tree the whole way, and reduced motion lifts the mask entirely). Draft copy.',
      },
    },
  },
};
export default meta;

// DOCS SECTION — the plates and the reveal clip; copy to come from the user
export const Plates: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:block;max-width:480px">
      <span class="demo-cap">traveling — 0.85 (mid-flight, unclipped)</span>
      <div style="margin:10px 0">${stateRow('0.85')}</div>
      <span class="demo-cap">leaving — 0.75</span>
      <div style="margin:10px 0">${stateRow('0.75')}</div>
      <span class="demo-cap">converged — 0.5</span>
      <div style="margin:10px 0">${stateRow('0.5')}</div>
      <span class="demo-cap">the dwell holds — 0.65 (still unified)</span>
      <div style="margin:10px 0">${stateRow('0.65')}</div>
    </div>
  `,
};

// DOCS SECTION — the converged moment; copy to come from the user
export const Meet: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-convergence hold style="--glaphic-convergence-progress: 0.5"
      >${CONVERGENCE_COPY}</glaphic-convergence>
  `,
};
// DOCS SECTION — the travel; copy to come from the user
export const Scroll: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="display:block;max-width:480px">
      <span class="demo-cap">horizontal</span>
      <div style="margin:10px 0">${stateRow('0.5', 'horizontal')}</div>
      <span class="demo-cap">vertical</span>
      <div style="margin:10px 0">${stateRow('0.9', 'vertical')}</div>
      <span class="demo-cap">live — scroll the page</span>
      <div style="margin:10px 0"><glaphic-convergence>${CONVERGENCE_COPY}</glaphic-convergence></div>
    </div>
  `,
};

// fixed combinations (sidebar only, controls off)
export const Example: StoryObj = {
  parameters: { docs: { disable: true }, controls: { disable: true } },
  render: () => html`
    <div style="display:block;max-width:560px">
      <glaphic-convergence hold style="--glaphic-convergence-progress: 0.9">${CONVERGENCE_COPY}</glaphic-convergence>
      <div style="margin:26px 0"></div>
      <glaphic-convergence hold axis="horizontal" style="--glaphic-convergence-progress: 0.75"
        >${CONVERGENCE_COPY}</glaphic-convergence>
      <div style="margin:26px 0"></div>
      <glaphic-convergence hold style="--glaphic-convergence-progress: 0.5"
        >${CONVERGENCE_COPY}</glaphic-convergence>
      <div style="margin:26px 0"></div>
      <glaphic-convergence hold axis="vertical" style="--glaphic-convergence-height: 220px; --glaphic-convergence-progress: 0.5"
        >${CONVERGENCE_COPY}</glaphic-convergence>
    </div>
  `,
};

// full audition (sidebar only) — the CANVAS IS THE PAGE: fullscreen
// layout (storybook's padded preview boxes the story otherwise) and
// one-viewport-height page blocks before and after the holder — the
// page scroll the component was built to react to. The content height
// is exactly 2 viewports + the holder, so the scrollable range equals
// viewport + holder and the scroll sweeps the progress 0 → 1 with no
// slack — the same walk a page's neighboring sections give it on a
// site (a 65vh ground only reaches p ≈ 0.25–0.75, which is why the
// plates never visibly left)
export const Playground: StoryObj = {
  parameters: { layout: 'fullscreen', docs: { disable: true } },
  args: {
    axis: 'diagonal',
    hold: false,
    progress: 0.5,
    hot: '',
    cold: '',
    ink: '',
    height: '',
    meet: '',
    dwell: '',
    width: '',
  },
  render: (args) => html`
    <div style="height: 100vh"></div>
    <glaphic-convergence
        axis=${args.axis as string}
        ?hold=${Boolean(args.hold)}
        style="${tier2Vars(args as Record<string, unknown>, CONVERGENCE_TINT_MAP)}"
      >${CONVERGENCE_COPY}</glaphic-convergence>
    <div style="height: 100vh"></div>
  `,
};

// hidden test story — guards the plates, the clip, and the capture
export const Interactions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-convergence hold axis="horizontal" style="--glaphic-convergence-progress: 0.75">
      <span class="demo-cap">reveal copy</span>
    </glaphic-convergence>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const convergence = canvasElement.querySelector('glaphic-convergence')!;
    const hot = convergence.querySelector('.hotplate')!;
    const reveal = convergence.querySelector('.reveal')!;
    await step('light children are captured into the reveal layer', async () => {
      expect(reveal.textContent).toContain('reveal copy');
    });
    await step('plates ride the progress var as pure transforms (converged = the meet seat)', async () => {
      convergence.style.setProperty('--glaphic-convergence-progress', '0.5');
      const m = new DOMMatrixReadOnly(getComputedStyle(hot).transform);
      expect(m.m41).toBe(0); // converged: no x travel
      expect(Math.round(m.m42)).toBe(-2); // seated above the meet offset
    });
    await step('the dwell holds the travel at the meet across the middle of the transit', async () => {
      // the unified hold: u = 0.5 − progress, held to 0 while |u| ≤ the
      // dwell (default 0.2) — 0.4 / 0.6 both sit inside the hold
      convergence.style.setProperty('--glaphic-convergence-progress', '0.6');
      const held = new DOMMatrixReadOnly(getComputedStyle(hot).transform);
      expect(held.m41).toBe(0);
      expect(Math.round(held.m42)).toBe(-2);
      convergence.style.setProperty('--glaphic-convergence-progress', '0.4');
      const heldLow = new DOMMatrixReadOnly(getComputedStyle(hot).transform);
      expect(heldLow.m41).toBe(0);
      expect(Math.round(heldLow.m42)).toBe(-2);
    });
    await step('traveling state moves the hot plate (shaped travel, renormalized past the dwell)', async () => {
      convergence.style.setProperty('--glaphic-convergence-progress', '0.75');
      const matrix = new DOMMatrixReadOnly(getComputedStyle(hot).transform);
      const w = convergence.getBoundingClientRect().width;
      // the dwelled shape: u = 0.5 − .75 = −.25; |u| − dwell(0.2) = .05,
      // renormalized ÷ (0.4 − 0.2) → |travel| = .25, sign −1; move =
      // travel·|travel| = −.0625; hot horizontal = move·−100% = +.0625w
      expect(Math.round(matrix.m41)).toBe(Math.round(w * 0.0625));
      expect(Math.round(matrix.m42)).toBe(-2); // horizontal: no y travel, meet seat only
    });
    await step('the copy rides the hot plate (locked) — hit-test empty at the extreme', async () => {
      const rect = convergence.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      convergence.style.setProperty('--glaphic-convergence-progress', '0');
      // the copy rides one card over; the plates are pointer-events:none
      expect(document.elementFromPoint(cx, cy) === reveal.firstElementChild).toBe(false);
      convergence.style.setProperty('--glaphic-convergence-progress', '0.5');
      expect(document.elementFromPoint(cx, cy)).toBe(reveal.firstElementChild);
    });
    await step('the unify mask tracks the unified region (visual only, no clipping)', async () => {
      // the copy paints ONLY where the plates coincide: the reveal
      // wears two intersecting mask layers (the x window + the seat's
      // y window); hit-testing is untouched by a mask — the AX tree
      // reads the copy the whole way
      const paint = getComputedStyle(reveal) as CSSStyleDeclaration & { webkitMaskImage?: string };
      const images = [paint.maskImage, paint.webkitMaskImage];
      expect(images.some((m) => m && m !== 'none' && m.includes('linear-gradient'))).toBe(true);
      // nothing clips the flights: the host no longer hides the plates
      // outside the box — the plates paint freely (overflow visible)
      expect(getComputedStyle(convergence).overflow).toBe('visible');
    });
    await step('hold disconnects the scroll write', async () => {
      const before = convergence.style.getPropertyValue('--glaphic-convergence-progress');
      window.dispatchEvent(new Event('scroll'));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      expect(convergence.style.getPropertyValue('--glaphic-convergence-progress')).toBe(before);
    });
  },
};