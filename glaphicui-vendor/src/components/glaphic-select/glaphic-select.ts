import { LitElement, css, html } from 'lit';

/**
 * glaphic-select — the reworked inputs-frame select, a bespoke
 * floating-label combobox, painted off the state-frame SVG of
 * 82:16564 (raw pixel probes). VARIANTS: 'bubble' (designed, 171×54)
 * and 'line' (extrapolated from the text field's bubble→line
 * differences: no fill, a bottom line only, 30.5px row — flagged in
 * prose). The label is ALWAYS there and floats exactly like the text
 * field's: open or focused, it translates above the border (the
 * chip's bottom kissing the field's top edge) and scales to 0.75,
 * and once the label reaches its floated position the color and
 * background-color switch to the violet plate. A placeholder pins
 * the label floated from the start with the placeholder rendering at
 * the value position.
 *
 * The icon is a 1px-stroked chevron sitting BESIDE the value text at
 * the field's right edge (a reserved lane the text truncates
 * against), pointing down at rest and swinging 180° to point up
 * while the panel is open, recoloring to the open ink (the state
 * frame draws a hollow diamond instead — the chevron swing is
 * Eliot's call; flagged in prose). The
 * options panel is hand-built (the design paints it): a violet
 * plate — `#8447ff` ink-violet — dropping flush under the field
 * (3 rows at a 53px pitch, inset 1px left/right), paper-deep rows,
 * the active row ALSO paper-deep with the info-text ink. Listbox
 * ARIA pattern on the trigger (role="combobox", aria-expanded,
 * aria-haspopup, aria-controls, aria-activedescendant): Enter/Space
 * opens, ArrowUp/Down + Home/End traverse, Enter/Space selects,
 * Escape closes, a click outside closes. Selection emits `change`
 * ({detail: {value}}).
 *
 * State paints (all existing Tier-1 tokens):
 * - default: fill paper-ELEVATED #f9faf4 (NOT the text field's
 *   paper) · stroke cool-400 #9d99ab 0.5px · label/placeholder ink
 *   cool-600 #686474 · caret cool-700 #504c5a
 * - with-value (picked, unfocused) — the stroke DOES NOT CHANGE
 *   (stays cool-400 0.5px, unlike the text field's cool-600 step);
 *   the floated label sits on a cool-600 plate, its ink paper-deep
 *   #e9ede0 (the text field's chip ink is paper-elevated — the
 *   frames differ); the value text is ink-black
 * - open/focused: fill stays paper-elevated · stroke ink-violet
 *   #8447ff at 1px · label plate ink-violet + paper-deep ink ·
 *   caret ink-violet
 * - required: NO paint of its own — until it engages or holds a
 *   value a required field reads exactly like every other; a
 *   decorative `*` rides the label (floating up with it) and the
 *   trigger carries aria-required
 * - disabled: fill paper-elevated (unchanged) · stroke cool-200
 *   #d5d2de at 0.5px (the frame draws the select's disabled band at
 *   half the text field's 1px — flagged in prose) · caret cool-300
 *   #bab6c7 · in-field label, placeholder, and value ink cool-400 ·
 *   disabled-with-value label plate cool-200 (derived, flagged)
 * - line variant (extrapolated): a bottom line only — 0.5px
 *   cool-400 at rest/with-value, 1px focused or open, dotted 1px
 *   cool-400 disabled; label inks cool-500; the focus/open stroke
 *   and floated label go info-text #5a1fcc (the violet is the
 *   bubble's only) — all derived from the text field's line, flagged
 * - error: the danger set, un-drawn — derived from the text field's
 *   states (kept for the later Error Handling section, flagged)
 *
 * The options are the consumer's `<option>` children (the drawer's
 * ::slotted pattern); the label is the trigger's accessible name.
 *
 * Tier-2 (declare on the element):
 * --glaphic-select-width (171px) · -height (54px) · -line-height
 * (30.5px) · -radius (2px) · -surface (paper-elevated) ·
 * -open-surface (paper-elevated) · -stroke (cool-400) ·
 * -stroke-width (0.5px) · -focus-stroke (ink-violet) ·
 * -value-stroke (cool-600 — the with-value label plate) ·
 * -error-stroke (danger-base) · -value-ink (ink-black) ·
 * -placeholder-ink (cool-600) · -label-ink (cool-600) · -plate
 * (ink-violet) · -plate-ink (paper-deep) · -error-plate (danger-base)
 * · -error-plate-ink (danger-surface) · -disabled-plate (cool-200) ·
 * -disabled-label-ink (cool-400) · -disabled-value-ink (cool-400) ·
 * -disabled-surface (paper-elevated) · -panel-bg (ink-violet) ·
 * -row-ink (paper-deep) · -row-height (53px) · -active-row-bg
 * (paper-deep) · -active-row-ink (info-text) · -caret-ink (cool-700)
 * · -open-caret-ink (ink-violet; derived) · -line-label-ink
 * (cool-500) · -line-placeholder-ink (cool-500) ·
 * -line-focus-stroke (info-text; derived) · -disabled-stroke
 * (cool-200) · -disabled-caret-ink (cool-300) · -disabled-panel-bg
 * (cool-400) · -motion (200ms) · -easing (cubic-bezier(0, 0, 0.2, 1))
 */

