import { css, html } from 'lit';
import { GlaphicLightElement } from '../../base/light-dom.js';
import '../glaphic-cursor-type/glaphic-cursor-type.js';

/* ────────────────────────────────────────────────────────────────
   glaphic-wipe — the SPA page transition: two plates enter from
   OPPOSITE edges, sweep across the viewport, and pass OVER each
   other — then keep going out the far sides, uncovering the new
   page as they leave. Nobody ever reverses.

   The rig is the pool's plate pair at viewport scale, split to its
   two films: the ink-brand-dark front plate (travels `direction`)
   and the ink-brand-fluro twin entering the opposite edge against
   it. Only the FRONT prints multiply — the red film lets the page
   show through it (the pool print), and where it crosses the opaque
   fluro twin, red × fluro prints the dark ink with the mint still
   visibly beneath. Nothing is transparent: translucency is
   multiply, per the look-physics directive (the twin is a solid
   plate, not an alpha card).

   The pass, for direction='right' (mirrored in every direction):
   1. enter — ONE CROSS into full coincidence the whole way: the red
      film sweeps in from the left, the fluro's from the right, the
      gap closing at the leg's half; from there the films OVERLAP
      (no antialiasing hairline) until they both ALIGN at the leg's
      end — both aligned, the red printed over the solid fluro,
   2. COVERED — and AT full coincidence the `covered` event fires.
      The coincidence seal is OPAQUE (an ink print over an ink
      print — the page is sealed out entirely), so the app's swap
      under it is invisible. The hold sits ON the print —
      (Eliot: the old push leg was the extra animation; the pass
      now crosses IN, pauses, then finishes — no middle leg);
   4. exit — the films KEEP GOING out the far sides: they pull
      apart the other way (the red ends up at the +travel edge, the
      fluro at the −travel edge — their sides swapped in passing),
      the ink unzips toward the center, a slit opens on the new
      page, and both films slide off the sides they settled on. The
      page is uncovered by the plates LEAVING, always decelerating.

   Travel: `direction` names the FRONT plate's travel — 'right'
   (default: red in from the left edge, fluro in from the right),
   'left', 'up' (red rises from the bottom, fluro descends from the
   top), 'down'. One travel unit vector drives the poses; the twin
   is the same formulas on the negated vector.

   THE CAPTION HOLD — a `caption` prop fills the covered hold (the
   full-overlap seal, where the swap already happened) with the
   WRITING: a glaphic-cursor-type writer (the terminal block-cursor
   voice, unblended paper ink like the pool's items — fully legible
   on the ink print, where paper-on-fluro never was) prints the
   caption character by character at --glaphic-wipe-type-cadence
   (60ms a step), the block cursor blinking the terminal's 1s step;
   after --glaphic-wipe-caption-dwell (600ms) the exit resumes ON
   ITS OWN — caption mode is self-driving, no release() required (a
   release() still cuts the hold short, and abort() still cancels;
   the author `dwell` is IGNORED in caption mode — a dwell timer
   armed at covered would cut the writing short mid-print).
   The caption prints ONLY while the write is on (the `writing`
   state mirrors it): the plates' writing attribute is hidden at
   idle/enter/push/exit, so the reveal never shows lingering copy.
   The caption's SEAT is the author's: --glaphic-wipe-caption-inline
   (the flex justify, default center) and --glaphic-wipe-caption-block
   (the flex align, default center) — flex keywords pass through, so
   flex-start/flex-end/anything justify takes works on either axis.
   With no caption the protocol is exactly the release-driven one.

   Motion: one full viewport in (park → seal), the
   the seal) and one viewport out (the seal → fully past the far
   edge) — two half travels each at --glaphic-wipe-motion with the
   enter eased in and the push/exit eased out, the legs chaining in
   the same frame whenever the hold's gate opens right away. With a
   caption the writing sits INSIDE that gate. `abort()` cancels a
   run: the films snap parked instantly (idle carries no transition
   — the parked poses only ever change under the running rules, so
   the jump can't sweep films through the screen). Reduced motion:
   every pose applies instantly — the protocol survives (covered
   still fires, release still resumes) and the reveal is a hard cut.

   Cover safety: while covered, BOTH plates take pointer events (the
   page under the swap is unreachable); throughout the sweep the
   plates ignore the pointer. The plates sit inside the host in
   LIGHT DOM (base/light-dom rule: the films must print against the
   page). Place the host at the top level of the app — a
   `position: fixed` element anchors to the viewport unless a
   transformed ancestor (filter, will-change, transform) contains it.

   Events: `covered` { direction } the cover is full ·
   `done` { direction } the reveal ended. Methods: run() (returns
   the cycle's promise, resolving at done), release(), abort().

   Tier-2 — --glaphic-wipe-surface (the front plate; ink-brand-dark)
   · -back-surface (the twin; ink-brand-fluro) · -offset (8px, the
   films' seal overlap at the coincidence — half the offset per
   film) · -motion (0.6s per half-viewport of travel; the exit runs
   at 2× = one viewport) · -enter-easing · -exit-easing · -z-index (the plates' z; raise it
   if the app stacks chrome above 9999999) · -caption-ink (the
   writer's ink — paper, above the plates) · -caption-size (16px) ·
   -type-cadence (60ms per character, the cursor-type speed) ·
   -caption-dwell (600ms the fully-written caption holds before the
   exit resumes on its own) · -caption-inline / -caption-block (the
   caption's seat — the flex justify/align pair, both centered by
   default)
   ──────────────────────────────────────────────────────────────── */

