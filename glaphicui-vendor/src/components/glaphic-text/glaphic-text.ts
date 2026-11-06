import { LitElement, css, html } from 'lit';

/** fibonacci spacings — the ladder holds 9 copies (cumulative 88px) */
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34];

/** infinite's fade — copies past the ninth keep dissolving toward ~3% */
const FADE = [64, 56, 48, 40, 32, 25, 18, 12, 8];
const fade = (i: number) => (i < FADE.length ? FADE[i] : Math.max(3, Math.round(FADE[FADE.length - 1] * Math.pow(0.85, i - FADE.length + 1))));

/** the six march directions, shared by both shadow variants */
const AXES = ['x+', 'y+', 'y-', 'xy', 'x+-', 'y+-'];

/**
 * glaphic-text — display text treatments (spec `.knock` et al).
 * Furniture: shadow DOM, slot for the copy. Sizing, weight, case and
 * tracking are the consumer's job (set font-size on the element
 * itself); the variants supply only the treatment.
 *
 * One text color runs the element (--glaphic-text-ink): the plain
 * glyphs' color, and the ink every treatment pulls from. The only
 * other color is the shadow's (--glaphic-text-shadow-ink, shared by
 * infinite + echo), so a shadow can read apart from its text.
 *
 * 'glass' — the one stencil treatment (spec .knock, taken wider):
 * transparent glyphs held barely readable by a 1.2px stroke + a
 * whisper of the text color — glass over the plate. The stroke takes
 * its own color (--glaphic-text-stroke) and width
 * (--glaphic-text-stroke-width). With `no-stroke` the outline drops
 * and the text color fills alone, bared (30% whisper).
 * --glaphic-text-glass-fill retunes the whisper depth for both.
 *
 * 'infinite' — the dissolving drop shadow: copies of the glyph, each
 * fainter — ink washing into the ground. 'echo' — the repeat at full
 * ink. Both are pointed by `axis` (x+ · y+ · y- · xy · x+- · y+-;
 * default xy on infinite, y+ for echo) and spaced by `step`: 'fib'
 * (the ladder 1·1·2·3·5·8·13·21·34, cumulative — the default) or a
 * fixed px distance (1·3·5·9·18·36·64). `copies` (1·3·5·9·18·36,
 * default 9) truncates the stack — on the fib ladder it holds 9, its
 * full length.
 *
 * Tier-2: --glaphic-text-ink · --glaphic-text-font ·
 *         --glaphic-text-stroke · --glaphic-text-stroke-width ·
 *         --glaphic-text-glass-fill · --glaphic-text-cut ·
 *         --glaphic-text-shadow-ink
 */