const shadowStyles = css`
  :host {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: var(--glaphic-select-width, 171px);
    /* per-variant row — the label's in-field and float math reads it */
    --row: var(--glaphic-select-height, 54px);
    --glaphic-select-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-select-open-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-select-stroke: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-select-stroke-width: 0.5px;
    --glaphic-select-focus-stroke: var(--glaphic-ink-violet, #8447ff);
    --glaphic-select-focus-stroke-width: 1px;
    --glaphic-select-line-focus-stroke: var(--glaphic-semantic-info-text, #5a1fcc);
    --glaphic-select-value-stroke: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-select-error-stroke: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-select-value-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-select-placeholder-ink: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-select-label-ink: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-select-plate: var(--glaphic-ink-violet, #8447ff);
    --glaphic-select-plate-ink: var(--glaphic-neutral-paper-deep, #e9ede0);
    --glaphic-select-error-plate: var(--glaphic-semantic-danger-base, #f81d41);
    --glaphic-select-error-plate-ink: var(--glaphic-semantic-danger-surface, #ffe7eb);
    --glaphic-select-disabled-plate: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    --glaphic-select-disabled-label-ink: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-select-disabled-value-ink: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-select-disabled-surface: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-select-disabled-stroke: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    --glaphic-select-disabled-caret-ink: var(--glaphic-neutral-grey-cool-300, #bab6c7);
    --glaphic-select-disabled-panel-bg: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-select-panel-bg: var(--glaphic-ink-violet, #8447ff);
    --glaphic-select-row-ink: var(--glaphic-neutral-paper-deep, #e9ede0);
    --glaphic-select-row-height: 53px;
    --glaphic-select-active-row-bg: var(--glaphic-neutral-paper-deep, #e9ede0);
    --glaphic-select-active-row-ink: var(--glaphic-semantic-info-text, #5a1fcc);
    --glaphic-select-caret-ink: var(--glaphic-neutral-grey-cool-700, #504c5a);
    --glaphic-select-open-caret-ink: var(--glaphic-ink-violet, #8447ff);
    --glaphic-select-line-label-ink: var(--glaphic-neutral-grey-cool-500, #817d8f);
    --glaphic-select-line-placeholder-ink: var(--glaphic-neutral-grey-cool-500, #817d8f);
    --glaphic-select-motion: 200ms;
    --glaphic-select-easing: cubic-bezier(0, 0, 0.2, 1);
  }
  /* the trigger field — the text-field bubble anatomy, wider */
  .field {
    box-sizing: border-box;
    height: var(--row);
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    padding: 0 18px 0 14px; /* 16/14 vertical field padding; the value line centers */
    font: inherit;
    border: var(--glaphic-select-stroke-width, 0.5px) solid var(--glaphic-select-stroke);
    border-radius: var(--glaphic-select-radius, 2px);
    background: var(--glaphic-select-surface);
    color: inherit;
    cursor: pointer;
    /* the stroke carries the engagement indicator */
    outline: none;
    /* the field paint snaps — border color AND size, like the fill:
       MUI's border carries no color/size delay on focus, and the
       motionless stroke is the snappy engagement read (the text-field
       call) */
  }
  :host(:focus-within) .field,
  :host([open]) .field {
    background: var(--glaphic-select-open-surface);
    border-color: var(--glaphic-select-focus-stroke);
    border-width: var(--glaphic-select-focus-stroke-width, 1px);
  }
  .value,
  .placeholder {
    /* line-height 21px, not the 16px em: the value's line rides inside
       an overflow: hidden clip (the truncation channel against the
       caret lane) and Plex Mono's descender ink reaches ~4px below
       the 16px baseline — the 21px box holds it, so 'g'-'y' tails
       don't clip */
    font: 400 var(--glaphic-font-size-3, 16px) / 21px
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
  }
  .placeholder {
    color: var(--glaphic-select-placeholder-ink);
  }
  .value {
    color: var(--glaphic-select-value-ink);
  }
  /* the caret — a 1px-stroked chevron in the flex flow at the field's
     right edge, a reserved lane BESIDE the value text (which
     truncates against it, never under it): it points down at rest,
     swings 180° up while the panel is open, and recolors to the open
     ink (the state frame draws a hollow diamond instead — the
     chevron is Eliot's call; vector-effect keeps the 1px stroke when
     the line variant scales the icon to 13px) */
  .caret {
    flex: 0 0 auto;
    /* margin-left: auto pins the lane to the field's RIGHT edge even
       while the value is absent (empty + placeholderless, the caret
       is the field's only flex child and would otherwise sit at its
       left, overlapping the in-field label) */
    margin-left: auto;
    width: 19.8px;
    height: 19.8px;
    color: var(--glaphic-select-caret-ink);
    transition:
      color var(--glaphic-select-motion) var(--glaphic-select-easing),
      transform var(--glaphic-select-motion) var(--glaphic-select-easing);
  }
  .field[aria-expanded='true'] .caret {
    color: var(--glaphic-select-open-caret-ink);
    transform: rotate(180deg);
  }
  /* the floating label — the text field's chip: a flush-text tab (no
     horizontal padding) over a minimum 52px plate, declared
     pre-scale (the float scales the box 0.75, so 52px/0.75 renders
     52px floated; the frames draw the chip 52 wide) */
  .label {
    position: absolute;
    top: calc((var(--row) - 16px) / 2);
    left: 14px;
    padding: 0;
    min-width: calc(52px / 0.75);
    background: transparent;
    font: 400 var(--glaphic-font-size-3, 16px) / 16px
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    color: var(--glaphic-select-label-ink);
    transform-origin: left top;
    pointer-events: none;
    transition:
      transform var(--glaphic-select-motion) var(--glaphic-select-easing),
      color var(--glaphic-select-motion) var(--glaphic-select-easing),
      background-color var(--glaphic-select-motion) var(--glaphic-select-easing);
  }
  /* floated: the chip's bottom kisses the field's top edge
     (-4px - row/2 = row 54 → -31; the host carries no border so the
     label needs no +0.5), scaled to 0.75 — on open/focus, with a
     value, or where a placeholder pins it */
  :host(:focus-within) .label,
  :host([open]) .label,
  :host([filled]) .label,
  .label.has-placeholder {
    transform: translateY(calc(-4px - var(--row) / 2)) scale(0.75);
  }
  /* with-value: the label sits on the cool-600 plate, its ink
     paper-deep (the state frame's chip) — with a value the label is
     ALWAYS floated, like the text field's */
  :host([filled]) .label {
    color: var(--glaphic-select-plate-ink);
    background: var(--glaphic-select-value-stroke);
  }
  /* placeholder-pinned: floated in the cool grey, plateless — before
     the open/focus rules so the plate still wins when both land
     (the placeholder states are un-drawn; derived from the text
     field's pinned label) */
  .label.has-placeholder {
    color: var(--glaphic-select-placeholder-ink);
    animation: none;
  }
  /* OPEN and ACTIVE — violet in flight; once the motion lands the
     violet plate fades in and the ink switches to paper (the open rule
     covers unfocused opens, e.g. a value programmatic one) */
  :host(:focus-within) .label,
  :host([open]) .label {
    color: var(--glaphic-select-focus-stroke);
    animation: plate-switch var(--glaphic-select-motion) var(--glaphic-select-easing)
      var(--glaphic-select-motion) both;
  }
  @keyframes plate-switch {
    from {
      background: transparent;
      color: var(--glaphic-select-focus-stroke);
    }
    to {
      background: var(--glaphic-select-plate);
      color: var(--glaphic-select-plate-ink);
    }
  }
  .required {
    padding-left: 2px;
  }
  /* the painted options panel — flush under the field */
  .panel {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    background: var(--glaphic-select-panel-bg);
  }
  .panel:not(.open) {
    display: none;
  }
  /* the rows are the consumer's <option> children: full-bleed rows
     inset 1px left/right (the frame's rects sit x21–190 in the
     panel's x20–191 — the active row reads as sitting inside the
     violet plate behind a 1px keyline each side); the row ink's
     line-height = the pitch so the text centers mid-row (the frame's
     baselines sit row-rel ≈33 of 53) */
  ::slotted(option) {
    display: block;
    box-sizing: border-box;
    height: var(--glaphic-select-row-height);
    margin: 0 1px;
    padding: 0 14px;
    font: 400 var(--glaphic-font-size-3, 16px) / var(--glaphic-select-row-height, 53px)
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    color: var(--glaphic-select-row-ink);
    cursor: pointer;
    user-select: none;
  }
  /* the active (keyboard-navigated / hovered) row — ALSO paper-deep
     with the info-text ink (#5a1fcc, per the frame; the row's body
     differs from its neighbours only by sitting inside the plate) */
  ::slotted(.active) {
    background: var(--glaphic-select-active-row-bg);
    color: var(--glaphic-select-active-row-ink);
  }
  ::slotted(option:hover) {
    background: var(--glaphic-select-active-row-bg);
    color: var(--glaphic-select-active-row-ink);
  }
  /* the LINE variant (extrapolated, flagged) — the text field's line
     anatomy translated: no fill, a BOTTOM line only, 0.5px at rest
     and with-value; its label + placeholder inks sit one step cooler
     (cool-500, keeping the text-field line's step); the violet is
     the bubble's only — focus/open turns the line's stroke, floated
     label, and caret to the info-text ink, plateless */
  :host([variant='line']) {
    --row: var(--glaphic-select-line-height, 30.5px);
    --glaphic-select-surface: transparent; /* no fill — seat the var so
       the line reads transparent through the same surface channel */
    --glaphic-select-label-ink: var(--glaphic-select-line-label-ink, #817d8f);
    --glaphic-select-placeholder-ink: var(--glaphic-select-line-placeholder-ink, #817d8f);
  }
  :host([variant='line']) .field {
    height: var(--row);
    padding: 0 8px 0 4px; /* the value pads 4px off the stroke (the
       text-field line's inset); the caret keeps its 8px inset */
    border-style: solid;
    border-radius: 0;
    border-width: 0 0 var(--glaphic-select-stroke-width, 0.5px) 0;
  }
  :host([variant='line']) .caret {
    width: 13px;
    height: 13px;
  }
  :host([variant='line']) .label {
    left: 0;
  }
  /* the line's float parks its baseline at the field's top edge
     (-3px - row/2 = row 30.5 → -18.25: the text-field line's
     verified landing, 1px short of the bubble's kiss) */
  :host([variant='line']:focus-within) .label,
  :host([variant='line'][open]) .label,
  :host([variant='line'][filled]) .label,
  :host([variant='line']) .label.has-placeholder {
    transform: translateY(calc(-3px - var(--row) / 2)) scale(0.75);
  }
  /* the line's with-value label stays UN-PLATED cool grey (the
     text-field line's quiet set) */
  :host([variant='line'][filled]) .label {
    color: var(--glaphic-select-value-stroke);
    animation: none;
    background: transparent;
  }
  :host([variant='line']:focus-within) .field,
  :host([variant='line'][open]) .field {
    background: transparent;
    border-color: var(--glaphic-select-line-focus-stroke);
    border-width: 0 0 var(--glaphic-select-focus-stroke-width, 1px) 0;
  }
  :host([variant='line']:focus-within) .label,
  :host([variant='line'][open]) .label {
    color: var(--glaphic-select-line-focus-stroke);
    animation: none;
    background: transparent;
  }
  :host([variant='line']) .field[aria-expanded='true'] .caret {
    color: var(--glaphic-select-line-focus-stroke);
  }
  /* line error: 1px danger; its label floats un-plated (derived) */
  :host([variant='line'][error]) .field {
    border-color: var(--glaphic-select-error-stroke);
  }
  /* ERROR — the danger set: the stroke and the floated label's plate
     go danger-base, the plate's ink the surface pink; an error keeps
     its paint even focused or open (these sit after the open/focus
     rules: error wins) */
  :host([error]) .field,
  :host([error][open]) .field {
    border-color: var(--glaphic-select-error-stroke);
  }
  :host([error]) .label,
  :host([error]:focus-within) .label,
  :host([error][open]) .label {
    background: var(--glaphic-select-error-plate);
    color: var(--glaphic-select-error-plate-ink);
    animation: none;
  }
  :host([variant='line'][error]) .label {
    background: transparent;
    color: var(--glaphic-select-error-stroke);
    animation: none;
  }
  /* DISABLED — paper-elevated over a cool hold; every ink drops to
     cool-400. The stroke rides 0.5px (the state frame draws the
     select's disabled band at half the text field's 1px — flagged in
     prose, one word reverts it) */
  :host([disabled]) .field {
    background: var(--glaphic-select-disabled-surface); /* paper-elevated */
    border-color: var(--glaphic-select-disabled-stroke);
    border-style: solid;
    border-width: var(--glaphic-select-stroke-width, 0.5px);
    cursor: not-allowed;
  }
  :host([disabled]) .caret {
    color: var(--glaphic-select-disabled-caret-ink);
  }
  :host([disabled]) .label {
    color: var(--glaphic-select-disabled-label-ink);
    animation: none;
  }
  :host([disabled]) .value,
  :host([disabled]) .placeholder {
    color: var(--glaphic-select-disabled-value-ink);
  }
  /* disabled with a value: the label plate goes cool-200 and its ink
     stays cool-400 (the design's disabled-with-value state) */
  :host([disabled][filled]) .label {
    background: var(--glaphic-select-disabled-plate);
  }
  :host([disabled]) .panel {
    display: none;
    background: var(--glaphic-select-disabled-panel-bg);
  }
  :host([disabled][error]) {
    --glaphic-select-error-stroke: var(--glaphic-select-disabled-stroke);
  }
  /* disabled line: the dotted small line like the text field's —
     dotted, 1px, in cool-400 (all derived, flagged in prose) */
  :host([variant='line'][disabled]) .field {
    border-style: dotted;
    border-color: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    border-width: 0 0 1px 0;
  }
  /* REDUCED MOTION — states swap instantly; no float, no rotation */
  @media (prefers-reduced-motion: reduce) {
    .field,
    .label,
    .caret {
      transition-duration: 0.01ms !important;
      transition-delay: 0s !important;
    }
    .label {
      animation-duration: 0.01ms !important;
      animation-delay: 0s !important;
    }
  }
`;

