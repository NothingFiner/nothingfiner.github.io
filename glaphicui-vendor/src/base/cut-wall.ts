import { html, type TemplateResult } from 'lit';

/**
 * glaphicCutWall — the masked-plate wall shared by every cut surface
 * (the glaphic-card cutout wall and the glaphic-band's cut body). An svg
 * whose mask holds white ground and black copy: the fill rect paints
 * everywhere but the glyphs, and the glyphs become windows.
 *
 * Placement (full words):
 *   place — start | center | end along the LONG axis (default center)
 *   length — textLength as % of the long axis (default 88.1, clamp 10–100)
 *   line — start | center | end on the CROSS axis, where the glyph
 *          line sits (default center). Central baseline at quarter /
 *          half / three-quarter cross.
 *
 * axis = 'vertical' lays the long axis down the box's height and reads
 * UPWARD (rotate -90 about center): place='start' anchors the first
 * glyph at the bottom — the standard rotated-text reading convention.
 * The anchor point is mapped back through the inverse rotation.
 *
 * Returns '' until a measured box and non-empty text exist (callers
 * keep their guards — the wall waits for the ResizeObserver).
 */
export interface GlaphicCutPlacement {
  place?: 'start' | 'center' | 'end';
  length?: number;
  line?: 'start' | 'center' | 'end';
}

export interface GlaphicCutWallOptions extends GlaphicCutPlacement {
  boxW: number;
  boxH: number;
  text: string;
  /** document-scoped mask id — per-instance in light DOM (the card
   *  counter), static inside a shadow root (the band's 'band') */
  maskId: string;
  /** the full aria-label, already composed by the caller */
  label: string;
  /** ready-made CSS VALUES with their var() fallbacks included —
   *  the helper attaches the property names (`fill:` for fillStyle,
   *  `font:` for fontStyle; a bare var(...) as the style attribute
   *  is not a declaration and would drop entirely) */
  fillStyle: string;
  fontStyle: string;
  /** glyph run direction — the long/cross axes derive from it and
   *  the box stays whatever the caller gives. vertical reads UPWARD
   *  (rotate -90): place='start' anchors the first glyph at the
   *  bottom, the standard reading convention. Default horizontal.
   *  (Not the box's shape — that's the caller's to derive.) */
  axis?: 'horizontal' | 'vertical';
  /** body: 'mask' (default — the knockout wall) | 'paint' — one
   *  directly painted <text> with no <defs>/mask and no plate rect;
   *  fillStyle becomes the glyph paint in this mode */
  mode?: 'mask' | 'paint';
  boxClass?: string;
  boxPart?: string;
}

export function glaphicCutWall(o: GlaphicCutWallOptions): TemplateResult | string {
  if (!o.boxW || !o.boxH || !o.text) return '';
  const vertical = o.axis === 'vertical';
  const L0 = vertical ? o.boxH : o.boxW; // long axis — the text runs
  const C0 = vertical ? o.boxW : o.boxH; // cross axis — the glyph line
  const f = Math.min(100, Math.max(10, o.length ?? 88.1)) / 100;
  const inset = (L0 * (1 - f)) / 2;
  const place = o.place ?? 'center';
  const line = o.line ?? 'center';
  const anchor: 'start' | 'middle' | 'end' =
    place === 'start' ? 'start' : place === 'end' ? 'end' : 'middle';
  /* anchor along the long axis, read in reading order — horizontal
     reads left→right (start = the left inset), but a vertical band
     reads upward: place='start' anchors the first glyph inset above
     the bottom edge, the string running up to inset from the top */
  const longAt =
    place === 'center'
      ? L0 / 2
      : vertical
        ? place === 'start' ? L0 - inset : inset
        : place === 'start' ? inset : L0 - inset;
  const crossAt = C0 * (line === 'start' ? 0.25 : line === 'end' ? 0.75 : 0.5);
  const cx = o.boxW / 2;
  const cy = o.boxH / 2;
  /* vertical: rotate(-90) about center — rotate(-90) turns local +x
     into screen up, so the pre-rotation anchor for a screen-point
     (crossAt, longAt) is the inverse rotation of it about (cx, cy) */
  const tx = vertical ? Math.round(cx - (longAt - cy)) : Math.round(longAt);
  const ty = vertical ? Math.round(cy + (crossAt - cx)) : Math.round(crossAt);
  const paint = o.mode === 'paint';
  /* both bodies are WHOLE svg templates — a nested `` html fragment
     inside an svg template is parsed outside the svg namespace
     (defs/mask/text created as HTML elements render as nothing) */
  if (paint) {
    return html`
      <svg viewBox="0 0 ${o.boxW} ${o.boxH}" preserveAspectRatio="xMidYMid meet" role="img" class=${o.boxClass} part=${o.boxPart} aria-label=${o.label}>
        <text
          x=${tx}
          y=${ty}
          text-anchor=${anchor}
          dominant-baseline="central"
          textLength=${Math.round(L0 * f)}
          lengthAdjust="spacingAndGlyphs"
          transform=${vertical ? `rotate(-90 ${cx} ${cy})` : undefined}
          style="fill: ${o.fillStyle}; font: ${o.fontStyle}"
        >${o.text}</text>
      </svg>
    `;
  }
  return html`
    <svg viewBox="0 0 ${o.boxW} ${o.boxH}" preserveAspectRatio="xMidYMid meet" role="img" class=${o.boxClass} part=${o.boxPart} aria-label=${o.label}>
      <defs>
        <mask id=${o.maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${o.boxW} height=${o.boxH}>
          <rect width=${o.boxW} height=${o.boxH} fill="#fff"></rect>
          <text
            x=${tx}
            y=${ty}
            text-anchor=${anchor}
            dominant-baseline="central"
            textLength=${Math.round(L0 * f)}
            lengthAdjust="spacingAndGlyphs"
            fill="#000"
            transform=${vertical ? `rotate(-90 ${cx} ${cy})` : undefined}
            style="font: ${o.fontStyle}"
          >${o.text}</text>
        </mask>
      </defs>
      <rect width=${o.boxW} height=${o.boxH} style="fill: ${o.fillStyle}" mask="url(#${o.maskId})"></rect>
    </svg>
  `;
}