import { LitElement, css, html, type PropertyValues } from 'lit';

/**
 * glaphic-drawer — menu drawer / nav overlay (furniture, shadow DOM).
 * A fixed plate panel sliding over a flat plate-tint scrim.
 *
 * Usage: `<glaphic-drawer open label="Site menu">…nav links…</glaphic-drawer>`.
 * `open` is the declarative driver (like switch's checked); `show()` /
 * `close()` methods do the same and stash/return focus. The library
 * ships no trigger — wire your own button to `show()` or the attribute.
 * Body scroll-lock is the consumer's job (see README).
 *
 * Focus model: opening stashes the focused element and focuses the
 * panel (then the first tabbable item). The Tab trap sweeps both the
 * shadow panel and the slotted light children — a shadow-only trap
 * would let Tab escape through the slot. Escape and scrim/close-click
 * close with a `close` event carrying the reason; focus returns to the
 * stash on close (guarded for elements inside other shadow roots).
 *
 * Tier-2: --glaphic-drawer-side-width (the panel's extent along its
 *         axis) · -tint · -depth · -scrim-ink · -scrim-depth ·
 *         -accent (leading-edge bar + brackets) · -rim · -radius ·
 *         -duration · -z · -heading-ink · -item-ink
 */

/* style consts sit above the class — static initializers run at
   definition time (the TDZ rule) */
