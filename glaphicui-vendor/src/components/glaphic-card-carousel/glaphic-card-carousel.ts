import { LitElement, css, html, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { GlaphicCardSlide } from './glaphic-card-slide.js';
import '../glaphic-corners/glaphic-corners.js';
import '../glaphic-button/glaphic-button.js';

/**
 * glaphic-card-carousel — Eliot's card carousel: a full-width strip
 * of 2–3 slides (the glaphic-card-slide elements are the light
 * children) that DRIFTS through the row and composes ONE slide's
 * complete card on a click.
 *
 * Carousel mode — the strip runs the container's full width, every
 * slide flexes to an equal column (a slide set to `square` trades the
 * column for the row depth as its width), each slide showing its
 * image layer; its giant title print REVEALS while the slide is held
 * — hover or keyboard focus types it in (the cursor treatment's block
 * dropping once the print lands), release wipes it. The
 * strip AUTO-DRIFTS on the marquee model: it eases LEFT at a constant
 * pace — one card per `interval` seconds — because the wrapper
 * appends a SECOND HALF of the pattern (ghost slides, identical
 * clones of the light children, aria-hidden and untabbable) the loop
 * wraps seamlessly: the keyframes carry the row one full pattern
 * (JS-measured, since slides may carry their own widths) and repeat,
 * no jumps, no teleports. Paused while the pointer or keyboard focus
 * holds the strip, while the strip is off-screen, while the tab is
 * hidden, and in card mode. Reduced motion (or `interval='0'`) holds
 * the strip still. Clicking any slide of the pattern — original OR
 * ghost — composes that slide's card (the ghost stands in for its
 * original, so the compose glides from the actual position under the
 * pointer).
 *
 * Card mode — a click never leaves the strip: the open gate pauses
 * the drift, the WHOLE row eases sideways to the alignment where the
 * clicked slide sits flush at the image column and its pattern
 * successors fill the other columns EQUALLY, and then the card takes
 * over that exact geometry: the CURRENT content flickers and the new
 * content is simply there when it lifts — each changing column carries
 * an .old-screen cover rendered in the same commit as its change (the
 * departed pixels are its slot's assignees: a twin's image on a
 * carousel compose, the previous image and plate copy on a step), and
 * the cover strobes with hard invert frames, then lifts — a hard cut,
 * no entrance, no bleed. The image column has no cover on a carousel
 * compose (the aligned pose already shows the right image); it flickers
 * on a card-mode step, where its image actually changes. The composed
 * card reads
 * ALL of the ONE slide — every part is the active slide's own
 * content, never another slide's: its image (its title print
 * re-typing per selection, permanent) · its description on the
 * ink-brand-dark plate under the bracket frame · its actions
 * bottom-anchored on the fluro plate. Two slides compose image ·
 * description (no actions plate). Switching slides in card mode never
 * needs a back-out — and never slides either: the strip stays put and
 * the card re-tunes in place, all three columns flickering to the new
 * active's content.
 *
 * The changing panels' arrival is a CRT FLICKER — hard invert frames
 * over the departed pixels, then the cut — instead of a wipe; the
 * card's controls step (‹ ›, the arrow keys) re-flicker.
 *
 * Controls — card mode renders a slim control row UNDERNEATH the
 * composed card (part `controls`): the pattern's 01/03 readout on the
 * left, prev/next and the close (×) that returns to the strip on the
 * right, under a separating rule; the arrow keys step. The strip
 * never carries buttons itself — every click inside the card is the
 * compose ask.
 *
 * Back out also with a click outside the strip.
 *
 * Border — the whole element carries a 1px rule over its top and
 * bottom edges (tier-2 -border-ink), so the strip and the card sit
 * inside one frame on the page ground.
 *
 * Events:
 * - `change` { index, open } — after every open/close move
 *   (switch/carousel convention; `index` is the composed panel's
 *   original's slide position).
 * - the slides' `glaphic-card-carousel-open-request` /
 *   `glaphic-card-carousel-close-request` are how composition is
 *   asked; the wrapper owns the answers.
 *
 * Usage:
 *   <glaphic-card-carousel label="Projects" interval="4">
 *     <glaphic-card-slide label="Rite">… description … actions …</…>
 *   </glaphic-card-carousel>
 *
 * Tier-2 — --glaphic-card-carousel-height (303px, the slide row's
 *   depth; each slide's knobs live on the slide element) ·
 *   -border-ink (ink-black, the frame's rule) · -controls-ink ·
 *   the description/actions tier-2s (see the styles) · the plate
 *   paints listed below.
 */
export class GlaphicCardCarousel extends LitElement {
  static properties = {
    /** the composed card's slide (0-based, the ORIGINAL's position) */
    active: { type: Number, reflect: true },
    /** carousel mode (false) vs the composed card (true) */
    open: { type: Boolean, reflect: true },
    /** the strip's accessible name */
    label: { type: String },
    /** the drift pace, seconds PER CARD (0 holds the strip still) */
    interval: { type: Number },
    count: { state: true },
    /** the render stage: open arms the card's state; `cardUp` mounts
        the card itself after the alignment's ease settles */
    cardUp: { state: true },
    /** the flick's covers — the render draws each changing column's
        .old-screen in the same commit the content changes */
    flick: { state: true },
    /** the close's first act: the control area stows before the strip
        re-arms (no snap back) */
    closing: { state: true },
  };
  declare active: number;
  declare open: boolean;
  declare label: string;
  declare interval: number;
  declare count: number;
  declare cardUp: boolean;

  constructor() {
    super();
    this.active = 0;
    this.open = false;
    this.label = 'Card carousel';
    this.interval = 4;
    this.count = 0;
    this.cardUp = false;
    this.closing = false;
    this.flick = undefined;
  }

  /* the drift's pause gates (read by updateDrift, set by the
     pointer/keyboard/visibility listeners) */
  private visible = false;
  private hoverPause = false;
  private focusPause = false;

  /* the measured pattern width → the drift keyframes' loop length */
  private ro: ResizeObserver | null = null;
  private mo: MutationObserver | null = null;

  /* the composed card's panel — the active slide itself, original OR
     ghost (a ghost composes as itself, so the compose glides from
     where the pointer actually caught the pattern) */
  private panelEl: GlaphicCardSlide | null = null;

  /* the composed card's content moves ONE level up while its card is
     open — the active slide's description/actions light nodes are
     assigned into the wrapper's card slots — and goes home on close */
  private moved: { node: Element; slide: GlaphicCardSlide }[] = [];
  private syncing = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('glaphic-card-carousel-open-request', this.onOpenRequest);
    this.addEventListener('glaphic-card-carousel-close-request', this.onCloseRequest);
    /* back-out 1 — a click that lands outside the strip composes back */
    document.addEventListener('click', this.onOutsideClick);
    /* the drift's gates: pointer/keyboard holds, visibility */
    this.addEventListener('pointerenter', () => this.setGate('hoverPause', true));
    this.addEventListener('pointerleave', () => this.setGate('hoverPause', false));
    this.addEventListener('focusin', () => this.setGate('focusPause', true));
    this.addEventListener('focusout', () => this.setGate('focusPause', false));
    document.addEventListener('visibilitychange', this.onVisibility);
    document.addEventListener('keydown', this.onKeydown);
    this.io = new IntersectionObserver(
      (entries) => this.setGate('visible', entries.some((e) => e.isIntersecting)),
    );
    this.io.observe(this);
  }

  private io: IntersectionObserver | null = null;

  private setGate(gate: 'visible' | 'hoverPause' | 'focusPause', value: boolean) {
    this[gate] = value;
    this.updateDrift();
  }

  private onVisibility = () => this.updateDrift();

  override disconnectedCallback() {
    this.removeEventListener('glaphic-card-carousel-open-request', this.onOpenRequest);
    this.removeEventListener('glaphic-card-carousel-close-request', this.onCloseRequest);
    document.removeEventListener('click', this.onOutsideClick);
    document.removeEventListener('visibilitychange', this.onVisibility);
    document.removeEventListener('keydown', this.onKeydown);
    this.ro?.disconnect();
    this.mo?.disconnect();
    this.io?.disconnect();
    super.disconnectedCallback();
  }

  /* keyboard parity for the card's controls: the arrow keys step the
     composed card between the pattern's slides (prev/next) */
  private onKeydown = (ev: Event) => {
    if (!this.open) return;
    const key = (ev as KeyboardEvent).key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    const path = ev.composedPath?.() ?? [];
    if (path.some((el) => (el as HTMLElement)?.tagName === 'INPUT')) return;
    if (key === 'ArrowLeft') this.step(-1);
    else this.step(1);
  };

  protected override firstUpdated() {
    const slot = this.renderRoot.querySelector('slot');
    slot?.addEventListener('slotchange', this.onSlotChange);
    this.sync();
    this.buildGhosts();
    this.updateDrift();
    this.measureDrift();
    /* the loop length follows the row's own widths — square slides,
       resizes, slides joining/leaving all re-measure */
    this.ro = new ResizeObserver(() => this.measureDrift());
    this.ro.observe(this);
    /* the slides' widths answer more than the host's size — a square
       flag toggling on a slide reshapes the pattern the drift loops
       through, so the slides' attribute churn also re-measures */
    this.mo = new MutationObserver(() => this.measureDrift());
    this.mo.observe(this, { subtree: false, attributes: true, attributeFilter: ['square'] });
  }

  /** the keyframes' `to` = one full pattern's width (the row holds the
      pattern twice — originals then ghosts — so half the scroll is
      one loop); JS measures because slides carry their own widths */
  private measureDrift() {
    requestAnimationFrame(() => {
      const strip = this.renderRoot.querySelector('.strip') as HTMLElement | null;
      if (!strip) return;
      const pattern = strip.scrollWidth / 2;
      this.style.setProperty(
        '--glaphic-card-carousel-drift-to',
        pattern > 0 ? `-${Math.ceil(pattern)}px` : '-100%',
      );
    });
  }

  override updated(changed: Map<string, unknown>) {
    this.sync();
    /* the drift re-checks its gates whenever the wrapper turned */
    if (changed.has('open') || changed.has('interval')) this.updateDrift();
    /* the accessible name reflects on the host (the strip/card group
       carries it into the shadow too) */
    if (changed.has('label')) {
      if (this.label) this.setAttribute('aria-label', this.label);
      else this.removeAttribute('aria-label');
    }
  }

  /* the wrapper's OWN slides (light children minus the ghosts) —
     tree-independent, so the card template (whose shadow carries no
     default slot) still finds them */
  private deck() {
    return Array.from(this.children).filter(
      (el) => el instanceof GlaphicCardSlide && !el.hasAttribute('data-ghost'),
    ) as unknown as GlaphicCardSlide[];
  }

  /* every slide of the pattern — originals then their ghosts */
  private row() {
    return Array.from(this.children).filter(
      (el) => el instanceof GlaphicCardSlide,
    ) as unknown as GlaphicCardSlide[];
  }

  private onSlotChange = () => {
    if (this.syncing) return;
    this.sync();
    const ghosts = Array.from(this.children).filter((el) =>
      (el as HTMLElement).hasAttribute?.('data-ghost'),
    );
    /* the ghosts track the deck — the deck's size moved (slides
       joined/left) → rebuild. The build sets the syncing guard itself,
       so the slotchanges IT fires land back here and just pass. With
       alignment stand-ins grown (the pads), the ghost count's invariant
       is stretched on purpose — slotchanges (assignment churn, the
       card's mounted slots) must NOT tear the composing pattern down */
    if (this.pads.length === 0 && ghosts.length !== this.deck().length) {
      this.buildGhosts();
      this.measureDrift();
    }
  };

  /**
   * the pattern's SECOND HALF: identical clones of the light slides,
   * appended after the originals. The drift loop needs content over
   * the whole of the row it empties (the original 3-card beat
   * teleported the leftmost card to the right edge; the continuous
   * drift can't teleport mid-motion), so the pattern runs twice —
   * the keyframes traverse one full pattern (-100%) and repeat with
   * the ghost half under the window looking exactly like the first.
   * Unfocusable (AT skips them — aria-hidden), pointer-live (their
   * clicks compose their original's card via the ghost index).
   */
  private buildGhosts() {
    this.syncing = true;
    try {
      for (const el of Array.from(this.children)) {
        if ((el as HTMLElement).hasAttribute?.('data-ghost')) el.remove();
      }
      const slides = this.deck();
      for (const slide of slides) {
        const ghost = slide.cloneNode(true) as GlaphicCardSlide;
        const host = ghost as unknown as HTMLElement;
        host.setAttribute('data-ghost', '');
        host.setAttribute('data-ghost-index', String(slides.indexOf(slide)));
        host.setAttribute('aria-hidden', 'true');
        host.setAttribute('tabindex', '-1');
        host.setAttribute('role', 'presentation');
        /* strip the runtime pose the original wore when cloned */
        host.removeAttribute('data-part');
        host.removeAttribute('slot');
        host.removeAttribute('style');
        host.style.removeProperty('order');
        /* and its own print starts blank until its label lands */
        host.removeAttribute('aria-label');
        /* the light-DOM ids don't double into the pattern — a ghost is
           its original's stand-in, never a second #id */
        host.removeAttribute('id');
        for (const el of Array.from(host.querySelectorAll('[id]'))) {
          el.removeAttribute('id');
        }
        /* the label travels as a PROPERTY (Preact sets it on the
           declared element, not the attribute), so the attribute-copy
           the clone carries misses it — hand the print its script over */
        ghost.label = slide.label;
        this.appendChild(ghost);
      }
    } finally {
      this.syncing = false;
    }
  }

  /** compose the card onto the `index` slide — a slide click on the
      pattern or the controls. The compose is TWO phases and never a
      panel glide:
      1. the STRIP aligns — the open gate pauses the drift, the row
         eases sideways to the position where the clicked slide sits
         flush at the image column and its pattern successors fill the
         other columns EQUALLY (the card's own grid: every visible
         slide is one share), twins' images still showing;
      2. the card takes over the exact geometry — the DEPARTED content
         flickers OUT (Eliot's correction): every column whose pixels
         are changing carries an .old-screen cover whose slot holds
         the departed pixels (a twin's slide on a carousel compose, the
         previous image/plate copy on a re-tuned one); the cover
         flashes hard invert frames and then lifts, leaving the new
         content simply there (a hard cut, no entrance). The covers
         render in the SAME commit as their panel's change — no frame
         of uncovered new content ever paints. The image column gets
         NO cover on a carousel compose (the aligned pose already shows
         the right image) — it flickers only on a card-mode step, where
         its image actually changes. */
  private async compose(index: number, panel: GlaphicCardSlide) {
    const slides = this.deck();
    if (index < 0 || index >= slides.length) return;
    this.clearFlick();
    /* the composed card stays put when its own panel is re-asked */
    if (this.open && this.panelEl === panel) return;
    /* mid-flight asks (the align's ease, the close's hand-back) are
       KEPT, not dropped — the last ask replays the moment the machine
       is free (a click during the ease still opens that slide) */
    if (this.busy) {
      this.queued = () => this.compose(index, panel);
      return;
    }
    this.busy = true;
    try {
      if (!this.open) {
        /* phase one — the alignment (the strip is still the rendered
           pose; the card mounts only when the ease settles) */
        this.moveContentHome();
        this.active = index;
        this.open = true;
        this.panelEl = panel;
        this.updateDrift();
        this.alignStrip(panel);
        await this.settle;
        /* phase two — the card takes over; the twins ARE the flick's
           departed screens, slotted for the SAME commit as the card's
           mount (no frame of uncovered plates) — the image column gets
           NO cover: the aligned pose already shows the right image */
        const n = slides.length;
        this.flick = {
          desc: n >= 2 ? slides[(index + 1) % n] : undefined,
          act: n >= 3 ? slides[(index + 2) % n] : undefined,
          /* the twins ARE slide covers — stripped at the release */
          slideCovers: [n >= 2 ? slides[(index + 1) % n] : undefined, n >= 3 ? slides[(index + 2) % n] : undefined].filter(Boolean) as Element[],
          moves: [],
        };
        if (this.flick.desc) (this.flick.desc as HTMLElement).setAttribute('slot', 'flick-desc');
        if (this.flick.act) (this.flick.act as HTMLElement).setAttribute('slot', 'flick-act');
        this.scheduleFlick();
        this.cardUp = true;
        this.sync();
        /* the content hosts from the ACTIVE ORIGINAL (a clicked ghost
           would hand up its own throwaway clones — the real nodes
           carry the living buttons) */
        this.moveContentOut(slides[index]);
        await this.updateComplete;
        this.updateDrift();
        this.emit();
      } else {
        /* stepping while open: the strip is aligned and STAYS — the
           card re-tunes in place; the DEPARTED content (the old image,
           the old plates' copy) covers each changing panel IN the same
           commit as the new content's arrival — captured from the
           standing card BEFORE the re-host */
        const standing = this.renderRoot.querySelector('.card');
        const carrier = (name: string): HTMLSlotElement | null =>
          (standing?.querySelector(`slot[name='${name}']`) as HTMLSlotElement | null) ?? null;
        const firstAssigned = (slot: HTMLSlotElement | null): Element | undefined =>
          (slot?.assignedElements?.()[0] as Element | undefined) ?? undefined;
        const prevImg = ((this.flick?.img
          ?? firstAssigned(carrier('card-image'))) as GlaphicCardSlide | undefined);
        const prevSlide = slides[this.active];
        const prevDesc = firstAssigned(carrier('description'));
        const prevAct = firstAssigned(carrier('actions'));
        this.flick = {
          img: prevImg,
          desc: prevDesc,
          act: prevAct,
          /* the previous image slide rides its cover stripped-free;
             the departed copies' homes ride WITH their covers (their
             own slide) with their authored part recorded */
          slideCovers: [prevImg].filter(Boolean) as Element[],
          moves: prevSlide
            ? (prevDesc ? [{ node: prevDesc, home: prevSlide, part: 'description' }] : [])
                .concat(prevAct ? [{ node: prevAct, home: prevSlide, part: 'actions' }] : [])
            : [],
        };
        if (this.flick.img) (this.flick.img as HTMLElement).setAttribute('slot', 'flick-img');
        if (this.flick.desc) (this.flick.desc as HTMLElement).setAttribute('slot', 'flick-desc');
        if (this.flick.act) (this.flick.act as HTMLElement).setAttribute('slot', 'flick-act');
        this.scheduleFlick();
        this.active = index;
        this.panelEl = panel;
        this.sync();
        this.moveContentOut(slides[index]);
        await this.updateComplete;
        this.emit();
      }
    } finally {
      this.busy = false;
    }
    /* machine free — replay the ask that waited out the flight */
    const tail = this.queued;
    this.queued = null;
    if (tail) await tail();
  }

  private onOpenRequest(ev: Event) {
    const asked = (ev as CustomEvent<{ slide?: unknown }>).detail?.slide as
      | GlaphicCardSlide
      | undefined;
    if (!asked) return;
    const slides = this.deck();
    let index = slides.indexOf(asked);
    if (index < 0 && asked.hasAttribute('data-ghost')) {
      /* a ghost asked — the ORIGINAL's index, the GHOST composes */
      const i = Number(asked.getAttribute('data-ghost-index'));
      if (Number.isInteger(i) && i >= 0 && i < slides.length) {
        this.compose(i, asked);
      }
      return;
    }
    if (index < 0) return;
    this.compose(index, asked);
  }

  /* the card's controls — prev/next cycle the pattern, staying open */
  private step(dir: number) {
    const slides = this.deck();
    if (slides.length < 2 || !this.open) return;
    /* `active` is always the panel's origin (ghost included — the
       compose sets it) */
    const next = (this.active + dir + slides.length) % slides.length;
    this.compose(next, slides[next]);
  }

  private onCloseRequest() {
    this.composeDown();
  }

  /* ── the flick (Eliot's model): the CURRENT slide flickers, the new
     one simply appears ── each changing column carries an .old-screen
     cover rendered IN THE SAME COMMIT as the changed content (the
     departed pixels are its slot's assignees — the previous image for
     the image column, the previous plates' own copy for the plate
     columns) — no frame of uncovered new content ever paints, no late
     append. The cover strobes with hard invert frames and lifts; the
     lift is the cut */
  declare closing: boolean;
  declare flick: {
    img?: GlaphicCardSlide;
    desc?: Element;
    act?: Element;
    /** the departed SLIDES riding covers — released by stripping their
        cover slot (the slides' slot attrs are the pass's to manage) */
    slideCovers: Element[];
    /** the departed plate COPIES — re-appended home WITH their
        authored part restored (the slot attribute is moveContentOut's
        only way of picking the copy later; stripping it would strand
        the copy home forever and starve every later compose) */
    moves: { node: Element; home: GlaphicCardSlide; part: string }[];
  } | undefined;
  private flickTimer: number | undefined = undefined;

  private scheduleFlick() {
    if (this.flickTimer !== undefined) window.clearTimeout(this.flickTimer);
    /* the covers lift just past the strobe's end — the same motion
       token the keyframes ride, so tests can stretch the whole flick */
    const raw = getComputedStyle(this)
      .getPropertyValue('--glaphic-card-carousel-motion')
      .trim();
    const seconds = parseFloat(raw);
    const motion = Number.isFinite(seconds) && seconds > 0 ? seconds : 0.45;
    this.flickTimer = window.setTimeout(() => this.clearFlick(), motion * 1000 + 20);
  }

  /* the window's end — the cut: the covers lift (the re-render drops
     them) and ONLY the covers' carried content releases: a departed
     slide loses its cover slot (it stands down with the pass below);
     a departed plate copy returns home to its OWN slide — never via
     moveContentHome, whose moved array also holds the LIVE content
     (homing it all would empty the standing card's plates) */
  private clearFlick() {
    if (this.flickTimer !== undefined) window.clearTimeout(this.flickTimer);
    this.flickTimer = undefined;
    const f = this.flick;
    this.flick = undefined;
    if (!f) return;
    for (const cover of f.slideCovers) (cover as HTMLElement).removeAttribute('slot');
    for (const m of f.moves) {
      /* the copy re-claims its authored slot BEFORE going home — the
         attribute is moveContentOut's only way of picking it later —
         and the re-appending is what stops the copy projecting into
         the live card: the copy leaves the deck */
      (m.node as HTMLElement).setAttribute('slot', m.part);
      (m.home as unknown as HTMLElement).appendChild(m.node);
    }
    this.sync();
  }

  /** back-out 1 — any click not on or in the strip closes the card */
  private onOutsideClick = (ev: Event) => {
    if (!this.open) return;
    if ((ev.composedPath() as EventTarget[]).includes(this)) return;
    this.composeDown();
  };

  /** back out: the strip takes over the exact geometry again — the
      panel returns to the column it was read in (its twin IS that
      pose; a released original slips back off-screen) — then the row
      eases home to where the drift's keyframes held, the drift
      re-engages there, and the stand-in twins go away */
  private async composeDown() {
    if (!this.open || this.panelEl == null || this.deck().length === 0) return;
    this.clearFlick();
    /* mid-flight asks are kept (see compose) — a close asked during
       the align ease still lands once the card stands */
    if (this.busy) {
      this.queued = () => this.composeDown();
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const home = this.stripHome;
    const from = this.stripTarget;

    /* busy holds through the whole close (the stow + the hand-back) —
       a queued ask replays only when the drift owns the strip again */
    this.busy = true;
    const finish = () => {
      this.busy = false;
      const tail = this.queued;
      this.queued = null;
      if (tail) void tail().catch(() => {});
    };

    /* close act one — the control area STOWS (no snap: the area
       unrolls back while the card still stands; reduced motion skips
       the stow and the strip takes over at once) */
    if (!reduced) {
      this.closing = true;
      await this.updateComplete;
      await new Promise((r) => window.setTimeout(r, 480));
      this.closing = false;
    }
    this.open = false;
    this.cardUp = false;
    this.sync(); // the strip re-renders; content home; roles released
    await this.updateComplete;
    this.updateDrift();
    const strip = this.renderRoot.querySelector('.strip') as HTMLElement | null;
    if (strip && home != null && Number.isFinite(home) && Number.isFinite(from) && !reduced) {
      /* hold the alignment, ease the row back to the drift's held
         pose, then hand the translate back to the keyframes */
      strip.style.animation = 'none';
      strip.style.transition = 'none';
      strip.style.translate = `${from}px 0`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          strip.style.transition = 'translate 0.45s cubic-bezier(0.25, 1, 0.4, 1)';
          strip.style.translate = `${home}px 0`;
        });
      });
      window.setTimeout(() => {
        strip.style.transition = '';
        strip.style.translate = '';
        strip.style.animation = '';
        this.releasePattern();
        this.updateDrift();
        this.emit();
        finish();
      }, 460);
    } else {
      if (strip) {
        strip.style.animation = '';
        strip.style.transition = '';
        strip.style.translate = '';
      }
      this.releasePattern();
      this.emit();
      finish();
    }
    this.stripHome = null;
    this.stripTarget = NaN;
  }

  /* ── the alignment (the card's phase one) ────────────────────── */

  /* the drift's held pose (the translate the paused keyframes carry)
     and the aligned pose the card takes over from */
  private stripHome: number | null = null;
  private stripTarget = NaN;
  private settle: Promise<void> = Promise.resolve();
  private busy = false;
  /* the ask that arrived while the machine was mid-flight — replayed
     at the end of compose/composeDown */
  private queued: (() => Promise<void>) | null = null;
  /* tail stand-ins built for an alignment whose pattern ran out */
  private pads: GlaphicCardSlide[] = [];

  /** phase one: pause the drift (the gate holds — `open` is already
      true), own the strip's translate, ease from the pausing pose to
      the alignment: the clicked panel flush at the image column. The
      strip is still the rendered pose here — the card mounts only
      when the ease settles (the cardUp stage). The target is the
      panel's LAYOUT-space left edge negated: both rects carry the
      strip's own translate, so the difference is already
      transform-independent */
  private alignStrip(panel: GlaphicCardSlide) {
    const strip = this.renderRoot.querySelector('.strip') as HTMLElement | null;
    if (!strip) return;
    const stripRect = strip.getBoundingClientRect();
    const tx = this.stripTranslate(strip);
    const target = -(panel.getBoundingClientRect().left - stripRect.left);
    this.stripHome = tx;
    this.stripTarget = target;
    this.growPattern(panel);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    strip.style.animation = 'none';
    strip.style.transition = 'none';
    strip.style.translate = `${tx}px 0`;
    /* the ease needs the start value COMMITTED (a frame's own style
       pass) before the target sets — the two-rAF dance, or the whole
       align collapses into one instant jump */
    this.settle = new Promise<void>((resolve) => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (reduced) {
            strip.style.translate = `${target}px 0`;
            resolve();
            return;
          }
          strip.style.transition = 'translate 0.45s cubic-bezier(0.25, 1, 0.4, 1)';
          strip.style.translate = `${target}px 0`;
          window.setTimeout(resolve, 470);
        }),
      );
    });
  }

  /** the strip's own x-offset, transform-independent — the drift
      animates `translate`, whose computed style some engines resolve
      to a matrix string, so parse either form */
  private stripTranslate(strip: HTMLElement): number {
    const cs = getComputedStyle(strip);
    for (const raw of [cs.translate, cs.transform]) {
      if (!raw || raw === 'none') continue;
      if (raw.startsWith('matrix')) {
        try {
          return new DOMMatrixReadOnly(raw).m41;
        } catch {
          continue;
        }
      }
      const m = raw.match(/(-?\d*\.?\d+(?:e-?\d+)?)px/);
      if (m) return parseFloat(m[1]);
    }
    return 0;
  }

  /** the image/actions columns read pattern[pi+1] / [pi+2] — a click
      on the pattern's LAST stand-ins (ghosts of the tail slides) runs
      out of successors, so stand-ins for the missing ones are cloned
      past the pattern's end (the drift loop never reveals them — its
      traverse stops at one pattern's width — only the alignment does) */
  private growPattern(panel: GlaphicCardSlide) {
    this.releasePattern();
    const row = this.row();
    const slides = this.deck();
    const pi = row.indexOf(panel);
    if (pi < 0) return;
    const want = Math.min(3, this.count) - 1;
    const missing: Element[] = [];
    for (let k = 1; k <= want; k++) {
      if (pi + k < row.length) continue;
      missing.push(slides[(this.active + k) % slides.length] as unknown as Element);
    }
    if (missing.length === 0) return;
    this.syncing = true;
    try {
      for (const from of missing) {
        const pad = (from as unknown as GlaphicCardSlide).cloneNode(true) as GlaphicCardSlide;
        const host = pad as unknown as HTMLElement;
        host.setAttribute('data-ghost', '');
        host.setAttribute('data-ghost-index', String(this.deck().indexOf(from as unknown as GlaphicCardSlide)));
        host.setAttribute('aria-hidden', 'true');
        host.setAttribute('tabindex', '-1');
        host.setAttribute('role', 'presentation');
        host.removeAttribute('data-part');
        host.removeAttribute('slot');
        host.removeAttribute('aria-label');
        pad.label = (from as unknown as GlaphicCardSlide).label;
        this.appendChild(pad);
        this.pads.push(pad);
      }
    } finally {
      this.syncing = false;
    }
  }

  /** the stand-ins go home (they live past the pattern's end; removing
      tail elements shifts nothing the drift can see) */
  private releasePattern() {
    if (this.pads.length === 0) return;
    for (const el of this.pads) el.remove();
    this.pads = [];
    this.measureDrift();
  }

  private emit() {
    this.dispatchEvent(
      new CustomEvent('change', { detail: { index: this.active, open: this.open }, bubbles: true, composed: true }),
    );
  }

  /** the content moves: OUT while the card is open — the active
      ORIGINAL's description/actions nodes are re-parented onto the
      wrapper, where the card's named slots take them — HOME on close
      or retune */
  private moveContentOut(origin: GlaphicCardSlide) {
    const host = origin as unknown as HTMLElement;
    const picks = Array.from(host.children).filter(
      (node) => node.getAttribute?.('slot') === 'description' || node.getAttribute?.('slot') === 'actions',
    );
    if (picks.length === 0) return;
    /* the re-parent fires the deck's slotchange — guarded, or the
       slotchange sees the stand-in pads and tears the pattern's tail
       (and the composing ghost) down mid-card */
    this.syncing = true;
    try {
      for (const node of picks) {
        this.moved.push({ node, slide: origin });
        this.appendChild(node);
      }
    } finally {
      this.syncing = false;
    }
  }

  private moveContentHome() {
    for (const { node, slide } of this.moved) {
      (slide as unknown as HTMLElement).appendChild(node);
    }
    this.moved = [];
  }

  /* the two passes:
     - carousel mode: content home, every slide of the pattern stands
       in natural light-DOM order (originals first, then their ghosts
       — the drift keyframes need no reordering, the pattern IS the
       second half)
     - card mode: the panel takes the image slot (part image — its
       re-typed print), everything else stands down */
  private sync() {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const slides = this.deck();
      if (slides.length !== this.count) this.count = slides.length;
      if (this.active >= Math.max(1, slides.length)) this.active = 0;
      if (this.active < 0) this.active = 0;

      /* card mode once the alignment has settled — the align phase
         (`open`, not yet cardUp) keeps every slide standing so the row
         can ease to its aligned pose with its full pattern */
      if (!this.open || !this.cardUp || slides.length === 0) {
        this.moveContentHome();
        this.panelEl = null;
        for (const slide of this.row()) {
          const host = slide as unknown as HTMLElement;
          host.removeAttribute('slot');
          host.removeAttribute('data-part');
          slide.cardPart = '';
          host.style.removeProperty('order');
        }
        return;
      }
      /* card mode */
      for (const slide of this.row()) {
        const host = slide as unknown as HTMLElement;
        host.style.removeProperty('order');
        /* a slide riding the flick keeps its cover slot — the compose/
           retune set the attrs itself; don't strip (or stand down) the
           departed image while its cover runs */
        if (this.flick && (this.flick.img === slide || this.flick.desc === slide || this.flick.act === slide)) {
          continue;
        }
        if (slide !== this.panelEl) {
          host.removeAttribute('slot');
          host.removeAttribute('data-part');
          slide.cardPart = '';
        }
      }
      /* the panel keeps whatever composes it: a ghost keeps standing
         in (its origin's index drives `active`); only a stale/absent
         panel falls back to the active original */
      const panel =
        this.panelEl && Array.from(this.children).includes(this.panelEl as unknown as Element)
          ? this.panelEl
          : slides[this.active] ?? this.row()[0];
      this.panelEl = panel;
      panel.setAttribute('slot', 'card-image');
      this.setParts(panel);
    } finally {
      this.syncing = false;
    }
  }

  private setParts(slide: GlaphicCardSlide) {
    /* the property drives the slide's update (the re-typed print); the
       attribute drives its CSS */
    slide.cardPart = 'image';
    (slide as unknown as HTMLElement).setAttribute('data-part', 'image');
  }

  /* ── the drift ───────────────────────────────────────────────── */

  private gates() {
    return (
      this.open ||
      this.hoverPause ||
      this.focusPause ||
      !this.visible ||
      document.hidden ||
      this.count < 2 ||
      this.interval <= 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /** the marquee's play-state lives on a host attribute (the shadow's
      .strip animates always; the gates only HOLD it) */
  private updateDrift() {
    this.setAttribute('data-drift', this.gates() ? 'paused' : 'running');
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      /* the frame: one rule over the whole thing's top and bottom.
         !important is deliberate — outer-tree rules (a page's preflight
         resetting border-width) override even the :host rule (the host
         lives in the outer tree), and a frameless strip is a wrong
         component, not a styling choice */
      border-block: 1px solid var(--glaphic-card-carousel-border-ink, var(--glaphic-ink-black, #0d0221)) !important;
      /* the drift wraps through the right edge — the host clips the
         ghost half running past the frame */
      overflow: hidden;
      /* the host is its OWN stacking context: the control band's
         dropping-under-the-card pose (z -1) stays INSIDE this box —
         without it the negative-z band escapes to the page root and
         falls behind the page's own section paints (invisible) */
      isolation: isolate;
    }
    .strip,
    .card {
      flex: none;
      height: var(--glaphic-card-carousel-height, 303px);
      width: 100%;
    }
    .strip {
      /* the row is a flex strip: every slide takes its own flex-basis
         (an equal 1/cols share by default; a square slide the row's
         depth) — a grid's shared track can't give slides their own
         widths. 'cols' carries the visible count */
      display: flex;
      --glaphic-card-carousel-cols: 3;
      box-sizing: content-box;
      overflow: visible;
      /* the marquee: the row runs left at a constant pace, one full
         pattern per loop, wrapping without a single jump (the ghost
         half fills what the originals leave behind); the data-drift
         attribute only ever HOLDS it. The loop length is the PATTERN's
         width — count cards at their own widths — which JS measures
         (slides may be square, so -100% only holds for the equal
         thirds case; the var starts at that fallback) */
      animation: glaphic-card-carousel-drift var(--glaphic-card-carousel-marquee, 12s) linear infinite;
    }
    :host([data-drift='paused']) .strip {
      animation-play-state: paused;
    }
    @keyframes glaphic-card-carousel-drift {
      from {
        translate: 0 0;
      }
      to {
        /* one full pattern, the measured width (JS) — fallback: one
           strip width (the equal-thirds case) */
        translate: var(--glaphic-card-carousel-drift-to, -100%) 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .strip {
        animation: none !important;
      }
    }
    .card {
      /* the card is bare flow — NO position/z — its stacking context
         would ISOLATE the panels and their blend flicker would read
         against the card's empty interior instead of the page (a
         difference against nothing renders normal — the strobe dies) */
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      grid-auto-rows: 100%;
    }
    ::slotted(*) {
      min-width: 0;
    }
    /* the ONE actions wrapper (the author's [slot=actions] div) is the
       plate's content stack — its buttons spread apart at the plate's
       own rhythm instead of riding edge to edge */
    ::slotted([slot='actions']) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 11px;
    }

    /* ── the composed card ─────────────────────────────────────────
       all THREE columns arrive as flickering screens: the image
       column (the active slide, slotted) and the description/actions
       plates (the wrapper's, carrying the ONE active slide's content
       — the wrapper moved it up a level) each pop in and strobe
       through the design's three blends, then settle — the twins'
       images behind them "change to what they should be in card mode" */
    .panel-image {
      position: relative;
      overflow: hidden;
      min-width: 0;
    }
    .panel-image ::slotted(*) {
      height: 100%;
    }
    .panel {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      min-width: 0;
      /* the panel is simply THERE on arrival — the change is covered
         by the .old-screen flicker above it (the departed pixels
         strobe out), never an entrance of its own */
    }
    .panel-desc {
      background: var(--glaphic-card-carousel-description-surface, var(--glaphic-ink-brand-dark, #a6022a));
      color: var(--glaphic-card-carousel-description-ink, var(--glaphic-neutral-paper, #f2f5eb));
      font-family: var(--glaphic-card-carousel-description-font, var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace));
      /* the copy reads as a share of the card's own depth — smaller
         cards print smaller, no fixed px */
      font-size: calc(var(--glaphic-card-carousel-height, 303px) * 0.04);
      line-height: calc(var(--glaphic-card-carousel-height, 303px) * 0.08);
    }
    .panel-desc glaphic-corners {
      position: absolute;
      inset: 8px 10px;
      box-sizing: border-box;
      /* the copy sits comfortably inside the bracket arms (the arms
         span 22px from each inset corner; the copy starts past them) */
      padding: 36px 14px 38px;
      --glaphic-corners-ink: var(--glaphic-card-carousel-description-ink, var(--glaphic-neutral-paper, #f2f5eb));
      --glaphic-corners-size: 22px;
      --glaphic-corners-thickness: 1.5px;
      --glaphic-corners-inset-block: 0px;
      --glaphic-corners-inset-inline: 0px;
    }
    .panel-act {
      background: var(--glaphic-card-carousel-actions-surface, var(--glaphic-ink-brand-fluro, #14f1c8));
      padding: 20px 20px 40px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 11px;
    }
    .panel-act glaphic-corners {
      position: absolute;
      inset: 8px 10px;
      box-sizing: border-box;
      padding: 30px 14px 34px;
      --glaphic-corners-ink: var(--glaphic-card-carousel-actions-brackets, var(--glaphic-ink-brand-dark, #a6022a));
      --glaphic-corners-size: 22px;
      --glaphic-corners-thickness: 1.5px;
      --glaphic-corners-inset-block: 0px;
      --glaphic-corners-inset-inline: 0px;
    }

    /* ── the card's controls, underneath the composed card ─────────
       the AREA unrolls: the whole control surface (the rule riding
       with it) grows from zero height into its own box — the layout
       grows WITH the paint, so nothing pops open and no part of the
       band slides into a box that was already there. The band's
       content is anchored to the box's bottom edge, so it rides down
       behind the card's bottom as the box unrolls (the reveal's clip
       is the box's own height, nothing else) */
    .ctl {
      flex: none;
      height: var(--glaphic-card-carousel-ctl-h, 57px);
      position: relative;
      overflow: hidden;
      animation: glaphic-card-carousel-ctl-drop var(--glaphic-card-carousel-motion, 0.45s)
        cubic-bezier(0.25, 1, 0.4, 1) both;
      border-top: 1px solid var(--glaphic-card-carousel-border-ink, var(--glaphic-ink-black, #0d0221));
    }
    /* the close's mirror: the area STOWS (animates back to zero), no
       snap — composeDown holds this pose while the strip re-arms */
    .ctl.closing {
      animation: glaphic-card-carousel-ctl-stow var(--glaphic-card-carousel-motion, 0.45s)
        cubic-bezier(0.25, 1, 0.4, 1) both;
    }
    @keyframes glaphic-card-carousel-ctl-stow {
      from {
        height: var(--glaphic-card-carousel-ctl-h, 57px);
      }
      to {
        height: 0;
      }
    }
    @keyframes glaphic-card-carousel-ctl-drop {
      from {
        height: 0;
      }
      to {
        height: var(--glaphic-card-carousel-ctl-h, 57px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .ctl {
        animation: none !important;
      }
    }
    .ctl-in {
      /* the content anchors to the box's BOTTOM: as the box unrolls the
         content rides down behind the card's edge (the box's clip is
         the whole reveal — no inner animation) */
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: var(--glaphic-card-carousel-ctl-h, 57px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      padding: 0 14px;
    }
    .ctl-count {
      display: flex;
      gap: 2px;
      margin-right: auto;
      font-family: var(--glaphic-font-family-mono, 'IBM Plex Mono', monospace);
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--glaphic-card-carousel-controls-ink, var(--glaphic-ink-black, #0d0221));
      opacity: 0.7;
      font-weight: 600;
    }
    .ctl-count .idx {
      /* the live numeral stands a shade brighter than the total */
      opacity: 1;
      color: var(--glaphic-card-carousel-controls-live, var(--glaphic-ink-brand-dark, #a6022a));
    }
    /* the controls ride the Controls/Button outline recipe (size sm:
       the mono 11px label, the ink keyline, the paper-deep hover
       pour); the glyphs keep the row's mono voice */
    glaphic-button {
      --glaphic-button-text: var(--glaphic-card-carousel-controls-ink, var(--glaphic-ink-black, #0d0221));
      --glaphic-button-border: var(--glaphic-card-carousel-controls-ink, var(--glaphic-ink-black, #0d0221));
      letter-spacing: 0;
      line-height: 1;
      font-size: 22px;
    }
    glaphic-button::part(button) {
      padding: 6px 18px;
    }

    /* the current screen flickers ALONE (Eliot's correction): hard
       invert flashes over the departed pixels — OPAQUE, the arriving
       content never bleeds through — and the lift is the hard cut: the
       new content simply appears, nothing transitions in */
    @keyframes glaphic-card-carousel-flicker {
      0% {
        filter: none;
      }
      33.3% {
        filter: invert(1);
      }
      66.6% {
        filter: none;
      }
      100% {
        filter: invert(1);
      }
    }
    /* the departed pixels: they cover the changing column OPAQUE and
       strobe out with hard invert flashes — the arriving content shows
       only when the cover lifts (a hard cut, no transition). Each
       cover paints its own column's plate read (the departed copy sits
       on its own surface, not a ghost of the new plate) and the copy
       rides the panel's padding/font by inheritance */
    .old-screen {
      position: absolute;
      inset: 0;
      overflow: hidden;
      animation: glaphic-card-carousel-flicker var(--glaphic-card-carousel-motion, 0.45s)
        steps(1, end) both;
    }
    .panel-image .old-screen {
      background: var(--glaphic-card-carousel-image-surface, #d9d9d9);
    }
    .panel-desc .old-screen,
    .panel-act .old-screen {
      /* the departed copy rides the panel's padding for its plate read */
      padding: 36px 14px 38px;
    }
    .panel-desc .old-screen {
      background: var(--glaphic-card-carousel-description-surface, var(--glaphic-ink-brand-dark, #a6022a));
    }
    .panel-act .old-screen {
      background: var(--glaphic-card-carousel-actions-surface, var(--glaphic-ink-brand-fluro, #14f1c8));
    }
    /* the departed content keeps its card-mode rhythm inside the cover
       (the slot attr flipped, so the [slot=actions] rule no longer
       matches — spell the flick slots out) */
    .panel-desc .old-screen ::slotted([slot='flick-desc']),
    .panel-act .old-screen ::slotted([slot='flick-act']) {
      width: 100%;
    }
    .panel-act .old-screen ::slotted([slot='flick-act']) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 11px;
    }
    /* a departed slide fills its cover like it filled the column */
    .panel-image .old-screen ::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
    }
    @media (prefers-reduced-motion: reduce) {
      .old-screen {
        display: none !important;
      }
    }
  `;

  protected render() {
    if (this.open && this.cardUp) {
      /* keyed on the active slide: a control-step re-creates the card
         so the plates wipe in fresh for the new slide's content */
      return html`
        ${keyed(
          this.active,
          html`<div class="card" part="card" role="group" aria-label=${this.label}>
            <div class="panel panel-image" part="image">
              <slot name="card-image"></slot>
              ${this.flick?.img
                ? html`<div class="old-screen" data-old="image" aria-hidden="true"><slot name="flick-img"></slot></div>`
                : nothing}
            </div>
            ${this.count >= 2
              ? html`<div class="panel panel-desc" part="description">
                  <glaphic-corners><slot name="description"></slot></glaphic-corners>
                  ${this.flick?.desc
                    ? html`<div class="old-screen" data-old="desc" aria-hidden="true"><slot name="flick-desc"></slot></div>`
                    : nothing}
                </div>`
              : nothing}
            ${this.count >= 3
              ? html`<div class="panel panel-act" part="actions">
                  <glaphic-corners><slot name="actions"></slot></glaphic-corners>
                  ${this.flick?.act
                    ? html`<div class="old-screen" data-old="act" aria-hidden="true"><slot name="flick-act"></slot></div>`
                    : nothing}
                </div>`
              : nothing}
          </div>`,
        )}
        <div class="ctl" part="controls">
          <div class="ctl-in">
            <span class="ctl-count" aria-hidden="true">
              <span class="idx">${String(this.active + 1).padStart(2, '0')}</span>
              <span> / </span>
              <span>${String(Math.max(1, this.count)).padStart(2, '0')}</span>
            </span>
            ${this.count >= 2
              ? html`
                  <glaphic-button part="ctl-prev" variant="outline" size="sm" aria-label="Previous slide" @click=${() => this.step(-1)}>‹</glaphic-button>
                  <glaphic-button part="ctl-next" variant="outline" size="sm" aria-label="Next slide" @click=${() => this.step(1)}>›</glaphic-button>
                `
              : nothing}
            <glaphic-button part="ctl-close" variant="outline" size="sm" aria-label="Close the card" @click=${() => this.composeDown()}>×</glaphic-button>
          </div>
        </div>
      `;
    }
    const count = Math.max(1, this.count || 1);
    const dur = `${((this.interval > 0 ? this.interval : 4) * count).toFixed(2)}s`;
    const name = this.count >= 2 && this.interval > 0 ? 'glaphic-card-carousel-drift' : 'none';
    return html`
        <div
          class="strip"
          part="strip"
          role="group"
          aria-label=${this.label}
          style="--glaphic-card-carousel-cols: ${count}; animation-name: ${name}; animation-duration: ${dur}"
        ><slot></slot></div>
    `;
  }
}

customElements.define('glaphic-card-carousel', GlaphicCardCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-card-carousel': GlaphicCardCarousel;
  }
}