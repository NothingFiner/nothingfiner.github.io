import { LitElement, css, html } from 'lit';

/**
 * glaphic-button — the new-look furniture button, rebuilt on the
 * Glaphic primitives (Figma collection "primitives", Buttons frame
 * 17:8762). Shadow DOM furniture: opaque fills, state flips that
 * swap paint — hover lands on full tokens, never on alpha.
 *
 * Two axes (the Eliot split — appearance and color are separate):
 * - variant = APPEARANCE: 'solid' (default) | 'outline' | 'text'.
 *   Solid is every filled button. Outline paints a transparent fill
 *   with the text and border the SAME ink; hover swaps in a surface.
 *   Text paints only the label ink; hover swaps in a surface, the
 *   ink holds.
 * - color = the color recipe: 'primary' (default) | 'secondary' |
 *   'danger' | 'warning' | 'success' | 'info'. Solid keeps
 *   primary/danger/warning/success/info — SECONDARY NOW BELONGS TO
 *   OUTLINE (the brand-dark ink outline; solid+secondary falls back
 *   to the primary recipe). Outline ships ink (its default —
 *   #0d0221 with the #e9ede0 hover surface), secondary and danger
 *   (danger-base ink; hover inverts — danger-base surface, text to
 *   danger-surface); text ships ink, secondary and info. Unlisted
 *   appearance+color pairs fall back to the ink recipe.
 *
 * Other attributes:
 * - size: 'sm' | 'md' (default) | 'lg' — padding rides the Tier-1
 *   --glaphic-button-{sm,md,lg}-padding-{x,y} tokens; the label grows
 *   with the size ladder (11/12/16px). Shared by every appearance.
 * - chamfered: cuts the top-left and bottom-right corners. The cut
 *   strokes its edges (the Figma vector strokes every edge), so the
 *   button paints the border as its own background layer with the
 *   fill riding an inset ::before of the same clip shape — a painted
 *   rim that only exists where the fill is OPAQUE: outline/text
 *   chamfers keep the silhouette but print no rim (flagged for
 *   Eliot — a transparent-fill rim needs a different mechanic).
 * - disabled: greys to the cool ramp (fill/ink/label all token-driven
 *   — no opacity) and holds that grey under the pointer; disabled
 *   has NO hover state.
 * - force-hover / force-active: declarative mirrors of :hover/:active
 *   so stories and tests can drive CSS-only state without a pointer.
 *   (LINK IS GONE — Eliot skipped it: MUI's only link difference is
 *   the href, which is the consumer's.)
 *
 * Tier-2 (declare on the element; the appearance/color rules are the
 * defaults) — Eliot's solid vocabulary, default AND hover:
 * --glaphic-button-text · -surface · -border ·
 * -hover-text · -hover-surface · -hover-border ·
 * -disabled-text · -disabled-surface · -disabled-border ·
 * -radius · -font · -chamfer
 */

