import { LitElement, css, html } from 'lit';

/**
 * glaphic-switch — the new-look furniture switch, rebuilt from the
 * Figma Switch component set (NewDesigns, 75:15859: color
 * Default/Primary/Secondary/Danger × State × on). Shadow DOM
 * furniture: a radius-2 button is the TRACK, a radius-2 knob <i>
 * rides it, and the state word ("On"/"Off", 11px mono regular) sits
 * 10px to the right, rendered INTERNALLY per the design.
 *
 * This build HARD-BREAKS the old API: the plate/alpha tint system
 * (--glaphic-switch-tint/-depth/-rim/knob color-mix physics) is
 * retired along with the legacy slot label and the
 * --hot/--cold/--platec/--muted reads. Every state pair is opaque
 * and token-driven — no color-mix, no opacity. Hover exists only
 * where the Figma set designs it coherently (neutral on+off, primary
 * off, danger off; the set's two mislabeled on-slot hover drafts are
 * ignored) — variants without a designed hover fall back to their
 * rest paint, and rules are guarded :not([disabled]).
 *
 * Attributes:
 * - checked: the switch state (reflected; keeps the legacy name).
 * - variant: 'neutral' (default, Figma "color=Default") | 'primary'
 *   | 'secondary' | 'danger' — the Figma component's Color axis.
 * - disabled: cool-grey hold; no hover under the pointer.
 * - force-hover: declarative mirror of :hover for docs and tests.
 *
 * Fires a bubbling+composed `change` event (detail.checked) when
 * toggled; the role="switch" button toggles on click, Space, Enter.
 *
 * Sizing consumes the Tier-1 tokens directly — --glaphic-switch-
 * track-x (56), -track-y (28, = --glaphic-spacing-9), -toggle-size
 * (20, = --glaphic-spacing-7) — WITHOUT redeclaring them here: a
 * :host block naming itself is a cyclic var() and collapses to
 * invalid. Override them at the consumer, not here.
 *
 * Tier-2 (declare on the element; the :host block and the variant
 * rules below are the defaults):
 * --glaphic-switch-radius · -track · -keyline · -knob ·
 * -on-track · -on-keyline · -on-knob ·
 * -hover-track · -hover-keyline · -hover-knob (hover while off) ·
 * -on-hover-track · -on-hover-keyline · -on-hover-knob ·
 * -word ·
 * -disabled-track · -disabled-keyline · -disabled-knob · -disabled-word
 */

const shadowStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    /* Tier-2 defaults = the neutral (Figma "color=Default") table */
    /* derived geometry — knob inset stays centered no matter how the
       track or toggle size are overridden */
    --glaphic-switch-inset: calc(
      (var(--glaphic-switch-track-y, 28px) - var(--glaphic-switch-toggle-size, 20px)) / 2 - 1px
    );
    --glaphic-switch-travel: calc(
      var(--glaphic-switch-track-x, 56px) - var(--glaphic-switch-toggle-size, 20px) -
        var(--glaphic-switch-inset) * 2 - 2px
    );
    --glaphic-switch-radius: var(--glaphic-radius-base, 2px);
    --glaphic-switch-track: var(--glaphic-neutral-grey-warm-200, #dee2d3);
    --glaphic-switch-keyline: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-switch-knob: var(--glaphic-neutral-grey-cool-500, #817d8f);
    --glaphic-switch-on-track: var(--glaphic-neutral-grey-warm-700, #565c4f);
    --glaphic-switch-on-keyline: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-switch-on-knob: var(--glaphic-neutral-grey-warm-100, #ecefe6);
    /* neutral hover OFF previews the on-look (the Figma hover set) */
    --glaphic-switch-hover-track: var(--glaphic-switch-on-track);
    --glaphic-switch-hover-keyline: var(--glaphic-switch-on-keyline);
    --glaphic-switch-hover-knob: var(--glaphic-switch-on-knob);
    --glaphic-switch-on-hover-track: var(--glaphic-neutral-paper-deep, #e9ede0);
    --glaphic-switch-on-hover-keyline: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-switch-on-hover-knob: var(--glaphic-neutral-grey-cool-700, #504c5a);
    --glaphic-switch-word: var(--glaphic-ink-black, #0d0221);
    --glaphic-switch-disabled-track: var(--glaphic-neutral-grey-cool-100, #e9e7ef);
    --glaphic-switch-disabled-keyline: var(--glaphic-neutral-grey-cool-200, #d5d2de);
    --glaphic-switch-disabled-knob: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-switch-disabled-word: var(--glaphic-neutral-grey-cool-400, #9d99ab);
  }
  /* variant tables — state triples extracted from the Figma dump;
     variants without a designed hover point hover back at their rest
     paint (the on-slot hover comps in the set are mislabeled drafts) */
  :host([variant='primary']) {
    --glaphic-switch-track: var(--glaphic-neutral-grey-cool-100, #e9e7ef);
    --glaphic-switch-keyline: var(--glaphic-neutral-grey-cool-300, #bab6c7);
    --glaphic-switch-knob: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-switch-on-track: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-switch-on-keyline: var(--glaphic-ink-black, #0d0221);
    --glaphic-switch-on-knob: var(--glaphic-ink-black, #0d0221);
    --glaphic-switch-hover-track: var(--glaphic-neutral-grey-cool-50, #f4f3f7);
    --glaphic-switch-hover-keyline: var(--glaphic-ink-black, #0d0221);
    --glaphic-switch-hover-knob: var(--glaphic-ink-brand-fluro, #14f1c8);
  }
  :host([variant='secondary']) {
    --glaphic-switch-track: var(--glaphic-neutral-grey-warm-200, #dee2d3);
    --glaphic-switch-keyline: var(--glaphic-ink-black, #0d0221);
    --glaphic-switch-knob: var(--glaphic-neutral-grey-warm-500, #8c9482);
    --glaphic-switch-on-track: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-switch-on-keyline: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-switch-on-knob: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-switch-hover-track: var(--glaphic-switch-track);
    --glaphic-switch-hover-keyline: var(--glaphic-switch-keyline);
    --glaphic-switch-hover-knob: var(--glaphic-switch-knob);
  }
  :host([variant='danger']) {
    --glaphic-switch-track: var(--glaphic-semantic-danger-surface);
    --glaphic-switch-keyline: var(--glaphic-neutral-grey-warm-500, #8c9482);
    --glaphic-switch-knob: var(--glaphic-neutral-grey-warm-500, #8c9482);
    --glaphic-switch-on-track: var(--glaphic-semantic-danger-base);
    --glaphic-switch-on-keyline: var(--glaphic-semantic-danger-text);
    --glaphic-switch-on-knob: var(--glaphic-semantic-danger-surface);
    --glaphic-switch-hover-track: var(--glaphic-semantic-danger-surface);
    --glaphic-switch-hover-keyline: var(--glaphic-semantic-danger-text);
    --glaphic-switch-hover-knob: var(--glaphic-semantic-danger-base);
  }

  label { display: contents; }
  button {
    box-sizing: border-box;
    position: relative;
    padding: 0;
    appearance: none;
    width: var(--glaphic-switch-track-x, 56px);
    height: var(--glaphic-switch-track-y, 28px);
    border: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-switch-keyline);
    border-radius: var(--glaphic-switch-radius);
    background: var(--glaphic-switch-track);
    transition: background 0.12s ease, border-color 0.12s ease;
  }
  button:focus-visible {
    outline: 2px solid var(--glaphic-ui-focus, #8447ff);
    outline-offset: 2px;
  }
  i.knob {
    position: absolute;
    left: var(--glaphic-switch-inset);
    top: var(--glaphic-switch-inset);
    width: var(--glaphic-switch-toggle-size, 20px);
    height: var(--glaphic-switch-toggle-size, 20px);
    border-radius: var(--glaphic-switch-radius);
    background: var(--glaphic-switch-knob);
    transform: translateX(0);
    transition: transform 0.12s ease, background 0.12s ease;
  }
  :host([checked]) button {
    background: var(--glaphic-switch-on-track);
    border-color: var(--glaphic-switch-on-keyline);
  }
  :host([checked]) i.knob {
    background: var(--glaphic-switch-on-knob);
    transform: translateX(var(--glaphic-switch-travel));
  }
  .word {
    font: 400 var(--glaphic-font-size-1, 11px) / 15px
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    color: var(--glaphic-switch-word);
  }
  /* hover (and its declarative mirror) — guarded so disabled holds
     its grey; the on-position pair must come AFTER the off pair */
  :host(:hover:not([disabled])) button,
  :host([force-hover]:not([disabled])) button {
    background: var(--glaphic-switch-hover-track);
    border-color: var(--glaphic-switch-hover-keyline);
  }
  :host(:hover:not([disabled])) i.knob,
  :host([force-hover]:not([disabled])) i.knob {
    background: var(--glaphic-switch-hover-knob);
  }
  :host(:hover:not([disabled])[checked]) button,
  :host([force-hover][checked]:not([disabled])) button {
    background: var(--glaphic-switch-on-hover-track);
    border-color: var(--glaphic-switch-on-hover-keyline);
  }
  :host(:hover:not([disabled])[checked]) i.knob,
  :host([force-hover][checked]:not([disabled])) i.knob {
    background: var(--glaphic-switch-on-hover-knob);
  }
  /* disabled paints the cool hold regardless of the variant or the
     check state (after the variant rules in the cascade) */
  :host([disabled]) button,
  :host([checked][disabled]) button {
    background: var(--glaphic-switch-disabled-track);
    border-color: var(--glaphic-switch-disabled-keyline);
    cursor: not-allowed;
  }
  :host([disabled]) i.knob,
  :host([checked][disabled]) i.knob {
    background: var(--glaphic-switch-disabled-knob);
  }
  :host([disabled]) .word {
    color: var(--glaphic-switch-disabled-word);
  }
  @media (prefers-reduced-motion: reduce) {
    button, i.knob { transition: none; }
  }
`;

/**
 * glaphic-switch — neutral/primary/secondary/danger × checked ×
 * disabled (see the file-head comment for the state tables and the
 * Tier-2 surface). The knob inset and travel derive from the track
 * and toggle sizes (28−20 → 4px inset, 56−20−8 → 28px travel).
 */
export class GlaphicSwitch extends LitElement {
  static properties = {
    checked: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    forceHover: { type: Boolean, reflect: true, attribute: 'force-hover' },
  };
  declare checked: boolean;
  /** 'neutral' | 'primary' | 'secondary' | 'danger' */
  declare variant: string;
  declare disabled: boolean;
  declare forceHover: boolean;

  static styles = shadowStyles;

  constructor() {
    super();
    this.checked = false;
    this.variant = 'neutral';
    this.disabled = false;
    this.forceHover = false;
  }

  private toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <label>
        <button
          type="button"
          role="switch"
          part="toggle"
          aria-checked=${this.checked ? 'true' : 'false'}
          ?disabled=${this.disabled}
          @click=${this.toggle}
        ><i class="knob" aria-hidden="true"></i></button>
        <span class="word" aria-hidden="true">${this.checked ? 'On' : 'Off'}</span>
      </label>
    `;
  }
}

customElements.define('glaphic-switch', GlaphicSwitch);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-switch': GlaphicSwitch;
  }
}