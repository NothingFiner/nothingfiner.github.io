import { LitElement, css, html } from 'lit';

/**
 * glaphic-textfield — the reworked inputs-frame text field
 * (bubble/line), a shadow-DOM wrapper over a native <input>.
 *
 * VARIANTS (only two — states are not variants): 'bubble' (200×54)
 * and 'line' (200×30.5 — a bottom line only, no fill, no box). The
 * label is ALWAYS there — it
 * starts in-field at the value position and floats MUI-style:
 * focused, it translates above the border (the chip's bottom kissing
 * the top border's outer edge) and scales to 0.75, and
 * the label and border turn the focus color; on the bubble variant,
 * once the label reaches its floated position the color and
 * background-color switch (the violet plate fades in and the label
 * ink goes to paper — a keyframe delayed until the motion lands).
 * Where the user defined a placeholder, the label STARTS floated and
 * the placeholder renders in the value position (the label and the
 * placeholder never share a line).
 *
 * State paints (all existing Tier-1 tokens; per the state-frame
 * SVG of 82:16514, raw device-pixel probes):
 * - default: fill `--glaphic-neutral-paper` #f2f5eb · stroke
 *   cool-400 #9d99ab 0.5px (line: 0.5px; focused line 1px; the
 *   disabled line's dots ride 1px) · field ink cool-600 #686474
 *   (line default label ink: cool-500 #817d8f)
 * - with-value (unfocused, holds text): fill → paper-elevated
 *   #f9faf4 · stroke cool-600 #686474 0.5px · the floated label sits
 *   on a cool-600 plate, its ink paper-elevated; the value text
 *   stays the dark default (ink-black)
 * - active (bubble): fill paper-elevated #f9faf4 · stroke ink-violet
 *   #8447ff at 1px · label plate ink-violet + paper-elevated ink
 *   (active line: stroke + floated label → --glaphic-semantic-*
 *   info-text #5a1fcc — no fill, no plate; the violet is the
 *   bubble's only)
 * - required: NO paint of its own — until it engages or holds a
 *   value a required field reads exactly like every other; a `*`
 *   rides the label (floating up with it); the input carries
 *   required/aria-required, so the asterisk is decorative
 * - disabled: fill paper-elevated · stroke cool-200 #d5d2de at 1px
 *   (line: DOTTED cool-400) · in-field label, placeholder, and
 *   value ink cool-400 #9d99ab · disabled with value: the fill
 *   steps back to paper #f2f5eb (the design differentiates it from
 *   the empty disabled field) and the label plate goes cool-200
 *   (ink cool-400). Not focusable, not editable.
 * - error: fill danger-surface #ffe7eb · stroke danger-base #f81d41
 *   (0.5px bubble / 1px line) · value ink danger-text #a30825 · the
 *   floated label in the danger plate, its ink danger-surface
 *   (line error: un-plated danger label — derived). Kept for the
 *   future Error Handling section, expanded later.
 *
 * As a real element it ships with NO default value. The native
 * input's `input`/`change` retarget to the host (the slider pattern);
 * `value` tracks the input; the label pairs to the input via
 * label-for. Motion: the field paint snaps immediately (the stroke is
 * the engagement indicator — no separate focus ring element) while the
 * label's motion is 200ms ease-out (MUI's shape: the float, then the
 * plate landing behind it), frozen dead under
 * prefers-reduced-motion.
 *
 * Events: native input/change (retargeted).
 * Attributes: value, label, placeholder, variant ('bubble' | 'line'),
 * error, required, disabled (plus the mirrored internal `filled`).
 *
 * Tier-2 (declare on the element):
 * --glaphic-textfield-width (200px) · -bubble-height (54px) ·
 * -line-height (30.5px — the line VARIANT's box height) · -radius
 * (2px) · -surface (paper) · -value-surface (paper-elevated) ·
 * -focus-surface (paper-elevated) · -disabled-surface
 * (paper-elevated) · -disabled-value-surface (paper) · -stroke
 * (cool-400) · -stroke-width (0.5px) · -focus-stroke (ink-violet) ·
 * -focus-stroke-width (1px) · -value-stroke (cool-600) ·
 * -line-focus-stroke (info-text) · -error-stroke (danger-base) ·
 * -label-ink (cool-600) · -value-ink (ink-black) ·
 * -placeholder-ink (cool-600) · -plate (ink-violet) · -plate-ink
 * (paper-elevated) · -error-plate (danger-base) ·
 * -error-plate-ink (danger-surface) · -error-value-ink (danger-text)
 * · -disabled-plate (cool-200) · -disabled-label-ink (cool-400) ·
 * -disabled-value-ink (cool-400) · -line-label-ink (cool-500) ·
 * -motion (200ms) · -easing (cubic-bezier(0, 0, 0.2, 1))
 */