const shadowStyles = css`
  :host {
    display: inline-block;
    /* Tier-2 defaults; appearance/color rules override, consumer
       inline overrides win over both */
    --glaphic-button-radius: var(--glaphic-radius-base, 2px);
    --glaphic-button-font: 600 var(--glaphic-font-size-2, 12px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    /* primary solid (the default recipe) — fluro fill that hovers to
       ink-black, the keyline stroking with each state's ink */
    --glaphic-button-text: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-surface: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-button-border: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-text: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-button-hover-surface: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-border: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-button-disabled-text: var(--glaphic-neutral-grey-cool-300, #bab6c7);
    --glaphic-button-disabled-surface: var(--glaphic-neutral-grey-cool-100, #e9e7ef);
    --glaphic-button-disabled-border: var(--glaphic-neutral-grey-cool-300, #bab6c7);
    --glaphic-button-chamfer: 10px;
  }
  /* SOLID color tables — fill / ink / hover triples extracted
     state-by-state from the Figma dump. Danger and info stroke only
     through the fill (border == surface reads as no keyline; the
     frame draws both strokeless at rest) */
  :host([color='danger']) {
    --glaphic-button-text: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-button-surface: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-button-border: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-button-hover-text: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-button-hover-surface: var(--glaphic-semantic-danger-text, #a30825);
    --glaphic-button-hover-border: var(--glaphic-semantic-danger-text, #a30825);
  }
  :host([color='warning']) {
    --glaphic-button-text: var(--glaphic-semantic-warning-text, #0d0221);
    --glaphic-button-surface: var(--glaphic-semantic-warning-surface, #ffe873);
    --glaphic-button-border: var(--glaphic-semantic-warning-base, #ffd500);
    --glaphic-button-hover-text: var(--glaphic-semantic-warning-text, #0d0221);
    --glaphic-button-hover-surface: var(--glaphic-semantic-warning-base, #ffd500);
    --glaphic-button-hover-border: var(--glaphic-semantic-warning-base, #ffd500);
  }
  :host([color='success']) {
    --glaphic-button-text: var(--glaphic-semantic-success-text, #3d8b0e);
    --glaphic-button-surface: var(--glaphic-semantic-success-base, #89f336);
    --glaphic-button-border: var(--glaphic-semantic-success-text, #3d8b0e);
    --glaphic-button-hover-text: var(--glaphic-semantic-success-surface, #e6ffd3);
    --glaphic-button-hover-surface: var(--glaphic-semantic-success-text, #3d8b0e);
    --glaphic-button-hover-border: var(--glaphic-semantic-success-surface, #e6ffd3);
  }
  :host([color='info']) {
    --glaphic-button-text: var(--glaphic-semantic-info-surface, #efe8ff);
    --glaphic-button-surface: var(--glaphic-semantic-info-base, #8447ff);
    --glaphic-button-border: var(--glaphic-semantic-info-base, #8447ff);
    --glaphic-button-hover-text: var(--glaphic-semantic-info-surface, #efe8ff);
    --glaphic-button-hover-surface: var(--glaphic-semantic-info-text, #5a1fcc);
    /* no keyline at rest; hover prints the base as its border */
    --glaphic-button-hover-border: var(--glaphic-semantic-info-base, #8447ff);
  }
  /* secondary is OUTLINE's recipe — solid+secondary falls back to
     the primary table above by design (Eliot: secondary belongs to
     outline now) */

  /* OUTLINE — transparent fill, text and border the SAME ink; hover
     swaps in a surface while the ink holds (Eliot's ink outline:
     #0d0221 text/border over the #e9ede0 hover surface) */
  :host([variant='outline']) {
    --glaphic-button-surface: transparent;
    --glaphic-button-text: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-border: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-text: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-border: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-surface: var(--glaphic-neutral-paper-deep, #e9ede0);
  }
  /* secondary outline: the brand-dark ink; hover surface is a LOCKED
     GUESS (paper-deep, the ink outline's) — no hover ink for
     secondary is recorded in the frame dump */
  :host([variant='outline'][color='secondary']) {
    --glaphic-button-text: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-button-border: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-button-hover-text: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-button-hover-border: var(--glaphic-ink-brand-dark, #a6022a);
  }
  /* danger outline (Eliot's retune): the danger-BASE ink on both
     sides; hover inverts to the filled chip — the base pours in as
     both the surface AND the keyline, and the text lifts to
     danger-surface */
  :host([variant='outline'][color='danger']) {
    --glaphic-button-text: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-button-border: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-button-hover-text: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-button-hover-border: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-button-hover-surface: var(--glaphic-semantic-danger-base, #f81d41);
  }

  /* TEXT — paint only the label; hover swaps in a surface, the ink
     holds (border is gone entirely — no 1px box, no hover box) */
  :host([variant='text']) {
    --glaphic-button-surface: transparent;
    --glaphic-button-text: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-text: var(--glaphic-ink-black, #0d0221);
    --glaphic-button-hover-surface: var(--glaphic-neutral-paper-deep, #e9ede0);
  }
  :host([variant='text'][color='secondary']) {
    /* LOCKED GUESS family — text secondary rides the same brand-dark
       ink + paper-deep hover surface as its outline sibling */
    --glaphic-button-text: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-button-hover-text: var(--glaphic-ink-brand-dark, #a6022a);
  }
  :host([variant='text'][color='info']) {
    /* text rides the TEXT-role token (danger did here; Eliot swapped
       text's danger for info) — hover block is info-surface, ink
       holds */
    --glaphic-button-text: var(--glaphic-semantic-info-text, #5a1fcc);
    --glaphic-button-hover-text: var(--glaphic-semantic-info-text, #5a1fcc);
    --glaphic-button-hover-surface: var(--glaphic-semantic-info-surface, #efe8ff);
  }

  /* size ladder: padding from the Tier-1 component tokens, label from
     the type scale (11 → 12 → 16px; the /1.3 line gives 14/16/21) */
  :host([size='sm']) button {
    padding: var(--glaphic-button-sm-padding-y, 6px) var(--glaphic-button-sm-padding-x, 12px);
    --glaphic-button-font: 600 var(--glaphic-font-size-1, 11px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
  }
  :host([size='md']) button {
    padding: var(--glaphic-button-md-padding-y, 12px) var(--glaphic-button-md-padding-x, 24px);
  }
  :host([size='lg']) button {
    padding: var(--glaphic-button-lg-padding-y, 16px) var(--glaphic-button-lg-padding-x, 36px);
    --glaphic-button-font: 600 var(--glaphic-font-size-3, 16px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
  }

  button {
    display: inline-block;
    font: var(--glaphic-button-font);
    letter-spacing: 0.6px;
    text-align: center;
    background: var(--glaphic-button-surface);
    color: var(--glaphic-button-text);
    /* border == surface reads as a keyline-less button (the danger
       and info solids) without an extra switch */
    border: var(--glaphic-border-width-sm, 1px) solid
      var(--glaphic-button-border, var(--glaphic-button-surface));
    border-radius: var(--glaphic-button-radius);
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease, translate 0.12s ease;
  }
  :host([variant='text']) button {
    border: none;
  }
  button:focus-visible {
    /* first consumer of the new focus token */
    outline: 2px solid var(--glaphic-ui-focus, #8447ff);
    outline-offset: 2px;
  }
  :host([disabled]) {
    cursor: not-allowed;
  }
  :host([disabled]) button {
    background: var(--glaphic-button-disabled-surface);
    color: var(--glaphic-button-disabled-text);
    border-color: var(--glaphic-button-disabled-border); /* the light grey keyline */
    cursor: not-allowed;
  }

  button span { display: inline-block; white-space: nowrap; }
  /* the link reading — the label underlines (derived; flagged) */
  :host([link]) button span {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  /* disabled has NO hover state — Figma's Hover/Disabled components
     render identical greys, so the guard blocks both mirrors */
  :host(:hover:not([disabled])) button,
  :host([force-hover]:not([disabled])) button {
    background: var(--glaphic-button-hover-surface);
    color: var(--glaphic-button-hover-text);
    border-color: var(--glaphic-button-hover-border, var(--glaphic-button-hover-surface));
  }
  :host(:active) button, :host([force-active]) button { translate: 1px 1px; }

  /* chamfered: top-left + bottom-right cut, the spec's two-corner
     Chamfer=True (notch size is the Tier-2 knob). The Figma shape is
     a filled VECTOR with the stroke running around the chamfer, and
     CSS border is cut off by clip-path — so the button paints the
     border as its own background and the fill rides an inset
     ::before with the same clip shape (clip-path makes a stacking
     context, so z-index -1 slips the fill under the label). The rim
     is a PAINTED layer standing in for the cut border — it can only
     exist where the fill is opaque, so outline/text chamfers print
     the silhouette but no rim (flagged for Eliot). */
  :host([chamfered]) button {
    position: relative;
    border: none;
    background: var(--glaphic-button-border);
    clip-path: polygon(
      var(--glaphic-button-chamfer) 0,
      100% 0,
      100% calc(100% - var(--glaphic-button-chamfer)),
      calc(100% - var(--glaphic-button-chamfer)) 100%,
      0 100%,
      0 var(--glaphic-button-chamfer)
    );
  }
  :host([chamfered]) button::before {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: -1;
    background: var(--glaphic-button-surface);
    transition: background 0.12s ease;
    clip-path: polygon(
      var(--glaphic-button-chamfer) 0,
      100% 0,
      100% calc(100% - var(--glaphic-button-chamfer)),
      calc(100% - var(--glaphic-button-chamfer)) 100%,
      0 100%,
      0 var(--glaphic-button-chamfer)
    );
  }
  /* outline/text chamfers: no opaque fill to stand in for the rim —
     keep the silhouette, keep the ink readable, paint nothing. The
     hover variants out-specify the shared chamfer hover rule; the
     disabled rules below win back the grey rim at rest (the disabled
     look is the same for every appearance) */
  :host([variant='outline'][chamfered]) button,
  :host([variant='text'][chamfered]) button {
    background: transparent;
  }
  :host([variant='outline'][chamfered]:hover:not([disabled])) button,
  :host([variant='text'][chamfered]:hover:not([disabled])) button,
  :host([variant='outline'][chamfered][force-hover]:not([disabled])) button,
  :host([variant='text'][chamfered][force-hover]:not([disabled])) button {
    background: transparent;
  }
  /* disabled must win the layered silhouette too */
  :host([chamfered][disabled]) button {
    background: var(--glaphic-button-disabled-border);
  }
  :host([chamfered][disabled]) button::before {
    background: var(--glaphic-button-disabled-surface);
  }
  :host([chamfered]:hover:not([disabled])) button,
  :host([chamfered][force-hover]:not([disabled])) button {
    background: var(--glaphic-button-hover-border, var(--glaphic-button-hover-surface));
  }
  :host([chamfered]:hover:not([disabled])) button::before,
  :host([chamfered][force-hover]:not([disabled])) button::before {
    background: var(--glaphic-button-hover-surface);
  }
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
  }
`;

