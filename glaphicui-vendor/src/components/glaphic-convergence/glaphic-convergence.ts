import { css, html } from 'lit';
import { GlaphicLightElement } from '../../base/light-dom.js';
import { glaphicMoveChildren } from '../../base/move-children.js';

/** the travel axes — the attribute's legal values */
export type ConvergenceAxis = 'diagonal' | 'horizontal' | 'vertical';
const AXES: Record<ConvergenceAxis, true> = {
  diagonal: true,
  horizontal: true,
  vertical: true,
};

const hostStyles = css`
  glaphic-convergence {
    /* the travel var — derived from the published progress (0.5 =
       converged; the section's center crossing). Runs +1 → −1 over
       the transit, CLAMPED to the middle 80% of it: the plates are
       fully OFF the section for the outer 10% at each end (p ≤ 0.1
       and p ≥ 0.9), so there is a scroll range with no bars at all
       before they arrive and after they leave */
    /* the DWELL — the plates HOLD unified across the middle of the
       transit: the travel's input u = 0.5 − progress is flattened to
       0 while |u| ≤ the dwell and the remaining stretch renormalizes
       (÷ the dwell-less window) so the plates still park exactly at
       the dead zone's edge (|u| = 0.4, p = 0.1 / 0.9). The hold keeps
       the coincidence — the third color and the copy at full
       strength — while the scroll passes through, then slack back to
       the shaped travel by the parked ends. Capped at 0.35: the fly
       needs room (divisor floor) */
    --glaphic-convergence-dwell-clamped: clamp(
      0,
      var(--glaphic-convergence-dwell, 0.2),
      0.35
    );
    --glaphic-convergence-travel: calc(
      clamp(
        0,
        (
            abs(0.5 - var(--glaphic-convergence-progress, 0.5)) -
              var(--glaphic-convergence-dwell-clamped, 0)
          ) /
          (0.4 - var(--glaphic-convergence-dwell-clamped, 0)),
        1
      ) *
        clamp(
          -1,
          (0.5 - var(--glaphic-convergence-progress, 0.5)) * 4000,
          1
        )
    );
    /* the shaped travel — an inverted ease-in-ease-out (v·|v|, the
       mirrored ease): fast at the visible edges — the plates whip in
       and out — and gliding through the meet, where the copy dwells.
       The published -progress stays the true scroll fraction */
    --glaphic-convergence-move: calc(
      var(--glaphic-convergence-travel) * abs(var(--glaphic-convergence-travel))
    );
    /* the park distance — one full card PLUS the meet seat, so the
       seat offsets never poke a parked plate back into the box (a
       plate parked exactly its seat over would return a 2px sliver at
       the dead zone's edge); % in a translate resolves against the
       plate's own box = exactly the card */
    --glaphic-convergence-fly: calc(100% + var(--glaphic-convergence-meet-offset, 2px));
    /* the rig's own blend group — the cold plate's multiply prints
       against the hot plate INSIDE the group (the film button's
       rule); without it the wash would multiply the page too */
    isolation: isolate;
    display: block;
    position: relative;
    /* a TEXT HOLDER, not a full-bleed band — card-sized by default,
       centered; the consumer owns the layout around it */
    max-width: var(--glaphic-convergence-width, 480px);
    margin: 0 auto;
    min-height: var(--glaphic-convergence-height, calc(var(--hz, 18px) * 12));
  }
  /* accessibility mode — motion reduced: freeze the rig converged;
     the plates seat hot-above-cold and the copy stands fully
     revealed permanently (the scroll listeners idle: the JS tick
     checks the same media query) */
  @media (prefers-reduced-motion: reduce) {
    glaphic-convergence {
      --glaphic-convergence-travel: 0;
    }
  }
`;