/** the travel — the attribute's legal values */
export type WipeDirection = 'left' | 'right' | 'up' | 'down';
const DIRECTIONS: Record<WipeDirection, true> = {
  left: true,
  right: true,
  up: true,
  down: true,
};

type WipePhase = 'idle' | 'enter' | 'covered' | 'push' | 'exit';

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const hostStyles = css`
  glaphic-wipe {
    display: block;
    /* the travel unit vector — the direction the film moves. The
       pose formulas read BOTH components, so 'up'/'down' just zero
       the x sign and take y (and the horizontal default stays 1/0) */
    --_travel-x: 1;
    --_travel-y: 0;
    --_offset: var(--glaphic-wipe-offset, 8px);
  }
  glaphic-wipe[direction='left'] {
    --_travel-x: -1;
    --_travel-y: 0;
  }
  glaphic-wipe[direction='up'] {
    --_travel-x: 0;
    --_travel-y: -1;
  }
  glaphic-wipe[direction='down'] {
    --_travel-x: 0;
    --_travel-y: 1;
  }
  /* the plates — the viewport-sized films. Fixed to the viewport
     (NOT the host), each an own blending layer, so their multiply
     composites against the page and against each other wherever
     they pass. Idle PARKS them just off OPPOSITE edges: the front
     one viewport out on its entry side, the twin one viewport out
     on the other — idle hides the plates anyway. The travel vector
     below is the FRONT plate's; the twin is the same formulas on
     the negated vector (its idle rule is +100%) */
  glaphic-wipe .plate {
    position: fixed;
    inset: 0;
    z-index: var(--glaphic-wipe-z-index, 9999999);
    pointer-events: none;
    visibility: hidden;
    translate: calc(var(--_travel-x) * -100%) calc(var(--_travel-y) * -100%);
  }
  glaphic-wipe .plate-front {
    background: var(--glaphic-wipe-surface, var(--glaphic-ink-brand-dark, #a6022a));
    /* the blend rides the TOP plate only: the red prints over
       whatever is beneath it — the page tints through the film, and
       at the cross it multiplies into the opaque twin (the ink
       print). The twin below is a solid fluro plate */
    mix-blend-mode: multiply;
  }
  glaphic-wipe .plate-back {
    /* the twin — parked one full viewport out the FAR side, entering
       against the front's travel */
    background: var(--glaphic-wipe-back-surface, var(--glaphic-ink-brand-fluro, #14f1c8));
    translate: calc(var(--_travel-x) * 100%) calc(var(--_travel-y) * 100%);
  }
  /* ENTER — the ONE CROSS: park → FULL COINCIDENCE in a single leg
     (one viewport of travel per film), the films accelerating into
     the meet and — from the meet on — OVERLAPPING (their edge passes
     the twin's at the leg's half, so no antialiasing hairline ever
     prints) until they ALIGN: the opaque ink seal. COVERED — the
     hold on the seal: the pose stands (no transition of its own; the
     exit's rule carries the next move) */
  glaphic-wipe[phase='enter'] .plate {
    visibility: visible;
    transition: translate var(--glaphic-wipe-motion, 0.6s)
      var(--glaphic-wipe-enter-easing, cubic-bezier(0.42, 0, 1, 1));
  }
  glaphic-wipe[phase='enter'] .plate {
    translate: 0 0;
  }
  glaphic-wipe[phase='covered'] .plate {
    visibility: visible;
    translate: 0 0;
  }
  /* the covered hold: the seal blankets the page — both films take
     the pointer so the swap can't be clicked through; the enter sweep
     never blocks */
  glaphic-wipe[phase='covered'] .plate {
    pointer-events: auto;
  }
  /* EXIT — keep going, each film on its own heading: they pull
     apart the other way — the red ends up at the +travel edge, the
     fluro at the −travel edge, their sides swapped in passing — the
     ink unzips toward the center, the middle slit opens the new
     page, and both films slide off the sides they settled on. The
     leg is one viewport per film (2× the motion), easing out — the
     films decelerate as the page is uncovered */
  glaphic-wipe[phase='exit'] .plate {
    visibility: visible;
    transition: translate calc(var(--glaphic-wipe-motion, 0.6s) * 2)
      var(--glaphic-wipe-exit-easing, cubic-bezier(0, 0, 0.58, 1));
  }
  glaphic-wipe[phase='exit'] .plate-front {
    translate: calc(var(--_travel-x) * 100%) calc(var(--_travel-y) * 100%);
  }
  glaphic-wipe[phase='exit'] .plate-back {
    translate: calc(var(--_travel-x) * -100%) calc(var(--_travel-y) * -100%);
  }
  /* the caption — the cursor-type writer printed centered above the
     plates, UNBLENDED paper (the pool's items read). It shows only
     while the hold writes (the 'writing' state); idle/enter/exit
     hide it so the reveal never shows lingering copy. The writer's
     ink var is re-seated to the caption ink so block and words read
     one tone above the film */
  glaphic-wipe .caption {
    position: fixed;
    inset: 0;
    z-index: calc(var(--glaphic-wipe-z-index, 9999999) + 1);
    display: flex;
    align-items: var(--glaphic-wipe-caption-block, center);
    justify-content: var(--glaphic-wipe-caption-inline, center);
    visibility: hidden;
    pointer-events: none;
    font-size: var(--glaphic-wipe-caption-size, 16px);
    color: var(--glaphic-wipe-caption-ink, var(--glaphic-neutral-paper, #f2f5eb));
    --glaphic-cursor-type-ink: var(--glaphic-wipe-caption-ink, var(--glaphic-neutral-paper, #f2f5eb));
  }
  glaphic-wipe[writing] .caption {
    visibility: visible;
  }
  /* the SIZE rides the writer: the cursor-treatment's own :host font
     shorthand pins 13px, and an inherited size loses to a host rule —
     so the writer re-states it from outside (outer-tree beats :host)
     and the caption knob governs */
  glaphic-wipe .caption .writer {
    font-size: inherit;
  }
  @media (prefers-reduced-motion: reduce) {
    glaphic-wipe .plate {
      transition: none !important;
    }
  }
`;

