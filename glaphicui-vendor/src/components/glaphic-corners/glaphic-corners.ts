import { LitElement, css, html, nothing } from 'lit';

/**
 * glaphic-corners — the drawer's HUD corner brackets as reusable
 * furniture (extracted per Eliot: "the little floating corners …
 * its own component that can just wrap content").
 *
 * A frameless wrapper: the host paints nothing, the default slot
 * carries the wrapped content, and four L-shaped brackets pin
 * themselves just inside the corners (pointer-events none, so they
 * never eat clicks). Plain borders only — two per bracket — so the
 * no-mask / no-alpha physics hold.
 *
 * Attributes:
 * - corners: the subset to draw, comma-separated ('tl', 'tr', 'bl',
 *   'br'; default 'tl,tr,bl,br' — all four).
 *
 * Tier-2 (declare on the element) — the drawer's bracket geometry:
 * --glaphic-corners-ink · -size · -thickness · -inset-block ·
 * -inset-inline
 */
const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

const shadowStyles = css`
  :host {
    display: block;
    position: relative;
    /* Tier-2 defaults; consumer inline overrides win */
    --glaphic-corners-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-corners-size: 10px;
    --glaphic-corners-thickness: 1.5px;
    --glaphic-corners-inset-block: 6px;
    --glaphic-corners-inset-inline: 8px;
  }
  .bk {
    position: absolute;
    width: var(--glaphic-corners-size);
    height: var(--glaphic-corners-size);
    box-sizing: border-box;
    pointer-events: none;
  }
  /* each bracket = the drawer's two 1.5px borders meeting in its L */
  .bk-tl {
    top: var(--glaphic-corners-inset-block);
    left: var(--glaphic-corners-inset-inline);
    border-left: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
    border-top: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
  }
  .bk-tr {
    top: var(--glaphic-corners-inset-block);
    right: var(--glaphic-corners-inset-inline);
    border-right: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
    border-top: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
  }
  .bk-bl {
    bottom: var(--glaphic-corners-inset-block);
    left: var(--glaphic-corners-inset-inline);
    border-left: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
    border-bottom: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
  }
  .bk-br {
    bottom: var(--glaphic-corners-inset-block);
    right: var(--glaphic-corners-inset-inline);
    border-right: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
    border-bottom: var(--glaphic-corners-thickness) solid var(--glaphic-corners-ink);
  }
`;

/**
 * glaphic-corners — HUD corner brackets around wrapped content (see
 * the file-head comment for the attribute and Tier-2 surface).
 */
export class GlaphicCorners extends LitElement {
  static properties = {
    /** subset drawn: comma-separated 'tl','tr','bl','br' (default all) */
    corners: { type: String, reflect: true },
  };
  declare corners: string;

  static styles = shadowStyles;

  constructor() {
    super();
    this.corners = 'tl,tr,bl,br';
  }

  render() {
    const drawn = new Set(
      (this.corners || 'tl,tr,bl,br')
        .split(',')
        .map((c) => c.trim())
        .filter((c) => (CORNERS as readonly string[]).includes(c)),
    );
    const bracket = (pos: (typeof CORNERS)[number]) =>
      drawn.has(pos) ? html`<span class="bk bk-${pos}" aria-hidden="true"></span>` : nothing;
    return html`<slot></slot>${bracket('tl')}${bracket('tr')}${bracket('bl')}${bracket('br')}`;
  }
}

customElements.define('glaphic-corners', GlaphicCorners);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-corners': GlaphicCorners;
  }
}