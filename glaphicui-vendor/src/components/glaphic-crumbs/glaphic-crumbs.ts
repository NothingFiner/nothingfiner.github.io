import { LitElement, css, html } from 'lit';

/**
 * glaphic-crumbs — the breadcrumbs trail (Eliot's design): a nav
 * wrapper slotting glaphic-crumb labels flush along one line. The
 * crumbs bring their own `///` separators and their own current-page
 * read (the last crumb among the slotted siblings takes the
 * ink-black cast), so the wrapper only owns the nav semantics, the
 * line and the trail knobs.
 *
 * Tier-2 — --glaphic-crumbs-size · -font · -ancestor-ink ·
 *          -current-ink · -separator-ink · -gap (the crumb knobs; see
 *          the crumb — declared here only as the wrapper's own
 *          pass-through defaults)
 */
export class GlaphicCrumbs extends LitElement {
  static properties = {
    /** the nav's accessible label */
    label: { type: String },
  };
  declare label: string;

  constructor() {
    super();
    this.label = 'Breadcrumbs';
  }

  static styles = css`
    :host {
      display: block;
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  `;

  protected render() {
    return html`<nav part="nav" aria-label=${this.label}><slot></slot></nav>`;
  }
}

customElements.define('glaphic-crumbs', GlaphicCrumbs);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-crumbs': GlaphicCrumbs;
  }
}