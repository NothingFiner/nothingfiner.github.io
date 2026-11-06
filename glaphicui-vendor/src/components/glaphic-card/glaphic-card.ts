import { LitElement, css, html } from 'lit';

/**
 * glaphic-card — the simplified card: ONE flat panel, per Eliot's
 * card compositions ("it should be simplified but we should make
 * elements that allow one to build things like these"). HARD BREAK
 * from the figcut card: the tint film / depth ladder, the glass lens,
 * the cutout wall, the cut strip, the card-part voice anatomy and the
 * rim-ring mask are all GONE — the panel is a paper-elevated fill
 * behind a 1px cool-200 keyline at zero radius, and the composing
 * pieces (the corner captions, the flat plates, the type voices)
 * live in their own elements: glaphic-frame (the corner captions,
 * flex: top corners / children / bottom corners) and glaphic-plate
 * (the decorative flat squares — placed as card or page background,
 * out of the layout's way).
 *
 * Shadow DOM (call, stated): the panel has no optics left — no
 * backdrop root, no blend isolation surface, no light-DOM mask ids —
 * so a plain LitElement shadow root is correct; the multiply layer
 * rides the host (mix-blend-mode works from inside a shadow root,
 * band/chip precedent) and `isolation: isolate` keeps the panel its
 * own root so negative-z plates sit above its fill and below the
 * content deterministically.
 *
 * Attributes:
 * - chamfer: comma-separated subset of 'tl', 'tr', 'bl', 'br' whose
 *   corners get the 45° cut (~20px, Tier-2 --glaphic-card-chamfer).
 *   Empty/absent = square. The cut is clip-path ONLY (a clip, not a
 *   mask — no alpha in the paint, per the multiply physics).
 * - multiply: boolean, default true — the panel blends multiply with
 *   the page. `multiply="false"` (or .multiply = false) paints it
 *   opaque. The absent attribute never clobbers the constructor-true
 *   default (converter returns undefined for nothing-to-read) — the
 *   CardInteractions test guards it on a fresh element.
 *
 * Tier-2 (declare on the element) —
 * --glaphic-card-filling · -rim · -padding · -chamfer
 */
export class GlaphicCard extends LitElement {
  static properties = {
    /** corner cuts: comma-separated 'tl','tr','bl','br' (default none) */
    chamfer: { type: String, reflect: true },
    /** paint the blend: true (default) = a multiply layer, false = opaque */
    multiply: {
      type: Boolean,
      reflect: true,
      converter: {
        /* an absent attribute reads nothing → never touches the
           constructor's true; "false" is the written opt-out */
        fromAttribute: (value: string | null): boolean | undefined =>
          value === null ? undefined : value !== 'false',
      },
    },
  };
  declare chamfer: string;
  declare multiply: boolean;

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      position: relative;
      /* the panel is its own stacking root: the negative-z plates it
         hosts stay above its filling and below the content even when
         the blend is off */
      isolation: isolate;
      /* the card IS a multiply layer — translucency comes from the
         blend against the page, never from alpha (the look physics) */
      mix-blend-mode: multiply;
      border: var(--glaphic-card-rim-width, var(--glaphic-border-width-sm, 1px)) solid
        var(--glaphic-card-rim, var(--glaphic-neutral-grey-cool-200, #d5d2de));
      background: var(--glaphic-card-filling, var(--glaphic-neutral-paper-elevated, #f9faf4));
      padding: var(--glaphic-card-padding, 20px);
      border-radius: 0;
      /* per-corner cut sizes — internal keys driving the one polygon;
         the Tier-2 knob is --glaphic-card-chamfer (the cut length) */
      --glaphic-card-cut-tl: 0px;
      --glaphic-card-cut-tr: 0px;
      --glaphic-card-cut-bl: 0px;
      --glaphic-card-cut-br: 0px;
    }
    :host(:not([multiply])) {
      mix-blend-mode: normal;
    }
    /* the chamfer cut — one 8-point polygon; an uncut corner's 0px
       collapses its two points onto the square edge */
    :host([chamfer]:not([chamfer=''])) {
      clip-path: polygon(
        var(--glaphic-card-cut-tl) 0,
        calc(100% - var(--glaphic-card-cut-tr)) 0,
        100% var(--glaphic-card-cut-tr),
        100% calc(100% - var(--glaphic-card-cut-br)),
        calc(100% - var(--glaphic-card-cut-br)) 100%,
        var(--glaphic-card-cut-bl) 100%,
        0 calc(100% - var(--glaphic-card-cut-bl)),
        0 var(--glaphic-card-cut-tl)
      );
    }
    :host([chamfer*='tl']) {
      --glaphic-card-cut-tl: var(--glaphic-card-chamfer, 20px);
    }
    :host([chamfer*='tr']) {
      --glaphic-card-cut-tr: var(--glaphic-card-chamfer, 20px);
    }
    :host([chamfer*='bl']) {
      --glaphic-card-cut-bl: var(--glaphic-card-chamfer, 20px);
    }
    :host([chamfer*='br']) {
      --glaphic-card-cut-br: var(--glaphic-card-chamfer, 20px);
    }
  `;

  constructor() {
    super();
    this.multiply = true;
  }

  connectedCallback() {
    super.connectedCallback();
    /* Lit reflects on property CHANGE, not on mount — the
       constructor-true default never wrote the attribute, so sync it
       once for the :host(:not([multiply])) read */
    if (this.multiply) {
      this.setAttribute('multiply', '');
    } else {
      this.removeAttribute('multiply');
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('glaphic-card', GlaphicCard);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-card': GlaphicCard;
  }
}