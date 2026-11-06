import { LitElement, css, html } from 'lit';

/**
 * glaphic-crumb — one crumb of Eliot's breadcrumbs trail. The crumb
 * is a label at the trail's left, followed (unless it is the trail's
 * last crumb) by the `///` separator — three skewed 0.86px bars
 * sharing a 2.395px pitch, tilted to lean right going up (the
 * geometry read straight off the design's filled paths).
 *
 * The last crumb among its light-DOM siblings IS the current page,
 * automatically: it takes the ink-black cast and carries
 * aria-current="page"; the `current` read is DOM order, so no
 * attribute is authored. Earlier crumbs ride the cool-600 voice.
 * Give an ancestor crumb `href` and its label renders as an anchor —
 * the current crumb is normally href-less (it's where you are, not
 * where you go).
 *
 * The trail's knobs cascade from the wrapper (or the page): the
 * crumb's own defaults are the design values.
 *
 * Tier-2 — --glaphic-crumbs-size (12px) · -font (the mono stack) ·
 *          -ancestor-ink · -current-ink · -separator-ink · -gap (4px)
 */
export class GlaphicCrumb extends LitElement {
  static properties = {
    /** the ancestor crumb's destination (renders the label as an anchor) */
    href: { type: String },
  };
  declare href: string;

  /** set at connection: is this crumb the last among its siblings */
  private isLast = false;

  constructor() {
    super();
    this.href = '';
  }

  override connectedCallback() {
    super.connectedCallback();
    this.isLast = this.parentElement !== null && this.parentElement.lastElementChild === this;
    /* the current-page read is DOM order: the last crumb carries
       aria-current="page", its siblings carry none */
    if (this.isLast) {
      this.setAttribute('aria-current', 'page');
    } else {
      this.removeAttribute('aria-current');
    }
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      font-family: var(--glaphic-crumbs-font, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      font-size: var(--glaphic-crumbs-size, 12px);
      font-weight: 500;
      line-height: 1;
      letter-spacing: 0px;
      vertical-align: top;
    }
    .label {
      color: var(--glaphic-crumbs-ancestor-ink, var(--glaphic-neutral-grey-cool-600, #686474));
      text-decoration: none;
    }
    a.label {
      cursor: pointer;
    }
    a.label:hover {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }
    a.label:focus-visible {
      outline: 2px solid var(--glaphic-ui-focus, #8447ff);
      outline-offset: 2px;
    }
    /* the last crumb IS the current page — ink-black, no anchor */
    :host(:last-child) .label {
      color: var(--glaphic-crumbs-current-ink, var(--glaphic-ink-black, #0d0221));
    }
    /* the /// trail separator — three 0.86px bars on a 2.395px pitch,
       skewed to lean right going up (dx 4.176 over a 10.776 rise).
       Painted by the crumb itself so the wrapper slots one trail
       straight through; the last crumb drops it */
    .sep {
      position: relative;
      box-sizing: border-box;
      flex: none;
      /* the skew's visual spread runs 2.09px past the box on each
         side — the margin carries that so the designed 4px gaps hold */
      margin: 0 calc(var(--glaphic-crumbs-gap, 4px) + 2.09px);
      width: 5.654px;
      height: 10.776px;
      transform: skewX(-21.16deg);
      background: repeating-linear-gradient(
        to right,
        var(--glaphic-crumbs-separator-ink, var(--glaphic-neutral-grey-cool-600, #686474)) 0 0.864px,
        transparent 0.864px 2.395px
      );
    }
    :host(:last-child) .sep {
      display: none;
    }
  `;

  protected render() {
    const label = html`<slot></slot>`;
    return html`
      ${this.href
        ? html`<a class="label" part="label" href=${this.href}>${label}</a>`
        : html`<span class="label" part="label">${label}</span>`}
      <span class="sep" part="separator" aria-hidden="true"></span>
    `;
  }
}

customElements.define('glaphic-crumb', GlaphicCrumb);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-crumb': GlaphicCrumb;
  }
}