const drawerStyles = css`
  :host {
    display: block;
    position: fixed;
    inset: 0;
    z-index: var(--glaphic-drawer-z, 50);
    /* closed: drops out of visibility AND tab order, while the
       panel's slide-out transition still plays underneath */
    visibility: hidden;
    pointer-events: none;
    transition: visibility 0s var(--glaphic-drawer-duration, .22s);
  }
  :host([open]) {
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s;
  }
  /* flat plate scrim — deliberately NO backdrop-filter and no blend:
     both would make this an optical component and force light DOM */
  .scrim {
    position: absolute;
    inset: 0;
    background: color-mix(
      in srgb,
      var(--glaphic-drawer-scrim-ink, var(--ink, #17140E)) calc(var(--glaphic-drawer-scrim-depth, 32) * 1%),
      transparent
    );
    opacity: 0;
    transition: opacity var(--glaphic-drawer-duration, .22s) ease;
  }
  :host([open]) .scrim { opacity: 1; }

  .panel {
    position: absolute;
    z-index: 1;
    background: color-mix(
      in srgb,
      var(--glaphic-drawer-tint, var(--platec, #17140E)) calc(var(--glaphic-drawer-depth, 8) * 1%),
      transparent
    );
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: var(--glaphic-drawer-radius, var(--r, 1.9px));
    /* the rim is a painted RING, not a filled shell (card's ::after
       geometry) */
    transition: transform var(--glaphic-drawer-duration, .22s) cubic-bezier(.4, 0, .2, 1);
  }

  /* default: left rail. The panel paints its own 1px ring (::after)
     and — when chamfered — 1.41px diagonal stubs (::before, card
     geometry), so the host rule stays empty */
  .panel {
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--glaphic-drawer-side-width, 300px);
    transform: translateX(-102%);
  }
  :host([open]) .panel { transform: translateX(0); }

  :host([side='right']) .panel {
    left: auto;
    right: 0;
    transform: translateX(102%);
  }
  :host([side='right'][open]) .panel { transform: translateX(0); }

  :host([side='top']) .panel {
    top: 0;
    bottom: auto;
    left: 0;
    right: 0;
    width: auto;
    height: var(--glaphic-drawer-side-width, 300px);
    transform: translateY(-102%);
  }
  :host([side='top'][open]) .panel { transform: translateY(0); }

  :host([side='bottom']) .panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    height: var(--glaphic-drawer-side-width, 300px);
    transform: translateY(102%);
  }
  :host([side='bottom'][open]) .panel { transform: translateY(0); }

  /* 1px painted ring — masked fill, inset from the panel edge */
  .panel::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    padding: 1px;
    border-radius: inherit;
    clip-path: inherit;
    background: var(--glaphic-drawer-rim, var(--rim, rgba(23, 20, 14, .3)));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
  }
  /* chamfer: the rect ring can't trace 45° cuts — two gradient stubs
     (135deg TL / 315deg BR, bands 50% → 50% + 1.41px), card geometry */
  :host([chamfer]) .panel {
    clip-path: polygon(
      var(--ch, 10.6px) 0,
      100% 0,
      100% calc(100% - var(--ch, 10.6px)),
      calc(100% - var(--ch, 10.6px)) 100%,
      0 100%,
      0 var(--ch, 10.6px)
    );
  }
  :host([chamfer]) .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(135deg, transparent calc(50%), var(--glaphic-drawer-rim, var(--rim, rgba(23, 20, 14, .3))) calc(50%), var(--glaphic-drawer-rim, var(--rim, rgba(23, 20, 14, .3))) calc(50% + 1.41px), transparent calc(50% + 1.41px)) 0 0 / var(--ch, 10.6px) var(--ch, 10.6px) no-repeat,
      linear-gradient(315deg, transparent calc(50%), var(--glaphic-drawer-rim, var(--rim, rgba(23, 20, 14, .3))) calc(50%), var(--glaphic-drawer-rim, var(--rim, rgba(23, 20, 14, .3))) calc(50% + 1.41px), transparent calc(50% + 1.41px)) 100% 100% / var(--ch, 10.6px) var(--ch, 10.6px) no-repeat;
  }

  /* leading-edge accent bar (2px, hot) */
  .edge {
    position: absolute;
    inset: 0 auto 0 0;
    width: 2px;
    background: var(--glaphic-drawer-accent, var(--hot, #E03A0B));
    pointer-events: none;
    z-index: 1;
  }
  :host([side='right']) .edge { inset: 0 0 0 auto; }
  :host([side='top']) .edge { inset: 0 0 auto 0; width: auto; height: 2px; }
  :host([side='bottom']) .edge { inset: auto 0 0 0; width: auto; height: 2px; }

  /* HUD corner brackets, 1.5px hot — instrument furniture */
  .bk {
    position: absolute;
    width: 10px;
    height: 10px;
    pointer-events: none;
    z-index: 1;
  }
  .bk-tl { top: 6px; left: 8px; border-left: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); border-top: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); }
  .bk-tr { top: 6px; right: 8px; border-right: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); border-top: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); }
  .bk-bl { bottom: 6px; left: 8px; border-left: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); border-bottom: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); }
  .bk-br { bottom: 6px; right: 8px; border-right: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); border-bottom: 1.5px solid var(--glaphic-drawer-accent, var(--hot, #E03A0B)); }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 13px 14px 12px;
    border-bottom: 1px solid var(--glaphic-drawer-rim, var(--rimsoft, rgba(23, 20, 14, .14)));
    box-sizing: border-box;
  }
  .head ::slotted([slot='heading']) {
    font: 600 11px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--glaphic-drawer-heading-ink, var(--ink, #17140E));
  }
  .x {
    /* icon-only close; ≥24px hit area, explicit label for AT */
    min-width: 24px;
    min-height: 24px;
    padding: 4px 8px;
    border: none;
    background: transparent;
    font: 600 13px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    color: var(--glaphic-drawer-heading-ink, var(--ink, #17140E));
    cursor: pointer;
    border-radius: var(--r, 1.9px);
  }
  .x:hover { background: color-mix(in srgb, var(--ink, #17140E) 8%, transparent); }
  .x:focus-visible { outline: 2px solid var(--cold, #0780B8); outline-offset: 2px; }

  .content {
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
  }
  /* menu links the consumer slots */
  .content ::slotted(a),
  .content ::slotted(button) {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 12px 16px;
    font: 600 12px/1 var(--f-mono, ui-monospace, 'SF Mono', Menlo, monospace);
    letter-spacing: .12em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--glaphic-drawer-item-ink, var(--ink, #17140E));
    cursor: pointer;
  }
  .content ::slotted(a:hover) { background: color-mix(in srgb, var(--ink, #17140E) 8%, transparent); }
  .foot {
    border-top: 1px solid var(--glaphic-drawer-rim, var(--rimsoft, rgba(23, 20, 14, .14)));
    padding: 10px 14px;
    box-sizing: border-box;
  }
  @media (prefers-reduced-motion: reduce) {
    .panel, .scrim { transition: none; }
  }
`;

