import { LitElement, css } from 'lit';

/**
 * glaphic-divider — the plain rule (the simpler sibling of the
 * glaphic-tape band ladder). A full-width bar whose height is a
 * Tier-2 knob, painted by a Tier-2 ink; decorative by nature, so it
 * carries no semantics (excluded from the accessibility tree).
 * Furniture: shadow DOM, no properties at all — knobs are vars.
 *
 * Tier-2: --glaphic-divider-ink · --glaphic-divider-height
 */
export class GlaphicDivider extends LitElement {
  static styles = css`
    :host {
      display: block;
      /* the rule's cross — a hairline by default; multiples of the
         grid pitch --hz sit it on tape-band cross sizes */
      height: var(--glaphic-divider-height, 1px);
      background: var(--glaphic-divider-ink, var(--rim, rgba(23, 20, 14, 0.3)));
    }
  `;
}

customElements.define('glaphic-divider', GlaphicDivider);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-divider': GlaphicDivider;
  }
}