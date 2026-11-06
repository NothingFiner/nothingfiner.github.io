import { css, html } from 'lit';
import { GlaphicLightElement } from '../../base/light-dom.js';

/** the trigger attribute's legal values */
export type FanTrigger = 'click' | 'hover';
const FAN_TRIGGERS: Record<FanTrigger, true> = { click: true, hover: true };

/* ────────────────────────────────────────────────────────────────
   glaphic-fan — the FAN treatment (was Lab/Force's shadow fan):
   a core headline in fluro; behind it the same glyphs repeat EIGHT
   times fanned symmetrically up and down — rings at dy ±18 ±36 ±54
   ±72, the ink weights stepping 0.64 / 0.56 / 0.48 / 0.40 outward,
   hard-edged, no blur, no alpha (the ink weights ride the same
   lerp(#ffffff, #0d0221, w) multiply layers the cast treatment
   builds). The frame's shadow ink read #17140E — not a token — so
   the layers derive from --glaphic-ink-black; the literal stays
   noted for Eliot.

   ONE READER — BLOOM (Eliot's verdict: "only the bloom hover one is
   good; the staged ones all look bad" — the staged/spawn reading
   died with the lab): the ladder hangs at rest tucked behind the
   core (the opaque fluro glyphs hide it exactly), and ONE eased
   value scales every ring's offset 0→full together on the trigger,
   collapsing back through the same ease. 'click' toggles
   fan-out/fan-in; 'hover' fans on enter and collapses on leave.
   Timelines are WALL CLOCK (now − phase start), so a headless rAF
   stall jumps instead of drags. prefers-reduced-motion: the ladder
   parks full and the trigger flips instantly (no run).
   ──────────────────────────────────────────────────────────────── */
/* the fan's rings: dy step × ring index, weight per ring (outward) */
const FAN_DY = 18;
const FAN_WEIGHTS = [0.64, 0.56, 0.48, 0.4];
/* per-ring colors: lerp(white, #0d0221, w) over paper — the cast
   treatment's multiply ladder, four rungs in */
const FAN_INKS = ['#655d73', '#787184', '#8b8696', '#9f9aa7'];

/* the sample string from Eliot's reference frame (demo copy) */
const FAN_SAMPLE = 'OVOWOVOWOLVOWOVO';

const sheet = css`
  glaphic-fan {
    display: block;
    /* Tier-2 defaults; consumer inline overrides win */
    --glaphic-fan-core-ink: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-fan-size: 48px;
  }
  glaphic-fan .stack {
    display: inline-block;
    position: relative;
    font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', sans-serif);
    font-weight: 700;
    font-size: var(--glaphic-fan-size, 48px);
    line-height: 1.15;
    letter-spacing: 2px;
  }
  glaphic-fan .shade,
  glaphic-fan .core {
    display: inline-block;
    white-space: pre;
  }
  glaphic-fan .core {
    position: relative;
    color: var(--glaphic-fan-core-ink);
  }
  glaphic-fan .shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    color: var(--glaphic-ink-black, #0d0221);
    /* flagged ink: the frame's shadow ink is #17140E — not a token;
       the layers above derive from --glaphic-ink-black (see prose) */
    mix-blend-mode: multiply;
  }
  @media (prefers-reduced-motion: reduce) {
    glaphic-fan {
      cursor: default;
    }
  }
`;

export class GlaphicFan extends GlaphicLightElement {
  static properties = {
    text: { type: String },
    /** 'click' (toggle) | 'hover' (enter fans — leave collapses) —
     *  unknown attribute values clamp to the default */
    trigger: {
      converter: (v: string | null) =>
        (v ?? '') in FAN_TRIGGERS ? v : 'click',
      reflect: true,
    },
  };
  declare text: string;
  declare trigger: FanTrigger;

  static sheet = sheet.styleSheet!;

  private open = false;
  /* per-ring materialize progress, 0 (tucked behind the core) → 1 */
  private ring: number[] = FAN_WEIGHTS.map(() => 0);
  /* the pose values captured when the current phase began (the
     collapse comes back from wherever the fan is) */
  private from: number[] = [];
  private phaseStart = 0;
  private frame = 0;
  private reduce = false;

  constructor() {
    super();
    this.text = FAN_SAMPLE;
    this.trigger = 'click';
  }

  protected override firstUpdated() {
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.trigger === 'hover') {
      this.addEventListener('pointerenter', () => this.setPose(true));
      this.addEventListener('pointerleave', () => this.setPose(false));
    } else {
      this.addEventListener('click', () => this.setPose(!this.open));
    }
    if (this.reduce) {
      /* reduced motion: park the full ladder, flips are instant */
      this.ring = FAN_WEIGHTS.map(() => 1);
      this.paint();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.frame);
  }

  private setPose(open: boolean) {
    this.open = open;
    this.from = [...this.ring];
    this.phaseStart = performance.now();
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const el = now - this.phaseStart;
    const open = 500; /* the bloom's single run, ms */
    /* bloom: one eased value drives every ring at once. WALL CLOCK
       (now - phaseStart), so a headless rAF stall can't stretch the
       pose — it jumps, it doesn't drag */
    this.ring = FAN_WEIGHTS.map((_, r) => {
      if (this.open) return this.ease(Math.min(1, el / open));
      return (this.from[r] ?? 1) * (1 - this.ease(Math.min(1, el / (open - 100))));
    });
    this.paint();
    const settled = this.ring.every((m) => (this.open ? m >= 1 : m <= 0));
    this.frame = settled ? 0 : requestAnimationFrame(this.tick);
  };

  /* the copies travel from behind the core (dy 0, hidden by the
     opaque fluro glyphs) out to their ring */
  private ease(m: number) {
    return 1 - Math.pow(1 - m, 3);
  }

  private paint() {
    const shades = this.querySelectorAll<HTMLElement>('.shade');
    shades.forEach((shade) => {
      const ringIndex = Number(shade.dataset.ring ?? 0);
      const up = shade.dataset.up === 'up';
      const dy = (up ? -1 : 1) * FAN_DY * (ringIndex + 1) * this.ease(this.ring[ringIndex] ?? 0);
      shade.style.transform = `translateY(${dy.toFixed(2)}px)`;
    });
  }

  render() {
    const shades = Array.from({ length: FAN_WEIGHTS.length * 2 }, (_, i) => {
      const ringIndex = Math.floor(i / 2);
      const up = i % 2 === 0;
      return html`<span
        class="shade"
        aria-hidden="true"
        data-ring="${ringIndex}"
        data-up="${up ? 'up' : 'down'}"
        style="color: ${FAN_INKS[ringIndex]}"
        >${this.text}</span
      >`;
    });
    return html`
      <span class="stack">${shades}<span class="core">${this.text}</span></span>
    `;
  }
}

customElements.define('glaphic-fan', GlaphicFan);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-fan': GlaphicFan;
  }
}