import { LitElement, css, html } from 'lit';

/**
 * glaphic-chip — the new-look mono-caps tag (Figma NewDesigns chips
 * sheet, decoded off Eliot's pasted spec frame). HARD BREAK from the
 * figcut chip: the old rgba-tint defaults and the 5px/9px inline
 * padding are GONE — the spec chips are fixed-height flats with a
 * 1.5px radius.
 *
 * One element, four paint recipes × two bodies:
 * - variant = the paint: 'line' (default — page-ground fill, 1px
 *   ink-black rim, ink-black caps) | 'solid' (ink-black plate,
 *   paper-elevated ink) | 'cyan' (the ink-cyan plate, ink-black rim
 *   and caps) | 'brand' (the ink-brand-dark plate, ink-black rim,
 *   paper-deep ink — decoded off the sheet's red chip).
 * - wide (Boolean) = the trailing icon well: the text segment keeps
 *   its 11px inline padding, then a 1px divider rides the chip's full
 *   height and opens a 26px channel whose square (18×18) is the
 *   `slot="icon"` area — nothing slotted and an aria-hidden
 *   placeholder fill shows instead.
 * - left (Boolean) = the icon well LEADS: the channel (divider rides its
 *   inside-right border) opens before the text — icon left, caps right
 * - multiply (Boolean, default true) = the blend toggles Eliot asked
 *   for. The plate recipes (cyan, brand) run mix-blend-mode:
 *   multiply; line and solid are inert. Lit Boolean attribute:
 *   PRESENCE is on — the constructor carries the default, so
 *   `<glaphic-chip>` blends, and the only way off is the property
 *   (`chip.multiply = false`) or removing the attribute.
 *
 * Flagged off the decode (verify against the live frame when the
 * Figma window reopens):
 * - the small line chips stroke AND ink at ink-black, the wide line
 *   chip at grey-cool-900 — carried as decoded (wide = cool-900), may
 *   be a frame inconsistency Eliot will normalize;
 * - the well divider decodes ink-black on every chip — slightly
 *   darker than the wide line/solid's cool-900 rim;
 * - the placeholder fills: grey-cool chips #d9d9d9 (NOT a token —
 *   Figma's placeholder grey; real icon content replaces it), the
 *   wide solid's well square #ffe7eb;
 * - wide cyan is not in the spec frame — derived by composition.
 *
 * Tier-2 (declare on the element) —
 * --glaphic-chip-height · -radius · -padding-x · -label-size ·
 * -tracking · -font-family · -rim · -ink · -plate · -plate-ink ·
 * -divider · -divider-width · -well-width · -well-size · -well-fill
 */
const shadowStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--glaphic-chip-height, 25px);
    /* !important: an outer reset (Tailwind preflight's '* { border-width: 0 }')
       would otherwise zero the rim — outer rules beat :host styles in the
       cascade (and !important turns that priority back around) */
    border: 1px solid var(--glaphic-chip-rim, var(--glaphic-ink-black, #0d0221)) !important;
    border-radius: var(--glaphic-chip-radius, 1.5px);
    background: transparent;
    color: var(--glaphic-chip-ink, var(--glaphic-ink-black, #0d0221));
    font: 500 var(--glaphic-chip-label-size, 11px) / 1 var(--glaphic-chip-font-family, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
    letter-spacing: var(--glaphic-chip-tracking, .14em);
    text-transform: uppercase;
    /* line + solid are inert; only the plate recipes blend */
    mix-blend-mode: normal;
    --glaphic-chip-rim: var(--glaphic-ink-black, #0d0221);
    --glaphic-chip-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-chip-well-fill: #d9d9d9;
  }
  /* the multiply toggles — the cyan and brand plates read translucent */
  :host([variant='cyan'][multiply]),
  :host([variant='brand'][multiply]) {
    mix-blend-mode: multiply;
  }
  :host([variant='solid']) {
    background: var(--glaphic-chip-plate, var(--glaphic-ink-black, #0d0221));
    color: var(--glaphic-chip-plate-ink, var(--glaphic-neutral-paper-elevated, #f9faf4));
    --glaphic-chip-well-fill: var(--glaphic-semantic-danger-surface, #ffe7eb);
  }
  :host([variant='cyan']) {
    background: var(--glaphic-chip-plate, var(--glaphic-ink-cyan, #89f3ff));
    color: var(--glaphic-chip-plate-ink, var(--glaphic-ink-black, #0d0221));
  }
  :host([variant='brand']) {
    background: var(--glaphic-chip-plate, var(--glaphic-ink-brand-dark, #a6022a));
    color: var(--glaphic-chip-plate-ink, var(--glaphic-neutral-paper-deep, #e9ede0));
  }
  /* wide line: the spec frame strokes AND inks it at cool-900
     (flagged — the small line chips run ink-black) */
  :host([variant='line'][wide]) {
    --glaphic-chip-rim: var(--glaphic-neutral-grey-cool-900, #201e28);
    --glaphic-chip-ink: var(--glaphic-neutral-grey-cool-900, #201e28);
  }
  /* wide solid: the frame strokes its rim at cool-900 against the
     ink-black fill (flagged alongside the line case) */
  :host([variant='solid'][wide]) {
    border-color: var(--glaphic-chip-rim, var(--glaphic-neutral-grey-cool-900, #201e28));
  }
  .text {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 var(--glaphic-chip-padding-x, 11px);
  }
  /* the wide body's trailing well: a full-height divider line opens
     the icon channel (the divider rides the INSIDE border of the
     channel, the fill behind it comes from the chip's own paint) */
  .well {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    align-self: stretch;
    width: var(--glaphic-chip-well-width, 26px);
    border-left: var(--glaphic-chip-divider-width, 1px) solid var(--glaphic-chip-divider, var(--glaphic-ink-black, #0d0221));
  }
  /* the leading well (left): the channel opens before the text, so the
     divider rides the channel's inside-RIGHT border */
  :host([left]) .well {
    border-left: none;
    border-right: var(--glaphic-chip-divider-width, 1px) solid var(--glaphic-chip-divider, var(--glaphic-ink-black, #0d0221));
  }
  /* the well's empty square — placeholder fill per recipe; real
     content slotted into the 'icon' slot replaces it */
  .ph {
    width: var(--glaphic-chip-well-size, 18px);
    height: var(--glaphic-chip-well-size, 18px);
    background: var(--glaphic-chip-well-fill, #d9d9d9);
  }
`;

/**
 * glaphic-chip — mono-caps tag with the four paint recipes and the
 * wide icon well (see the file-head comment for the attribute and
 * Tier-2 surface).
 */
export class GlaphicChip extends LitElement {
  static properties = {
    /** paint recipe: 'line' (default) | 'solid' | 'cyan' | 'brand' */
    variant: { type: String, reflect: true },
    /** the trailing icon well */
    wide: { type: Boolean, reflect: true },
    /** the icon well LEADS (icon left of the text) */
    left: { type: Boolean, reflect: true },
    /** the multiply toggle (presence on); the plate recipes blend */
    multiply: { type: Boolean, reflect: true },
  };
  /** 'line' (default) | 'solid' | 'cyan' | 'brand' */
  declare variant: string;
  declare wide: boolean;
  /** the icon well leads (icon left of the text) */
  declare left: boolean;
  /** the multiply toggle (presence on) */
  declare multiply: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.variant = 'line';
    this.wide = false;
    this.left = false;
    this.multiply = true;
  }

  /** the text rides the default slot; the well squares `slot="icon"`. */
  render() {
    if (!this.wide) {
      return html`<span class="text"><slot></slot></span>`;
    }
    if (this.left) {
      return html`
        <span class="well" part="well" aria-hidden="true"><slot name="icon"><span class="ph" aria-hidden="true"></span></slot></span>
        <span class="text"><slot></slot></span>
      `;
    }
    return html`
      <span class="text"><slot></slot></span>
      <span class="well" part="well"><slot name="icon"><span class="ph" aria-hidden="true"></span></slot></span>
    `;
  }
}

customElements.define('glaphic-chip', GlaphicChip);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-chip': GlaphicChip;
  }
}