/**
 * glaphic-wipe — the SPA page transition. Two viewport-sized plates
 * enter from OPPOSITE edges — the ink-brand-dark front traveling
 * `direction`, the ink-brand-fluro twin entering against it — sweep
 * over the page, the front printing multiply (the page tints
 * through it; over the twin it prints the ink), push on to FULL
 * COINCIDENCE — the opaque ink seal where a swap is invisible — and
 * there the `covered` event hands the swap to
 * the app, `release()` (or the dwell) resumes them and they KEEP
 * GOING — crossing, swapping sides, and sliding out the far sides
 * so the new page is uncovered by the plates leaving. `done` closes
 * the cycle.
 *
 * The component takes no children (it renders its own two plates) —
 * it is an overlay protocol, not a content holder. Drop it at the
 * app root and drive it from the router: run() → (covered: swap +
 * release()) → done.
 */
export class GlaphicWipe extends GlaphicLightElement {
  static properties = {
    /** the FRONT plate's travel: 'right' (default — red in from the
        left edge, the fluro twin in from the right, the same story
        mirrored) | 'left' | 'up' | 'down' — unknown values clamp to
        the default (the convergence axis converter pattern). Change
        it while idle: the pose formulas re-derive live, a mid-flight
        change re-targets the sweep */
    direction: {
      converter: (v: string | null) => ((v ?? '') in DIRECTIONS ? (v as WipeDirection) : 'right'),
      reflect: true,
    },
    /** ms the cover holds by itself after `covered` before the exit
        fires on its own; 0 (default) = the exit waits for release().
        The dwell is a convenience, not the contract — the app swap
        belongs in the covered listener */
    dwell: { type: Number },
    /** the text the cover WRITES at the hold (the cursor-type
        treatment). Empty (default) = the release-driven protocol;
        a non-empty caption makes the hold self-driving: type out,
        blink for the caption dwell, resume */
    caption: { type: String, reflect: true },
    /** the caption hold in progress (the writer is printed) —
        component state, mirrored as an attribute for the CSS/tests */
    writing: { type: Boolean, reflect: true },
    /** the rig's state — set by the component; the author reads it
        (and the attribute mirrors it for CSS/tests) */
    phase: { type: String, reflect: true },
  };
  declare direction: WipeDirection;
  declare dwell: number;
  declare caption: string;
  declare writing: boolean;
  declare phase: WipePhase;

