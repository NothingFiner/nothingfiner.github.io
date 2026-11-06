import { LitElement, css, html } from 'lit';

/**
 * glaphic-slider — the new-look range control, rebuilt from the
 * Figma slider design (inputs frame, 83:16596). Anatomy: a value
 * readout (16px mono, cool-600 ink) followed by a native
 * <input type="range"> painted as an 8px rail with a 15×15 sharp
 * knob in the same grey, marked by a 1px paper keyline on its LEFT
 * edge — the notch. Inside the rail an ::after inner line (3px,
 * cool-400) runs from the knob to the rail's far end — the active
 * area, as in the design. (The design's range component carries a
 * second, max-limit thumb whose keyline sits on the RIGHT edge;
 * this single-slider component ships only the first thumb.) A grey
 * chip labeled by the `label` attribute floats at the row's
 * top-left (top −9px, left 2px), carrying the accessible name.
 *
 * This REPLACES glaphic-instrument (deleted); the legacy HUD
 * readout system — zero-padded integers, suffix, uppercase, ticked
 * hairline track — is retired. No hover or disabled state exists in
 * the Figma design for the slider: hover is left to the native input
 * (nothing), and disabled derives the switch's cool hold (flagged in
 * the docs prose). No opacity, no color-mix — every layer is an
 * opaque fill.
 *
 * Events: the native input's `input`/`change` retarget to the host —
 * no wrapper events (the instrument pattern). `value` tracks the
 * input.
 *
 * Attributes/properties: label (chip text + accessible name),
 * value/min/max/step (numbers), disabled.
 *
 * Tier-2 (declare on the element):
 * --glaphic-slider-width (169px) · -rail (8px) · -rail-color ·
 * -knob (15px) · -knob-color · -knob-keyline · -line (3px) ·
 * -line-color · -value-ink · -chip-bg · -chip-ink · -gap (10px) ·
 * -disabled-rail · -disabled-knob · -disabled-line ·
 * -disabled-value-ink
 */

