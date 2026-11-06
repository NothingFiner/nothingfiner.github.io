import { LitElement, css, html, nothing } from 'lit';

/**
 * glaphic-frame — the corner-captions wrapper (Eliot's flex sketch:
 * "a flex div that contains the top two / the children elements / a
 * flex div that contains the bottom two — if their element doesn't
 * render it should not have space").
 *
 * A frameless wrapper: the host paints nothing. A flex column of
 * three rows — the top two corners side by side (space-between), the
 * wrapped children, then the bottom two corners (space-between).
 *
 * Each of the four corners is OPTIONAL and speaks two ways:
 * - the attribute for the simple caption — e.g. top-left="TITLE" —
 *   rendered as the caption (small mono, cool-600 ink, tracked like
 *   the chip captions);
 * - the named slot (top-left · top-right · bottom-left ·
 *   bottom-right) for rich content — and a slot's assigned content
 *   replaces the same corner's attribute caption (slots win).
 *
 * An empty corner leaves NO space: slots with no assigned nodes
 * generate no boxes and the attribute captions only render when the
 * attribute carries text, so an inactive corner collapses the row to
 * zero height — no CSS hacks. The slots stay mounted (they are how
 * the corner listens), so content assigned AFTER mount lights the
 * corner too.
 *
 * Tier-2 (declare on the element) —
 * --glaphic-frame-ink · -font-family · -caption-size ·
 * -caption-tracking · -row-spacing (both rows' gap to the content)
 * · -row-top-spacing · -row-bottom-spacing (per-row over the shared
 * gap) · -column-gap (the gap between the two corners; rows wrap).
 */
export class GlaphicFrame extends LitElement {
  static properties = {
    /** the top-left caption (the top-left slot's fallback) */
    topLeft: { type: String, attribute: 'top-left', reflect: true },
    /** the top-right caption (the top-right slot's fallback) */
    topRight: { type: String, attribute: 'top-right', reflect: true },
    /** the bottom-left caption (the bottom-left slot's fallback) */
    bottomLeft: { type: String, attribute: 'bottom-left', reflect: true },
    /** the bottom-right caption (the bottom-right slot's fallback) */
    bottomRight: { type: String, attribute: 'bottom-right', reflect: true },
  };
  declare topLeft: string;
  declare topRight: string;
  declare bottomLeft: string;
  declare bottomRight: string;

  static styles = css`
    :host {
      display: block;
      /* the frame paints nothing */
      background: none;
    }
    :host > slot {
      /* the children row */
      display: block;
    }
    .frame-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      column-gap: var(--glaphic-frame-column-gap, 12px);
      /* no row padding: an all-empty row must be exactly zero tall */
    }
    /* a corner: the slot IS the box carrier — a slot with no assigned
       nodes and no fallback caption generates no box at all. Spacing
       rides the active class (computed from the live assignment +
       caption state, kept fresh over slotchange) so a sleeping corner
       contributes exactly nothing */
    .cell {
      display: block;
      min-width: 0;
    }
    .cell-active.cell-top {
      margin-block-end: var(--glaphic-frame-row-top-spacing, var(--glaphic-frame-row-spacing, 10px));
    }
    .cell-active.cell-bottom {
      margin-block-start: var(--glaphic-frame-row-bottom-spacing, var(--glaphic-frame-row-spacing, 10px));
    }
    .cap {
      font: 600 var(--glaphic-frame-caption-size, 10px) / 1.4
        var(--glaphic-frame-font-family, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      letter-spacing: var(--glaphic-frame-caption-tracking, 0.14em);
      color: var(--glaphic-frame-ink, var(--glaphic-neutral-grey-cool-600, #686474));
    }
  `;

  constructor() {
    super();
    this.topLeft = '';
    this.topRight = '';
    this.bottomLeft = '';
    this.bottomRight = '';
  }

  firstUpdated() {
    /* keep the active-corner state honest: re-render over any
       assignment change (the slots stay mounted, so late-bound
       corner content lights its corner whenever it lands) */
    for (const slot of this.renderRoot.querySelectorAll<HTMLSlotElement>('slot.cell')) {
      slot.addEventListener('slotchange', () => this.requestUpdate());
    }
  }

  render() {
    const caption = (text: string) => (text ? html`<span class="cap" part="caption">${text}</span>` : nothing);
    const corner = (name: string, cls: 'cell-top' | 'cell-bottom', text: string) => {
      /* a corner is "active" when it paints anything — the attribute
         caption's fallback, or content assigned to its slot */
      const slotEl = this.renderRoot?.querySelector<HTMLSlotElement>(`slot[name=${name}]`);
      const assigned = slotEl ? slotEl.assignedNodes().length > 0 : false;
      return html`<slot
        class="cell ${cls}${text || assigned ? ' cell-active' : ''}"
        name=${name}
        >${caption(text)}</slot
      >`;
    };
    return html`
      <div class="frame-row" part="row-top" data-edge="top">
        ${corner('top-left', 'cell-top', this.topLeft)}${corner('top-right', 'cell-top', this.topRight)}
      </div>
      <slot part="body"></slot>
      <div class="frame-row" part="row-bottom" data-edge="bottom">
        ${corner('bottom-left', 'cell-bottom', this.bottomLeft)}${corner('bottom-right', 'cell-bottom', this.bottomRight)}
      </div>
    `;
  }
}

customElements.define('glaphic-frame', GlaphicFrame);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-frame': GlaphicFrame;
  }
}