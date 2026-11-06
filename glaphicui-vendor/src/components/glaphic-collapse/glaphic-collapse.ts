import { LitElement, css, html } from 'lit';

/** the trigger attribute's legal values */
export type CollapseTrigger = 'click' | 'hover';
const COLLAPSE_TRIGGERS: Record<CollapseTrigger, true> = { click: true, hover: true };

/* ────────────────────────────────────────────────────────────────
   glaphic-collapse — the TEXT COLLAPSE treatment (was Lab/Force's
   word slam): shrinking gap spans let the words slam together. Each
   word rides next to a .gap span whose width holds the spread;
   collapsing closes every gap to 0 with a left-to-right stagger,
   and each word lands through a translate overshoot keyframe
   (arrive past home, snap back) so the impacts read as weight.
   Spreading re-opens the gaps in the reverse order, no keyframe.
   Pure width + transform — no alpha, no blur.
   'click' toggles the pose; 'hover' collapses on enter and spreads
   on leave. prefers-reduced-motion: the gaps flip with no
   transition and no landing keyframes.
   ──────────────────────────────────────────────────────────────── */

const shadowStyles = css`
  :host {
    display: block;
    cursor: pointer;
    user-select: none;
    /* Tier-2 defaults; consumer inline overrides win */
    --glaphic-collapse-ink: var(--glaphic-ink-black, #0d0221);
    --glaphic-collapse-spread: 44px;
  }
  @media (prefers-reduced-motion: reduce) {
    :host { cursor: default; }
  }
  .line {
    display: inline-block;
    font-family: var(--glaphic-font-family-display, 'Space Grotesk', sans-serif);
    font-weight: 700;
    font-size: 48px;
    line-height: 1.15;
    letter-spacing: 1px;
    color: var(--glaphic-collapse-ink);
  }
  .unit { display: inline-block; }
  .gap {
    display: inline-block;
    width: var(--glaphic-collapse-spread, 44px);
    transition: width 90ms ease calc(var(--collapse-i) * 60ms);
  }
  .word {
    display: inline-block;
    white-space: pre;
  }
  :host([collapsed]) .gap { width: 0px; }
  :host(:not([collapsed])) .gap {
    /* the reverse-order spread, no overshoot on reopen */
    transition: width 110ms ease calc((var(--collapse-n) - var(--collapse-i)) * 45ms);
  }
  :host([collapsed]) .word {
    animation: glaphic-collapse-land 240ms ease calc(var(--collapse-i) * 60ms) both;
  }
  @keyframes glaphic-collapse-land {
    0% { transform: translateX(10px); }
    55% { transform: translateX(-3px); }
    100% { transform: translateX(0px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .gap { transition: none; }
    :host([collapsed]) .word { animation: none; }
  }
`;

export class GlaphicCollapse extends LitElement {
  static properties = {
    words: { type: String },
    /** 'click' (toggle) | 'hover' (enter collapses — leave spreads) —
     *  unknown attribute values clamp to the default */
    trigger: {
      converter: (v: string | null) =>
        (v ?? '') in COLLAPSE_TRIGGERS ? v : 'click',
      reflect: true,
    },
  };
  declare words: string;
  declare trigger: CollapseTrigger;
  private collapsed = false;

  constructor() {
    super();
    this.words = 'WORDS SLAM TOGETHER';
    this.trigger = 'click';
  }

  static styles = shadowStyles;

  protected override firstUpdated() {
    if (this.trigger === 'hover') {
      this.addEventListener('pointerenter', () => this.setPose(true));
      this.addEventListener('pointerleave', () => this.setPose(false));
    } else {
      this.addEventListener('click', () => this.setPose(!this.collapsed));
    }
  }

  private setPose(collapse: boolean) {
    this.collapsed = collapse;
    this.toggleAttribute('collapsed', collapse);
    if (collapse) {
      /* restart the landing keyframes even mid-spread */
      for (const word of this.shadowRoot?.querySelectorAll<HTMLElement>('.word') ?? []) {
        word.style.animation = 'none';
        void word.offsetWidth;
        word.style.animation = '';
      }
    }
  }

  render() {
    const list = this.words.split(/\s+/).filter(Boolean);
    return html`<span class="line">${list.map((word, i) => this.unit(word, i, list.length))}</span>`;
  }

  private unit(word: string, i: number, count: number) {
    /* --collapse-i drives the collapse stagger; --collapse-n drives
       the spread's reverse order */
    return html`<span class="unit" style="--collapse-i: ${i}; --collapse-n: ${count - 1}"
      ><span class="word">${word}</span><span class="gap" aria-hidden="true"></span></span>`;
  }
}

customElements.define('glaphic-collapse', GlaphicCollapse);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-collapse': GlaphicCollapse;
  }
}