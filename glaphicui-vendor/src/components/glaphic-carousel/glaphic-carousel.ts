import { LitElement, css, html } from 'lit';

/**
 * glaphic-carousel — slide pager (furniture, shadow DOM, slotted
 * slides). The slides are the element's light children, each flexed to
 * the slide width inside the track; keep track width 100% and never
 * add a gap to it (the translate(-100%) math requires full-width
 * slides — slides carry their own padding).
 *
 * Usage:
 *   <glaphic-carousel>
 *     <div class="slide">…</div> <div class="slide">…</div>
 *   </glaphic-carousel>
 *
 * index is 0-based and clamped; change fires { index } (switch/seg
 * convention). Arrow keys work on the stage; prev/next buttons +
 * dash indicators + a hot tabular readout come with it (trim=off
 * hides the furniture). Pointer drag commits past 25% of width.
 *
 * Tier-2: --glaphic-carousel-slide-width · -tint · -depth · -rim ·
 *         -radius · -stage-bg (full formula over -depth) · -trim-bg ·
 *         -accent · -indicator
 */

/* above the class — the TDZ rule for static initializers */
const carouselStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
  }
  .stage {
    position: relative;
    border: 1px solid var(--glaphic-carousel-rim, var(--rim, rgba(23, 20, 14, .3)));
    border-radius: var(--glaphic-carousel-radius, var(--r, 1.9px));
    box-sizing: border-box;
  }
  .stage:focus-visible { outline: 2px solid var(--cold, #0780B8); outline-offset: 2px; }

  .viewport {
    overflow: hidden;
    position: relative;
    /* full film formula declared here (not a :host var) so depth and
       tint re-resolve at the viewport — declaration-time substitution */
    background: var(--glaphic-carousel-stage-bg, color-mix(
      in srgb,
      var(--glaphic-carousel-tint, var(--platec, #17140E)) calc(var(--glaphic-carousel-depth, 6) * 1%),
      transparent
    ));
  }
  /* masked 1px inner ring (card geometry) */
  .viewport::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    padding: 1px;
    clip-path: inherit;
    background: var(--glaphic-carousel-rim, var(--rimsoft, rgba(23, 20, 14, .14)));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
  }
  .track {
    display: flex;
    width: 100%;
    /* NO gap here — the translate % math needs full-width slides */
    transform: translate(calc(var(--car-index, 0) * -100%));
    transition: transform .28s cubic-bezier(.4, 0, .2, 1);
  }
  .track.dragging { transition: none; }
  ::slotted(*) {
    flex: 0 0 var(--glaphic-carousel-slide-width, 100%);
    min-width: 0;
    box-sizing: border-box;
  }
  .viewport.dragging { cursor: grabbing; }

  .trim {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: color-mix(
      in srgb,
      var(--glaphic-carousel-trim-bg-src, var(--platec, #17140E)) calc(var(--glaphic-carousel-trim-depth, 5) * 1%),
      transparent
    );
    border-top: 1px solid var(--glaphic-carousel-rim, var(--rimsoft, rgba(23, 20, 14, .14)));
  }
  .trim button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    min-height: 20px;
    padding: 3px 10px;
    border: 1px solid var(--glaphic-carousel-rim, var(--rim, rgba(23, 20, 14, .3)));
    border-radius: var(--r, 1.9px);
    background: transparent;
    font: 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    color: var(--glaphic-carousel-accent, var(--ink, #17140E));
    cursor: pointer;
  }
  .trim button:disabled { opacity: .45; cursor: not-allowed; }
  .trim button:focus-visible { outline: 2px solid var(--cold, #0780B8); outline-offset: 2px; }
  .dots {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-inline: auto;
  }
  /* 16×3px dash per slide — hot when current */
  .dots button {
    width: 16px;
    height: 3px;
    padding: 0;
    border: none;
    border-radius: 1px;
    background: var(--glaphic-carousel-indicator, var(--rimsoft, rgba(23, 20, 14, .14)));
    cursor: pointer;
  }
  .dots button[aria-current='true'] { background: var(--glaphic-carousel-accent, var(--hot, #E03A0B)); }
  .dots button:focus-visible { outline: 2px solid var(--cold, #0780B8); outline-offset: 1px; }
  .readout {
    font: 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    font-variant-numeric: tabular-nums;
    letter-spacing: .12em;
    color: var(--glaphic-carousel-accent, var(--hot, #E03A0B));
    min-width: 6ch;
    text-align: right;
  }
  @media (prefers-reduced-motion: reduce) {
    .track { transition: none; }
  }
`;

export class GlaphicCarousel extends LitElement {
  static styles = carouselStyles;
  static properties = {
    index: { type: Number, reflect: true },
    loop: { type: Boolean, reflect: true },
    trim: { type: Boolean, reflect: true },
    label: { type: String },
    count: { state: true },
  };
  declare index: number;
  declare loop: boolean;
  declare trim: boolean;
  declare label: string;
  declare count: number;

  constructor() {
    super();
    this.index = 0;
    this.loop = false;
    this.trim = true;
    this.label = 'Carousel';
    this.count = 0;
  }

  private onSlotChange = () => this.syncCount();

  protected override firstUpdated() {
    const slot = this.renderRoot.querySelector('slot') as HTMLSlotElement | null;
    slot?.addEventListener('slotchange', this.onSlotChange);
    this.syncCount();
  }

  override disconnectedCallback() {
    const slot = this.renderRoot?.querySelector('slot') as HTMLSlotElement | null;
    slot?.removeEventListener('slotchange', this.onSlotChange);
    super.disconnectedCallback();
  }

  private syncCount() {
    const slot = this.renderRoot?.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;
    this.count = slot.assignedElements({ flatten: true }).length;
    if (this.index > this.maxIndex()) this.index = this.maxIndex();
  }

  private maxIndex() {
    return Math.max(0, this.count - 1);
  }

  private goTo(next: number) {
    const max = this.maxIndex();
    if (max === 0) return;
    let target = next;
    if (target < 0) target = this.loop ? max : 0;
    if (target > max) target = this.loop ? 0 : max;
    if (target === this.index) return;
    this.index = target;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { index: this.index }, bubbles: true, composed: true }),
    );
  }

  /** Pointer drag: live track translate; commit past 25% of width. */
  private dragFromX = 0;
  private dragTo = 0;
  private dragging = false;

  private onPointerDown(ev: PointerEvent) {
    if (this.count < 2) return;
    this.dragging = true;
    this.dragFromX = this.dragTo = ev.clientX;
    this.renderRoot.querySelector('.track')?.classList.add('dragging');
    (this.renderRoot.querySelector('.viewport') as HTMLElement | null)?.classList.add('dragging');
    (ev.currentTarget as HTMLElement)?.setPointerCapture?.(ev.pointerId);
  }

  private onPointerMove(ev: PointerEvent) {
    if (!this.dragging) return;
    this.dragTo = ev.clientX;
    const width = (this.renderRoot.querySelector('.track') as HTMLElement | null)?.getBoundingClientRect().width ?? 0;
    if (!width) return;
    const shift = this.dragTo - this.dragFromX;
    const base = this.index * -width;
    this.renderRoot.querySelector('.track')!.setAttribute('style', `transform: translate(${base + shift}px)`);
  }

  private onPointerUp(ev: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    const track = this.renderRoot.querySelector('.track') as HTMLElement | null;
    const viewport = this.renderRoot.querySelector('.viewport') as HTMLElement | null;
    track?.classList.remove('dragging');
    viewport?.classList.remove('dragging');
    if (track) track.removeAttribute('style');
    const shift = (this.dragTo - this.dragFromX) / ((track?.getBoundingClientRect().width ?? 1) || 1);
    if (Math.abs(shift) > 0.25) this.goTo(this.index + (shift < 0 ? 1 : -1));
    (ev.currentTarget as HTMLElement)?.releasePointerCapture?.(ev.pointerId);
  }

  protected override render() {
    const disabled = this.count < 2;
    return html`
      <div class="stage" part="stage" role="region" aria-roledescription="carousel" aria-label=${this.label} tabindex="0"
           @keydown=${this.onKey}>
        <div class="viewport"
             @pointerdown=${this.onPointerDown}
             @pointermove=${this.onPointerMove}
             @pointerup=${this.onPointerUp}
             @pointercancel=${this.onPointerUp}>
          <div class="track" style="--car-index: ${this.index}">
            <slot></slot>
          </div>
        </div>
        ${this.trim ? html`
          <div class="trim" part="trim">
            <button class="prev" part="prev" type="button" aria-label="Previous slide" ?disabled=${disabled || (!this.loop && this.index === 0)} @click=${() => this.goTo(this.index - 1)}>◀</button>
            <div class="dots" role="tablist" aria-label="Slides">
              ${Array.from({ length: this.count }, (_, i) => html`
                <button type="button" part="indicator" role="tab" aria-label="Go to slide ${i + 1}" aria-current=${i === this.index ? 'true' : 'false'} @click=${() => this.goTo(i)}></button>
              `)}
            </div>
            <span class="readout" part="readout">${String(this.index + 1).padStart(2, '0')} / ${String(Math.max(this.count, 0)).padStart(2, '0')}</span>
            <button class="next" part="next" type="button" aria-label="Next slide" ?disabled=${disabled || (!this.loop && this.index === this.maxIndex())} @click=${() => this.goTo(this.index + 1)}>▶</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private onKey(ev: KeyboardEvent) {
    if (ev.key === 'ArrowRight') { this.goTo(this.index + 1); }
    else if (ev.key === 'ArrowLeft') { this.goTo(this.index - 1); }
    else if (ev.key === 'Home') { this.goTo(0); }
    else if (ev.key === 'End') { this.goTo(this.maxIndex()); }
  }
}

customElements.define('glaphic-carousel', GlaphicCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-carousel': GlaphicCarousel;
  }
}