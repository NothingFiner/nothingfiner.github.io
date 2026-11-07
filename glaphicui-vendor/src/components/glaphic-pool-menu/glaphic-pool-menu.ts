import { LitElement, css, html } from 'lit';

/* ────────────────────────────────────────────────────────────────
   glaphic-pool-menu — Eliot's pool menu (inspired by auge-xp.com):
   a TRIGGER the size of the plate stack (a 65×48 ink-brand-dark
   plate with its ink-brand-fluro twin offset 4px behind and two
   paper lines on it — the pool read) that expands, anchored
   top-left, into a PANEL that reads the same film print at panel
   scale — both plates at panel size, the twin offset 4px behind
   (one dark plate, the red's sliver on the anti-growth side, the
   fluro's fringe on the growth side) — with the menu items printed
   giant in paper display type ABOVE the plates (unblended, the
   X's paper).

   Content: light children — plain anchors or buttons, one per menu
   entry:

     <glaphic-pool-menu label="Menu">
       <a href="/works">Works</a>
       <a href="/about">About</a>
       <a href="/contacts">Let's talk</a>
     </glaphic-pool-menu>

   Expanding: the plates grow (width/height + offset transitions
   over -motion, 0.35s cubic) — never a fade — while holding the
   film read: the ink plate is the panel box, the fluro twin the
   same size offset -panel-offset-inline/-block (8px) behind it,
   so open is just the closed pose scaled up and the crossed X
   rides inside the plates' printed overlap. The entries' sheet
   lies OUT of the multiplied plates — it covers the plate box but
   starts past the patch strip on the patch side, and prints
   unblended paper, matching the X. The items slide in from the
   right (the 40px read of the inspiration nav) with a 40ms
   stagger. The panel sizes itself to its entries — the widest
   entry's width plus the sheet's insets and paddings, the height
   likewise — measured live (entry changes and font loads
   re-measure); -panel-width / -panel-height pin it fixed when the
   author sets them. Reduced motion: plates at size, lines crossed,
   items in place, no motion.

   Closing: the trigger is one persistent button — the same plate
   patch stays put when the panel grows and the lines read as the X;
   clicking it toggles (aria-expanded rides the trigger the whole
   time, and keyboard focus never has to move). Escape and a click
   outside the wrapper close too; activating an item closes after
   the native anchor navigation picks it up.

   Hover: the film-button read — closed, the plates trade offsets
   (the front plate slides onto the twin's +4px offset, the twin
   slides back to the front's; the closed pose is uniform in every
   anchor, so the swap reads the same way in every anchor); open
   the plates hold still.
   [force-hover] mirrors it for tests and demos.

   Anchor: `anchor` names the corner of the PANEL the trigger marks
   — `top-left` (default: the panel grows right and down),
   `top-right` (grows left from the trigger's top-right edge),
   `bottom-left` (grows up), `bottom-right` (grows left and up —
   corner overlays). Only the OPEN pose flips with the corner (the
   twin always peeks along the growth direction when the panel is
   out) — the closed trigger holds the uniform down-right
   arrangement, the light plate at the bottom in every corner
   (Eliot: "just like the one that opens down" — it looks better).
   The trigger patch and the
   bar pair sit on the stacking corner, the X morph mirrors its
   slide, and the entries slide in from off the panel's far edge.
   The stack's open box is the same size in every mode — place the
   host at the corner the panel opens AWAY from (a right-aligned
   trigger in an end-aligned flex parent grows into the room).

   Events: `change` { index, open } after every open/close move
   (index -1 when nothing was selected; switch/carousel convention).

   Tier-2 — --glaphic-pool-menu-surface (ink-brand-dark) ·
   -back-surface (ink-brand-fluro) · -line-ink (paper) ·
   -line-size (4px) · -line-width (44px) · -line-first (17px, the
   bars' pair centered into the trigger plate) · -line-pitch (10px)
   · -trigger-width (65px) · -trigger-height (48px) ·
   -trigger-offset (4px, the twin's peek closed) · -panel-width
   (308px) · -panel-height (454px) · -panel-offset-inline (8px,
   the twin's peek open) · -panel-offset-block (8px, the twin's
   peek open, block) · -item-ink (paper; the entries print
   UNBLENDED above the plates, matching the X) · -item-hover-ink
   (fluro) · -item-size (25px, display type) · -item-gap (36px;
   item pitch = size + gap) · -item-start (16px, the items' top
   padding) · -item-inset (24px, left/right item padding) ·
   -item-end (16px, the items' bottom padding) · -item-slide
   (40px) · -motion (0.35s) · -stagger (40ms) · -label-shift (the
   bars' 2px hover ride, the film-button read)
   Small screens: at viewport widths of 899px and down the item-tier
   FALLBACKS grow — -item-size 32px · -item-gap 40px · -item-slide
   48px — so the open panel's entries carry more presence on phones
   while the panel still sizes itself by its own content measurement
   (the resolved values flow through). Author-set knobs still win
   over the swapped fallbacks, and the closed trigger pose is
   untouched at every size.
   ──────────────────────────────────────────────────────────────── */

