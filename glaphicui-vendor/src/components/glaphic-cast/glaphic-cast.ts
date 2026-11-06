import { css, html } from 'lit';
import { GlaphicLightElement } from '../../base/light-dom.js';

/** the mode attribute's legal values */
export type CastMode = 'multiply' | 'flat';
const CAST_MODES: Record<CastMode, true> = { multiply: true, flat: true };

/* ────────────────────────────────────────────────────────────────
   glaphic-cast — the CAST treatment (was Lab/Force's light source):
   the pointer treated as a light source over a stepped-shadow
   headline. The core glyphs are ink; behind them the same glyphs
   repeat five times, each a hard-edged shadow layer at the design
   ladder (1,1)(2,2)(4,4)(7,7)(12,12) — no blur, no alpha:
   · multiply (default) — every layer is ink-black WEIGHTED via
     multiply: the layer color is lerp(#ffffff, #0d0221, w) computed
     per weight (w .64/.56/.48/.40/.32 over paper), so
     mix-blend-mode: multiply paints exactly "ink at w" — layers
     overlap and the pooling reads like the stacked-alpha ladder.
   · flat — each layer a flat ink off the token ramp (ink-black near
     → grey-cool-400 far); overlap-safe, the ladder reads at the
     fringes.
   The shadow falls in the direction AWAY from the pointer and
   stretches with distance (light overhead → the ladder collapses to
   near-zero; light far → the full 12px run). Offsets lerp in a rAF
   loop (exponential approach), so the ladder swings rather than
   snaps; the pose is WALL-CLOCK derived (nothing accumulates), so a
   headless rAF stall jumps instead of drags. Idle light = the
   host's top-left corner. prefers-reduced-motion: the ladder parks
   at the idle pose, no tracking, no loop.
   ──────────────────────────────────────────────────────────────── */
const LADDER_BASES = [1, 2, 4, 7, 12];
/* flat ramp, nearest shadow layer first */
const FLAT_INKS = [
  'var(--glaphic-ink-black, #0d0221)',
  'var(--glaphic-neutral-grey-cool-700, #504c5a)',
  'var(--glaphic-neutral-grey-cool-600, #686474)',
  'var(--glaphic-neutral-grey-cool-500, #817d8f)',
  'var(--glaphic-neutral-grey-cool-400, #9d99ab)',
];
/* multiply-weighted inks: lerp(white, #0d0221, w) per weight, so the
   layer multiplies over paper to "ink at w". Derived from
   --glaphic-ink-black (not consumer-overridable — the weights are
   precomputed against the token's value) */
const MULTIPLY_INKS = ['#655d73', '#787184', '#8b8696', '#9f9aa7', '#b2aeb9'];

const sheet = css`
  glaphic-cast {
    display: block;
    /* Tier-2 defaults; consumer inline overrides win */
    --glaphic-cast-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-cast-size: 48px;
  }
  glaphic-cast .stack {
    display: inline-block;
    position: relative;
    font-family: var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);
    font-weight: 700;
    font-size: var(--glaphic-cast-size, 48px);
    line-height: 1.1;
    letter-spacing: 2px;
  }
  glaphic-cast .shade,
  glaphic-cast .core {
    display: inline-block;
    white-space: pre;
  }
  glaphic-cast .core {
    position: relative;
    color: var(--glaphic-cast-ink);
  }
  glaphic-cast .shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    color: var(--glaphic-cast-ink);
  }
  glaphic-cast[mode='multiply'] .shade {
    /* the weighted-ink multiply — light DOM by rule: a shadow root
       is a blend-isolation boundary, this layer must multiply
       whatever the page holds beneath it */
    mix-blend-mode: multiply;
  }
`;

export class GlaphicCast extends GlaphicLightElement {
  static properties = {
    text: { type: String },
    /** painting: 'multiply' (default, weighted ink layers) | 'flat'
     *  (token ramp) — unknown attribute values clamp to the default */
    mode: {
      converter: (v: string | null) =>
        (v ?? '') in CAST_MODES ? v : 'multiply',
      reflect: true,
    },
    /** stretches the ladder's px bases (1 = the design offsets) */
    scale: { type: Number },
  };
  declare text: string;
  declare mode: CastMode;
  declare scale: number;

  static sheet = sheet.styleSheet!;

  /* current vs target shadow direction, px along away-from-light */
  private current = { x: 5, y: 4 };
  private target = { x: 5, y: 4 };
  private frame = 0;
  private reduce = false;

  constructor() {
    super();
    this.text = 'WHOGGING';
    this.mode = 'multiply';
    this.scale = 1;
  }

  protected override firstUpdated() {
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.poseIdle();
    if (!this.reduce) {
      this.addEventListener('pointermove', this.onMove);
      this.startLoop();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.frame);
  }

  private onMove = (event: PointerEvent) => {
    /* light = the pointer; the shadow direction points AWAY from it */
    const box = this.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    this.aimLight(event.clientX, event.clientY, cx, cy);
  };

  /* idle pose: light parked at the host's top-left corner */
  private poseIdle() {
    const box = this.getBoundingClientRect();
    this.aimLight(box.left, box.top, box.left + box.width / 2, box.top + box.height / 2);
  }

  private aimLight(lx: number, ly: number, cx: number, cy: number) {
    const dx = cx - lx;
    const dy = cy - ly;
    const len = Math.hypot(dx, dy) || 1;
    /* distance factor: light overhead → tight ladder (→0), light
       far → the full 12px ladder (→1) */
    const f = Math.min(1, len / 420);
    this.target = { x: (dx / len) * f, y: (dy / len) * f };
    if (this.reduce) {
      this.current = { ...this.target };
      this.apply();
    }
  }

  private startLoop = () => {
    this.frame = requestAnimationFrame(() => {
      /* exponential lerp toward the target pose */
      const k = 0.18;
      this.current.x += (this.target.x - this.current.x) * k;
      this.current.y += (this.target.y - this.current.y) * k;
      this.apply();
      this.startLoop();
    });
  };

  private apply() {
    const shades = this.querySelectorAll<HTMLElement>('.shade');
    shades.forEach((shade, i) => {
      const base = LADDER_BASES[i] ?? 0;
      /* the design offsets are px (1..12); scale is the knob */
      const dx = (this.current.x * base * this.scale).toFixed(2);
      const dy = (this.current.y * base * this.scale).toFixed(2);
      shade.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  render() {
    const shades = Array.from({ length: LADDER_BASES.length }, (_, i) => html`
      <span class="shade" aria-hidden="true" style="color: ${this.mode === 'flat' ? FLAT_INKS[i] : MULTIPLY_INKS[i]}">${this.text}</span>
    `);
    return html`
      <span class="stack">
        ${shades}
        <span class="core">${this.text}</span>
      </span>
    `;
  }
}

customElements.define('glaphic-cast', GlaphicCast);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-cast': GlaphicCast;
  }
}