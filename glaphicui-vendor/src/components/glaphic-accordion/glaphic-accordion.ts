import { LitElement, css, html } from 'lit';
import type { GlaphicAccordionItem } from './glaphic-accordion-item.js';

/**
 * glaphic-accordion — the wrapper of Eliot's accordion: stacks
 * glaphic-accordion-item rows flush and owns the two behaviors the
 * rows can't carry alone —
 *
 * - the outer radius: the stack's first and last rows round to the
 *   card radius (2px), passed through ::slotted first/last rules.
 *   Tunable via --glaphic-accordion-radius.
 * - the single-open hold (default): a row opening dispatches
 *   'glaphic-accordion-open-request' and this wrapper closes every
 *   sibling. `multi` (presence attribute) opts out — every row keeps
 *   its own state.
 *
 * The wrapper paints nothing — the rows are the paper, hairlines and
 * blend; each row's `multiply` presence attribute toggles its own
 * blend (the band pattern).
 */
export class GlaphicAccordion extends LitElement {
  static properties = {
    /** presence-based: every row keeps its own state */
    multi: { type: Boolean, reflect: true },
  };
  declare multi: boolean;

  static styles = css`
    :host {
      display: block;
    }
    /* the stack's ends round to the card radius */
    ::slotted(glaphic-accordion-item:first-child) {
      border-radius: var(--glaphic-accordion-radius, 2px) var(--glaphic-accordion-radius, 2px) 0 0;
    }
    ::slotted(glaphic-accordion-item:last-child) {
      border-radius: 0 0 var(--glaphic-accordion-radius, 2px) var(--glaphic-accordion-radius, 2px);
    }
    ::slotted(glaphic-accordion-item:first-child:last-child) {
      border-radius: var(--glaphic-accordion-radius, 2px);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('glaphic-accordion-open-request', this.closeSiblings);
  }

  override disconnectedCallback() {
    this.removeEventListener('glaphic-accordion-open-request', this.closeSiblings);
    super.disconnectedCallback();
  }

  private closeSiblings = (event: Event) => {
    if (this.multi) {
      return;
    }
    const opened = event.target as GlaphicAccordionItem;
    for (const item of this.querySelectorAll<GlaphicAccordionItem>('glaphic-accordion-item')) {
      if (item !== opened) {
        item.open = false;
      }
    }
  };

  protected render() {
    return html`<slot></slot>`;
  }
}

customElements.define('glaphic-accordion', GlaphicAccordion);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-accordion': GlaphicAccordion;
  }
}