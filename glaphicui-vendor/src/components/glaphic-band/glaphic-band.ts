import { LitElement, css, html } from 'lit';

/**
 * glaphic-band — the new-look band, rebuilt on the Glaphic primitives
 * (Figma NewDesigns "Bands" frame). HARD BREAK from the figcut band:
 * the knockout/cutout body, the glass lens, the brackets and supertext
 * trim, and the grid-span sizing are all GONE — Eliot's directive:
 * everything multiply, no masks anymore.
 *
 * One element, two axes plus tone:
 * - tone = the paint recipe: 'brand' (default — the ink-brand-dark
 *   solid) | 'fluro' (the ink-brand-fluro solid) | 'success'
 *   (success-surface fill with the success-text ink AND keyline) |
 *   'neutral' (cool-50 fill, cool-600 keyline + ink) | 'muted'
 *   (paper-deep fill, cool-400 keyline, cool-600 ink).
 * - size = the ladder step: 'display' (default, 120 tall, the big
 *   mono label) | 'compact' (81 tall — the slimmer brand read, its
 *   label ink the paper-deep) | 'small' (73 tall — the neutral
 *   band's step) | 'thin' (36 tall — the strip). Only the pairs the
 *   design shows are documented; every tone × size combination paints
 *   (Tier-2 knobs can retune the rest — unlisted pairs are derived,
 *   flagged below).
 * - axis: 'horizontal' (default — full width, cross on the size
 *   ladder) | 'vertical' (the solid bands rotated 90°: the cross on
 *   the width, full height, the label turned to read top-to-bottom —
 *   rotated geometry, not squeezed).
 *
 * Label copy rides the default slot. The keyline sits INSIDE the box
 * (border-box border), solid tones carry a transparent border.
 *
 * Inside every band sits a grid (Eliot's directive): 8 rows × 4
 * columns of 1fr tracks. The content is ONE grid item you place like
 * any grid item —
 * - content-row / content-column: 'all' (default — the full span, so
 *   the band reads exactly as it did before the grid), a track number
 *   ('3' pins the content to the third track), or an 'a-b' start-to-
 *   end range ('7-8' rides the bottom two rows).
 * - content-align-inline / content-align-block: 'start' (default for
 *   inline — the band's copy hangs at the left padding) | 'center' |
 *   'end'. Block's default is 'center' — the vertical read the sheet
 *   shows.
 * - line-height rides Tier-2 --glaphic-band-line-height (default 1.2,
 *   the read the sheet carries).
 *
 * The track counts are Tier-2 too, so the substrate retunes
 * (--glaphic-band-content-rows/-content-columns). A placement pinned
 * past the tuned count creates an implicit track (flagged). Vertical
 * bands keep the rotated reading: the grid turns with the label's
 * writing-mode, so the rows stack along the turned block axis.
 *
 * multiply (Boolean, default true) — the blend Eliot asked to toggle.
 * PRESENCE is on: the constructor carries the default, so
 * `<glaphic-band>` blends, and the only way off is the property
 * (`band.multiply = false`) or removing the attribute. Off, the host
 * drops the blend entirely and the band reads flat — same paints,
 * no translucency.
 *
 * The blend aside, the band is multiply physics per the look —
 * no alpha anywhere (no color-mix, no opacity, no rgba, no masks).
 *
 * Tier-2 (declare on the element; the tone/size tables are the
 * defaults) —
 * --glaphic-band-surface · -ink · -border · -radius ·
 * -font-family · -padding-x · -padding-y ·
 * -display-height · -compact-height · -small-height · -thin-height ·
 * -display-label-size · -compact-label-size · -small-label-size ·
 * -thin-label-size ·
 * -content-rows · -content-columns (the grid substrate) ·
 * -line-height
 */
