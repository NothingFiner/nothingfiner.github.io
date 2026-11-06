import { LitElement, css, html } from 'lit';

/* ────────────────────────────────────────────────────────────────
   glaphic-cursor-type — the terminal block-cursor typography
   (Eliot: "cursor type is also good both versions"). Text prints
   character by character behind a solid blinking BLOCK cursor —
   the cursor paints the character cell it sits on (the terminal
   read), never an alpha.

   Attributes:
   - text: the script to type (re-types on change)
   - word-mode: the print unit becomes the WORD — each word appears
     whole at its cell instead of letter by letter
   - speed: ms per print step, default 60
   - cursor-vanish: default FALSE — the block keeps blinking after
     the print finishes (the terminal convention). Set TRUE to zero
     the block's x-scale (transform: scaleX(0)) once the print
     completes — the cell stays in the row (the row's height never
     shifts), opt-in only, existing rows keep the block
   - replay(): re-runs the print from empty
   - Tier-2: --glaphic-cursor-type-ink (the text) ·
     -cursor-ink (the block — falls back to the TEXT ink, so the
     cursor and the words read one tone unless overridden) - the
     terminal's ~1Hz blink step is the treatment's own read, not a
     knob

   prefers-reduced-motion: the whole script prints at once and the
   cursor sits permanently lit (no blink). Otherwise the cursor
   blinks a 1s step while printing (flagged: the terminal convention
   keeps the block solid mid-print — the flag stays noted).
   ──────────────────────────────────────────────────────────────── */

const shadowStyles = css`
  :host {
    display: block;
    /* the mono voice, ink on paper — the terminal read */
    font: 400 13px / 1.6 var(--glaphic-font-family-mono, 'IBM Plex Mono', sans-serif);
    color: var(--glaphic-cursor-type-ink, var(--glaphic-ink-black, #0d0221));
    /* Tier-2 defaults; consumer inline overrides win.  The cursor
       ink falls back to the TEXT ink — one tone for words and
       block unless a consumer repaints the block alone */
    --glaphic-cursor-type-cursor-ink: var(--glaphic-cursor-type-ink, var(--glaphic-ink-black, #0d0221));
  }
  .row {
    white-space: pre-wrap;
  }
  /* the block cursor: one solid ink cell (0.6em wide = the mono
     advance), printed and blinking a 1s step while printing */
  .cursor {
    display: inline-block;
    width: 0.6em;
    height: 1.05em;
    vertical-align: middle;
    background: var(--glaphic-cursor-type-cursor-ink, var(--glaphic-cursor-type-ink, var(--glaphic-ink-black, #0d0221)));
    animation: glaphic-cursor-type-blink 1s steps(1) infinite;
    /* decorative — never a hit target, vanished or not */
    pointer-events: none;
  }
  @keyframes glaphic-cursor-type-blink {
    0%, 49.9% { background: var(--glaphic-cursor-type-cursor-ink, var(--glaphic-cursor-type-ink, var(--glaphic-ink-black, #0d0221))); }
    50%, 100% { background: transparent; }
  }
  /* cursor-vanish: the block drops out (display none flip — never a
     fade) once the print finishes; Eliot's alignment read (middle)
     keeps the row's line box either way */
  .cursor[hidden] {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .cursor {
      /* frozen: fully lit, no blink */
      animation: none;
    }
  }
`;

export class GlaphicCursorType extends LitElement {
  static properties = {
    text: { type: String, reflect: true },
    /** the print unit is the whole WORD (each drops in at its cell) */
    wordMode: { type: Boolean, reflect: true, attribute: 'word-mode' },
  /** ms per print step */
  speed: { type: Number },
  /** default FALSE — the block keeps blinking after the print ends;
      set TRUE to drop it once the print finishes. (A default-false
      attribute keeps the boolean-reflect trap away: a default-true
      reflected flag would rewrite itself into the attribute and beat
      a parent's ?attr=${false} binding.) */
  cursorVanish: { type: Boolean, reflect: true, attribute: 'cursor-vanish' },
  };
  declare text: string;
  declare wordMode: boolean;
  declare speed: number;
  declare cursorVanish: boolean;

  static styles = shadowStyles;

  private printTimer = 0;

  constructor() {
    super();
    this.text = '';
    this.wordMode = false;
    this.speed = 60;
    this.cursorVanish = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.printTimer) clearTimeout(this.printTimer);
  }

  updated(changed: Map<string, unknown>) {
    if (
      changed.has('text') ||
      changed.has('wordMode') ||
      changed.has('speed') ||
      changed.has('cursorVanish')
    ) {
      this.print();
    }
  }

  /** re-run the print from empty (the story's replay buttons) */
  replay() {
    this.print();
  }

  private print() {
    if (this.printTimer) clearTimeout(this.printTimer);
    const out = this.renderRoot.querySelector('.typed');
    if (!out) return;
    const cell = this.renderRoot.querySelector('.cursor') as HTMLElement | null;
    /* a fresh print relights the block (replay after a vanish run) */
    cell?.removeAttribute('hidden');
    const full = this.text;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const units = this.wordMode
      ? (full.match(/\S+\s*/g) ?? [])
      : [...full];
    /* cursor-vanish: the block drops out the moment the print ends — a
       display none flip, never a fade (the bottom-aligned block's line
       box holds either way). The printend dispatch survives the flip:
       the wipe's cover gate (and any timed-path consumer) reads it —
       dropping it arms the cover forever (the pass never exits) */
    const vanish = () => {
      if (this.cursorVanish) cell?.setAttribute('hidden', '');
      this.dispatchEvent(new CustomEvent('printend', { bubbles: true }));
    };
    if (reduced) {
      out.textContent = full;
      vanish();
      return;
    }
    out.textContent = '';
    let step = 0;
    const tick = () => {
      if (step >= units.length) {
        vanish();
        return; // default: the block keeps blinking at the end
      }
      out.append(units[step]);
      step += 1;
      this.printTimer = window.setTimeout(tick, Math.max(16, this.speed));
    };
    tick();
  }

  render() {
    return html`<span class="row"><span class="typed"></span><i class="cursor"></i></span>`;
  }
}

customElements.define('glaphic-cursor-type', GlaphicCursorType);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-cursor-type': GlaphicCursorType;
  }
}