const shadowStyles = css`
  :host {
    display: inline-flex;
    position: relative;
    align-items: center;
    gap: var(--glaphic-slider-gap, 10px);
    padding: 10px;
    --glaphic-slider-width: 169px;
    --glaphic-slider-rail: 8px;
    --glaphic-slider-rail-color: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-slider-knob: 15px;
    --glaphic-slider-knob-color: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-slider-knob-keyline: var(--glaphic-neutral-paper, #f2f5eb);
    --glaphic-slider-line: 3px;
    --glaphic-slider-line-color: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-slider-value-ink: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-slider-chip-bg: var(--glaphic-neutral-grey-cool-600, #686474);
    --glaphic-slider-chip-ink: var(--glaphic-neutral-paper-deep, #e9ede0);
    --glaphic-slider-disabled-rail: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    --glaphic-slider-disabled-knob: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-slider-disabled-line: var(--glaphic-neutral-grey-cool-300, #bab6c7);
    --glaphic-slider-disabled-value-ink: var(--glaphic-neutral-grey-cool-300, #bab6c7);
  }
  .chip {
    position: absolute;
    top: -9px;
    left: 2px;
    padding: 2px 4px;
    background: var(--glaphic-slider-chip-bg);
    color: var(--glaphic-slider-chip-ink);
    font: 400 var(--glaphic-font-size-2, 12px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    letter-spacing: 0.6px;
    white-space: nowrap;
  }
  output.value {
    font: 400 var(--glaphic-font-size-3, 16px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    letter-spacing: 0.8px;
    color: var(--glaphic-slider-value-ink);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  /* .rail wraps the input so the ::after inner line can overlay the
     track; the input fills it */
  .rail {
    position: relative;
    display: flex;
  }
  /* the active-area line — a 3px inner line running from the knob to
     the rail's far end, 1px short of the right cap, as in the
     design. --glaphic-slider-fill is the knob's unitless travel
     fraction, set inline from the render */
  .rail::after {
    content: '';
    position: absolute;
    top: calc(50% - var(--glaphic-slider-line) / 2);
    left: calc(
      var(--glaphic-slider-fill, 0) * (var(--glaphic-slider-width) - var(--glaphic-slider-knob)) +
        var(--glaphic-slider-knob)
    );
    right: 1px;
    height: var(--glaphic-slider-line);
    background: var(--glaphic-slider-line-color);
    pointer-events: none; /* the line overlays the drag band — it must not eat the pointer */
  }
  input[type='range'] {
    height: 21px; /* the value line's height — the row centers both */
    width: var(--glaphic-slider-width);
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    padding: 0;
    margin: 0; /* the UA sheet gives range inputs a 2px margin */
    cursor: pointer;
  }
  input[type='range']:focus-visible {
    outline: 2px solid var(--glaphic-ui-focus, #8447ff);
    outline-offset: 2px;
  }
  /* the rail IS the track: an 8px line; the 15×15 sharp knob rides
     its center line, set by margin-top −(knob − rail)/2 */
  input[type='range']::-webkit-slider-runnable-track {
    height: var(--glaphic-slider-rail);
    background: var(--glaphic-slider-rail-color);
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box; /* the keyline lives INSIDE the 15px knob */
    width: var(--glaphic-slider-knob);
    height: var(--glaphic-slider-knob);
    background: var(--glaphic-slider-knob-color);
    border: none;
    border-left: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-slider-knob-keyline);
    border-radius: 0;
    margin-top: calc((var(--glaphic-slider-rail) - var(--glaphic-slider-knob)) / 2);
  }
  input[type='range']::-moz-range-track {
    height: var(--glaphic-slider-rail);
    background: var(--glaphic-slider-rail-color);
  }
  input[type='range']::-moz-range-thumb {
    box-sizing: border-box; /* the keyline lives INSIDE the 15px knob */
    width: var(--glaphic-slider-knob);
    height: var(--glaphic-slider-knob);
    background: var(--glaphic-slider-knob-color);
    border: none;
    border-left: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-slider-knob-keyline);
    border-radius: 0;
  }
  /* disabled re-seats the Tier-2 color tokens at the :host level —
     the pseudos consume the same vars, and the hold stays readable
     (getComputedStyle cannot resolve backgrounds on webkit range
     pseudos); no hover exists to guard */
  :host([disabled]) {
    --glaphic-slider-rail-color: var(--glaphic-slider-disabled-rail);
    --glaphic-slider-knob-color: var(--glaphic-slider-disabled-knob);
    --glaphic-slider-line-color: var(--glaphic-slider-disabled-line);
    --glaphic-slider-value-ink: var(--glaphic-slider-disabled-value-ink);
  }
  :host([disabled]) input {
    cursor: not-allowed;
  }
  :host([disabled]) output.value {
    cursor: not-allowed;
  }
`;

/**
 * glaphic-slider — native range input wearing the Figma rail + notch
 * knob + value readout (see the file-head comment for the anatomy
 * and Tier-2 surface).
 */
export class GlaphicSlider extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean, reflect: true },
  };
  declare label: string;
  declare value: number;
  declare min: number;
  declare max: number;
  declare step: number;
  declare disabled: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.label = '';
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
  }

  private onInput = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
  };

  /** the knob's unitless travel fraction (clamped 0..1), driving the
   * ::after active-area line's left edge */
  private get fill(): number {
    const span = this.max - this.min;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (this.value - this.min) / span));
  }

  render() {
    const inputId = 'input';
    /* reserve the widest representable value's digit count: a readout
       that resizes mid-drag (99 → 100) shifts the rail under the
       pointer and rubber-bands the value around the digit boundary */
    const digits = String(
      Math.max(Math.abs(this.max), Math.abs(this.min)),
    ).length;
    return html`
      ${this.label
        ? html`<label class="chip" for=${inputId}>${this.label}</label>`
        : ''}
      <output class="value" for=${inputId} style="min-width: ${digits}ch"
        >${String(this.value)}</output
      >
      <span class="rail" style="--glaphic-slider-fill: ${this.fill}">
        <input
          id=${inputId}
          type="range"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          aria-label=${this.label ? this.label : 'value'}
          @input=${this.onInput}
        />
      </span>
    `;
  }
}

customElements.define('glaphic-slider', GlaphicSlider);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-slider': GlaphicSlider;
  }
}