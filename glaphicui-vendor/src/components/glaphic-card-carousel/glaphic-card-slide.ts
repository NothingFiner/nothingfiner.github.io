import { LitElement, css, html } from 'lit';
import '../glaphic-cursor-type/glaphic-cursor-type.js';

/**
 * glaphic-card-slide — one slide of Eliot's card carousel: a
 * full-bleed image surface that carries its typed title print and the
 * card parts — its description and action content — as light-DOM
 * slots. In the composed card every panel carries the ONE active
 * slide's own content (the wrapper moves the description/actions
 * nodes up a level and slots them into its card panels), so the parts
 * travel WITH their slide wherever the card is composed.
 *
 * Authoring (content as normal):
 *   <glaphic-card-slide label="Rite">
 *     <img …>                     ← default slot: the image layer
 *     <p slot="description">…</p>  ← the description part's copy
 *     <div slot="actions">…</div>  ← the action part's buttons
 *   </glaphic-card-slide>
 *
 * The image layer: slotted images stretch to FILL the slide (absolute
 * inset, object-fit cover, at the expense of the image's own size —
 * no aspect is ever letterboxed). A slide set to `square` gives up its
 * equal column for the row depth as its own width — width == height,
 * whatever aspect its image wears (the strip is a flex row; every
 * unset slide keeps its equal `1 / cols` share).
 *
 * The giant title print is the card's REVEAL: in carousel mode it
 * shows only while the slide is HELD — hover or keyboard focus types
 * the label in (the cursor treatment, its block dropping when the
 * print finishes), and moving off / blurring wipes it (no fade). In
 * the composed card the print IS permanent — it re-types once per
 * selection (the wrapper hands the slide its `data-part` back). It
 * paints in blend `difference` against what's behind the slide on a
 * PAPER ink (a bright ink inverts the full backdrop range, so the
 * print reads on any image) — solid enough to flicker with the card's
 * plate treatments, never a fixed ink. NOTE for outer preflight
 * styles: outer-tree rules beat ::slotted defaults, so a page's own
 * img preflight can only be beaten from the page itself (see the
 * landing stylesheet).
 *
 * The wrapper's card plates (description/actions) carry the plate
 * paints; this slide only holds the parts' content. The wrapper ALSO
 * renders this carousel's controls (the card mode's row underneath —
 * prev/next and the compose-back button), so the slide itself carries
 * NO buttons: its clicks are all open asks, the wrapper owns the
 * answers (the wrapper ignores re-asks of the standing card).
 *
 * Tier-2 — --glaphic-card-carousel-image-surface (#d9d9d9, the
 *   design's placeholder-image grey) · -title-size (height-relative,
 *   ≈64px at the 303px depth) · -title-ink (ink-black) ·
 *   -title-font.
 */
export class GlaphicCardSlide extends LitElement {
  static properties = {
    /** the giant print's copy (the image layer's title) */
    label: { type: String },
    /** a slide set to square gives up its equal column for the row
        depth as its own width (width == height) */
    square: { type: Boolean, reflect: true },
    /** the wrapper's placement read — image | description | actions
       (the wrapper authors the property; the slide reacts) */
    cardPart: { type: String, attribute: 'data-part' },
    /** the script the cursor treatment is typing right now */
    script: { state: true },
  };
  declare label: string;
  declare square: boolean;
  declare cardPart: string;
  declare script: string;

  constructor() {
    super();
    this.label = '';
    this.square = false;
    this.cardPart = '';
    this.script = '';
  }