const innerStyles = css`
  /* the two overprint plates — hot/cold films at the film button's
     strength, square-edged, each the holder's OWN box. They park one
     full card over, just past the card's edge — nothing clips them
     (Eliot unclipped the rig: the overflow hidden ate the mid-fly
     sweep and the plates read as appearing at random), so the flight
     is visible the whole way, overprinting the page outside the
     holder. The park is only reached in the travel's dead zone
     (|u| ≥ 0.4, p ≤ 0.1 / ≥ 0.9), when the section is almost out of
     the viewport and the one-card-over park sits past it. The travel
     translates them through: in from one side each, full overlap AT
     the meet, then cross past and out the far side. A card-sized
     flight means a square edge sweeping straight across the card —
     they move corner-first, they don't grow or slant. Translates are
     in % of the plate's own box = exactly the card, so ±100% is one
     full card over */
  glaphic-convergence .plate {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  glaphic-convergence .hotplate {
    background: var(--glaphic-convergence-hot, color-mix(in srgb, var(--hot, #E03A0B) 80%, transparent));
    /* diagonal: parked bottom-left (one card down, one card left),
       flies up-right through the meet, out the top-right */
    transform: translate(
      calc(var(--glaphic-convergence-move) * -100%),
      calc(var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) - var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  glaphic-convergence .coldplate {
    background: var(--glaphic-convergence-cold, color-mix(in srgb, var(--cold, #0780B8) 80%, transparent));
    /* the overprint — the spec's third color: the cold film
       multiplies the hot plate wherever both cover (the film
       button's f2 rule, sealed by the rig's isolate group) */
    mix-blend-mode: var(--blend, multiply);
    /* diagonal: parked bottom-right, flies up-left, out the
       top-left */
    transform: translate(
      calc(var(--glaphic-convergence-move) * 100%),
      calc(var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) + var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  /* travel: horizontal — hot in from the left and out the right,
     cold in from the right and out the left; the meet keeps the
     vertical seat */
  glaphic-convergence[axis='horizontal'] .hotplate {
    transform: translate(
      calc(var(--glaphic-convergence-move) * -100%),
      calc(-1 * var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  glaphic-convergence[axis='horizontal'] .coldplate {
    transform: translate(
      calc(var(--glaphic-convergence-move) * 100%),
      var(--glaphic-convergence-meet-offset, 2px)
    );
  }
  /* vertical: hot rises (in from the bottom, out the top), cold
     descends */
  glaphic-convergence[axis='vertical'] .hotplate {
    transform: translate(
      0,
      calc(var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) - var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  glaphic-convergence[axis='vertical'] .coldplate {
    transform: translate(
      0,
      calc(-1 * var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) + var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  /* the UNIFY MASK — Eliot's mechanic for the copy: the text prints
     ONLY in the unified region, the two plates' intersection (the
     film's print-where-they-coincide read). The reveal rides hot and
     the plates' delta is translate-invariant, so the intersection
     window is expressed right in the reveal's own frame:
     · x — the window opens as |move| → 0 (the plates close to the
       meet) and closes again past it: fully masked once |move| ≥ 0.5
       (in / out of the transit, the copy doesn't fly on its own);
     · y — the meet seat (hot above, cold below) leaves a 2×offset
       sliver at the top un-unified (invisible at the default 2px
       seat; the film's exact read).
     Two mask layers (the x window + the y window), INTERSECTED — the
     vertical axis swaps which window rides the travel, because its
     cold plate's delta is the y side (−2·move·fly + the seat). The
     mask is VISUAL ONLY: the copy stays in the accessibility tree
     the whole way through (a mask moves paint, not the AX tree),
     and prefers-reduced-motion lifts it (the freeze seats the plates
     unified and the copy stands fully revealed) */
  glaphic-convergence .reveal {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font: var(--t-body, 400 13.5px/1.45 var(--f-body, 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif));
    color: var(--glaphic-convergence-ink, var(--diff, #B4B4B4));
    -webkit-mask-image:
      linear-gradient(
        to right,
        transparent clamp(0%, calc(var(--glaphic-convergence-move) * 200%), 100%),
        #000 clamp(0%, calc(var(--glaphic-convergence-move) * 200%), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-move) * 200%), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-move) * 200%), 100%)
      ),
      linear-gradient(
        to bottom,
        transparent clamp(0%, calc(var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        #000 clamp(0%, calc(var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-meet-offset, 2px) * 2), 100%)
      );
    -webkit-mask-composite: source-in;
    mask-image:
      linear-gradient(
        to right,
        transparent clamp(0%, calc(var(--glaphic-convergence-move) * 200%), 100%),
        #000 clamp(0%, calc(var(--glaphic-convergence-move) * 200%), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-move) * 200%), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-move) * 200%), 100%)
      ),
      linear-gradient(
        to bottom,
        transparent clamp(0%, calc(var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        #000 clamp(0%, calc(var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-meet-offset, 2px) * 2), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-meet-offset, 2px) * 2), 100%)
      );
    mask-composite: intersect;
    transform: translate(
      calc(var(--glaphic-convergence-move) * -100%),
      calc(var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) - var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  @media (prefers-reduced-motion: reduce) {
    glaphic-convergence .reveal {
      -webkit-mask-image: none;
      mask-image: none;
    }
  }
  glaphic-convergence[axis='horizontal'] .reveal {
    transform: translate(
      calc(var(--glaphic-convergence-move) * -100%),
      calc(-1 * var(--glaphic-convergence-meet-offset, 2px))
    );
  }
  /* vertical — the cold plate's delta rides the y side: the travel
     window moves to the mask's y layer (−2·move·fly + the seat) and
     the x layer stays open */
  glaphic-convergence[axis='vertical'] .reveal {
    transform: translate(
      0,
      calc(var(--glaphic-convergence-move) * var(--glaphic-convergence-fly) - var(--glaphic-convergence-meet-offset, 2px))
    );
    --glaphic-convergence-y-delta: calc(
      var(--glaphic-convergence-move) * (100% + var(--glaphic-convergence-meet-offset, 2px)) * -2 +
        var(--glaphic-convergence-meet-offset, 2px) * 2
    );
    -webkit-mask-image:
      linear-gradient(to right, #000, #000),
      linear-gradient(
        to bottom,
        transparent clamp(0%, var(--glaphic-convergence-y-delta), 100%),
        #000 clamp(0%, var(--glaphic-convergence-y-delta), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-y-delta)), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-y-delta)), 100%)
      );
    -webkit-mask-composite: source-in;
    mask-image:
      linear-gradient(to right, #000, #000),
      linear-gradient(
        to bottom,
        transparent clamp(0%, var(--glaphic-convergence-y-delta), 100%),
        #000 clamp(0%, var(--glaphic-convergence-y-delta), 100%),
        #000 clamp(0%, calc(100% + var(--glaphic-convergence-y-delta)), 100%),
        transparent clamp(0%, calc(100% + var(--glaphic-convergence-y-delta)), 100%)
      );
    mask-composite: intersect;
  }
`;

