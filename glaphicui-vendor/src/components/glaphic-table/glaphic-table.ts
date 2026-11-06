import { LitElement, css, html } from 'lit';

/**
 * glaphic-table — basic data table (furniture, shadow DOM,
 * data-driven). Columns and rows are plain string arrays; this batch
 * renders strings only (richer cells come later — see TODO).
 *
 * Usage:
 *   <glaphic-table
 *     caption="Deck manifest"
 *     columns="Bay,Manifest,Status"
 *     .rows=${[['07', 'Comms dish', 'OK']]}>
 *   </glaphic-table>
 *
 * `columns` accepts a comma-separated attribute (seg's options
 * converter); `rows` is property-only (`attribute: false`). The row
 * film formula is declared on tbody tr, not :host — per-row depth and
 * the hover step re-resolve at each row (declaration-time
 * substitution). `zebra` bumps the even rows; `dense` tightens cell
 * padding; `sticky` pins the header row to the INTERNAL scroller (not
 * the document); `force-empty` previews the NO DATA row.
 *
 * Tier-2: --glaphic-table-tint · -depth (5) · -row-depth ·
 *         -hover-depth (12) · -rim · -rimsoft · -radius ·
 *         -header-ink · -heading-ink · -cell-ink · -height (260px,
 *         [sticky])
 */

const tableStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    box-sizing: border-box;
  }
  .caption {
    font: 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--glaphic-table-header-ink, var(--ink, #17140E));
  }
  .rows-readout {
    font: 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    font-variant-numeric: tabular-nums;
    letter-spacing: .12em;
    color: var(--hot, #E03A0B);
  }
  .scroll {
    overflow: auto;
    max-height: var(--glaphic-table-height, none);
    border: 1px solid var(--glaphic-table-rim, var(--rim, rgba(23, 20, 14, .3)));
    border-radius: var(--glaphic-table-radius, var(--r, 1.9px));
    box-sizing: border-box;
  }
  :host([sticky]) .scroll { max-height: var(--glaphic-table-height, 260px); }
  table {
    width: 100%;
    border-collapse: collapse;
    box-sizing: border-box;
  }
  th {
    padding: 9px 12px;
    font: 600 10.5px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    letter-spacing: .14em;
    text-transform: uppercase;
    text-align: left;
    color: var(--glaphic-table-heading-ink, var(--muted, rgba(23, 20, 14, .62)));
    /* the film is a full formula over depth so a per-host retint of
       -tint still lands under it */
    background: color-mix(
      in srgb,
      var(--glaphic-table-tint, var(--platec, #17140E)) calc(var(--glaphic-table-depth, 5) * 1%),
      transparent
    );
    border-bottom: 1px solid var(--glaphic-table-rim, var(--rim, rgba(23, 20, 14, .3)));
  }
  :host([sticky]) th {
    /* anchors to the internal .scroll frame, never the document */
    position: sticky;
    top: 0;
    z-index: 1;
  }
  td {
    padding: 10px 12px;
    font: 400 13.5px/1.45 var(--f-body, 'Plus Jakarta Sans', Arial, sans-serif);
    font-variant-numeric: tabular-nums;
    color: var(--glaphic-table-cell-ink, var(--ink, #17140E));
    border-bottom: 1px solid var(--glaphic-table-rimsoft, rgba(23, 20, 14, .14));
  }
  :host([dense]) td { padding: 6px 12px; font-size: 12.5px; }
  :host([dense]) th { padding: 7px 12px; }
  /* row film declared ON the row: per-row overrides and the hover
     depth step re-resolve here, not at :host */
  tbody tr {
    background: color-mix(
      in srgb,
      var(--glaphic-table-tint, var(--platec, #17140E)) calc(var(--glaphic-table-row-depth, 0) * 1%),
      transparent
    );
    transition: background .12s ease;
  }
  tbody tr:hover {
    background: color-mix(
      in srgb,
      var(--glaphic-table-tint, var(--platec, #17140E)) calc(var(--glaphic-table-hover-depth, 12) * 1%),
      transparent
    );
  }
  tbody tr:last-child td { border-bottom: none; }
  :host([zebra]) tbody tr:nth-child(even) {
    background: color-mix(
      in srgb,
      var(--glaphic-table-tint, var(--platec, #17140E)) calc((var(--glaphic-table-row-depth, 0) + 4) * 1%),
      transparent
    );
  }
  .empty {
    padding: 22px 12px;
    text-align: center;
    font: 500 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--muted, rgba(23, 20, 14, .62));
    border-bottom: none;
  }
  @media (prefers-reduced-motion: reduce) {
    tbody tr { transition: none; }
  }
`;

/** comma-separated attribute → string[] (seg options conventions) */
const listConverter = (v: string | null) =>
  (v ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export class GlaphicTable extends LitElement {
  static styles = tableStyles;
  static properties = {
    columns: { converter: listConverter },
    rows: { attribute: false },
    caption: { type: String },
    zebra: { type: Boolean, reflect: true },
    dense: { type: Boolean, reflect: true },
    sticky: { type: Boolean, reflect: true },
    forceEmpty: { type: Boolean, reflect: true, attribute: 'force-empty' },
  };
  declare columns: string[];
  declare rows: string[][];
  declare caption: string;
  declare zebra: boolean;
  declare dense: boolean;
  declare sticky: boolean;
  declare forceEmpty: boolean;

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.caption = '';
    this.zebra = false;
    this.dense = false;
    this.sticky = false;
    this.forceEmpty = false;
  }

  render() {
    const empty = this.forceEmpty || this.rows.length === 0;
    const readout = `${String(empty ? 0 : this.rows.length).padStart(2, '0')} ROWS`;
    const columnCount = Math.max(1, this.columns.length);
    const showHead = Boolean(this.caption) || this.rows.length > 0 || this.forceEmpty;
    return html`
      ${showHead ? html`
        <div class="head" part="head">
          ${this.caption ? html`<span class="caption" part="caption">${this.caption}</span>` : html`<span></span>`}
          <span class="rows-readout" part="readout">${readout}</span>
        </div>
      ` : ''}
      <div class="scroll" part="scroll">
        <table part="table">
          ${empty ? html`
            <tbody>
              <tr><td class="empty" colspan=${columnCount}>NO DATA</td></tr>
            </tbody>
          ` : html`
            ${this.columns.length > 0 ? html`
              <thead>
                <tr>
                  ${this.columns.map((c) => html`<th scope="col">${c}</th>`)}
                </tr>
              </thead>
            ` : ''}
            <tbody>
              ${this.rows.map((row) => html`
                <tr>${row.map((cell) => html`<td>${cell}</td>`)}</tr>
              `)}
            </tbody>
          `}
        </table>
      </div>
    `;
  }
}

customElements.define('glaphic-table', GlaphicTable);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-table': GlaphicTable;
  }
}