const SELECTION_NONE = -1;

export class GlaphicPoolMenu extends LitElement {
  static properties = {
    /** open (panel plates grown, lines crossed) vs closed (the trigger) */
    open: { type: Boolean, reflect: true },
    /** the trigger's accessible name */
    label: { type: String },
    /** which corner of the PANEL the trigger marks: 'top-left' (default,
        grows right + down), 'top-right' (grows left), 'bottom-left'
        (grows up), 'bottom-right' (grows left + up — corner overlays) */
    anchor: { type: String, reflect: true },
    count: { state: true },
    /** the measured panel size (0 = the tier-2 vars stand) */
    panelWidth: { state: true },
    panelHeight: { state: true },
  };
  declare open: boolean;
  declare label: string;
  declare anchor: string;
  declare count: number;
  declare panelWidth: number;
  declare panelHeight: number;

  constructor() {
    super();
    this.open = false;
    this.label = 'Pool menu';
    this.anchor = 'top-left';
    this.count = 0;
    this.panelWidth = 0;
    this.panelHeight = 0;
  }

  private onSlotChange = () => this.sync();

  /* a navigation IS the menu's close: any hashchange (a picked link,
     the site's wipe's HELD swap — its capture-phase intercept stops
     propagation, so the entry's own click may never reach this host —
     back/forward, programmatic navs) closes the menu */
  private onHashChange = () => {
    if (this.open) this.closeMenu();
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.onOutsideClick);
    document.addEventListener('keydown', this.onDocumentKey);
    window.addEventListener('hashchange', this.onHashChange);
    /* the item hover read — synthetic hover never fires the CSS
       :hover pseudo, so the wrapper holds the attribute: slotted
       anchors get [data-hover] and the ::slotted rule paints */
    this.addEventListener('mouseover', this.onItemHover);
    this.addEventListener('focusin', this.onItemHover);
    this.addEventListener('mouseout', this.onItemHover);
    this.addEventListener('focusout', this.onItemHover);
    this.addEventListener('click', this.onStackClick);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this.onOutsideClick);
    document.removeEventListener('keydown', this.onDocumentKey);
    window.removeEventListener('hashchange', this.onHashChange);
    this.removeEventListener('mouseover', this.onItemHover);
    this.removeEventListener('focusin', this.onItemHover);
    this.removeEventListener('mouseout', this.onItemHover);
    this.removeEventListener('focusout', this.onItemHover);
    this.removeEventListener('click', this.onStackClick);
    const slot = this.renderRoot.querySelector('slot');
    slot?.removeEventListener('slotchange', this.onSlotChange);
    super.disconnectedCallback();
  }

  protected override firstUpdated() {
    const slot = this.renderRoot.querySelector('slot');
    slot?.addEventListener('slotchange', this.onSlotChange);
    this.triggerEl.addEventListener('click', this.onTriggerClick);
    this.sync();
    /* fonts move entry widths — re-measure once the type settles */
    document.fonts?.ready.then(() => this.measurePanel());
  }

  /** the panel sizes itself to its entries: the widest entry's
     width plus the sheet's insets and paddings, the height
     likewise (the insets carry the patch strip on the patch side
     and the twin's fringe on the growth sides). The author's
     -panel-width / -panel-height set on the wrapper beat this
     measurement (0 drops it — the tier-2 vars stand). */
  private measurePanel() {
    const items = this.items();
    const itemsEl = this.renderRoot.querySelector('.items') as HTMLElement | null;
    if (!itemsEl || items.length === 0) return;
    /* the .items sheet is always laid out (it only paints when
       open), so this measures closed */
    const cs = getComputedStyle(itemsEl);
    const host = getComputedStyle(this);
    const width =
      Math.max(...items.map((el) => el.offsetWidth)) +
      parseFloat(cs.paddingLeft) +
      parseFloat(cs.paddingRight) +
      parseFloat(cs.left) +
      parseFloat(cs.right);
    const height =
      parseFloat(cs.top) +
      parseFloat(cs.bottom) +
      parseFloat(cs.paddingTop) +
      parseFloat(cs.paddingBottom) +
      items.reduce((sum, item) => sum + item.offsetHeight, 0) +
      (items.length - 1) * parseFloat(cs.rowGap);
    this.panelWidth = host.getPropertyValue('--glaphic-pool-menu-panel-width').trim() ? 0 : width;
    this.panelHeight = host
      .getPropertyValue('--glaphic-pool-menu-panel-height')
      .trim()
      ? 0
      : height;
  }

  /** the menu entries — slotted anchors and buttons in light-DOM order */
  private items(): HTMLElement[] {
    const slot = this.renderRoot?.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return [];
    return slot.assignedElements().filter(
      (el) => el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement,
    ) as unknown as HTMLElement[];
  }

  /** assign the stagger delays once per entry */
  private sync() {
    const items = this.items();
    if (items.length !== this.count) this.count = items.length;
    items.forEach((item, i) => {
      item.style.setProperty('--glaphic-pool-menu-stagger', `${i * 40}ms`);
    });
  }

  override updated() {
    this.sync();
    this.measurePanel();
  }

  private openMenu() {
    if (this.open) return;
    this.open = true;
    this.sync();
    this.emit(SELECTION_NONE);
  }

  private closeMenu(selection = SELECTION_NONE) {
    if (!this.open) return;
    this.open = false;
    this.sync();
    this.emit(selection);
  }

  private emit(index: number) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { index, open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** back-out: any click not on or in the wrapper closes the panel */
  private onOutsideClick = (ev: Event) => {
    if (!this.open) return;
    if ((ev.composedPath() as EventTarget[]).includes(this)) return;
    this.closeMenu();
  };

  private onDocumentKey = (ev: Event) => {
    if (!this.open) return;
    if ((ev as KeyboardEvent).key !== 'Escape') return;
    this.closeMenu();
  };

  /* the wrapper-held hover read: the entry under the pointer or in
     the focus gets [data-hover]; out/blur clears it */
  private onItemHover(ev: Event) {
    const items = this.items();
    const entered = ev.type === 'mouseover' || ev.type === 'focusin';
    for (const item of items) item.removeAttribute('data-hover');
    if (!entered) return;
    const hit = (ev.composedPath() as HTMLElement[]).find(
      (node) => node instanceof HTMLAnchorElement || node instanceof HTMLButtonElement,
    );
    if (hit && items.includes(hit)) hit.setAttribute('data-hover', '');
  }

  /* the stack routes its click: an item's activation closes (the
     anchor navigation stays native). The trigger's own click listener
     toggles — direct, so shadow-internal retargeting never matters */
  private onTriggerClick = () => {
    this.open ? this.closeMenu() : this.openMenu();
  };

  private onStackClick(ev: Event) {
    const hit = (ev.composedPath() as HTMLElement[]).find(
      (node) => node instanceof HTMLAnchorElement || node instanceof HTMLButtonElement,
    );
    const items = this.items();
    if (hit && items.includes(hit)) this.closeMenu(items.indexOf(hit));
  }

  private get triggerEl(): HTMLButtonElement {
    return this.renderRoot.querySelector('.trigger') as HTMLButtonElement;
  }

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      width: fit-content;
    }
    .stack {
      position: relative;
      box-sizing: border-box;
      width: calc(
        var(--glaphic-pool-menu-trigger-width, 65px) + var(--glaphic-pool-menu-trigger-offset, 4px)
      );
      height: calc(
        var(--glaphic-pool-menu-trigger-height, 48px) + var(--glaphic-pool-menu-trigger-offset, 4px)
      );
      transition: width var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        height var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
    }
    :host([open]) .stack {
      width: calc(
        var(--glaphic-pool-menu-panel-width, 308px) + var(--glaphic-pool-menu-panel-offset-inline, 8px)
      );
      height: calc(
        var(--glaphic-pool-menu-panel-height, 454px) + var(--glaphic-pool-menu-panel-offset-block, 8px)
      );
    }
    /* anchor — which corner of the panel the trigger marks. The sign
       pair below is the twin's OPEN peek direction (= the growth
       direction); the OPEN plates and the entries' sheet insets
       derive from it, so each mirrored corner flips its signed axis
       and everything reads through the same two vars (peek +1/+1 is
       the default bottom-right twin). The closed pose is uniform. */
    :host {
      --_peek-x: 1;
      --_peek-y: 1;
      /* the trigger patch's block extent (its height + the twin's
         peek) — the strip the entries' sheet starts past, patch side */
      --_patch-extent: calc(
        var(--glaphic-pool-menu-trigger-height, 48px) +
          var(--glaphic-pool-menu-trigger-offset, 4px)
      );
    }
    :host([anchor='top-right']),
    :host([anchor='bottom-right']) {
      --_peek-x: -1;
    }
    :host([anchor='bottom-left']),
    :host([anchor='bottom-right']) {
      --_peek-y: -1;
    }
    /* the twin — behind, peeking +4px closed. The closed pose is
       UNMIRRORED in every anchor (Eliot: "the up opening versions
       button has the light plate at the bottom by default just like
       the one that opens down" — it looks better): the fluro twin
       rides the stack's bottom-right, the red sliver holds the
       top-left, and only the OPEN pose flips with the corner */
    .plate-back {
      position: absolute;
      box-sizing: border-box;
      width: var(--glaphic-pool-menu-trigger-width, 65px);
      height: var(--glaphic-pool-menu-trigger-height, 48px);
      left: var(--glaphic-pool-menu-trigger-offset, 4px);
      top: var(--glaphic-pool-menu-trigger-offset, 4px);
      border-radius: var(--glaphic-radius-base, 2px);
      background: var(--glaphic-pool-menu-back-surface, var(--glaphic-ink-brand-fluro, #14f1c8));
      /* the pool's plates are printed layers — the twin multiplies
         into whatever it lies on (the page outside, the front plate
         in their overlap, where red × fluro prints to the ink) */
      mix-blend-mode: multiply;
      transition: width var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        height var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        left var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        top var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        translate var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
    }
    /* the front plate — ink-brand-dark, the pool's body. Closed it
       sits at the stack origin in every corner (the uniform
       arrangement); only the open pose mirrors */
    .plate-front {
      position: absolute;
      left: 0;
      top: 0;
      box-sizing: border-box;
      width: var(--glaphic-pool-menu-trigger-width, 65px);
      height: var(--glaphic-pool-menu-trigger-height, 48px);
      border-radius: var(--glaphic-radius-base, 2px);
      background: var(--glaphic-pool-menu-surface, var(--glaphic-ink-brand-dark, #a6022a));
      /* the front plate prints too — over the twin in their overlap
         (the ink read) and over the page's content when it grows */
      mix-blend-mode: multiply;
      transition: width var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        height var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        left var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        top var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1),
        translate var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
    }
    /* OPEN POSES. The film read at panel scale — the closed pose
       scaled up: both plates at panel size, the twin offset by
       -panel-offset-inline/-block along the peek (growth) direction
       (Eliot: open must read as "both of the plates diagonally
       overlapping into a single dark plate", like the film button —
       the ink plate with the red's sliver on the anti-growth side
       and the fluro's fringe on the growth side, the crossed X
       inside the printed overlap). The offsets are the closed
       formulas with the panel dimensions: each plate keeps its
       closed edge through the whole growth. */
    :host([open]) .plate-back {
      width: var(--glaphic-pool-menu-panel-width, 308px);
      height: var(--glaphic-pool-menu-panel-height, 454px);
      left: calc(max(var(--_peek-x), 0) * var(--glaphic-pool-menu-panel-offset-inline, 8px));
      top: calc(max(var(--_peek-y), 0) * var(--glaphic-pool-menu-panel-offset-block, 8px));
    }
    :host([open]) .plate-front {
      width: var(--glaphic-pool-menu-panel-width, 308px);
      height: var(--glaphic-pool-menu-panel-height, 454px);
      left: calc(max(calc(-1 * var(--_peek-x)), 0) * var(--glaphic-pool-menu-panel-offset-inline, 8px));
      top: calc(max(calc(-1 * var(--_peek-y)), 0) * var(--glaphic-pool-menu-panel-offset-block, 8px));
    }
    /* hover — the film-button read: the misregistration flips corner
       and the plates SWAP PLACES (the front plate slides onto the
       twin's offset, the twin slides back to the front's). The
       closed pose is UNMIRRORED in every corner now — the front
       plate sits at the stack origin, the twin +4px behind — so the
       swap is the plain uniform read in every corner: front +off,
       twin -off, bars +label-shift. The blend never changes. Closed
       pose only — the grown panel never wobbles. The [force-hover]
       mirror exists because synthetic hover can't fire the :hover
       pseudo during tests. */
    :host(:hover:not([open])) .plate-front,
    :host([force-hover]:not([open])) .plate-front {
      translate: var(--glaphic-pool-menu-trigger-offset, 4px)
        var(--glaphic-pool-menu-trigger-offset, 4px);
    }
    :host(:hover:not([open])) .plate-back,
    :host([force-hover]:not([open])) .plate-back {
      translate: calc(-1 * var(--glaphic-pool-menu-trigger-offset, 4px))
        calc(-1 * var(--glaphic-pool-menu-trigger-offset, 4px));
    }
    /* the bars follow too — the film-button read on the trigger's
       own glyphs: a 2px ride in the front plate's swap direction */
    .lines {
      translate: 0 0;
      transition: translate var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
    }
    :host(:hover:not([open])) .lines,
    :host([force-hover]:not([open])) .lines {
      translate: var(--glaphic-pool-menu-label-shift, 2px)
        var(--glaphic-pool-menu-label-shift, 2px);
    }
    /* the panel's items: giant display copy ABOVE the plates — OUT of
       the multiplied plates (inside they would print through the
       blend: paper × the fluro underside reads as mint), so the
       sheet is a sibling that prints UNBLENDED paper, matching the
       X (Eliot: "the color of the text should match the x button").

       The sheet's box is the ink plate's box, pushed past the patch
       strip on the patch BLOCK side (the state-constant formulas
       below: whatever the size, the corners hold — closed it
       collapses into the patch where it never paints) and trimmed
       by the twin's fringe on the growth sides. Entries never sit
       under the X. */
    .items {
      position: absolute;
      inset: calc(
          max(var(--_peek-y), 0) * var(--_patch-extent) +
            max(calc(-1 * var(--_peek-y)), 0) *
            var(--glaphic-pool-menu-panel-offset-block, 8px)
        )
        calc(max(var(--_peek-x), 0) * var(--glaphic-pool-menu-panel-offset-inline, 8px))
        calc(
          max(calc(-1 * var(--_peek-y)), 0) * var(--_patch-extent) +
            max(var(--_peek-y), 0) * var(--glaphic-pool-menu-panel-offset-block, 8px)
        )
        calc(max(calc(-1 * var(--_peek-x)), 0) * var(--glaphic-pool-menu-panel-offset-inline, 8px));
      box-sizing: border-box;
      padding: var(--glaphic-pool-menu-item-start, 16px) var(--glaphic-pool-menu-item-inset, 24px)
        var(--glaphic-pool-menu-item-end, 16px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--glaphic-pool-menu-item-gap, 36px);
      overflow: hidden;
      visibility: hidden;
      pointer-events: none;
    }
    :host([open]) .items {
      visibility: visible;
      pointer-events: auto;
    }
    ::slotted(a),
    ::slotted(button) {
      display: block;
      padding: 0;
      border: none;
      background: none;
      font-family: var(--glaphic-font-family-disp, 'Space Grotesk', sans-serif);
      font-size: var(--glaphic-pool-menu-item-size, 25px);
      line-height: 1;
      font-weight: 500;
      letter-spacing: 0.01em;
      text-decoration: none;
      white-space: nowrap;
      text-align: left;
      color: var(--glaphic-pool-menu-item-ink, var(--glaphic-neutral-paper, #f2f5eb));
      cursor: pointer;
      /* the slide-in from the inspiration nav's 40px read. The
         mirror's FROM pose is closed-only ([anchor][not(open)]) —
         at equal specificity the plain media-width mirror would
         out-rank the open rule's arrival-to-zero below it in this
         sheet and hold the open entries off the sheet's left clip */
      translate: var(--glaphic-pool-menu-item-slide, 40px) 0;
      transition: translate var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: var(--glaphic-pool-menu-stagger, 0ms);
    }
    /* slotted entries come from the LIGHT dom — the slide-in pose is
       keyed to the wrapper's open attribute instead. Right-anchored
       corners slide the entries in from off the panel's far (left)
       edge. */
    :host([anchor='top-right']) ::slotted(a),
    :host([anchor='top-right']) ::slotted(button),
    :host([anchor='bottom-right']) ::slotted(a),
    :host([anchor='bottom-right']) ::slotted(button) {
      translate: calc(var(--glaphic-pool-menu-item-slide, 40px) * -1) 0;
    }
    :host([open]) ::slotted(a),
    :host([open]) ::slotted(button) {
      translate: 0 0;
    }
    ::slotted(a[data-hover]),
    ::slotted(button[data-hover]) {
      color: var(--glaphic-pool-menu-item-hover-ink, var(--glaphic-ink-brand-fluro, #14f1c8));
    }
    /* the trigger patch and the bar pair sit on the stacking corner —
       the corner the panel opens away from (mirrored corners flip the
       axes; bottom corners bottom-anchor, right corners right-anchor) */
    :host([anchor='top-right']) .trigger,
    :host([anchor='bottom-right']) .trigger {
      left: auto;
      right: 0;
    }
    :host([anchor='bottom-left']) .trigger,
    :host([anchor='bottom-right']) .trigger {
      top: auto;
      bottom: 0;
    }
    /* the persistent trigger — the patch the plates sit on stays put
       when the panel grows, so the toggle keeps its place and focus */
    .trigger {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: calc(
        var(--glaphic-pool-menu-trigger-width, 65px) + var(--glaphic-pool-menu-trigger-offset, 4px)
      );
      height: calc(
        var(--glaphic-pool-menu-trigger-height, 48px) + var(--glaphic-pool-menu-trigger-offset, 4px)
      );
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      transition: transform 250ms ease-in-out;
    }
    .trigger:focus-visible {
      outline: 2px solid var(--glaphic-ui-focus, #8447ff);
      outline-offset: 2px;
    }
    .trigger:active {
      translate: 1px 1px;
    }
    /* the two lines — the pool's bars closed, the X open. They ride
       the trigger patch: the anchor flips which edge they hang off */
    .lines {
      display: flex;
      flex-direction: column;
      gap: calc(
        var(--glaphic-pool-menu-line-pitch, 10px) - var(--glaphic-pool-menu-line-size, 4px)
      );
      position: absolute;
      left: 12px;
      top: var(--glaphic-pool-menu-line-first, 17px);
      pointer-events: none;
    }
    :host([anchor='top-right']) .lines,
    :host([anchor='bottom-right']) .lines {
      left: auto;
      right: 12px;
    }
    :host([anchor='bottom-left']) .lines,
    :host([anchor='bottom-right']) .lines {
      top: auto;
      bottom: var(--glaphic-pool-menu-line-first, 17px);
    }
    :host([open][anchor='bottom-right']) .trigger {
      transform: translateY(-12px);
    }
    .lines i {
      display: block;
      width: var(--glaphic-pool-menu-line-width, 44px);
      height: var(--glaphic-pool-menu-line-size, 4px);
      background: var(--glaphic-pool-menu-line-ink, var(--glaphic-neutral-paper, #f2f5eb));
      transform-origin: center;
      transition: transform var(--glaphic-pool-menu-motion, 0.35s) cubic-bezier(0.4, 0, 0.2, 1);
    }
    :host([open]) .lines i:first-child {
      /* the cross: each bar slides half the pitch TOWARD the pair's
         center (never flipped — a diverging pair crosses off-center,
         and a ✕ is symmetric, so the rotation carries no anchor
         chirality), then the pair turns 45° the two ways */
      transform: translateY(calc(var(--glaphic-pool-menu-line-pitch, 10px) / 2)) rotate(45deg);
    }
    :host([open]) .lines i:last-child {
      transform: translateY(calc(var(--glaphic-pool-menu-line-pitch, 10px) * -1 / 2)) rotate(-45deg);
    }
    @media (prefers-reduced-motion: reduce) {
      .stack,
      .plate-back,
      .plate-front,
      .lines,
      .lines i {
        transition: none !important;
      }
      ::slotted(a),
      ::slotted(button) {
        transition: none !important;
        translate: none !important;
      }
    }
    /* small screens — at phone widths the open panel's entries read
       too tight, so ONLY the item-tier fallbacks grow here (32px type,
       40px pitch, a 48px slide that keeps the slide proportional to
       the type; the split matches the consuming site's own 899px
       breakpoint). Just the fallbacks swap, so author-set knobs still
       win, and measurePanel() reads the resolved computed values, so
       the measured panel grows with the type. The closed trigger pose
       is knob-bound separately — no small-screen rule touches it. */
    @media (max-width: 899px) {
      .items {
        gap: var(--glaphic-pool-menu-item-gap, 40px);
      }
      ::slotted(a),
      ::slotted(button) {
        font-size: var(--glaphic-pool-menu-item-size, 32px);
        translate: var(--glaphic-pool-menu-item-slide, 48px) 0;
      }
      /* the mirrored FROM pose stays closed-only here too — open
         entries release to translate 0, the sheet's clip keeps the
         off-slide never painted anyway */
      :host([anchor='top-right']:not([open])) ::slotted(a),
      :host([anchor='top-right']:not([open])) ::slotted(button),
      :host([anchor='bottom-right']:not([open])) ::slotted(a),
      :host([anchor='bottom-right']:not([open])) ::slotted(button) {
        translate: calc(var(--glaphic-pool-menu-item-slide, 48px) * -1) 0;
      }
    }
  `;

  protected render() {
    /* the measured size rides the stack as inline vars — it only
       lands when the author hasn't pinned -panel-width/height */
    const panelVars =
      this.open && this.panelWidth > 0 && this.panelHeight > 0
        ? `--glaphic-pool-menu-panel-width: ${this.panelWidth}px; --glaphic-pool-menu-panel-height: ${this.panelHeight}px;`
        : '';
    return html`
      <div class="stack" part="stack" style=${panelVars}>
        <span class="plate-back" part="back" aria-hidden="true"></span>
        <span class="plate-front" part="front"></span>
        <span class="items" part="items" role="navigation" aria-label=${this.label}><slot></slot></span>
        <button
          class="trigger"
          type="button"
          aria-label=${this.label}
          aria-expanded=${this.open ? 'true' : 'false'}
        >
          <span class="lines" aria-hidden="true"><i></i><i></i></span>
        </button>
      </div>
    `;
  }
}

customElements.define('glaphic-pool-menu', GlaphicPoolMenu);

declare global {
  interface HTMLElementTagNameMap {
    'glaphic-pool-menu': GlaphicPoolMenu;
  }
}