  static sheet = [hostStyles.styleSheet!];

  /** the cycle's promise, so `await wipe.run()` resolves at done */
  private cycle?: Promise<void>;
  private engaged = false;
  private epoch = 0;
  private gateTimer = 0;
  private captionTimer = 0;
  private openGate?: () => void;

  constructor() {
    super();
    this.direction = 'right';
    this.dwell = 0;
    this.caption = '';
    this.writing = false;
    this.phase = 'idle';
  }

  /** the front plate — the transition-end probe and the cover's
      pointer surface (light DOM: the plates are the host's children) */
  get front(): HTMLElement | null {
    return this.querySelector('.plate-front');
  }

  /** Start a wipe. Resolves when the cycle ends (done or abort).
      A run while one is in flight returns the RUNNING CYCLE ITSELF
      (same promise object — the rig holds one film at a time). The
      phase switches only AFTER the plates render (updateComplete): a
      fresh plate has no prior style to transition from, so posing it
      'enter' at insert would paint straight to the cover and skip
      the sweep — the flight phase is what starts the leg, on a
      mounted rig. */
  run(): Promise<void> {
    if (this.engaged) return this.cycle ?? Promise.resolve();
    this.engaged = true;
    const myEpoch = ++this.epoch;
    const cycle = (async () => {
      try {
        await this.updateComplete;
        this.writing = false;
        this.phase = 'enter';
        /* ONE cross into full coincidence (Eliot: the push leg was the
           extra animation) — the single leg's end IS the opaque seal,
           so the covered hold sits on ink-over-ink and the swap's
           invisible the same way it always was */
        await this.leg(myEpoch);
        if (this.epoch !== myEpoch) return;
        this.phase = 'covered';
        /* armed BEFORE the event: a covered listener calling
           release() synchronously must find the gate openable */
        const gate = this.armGate();
        this.dispatchEvent(
          new CustomEvent('covered', {
            detail: { direction: this.direction },
            bubbles: true,
            composed: true,
          }),
        );
        /* the caption hold — self-driving: the writer prints, then
           the caption dwell, then the exit resumes on its own
           (release() still cuts it short; abort() cancels) */
        if (this.caption.trim()) {
          this.writing = true;
          this.armCaption(myEpoch);
        }
        await gate;
        if (this.epoch !== myEpoch) return;
        this.writing = false;
        this.phase = 'exit';
        await this.leg(myEpoch);
        if (this.epoch !== myEpoch) return;
        this.phase = 'idle';
        this.dispatchEvent(
          new CustomEvent('done', {
            detail: { direction: this.direction },
            bubbles: true,
            composed: true,
          }),
        );
      } finally {
        if (this.epoch === myEpoch) {
          this.cycle = undefined;
          this.engaged = false;
        }
      }
    })();
    this.cycle = cycle;
    return cycle;
  }

  /** Resume the film out of the cover — the call the covered
      listener makes after the swap lands. No-op off the hold. */
  release(): void {
    if (this.phase !== 'covered' || !this.openGate) return;
    clearTimeout(this.gateTimer);
    const open = this.openGate;
    this.openGate = undefined;
    open();
  }