interface OptionModel {
  element: HTMLOptionElement;
  value: string;
  label: string;
  disabled: boolean;
}

/**
 * glaphic-select — bespoke floating-label combobox: a text-field-style
 * trigger plus a painted listbox panel and a swinging chevron caret
 * (see the file-head comment for the anatomy and Tier-2 surface).
 */
export class GlaphicSelect extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    placeholder: { type: String },
    variant: { type: String },
    error: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };
  declare label: string;
  declare value: string;
  declare placeholder: string;
  declare variant: string;
  declare error: boolean;
  declare required: boolean;
  declare open: boolean;
  declare disabled: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.variant = 'bubble';
    this.error = false;
    this.required = false;
    this.open = false;
    this.disabled = false;
  }

  private models: OptionModel[] = [];
  /* the keyboard-navigated row index while the panel is open */
  private activeIndex = -1;

  private get field(): HTMLElement {
    return this.shadowRoot!.querySelector('.field')!;
  }

  /* rows carry ids for aria-activedescendant targeting; the model is
     rebuilt whenever the consumer's children change */
  private onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const options = slot.assignedElements() as HTMLOptionElement[];
    this.models = options.map((element, index) => {
      element.setAttribute('role', 'option');
      element.setAttribute('id', `option-${index}`);
      if (element.disabled) {
        element.setAttribute('aria-disabled', 'true');
      }
      return {
        element,
        value: element.value, /* native: defaults to the text when no value attr */
        label: element.textContent!.trim(),
        disabled: element.disabled,
      };
    });
    this.requestUpdate();
  };

  private setIndex(index: number) {
    const last = this.models.length - 1;
    this.activeIndex = Math.max(0, index);
    if (this.activeIndex > last) {
      this.activeIndex = last;
    }
    /* the flag lives on the light-DOM row — ::slotted(.active) paints */
    this.models.forEach((model, i) => {
      model.element.classList.toggle('active', i === this.activeIndex);
    });
    this.requestUpdate();
  }

  private onTriggerClick = () => {
    if (this.disabled) return;
    this.toggleOpen();
  };

  private toggleOpen() {
    /* opening marks NO row active — the panel reads unwalked until an
       arrow key (or the pointer) lands on one */
    if (this.open) {
      this.setOpen(false);
    } else {
      this.setOpen(true);
    }
  }

  private setOpen(target: boolean) {
    if (this.open === target) return;
    this.open = target;
    if (target) {
      document.addEventListener('pointerdown', this.onOutside, { capture: true });
    } else {
      this.activeIndex = -1;
      this.models.forEach((model) => model.element.classList.remove('active'));
      document.removeEventListener('pointerdown', this.onOutside, { capture: true });
    }
  }

  /* a click outside the host closes (capture phase — the outside
     click's own handlers win) */
  private onOutside = (e: PointerEvent) => {
    if (!(e.composedPath() as Node[]).includes(this)) {
      this.setOpen(false);
    }
  };

  private select(index: number) {
    const model = this.models[index];
    if (!model || model.disabled) return;
    this.value = model.value;
    this.setOpen(false);
    this.field.focus();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (!this.open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.toggleOpen();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.setIndex(this.activeIndex < 0 ? 0 : Math.min(this.models.length - 1, this.activeIndex + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        /* from an unwalked panel, ArrowUp starts on the LAST row */
        this.setIndex(
          this.activeIndex < 0
            ? this.models.length - 1
            : Math.max(0, this.activeIndex - 1),
        );
        break;
      case 'Home':
        e.preventDefault();
        this.setIndex(0);
        break;
      case 'End':
        e.preventDefault();
        this.setIndex(this.models.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.select(this.activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        this.setOpen(false);
        this.field.focus();
        break;
      case 'Tab':
        this.setOpen(false);
        break;
    }
  };

  private onOptionClick = (e: Event) => {
    /* a slotted child's click retargets to the slot in the shadow —
       find the real option on the composed path */
    const element = (e.composedPath() as HTMLOptionElement[]).find(
      (node) => node.tagName === 'OPTION',
    );
    if (!element || element.disabled) return;
    const index = this.models.findIndex((m) => m.element === element);
    if (index < 0) return;
    this.select(index);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this.onOutside, { capture: true });
  }

  protected override updated(): void {
    /* mirror value-presence to the host — CSS cannot read the
       property, and the with-value paint hangs on it */
    this.toggleAttribute('filled', this.value !== '');
  }

  render() {
    const picked = this.models.find((m) => m.value === this.value);
    const open = this.open && !this.disabled;
    const activeId = open && this.activeIndex >= 0 ? `option-${this.activeIndex}` : null;
    return html`
      ${this.label
        ? html`<span class="label ${this.placeholder ? 'has-placeholder' : ''}"
              aria-hidden="true">${this.label}${this.required
              ? html`<span class="required" aria-hidden="true">*</span>`
              : ''}</span>`
        : ''}
      <button
        class="field"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls="panel"
        aria-activedescendant=${activeId ?? ''}
        aria-required=${this.required ? 'true' : 'false'}
        aria-label=${this.label ? this.label : this.placeholder ? this.placeholder : 'value'}
        ?disabled=${this.disabled}
        @click=${this.onTriggerClick}
        @keydown=${this.onKeydown}
      >
        ${picked
          ? html`<span class="value">${picked.label}</span>`
          : this.placeholder
            ? html`<span class="placeholder">${this.placeholder}</span>`
            : ''}
        <svg class="caret" viewBox="0 0 19.8 19.8" aria-hidden="true">
          <path
            d="M4.4 6.6L9.9 12.1L15.4 6.6"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </button>
      <ul
        id="panel"
        class="panel ${open ? 'open' : ''}"
        role="listbox"
        aria-label=${this.label ? this.label : 'options'}
        tabindex="-1"
        @slotchange=${this.onSlotChange}
        @click=${this.onOptionClick}
        @keydown=${this.onKeydown}
      >
        <slot></slot>
      </ul>
    `;
  }
}

customElements.define('glaphic-select', GlaphicSelect);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-select': GlaphicSelect;
  }
}