import { css, html, LitElement, type PropertyValues } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../components/glaphic-tape/glaphic-tape.js';

/* THE ANIMATION LAB — one parked pose. The grid fill wave moved into
   the Button section (Controls/Button — Eliot's call: "we should
   probably move into button section also"); the lab winners already
   graduated to their own elements under Foundations/Typography.
   NOTHING here is wired into index.ts. Sidebar-visible so the
   interaction can be played live. */

const meta: Meta = {
  title: 'Lab/Tape',
  tags: ['autodocs'], // so the per-story descriptions render (Draft copy. for review)
};
export default meta;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;


/* ── Parked — TAPE GROW-OUT ─────────────────────────────────────────
   the fibonacci tape GROWS OUT. NOT a graduated treatment — Eliot
   parked it in the Lab (the fan's staged siblings were killed; this
   one survives there, not as a component). The lab element rides
   along in this file so Lab/Force's retirement still keeps the
   pose playable. ──────────────────────────────────────────────── */
/* the fibonacci ladder + builder — copied verbatim from
   glaphic-tape.ts */
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
const LIMIT = 377;
type Seg = { w: number; fill: boolean };
const buildPattern = (pairs: [number, number][], tail: 'solid' | 'space'): Seg[] => {
  const segs: Seg[] = [];
  let pos = 0;
  for (const [solid, gap] of pairs) {
    if (pos >= LIMIT) break;
    const solidW = Math.min(solid, LIMIT - pos);
    segs.push({ w: solidW, fill: true });
    pos += solidW;
    if (pos >= LIMIT) break;
    if (pos + gap >= LIMIT) {
      segs.push({ w: LIMIT - pos, fill: false });
      return segs;
    }
    segs.push({ w: gap, fill: false });
    pos += gap;
  }
  return segs;
};
const zip = (solids: number[], gaps: number[]): [number, number][] =>
  solids.map((solid, i) => [solid, gaps[i] ?? 0]);
const patterns: Record<string, [number, number][]> = {
  /* swell: solid and gap both climb the ladder */
  swell: FIB.filter((_, i) => i % 2 === 0).map((solid, i) => [solid, FIB[i * 2 + 1] ?? 0]),
  /* pulse: 5px pulses, gaps climb the ladder */
  pulse: FIB.map((gap) => [5, gap]),
  /* decay-55: gaps decay 55 → 1 while solids climb */
  'decay-55': zip([1, 1, 2, 3, 5, 8, 13, 21, 34, 55], [55, 34, 21, 13, 8, 5, 3, 2, 1]),
};

class LabTapeGrow extends LitElement {
  static properties = {
    pattern: { type: String, reflect: true },
    /** gaps grown (default pose grows once on first paint) */
    grown: { type: Boolean, reflect: true },
  };
  declare pattern: string;
  declare grown: boolean;

  /** current gap widths, interpolated per frame (target = full run) */
  private gaps: number[] = [];
  private segs: Seg[] = [];
  private frame = 0;
  private clock = 0;

  constructor() {
    super();
    this.pattern = 'pulse';
    this.grown = false;
  }

  static styles = css`
    :host {
      display: block;
      height: var(--glaphic-tape-height, 16px);
      border-radius: var(--glaphic-tape-radius, 1.9px);
      cursor: pointer;
    }
  `;

  protected override willUpdate(changed: PropertyValues) {
    const pairs = patterns[this.pattern];
    if (!pairs) return;
    this.segs = buildPattern(pairs, 'space');
    if (changed.has('pattern')) {
      /* a pattern swap restarts from the collapsed pose */
      this.gaps = this.segs.filter((seg) => !seg.fill).map(() => 0);
      this.clock = 0;
      this.grown = false;
    }
  }

  protected override updated(changed: PropertyValues) {
    /* restart the grow loop whenever the pose is toggled */
    if (changed.has('grown')) {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  protected override firstUpdated() {
    this.addEventListener('click', () => {
      this.grown = !this.grown;
    });
    /* the intro: grow once shortly after the first paint */
    setTimeout(() => {
      this.grown = true;
    }, 400);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.frame);
  }

  private tick = (now: number) => {
    const dt = this.clock ? Math.min(48, now - this.clock) : 16;
    this.clock = now;
    const target = this.grown ? 1 : 0;
    /* per-gap exponential approach: earlier gaps ease faster, so the
       unroll staggers left-to-right without timeline bookkeeping */
    let moving = false;
    this.gaps = this.gaps.map((gap, i) => {
      const rate = 110 + i * 55; /* ms — earlier gaps land first */
      const next = gap + (target - gap) * (1 - Math.exp(-dt / rate));
      if (Math.abs(target - next) > 0.002) moving = true;
      return next;
    });
    this.paint();
    if (moving) this.frame = requestAnimationFrame(this.tick);
  };

  private paint() {
    const ink = 'var(--glaphic-tape-hot, var(--hot, #E03A0B))';
    let pos = 0;
    let gapIndex = 0;
    const stops = this.segs.map((seg) => {
      const a = pos;
      const w =
        seg.fill
          ? seg.w
          : (() => {
              const cur = this.gaps[gapIndex] ?? 0;
              gapIndex += 1;
              return seg.w * cur; /* eased gap width, 0 → full run */
            })();
      pos += w;
      return `${seg.fill ? ink : 'transparent'} ${a.toFixed(2)}px ${pos.toFixed(2)}px`;
    });
    this.style.backgroundImage = `linear-gradient(to right, ${stops.join(', ')})`;
    this.style.backgroundRepeat = 'no-repeat';
  }

  render() {
    return null; /* the host carries the whole visual, like the tape */
  }
}
customElements.define('lab-tape-grow', LabTapeGrow);
declare global {
  interface HTMLElementTagNameMap {
    'lab-tape-grow': LabTapeGrow;
  }
}

export const TapeGrowOut: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:760px; display:grid; gap:5px">
      ${caption('PULSE — gaps climb the ladder out of a solid block (click to collapse)')}
      <lab-tape-grow pattern="pulse"></lab-tape-grow>
      ${caption('SWELL — solid and gap both climb')}
      <lab-tape-grow pattern="swell"></lab-tape-grow>
      ${caption('DECAY-55 — gaps start fat and thin out')}
      <lab-tape-grow pattern="decay-55"></lab-tape-grow>
      ${caption('REFERENCE — the real glaphic-tape at rest')}
      <glaphic-tape pattern="pulse"></glaphic-tape>
      <glaphic-tape pattern="swell"></glaphic-tape>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The fibonacci tape grows out — PARKED in the Lab (not a graduated treatment; it keeps its lab home while the other Force experiments graduated to Foundations/Typography). Every gap starts at 0 and swells to its full run with earlier gaps leading, so the band unrolls out of a solid block of ink. The pattern tables are copied verbatim from glaphic-tape (whose host-level gradient stops cannot transition), so the lab repaints the stop list per frame — gaps settle with per-gap exponential easing, earlier gaps first, and the pose is reversible: click a row to collapse the gaps back to 0, click again to grow. The reference row carries the real glaphic-tape at rest for comparison. Draft copy.',
    },
    },
  },
};