import { css, html, LitElement, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-button.js';
import type { GlaphicButton } from './glaphic-button.js';

const meta: Meta = {
  title: 'Controls/Button',
  component: 'glaphic-button',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['solid', 'outline', 'text'] },
    color: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
    },
  },
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;
const states = (el: (state: boolean | 'disabled') => TemplateResult) => html`
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
    ${el(false)}${el(true)}${el('disabled')}
  </div>`;

const ENGAGE = html`engage`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row('SOLID', 'primary — the filled default', html`<glaphic-button>engage</glaphic-button>`)}
      ${row('OUTLINE', 'ink — transparent fill, one ink for text + border', html`<glaphic-button variant="outline">engage</glaphic-button>`)}
      ${row('TEXT', 'ink — only the label paints', html`<glaphic-button variant="text">engage</glaphic-button>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A button is one of three appearances carrying one color recipe. Solid is the filled family — opaque fill, 1px keyline that strokes with each state\'s ink, hover swapping fill and label. Outline paints nothing but the frame: transparent fill, the text and border the same ink, hover pouring in a surface under the held ink. Text paints only the label — its hover is a surface block alone. Color rides a second attribute, so any recipe can ride any appearance. Draft copy.',
      },
    },
  },
};

export const Solid: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:760px">
      ${row('PRIMARY', 'fluro fill → ink-black, ink → fluro — with disabled', states(
        (h) => html`<glaphic-button ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('DANGER', 'danger-base → danger-text on hover — with disabled', states(
        (h) => html`<glaphic-button color="danger" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('WARNING', 'warning-surface → warning-base on hover — with disabled', states(
        (h) => html`<glaphic-button color="warning" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('SUCCESS', 'success-base → success-text on hover — with disabled', states(
        (h) => html`<glaphic-button color="success" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('INFO', 'info-base → info-text on hover, no keyline at rest — with disabled', states(
        (h) => html`<glaphic-button color="info" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The solid recipes off the semantic tokens: primary / danger / warning / success / info (secondary left solid — it belongs to outline now). Every fill is opaque. The keyline is its own decision per state — primary strokes with the ink of that state (black at rest, fluro on hover), warning strokes its deeper base yellow, success strokes text/surface — and danger/info carry none at rest. Disabled greys to the cool ramp with no opacity and holds that grey under the pointer. Draft copy.',
      },
    },
  },
};

export const Outline: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:760px">
      ${row('INK', 'default — #0d0221 text/border, #e9ede0 hover surface', states(
        (h) => html`<glaphic-button variant="outline" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('SECONDARY', 'brand-dark ink — hover surface a hold (flagged)', states(
        (h) => html`<glaphic-button variant="outline" color="secondary" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('DANGER', 'danger-base ink — hover inverts to the filled base chip', states(
        (h) => html`<glaphic-button variant="outline" color="danger" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The outline recipes: a transparent fill with the text and border the same ink. The ink recipe (the default) frames #0d0221 and pours #e9ede0 on hover; secondary carries the brand-dark ink (its hover surface is a hold — flagged); danger frames the danger-base ink (#f81d41) and hover INVERTS it — the base pours in as the fill, the text and border lifting to the danger-surface pink (#ffe7eb). Chamfered works here too as a prop, but the cut prints no rim — the painted keyline only exists where the fill is opaque (flagged below). Draft copy.',
      },
    },
  },
};

export const Text: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:760px">
      ${row('INK', 'default — ink label, paper-deep hover surface', states(
        (h) => html`<glaphic-button variant="text" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('SECONDARY', 'brand-dark label (hold — flagged), paper-deep hover surface', states(
        (h) => html`<glaphic-button variant="text" color="secondary" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
      ${row('INFO', 'info-text label over the info-surface hover block', states(
        (h) => html`<glaphic-button variant="text" color="info" ?force-hover=${h === true} ?disabled=${h === 'disabled'}>engage</glaphic-button>`,
      ))}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The text recipes: only the label paints, and only the hover surface exists as a prop — the ink holds on hover. The ink recipe (the default) sits on the paper-deep block; info reads the info-text ink over the info-surface lavender; secondary rides the brand-dark ink (a hold — flagged). Draft copy.',
      },
    },
  },
};

export const Chamfered: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:760px">
      ${row('PRIMARY', 'chamfered — the rim strokes the cut too', states(
        (h) => html`<glaphic-button chamfered ?force-hover=${h === true}>engage</glaphic-button>`,
      ))}
      ${row('DANGER', 'chamfered (borderless read)', states(
        (h) => html`<glaphic-button color="danger" chamfered ?force-hover=${h === true}>engage</glaphic-button>`,
      ))}
      ${row('INFO', 'chamfered · no keyline at rest, the base prints on hover', states(
        (h) => html`<glaphic-button color="info" chamfered ?force-hover=${h === true}>engage</glaphic-button>`,
      ))}
      ${row('OUTLINE', 'chamfered — silhouette cut, NO rim (flagged)', html`<glaphic-button variant="outline" chamfered>engage</glaphic-button>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The spec\'s two-corner chamfer (top-left + bottom-right), cut size tunable via --glaphic-button-chamfer. The border is a painted layer here so it runs around the cut too — the Figma vector strokes every edge, cut or straight. That layer stands in for a real border, so it only exists where the fill is opaque: chamfered outlines and text buttons keep the silhouette but print no rim along the cut (flagged — needs a different mechanic if you want rimmed outline chamfers). Draft copy.',
      },
    },
  },
};

export const Sizes: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:560px">
      ${row('SM', '11px label, 27px tall — every appearance', html`
        <div style="display:flex;gap:12px;align-items:center">
          <glaphic-button size="sm">engage</glaphic-button>
          <glaphic-button variant="outline" size="sm">engage</glaphic-button>
          <glaphic-button variant="text" size="sm">engage</glaphic-button>
        </div>`)}
      ${row('MD', '12px label, 40px tall (default)', html`
        <div style="display:flex;gap:12px;align-items:center">
          <glaphic-button>engage</glaphic-button>
          <glaphic-button variant="outline">engage</glaphic-button>
          <glaphic-button variant="text">engage</glaphic-button>
        </div>`)}
      ${row('LG', '16px label, 55px tall', html`
        <div style="display:flex;gap:12px;align-items:center">
          <glaphic-button size="lg">engage</glaphic-button>
          <glaphic-button variant="outline" size="lg">engage</glaphic-button>
          <glaphic-button variant="text" size="lg">engage</glaphic-button>
        </div>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The size ladder, shared by every appearance: padding rides the Tier-1 --glaphic-button-{sm,md,lg}-padding-{x,y} tokens and the label steps 11 → 12 → 16px along the type scale. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the appearance/color split end to end:
   the solid state tables (incl. the keyline-per-state decisions), the
   outline ink/secondary/danger recipes and their hover surfaces, the
   text recipes and their held inks, the chamfer rim layers, the
   disabled hold, and the size ladder */
export const ButtonInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-button>engage</glaphic-button>
    <glaphic-button id="btn-danger" color="danger">engage</glaphic-button>
    <glaphic-button id="btn-warning" color="warning">engage</glaphic-button>
    <glaphic-button id="btn-success" color="success">engage</glaphic-button>
    <glaphic-button id="btn-info" color="info">engage</glaphic-button>
    <glaphic-button id="btn-out" variant="outline">engage</glaphic-button>
    <glaphic-button id="btn-out-sec" variant="outline" color="secondary">engage</glaphic-button>
    <glaphic-button id="btn-out-dan" variant="outline" color="danger">engage</glaphic-button>
    <glaphic-button id="btn-txt" variant="text">engage</glaphic-button>
    <glaphic-button id="btn-txt-info" variant="text" color="info">engage</glaphic-button>
    <glaphic-button id="btn-chamfered" chamfered>engage</glaphic-button>
    <glaphic-button id="btn-chamfered-info" color="info" chamfered>engage</glaphic-button>
    <glaphic-button id="btn-chamfered-out" variant="outline" chamfered>engage</glaphic-button>
    <glaphic-button id="btn-disabled" disabled>engage</glaphic-button>
    <glaphic-button id="btn-lg" size="lg">engage</glaphic-button>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const settlePaint = async (read: () => string, expected: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        let elapsed = 0;
        const tick = () => {
          const seen = read();
          if (seen === expected) return resolve();
          elapsed += 25;
          if (elapsed > 2000) return reject(new Error(`expected ${expected}, saw ${seen}`));
          setTimeout(tick, 25);
        };
        tick();
      });
    };
    const parts = (sel: string) => {
      const host = canvasElement.querySelector(sel) as HTMLElement;
      const button = host.shadowRoot!.querySelector('button')!;
      return { host, button, label: button.querySelector('span')! };
    };
    await step('default: fluro fill, the ink-black keyline stroking the state ink', async () => {
      const { button } = parts('glaphic-button');
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(getComputedStyle(button).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button).opacity).toBe('1');
    });
    await step('solid hovers: each recipe walks its own pair', async () => {
      /* danger: base → text fill, surface ink holding, keyline riding */
      const danger = parts('#btn-danger');
      expect(getComputedStyle(danger.button).backgroundColor).toBe('rgb(248, 29, 65)');
      expect(getComputedStyle(danger.button).color).toBe('rgb(255, 231, 235)');
      danger.host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(danger.button).backgroundColor, 'rgb(163, 8, 37)');
      expect(getComputedStyle(danger.button).color).toBe('rgb(255, 231, 235)');
      expect(getComputedStyle(danger.button).borderColor).toBe('rgb(163, 8, 37)');
      /* warning: surface → base on hover, the base keyline both sides */
      const warning = parts('#btn-warning');
      expect(getComputedStyle(warning.button).backgroundColor).toBe('rgb(255, 232, 115)');
      expect(getComputedStyle(warning.button).borderColor).toBe('rgb(255, 213, 0)');
      warning.host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(warning.button).backgroundColor, 'rgb(255, 213, 0)');
      /* success: base → text, the ink flipping to the surface token */
      const success = parts('#btn-success');
      expect(getComputedStyle(success.button).backgroundColor).toBe('rgb(137, 243, 54)');
      expect(getComputedStyle(success.button).color).toBe('rgb(61, 139, 14)');
      success.host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(success.button).backgroundColor, 'rgb(61, 139, 14)');
      expect(getComputedStyle(success.button).color).toBe('rgb(230, 255, 211)');
      /* info: no keyline at rest (border == fill), the base prints on hover */
      const info = parts('#btn-info');
      expect(getComputedStyle(info.button).backgroundColor).toBe('rgb(132, 71, 255)');
      expect(getComputedStyle(info.button).borderColor).toBe('rgb(132, 71, 255)');
      info.host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(info.button).backgroundColor, 'rgb(90, 31, 204)');
      expect(getComputedStyle(info.button).color).toBe('rgb(239, 232, 255)');
      expect(getComputedStyle(info.button).borderColor).toBe('rgb(132, 71, 255)');
    });
    await step('outline ink: transparent fill, one ink both sides, paper-deep hover surface', async () => {
      const { host, button } = parts('#btn-out');
      expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(button).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(13, 2, 33)');
      host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(button).backgroundColor, 'rgb(233, 237, 224)');
      /* the ink holds on hover — background is the only hover prop */
      expect(getComputedStyle(button).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(13, 2, 33)');
    });
    await step('outline secondary: brand-dark ink, the paper-deep hover surface (LOCKED GUESS)', async () => {
      const { host, button } = parts('#btn-out-sec');
      expect(getComputedStyle(button).color).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(166, 2, 42)');
      host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(button).backgroundColor, 'rgb(233, 237, 224)');
      expect(getComputedStyle(button).color).toBe('rgb(166, 2, 42)');
    });
    await step('outline danger: base ink at rest, hover inverts to the filled base chip', async () => {
      const { host, button } = parts('#btn-out-dan');
      expect(getComputedStyle(button).color).toBe('rgb(248, 29, 65)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(248, 29, 65)');
      host.setAttribute('force-hover', '');
      /* hover pours the danger-base fill; text and border lift to the
         surface pink */
      await settlePaint(() => getComputedStyle(button).backgroundColor, 'rgb(248, 29, 65)');
      expect(getComputedStyle(button).color).toBe('rgb(255, 231, 235)');
      expect(getComputedStyle(button).borderColor).toBe('rgb(255, 231, 235)');
    });
    await step('text: no border at all, the ink holds as the surface pours in', async () => {
      const { button } = parts('#btn-txt');
      expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(button).color).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button).borderWidth).toBe('0px');
      parts('#btn-txt').host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(button).backgroundColor, 'rgb(233, 237, 224)');
      expect(getComputedStyle(button).color).toBe('rgb(13, 2, 33)');
    });
    await step('text info: the info-text label over the info-surface hover block', async () => {
      const { host, button } = parts('#btn-txt-info');
      expect(getComputedStyle(button).color).toBe('rgb(90, 31, 204)');
      host.setAttribute('force-hover', '');
      await settlePaint(() => getComputedStyle(button).backgroundColor, 'rgb(239, 232, 255)');
      expect(getComputedStyle(button).color).toBe('rgb(90, 31, 204)');
      expect(getComputedStyle(button).borderWidth).toBe('0px');
    });
    await step('chamfered: two-corner clip, the rim painted, the fill inset', async () => {
      const { button } = parts('#btn-chamfered');
      expect(getComputedStyle(button).clipPath).toContain('polygon');
      /* the rim layer = the border ink; the fill rides the inset ::before */
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(13, 2, 33)');
      expect(getComputedStyle(button, '::before').backgroundColor).toBe('rgb(20, 241, 200)');
      /* info chamfered: the borderless read — rim == fill == info-base */
      const info = parts('#btn-chamfered-info');
      expect(getComputedStyle(info.button, '::before').backgroundColor).toBe('rgb(132, 71, 255)');
      /* outline chamfered: silhouette only — no rim, label readable */
      const out = parts('#btn-chamfered-out');
      expect(getComputedStyle(out.button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(out.button).color).toBe('rgb(13, 2, 33)');
    });
    await step('disabled: greys with no opacity — and no hover', async () => {
      const host = parts('#btn-disabled').host;
      const b = parts('#btn-disabled').button;
      expect(getComputedStyle(b).backgroundColor).toBe('rgb(233, 231, 239)');
      expect(getComputedStyle(b).borderColor).toBe('rgb(186, 182, 199)');
      expect(getComputedStyle(b).opacity).toBe('1');
      expect(b.disabled).toBe(true);
      host.setAttribute('force-hover', '');
      await new Promise((r) => setTimeout(r, 250));
      expect(getComputedStyle(b).backgroundColor).toBe('rgb(233, 231, 239)');
    });
    await step('size ladder: the lg button stands 55px', async () => {
      expect(parts('#btn-lg').button.getBoundingClientRect().height).toBeCloseTo(55, 0);
    });
  },
};
/* ── SPREAD — the grid fill wave, the button's effect ───────────────
   decoded from Eliot's 10 frames (134×53 box: 8 cols × 5 rows of
   17×11 cells, counts 1→2→4→9→14→20→27→33→40). Each cell's
   ACTIVATION = (Manhattan distance from the seed × wave step) and
   odd-parity cells (their (col+row) parity OPPOSING the seed's) are
   lagged LAG_RINGS rings behind the even front — the frames'
   checkered holes: even d≤2 lit while odd d1 still empty, odd d1
   arriving around even d4 (the lag read ~2–3 rings in the frames;
   Eliot tuned the DEFAULT to 0 — solid, the button-usable read).
   The lag is a FULL RINGS value so solidity/speed ride exactly with
   the step. Seeds = the NEAREST GRID POINT to the pointer (entry
   point, press point, or a random interior cell). Tunables are the
   story's live knobs (wave step / parity lag in rings). The wash
   reads as a SEAMLESS grid of pixels — the earlier 1px cell gap (the
   "thin grid") was found to be the visible-grid malfunction's cause
   and is out (Eliot, 2026-10-19). */
const SPREAD_COLS = 8;
const SPREAD_ROWS = 5;
const SPREAD_SEAM = 0; /* no seams — the pixels abut (a 1px gap caused the visible-grid read) */
const SPREAD_WAVE_STEP_MS = 90; // per ring of Manhattan distance (hover modes)
const SPREAD_LAG_RINGS = 0; // the odd checkerboard's lag, in rings — Eliot tuned 0 (knob stays)
const SPREAD_CLICK_STEP_MS = 40; // click's OWN step — fast (Eliot: "faster on click")
const SPREAD_UNDO_TRAIL_RINGS = 3.5; // the undo wave's head-start trail, in rings (Eliot tuned)

type SpreadMode = 'enter' | 'click' | 'random' | 'composed';
type SpreadKnobs = { mode: SpreadMode; step: number; lag: number; clickStep: number; trail: number; };

/** decorates a REAL glaphic-button: injects the cell grid into its
    shadow button (behind the label) and wires the seed interaction.
    knobs is read at every event, so the story's live sliders retune
    an already-decorated button without re-mounting. */
function decorateSpreadButton(host: GlaphicButton, knobs: () => SpreadKnobs): void {
  const button = host.shadowRoot!.querySelector('button')!;
  const label = button.querySelector('span')!;
  button.style.position = 'relative';
  button.style.width = '100%';
  /* the rounded border doesn't clip children (only overflow and
     clip-path do) — left off, the grid's corner cells painted past
     the silhouette and read as rest-colored dots on the border. the
     chamfered button never showed it because its clip-path already
     clips descendants — this mirrors that clip for every other shape */
  button.style.overflow = 'hidden';
  label.style.position = 'relative';
  label.style.zIndex = '1';

  const grid = document.createElement('div');
  grid.style.cssText = [
    'position:absolute', 'inset:0', 'pointer-events:none',
    'display:grid', `gap:${SPREAD_SEAM}px`,
    `grid-template-columns:repeat(${SPREAD_COLS},1fr)`,
    `grid-template-rows:repeat(${SPREAD_ROWS},1fr)`, 'isolation:isolate',
  ].join(';');
  /* the pixels abut seam-free — no gap on the grid (the 1px seam
     read as a visible grid of the rest color through the wash) */
  const cells: HTMLElement[] = [];
  for (let i = 0; i < SPREAD_COLS * SPREAD_ROWS; i += 1) {
    const cell = document.createElement('i');
    cell.style.cssText = [
      'background-color:transparent', 'mix-blend-mode:multiply',
      'transition:background-color 80ms linear',
    ].join(';');
    grid.append(cell);
    cells.push(cell);
  }
  button.prepend(grid);

  /* the paint states. The outline rows multiply paper-deep over the
     canvas; the COMPOSED buttons read each recipe's actual Tier-2
     hover triple — the darker wash is var(--glaphic-button-hover-
     surface) (ink-black on primary, danger-text on danger…), never
     hardcoded, blended NORMAL — and the click wave paints the
     recipe's REST surface. Nothing here names a color. */
  const DARK = 'var(--glaphic-neutral-paper-deep, #e9ede0)';
  const paintDarker = (cell: HTMLElement) => {
    const composed = knobs().mode === 'composed';
    cell.style.backgroundColor = composed ? 'var(--glaphic-button-hover-surface)' : DARK;
    cell.style.mixBlendMode = composed ? 'normal' : 'multiply';
  };
  const paintBase = (cell: HTMLElement) => {
    cell.style.backgroundColor = 'var(--glaphic-button-surface)';
    cell.style.mixBlendMode = 'normal';
  };
  const paintEmpty = (cell: HTMLElement) => {
    cell.style.backgroundColor = 'transparent';
    cell.style.mixBlendMode = 'multiply';
  };
  /* the composed hover keeps the recipe's own hover rule from
     flooding the button UNDER the cells (the cells carry the hover
     paint; the button's background stays LOCKED inline to the rest
     surface only while hovered — an inline style outranks the hover
     rule; the rest fill is untouched). The hover border and the
     hover text ink are untouched: the component's own hover rules
     keep driving them. */
  if (knobs().mode === 'composed') {
    button.addEventListener('pointerenter', () => {
      button.style.background = 'var(--glaphic-button-surface)';
    });
    button.addEventListener('pointerleave', () => { button.style.background = ''; });
  }

  /* RUN STATE — Eliot's rule: the pointer only matters at the SEEDING
     instant. Once a run is seeded it plays to completion autonomously;
     a mouseleave mid-run is SUPPRESSED (it cannot cancel, reschedule
     or drain) and deferred: when the run completes, a leave-in-effect
     (or any later leave) drains normally from that state. No seeding
     on mousemove — only a new click or a fresh enter re-seeds. */
  let timers: number[] = [];
  let litState: number[] | null = null; // the live cell-delay map (runs the drain's wave order)
  let running = false;
  let pendingLeave = false;
  const clearTimers = () => {
    for (const timer of timers) clearTimeout(timer);
    timers = [];
  };
  /* the idle leave-drain: sweep to empty in the state's reverse wave
     order, fresh from the leave moment */
  const drainWave = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimers();
    if (!litState) return; // already empty
    const fillMax = Math.max(...litState);
    for (let i = 0; i < cells.length; i += 1) {
      const off = reduced ? 0 : Math.max(0, fillMax - litState[i]);
      timers.push(window.setTimeout(() => paintEmpty(cells[i]), off));
    }
    litState = null;
  };
  /* COMPOSED resolve = plain hover-off SNAP: no wave choreography —
     the grid resolves back to rest like the flat fill flip (Eliot:
     "the mouse-following fade out may be overkill for just buttons";
     the wave stays reserved for the click). The 80ms cell transition
     still rounds the flip, like the button's own 0.12s ease. */
  const snapEmpty = () => {
    clearTimers();
    for (const cell of cells) paintEmpty(cell);
    litState = null;
  };
  const resolveLeave = () => {
    pendingLeave = false;
    if (knobs().mode === 'composed') snapEmpty();
    else drainWave();
  };
  /* every run schedules its own completion: afterwards (and never
     during) an outstanding leave resolves the resolved state */
  const finishRun = (delay: number) => {
    timers.push(window.setTimeout(() => {
      running = false;
      if (pendingLeave) resolveLeave();
    }, delay));
  };
  /* the wave. CLICK runs: a SECOND wave of the SAME pattern (same
     step, same parity lag, same seed) launches a few rings behind the
     fill and repaints each cell as its front passes: the visible
     state is the annulus band between the two wavefronts; the plain
     click rests empty, the COMPOSED click restores the darker hover
     field. HOVER runs fill paint-by-paint and drain on leave. All
     runs finish on their own clock (see the run-state rule above). */
  const seedWave = (seedCol: number, seedRow: number, paint: 'dark' | 'base') => {
    clearTimers();
    running = true;
    pendingLeave = false;
    const { step, lag, clickStep, trail } = knobs();
    const click = knobs().mode === 'click';
    const composed = knobs().mode === 'composed';
    const waveStep = (click || composed) ? clickStep : step;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* fresh from empty: a re-seed mid-wave doesn't read stale cells */
    for (const cell of cells) paintEmpty(cell);
    const litDelay: number[] = [];
    for (let row = 0; row < SPREAD_ROWS; row += 1) {
      for (let col = 0; col < SPREAD_COLS; col += 1) {
        const dist = Math.abs(col - seedCol) + Math.abs(row - seedRow);
        const odd = (col + row + seedCol + seedRow) % 2 === 1;
        const delay = reduced ? 0 : dist * waveStep + (odd ? lag * waveStep : 0);
        litDelay[row * SPREAD_COLS + col] = delay;
        const cell = cells[row * SPREAD_COLS + col];
        timers.push(window.setTimeout(() => (paint === 'base' ? paintBase(cell) : paintDarker(cell)), delay));
      }
    }
    if (click || composed) {
      /* the undo chase — the same pattern offset by the trail. The
         plain click wipes to empty; the composed wave repaints the
         darker HOVER field behind its front */
      const undo = composed
        ? (cell: HTMLElement) => paintDarker(cell)
        : (cell: HTMLElement) => paintEmpty(cell);
      let maxUndo = trail * waveStep;
      for (let i = 0; i < cells.length; i += 1) {
        const undoDelay = reduced ? trail * waveStep : litDelay[i] + trail * waveStep;
        maxUndo = Math.max(maxUndo, undoDelay);
        timers.push(window.setTimeout(() => undo(cells[i]), undoDelay));
      }
      litState = litDelay;
      finishRun(reduced ? trail * waveStep : maxUndo);
    } else {
      let maxLit = 0;
      for (const d of litDelay) maxLit = Math.max(maxLit, d);
      litState = litDelay;
      finishRun(reduced ? 0 : maxLit);
    }
  };
  /* the seed rule: the NEAREST GRID POINT to the pointer's actual
     position — the click point for click mode, the entry point for
     hover mode (which lands near the edges, so the corner anchoring
     comes for free), and a random interior cell for the mouse-less
     fallback */
  const seedNearest = (ev: PointerEvent) => {
    const box = host.getBoundingClientRect();
    const col = Math.min(SPREAD_COLS - 1, Math.max(0, Math.floor(((ev.clientX - box.left) / box.width) * SPREAD_COLS)));
    const row = Math.min(SPREAD_ROWS - 1, Math.max(0, Math.floor(((ev.clientY - box.top) / box.height) * SPREAD_ROWS)));
    return { col, row };
  };
  const seedRandom = () => ({
    col: 1 + Math.floor(Math.random() * (SPREAD_COLS - 2)),
    row: 1 + Math.floor(Math.random() * (SPREAD_ROWS - 2)),
  });
  /* COMPOSED: pointerenter seats the WHOLE grid at the darker paint
     at once (Eliot: "just does the whole background grid as the
     darker color");
     pointerdown runs the base-color wave through the darker field;
     the leave snaps back to rest (no wave) */
  const gridWash = (seedCol: number, seedRow: number) => {
    clearTimers();
    running = false; // paints instantly — idle-with-state, not a timed run
    for (const cell of cells) paintDarker(cell); // the instant seat
  };
  button.onpointerenter = (ev) => {
    pendingLeave = false;
    const { mode } = knobs();
    if (mode === 'enter') { const s = seedNearest(ev); seedWave(s.col, s.row, 'dark'); }
    if (mode === 'random') { const s = seedRandom(); seedWave(s.col, s.row, 'dark'); }
    if (mode === 'composed') { const s = seedNearest(ev); gridWash(s.col, s.row); }
  };
  /* the leave is DEFERRED while a run is in flight: the run state
     machine resolves at completion; idle leaves resolve immediately */
  button.onpointerleave = () => {
    if (running) {
      pendingLeave = true;
      return;
    }
    resolveLeave();
  };
  button.onpointerdown = (ev) => {
    const { mode } = knobs();
    if (mode === 'click') { const s = seedNearest(ev); seedWave(s.col, s.row, 'dark'); }
    if (mode === 'composed') { const s = seedNearest(ev); seedWave(s.col, s.row, 'base'); }
  };
}

class LabSpreadButton extends LitElement {
  static properties = {
    mode: { type: String, reflect: true },
    waveStep: { type: Number, reflect: true, attribute: 'wave-step' },
    lagRings: { type: Number, reflect: true, attribute: 'lag-rings' },
    clickStep: { type: Number, reflect: true, attribute: 'click-step' },
    undoTrail: { type: Number, reflect: true, attribute: 'undo-trail' },
    color: { type: String },
    chamfered: { type: Boolean, reflect: true },
  };
  declare mode: string;
  declare waveStep: number;
  declare lagRings: number;
  declare clickStep: number;
  declare undoTrail: number;
  declare color: string;
  declare chamfered: boolean;
  constructor() {
    super();
    this.mode = 'enter';
    this.waveStep = SPREAD_WAVE_STEP_MS;
    this.lagRings = SPREAD_LAG_RINGS;
    this.clickStep = SPREAD_CLICK_STEP_MS;
    this.undoTrail = SPREAD_UNDO_TRAIL_RINGS;
    this.color = 'secondary';
    this.chamfered = false;
  }
  protected firstUpdated() {
    const button = this.shadowRoot!.querySelector('glaphic-button') as GlaphicButton;
    // the inner button's shadow must exist before the grid can ride in
    customElements.whenDefined('glaphic-button').then(() => {
      if (button.shadowRoot) {
        requestAnimationFrame(() => decorateSpreadButton(button, () => ({
          mode: (this.mode || 'enter') as SpreadMode,
          step: this.waveStep,
          lag: this.lagRings,
          clickStep: this.clickStep,
          trail: this.undoTrail,
        })));
      }
    });
  }
  static styles = css`:host { display: inline-block; width: 134px; }`;
  render() {
    if (this.mode === 'composed') {
      /* the composed recipe: a SOLID button whose hover fill is
         LOCKED to the rest surface while hovered (see the decorate
         pass) so the recipe's hover rule floods nothing under the
         cells; the hover border and the hover text ink are
         untouched: the component's own hover rules keep driving
         them, so the label flips to the recipe's hover ink exactly
         like the real hover does */
      return html`<glaphic-button color=${this.color || 'primary'} size="lg"
        ?chamfered=${this.chamfered}>engage</glaphic-button>`;
    }
    return html`<glaphic-button variant="outline" color="secondary" size="lg"
      style="--glaphic-button-hover-surface: transparent">engage</glaphic-button>`;
  }
}
customElements.define('lab-spread-button', LabSpreadButton);

/* SPREAD — the grid fill wave, moved into the Button section
   (Eliot: "which we should probably move into button section also").
   Sidebar-visible: the knobs and the live interaction are the point. */
export const Spread: StoryObj = {
  render: () => html`
    <div style="max-width:640px" @input=${(e: Event) => {
      const panel = e.currentTarget as HTMLElement;
      const read = (knob: string) => (panel.querySelector(`[data-knob="${knob}"]`) as HTMLInputElement).value;
      const values: Record<string, string> = { 'wave-step': read('wave-step'), 'lag-rings': read('lag-rings'), 'click-step': read('click-step'), 'undo-trail': read('undo-trail') };
      // the live value readout beside each track (the unit baked in)
      const UNITS: Record<string, string> = { 'wave-step': 'ms', 'click-step': 'ms', 'lag-rings': '', 'undo-trail': '' };
      for (const knob of Object.keys(values)) {
        (panel.querySelector(`[data-out="${knob}"]`) as HTMLElement).textContent = values[knob] + UNITS[knob];
      }
      panel.querySelectorAll('lab-spread-button').forEach((wrapper) => {
        for (const [knob, value] of Object.entries(values)) wrapper.setAttribute(knob, value);
      });
    }}>
      <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
        <label>click wave step
          <input data-knob="click-step" type="range" min="25" max="100" step="5" value="40">
          <output data-out="click-step" style="font:600 12px/1 var(--glaphic-font-family-mono, monospace)">40ms</output>
        </label>
        <label>undo trail (rings)
          <input data-knob="undo-trail" type="range" min="0.5" max="5" step="0.5" value="3.5">
          <output data-out="undo-trail" style="font:600 12px/1 var(--glaphic-font-family-mono, monospace)">3.5</output>
        </label>
        <label>hover wave step
          <input data-knob="wave-step" type="range" min="60" max="160" step="5" value="90">
          <output data-out="wave-step" style="font:600 12px/1 var(--glaphic-font-family-mono, monospace)">90ms</output>
        </label>
        <label>parity lag (rings)
          <input data-knob="lag-rings" type="range" min="0" max="6" step="1" value="0">
          <output data-out="lag-rings" style="font:600 12px/1 var(--glaphic-font-family-mono, monospace)">0</output>
        </label>
      </div>
      <div style="display:flex;gap:16px;align-items:flex-end">
        <div>
          <span class="demo-specline">ENTER — seed = nearest grid point to the entry point</span>
          <div style="margin-top:6px"><lab-spread-button mode="enter"></lab-spread-button></div>
        </div>
        <div>
          <span class="demo-specline">CLICK — a chasing undo wave wipes the fill: the band travels, the end rests empty</span>
          <div style="margin-top:6px"><lab-spread-button mode="click"></lab-spread-button></div>
        </div>
        <div>
          <span class="demo-specline">RANDOM SEED — an interior cell, no mouse detection</span>
          <div style="margin-top:6px"><lab-spread-button mode="random"></lab-spread-button></div>
        </div>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #d8dcd0">
        <span class="demo-specline">COMPOSED — hover = the recipe's OWN hover paint (ink-black on primary, deep red on danger) as a full grid wash, label to its hover ink; click = the recipe's REST base (fluro / danger-base) waves through, the undo tail repainting the hover paint behind it</span>
        <div style="display:flex;gap:16px;align-items:flex-end;margin-top:8px">
          <div>
            <span class="demo-specline">primary</span>
            <div style="margin-top:6px"><lab-spread-button mode="composed" color="primary"></lab-spread-button></div>
          </div>
          <div>
            <span class="demo-specline">danger</span>
            <div style="margin-top:6px"><lab-spread-button mode="composed" color="danger"></lab-spread-button></div>
          </div>
          <div>
            <span class="demo-specline">chamfered (observation)</span>
            <div style="margin-top:6px"><lab-spread-button mode="composed" color="primary" chamfered></lab-spread-button></div>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Eliot\'s spread effect, on a real glaphic-button (outline secondary — the frames read red ink on a transparent body): an 8×5 grid of paper-deep cells (17×11 pitch in the frames) lights in a checkerboard wave seeded at the NEAREST GRID POINT to the pointer — the entry point, the press point, or a random interior cell. CLICK is MUI\'s ripple with the undo REWORKED: a second wave of the SAME pattern (same seed) launches the "undo trail" rings behind the fill (Eliot tuned 3.5) and un-lights each cell as its front passes — the visible state is the lit annulus band between the two traveling wavefronts, and the resting end-state is empty with nothing scheduled at the end. Click keeps its OWN faster step (Eliot tuned 40ms/ring against hover\'s 90). THE SEAMLESS WASH: the pixels abut with no gap — the earlier 1px cell gap (the "thin grid" read) was found to be the visible-grid malfunction\'s cause (a lattice of the rest color showing through the wash) and is out (Eliot, 2026-10-19); the wavefront always travels somewhere you can see it. The COMPOSED row (primary + danger + a chamfered observation) layers the real interaction: HOVER seats the WHOLE grid at the recipe\'s darker paint at once (the button\'s background is locked inline to the rest paint only while hovered, so the recipe\'s hover rule floods nothing under the grid; the hover border and the hover label ink still flip via the component\'s own hover rules) — and CLICK launches the base-color wave seeded at the nearest grid point, painting cells at the recipe\'s REST surface (fluro on primary, danger-base on danger — the base color flashing through the darker field) with the undo twin following the trail rings behind and REPINTING the darker field, so the click rests back on the full darker grid while hover is still held. A mouseleave mid-run changes NOTHING at the moment it happens: runs complete on their own clock (pointer position only matters at the seeding instant); on COMPOSED the leave then resolves by plain hover-off SNAP (Eliot: "the mouse following fade out may be overkill for just buttons"; the wave stays reserved for the click), while the ENTER/CLICK/RANDOM rows keep their exploratory reverse-wave drains, after completion when the leave landed mid-run. FLAG: on primary the hover ink IS fluro, so the label blanks against the fluro rest surface as it passes through (danger rides clean — pink ink on the red field). CHAMFERED remains UNCERTAIN: the grid clips to the silhouette (corner cells slice into triangles) and the wash seals into a solid ink shape. The four sliders retune every button live (each with its own numeric readout); the two pattern knobs shape solidity — parity lag defaults to 0 for the SOLID button-usable read, the frames\' checkered hole texture is one slider away. Reduced motion lights everything at once. NOTE: this lives as a decorated real button here, NOT yet built into the component — the per-family rollout (outline/secondary first, chamfer close, primary\'s own decision, text never) and the open policies (keyboard = center seed, touch = plain mode, re-click restarts, reduced-motion snap) await Eliot\'s word. Draft copy.',
      },
    },
  },
};