/**
 * glaphic-convergence — scroll-converged overprint plates (the MEET
 * section treatment). Two transparent bars, one hot + one cold by
 * default: hot slides in from the bottom-left, cold from the
 * bottom-right; the two converge as the section approaches its
 * viewport-center crossing (full convergence AT the crossing), then
 * hot exits to the top-right and cold to the top-left as the section
 * scrolls away. Slotted copy is LOCKED to the hot plate — it rides
 * the hot film exactly the film button's label rides its film,
 * legible only where hot's square is (it flies in with the film and
 * paints above the cold plate, never multiplied under it).
 *
 * LIGHT DOM (base/light-dom rule): the plates overprint against the
 * page — a shadow root is a blend-isolation boundary and the
 * alpha-stack must composite there.
 *
 * Scroll-link, transform-only: one rAF-throttled scroll/resize
 * listener computes the progress (0 = section top enters the
 * viewport, 0.5 = center crossing, 1 = section bottom leaves) and
 * writes it as a custom property; plates and unify mask move in pure
 * CSS calc from that var — no reflow, no Lit rerender. `hold` turns the
 * scroll link off: the progress var is then the consumer's (static
 * states, tests).
 *
 * axis — the travel: 'diagonal' (default, the pitch as pitched) |
 * 'horizontal' (the crossing flattened — hot in left/out right, cold
 * in right/out left) | 'vertical' (stood up — hot rises, cold
 * descends). Every axis seats the meet vertically offset (hot above,
 * cold below — the film button's stacked-plate read). The plates are
 * SQUARE-EDGED, each one the holder's own box: at the travel's dead
 * zones they sit parked one full card over, just beyond the card's
 * edges — reached only while the section is almost out of the
 * viewport (p ≤ 0.1 / p ≥ 0.9), when the one-card-over park sits
 * past it — and the shaped travel translates them through: a square
 * edge sweeps straight across the card. NOTHING CLIPS the fly
 * (Eliot unclipped the rig — the old overflow: hidden ate the plates
 * mid-sweep and they read as appearing at random): the plates
 * overprint the page outside the holder the whole way through. They
 * fly together, coincide exactly at the meet (the full overlap
 * prints the third color) and fly on apart. The travel is clamped to
 * the middle 80% of the progress window (the plates are fully OFF
 * the section for the outer 10% at each end — there is a stretch of
 * scroll with no bars at all on both sides of the meet) and shaped
 * as an inverted ease-in-ease-out: fast at the visible edges,
 * gliding through the meet. The DWELL holds the unified composition:
 * the transit's middle (--glaphic-convergence-dwell, default 0.2 — a
 * fifth of the progress window) keeps the plates held at the meet
 * while the scroll passes through, then slack back to the shaped
 * travel (capped at 0.35 — the fly needs room).
 *
 * THE COPY PRINTS ONLY IN THE UNIFIED REGION: the reveal carries a
 * mask layer tracking the plates' intersection (the film's
 * print-where-they-coincide read), so the text appears as the plates
 * unify and vanishes as they part. Eliot directed the mask here
 * explicitly (the band's no-masks directive doesn't extend to this).
 * It is VISUAL ONLY — the copy stays in the accessibility tree the
 * whole way through (a mask moves paint, not the AX tree); under
 * prefers-reduced-motion the mask lifts (the freeze seats the plates
 * unified and the copy stands fully revealed permanently).
 *
 * Content: a default slot — body copy is the intended payload (the
 * body voice and --glaphic-convergence-ink are the default voice);
 * the consumer owns the layout around it.
 *
 * Sizing: a fancy animated text HOLDER, not a full-bleed band —
 * card-sized by default (max-width --glaphic-convergence-width,
 * default 480px) and centered by auto margins; the consumer owns
 * the layout around it.
 *
 * Accessibility: the copy is always exposed to the accessibility
 * tree — a transform moves PIXELS, not the AX tree, so screen readers
 * read the slotted copy the whole way through regardless of where
 * the reveal currently rides (the plates are aria-hidden). Under
 * prefers-reduced-motion the rig freezes converged (plates seated,
 * copy centered, permanently) and the scroll write goes idle; the
 * same holds whenever the component is not scrolling — `hold` is the
 * manual equivalent.
 *
 * Tier-2: --glaphic-convergence-hot · -cold (plate films, default
 *         80% — the film button's strength) · -ink · -height ·
 *         -width · -meet-offset (the converged plates' vertical
 *         seat; hot above, cold below — the film button's
 *         film-offset move, default 2px) · -dwell (the unified hold:
 *         the transit's middle that keeps the plates held at the
 *         meet, in progress units; clamped to 0.35 — the fly needs
 *         room; default 0.2) · -progress (state var;
 *         default 0.5 = converged, also the no-JS fallback)
 */
