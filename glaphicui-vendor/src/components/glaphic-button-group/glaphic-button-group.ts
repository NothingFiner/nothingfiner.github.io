import { LitElement, css, html } from 'lit';

/**
 * glaphic-button-group — the segmented bar (Figma "Button Group",
 * states Default/Hover/Selected). Shadow DOM furniture; the corners
 * ride the base radius (--glaphic-radius-base, 2px — the knob
 * overrides).
 *
 * ORIENTATION: 'horizontal' (default) lays the segments in a row with
 * 1px dividers between them; 'vertical' stacks them in a column with
 * the dividers riding the stacked axis (border-top between rows) and
 * the segments stretching to one equal width. The host's overflow
 * clip shapes the first/last corners in both axes (no per-child
 * radius), so the shared internal edges stay flush in either.
 *
 * Options come from a comma-separated `options` attribute
 * (e.g. options="On,Off,Question?"); selecting a segment sets
 * `value` and fires a bubbling+composed `change` event
 * (detail.value). Segments are native buttons; the selected one
 * carries aria-pressed. Empty `value` (`''` default) = no selection
 * — the spec's no-fill Default state.
 *
 * Colors from the primitives (Eliot's readability pass, shared with
 * the outline buttons' Tier-1 vocabulary): the bar's edge and the
 * segment dividers are 1px ink-black; hover prints the paper-deep
 * surface under ink-black text; selection prints the SAME pair —
 * paper-deep + ink-black — and holds it (hover and selection read
 * alike; a selection is a hover that stays).
 *
 * APPEARANCES: the optional comma-separated `appearances` attribute
 * maps positionally onto `options` (options="On,Off" with
 * appearances="solid,outline"). An unlisted or unknown entry falls
 * back to 'outline' — the frame's transparent segment. Outline
 * segments read as the button's outline recipe: a transparent fill,
 * the label and the bar edges the same ink (the group's border
 * system IS the outline's border — a segment inside a bordered bar
 * can't own its own full frame). Solid segments ride the solid
 * recipe's rest paint (the fluro fill + ink-black label of the
 * primary recipe). Hover and selected print the SHARED pair on EVERY
 * appearance — the decision: an appearance owns the rest paint, the
 * group owns the states (a solid segment's fill lifts to the shared
 * hover pair; selection is a hover that stays, appearance-agnostic).
 * Colors beyond the primary recipe on segments would need their own
 * call — not built.
 *
 * Segments are internally rendered (not slotted glaphic-button
 * components): a slotted button drags its own fill/border/radius
 * into a bar that paints one edge, and the strip-back costs more
 * than the internal buttons do. They share the button's token
 * vocabulary instead (paper-deep / ink-black).
 *
 * Tier-2: --glaphic-button-group-edge · -radius · -selected-fill ·
 *         -selected-ink · -hover-fill · -hover-ink · -solid-fill ·
 *         -solid-ink
 * (the Tier-1 --glaphic-button-group-md-padding-{x,y} sizing tokens
 * ride through unchanged)
 */
