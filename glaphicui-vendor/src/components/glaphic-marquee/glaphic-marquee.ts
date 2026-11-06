import { LitElement, css, html } from 'lit';

/* ────────────────────────────────────────────────────────────────
   glaphic-marquee — the ticker band (Eliot's 958×100 spec): a thin
   horizontal band bounded by two full-width rules (the design's 4px
   ink-brand-dark strokes), dense mono text scrolling inside — short
   phrases in `///`-separator ticker copy, repeating seamlessly.

   Content: the `strings` array property — an array of strings, each
   a ticker phrase. 20 max (extras drop with a console warn). The
   phrases join into ONE ticker line around the `///` separator and
   the line ends on one too — every repetition opens on a `///`; the
   line repeats enough copies to fill the container (measured, so
   short strings still carry a gapless loop), and the track runs two
   identical halves — the strip loops by translating half its length.

       Speed: the `speed` property — seconds for one full loop
   (default 20, linear; the tier-2 -speed var is beat when the
   property is set).

   Direction: the `reverse` boolean attribute — the track's scroll
   runs the other way. The scroll keyframes translate 0 → -50% and
   the two-half loop reverses cleanly, so the flip is the one
   declaration: `:host([reverse]) .track { animation-direction: reverse }`.
   (The site's about band carried this as a consumer-side ::part
   one-liner first — this is the ask's library home.)

   Tier-2 — --glaphic-marquee-ink (ticker text, ink-brand-dark) ·
   -rule-ink (the rules, ink-brand-dark) · -rule-size (4px, 0 = off) ·
   -rule-inset-top / -rule-inset-bottom (the rails' seats — 0 sits each
   at its band edge; the knobs park a rail anywhere inside the band,
   the mock's 0/44px-in-48 read included) ·
   -text-size (12px) · -pad-block (13px, band's text padding, riding
   UNDER the rule block: the interior reads rule + pad each side) ·
   -gap (12px, the pitch between line repetitions) ·
   -speed (20s, seconds per loop)

   Reduced motion: the scroll freezes — the line sits static in its
   band, one full run of phrases, no blink.
   ──────────────────────────────────────────────────────────────── */

const MAX_STRINGS = 20;
const SEPARATOR = ' /// ';

export class GlaphicMarquee extends LitElement {
  static properties = {
    /** the ticker phrases (array of strings, 20 max) */
    strings: { type: Array },
    /** seconds for one full loop (0 reads the -speed tier-2 var) */
    speed: { type: Number },
    /** true = the track's scroll runs the other way (the two-half
        loop translates cleanly in reverse) */
    reverse: { type: Boolean, reflect: true },
    /** copies of the ticker line per identical half (measured) */
    copies: { state: true },
  };
  declare strings: string[];
  declare speed: number;
  declare reverse: boolean;
  declare copies: number;

  constructor() {
    super();
    this.strings = ['the marquee prints across the band'];
    this.speed = 0;
    this.reverse = false;
    this.copies = 1;
  }

  /** the capped, filtered ticker phrases */
  private get phrases(): string[] {
    const given = (this.strings ?? []).filter((s) => typeof s === 'string' && s.trim().length > 0);
    if (given.length > MAX_STRINGS) {
      console.warn(
        `[glaphic-marquee] strings capped at ${MAX_STRINGS} — dropped ${given.length - MAX_STRINGS}`,
      );
      return given.slice(0, MAX_STRINGS);
    }
    return given;
  }

  private onResize = () => this.measure();

  override connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback() {
    this.resizeObserver.disconnect();
    super.disconnectedCallback();
  }

  declare resizeObserver: ResizeObserver;

  protected override firstUpdated() {
    this.measure();
    // the runs are measured with the fallback mono until the webfont
    // lands — re-measure once fonts settle so a wider real font can't
    // leave one half narrower than the host
    document.fonts?.ready.then(() => this.measure());
  }

  override updated() {
    this.measure();
  }

