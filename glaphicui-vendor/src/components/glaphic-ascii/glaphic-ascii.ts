import { LitElement, css, html } from 'lit';

/* ────────────────────────────────────────────────────────────────
   glaphic-ascii — the text-frame cycle machine: an array of ASCII
   frames stacked in one shared inline-grid cell, each frame's span
   owning one step of a generated step-end cycle (the span shows for
   its own step, hides until the loop wraps) — a pure-CSS figure that
   types, glitches, bursts. The site's landing story rows read it as
   the asteroid shell's rise/burst and the 2012→C0DE job ticker.

   Content: the `frames` array property (set imperatively — JSX
   attributes can't carry arrays; the marquee precedent). Frame data
   is CONTENT and lives with the page; the machine is generic here.

   The cycle: count plus 2 steps — every frame's delay is its index
   times the step, and the LAST span runs a hold keyframe that keeps
   the final frame visible for three steps, so the figure rests one
   beat before the loop restarts (the landing's proven hold trick,
   generalized: the keyframes are GENERATED per mount because a
   9-frame burst and a 31-frame ticker can't share hardcoded
   percentages — the shared set desynced the job's loop back when
   both rode one page stylesheet. Names are per-mount unique
   (ascending module counter, never tag-derived), which also keeps
   two instances' generated percentages from ever meeting).

   Weighted dwells: the optional `dwells` array gives frames their own
   step counts (one positive number per frame) — a glitch frame
   riding 0.4 flashes for under half a step while the stable figure
   holds its full beats. Unset, every cycle keeps exactly the old
   count-shape, so the ticker and the burst widget never move.

   Speed and type: --glaphic-ascii-step per frame (0.2s) and
   --glaphic-ascii-type font size (48px) — percent-based scaling is a
   later iteration; the knobs exist so it can bolt on without edits.

   The box: one frame container look on a shadow-internal .frame (the
   host itself is display: contents — outer-tree rules like Tailwind's
   preflight border reset match the HOST and beat :host rules, so no
   paint lives on :host that anything could out-cascade). Mono
   (--glaphic-font-family-mono, the site's loaded IBM Plex Mono) at
   -type, line-height 1.3, width 7ch; inks via --glaphic-ascii-frame-ink
   (2px border, #A6022A) and --glaphic-ascii-frame-surface
   (#14F1C8), the host's white glyphs reading as holes through the
   multiply blend the paper overprints with. The drop-build (the
   landed box-shadow ladder growing 1 to 12px in steps, once, 0.45s
   after a 0.15s beat) is the component's own moved-in choreography —
   the page no longer carries a grow-drop.

   Reduced motion: the cycle parks ON the final frame (no flip), and
   the drop-build runs 1ms with the same fill — everything at rest
   the instant it lands, no keyframe-parked styles dropped.
   ──────────────────────────────────────────────────────────────── */

/** per-mount keyframe identity — increments every construction, so
    two mounted instances always generate two names (never constants
    derived from the tag: two frames counts in one document is the
    exact desync bug this exists to kill) */
let mountCounter = 0;

export class GlaphicAscii extends LitElement {
  static properties = {
    /** the ASCII frames (array of strings, multi-line via real newlines) */
    frames: { type: Array },
    /** per-frame dwell weights in steps — same length as frames, all
        positive; unweighted cycles leave it unset so the shared
        flip keyframes still drive every span identically */
    dwells: { type: Array },
    /** the image's description — reflects to the host's aria-label */
    label: { type: String, reflect: true, attribute: 'aria-label' },
  };
  declare frames: string[];
  declare dwells: number[] | undefined;
  declare label: string;
  /** this mount's generated keyframe suffix; internal, not an API */
  declare mountUid: number;
  /** the cycle's shape logs once per mount — the two timing engines
      look identical in markup, so the console line is how a silent
      fallback would show */
  private loggedCycle = false;