/**
 * glaphic-button — solid/outline/text × primary/secondary/danger/
 * warning/success/info × sm/md/lg × chamfered × disabled (see
 * the file-head comment for the full state tables and Tier-2
 * surface).
 */
export class GlaphicButton extends LitElement {
  static properties = {
    /** appearance: 'solid' (default) | 'outline' | 'text' */
    variant: { type: String, reflect: true },
    /** color recipe: 'primary' (default) | 'secondary' | 'danger' | 'warning' | 'success' | 'info' */
    color: { type: String, reflect: true },
    size: { type: String, reflect: true },
    chamfered: { type: Boolean, reflect: true },
    /** hyperlinked reading — the label underlines (derived; flagged) */
    link: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    forceHover: { type: Boolean, reflect: true, attribute: 'force-hover' },
    forceActive: { type: Boolean, reflect: true, attribute: 'force-active' },
  };
  declare variant: string;
  declare color: string;
  /** 'sm' | 'md' | 'lg' */
  declare size: string;
  declare chamfered: boolean;
  declare link: boolean;
  declare disabled: boolean;
  declare forceHover: boolean;
  declare forceActive: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.variant = 'solid';
    this.color = 'primary';
    this.size = 'md';
    this.chamfered = false;
    this.link = false;
    this.disabled = false;
    this.forceHover = false;
    this.forceActive = false;
  }

  updated() {
    /* an icon-only button's name can't come from its slotted glyph —
       the host's aria-label IS the label; mirror it onto the inner
       button so AT reads the ask, not the character */
    const button = this.renderRoot.querySelector('button');
    const label = this.getAttribute('aria-label');
    if (!button) return;
    if (label) button.setAttribute('aria-label', label);
    else button.removeAttribute('aria-label');
  }

  render() {
    return html`<button type="button" part="button" ?disabled=${this.disabled}>
      <span part="label"><slot></slot></span>
    </button>`;
  }
}

customElements.define('glaphic-button', GlaphicButton);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-button': GlaphicButton;
  }
}