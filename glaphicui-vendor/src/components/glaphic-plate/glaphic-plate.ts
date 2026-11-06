import { LitElement, css, html } from 'lit';

/**
 * glaphic-plate — the decorative flat rectangle (Eliot: "elements
 * like the visual squares should be able to be placed as a background
 * that doesn't interfere with the dom, both in cards and the site's
 * general background").
 *
 * A paint-only element: the host paints NOTHING except its tone's
 * fill — no children render, no border, no radius — and it takes no
 * part in the layout: the host is absolutely positioned (default
 * z-index −1, so it sits above the containing card's or section's
 * own fill and below the flow content), pointer-events: none, and
 * aria-hidden: true. Its size comes from the consumer — two sides of
 * insets stretch it, or width/height styles pin it.
 *
 * Tone (the source-art palette; every tone maps to a live token):
 * - 'brand' (default) — ink-brand-dark #a6022a
 * - 'fluro' — the fluro red, multiply-magenta-yellow #f81d41
 *   (== hero-red; flagged: two tokens share the value)
 * - 'cyan' — ink-brand-fluro #14f1c8 (the mint fluro; the tone is
 *   named cyan per the directive, the token says brand-fluro)
 * - 'pale' — paper-deep #e9ede0
 * - 'yellow' — ink-yellow #ffff41
 *
 * Placement Tier-2 (declare on the element or an ancestor) —
 * --glaphic-plate-inset-block-start · -inset-block-end ·
 * -inset-inline-start · -inset-inline-end (the logical insets;
 * `auto` default) and the explicit physical overrides
 * --glaphic-plate-top · -right · -bottom · -left
 * (a set physical side wins over the logical inset).
 * --glaphic-plate-stacking (z-index, default −1) and
 * --glaphic-plate-paint (the fill) retune the rest.
 *
 * Stacking note: the −1 default trusts the container to BE a stacking
 * context — a card always is (the panel isolates itself); a plain
 * section needs isolation: isolate (or position + z-index) or the
 * plate drops under its background.
 */
export class GlaphicPlate extends LitElement {
  static properties = {
    /** the fill: 'brand' (default) | 'fluro' | 'cyan' | 'pale' | 'yellow' */
    tone: { type: String, reflect: true },
  };
  declare tone: string;

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      /* no layout participation: out of flow, unclickable, unnamed */
      position: absolute;
      inset-block-start: var(--glaphic-plate-inset-block-start, auto);
      inset-block-end: var(--glaphic-plate-inset-block-end, auto);
      inset-inline-start: var(--glaphic-plate-inset-inline-start, auto);
      inset-inline-end: var(--glaphic-plate-inset-inline-end, auto);
      /* the explicit physical sides override the logical insets —
         each falls back to the logical var, then to auto */
      top: var(--glaphic-plate-top, var(--glaphic-plate-inset-block-start, auto));
      bottom: var(--glaphic-plate-bottom, var(--glaphic-plate-inset-block-end, auto));
      left: var(--glaphic-plate-left, var(--glaphic-plate-inset-inline-start, auto));
      right: var(--glaphic-plate-right, var(--glaphic-plate-inset-inline-end, auto));
      /* behind the flow by default — trusted inside a card (which
         isolates itself); page-background hosts need their own
         stacking context (isolation: isolate) for this to hold */
      z-index: var(--glaphic-plate-stacking, -1);
      pointer-events: none;
      /* one paint: the tone's fill. No alpha anywhere. */
      --glaphic-plate-paint: var(--glaphic-ink-brand-dark, #a6022a);
      background: var(--glaphic-plate-paint);
    }
    :host([tone='fluro']) {
      --glaphic-plate-paint: var(--glaphic-multiply-magenta-yellow, #f81d41);
    }
    :host([tone='cyan']) {
      --glaphic-plate-paint: var(--glaphic-ink-brand-fluro, #14f1c8);
    }
    :host([tone='pale']) {
      --glaphic-plate-paint: var(--glaphic-neutral-paper-deep, #e9ede0);
    }
    :host([tone='yellow']) {
      --glaphic-plate-paint: var(--glaphic-ink-yellow, #ffff41);
    }
  `;

  constructor() {
    super();
    this.tone = 'brand';
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  /* no template: the host paints itself; consumer children render nothing */
  render() {
    return html``;
  }
}

customElements.define('glaphic-plate', GlaphicPlate);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-plate': GlaphicPlate;
  }
}