export class GlaphicText extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    /** glass only: hold the ink whisper (default) or bare the tint alone */
    noStroke: { type: Boolean, reflect: true, attribute: 'no-stroke' },
    /** march direction for both shadows: x+ · y+ · y- · xy · x+- · y+-
     *  (default xy on infinite, y+ on echo) */
    axis: { type: String },
    /** spacing between copies: 'fib' (default — the ladder) or a fixed
     *  px distance (1 · 3 · 5 · 9 · 18 · 36 · 64) */
    step: { type: String },
    /** copy count (1 · 3 · 5 · 9 · 18 · 36; default 9) — the fib
     *  ladder holds 9, its full length */
    copies: { type: String },
  };
  /** 'plain' (default) | 'glass' | 'infinite' | 'echo' */
  declare variant: string;
  declare noStroke: boolean;
  declare axis: string;
  declare step: string;
  declare copies: string;

  constructor() {
    super();
    this.variant = 'plain';
    this.noStroke = false;
    this.axis = '';
    this.step = '';
    this.copies = '';
  }

  static styles = css`
    :host {
      display: block;
      font: var(--glaphic-text-font, 800 54px/1 var(--f-disp, 'Plus Jakarta Sans', sans-serif));
      /* case and tracking stay the consumer's job — the host forces nothing */
      color: var(--glaphic-text-ink, var(--ink, #17140E));
    }
    :host([variant='glass']) {
      /* the glass pane: transparent glyphs, stroke held, the text
         color at a whisper behind it (spec .knock). stroke color +
         width split — the old single shorthand token ate bare colors:
         an invalid shorthand drops the whole rule and the stroke
         vanishes entirely */
      color: transparent;
      -webkit-text-fill-color: color-mix(in srgb, var(--glaphic-text-ink, var(--ink, #17140E)) calc(var(--glaphic-text-glass-fill, 16) * 1%), transparent);
      -webkit-text-stroke-width: var(--glaphic-text-stroke-width, 1.2px);
      -webkit-text-stroke-color: var(--glaphic-text-stroke, var(--glaphic-text-ink, var(--ink, #17140E)));
      opacity: var(--glaphic-text-cut, var(--cut, .93));
    }
    /* glass bare of its stroke: the outline drops and the text color
       fills alone, bared — a stronger whisper for the clear heading */
    :host([variant='glass'][no-stroke]) {
      -webkit-text-stroke-width: 0;
      -webkit-text-fill-color: color-mix(in srgb, var(--glaphic-text-ink, var(--ink, #17140E)) calc(var(--glaphic-text-glass-fill, 30) * 1%), transparent);
    }
  `;

  /** shadow stack for infinite (fading) and echo (full ink) — copied
   *  off the fib ladder (truncated by `copies`) or a fixed `step`
   *  distance, pointed by `axis`. Both ride the one shadow ink, apart
   *  from the glyph's --glaphic-text-ink. */
  private shadowList(kind: 'infinite' | 'echo'): string {
    const count = Number(this.copies);
    const distance = Number(this.step);
    const fib = this.step === '' || this.step === 'fib' || Number.isNaN(distance);
    const n = Math.max(1, fib ? Math.min(count || FIB.length, FIB.length) : count || FIB.length);
    let acc = 0;
    const offsets = fib
      ? FIB.slice(0, n).map((rung) => (acc += rung)) // cumulative — 1·2·4·7·12·20·33·54·88
      : Array.from({ length: n }, (_, i) => distance * (i + 1));
    const ink = 'var(--glaphic-text-shadow-ink, var(--glaphic-text-ink, var(--ink, #17140E)))';
    const alpha = (i: number) => (kind === 'infinite' ? fade(i) : 100);
    const stack = (dx: number, dy: number, i: number) =>
      `color-mix(in srgb, ${ink} ${alpha(i)}%, transparent) ${dx}px ${dy}px`;
    const dir = AXES.includes(this.axis) ? this.axis : kind === 'infinite' ? 'xy' : 'y+';
    const shadows: string[] = [];
    for (let i = 0; i < n; i++) {
      const o = offsets[i];
      if (dir === 'x+') shadows.push(stack(o, 0, i));
      else if (dir === 'y+') shadows.push(stack(0, o, i));
      else if (dir === 'y-') shadows.push(stack(0, -o, i));
      else if (dir === 'x+-') shadows.push(stack(o, 0, i), stack(-o, 0, i));
      else if (dir === 'y+-') shadows.push(stack(0, o, i), stack(0, -o, i));
      else shadows.push(stack(o, o, i)); // xy — the poster diagonal
    }
    return shadows.join(', ');
  }

  render() {
    /* the stack lives here in render, not stamped imperatively in
       updated() — a Storybook re-render patches this element's style
       attribute and an imperative text-shadow would be wiped with
       nothing to re-apply it (variant/axis changes aside, the ink
       knobs move no reactive property at all) */
    const shadow =
      this.variant === 'infinite' || this.variant === 'echo'
        ? `text-shadow:${this.shadowList(this.variant as 'infinite' | 'echo')};`
        : '';
    /* <slot> only — the copy is slotted light content; text-shadow
       inherits from the slot through to the glyphs */
    return html`<slot style=${shadow}></slot>`;
  }
}

customElements.define('glaphic-text', GlaphicText);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-text': GlaphicText;
  }
}