const shadowStyles = css`
  :host {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: var(--glaphic-textfield-width, 200px);
    height: var(--glaphic-textfield-bubble-height, 54px);
    padding: 16px 14px;
    border: var(--glaphic-textfield-stroke-width, 0.5px) solid
      var(--glaphic-textfield-stroke);
    border-radius: var(--glaphic-textfield-radius, 2px);
    background: var(--glaphic-textfield-surface, var(--glaphic-neutral-paper, #f2f5eb));
    /* the whole field paint SNAPS — fill, border color, and border
       size change with no delay (MUI's border carries none on focus;
       the motionless stroke is the snappy engagement read — no
       separate focus ring). The label's float is the only motion */
    /* per-variant row — the label's in-field and float math reads it */
    --row: var(--glaphic-textfield-bubble-height, 54px);
    --glaphic-textfield-surface: var(--glaphic-neutral-paper, #f2f5eb);
    --glaphic-textfield-value-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-textfield-focus-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-textfield-disabled-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-textfield-disabled-value-surface: var(--glaphic-neutral-paper, #f2f5eb);
    --glaphic-textfield-error-surface: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-textfield-stroke: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-textfield-stroke-width: 0.5px;
    --glaphic-textfield-focus-stroke: var(--glaphic-ink-violet, #8447ff);
    --glaphic-textfield-focus-stroke-width: 1px;
    --glaphic-textfield-value-stroke: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-textfield-line-focus-stroke: var(--glaphic-semantic-info-text, #5a1fcc);
    --glaphic-textfield-error-stroke: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-textfield-label-ink: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-textfield-value-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-textfield-placeholder-ink: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-textfield-plate: var(--glaphic-ink-violet, #8447ff);
    --glaphic-textfield-plate-ink: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-textfield-error-plate: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-textfield-error-plate-ink: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-textfield-error-value-ink: var(--glaphic-semantic-danger-text, #a30825);
    --glaphic-textfield-disabled-plate: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    --glaphic-textfield-disabled-label-ink: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-textfield-disabled-value-ink: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-textfield-line-label-ink: var(--glaphic-neutral-grey-cool-500, #817d8f);
  }
  /* WITH-VALUE — the fill lightens, the stroke + floated label cool
     to grey; the fill rides the surface var (re-seated) so the line
     variant stays transparent; mirrored to a host attribute in
     updated(). (Required is NOT a paint state: it changes nothing
     until the field engages or holds a value.) */
  :host([filled]) {
    --glaphic-textfield-surface: var(--glaphic-textfield-value-surface);
    border-color: var(--glaphic-textfield-value-stroke);
  }
  /* ACTIVE — the violet set: the fill lightens, the stroke goes
     violet 1px (after the with-value rules: focus wins) */
  :host(:focus-within) {
    background: var(--glaphic-textfield-focus-surface);
    border-color: var(--glaphic-textfield-focus-stroke);
    border-width: var(--glaphic-textfield-focus-stroke-width, 1px);
  }
  input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 0;
    margin: 0;
    font: 400 var(--glaphic-font-size-3, 16px) / 1
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    color: var(--glaphic-textfield-value-ink);
    caret-color: var(--glaphic-textfield-value-ink);
    /* the field stroke carries the engagement indicator */
    outline: none;
  }
  input::placeholder {
    /* opacity: 1 only PINS the UA's placeholder fade at its default —
       no transparency layer is introduced (Firefox fades; Chromium
       does not). The placeholder ink itself is opaque. */
    color: var(--glaphic-textfield-placeholder-ink);
    opacity: 1;
    -webkit-text-fill-color: var(--glaphic-textfield-placeholder-ink);
  }
  /* the floating label — starts in-field at the value position; the
     floated label is the design's notch tab: its text sits flush at
     the plate's left edge and the plate keeps a minimum 52px width
     (min-width declared pre-scale: the float scales the box 0.75,
     so 52px/0.75 renders 52px floated) */
  .label {
    position: absolute;
    top: calc((var(--row) - 16px) / 2);
    left: 14px;
    min-width: calc(52px / 0.75);
    background: transparent;
    font: 400 var(--glaphic-font-size-3, 16px) / 16px
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    color: var(--glaphic-textfield-label-ink);
    transform-origin: left top;
    transition:
      transform var(--glaphic-textfield-motion, 200ms)
        var(--glaphic-textfield-easing, cubic-bezier(0, 0, 0.2, 1)),
      color var(--glaphic-textfield-motion, 200ms)
        var(--glaphic-textfield-easing, cubic-bezier(0, 0, 0.2, 1))
  }
  /* floated: scaled to 0.75 with the chip's bottom KISSING the top
     border's outer edge (-4.5px - row/2 = row 54 → -31.5; the host's
     0.5px top border shifts the label +0.5) — with a value, or
     where a placeholder pins it (the 1px-band states — focus,
     disabled, focused-error — park one extra half pixel up: rule
     below the error block) */
  :host(:focus-within) .label,
  :host([filled]) .label,
  .label.has-placeholder {
    transform: translateY(calc(-4.5px - var(--row) / 2)) scale(0.75);
  }
  .glaphic-text-field__input-container {
    display: inline-flex;
    cursor: text;
    position: relative;
    align-items: center;
  }
  /* a placeholder-pinned label floats unfocused in the with-value
     grey (cool-600), plateless */
  .label.has-placeholder {
    color: var(--glaphic-textfield-value-stroke);
  }
  /* with-value label: the cool-600 plate, its ink the plate ink
     (paper-elevated) — before the focus rules, which win when both
     are true */
  :host([filled]) .label {
    color: var(--glaphic-textfield-plate-ink);
    background: var(--glaphic-textfield-value-stroke);
  }
  /* ACTIVE label — violet in flight; once the motion lands the
     violet plate fades in and the ink switches to paper */
  :host(:focus-within) .label {
    color: var(--glaphic-textfield-focus-stroke);
    animation: plate-switch var(--glaphic-textfield-motion, 75ms)
      var(--glaphic-textfield-easing, cubic-bezier(0, 0, 0.2, 1))
      var(--glaphic-textfield-motion, 75ms) both;
  }
  @keyframes plate-switch {
    from {
      background: transparent;
      color: var(--glaphic-textfield-focus-stroke);
    }
    to {
      background: var(--glaphic-textfield-plate);
      color: var(--glaphic-textfield-plate-ink);
    }
  }
  .required {
    padding-left: 2px;
  }
  /* ERROR — the danger set: the fill pours to danger-surface, the
     stroke and the floated label's plate go danger-base (plate ink =
     danger-surface), and any value in the field reads danger-text;
     an error keeps its paint even focused */
  :host([error]) {
    --glaphic-textfield-surface: var(--glaphic-textfield-error-surface);
    border-color: var(--glaphic-textfield-error-stroke);
  }
  :host([error]) input {
    color: var(--glaphic-textfield-error-value-ink);
    caret-color: var(--glaphic-textfield-error-value-ink);
  }
  :host([error]) .label {
    transform: translateY(calc(-4.5px - var(--row) / 2)) scale(0.75);
    background: var(--glaphic-textfield-error-plate);
    color: var(--glaphic-textfield-error-plate-ink);
  }
  :host([error]:focus-within) .label {
    animation: none;
    background: var(--glaphic-textfield-error-plate);
    color: var(--glaphic-textfield-error-plate-ink);
  }
  /* FOCUS and DISABLED wear a 1px band (vs the rest sets' 0.5px);
     the label anchors to the padding box, so the thicker band pushes
     its anchor down half a pixel — these floated chips park one
     extra half pixel up so the bottom still kisses the stroke's
     outer edge (probe-verified: otherwise bottom = +0.5) */
  :host(:focus-within) .label,
  :host([disabled][filled]) .label,
  :host([disabled]) .label.has-placeholder,
  :host([error]:focus-within) .label {
    transform: translateY(calc(-5px - var(--row) / 2)) scale(0.75);
  }
  /* the LINE variant — a BOTTOM LINE ONLY (the state frame's line
     rows paint no box): widths go zero on the sides so the box's
     top/sides disappear while the border-COLOR keeps cascading
     through the one channel (default → value → focus → error →
     disabled). The line's band rides 0.5px at rest and with-value
     (the frame probes it at half the bubble's) — focus grows it to
     1px; its default label ink sits one step cooler (cool-500, per
     the state table); the value text pads ~4px off the stroke, the
     label flushes to the edge (both measured off the frame) */
  :host([variant='line']) {
    height: var(--glaphic-textfield-line-height, 30.5px);
    padding: 5px 4px 4px;
    border-radius: 0;
    --row: var(--glaphic-textfield-line-height, 30.5px);
    --glaphic-textfield-surface: transparent; /* no fill — seat the var so
       the line reads transparent through the same surface channel */
    --glaphic-textfield-stroke-width: 0.5px;
    --glaphic-textfield-label-ink: var(--glaphic-textfield-line-label-ink, #817d8f);
    --glaphic-textfield-placeholder-ink: var(--glaphic-textfield-line-label-ink, #817d8f);
    border-width: 0 0 var(--glaphic-textfield-stroke-width, 0.5px) 0;
  }
  :host([variant='line']) .label {
    left: 0;
    padding: 0;
  }
  /* the line's with-value floated label keeps the with-value cool
     grey, plateless */
  :host([variant='line'][filled]) .label {
    color: var(--glaphic-textfield-value-stroke);
    animation: none;
    background: transparent;
  }
  /* the line's float parks the label 1px higher than the bubble's
     (baseline kissing the stroke) */
  :host([variant='line']:focus-within) .label,
  :host([variant='line'][filled]) .label,
  :host([variant='line']) .label.has-placeholder {
    transform: translateY(calc(-3px - var(--row) / 2)) scale(0.75);
  }
  /* the line's focus: the stroke + floated label turn the info-text
     ink (#5a1fcc) — no violet, no plate on the line */
  :host([variant='line']:focus-within) .label {
    color: var(--glaphic-textfield-line-focus-stroke);
    animation: none;
    background: transparent;
  }
  :host([variant='line']:focus-within) {
    background: transparent;
    border-color: var(--glaphic-textfield-line-focus-stroke);
    /* the line's focus band grows to 1px (bottom only, like the rest
       set — the generic focus rule's 1px-on-all-sides is re-zeroed) */
    border-width: 0 0 var(--glaphic-textfield-focus-stroke-width, 1px) 0;
  }
  /* line error: danger line at the line's 0.5px width, un-plated
     danger label (derived — flagged in the docs prose) */
  :host([variant='line'][error]) {
    border-color: var(--glaphic-textfield-error-stroke);
    border-width: 0 0 var(--glaphic-textfield-stroke-width, 0.5px) 0;
  }
  :host([variant='line'][error]) .label {
    background: transparent;
    animation: none;
    color: var(--glaphic-textfield-error-stroke);
  }
  /* DISABLED — paper-elevated over a cool hold, 1px (dotted on the
     line); every ink drops to cool-400; not focusable, not editable.
     (Last: disabled beats error/required paint.) */
  :host([disabled]) {
    --glaphic-textfield-surface: var(--glaphic-textfield-disabled-surface);
    border-color: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    border-style: solid;
    border-width: 1px;
    cursor: not-allowed;
  }
  :host([disabled]) input {
    cursor: not-allowed;
    color: var(--glaphic-textfield-disabled-value-ink);
  }
  :host([disabled]) input::placeholder {
    color: var(--glaphic-textfield-disabled-label-ink);
    -webkit-text-fill-color: var(--glaphic-textfield-disabled-label-ink);
  }
  :host([disabled]) .label {
    color: var(--glaphic-textfield-disabled-label-ink);
  }
  /* with-value on a disabled field: the fill steps back to paper
     (the design differentiates it from the empty disabled field) —
     before the line's disabled rule, which must keep its no-fill */
  :host([disabled][filled]) {
    --glaphic-textfield-surface: var(--glaphic-textfield-disabled-value-surface);
  }
  /* with-value on a disabled field: the label plate goes cool-200 and
     its ink stays cool-400 (the design's disabled-with-value state) */
  :host([disabled][filled]) .label {
    background: var(--glaphic-textfield-disabled-plate);
  }
  /* disabled line: a dotted small line instead of the solid one,
     drawn in cool-400 (the state frame's dotted ink); the dots ride
     1px (the frame's dots are the full band height, unlike the line's
     0.5px rest band) */
  :host([variant='line'][disabled]) {
    background: transparent;
    border-color: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    border-style: dotted;
    border-width: 0 0 1px 0;
  }
  :host([disabled][error]),
  :host([disabled][required]) {
    border-color: var(--glaphic-neutral-grey-cool-200, #d5d2de);
  }
  :host([disabled][error]) .label {
    background: var(--glaphic-textfield-disabled-plate);
    color: var(--glaphic-textfield-disabled-label-ink);
    animation: none;
  }
  /* REDUCED MOTION — states swap instantly; no float, no plate dwell */
  @media (prefers-reduced-motion: reduce) {
    :host,
    .label {
      transition-duration: 0.01ms !important;
      transition-delay: 0s !important;
    }
    :host(:focus-within) .label {
      animation-duration: 0.01ms !important;
      animation-delay: 0s !important;
    }
  }
`;

