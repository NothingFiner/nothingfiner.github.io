import { LitElement, css, html } from 'lit';

let itemSerial = 0;

/**
 * glaphic-accordion-item — one accordion row (Eliot's accordion
 * design): a buttoned header riding a `<slot>`ed body. Lives inside
 * a glaphic-accordion (which owns the single-open hold and the
 * stack's outer radius), but renders correctly on its own.
 *
 * Anatomy —
 * - the header: full-width button, the mono label at the row's left
 *   edge, the hollow diamond at the right. The diamond is STATIC —
 *   the design points it the same way closed and open; the open
 *   tell is the label's pair of hard 1px shadows (right copy
 *   warm-200, left copy warm-300) instead of a rotated caret.
 * - the body: the default slot, collapsed by a 0fr→1fr grid track
 *   behind a warm-200 top rule. Body copy inherits the slot's
 *   surroundings (the page's body voice) with the ink-black cast.
 * - the 45° square reads 10px with a 1px cool-600 outline in the
 *   sheet — a rotated box, not a drawn path.
 *
 * Interaction —
 * - `open` (Boolean, reflected): click the header to toggle. Only
 *   the user's click dispatches the 'glaphic-accordion-open-request'
 *   event the wrapper holds siblings with — programmatic opens never
 *   close anything else.
 * - open rows let go of their neighbours: 16px of ground above and
 *   below (Eliot confirmed intentional).
 * - multiply (Boolean, presence on — the band pattern): every row
 *   blends against the page; the constructor carries the default.
 *
 * Motion (MUI's collapse, reduced-motion safe) — the body track and
 * the open gaps expand over 300ms together; under
 * prefers-reduced-motion: reduce the grid track, the margins and the
 * visibility flip with no transition.
 *
 * Tier-2 (declare on the element or inherit through the wrapper) —
 * --glaphic-accordion-surface · -hover-surface · -separator ·
 * -ink · -font · -label-size · -header-height ·
 * -body-rule · -body-ink · -body-font · -body-size · -body-line-height ·
 * -body-padding · -open-gap · -open-shadow-right · -open-shadow-left ·
 * -radius (the stack's outer corners) · -motion (the duration)
 */
export class GlaphicAccordionItem extends LitElement {
  static properties = {
    /** the row's state (reflected — CSS keys everything off it) */
    open: { type: Boolean, reflect: true },
    /** the header's copy */
    label: { type: String },
    /** the multiply toggle (presence on) */
    multiply: { type: Boolean, reflect: true },
  };
  declare open: boolean;
  declare label: string;
  /** the multiply toggle (presence on) */
  declare multiply: boolean;

  private readonly headId: string;
  private readonly bodyId: string;