  constructor() {
    super();
    this.mountUid = ++mountCounter;
    this.frames = [];
    this.dwells = undefined;
    this.label = 'ASCII animation';
  }

  override connectedCallback() {
    super.connectedCallback();
    // the host element IS the image identity — role lives here once for
    // library users; page hydrating through preact must ALSO put role in
    // its vnode (preact's hydration strips self-set attributes not in it)
    this.setAttribute('role', 'img');
  }

  /** the frames, guarded: only string frames render */
  private get frameList(): string[] {
    if (this.frames == null) return [];
    if (!Array.isArray(this.frames)) {
      console.warn('[glaphic-ascii] frames must be an array of strings — got', typeof this.frames);
      return [];
    }
    return this.frames.filter((f) => typeof f === 'string');
  }

  /** dwell weights, guarded: one positive finite number per frame, or
      the whole array is ignored (a partial weight list would desync the
      keyframes against the visible frame order) */
  private get dwellList(): number[] | null {
    if (this.dwells == null) return null;
    const ok =
      Array.isArray(this.dwells) &&
      this.dwells.length === this.frameList.length &&
      this.dwells.every((d) => typeof d === 'number' && Number.isFinite(d) && d > 0);
    if (!ok) {
      console.warn('[glaphic-ascii] dwells must be one positive number per frame — ignoring', this.dwells);
      return null;
    }
    return this.dwells;
  }