/**
 * glaphic-textfield — native input wearing the field paint with a
 * floating, always-present label (see the file-head comment for the
 * anatomy, states, and Tier-2 surface).
 */
export class GlaphicTextfield extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    placeholder: { type: String },
    variant: { type: String },
    error: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };
  declare value: string;
  declare label: string;
  declare placeholder: string;
  declare variant: string;
  declare error: boolean;
  declare required: boolean;
  declare disabled: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.placeholder = '';
    this.variant = 'bubble';
    this.error = false;
    this.required = false;
    this.disabled = false;
  }

  private onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
  };

  protected override updated(): void {
    /* mirror value-presence to the host — CSS cannot read the
       property, and the with-value paint hangs on it */
    this.toggleAttribute('filled', this.value !== '');
  }

  render() {
    const inputId = 'input';
    const pinned = this.placeholder ? ' has-placeholder' : '';
    return html`
      ${this.label
        ? html`<label class="label ${pinned}" for=${inputId}>${this.label}${this.required
              ? html`<span class="required" aria-hidden="true">*</span>`
              : ''}</label>`
        : ''}
      <div class="glaphic-text-field__input-container">
           <input
              id=${inputId}
              .value=${this.value}
              placeholder=${this.placeholder}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-required=${this.required ? 'true' : 'false'}
              @input=${this.onInput}
            />
      </div>
    `;
  }
}

customElements.define('glaphic-textfield', GlaphicTextfield);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-textfield': GlaphicTextfield;
  }
}