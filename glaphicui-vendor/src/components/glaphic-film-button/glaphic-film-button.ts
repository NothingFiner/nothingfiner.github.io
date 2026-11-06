import { LitElement, css, html } from 'lit';
import { GlaphicLightElement } from '../../base/light-dom.js';
import { glaphicMoveChildren } from '../../base/move-children.js';

/* Film styles live in light DOM (page-level blends) — scoped under
   the tag, adopted onto the document once per document. */
const filmStyles = css`
  glaphic-film-button { display: inline-block; }
  glaphic-film-button {
    /* Tier-2 defaults; the [variant] rules below override */
    --glaphic-film-button-a: var(--glaphic-ink-brand-dark, #a6022a);
    --glaphic-film-button-b: var(--glaphic-ink-brand-fluro, #14f1c8);
    --glaphic-film-button-ink: var(--glaphic-neutral-paper-elevated, #f9faf4);
    --glaphic-film-button-radius: var(--glaphic-radius-base, 2px);
    --glaphic-film-button-offset: 4px;
    --glaphic-film-button-disabled-a: var(--glaphic-neutral-grey-cool-400, #9d99ab);
    --glaphic-film-button-disabled-b: var(--glaphic-neutral-grey-cool-200, #d5d2de);
  }
  glaphic-film-button[variant='info'] {
    --glaphic-film-button-b: var(--glaphic-ink-cyan, #89f3ff);
    --glaphic-film-button-a: var(--glaphic-ink-magenta, #f81dff);
  }
  glaphic-film-button button {
    position: relative;
    display: inline-block;
    font: 600 var(--glaphic-font-size-2, 12px) / 1.3
      var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
    /* Figma housing 117×42: (42-15.6)/2 ≈ 13 vertical, 72px label ≈ 22.5 side */
    padding: 13px 22px;
    border: none;
    background: transparent;
    border-radius: var(--glaphic-film-button-radius);
    overflow: hidden; /* clips the films to the housing's rounded corners */
    color: var(--glaphic-film-button-ink);
    cursor: pointer;
    /* the films blend ONLY against each other, never against the
       page ground behind the button — the button is its own blend
       group. NO alpha anywhere: both layers are opaque, the top
       one prints via multiply. */
    isolation: isolate;
  }
  glaphic-film-button[disabled] button { cursor: not-allowed; }
  glaphic-film-button button:focus-visible {
    outline: 2px solid var(--glaphic-ui-focus, #8447ff);
    outline-offset: 2px;
  }
  /* film geometry from the dump: BOTH films are 113×38 inside the
     117×42 housing — Rectangle 1 at (0,0), Rectangle 2 at (+4,+4)
     meeting the housing's bottom-right corner. Nothing bleeds the
     box, so the label centers on the full composite. The films are
     radius 1 inside the box's radius-2. */
  glaphic-film-button button i {
    position: absolute;
    inset: 0 4px 4px 0;
    border-radius: 1px;
    pointer-events: none;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  /* .f1 sits at the box; .f2 is offset down-right and prints
     multiply — its fringe (right/bottom) shows pure B, .f1's
     fringe (left/top) shows pure A. Hover swaps the transforms so
     the misregistration flips corner: the blend itself NEVER
     changes (Figma hover stays MULTIPLY). */
  glaphic-film-button .f1 {
    background: var(--glaphic-film-button-a);
    transform: none;
  }
  glaphic-film-button .f2 {
    background: var(--glaphic-film-button-b);
    mix-blend-mode: multiply;
    transform: translate(
      var(--glaphic-film-button-offset),
      var(--glaphic-film-button-offset)
    );
  }
  glaphic-film-button:hover:not([disabled]) .f1,
  glaphic-film-button[force-hover]:not([disabled]) .f1 {
    transform: translate(
      var(--glaphic-film-button-offset),
      var(--glaphic-film-button-offset)
    );
  }
  glaphic-film-button:hover:not([disabled]) .f2,
  glaphic-film-button[force-hover]:not([disabled]) .f2 {
    transform: none;
  }
  /* the label rides SOFT_LIGHT over the multiplied films so the
     glyphs read on every state — color never changes. On hover the
     label follows the top film: the misregistration flip reads as
     the whole button moving down to its corner. */
  glaphic-film-button .lb {
    position: relative;
    z-index: 1;
    display: inline-block;
    color: var(--glaphic-film-button-ink);
    mix-blend-mode: color-dodge;
    translate: 0 0;
    transition: translate 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  glaphic-film-button:hover .lb,
  glaphic-film-button[force-hover] .lb {
    mix-blend-mode: difference;
    translate: var(--glaphic-film-button-label-shift, 2px) var(--glaphic-film-button-label-shift, 2px);
  }
  glaphic-film-button[disabled] .f1 { background: var(--glaphic-film-button-disabled-a); }
  glaphic-film-button[disabled] .f2 { background: var(--glaphic-film-button-disabled-b); }
  glaphic-film-button[disabled] .lb {
    color: var(--glaphic-film-button-disabled-b);
    mix-blend-mode: normal;
  }
  glaphic-film-button:active button,
  glaphic-film-button[force-active] button {
    translate: 1px 1px;
  }
  @media (prefers-reduced-motion: reduce) {
    glaphic-film-button button i { transition: none; }
    glaphic-film-button .lb { transition: none; }
  }
`;