  /** one ticker line — phrases joined around the /// separator, AND
     ending on one: each repetition therefore opens on a /// (the
     trailing text space collapses at the run's line end, so the
     divider reads against the -gap margin, no double-spacing) */
  private get line(): string {
    const phrases = this.phrases;
    if (phrases.length === 0) return '';
    return phrases.join(SEPARATOR) + SEPARATOR;
  }

  /** repeat the line enough copies per half that one half covers the
     container's width — the gapless-loop condition (half ≥ viewport) */
  private measure() {
    const run = this.renderRoot.querySelector('.run') as HTMLElement | null;
    if (!run) return;
    const width = run.getBoundingClientRect().width;
    if (width <= 0) return;
    const margin = parseFloat(getComputedStyle(run).marginInlineEnd) || 0;
    const host = this.getBoundingClientRect().width;
    const needed = Math.max(1, Math.ceil(host / (width + margin)));
    if (needed !== this.copies) this.copies = needed;
  }

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
    }
    .band {
      box-sizing: border-box;
      display: flex;
      overflow: hidden;
      position: relative;
      /* the interior reads rule + pad each side (the padding rides
         UNDER the rules, so a rail inset inside the band overlaps the
         ticker by its inset — the author's seat choice) */
      padding-block: calc(
        var(--glaphic-marquee-rule-size, 4px) + var(--glaphic-marquee-pad-block, 13px)
      );
    }
    /* the rules are the COMPONENT'S OWN: full-width rails seated at
       the band's edges (tier-2 insets park them anywhere inside). A
       page styles/breaks them responsively through the parts
       (::part(rail-top) / ::part(rail-bottom)) instead of overlaying
       twin bars outside the band — the band and its rails can never
       drift apart again */
    .rail {
      position: absolute;
      left: 0;
      right: 0;
      height: var(--glaphic-marquee-rule-size, 4px);
      background: var(--glaphic-marquee-rule-ink, var(--glaphic-ink-brand-dark, #a6022a));
      pointer-events: none;
    }
    .rail.rail-top { top: var(--glaphic-marquee-rule-inset-top, 0); }
    .rail.rail-bottom { bottom: var(--glaphic-marquee-rule-inset-bottom, 0); }
    .track {
      display: inline-flex;
      flex: none;
      white-space: nowrap;
      animation: glaphic-marquee-scroll
        var(--glaphic-marquee-speed, 20s) linear infinite;
    }
    /* the reverse attribute flips the run; same keyframes, same
       duration, opposite direction */
    :host([reverse]) .track {
      animation-direction: reverse;
    }
    .half {
      display: inline-flex;
      flex: none;
    }
    .run {
      font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
      font-size: var(--glaphic-marquee-text-size, 12px);
      line-height: 1.6;
      color: var(--glaphic-marquee-ink, var(--glaphic-ink-brand-dark, #a6022a));
      /* the pitch between line repetitions (flex items, so the
         spacing is a margin — no trailing-space collapsing games) */
      margin-inline-end: var(--glaphic-marquee-gap, 12px);
    }
    @keyframes glaphic-marquee-scroll {
      from {
        translate: 0 0;
      }
      to {
        translate: -50% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .track {
        animation: none;
      }
      /* the static read: one run of phrases, no twins */
      .half + .half {
        display: none;
      }
    }
  `;

  protected render() {
    const line = this.line;
    const speed = this.speed > 0 ? `${this.speed}s` : 'var(--glaphic-marquee-speed, 20s)';
    const run = html`<span class="run">${line}</span>`;
    return html`
      <div class="band" part="band">
        <div class="rail rail-top" part="rail rail-top"></div>
        <div class="rail rail-bottom" part="rail rail-bottom"></div>
        <div class="track" part="track" style="animation-duration: ${speed}">
          <span class="half part" part="half">${Array.from({ length: this.copies }, () => run)}</span>
          <span class="half part" part="half" aria-hidden="true">
            ${Array.from({ length: this.copies }, () => run)}
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('glaphic-marquee', GlaphicMarquee);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-marquee': GlaphicMarquee;
  }
}