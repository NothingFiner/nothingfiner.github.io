import { LitElement, css, type PropertyValues } from 'lit';

/** the fibonacci ladder the pattern runs climb */
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
/** where a pattern stops climbing and the tail takes over */
const LIMIT = 377;

type Seg = { w: number; fill: boolean };

/**
 * Build one pattern's segment list: alternating (solid, gap) runs. The
 * alternation always runs to the limit — a run that would pass it is
 * clamped at 377px — and from there the tail kind holds: full ink
 * ('solid') or bare space ('space'), via the host's background color.
 */
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
      segs.push({ w: LIMIT - pos, fill: false }); // clamped at the limit
      return segs;
    }
    segs.push({ w: gap, fill: false });
    pos += gap;
  }
  return segs;
};

const zip = (solids: number[], gaps: number[]): [number, number][] =>
  solids.map((solid, i) => [solid, gaps[i] ?? 0]);

/** swell: solid and gap both climb the ladder — rest full ink */
const SWELL = buildPattern(
  FIB.filter((_, i) => i % 2 === 0).map((solid, i) => [solid, FIB[i * 2 + 1]]),
  'solid',
);
/** pulse: 5px pulses, gaps climb the ladder — rest space */
const PULSE = buildPattern(FIB.map((gap) => [5, gap]), 'space');
/** ramp: solids climb the ladder, gaps fixed 3px — rest full ink */
const RAMP = buildPattern(FIB.map((solid) => [solid, 3]), 'solid');
/** decay-55: gaps decay 55 → 1 while solids climb — rest full ink */
const DECAY55 = buildPattern(
  zip([1, 1, 2, 3, 5, 8, 13, 21, 34, 55], [55, 34, 21, 13, 8, 5, 3, 2, 1]),
  'solid',
);
/** decay-34: the decay-55 shape starting from 34 — rest full ink */
const DECAY34 = buildPattern(
  zip([1, 1, 2, 3, 5, 8, 13, 21, 34], [34, 21, 13, 8, 5, 3, 2, 1]),
  'solid',
);

/**
 * glaphic-tape — hazard tape (spec `.tape`). Furniture: shadow DOM.
 * Size ladder s/m/l scales the stripe pitch off the Tier-1 grid
 * pitch --hz; an explicit --glaphic-tape-pitch beats all of them.
 *
 * `pattern` swaps the repeating ladder for one of the fibonacci
 * runs — swell · pulse · ramp · decay-55 · decay-34. Each is a built
 * alternation holding to 377px — a run that would pass the limit is
 * clamped there — with the last stop holding the tail: full ink,
 * or bare space for pulse. A pattern sets its own background image;
 * the size ladder's pitch only matters without one
 * (--glaphic-tape-height still scales every pattern).
 *
 * Tier-2: --glaphic-tape-height · --glaphic-tape-radius · --glaphic-tape-pitch ·
 *         --glaphic-tape-hot
 */
export class GlaphicTape extends LitElement {
  static properties = {
    size: { type: String, reflect: true },
    pattern: { type: String, reflect: true },
  };
  declare size: 's' | 'm' | 'l';
  declare pattern: string;

  constructor() {
    super();
    /** 's' | 'm' (default) | 'l' */
    this.size = 'm';
    /** repeating ladder | a fibonacci pattern name */
    this.pattern = '';
  }

  static styles = css`
    :host {
      display: block;
      height: var(--glaphic-tape-height, 16px);
      border-radius: var(--glaphic-tape-radius, var(--r, 1.9px));
      background: repeating-linear-gradient(
        45deg,
        var(--glaphic-tape-hot, var(--hot, #E03A0B)) 0 calc(var(--glaphic-tape-pitch, var(--hz, 18px)) * 0.38),
        transparent calc(var(--glaphic-tape-pitch, var(--hz, 18px)) * 0.38) var(--glaphic-tape-pitch, var(--hz, 18px))
      );
    }
    :host([size='s']) { --glaphic-tape-pitch: calc(var(--hz, 18px) * 0.55); }
    :host([size='m']) { --glaphic-tape-pitch: var(--hz, 18px); }
    :host([size='l']) { --glaphic-tape-pitch: calc(var(--hz, 18px) * 1.8); }
  `;

  /**
   * Pattern runs are horizontal, so an explicit stops list is built
   * per instance and painted as the background image (non-repeating).
   * The tail needs nothing extra: a linear gradient's last stop holds
   * to the edge, so the alternation's final run — full ink or bare
   * space — carries the rest of the band by itself.
   */
  private paintPattern(pattern: string) {
    const segs = { swell: SWELL, pulse: PULSE, ramp: RAMP, 'decay-55': DECAY55, 'decay-34': DECAY34 }[pattern];
    if (!segs) return false; // unknown name — the ladder stands
    const ink = 'var(--glaphic-tape-hot, var(--hot, #E03A0B))';
    let pos = 0;
    const stops = segs.map((seg) => {
      const a = pos;
      pos += seg.w;
      return `${seg.fill ? ink : 'transparent'} ${a}px ${pos}px`;
    });
    this.style.backgroundImage = `linear-gradient(to right, ${stops.join(', ')})`;
    this.style.backgroundRepeat = 'no-repeat';
    return true;
  }

  protected override updated(changed: PropertyValues) {
    if (!changed.has('pattern')) return;
    if (!this.paintPattern(this.pattern)) {
      this.style.removeProperty('background-image');
      this.style.removeProperty('background-repeat');
    }
  }

  render() {
    /* host carries the whole visual; no template DOM */
    return null;
  }
}

customElements.define('glaphic-tape', GlaphicTape);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-tape': GlaphicTape;
  }
}