  /** Cancel a wipe: the plates snap parked instantly (idle carries
      no transition, so there is no sweep-through) and no events
      fire. Safe to call at any phase. */
  abort(): void {
    if (!this.engaged && this.phase === 'idle') return;
    this.epoch++;
    clearTimeout(this.gateTimer);
    clearTimeout(this.captionTimer);
    this.writing = false;
    this.openGate?.();
    this.openGate = undefined;
    this.cycle = undefined;
    this.engaged = false;
    this.phase = 'idle';
  }

  /** the cover's hold: release() opens it, and — if the author set
      a dwell — the timer opens it too, whichever lands first. A
      caption hold IGNORES the dwell: the type out plus the caption
      dwell are that hold's own gate, and an armed dwell timer would
      cut the writing short mid-print */
  private armGate(): Promise<void> {
    const gate = new Promise<void>((resolve) => (this.openGate = resolve));
    if (this.dwell > 0 && !this.caption.trim()) {
      this.gateTimer = window.setTimeout(() => this.release(), this.dwell);
    }
    return gate;
  }

  /** the caption hold — the cursor-type writer prints the caption
      under the cover; its `printend` (the additive completion event:
      the reduced-motion instant path fires it too) opens the gate
      after the caption dwell. release() can still cut the hold
      short; the writer then keeps printing hidden, which is
      harmless. A second cycle REPLAYS the same script (setting the
      same text again would not re-fire updated()'s print). */
  private armCaption(epoch: number): void {
    const writer = this.querySelector('.writer') as
      | (HTMLElement & { text: string; speed: number; replay(): void })
      | null;
    if (!writer) {
      this.openGate?.();
      return;
    }
    /* the cadence var rides the cursor-type speed (ms per step) */
    const cadence = parseFloat(
      getComputedStyle(this).getPropertyValue('--glaphic-wipe-type-cadence'),
    );
    writer.speed = Math.max(16, cadence || 60);
    const onEnd = (ev: Event) => {
      if (this.phase !== 'covered' || this.epoch !== epoch) return;
      writer.removeEventListener('printend', onEnd);
      const dwell = parseFloat(
        getComputedStyle(this).getPropertyValue('--glaphic-wipe-caption-dwell'),
      );
      clearTimeout(this.captionTimer);
      this.captionTimer = window.setTimeout(() => {
        if (this.phase !== 'covered' || this.epoch !== epoch) return;
        clearTimeout(this.gateTimer);
        const open = this.openGate;
        this.openGate = undefined;
        open?.();
      }, dwell >= 0 ? dwell : 600);
    };
    writer.addEventListener('printend', onEnd);
    if (writer.text === this.caption) {
      writer.replay();
    } else {
      writer.text = this.caption;
    }
  }

  /** one leg of the travel — resolution on the front plate's
      transitionend; the 250ms guard catches a lost end event.
      The leg waits a frame BEFORE reading the duration: the phase
      attribute reflects in Lit's async update, and reading the
      computed duration in the same continuation as the phase set
      still returns the idle CSS's 0s — the leg would take the
      instant path and fire covered mid-flight. Reduced motion (or
      any zero-duration override) reads 0s one frame later: resolve
      after a frame instead, the poses snap instantly */
  private async leg(epoch: number): Promise<void> {
    const front = this.front;
    if (!front || this.epoch !== epoch) return;
    await nextFrame();
    if (this.epoch !== epoch) return;
    const seconds = parseFloat(getComputedStyle(front).transitionDuration) || 0;
    if (seconds === 0) {
      await nextFrame();
      await nextFrame();
      return;
    }
    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        clearTimeout(guard);
        resolve();
      };
      const guard = setTimeout(done, seconds * 1000 + 250);
      front.addEventListener('transitionend', (e) => {
        if (e.target === front && e.propertyName === 'translate') done();
      });
    });
  }

  protected render() {
    return html`
      <i class="plate plate-back" part="back" aria-hidden="true"></i>
      <i class="plate plate-front" part="front" aria-hidden="true"></i>
      ${this.caption.trim()
        ? html`<div class="caption" part="caption" aria-hidden="true">
            <glaphic-cursor-type class="writer"></glaphic-cursor-type>
          </div>`
        : ''}
    `;
  }
}

customElements.define('glaphic-wipe', GlaphicWipe);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-wipe': GlaphicWipe;
  }
}