/**
 * glaphic-film-button — the overprint/anaglyph button (Figma
 * "FIlm Button", Color=Brand|Info, States Default/Hover/Disabled).
 *
 * LIGHT DOM via GlaphicLightElement: the two films are opaque and
 * multiply against each other only (`isolation: isolate` seals the
 * button as its own blend group); the label rides color-dodge and is
 * captured into the .lb span at mount (light DOM has no slot
 * machinery — slotted children are moved). Changing variant after
 * mount is supported (plain CSS, no render-root fork), but children
 * can only be captured once.
 *
 * The multiply physics replace the legacy film's alpha
 * color-mix+transparent plates and its hover difference-flip —
 * per the LOOK PHYSICS DIRECTIVE, transparency is never alpha;
 * hover just swaps the two layers' transforms (misregistration
 * flips corner) and the blend never leaves multiply.
 *
 * Attributes: variant 'brand' (default) | 'info'; disabled;
 * force-hover / force-active declarative state mirrors.
 *
 * Tier-2: --glaphic-film-button-a · -b · -ink · -radius · -offset ·
 *         -label-shift (the label's follow distance on hover, 2px) · -disabled-a · -disabled-b
 */
export class GlaphicFilmButton extends GlaphicLightElement {
  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    forceHover: { type: Boolean, reflect: true, attribute: 'force-hover' },
    forceActive: { type: Boolean, reflect: true, attribute: 'force-active' },
  };
  /** 'brand' | 'info' */
  declare variant: string;
  declare disabled: boolean;
  declare forceHover: boolean;
  declare forceActive: boolean;

  static sheet = filmStyles.styleSheet!;

  constructor() {
    super();
    this.variant = 'brand';
    this.disabled = false;
    this.forceHover = false;
    this.forceActive = false;
  }

  private captured: Node[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.captured.length === 0 && this.childNodes.length > 0) {
      // light DOM has no slot machinery — the label must own these
      this.captured = [...this.childNodes];
      while (this.firstChild) this.removeChild(this.firstChild);
    }
  }

  protected override firstUpdated() {
    if (this.captured.length > 0) {
      glaphicMoveChildren(this.querySelector('.lb') as HTMLElement | null, this.captured);
      this.captured = [];
    }
  }

  render() {
    return html`<button type="button" ?disabled=${this.disabled}>
      <i class="f1" aria-hidden="true"></i>
      <i class="f2" aria-hidden="true"></i>
      <span class="lb"></span>
    </button>`;
  }
}

customElements.define('glaphic-film-button', GlaphicFilmButton);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-film-button': GlaphicFilmButton;
  }
}