export class GlaphicConvergence extends GlaphicLightElement {
  static properties = {
    /** travel: 'diagonal' (default) | 'horizontal' | 'vertical' —
     *  unknown attribute values clamp to the default (the band's
     *  brackets converter pattern), so a typo'd axis can't produce
     *  a broken travel */
    axis: {
      converter: (v: string | null) => ((v ?? '') in AXES ? v : 'diagonal'),
      reflect: true,
    },
    /** the scroll link is off; --glaphic-convergence-progress is the
     *  consumer's (static states, tests) */
    hold: { type: Boolean, reflect: true },
  };
  declare axis: ConvergenceAxis;
  declare hold: boolean;

  static sheet = [hostStyles.styleSheet!, innerStyles.styleSheet!];

  constructor() {
    super();
    this.axis = 'diagonal';
    this.hold = false;
  }

  /** Content wrapper: children added after mount belong here. */
  get reveal(): Element | null {
    return this.querySelector('.reveal');
  }

  private captured: Node[] = [];
  private frame = 0;
  private queue = () => {
    if (!this.frame) {
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.tick();
      });
    }
  };

  connectedCallback() {
    super.connectedCallback();
    if (this.captured.length === 0 && this.childNodes.length > 0) {
      this.captured = [...this.childNodes];
      while (this.firstChild) this.removeChild(this.firstChild);
    }
  }

  protected override firstUpdated() {
    const movable = this.captured.filter(
      (n) => n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim() ?? '') !== '',
    );
    glaphicMoveChildren(this.renderRoot.querySelector('.reveal') as HTMLElement | null, movable);
    if (!this.hold) this.arm(true);
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('hold')) this.arm(!this.hold);
  }

  override disconnectedCallback() {
    this.arm(false);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    super.disconnectedCallback();
  }

  private arm(on: boolean) {
    if (on) {
      window.addEventListener('scroll', this.queue, { passive: true });
      window.addEventListener('resize', this.queue, { passive: true });
      // first paint: layout is ready next frame
      this.queue();
    } else {
      window.removeEventListener('scroll', this.queue);
      window.removeEventListener('resize', this.queue);
    }
  }

  /** progress 0 → 1 over the travel window: p=0 the section's top
   *  enters at the viewport's bottom edge, p=0.5 the center crossing,
   *  p=1 the bottom leaves the viewport's top edge (linear in the
   *  section's rect, so the crossing lands exactly on 0.5) */
  private tick() {
    if (!this.isConnected || this.hold) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // accessibility mode: the CSS freeze holds; no writes, no churn
      this.style.removeProperty('--glaphic-convergence-progress');
      return;
    }
    const rect = this.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    this.style.setProperty(
      '--glaphic-convergence-progress',
      (Number.isFinite(p) ? p : 0.5).toFixed(4),
    );
  }

  render() {
    return html`
      <i class="hotplate plate" aria-hidden="true"></i>
      <i class="coldplate plate" aria-hidden="true"></i>
      <div class="reveal"></div>
    `;
  }
}

customElements.define('glaphic-convergence', GlaphicConvergence);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-convergence': GlaphicConvergence;
  }
}