import { LitElement, css, html } from 'lit';

/* ────────────────────────────────────────────────────────────────
   glaphic-ink-stroke — the CLEAR INK FOR STROKE treatment (name
   PENDING ELIOT'S REVIEW — the directory and element name are
   provisional). Decoded from Eliot's SVG: the same word painted
   TWICE in place — one solid pass (the fluro ink) and one
   clear-fill pass whose ink rides only the glyph outline (the
   stroke, #9d99ab = grey-cool-400). This element is the clear-fill
   pass alone: the glyphs' fill is TRANSPARENT and the ink paints
   only the contour, via -webkit-text-stroke (the alias the
   engines expose; no alpha paint, no masks — the stroke is the
   outline ink, the fill lets the surface behind show through).
   Solid + stroke read together exactly like the reference: a solid
   fluro pass sits beside the outline pass in the stories.

   Attributes:
   - text: the word(s) the outline carries
   - Tier-2: --glaphic-ink-stroke-ink (default grey-cool-400) ·
     -width (1.5px) · -fill (transparent — the clear read) · -size
   ──────────────────────────────────────────────────────────────── */

const shadowStyles = css`
  :host {
    display: block;
    /* Tier-2 defaults; consumer inline overrides win */
    --glaphic-ink-stroke-ink: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-ink-stroke-width: 1.5px;
    --glaphic-ink-stroke-fill: transparent;
    --glaphic-ink-stroke-size: 48px;
  }
  .glyph {
    display: inline-block;
    font-family: var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);
    font-weight: 700;
    font-size: var(--glaphic-ink-stroke-size, 48px);
    line-height: 1.1;
    letter-spacing: 2px;
    -webkit-text-fill-color: var(--glaphic-ink-stroke-fill, transparent);
    -webkit-text-stroke: var(--glaphic-ink-stroke-width, 1.5px)
      var(--glaphic-ink-stroke-ink, var(--glaphic-neutral-grey-cool-400, #9d99ab));
  }
`;

export class GlaphicInkStroke extends LitElement {
  static properties = {
    text: { type: String },
  };
  declare text: string;

  static styles = shadowStyles;

  constructor() {
    super();
    this.text = 'CLEAR INK';
  }

  render() {
    return html`<span class="glyph">${this.text}</span>`;
  }
}

customElements.define('glaphic-ink-stroke', GlaphicInkStroke);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-ink-stroke': GlaphicInkStroke;
  }
}