  /* the slide is focusable and button-like: keyboard parity with the
     click (Enter opens the card); held = the print (hover/focus) */
  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKey);
    /* the print HIDES until the slide is held (carousel mode) — hover
       and keyboard focus both type it in; moving off / blurring wipes
       it (no fade). In the composed card it's permanent */
    this.addEventListener('pointerenter', this.onHold);
    this.addEventListener('pointerleave', this.onRelease);
    this.addEventListener('focusin', this.onHold);
    this.addEventListener('focusout', this.onRelease);
  }

  override disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKey);
    this.removeEventListener('pointerenter', this.onHold);
    this.removeEventListener('pointerleave', this.onRelease);
    this.removeEventListener('focusin', this.onHold);
    this.removeEventListener('focusout', this.onRelease);
    super.disconnectedCallback();
  }

  /* held in carousel mode → the print; released → wiped. EVERY hold
     re-runs the print from empty (the typer only prints on a text
     CHANGE — a second hold of the same label must re-change it, or
     the first finished print's vanished cursor stays hidden forever
     and the block never blinks again) */
  private held = false;
  private onHold() {
    if (this.cardPart !== 'image') {
      this.held = true;
      this.script = '';
      requestAnimationFrame(() => {
        if (this.held && this.cardPart !== 'image') this.script = this.label;
      });
    }
  }
  private onRelease() {
    this.held = false;
    if (this.cardPart !== 'image') this.script = '';
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('label')) {
      /* the accessible name rides the giant print's copy */
      if (this.label) this.setAttribute('aria-label', this.label);
      else this.removeAttribute('aria-label');
      /* a label change follows the print's placement rule: composed →
         re-type, carousel → back to the held-only reveal */
      this.script = this.cardPart === 'image' ? this.label : '';
    }
    if (changed.has('cardPart')) {
      /* the composed card's selected slide re-types its print once per
         selection: blank the script first, hand it back on the next
         frame so the typer sees a text CHANGE and prints again (only
         once it is actually selected — the stand-downs and the close
         wipe the print back to held-only) */
      if (this.cardPart === 'image') {
        this.script = '';
        requestAnimationFrame(() => {
          if (this.cardPart === 'image') this.script = this.label;
        });
      } else if (changed.size && this.script) {
        this.script = '';
      }
    }
  }

  /* clicks on the slide are the open ask (the wrapper owns the
     answers — a standing card ignores its own re-ask) */
  private onClick() {
    this.requestOpen();
  }

  private onKey(ev: Event) {
    const key = (ev as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    ev.preventDefault();
    this.requestOpen();
  }

  private requestOpen() {
    this.dispatchEvent(
      new CustomEvent('glaphic-card-carousel-open-request', {
        detail: { slide: this },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      height: 100%;
      cursor: pointer;
      font-family: var(--glaphic-card-carousel-title-font, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      /* the equal-column default lives here (the strip is a flex row;
         grid modes ignore it) — an unset slide takes its 1/cols share */
      flex: 0 0 calc(100% / var(--glaphic-card-carousel-cols, 3));
      min-width: 0;
    }
    /* a square slide trades its column share for the row depth: the
       strip's own height is its width — width == height, no aspect
       argument with the image */
    :host([square]) {
      flex: 0 0 var(--glaphic-card-carousel-height, 303px);
      aspect-ratio: 1;
    }
    :host([data-part='image']) {
      cursor: pointer;
    }

    .image {
      position: absolute;
      inset: 0;
      overflow: hidden;
      background: var(--glaphic-card-carousel-image-surface, #d9d9d9);
    }
    /* slotted images FILL the slide — absolute inset, covered, even at
       the expense of the image's own size (a slide needs no aspect of
       its own: portrait, wide, square — all crop in). The !important
       pair is deliberate: outer-tree rules (a page's img preflight —
       img { height: auto } and friends) beat ::slotted defaults, and
       a letterboxed slide is a wrong component, not a styling choice */
    ::slotted(img) {
      position: absolute !important;
      inset: 0;
      display: block;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
    }

    /* the giant print — typed in with the cursor treatment (its block
       drops when the print finishes — vanish, not blink-on); cropped
       at the slide's bottom edge, blend difference on a PAPER ink (a
       bright ink inverts the full backdrop range, so the print reads
       on any image the slide wears), REVEALED while held: hover/keys
       type it in, release wipes it — permanent only in the composed
       card (the wrapper's data-part hand-back). The size is the
       card's own read: a share of the row depth, not a fixed px */
    .title {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.24em;
      overflow: hidden;
      mix-blend-mode: difference;
      pointer-events: none;
      color: var(--glaphic-card-carousel-title-ink, var(--glaphic-neutral-paper, #f2f5eb));
    }
    .title glaphic-cursor-type {
      font: 500 var(--glaphic-card-carousel-title-size,
              calc(var(--glaphic-card-carousel-height, 303px) * 0.16)) / 1.05
        var(--glaphic-card-carousel-title-font,
          var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      color: inherit;
      /* blend difference alone has a dead band — over an image whose
         tone sits near the backdrop's mid, the glyph nearly vanishes.
         NO halo: Eliot removed the text-shadow ring and instead keeps
         every slide's image chosen so the print always has range to
         invert against (an image near mid-grey everywhere is the
         author's mistake, not a paint problem). Solid paint only */
      --glaphic-cursor-type-ink: inherit;
      --glaphic-cursor-type-cursor-ink: inherit;
    }
  `;

  protected render() {
    return html`
      <div class="image" part="image"><slot></slot></div>
      <div class="title part" part="title" aria-hidden="true">
        <glaphic-cursor-type class="typer" cursor-vanish .text=${this.script}></glaphic-cursor-type>
      </div>
    `;
  }
}

customElements.define('glaphic-card-slide', GlaphicCardSlide);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-card-slide': GlaphicCardSlide;
  }
}