export class GlaphicBand extends LitElement {
  static properties = {
    /** paint recipe: 'brand' (default) | 'fluro' | 'success' | 'neutral' | 'muted' */
    tone: { type: String, reflect: true },
    /** ladder step: 'display' (default) | 'compact' | 'small' | 'thin' */
    size: { type: String, reflect: true },
    /** box shape: 'horizontal' (default) | 'vertical' */
    axis: { type: String, reflect: true },
    /** the multiply toggle (presence on) */
    multiply: { type: Boolean, reflect: true },
    /** content track placement: 'all' (default) | track number | 'a-b' range */
    'content-row': { type: String, reflect: true },
    /** content track placement: 'all' (default) | track number | 'a-b' range */
    'content-column': { type: String, reflect: true },
    /** fit inside the inline tracks: 'start' (default) | 'center' | 'end' */
    'content-align-inline': { type: String, reflect: true },
    /** fit inside the block tracks: 'center' (default) | 'start' | 'end' */
    'content-align-block': { type: String, reflect: true },
  };
  declare tone: string;
  declare size: string;
  declare axis: string;
  /** the multiply toggle (presence on) */
  declare multiply: boolean;
  /** content track placement: 'all' (default) | track number | 'a-b' range */
  declare 'content-row': string;
  /** content track placement: 'all' (default) | track number | 'a-b' range */
  declare 'content-column': string;
  /** fit inside the inline tracks: 'start' (default) | 'center' | 'end' */
  declare 'content-align-inline': string;
  /** fit inside the block tracks: 'center' (default) | 'start' | 'end' */
  declare 'content-align-block': string;

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      /* the band IS a multiply layer — translucency comes from the
         blend against the page, never from alpha (the look physics).
         The blend rides the presence-based 'multiply' attribute:
         the constructor carries the default, off drops to normal */
      background: var(--glaphic-band-surface, var(--glaphic-ink-brand-dark, #a6022a));
      /* the keyless solids carry width 0; the pale tones seat the 1px
         inside rule through the border-width token */
      border: var(--glaphic-band-border-width, 0px) solid var(--glaphic-band-border);
      border-radius: var(--glaphic-band-radius, var(--glaphic-radius-base, 2px));
      font-family: var(--glaphic-band-font-family, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      /* brand (the default tone) — the ink-brand-dark solid, no keyline */
      --glaphic-band-surface: var(--glaphic-ink-brand-dark, #a6022a);
      --glaphic-band-ink: var(--glaphic-neutral-paper-elevated, #f9faf4);
      --glaphic-band-border: transparent;
      --glaphic-band-label-size: var(--glaphic-band-display-label-size, 24px);
    }
    :host([multiply]) {
      mix-blend-mode: multiply;
    }
    /* tone tables — the Bands sheet's five paints */
    :host([tone='fluro']) {
      --glaphic-band-surface: var(--glaphic-ink-brand-fluro, #14f1c8);
      --glaphic-band-ink: var(--glaphic-neutral-paper-elevated, #f9faf4);
    }
    :host([tone='success']) {
      --glaphic-band-surface: var(--glaphic-semantic-success-surface, #e6ffd3);
      --glaphic-band-ink: var(--glaphic-semantic-success-text, #3d8b0e);
      --glaphic-band-border: var(--glaphic-semantic-success-text, #3d8b0e);
      --glaphic-band-border-width: var(--glaphic-border-width-sm, 1px);
    }
    :host([tone='neutral']) {
      --glaphic-band-surface: var(--glaphic-neutral-grey-cool-50, #f4f3f7);
      --glaphic-band-ink: var(--glaphic-neutral-grey-cool-600, #686474);
      --glaphic-band-border: var(--glaphic-neutral-grey-cool-600, #686474);
      --glaphic-band-border-width: var(--glaphic-border-width-sm, 1px);
    }
    :host([tone='muted']) {
      --glaphic-band-surface: var(--glaphic-neutral-paper-deep, #e9ede0);
      --glaphic-band-ink: var(--glaphic-neutral-grey-cool-600, #686474);
      --glaphic-band-border: var(--glaphic-neutral-grey-cool-400, #9d99ab);
      --glaphic-band-border-width: var(--glaphic-border-width-sm, 1px);
    }
    /* size ladder — the sheet's four heights and label steps. The keyline
       is an INSIDE rule: a border-box border of the token width */
    :host {
      width: 100%;
      height: var(--glaphic-band-display-height, 120px);
    }
    :host([size='compact']) { height: var(--glaphic-band-compact-height, 81px); }
    :host([size='small']) { height: var(--glaphic-band-small-height, 73px); }
    :host([size='thin']) { height: var(--glaphic-band-thin-height, 36px); }
    /* the compact step's label ink is paper-deep in the sheet (the
       slimmer brand band read) — the display/small/thin steps take
       their tone's ink unchanged */
    :host([size='compact']) {
      --glaphic-band-ink: var(--glaphic-neutral-paper-deep, #e9ede0);
      --glaphic-band-label-size: var(--glaphic-band-compact-label-size, 16px);
    }
    :host([size='small']) {
      --glaphic-band-label-size: var(--glaphic-band-small-label-size, 12px);
    }
    :host([size='thin']) {
      --glaphic-band-label-size: var(--glaphic-band-thin-label-size, 10px);
    }
    /* vertical: the solid bands turned 90° — the cross on the width,
       the run on the height, the label rotated to read top-to-bottom */
    :host([axis='vertical']) {
      width: var(--glaphic-band-display-height, 120px);
      height: 100%;
    }
    :host([axis='vertical'][size='compact']) { width: var(--glaphic-band-compact-height, 81px); }
    :host([axis='vertical'][size='small']) { width: var(--glaphic-band-small-height, 73px); }
    :host([axis='vertical'][size='thin']) { width: var(--glaphic-band-thin-height, 36px); }
    :host([axis='vertical']) .label {
      writing-mode: vertical-rl;
    }
    /* the grid substrate — 8 × 4 one-fr tracks, both counts Tier-2
       (repeat() takes the substituted number). border-box keeps the
       tracks inside the padded box (content-box would let the 88px
       of tracks ride 16px low). Rotated bands turn with the label's
       writing-mode: rows keep their block reading */
    .label {
      display: grid;
      box-sizing: border-box;
      grid-template-rows: repeat(var(--glaphic-band-content-rows, 8), 1fr);
      grid-template-columns: repeat(var(--glaphic-band-content-columns, 4), 1fr);
      height: 100%;
      padding: var(--glaphic-band-padding-y, 16px) var(--glaphic-band-padding-x, 20px);
    }
    /* the content is one placeable grid item — full span, block-
       centered, inline start by default (the sheet's centered read) */
    .content {
      grid-row: 1 / -1;
      grid-column: 1 / -1;
      justify-self: start;
      align-self: center;
      font-weight: 600;
      font-size: var(--glaphic-band-label-size);
      line-height: var(--glaphic-band-line-height, 1.2);
      letter-spacing: 0.6px;
      color: var(--glaphic-band-ink);
    }
  `;

  constructor() {
    super();
    this.tone = 'brand';
    this.size = 'display';
    this.axis = 'horizontal';
    this.multiply = true;
    this['content-row'] = 'all';
    this['content-column'] = 'all';
    this['content-align-inline'] = 'start';
    this['content-align-block'] = 'center';
  }

  render() {
    /* grid-line track math: 'all' spans end to end; '3' is the third
       track; '7-8' is start track 7 to end track 9. Anything else is
       ill-formed and falls back to the full span */
    const trackRange = (value: string, fallback: string): string => {
      const raw = (value ?? '').trim();
      if (!raw || raw === 'all') {
        return fallback;
      }
      const span = /^(\d+)\s*-\s*(\d+)$/.exec(raw);
      if (span) {
        const from = Math.max(1, Number(span[1]));
        const to = Math.max(from, Number(span[2]));
        return `${from} / ${to + 1}`;
      }
      const single = Number(raw);
      if (Number.isInteger(single) && single >= 1) {
        return `${single} / ${single + 1}`;
      }
      return fallback;
    };
    const fit = (value: string, fallback: string): string =>
      value === 'start' || value === 'center' || value === 'end' ? value : fallback;
    const placement = [
      `grid-row:${trackRange(this['content-row'], '1 / -1')}`,
      `grid-column:${trackRange(this['content-column'], '1 / -1')}`,
      `justify-self:${fit(this['content-align-inline'], 'start')}`,
      `align-self:${fit(this['content-align-block'], 'center')}`,
    ].join(';');
    return html`<div class="label" part="label">
      <div class="content" part="content" style=${placement}><slot></slot></div>
    </div>`;
  }
}

customElements.define('glaphic-band', GlaphicBand);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-band': GlaphicBand;
  }
}