export class GlaphicButtonGroup extends LitElement {
  static properties = {
    /** 'On,Off,Question?' → ['On', 'Off', 'Question?'] */
    options: {
      converter: (v: string | null) =>
        (v ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    },
    value: { type: String },
    /** 'solid,outline' → ['solid', 'outline'] — maps positionally
        onto `options`; unlisted/unknown falls back to 'outline' */
    appearances: {
      converter: (v: string | null) =>
        (v ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    },
    /** 'horizontal' (default, segments in a row) | 'vertical'
        (segments stacked in a column, dividers on the stacked axis) */
    orientation: { type: String, reflect: true },
    /** declarative hover mirror — pins the named option's hover paint
        so stories and tests can drive CSS-only state without a pointer */
    forceHover: { type: String, reflect: true, attribute: 'force-hover' },
  };
  declare options: string[];
  declare appearances: string[];
  declare value: string;
  declare orientation: string;
  declare forceHover: string;

  constructor() {
    super();
    this.options = [];
    this.appearances = [];
    this.value = '';
    this.orientation = 'horizontal';
    this.forceHover = '';
  }

  static styles = css`
    :host {
      display: inline-flex;
      max-width: 100%;
      overflow: hidden;
      border: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-button-group-edge, var(--glaphic-ink-black, #0d0221));
      /* the corners ride the base radius (the knob overrides) — the
         host's overflow clip shapes the first/last corners and keeps
         the shared internal edges flush in both orientations */
      border-radius: var(--glaphic-button-group-radius, var(--glaphic-radius-base, 2px));
    }
    button {
      display: inline-block;
      font: 400 var(--glaphic-font-size-1, 11px) / 15px var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
      padding: var(--glaphic-button-group-md-padding-y, 10px) var(--glaphic-button-group-md-padding-x, 14px);
      background: transparent;
      color: var(--glaphic-ui-text, #0d0221);
      border: none;
      border-left: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-button-group-edge, var(--glaphic-ink-black, #0d0221));
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 0.12s ease, color 0.12s ease;
    }
    button:first-child { border-left: none; }
    /* SOLID segments — the primary solid recipe's rest paint (fluro
       fill, ink-black label; the bar edges stay the outline's shared
       ink). ORDER-DEPENDENT: this block sits before the hover rules
       on purpose — at equal specificity the later hover/selected
       rules win, so an appearance's rest paint lifts for the shared
       state pair. */
    button[appearance='solid'] {
      background: var(--glaphic-button-group-solid-fill, var(--glaphic-ink-brand-fluro, #14f1c8));
      color: var(--glaphic-button-group-solid-ink, var(--glaphic-ink-black, #0d0221));
    }
    /* VERTICAL — the segments stack; the dividers ride the stacked
       axis (border-top between rows) and the segments stretch to one
       equal width; first/last corners stay the host clip's job.
       (The flex axis lives on the inner wrapper — the buttons are ITS
       children, not the host's.) */
    [part='group'] {
      display: flex;
    }
    :host([orientation='vertical']) {
      flex-direction: column;
    }
    :host([orientation='vertical']) [part='group'] {
      flex-direction: column;
    }
    :host([orientation='vertical']) button {
      border-left: none;
      border-top: var(--glaphic-border-width-sm, 1px) solid var(--glaphic-button-group-edge, var(--glaphic-ink-black, #0d0221));
    }
    :host([orientation='vertical']) button:first-child {
      border-top: none;
    }
    button[force-hover] {
      background: var(--glaphic-button-group-hover-fill, var(--glaphic-neutral-paper-deep, #e9ede0));
      color: var(--glaphic-button-group-hover-ink, var(--glaphic-ink-black, #0d0221));
    }
    button:hover {
      background: var(--glaphic-button-group-hover-fill, var(--glaphic-neutral-paper-deep, #e9ede0));
      color: var(--glaphic-button-group-hover-ink, var(--glaphic-ink-black, #0d0221));
    }
    button[aria-pressed='true'] {
      background: var(--glaphic-button-group-selected-fill, var(--glaphic-neutral-paper-deep, #e9ede0));
      color: var(--glaphic-button-group-selected-ink, var(--glaphic-ink-black, #0d0221));
    }
    button:focus-visible {
      outline: 2px solid var(--glaphic-ui-focus, #8447ff);
      outline-offset: -4px;
    }
    @media (prefers-reduced-motion: reduce) {
      button { transition: none; }
    }
  `;

  /* outline is the frame's transparent segment; anything unlisted or
     unknown reads outline */
  private appearanceFor(index: number): string {
    return this.appearances[index] === 'solid' ? 'solid' : 'outline';
  }

  private select(option: string) {
    this.value = option;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  render() {
    return html`<div part="group" role="group">
      ${this.options.map(
        (option, index) => html`<button
          type="button"
          part="option"
          appearance=${this.appearanceFor(index)}
          aria-pressed=${option === this.value ? 'true' : 'false'}
          ?force-hover=${option === this.forceHover || null}
          @click=${() => this.select(option)}
        >${option}</button>`
      )}
    </div>`;
  }
}

customElements.define('glaphic-button-group', GlaphicButtonGroup);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-button-group': GlaphicButtonGroup;
  }
}