  /**
   * The per-mount cycle CSS, generated (not static): the keyframe
   * percentages depend on the frame count, and counts differ between
   * instances — one shared stylesheet would desync exactly the way
   * the landing's old spark generator documented. Reduced motion
   * lives INSIDE this sheet so it lands after the assignments and
   * wins the cascade (static-sheet reduce would be shadowed by the
   * per-mount style element that follows it).
   */
  private get cycleCss(): string {
    const count = this.frameList.length;
    if (count === 0) return '';
    const dwells = this.dwellList;
    const sum = dwells ? dwells.reduce((a, b) => a + b, 0) : count;
    const n = sum + 2; // the final frame holds two extra steps
    const uid = String(this.mountUid);
    const base = [
      'span {',
      '  animation-duration: calc(var(--glaphic-ascii-step) * ' + String(n) + ');',
      '  animation-timing-function: step-end;',
      '  animation-iteration-count: infinite;',
      '}',
    ];
    if (!dwells) {
      // the unweighted cycle: one shared flip per frame count — today's
      // shape, kept byte-compatible for consumers that set frames only
      const flip = 'ascii-flip-' + uid;
      const hold = 'ascii-hold-' + uid;
      return [
        '@keyframes ' + flip + ' {',
        '  0% { visibility: visible; }',
        '  ' + (100 / n).toFixed(3) + '% { visibility: hidden; }',
        '}',
        '@keyframes ' + hold + ' {',
        '  0% { visibility: visible; }',
        '  ' + ((3 / n) * 100).toFixed(3) + '% { visibility: hidden; }',
        '}',
      ].concat(base, [
        'span {',
        '  animation-name: ' + flip + ';',
        '  animation-delay: calc(var(--i) * var(--glaphic-ascii-step));',
        '}',
        'span:last-child { animation-name: ' + hold + '; }',
        '@media (prefers-reduced-motion: reduce) {',
        '  span { animation: none !important; }',
        '  span:last-child { visibility: visible; }',
        '}',
      ]).join('\n');
    }
    // the weighted cycle: each span carries its own flip keyframes, and
    // its name + delay ride inline (inline beats any :last-child sheet
    // rule, so the reduced-motion kill needs the !important above)
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const d = dwells[i] ?? 1;
      out.push(
        '@keyframes ascii-flip-' + uid + '-' + String(i) + ' {',
        '  0% { visibility: visible; }',
        '  ' + ((d / n) * 100).toFixed(3) + '% { visibility: hidden; }',
        '}',
      );
    }
    const lastDwell = dwells[count - 1] ?? 1;
    out.push(
      '@keyframes ascii-hold-' + uid + ' {',
      '  0% { visibility: visible; }',
      '  ' + (((lastDwell + 2) / n) * 100).toFixed(3) + '% { visibility: hidden; }',
      '}',
    );
    out.push(...base);
    out.push(
      '@media (prefers-reduced-motion: reduce) {',
      '  span { animation: none !important; }',
      '  span:last-child { visibility: visible; }',
      '}',
    );
    return out.join('\n');
  }

  static styles = css`
    :host {
      /* knob defaults live on the HOST (not .frame): an inline author set
         on the element wins against these and inherits into the frame —
         defaults on .frame itself would win the inheritance race instead */
      --glaphic-ascii-step: 0.2s;
      --glaphic-ascii-type: 48px;
      /* the host dissolves into the page's inline slot exactly where the
         old spark span sat. The BOX paints on .frame, NOT here: outer-tree
         rules (Tailwind preflight's * border reset) match the host element
         and beat :host in the cascade — shadow-internal paint can't be
         out-cascaded (the marquee/pool-menu paint convention) */
      display: contents;
    }
    .frame {
      display: inline-grid;
      align-items: end;
      width: 7ch;
      box-sizing: border-box;
      /* the mono token resolves once per page (tokens.css) — a set value
         REPLACES this ladder entirely. The token's current companion is a
         proportional "sans-serif" generic, and IBM Plex Mono lacks the
         block glyphs (█) the site feeds it: they fell to a proportional
         system face at ~1.67× the column and painted straight through
         this 7ch border (2026-10-29 overflow diagnosis). Trailing the
         stack with a TRUE mono generic means whatever the token carries,
         every glyph it leaves behind still lands on the monospaced grid */
      font-family: var(--glaphic-font-family-mono, ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace), monospace;
      line-height: 1.3;
      font-size: var(--glaphic-ascii-type);
      /* white multiplies to identity: the frame glyphs read as holes
         in the overprint — the landing's look, moved in whole */
      color: white;
      vertical-align: bottom;
      border-radius: 2px;
      border: 2px solid var(--glaphic-ascii-frame-ink, #A6022A);
      background-color: var(--glaphic-ascii-frame-surface, #14F1C8);
      mix-blend-mode: multiply;
      /* the drop-build: the same 1 to 12px stepped shadow ladder the
         page's drop-grow ran — one grow, once, after a 0.15s beat */
      animation: glaphic-ascii-drop 0.45s cubic-bezier(0.3, 1.3, 0.45, 1) 0.15s both;
    }
    span {
      grid-area: 1 / 1;  /* all frames share ONE cell */
      align-self: end;   /* the caret row always sits on the box floor */
      white-space: pre;
      visibility: hidden;
    }
    /* the shadow ladder — moved from landing.css's drop-grow verbatim:
       0% is empty on purpose (the grow starts from the box's own bare
       edge and the tiers land at 1/2/4/7/12px) */
    @keyframes glaphic-ascii-drop {
      0% {
        /* empty on purpose: the grow starts from the element's own base
           (no shadow) and builds from there */
      }
      8.3% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 1px 1px 0 rgba(13, 2, 33, 0.56), 1px 1px 0 rgba(13, 2, 33, 0.48), 1px 1px 0 rgba(13, 2, 33, 0.40), 1px 1px 0 rgba(13, 2, 33, 0.32);
      }
      16.6% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 2px 2px 0 rgba(13, 2, 33, 0.48), 2px 2px 0 rgba(13, 2, 33, 0.40), 2px 2px 0 rgba(13, 2, 33, 0.32);
      }
      24.9% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 3px 3px 0 rgba(13, 2, 33, 0.48), 3px 3px 0 rgba(13, 2, 33, 0.40), 3px 3px 0 rgba(13, 2, 33, 0.32);
      }
      33.2% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 4px 4px 0 rgba(13, 2, 33, 0.40), 4px 4px 0 rgba(13, 2, 33, 0.32);
      }
      41.5% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 5px 5px 0 rgba(13, 2, 33, 0.40), 5px 5px 0 rgba(13, 2, 33, 0.32);
      }
      49.8% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 6px 6px 0 rgba(13, 2, 33, 0.40), 6px 6px 0 rgba(13, 2, 33, 0.32);
      }
      58.1% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 7px 7px 0 rgba(13, 2, 33, 0.32);
      }
      66.4% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 8px 8px 0 rgba(13, 2, 33, 0.32);
      }
      74.7% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 9px 9px 0 rgba(13, 2, 33, 0.32);
      }
      83% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 10px 10px 0 rgba(13, 2, 33, 0.32);
      }
      91.3% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 11px 11px 0 rgba(13, 2, 33, 0.32);
      }
      100% {
        box-shadow: 1px 1px 0 rgba(13, 2, 33, 0.64), 2px 2px 0 rgba(13, 2, 33, 0.56), 4px 4px 0 rgba(13, 2, 33, 0.48), 7px 7px 0 rgba(13, 2, 33, 0.40), 12px 12px 0 rgba(13, 2, 33, 0.32);
      }
    }
    /* reduced motion on the frame's build: the same 1ms-with-fill idiom
       the page carried — parked at the full ladder, nothing dropped */
    @media (prefers-reduced-motion: reduce) {
      .frame {
        animation-duration: 1ms;
        animation-delay: 0s;
      }
    }
  `;

  /** one line of mount facts per instance: frames, total steps, tempo —
      the diagnostic for a weighted cycle that fell back to uniform */
  private noteCycle(count: number, steps: number, weighted: boolean): void {
    if (this.loggedCycle || count === 0) return;
    this.loggedCycle = true;
    const raw = getComputedStyle(this)
      .getPropertyValue('--glaphic-ascii-step')
      .trim();
    const step = raw || '0.2s';
    const seconds = Math.round(steps * (parseFloat(step) || 0.2) * 10) / 10;
    console.info('[glaphic-ascii] cycle: ' + String(count) + ' frames over ' +
      String(Math.round(steps * 10) / 10) + ' steps at ' + step + ' ≈ ' + String(seconds) +
      's (' + (weighted ? 'weighted' : 'uniform') + ')');
  }

  protected render() {
    const dwells = this.dwellList;
    const count = this.frameList.length;
    if (dwells == null || count === 0) {
      // the unweighted machine stays exactly as it rendered before:
      // every span rides the shared flip at its index step
      this.noteCycle(count, count + 2, false);
      return html`
        <style>${this.cycleCss}</style>
        <div class="frame" part="box">
          ${this.frameList.map((text, i) => html`<span part="frame" style="--i: ${i}">${text}</span>`)}
        </div>
      `;
    }
    const uid = String(this.mountUid);
    const last = count - 1;
    let at = 0; // each span's delay walks the dwell sum forward
    this.noteCycle(count, dwells.reduce((a, b) => a + b, 0) + 2, true);
    const spans = this.frameList.map((text, i) => {
      const name = i === last
        ? 'ascii-hold-' + uid
        : 'ascii-flip-' + uid + '-' + String(i);
      const style = '--i: ' + String(i) +
        '; animation-name: ' + name +
        '; animation-delay: calc(var(--glaphic-ascii-step) * ' + String(at) + ')';
      at += dwells[i] ?? 1;
      return html`<span part="frame" style="${style}">${text}</span>`;
    });
    return html`
      <style>${this.cycleCss}</style>
      <div class="frame" part="box">
        ${spans}
      </div>
    `;
  }
}

customElements.define('glaphic-ascii', GlaphicAscii);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-ascii': GlaphicAscii;
  }
}