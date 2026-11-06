import { LitElement } from 'lit';

/* per-DOCUMENT adopted-sheet registry — keyed on the sheet (not the
   document alone) so N subclasses sharing a page each adopt exactly
   once: a document-keyed WeakSet let the FIRST light-DOM class to
   mount mark the document done and silently skip every other class's
   sheet (a second optical component rendered unstyled). */
const adopted = new WeakMap<Document, WeakSet<CSSStyleSheet>>();

/**
 * Base class for OPTICAL components (anything relying on
 * backdrop-filter, mix-blend-mode, or page-level cutouts).
 *
 * Why light DOM: a shadow root is both a backdrop root and a blend
 * isolation boundary — a lens inside shadow DOM can never frost the
 * page behind it, and an overprint layer inside shadow DOM can never
 * blend with anything outside its own tree. Optical components
 * therefore render into the document itself.
 *
 * Because light DOM has no style encapsulation, each subclass declares
 * its styles as `static sheet` (a CSSStyleSheet from the css`` tag) and
 * this base adopts it onto the document exactly once, guarded globally
 * so N instances share one sheet. subclass selectors must be scoped
 * under the element tag (e.g. `glaphic-card .plate`) to keep global scope
 * sane.
 */
export class GlaphicLightElement extends LitElement {
  static sheet?: CSSStyleSheet | CSSStyleSheet[];

  createRenderRoot(): HTMLElement | ShadowRoot {
    const ctor = this.constructor as typeof GlaphicLightElement;
    if (ctor.sheet) {
      const toAdd = Array.isArray(ctor.sheet) ? ctor.sheet : [ctor.sheet];
      const sheets = adopted.get(document) ?? new WeakSet();
      adopted.set(document, sheets);
      // adopt onto the document exactly once per sheet, across instances
      const fresh = toAdd.filter((sheet) => !sheets.has(sheet));
      if (fresh.length) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...fresh];
        for (const sheet of fresh) sheets.add(sheet);
      }
    }
    return this;
  }
}