export class GlaphicDrawer extends LitElement {
  static styles = drawerStyles;
  static properties = {
    open: { type: Boolean, reflect: true },
    side: { type: String, reflect: true },
    chamfer: { type: Boolean, reflect: true },
    label: { type: String },
    closeLabel: { type: String, attribute: 'close-label' },
  };
  declare open: boolean;
  declare side: string;
  declare chamfer: boolean;
  declare label: string;
  declare closeLabel: string;

  constructor() {
    super();
    this.open = false;
    this.side = 'left';
    this.chamfer = false;
    this.label = 'Menu';
    this.closeLabel = 'Close menu';
  }

  private stash: HTMLElement | null = null;
  /** set by close() before the property flips, so updated() can
   *  dispatch the right reason even for a programmatic close */
  private closedBy?: string;
  private onKey = (ev: KeyboardEvent) => this.handleKey(ev);

  public show() {
    if (!this.open) this.open = true;
  }

  public close(reason: 'escape' | 'backdrop' | 'close' | 'programmatic' = 'programmatic') {
    this.closedBy = reason;
    this.open = false;
  }

  /** Tabbable sweep: shadow panel contents AND slotted light children
   *  (this.querySelectorAll reaches slotted nodes; a shadow-only trap
   *  would leak Tab out through the slot). */
  private tabbables(): (HTMLElement | null)[] {
    const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const shadowSet = this.shadowRoot?.querySelectorAll(sel) ?? new Set<Element>();
    return [
      Array.from(shadowSet) as HTMLElement[],
      Array.from(this.querySelectorAll(sel)) as HTMLElement[],
    ].flat();
  }

  protected override updated(changed: PropertyValues) {
    if (!changed.has('open')) return;
    if (this.open) {
      const active = document.activeElement;
      this.stash = active instanceof HTMLElement ? active : null;
      document.addEventListener('keydown', this.onKey);
      const first = this.tabbables()[0];
      (first ?? (this.shadowRoot?.querySelector('.panel') as HTMLElement | null))?.focus();
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    } else {
      document.removeEventListener('keydown', this.onKey);
      this.dispatchEvent(
        new CustomEvent('close', {
          detail: { reason: this.closedBy ?? 'programmatic' },
          bubbles: true,
          composed: true,
        }),
      );
      this.closedBy = undefined;
      const back = this.stash;
      this.stash = null;
      back?.focus?.();
    }
  }

  private handleKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.close('escape');
      return;
    }
    if (ev.key !== 'Tab') return;
    const order = this.tabbables();
    if (order.length === 0) return;
    const current = document.activeElement as HTMLElement | null;
    let at = order.indexOf(current as HTMLElement);
    const forward = !ev.shiftKey;
    if (at === -1) {
      // focus fell outside (e.g. the closed panel) — pull it back
      ev.preventDefault();
      order[forward ? 0 : order.length - 1]?.focus();
      return;
    }
    ev.preventDefault();
    at = forward ? (at + 1) % order.length : (at - 1 + order.length) % order.length;
    order[at]?.focus();
  }

  render() {
    return html`
      <div class="scrim" part="scrim" @click=${() => this.close('backdrop')}></div>
      <div class="panel" part="panel" role="dialog" aria-modal="true" aria-label=${this.label} tabindex="-1">
        <i class="edge" aria-hidden="true"></i>
        <i class="bk bk-tl" aria-hidden="true"></i>
        <i class="bk bk-tr" aria-hidden="true"></i>
        <i class="bk bk-bl" aria-hidden="true"></i>
        <i class="bk bk-br" aria-hidden="true"></i>
        <div class="head" part="heading">
          <slot name="heading"></slot>
          <button class="x" part="close" type="button" aria-label=${this.closeLabel} @click=${() => this.close('close')}>×</button>
        </div>
        <div class="content" part="content"><slot></slot></div>
        <div class="foot" part="footer"><slot name="footer"></slot></div>
      </div>
    `;
  }

  override disconnectedCallback() {
    document.removeEventListener('keydown', this.onKey);
    this.stash = null;
    super.disconnectedCallback();
  }
}

customElements.define('glaphic-drawer', GlaphicDrawer);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-drawer': GlaphicDrawer;
  }
}