  constructor() {
    super();
    this.open = false;
    this.label = '';
    this.multiply = true;
    /* accessible-name wiring: the header names the body region */
    const serial = itemSerial++;
    this.headId = `glaphic-accordion-head-${serial}`;
    this.bodyId = `glaphic-accordion-body-${serial}`;
  }

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      /* the row IS the sheet's fill; the outer radius comes from the
         wrapper's ::slotted first/last rules, overflow carries it */
      overflow: hidden;
      background: var(--glaphic-accordion-surface, var(--glaphic-neutral-paper, #f2f5eb));
    }
    :host([multiply]) {
      mix-blend-mode: multiply;
    }
    /* the shared hairline: the first row tops itself, every row but
       the last drops a bottom rule (the sheet's cool-200 seams) */
    :host(:first-child) {
      border-top: 1px solid var(--glaphic-accordion-separator, var(--glaphic-neutral-grey-cool-200, #d5d2de));
    }
    :host(:not(:last-child)) {
      border-bottom: 1px solid var(--glaphic-accordion-separator, var(--glaphic-neutral-grey-cool-200, #d5d2de));
    }
    /* the open row lets go of its neighbours — 16px of ground above
       and below (design, intentional) */
    :host([open]) {
      margin-top: var(--glaphic-accordion-open-gap, 16px);
      margin-bottom: var(--glaphic-accordion-open-gap, 16px);
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-sizing: border-box;
      width: 100%;
      min-height: var(--glaphic-accordion-header-height, 44px);
      padding: 0 16px;
      margin: 0;
      border: 0px;
      background: transparent;
      text-align: start;
      font-family: var(--glaphic-accordion-font, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      font-size: var(--glaphic-accordion-label-size, 16px);
      font-weight: 500;
      line-height: 1;
      letter-spacing: 0px;
      color: var(--glaphic-accordion-ink, var(--glaphic-neutral-grey-cool-600, #686474));
      cursor: pointer;
    }
    .head:hover {
      background: var(--glaphic-accordion-hover-surface, var(--glaphic-neutral-paper-deep, #e9ede0));
    }
    .head:focus-visible {
      outline: 2px solid var(--glaphic-ui-focus, #8447ff);
    }
    .head-label {
      display: inline-block;
      /* the open tell — the label's hard 1px twins, no blur: right
         copy warm-200, left copy warm-300 (multiply-safe solids) */
    }
    :host([open]) .head-label {
      text-shadow:
        1px 0 0 var(--glaphic-accordion-open-shadow-right, var(--glaphic-neutral-grey-warm-200, #dee2d3)),
        -1px 0 0 var(--glaphic-accordion-open-shadow-left, var(--glaphic-neutral-grey-warm-300, #c8cdbd));
    }
    .diamond {
      flex: none;
      box-sizing: border-box;
      width: 10px;
      height: 10px;
      border: 1px solid var(--glaphic-accordion-ink, var(--glaphic-neutral-grey-cool-600, #686474));
      /* static in both states — the design's tell is the shadow pair,
         not a rotated caret */
      transform: rotate(45deg);
    }
    /* the body: one grid track 0fr→1fr, the slot's copy clipped
       inside — the warm-200 rule sits at the body's top edge */
    .body {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
    }
    :host([open]) .body {
      grid-template-rows: 1fr;
      visibility: visible;
    }
    .inner {
      /* the grid item rides the 0fr track — NO padding, NO border of
         its own: Chromium floors an auto-height 0fr track at the
         item's padding+border (31px read), so the panel inside
         carries them */
      min-height: 0;
      overflow: hidden;
    }
    .panel {
      box-sizing: border-box;
      /* the body copy takes the look's sans voice — slotted content
         can't inherit a page font through the shadow boundary */
      font-family: var(--glaphic-accordion-body-font, var(--glaphic-font-family-sans, 'Plus Jakarta Sans', sans-serif));
      border-top: 1px solid var(--glaphic-accordion-body-rule, var(--glaphic-neutral-grey-warm-200, #dee2d3));
      padding: var(--glaphic-accordion-body-padding, 14px 16px 16px);
      font-size: var(--glaphic-accordion-body-size, 16px);
      line-height: var(--glaphic-accordion-body-line-height, 1.19);
      color: var(--glaphic-accordion-body-ink, var(--glaphic-ink-black, #0d0221));
    }
    /* MUI's collapse: track + margins over 300ms, visibility flips
       last on the way down. Under reduce the whole thing snaps */
    @media (prefers-reduced-motion: no-preference) {
      :host {
        transition: margin var(--glaphic-accordion-motion, 300ms) cubic-bezier(0.4, 0, 0.2, 1);
      }
      .body {
        transition:
          grid-template-rows var(--glaphic-accordion-motion, 300ms) cubic-bezier(0.4, 0, 0.2, 1),
          visibility 0s linear var(--glaphic-accordion-motion, 300ms);
      }
      :host([open]) .body {
        transition:
          grid-template-rows var(--glaphic-accordion-motion, 300ms) cubic-bezier(0.4, 0, 0.2, 1),
          visibility 0s;
      }
    }
  `;

  private toggle() {
    this.open = !this.open;
    /* only the user's click holds the single-open grip — the wrapper
       listens for the request; programmatic opens never close
       siblings */
    if (this.open) {
      this.dispatchEvent(new CustomEvent('glaphic-accordion-open-request', { bubbles: true }));
    }
  }

  protected render() {
    return html`<button
        id=${this.headId}
        class="head"
        part="header"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${this.bodyId}
        @click=${this.toggle}>
        <span class="head-label">${this.label}</span>
        <span class="diamond" part="diamond" aria-hidden="true"></span>
      </button>
      <div
        id=${this.bodyId}
        class="body"
        part="body"
        role="region"
        aria-labelledby=${this.headId}>
        <div class="inner"><div class="panel"><slot></slot></div></div>
      </div>`;
  }
}

customElements.define('glaphic-accordion-item', GlaphicAccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-accordion-item': GlaphicAccordionItem;
  }
}