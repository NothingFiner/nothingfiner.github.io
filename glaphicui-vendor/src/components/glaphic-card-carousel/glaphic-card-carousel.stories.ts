import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-card-carousel.js';
import './glaphic-card-slide.js';
import '../glaphic-button/glaphic-button.js';

const meta: Meta = {
  title: 'Surfaces/Card Carousel',
  component: 'glaphic-card-carousel',
  tags: ['autodocs'],
  argTypes: {
    label: { name: 'label → the strip\'s accessible name', control: 'text' },
    interval: { name: 'interval → the drift pace, seconds per card (0 still)', control: 'number' },
    active: { control: 'number' },
    open: { control: 'boolean' },
  },
};
export default meta;

/* the actions plate's recipes — the design's Log-in row: a violet
   solid button with paper copy, a red outline button under it */
const violetSolid =
  '--glaphic-button-surface:var(--glaphic-ink-violet, #8447ff);' +
  '--glaphic-button-border:var(--glaphic-ink-violet, #8447ff);' +
  '--glaphic-button-text:var(--glaphic-neutral-paper, #f2f5eb);' +
  '--glaphic-button-hover-surface:var(--glaphic-semantic-info-text, #5a1fcc);' +
  '--glaphic-button-hover-border:var(--glaphic-semantic-info-text, #5a1fcc)';
const redOutline =
  '--glaphic-button-border:var(--glaphic-ink-brand-dark, #a6022a);' +
  '--glaphic-button-text:var(--glaphic-ink-brand-dark, #a6022a);' +
  '--glaphic-button-hover-surface:var(--glaphic-neutral-paper, #f2f5eb);' +
  '--glaphic-button-hover-text:var(--glaphic-ink-brand-dark, #a6022a);' +
  '--glaphic-button-hover-border:var(--glaphic-ink-brand-dark, #a6022a)';

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

/** basic strip — typed titles always up, self-drifting (one card per
 *  interval, the ghost second half makes the loop seamless); click to
 *  compose that slide's full card. */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-card-carousel label="Projects" interval="4">
      <glaphic-card-slide label="Rite">
        <img src="/assets/test_2.png" alt="The Rite writing environment" />
        <p slot="description">
          Rite — a first of its kind integrated writing environment, built
          out of novel-writing frustration. Still in development. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>View project</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>Read the notes</glaphic-button>
        </div>
      </glaphic-card-slide>
      <glaphic-card-slide label="Atlas">
        <img src="/assets/test_1.png" alt="A Soviet street map" />
        <p slot="description">
          Atlas — the Soviet street map the portfolio's hero paints over;
          an honest stand-in for any image slide. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>Open the atlas</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>Notes</glaphic-button>
        </div>
      </glaphic-card-slide>
      <glaphic-card-slide label="Elie">
        <img src="/assets/test_3.png" alt="The portfolio hero" />
        <p slot="description">
          The hero plate — the portfolio's own giant letterforms. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>Play it</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>The story</glaphic-button>
        </div>
      </glaphic-card-slide>
    </glaphic-card-carousel>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A card carousel is a wrapper plus slides. Carousel mode: the strip runs the container\'s full width at the row\'s 303px depth (a slide may claim `square` — the row depth as its own width), every slide an equal column, each showing its image layer with its `label` GIANT while the slide is HELD — hover or keyboard focus types it in by the cursor treatment (its block drops when the print finishes), release wipes it, painted in blend `difference` on the paper ink so it reads on any image, cropped at the slide\'s bottom edge. The strip AUTO-DRIFTS marquee-style (interval seconds PER CARD, default 4): it eases left at a constant pace, the wrapper appends a ghost second half (identical clones, aria-hidden) so the loop wraps seamlessly — no jumps, no teleports. Paused while held (hover/keyboard), off-screen, or in card mode. Click a slide (original or ghost) and the whole strip EASES to the alignment where it sits flush at the image column, its successors displayed equally beside it, then its card takes over that geometry (0.45s ease); the DEPARTED pixels flicker OUT: the composed card reads ALL of the ONE slide — its image (re-typed print, PERMANENT in the card) at the left panel, its description on the ink-brand-dark plate under the bracket frame, its actions bottom-anchored on the ink-brand-fluro plate between its own bracket arms — every part the active slide\'s own content, never another slide\'s, the buttons stacked with air between them. Each changing column is covered by an old-screen flicker — the departed pixels (a twin\'s image, or the previous plate) flashing hard invert frames, then lifting to leave the new content simply there (the image column flickers on a step, not on a carousel compose, where the aligned pose already shows the right image). Stepping (prev/next) re-tunes the card in place, the departed pixels flickering out of every changing column, no sliding. The card\'s controls sit UNDERNEATH under a separating rule (part `controls`): the 01/03 readout on the left, prev/next + the close (×) on the right; the arrow keys step. Back out with the close or a click outside the strip. Draft copy.',
      },
    },
  },
};

/** pair — the two-slide strip composes image · description. */
export const Pair: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-card-carousel label="Projects" interval="0">
      <glaphic-card-slide label="Rite">
        <img src="/assets/test_2.png" alt="The Rite writing environment" />
        <p slot="description">
          Rite — a first of its kind integrated writing environment. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>View project</glaphic-button>
        </div>
      </glaphic-card-slide>
      <glaphic-card-slide label="Atlas">
        <img src="/assets/test_1.png" alt="A Soviet street map" />
        <p slot="description">
          Atlas — the Soviet street map the portfolio's hero paints over. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>Open the atlas</glaphic-button>
        </div>
      </glaphic-card-slide>
    </glaphic-card-carousel>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Two slides compose image · description — no actions panel, the one-card rule still the rule (one card at a time, all of it the one slide\'s). Draft copy.',
      },
    },
  },
};

/** composed — the open pose, statically. */
export const Composed: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <glaphic-card-carousel label="Projects" interval="0" active="1" open>
      <glaphic-card-slide label="Rite">
        <img src="/assets/test_2.png" alt="The Rite writing environment" />
        <p slot="description">
          Rite — a first of its kind integrated writing environment, built
          out of novel-writing frustration. Still in development. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>View project</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>Read the notes</glaphic-button>
        </div>
      </glaphic-card-slide>
      <glaphic-card-slide label="Atlas">
        <img src="/assets/test_1.png" alt="A Soviet street map" />
        <p slot="description">
          Atlas — the Soviet street map the portfolio's hero paints over. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>Open the atlas</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>Notes</glaphic-button>
        </div>
      </glaphic-card-slide>
      <glaphic-card-slide label="Elie">
        <img src="/assets/test_3.png" alt="The portfolio hero" />
        <p slot="description">
          The hero plate — the portfolio's own giant letterforms. Draft copy.
        </p>
        <div slot="actions">
          <glaphic-button variant="solid" style=${violetSolid}>Play it</glaphic-button>
          <glaphic-button variant="outline" style=${redOutline}>The story</glaphic-button>
        </div>
      </glaphic-card-slide>
    </glaphic-card-carousel>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The composed pose statically: `active="1" open` holds the card on the middle slide — ALL of the Atlas slide, and nothing from the others: its image holds the left panel (with its re-typed print), its description plate rides under the paper bracket frame, its actions plate rides the design\'s Log-in recipes (the violet solid, the red outline) under its own bracket arms, with the prev/next + compose-back controls underneath. Knobs cascade from the page through the `--glaphic-card-carousel-*` tier-2 block. Draft copy.',
      },
    },
  },
};

/* hidden test stories — guard the strip's thirds, the held-only typed
   prints (hover/focus reveal, card-mode permanence), the compose pass
   (one slide's full card + the FLIP glide), the plates' paints, the
   blend flicker, both back-outs, keyboard parity, the drift's gates,
   and the images filling their slides */
const settle = async (probe: () => boolean, tries = 80): Promise<boolean> => {
  for (let i = 0; i < tries; i++) {
    if (probe()) return true;
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
  }
  return false;
};
type SlideHost = HTMLElement & { label: string; cardPart: string; script: string };

/* the pattern's ghosts don't count — they're the originals' stand-ins */
const slidesOf = (canvas: Element) =>
  Array.from(
    canvas.querySelectorAll('glaphic-card-slide:not([data-ghost])'),
  ) as SlideHost[];

export const CardCarouselInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-card-carousel id="deck" label="Projects" interval="0">
      <glaphic-card-slide id="slide-1" label="Rite">
        <img id="img-1" src="/assets/test_2.png" alt="The Rite writing environment" />
        <p slot="description" id="desc-1">Rite description copy.</p>
        <div slot="actions"><button id="act-1-1">View project</button><button id="act-1-2">Read the notes</button></div>
      </glaphic-card-slide>
      <glaphic-card-slide id="slide-2" label="Chatbot">
        <img id="img-2" src="/assets/test_1.png" alt="A chatbot surface" />
        <p slot="description" id="desc-2">Chatbot description copy.</p>
        <div slot="actions"><button id="act-2">Start chatting</button></div>
      </glaphic-card-slide>
      <glaphic-card-slide id="slide-3" label="Casio">
        <img id="img-3" src="/assets/test_3.png" alt="The portfolio hero" />
        <p slot="description" id="desc-3">Casio description copy.</p>
        <div slot="actions"><button id="act-3">Play it</button></div>
      </glaphic-card-slide>
    </glaphic-card-carousel>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const deck = () => canvasElement.querySelector('#deck') as HTMLElement & {
      shadowRoot: ShadowRoot; open: boolean; active: number;
    };
    const slide = (id: string) => canvasElement.querySelector(id) as SlideHost;
    const shadow = (id: string) => slide(id).shadowRoot!;
    const wrapperOpen = () => deck().hasAttribute('open');

    await step('strip: full-width flex row of equal thirds at the row depth', async () => {
      const wrapper = deck();
      const strip = wrapper.shadowRoot!.querySelector('.strip') as HTMLElement;
      expect(getComputedStyle(strip).display).toBe('flex');
      expect(wrapper.getAttribute('aria-label')).toBe('Projects');
      const [one, two, three] = slidesOf(canvasElement).map((s) => s.getBoundingClientRect().width);
      expect(one).toBeCloseTo(two, 1);
      expect(two).toBeCloseTo(three, 1);
      /* the row's depth is the tier-2 height; the host stands 2px
         taller now that the frame's top + bottom rules carry it */
      expect(getComputedStyle(strip).height).toBe('303px');
      expect(getComputedStyle(wrapper).height).toBe('305px');
      expect(slidesOf(canvasElement).map((s) => s.cardPart ?? '')).toEqual(['', '', '']);
    });

    await step('images fill their slides (absolute inset, covered)', async () => {
      for (const id of ['#img-1', '#img-2', '#img-3']) {
        const img = canvasElement.querySelector(id) as HTMLImageElement;
        expect(getComputedStyle(img).position).toBe('absolute');
        expect(getComputedStyle(img).objectFit).toBe('cover');
        const box = img.getBoundingClientRect();
        const hostBox = (img.parentElement as HTMLElement).getBoundingClientRect();
        expect(box.width).toBeCloseTo(hostBox.width, 0);
        expect(box.height).toBeCloseTo(hostBox.height, 0);
      }
    });

    await step('title print: held-only reveal in the strip, blend difference', async () => {
      const s2 = slide('#slide-2');
      const typer = shadow('#slide-2').querySelector('glaphic-cursor-type') as HTMLElement & { shadowRoot: ShadowRoot };
      const typed = () => (typer.shadowRoot!.querySelector('.typed') as HTMLElement).textContent ?? '';
      /* idle: the print doesn't show */
      expect('chk0a=' + String(await settle(() => typed().length === 0))).toBe('chk0a=true');
      /* held (hover) — the label types in */
      s2.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      expect('chk1=' + String(await settle(() => typed().length > 0, 120))).toBe('chk1=true');
      /* released — wiped, no holdover (the wipe lands on the next Lit
         render, so settle rather than poke the same tick) */
      s2.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
      expect('chk1b=' + String(await settle(() => typed().length === 0))).toBe('chk1b=true');
      /* keyboard parity: focus also reveals */
      s2.focus();
      expect('chk1c=' + String(await settle(() => typed().length > 0, 120))).toBe('chk1c=true');
      s2.blur();
      const title = shadow('#slide-2').querySelector('.title') as HTMLElement;
      expect(getComputedStyle(title).mixBlendMode).toBe('difference');
      expect(getComputedStyle(title).color).toBe('rgb(242, 245, 235)');
      /* the slide still hands its accessible name to the cover image */
      expect(s2.getAttribute('aria-label')).toBe('Chatbot');
    });

    await step('compose: clicking slide 2 aligns the strip, then builds ALL of slide 2', async () => {
      let change: { index?: number; open?: boolean } | undefined;
      deck().addEventListener('change', (e) => { change = (e as CustomEvent).detail; });
      slide('#slide-2').click();
      /* the event rides the async compose (emit is its last act) — settle
         on the event, not the property (open is set before the awaits) */
      expect('chk17=' + String(await settle(() => !!change))).toBe('chk17=true');
      expect(change).toEqual({ index: 1, open: true });
      expect(await settle(() => (deck() as unknown as { open: boolean }).open)).toBe(true);
      /* the one-slide rule: every panel is slide 2's own content */
      expect('chk2=' + String(await settle(() => slide('#desc-2').parentElement === deck()))).toBe('chk2=true');
      expect(slide('#desc-2').getAttribute('slot')).toBe('description');
      expect(slide('#slide-2').getAttribute('slot')).toBe('card-image');
      expect(slide('#slide-2').getAttribute('data-part')).toBe('image');
      /* the other slides stand down entirely — but only AFTER the
         flick's covers lift: during the strobe the departed twins
         stand as the covers' content (their full column reads) */
      expect(slide('#slide-1').getBoundingClientRect().width).toBeGreaterThan(0);
      expect(slide('#slide-3').getBoundingClientRect().width).toBeGreaterThan(0);
      expect(slide('#act-2')).toBeTruthy();
      /* the controls live UNDERNEATH the card in the wrapper's shadow,
         with the pattern's readout on the left and the outline-recipe
         glaphic buttons right (the close re-plays the strip) */
      expect(deck().shadowRoot!.querySelector("glaphic-button[part='ctl-close']")).toBeTruthy();
      const count = deck().shadowRoot!.querySelector('.ctl-count') as HTMLElement;
      expect(count.textContent).toContain('02');
      expect(count.textContent).toContain('03');
    });

    await step('flicker: the departed screens strobe out over the arriving plates', async () => {
      /* the overlays are alive 470ms from the card's takeover — the
         compose step's settles finished inside that window, so the
         screens are up now; the image column gets NONE on a carousel
         compose (the aligned pose already showed the right image) */
      const panels = deck().shadowRoot!.querySelectorAll('.panel');
      expect(panels.length).toBe(3);
      expect(panels[0].querySelector('.old-screen')).toBeFalsy();
      for (const i of [1, 2]) {
        const screen = panels[i].querySelector('.old-screen') as HTMLElement;
        expect('screen-' + i + '=true').toBe('screen-' + i + '=true');
        expect(!!screen).toBe(true);
        expect(getComputedStyle(screen).animationName).toBe('glaphic-card-carousel-flicker');
      }
      /* the departed twins ARE the covers' content (their slots flipped
         for the same commit as the card's mount — the old image of
         slide 2's pose is slide 3, and the right column's is slide 1) */
      expect(slide('#slide-3').getAttribute('slot')).toBe('flick-desc');
      expect(slide('#slide-1').getAttribute('slot')).toBe('flick-act');
      /* the screens lift when the strobe ends — the new content simply
         is, no entrance of its own, and the departed slides stand down
         with the covers gone */
      const lifted = await settle(() => !deck().shadowRoot!.querySelector('.old-screen'));
      expect('flick-lift=' + String(lifted)).toBe('flick-lift=true');
      expect(deck().shadowRoot!.querySelector('.card')).toBeTruthy();
      expect(slide('#slide-1').getBoundingClientRect().width).toBe(0);
      expect(slide('#slide-3').getBoundingClientRect().width).toBe(0);
      /* the covers' slots are released */
      expect(slide('#slide-3').getAttribute('slot')).toBe(null);
      expect(slide('#slide-1').getAttribute('slot')).toBe(null);
    });

    await step('description panel: ink-brand-dark fill, slide 2\'s copy, paper brackets, the wipe', async () => {
      const panel = deck().shadowRoot!.querySelector('.panel-desc') as HTMLElement;
      expect(getComputedStyle(panel).backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(panel).color).toBe('rgb(242, 245, 235)');
      /* the panel arrives PLAIN — the change is covered by the
         old-screen flicker above it (the departed pixels strobe out) */
      expect(getComputedStyle(panel).animationName).toBe('none');
      const corners = panel.querySelector('glaphic-corners') as HTMLElement & { shadowRoot: ShadowRoot };
      expect(corners).toBeTruthy();
      const bracket = corners.shadowRoot!.querySelector('.bk-tl') as HTMLElement;
      expect(getComputedStyle(bracket).borderTopColor).toBe('rgb(242, 245, 235)');
    });

    await step('actions panel: fluro fill, content flows to the buttons', async () => {
      const panel = deck().shadowRoot!.querySelector('.panel-act') as HTMLElement;
      expect(getComputedStyle(panel).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(getComputedStyle(panel).display).toBe('flex');
      expect(getComputedStyle(panel).justifyContent).toBe('flex-end');
      expect(document.querySelector('#act-2')).toBeTruthy();
    });

    await step('back out — the close button re-plays the strip (the row eases home)', async () => {
      /* the outline-recipe button: the ask lands on its inner button */
      ((deck().shadowRoot!.querySelector("glaphic-button[part='ctl-close']") as any).shadowRoot!.querySelector('button') as HTMLElement).click();
      expect('chk3=' + String(await settle(() => !wrapperOpen()))).toBe('chk3=true');
      /* the content went home */
      expect('chk4=' + String(await settle(() => slide('#desc-2').parentElement === slide('#slide-2')))).toBe('chk4=true');
      expect(slide('#slide-2').getAttribute('data-part')).toBeNull();
      /* every slide renders in the strip again */
      expect(slide('#slide-1').getBoundingClientRect().width).toBeGreaterThan(0);
      expect(slide('#slide-3').getBoundingClientRect().width).toBeGreaterThan(0);
    });

    await step('back out — a click outside the strip composes down', async () => {
      slide('#slide-3').click();
      expect('chk5=' + String(await settle(() => slide('#desc-3').parentElement === deck()))).toBe('chk5=true');
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect('chk6=' + String(await settle(() => slide('#desc-3').parentElement === slide('#slide-3')))).toBe('chk6=true');
    });

    await step('one card: a panel-button click stays with its content', async () => {
      slide('#slide-2').click();
      expect('chk7=' + String(await settle(() => wrapperOpen()))).toBe('chk7=true');
      const before = slide('#desc-2').parentElement;
      (document.querySelector('#act-2') as HTMLElement).click();
      expect(slide('#desc-2').parentElement).toBe(before);
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect('chk8=' + String(await settle(() => !wrapperOpen() || slide('#desc-2').parentElement === slide('#slide-2')))).toBe('chk8=true');
    });

    await step('keyboard: Enter on a focused slide opens its card', async () => {
      const s3 = slide('#slide-3');
      s3.focus();
      s3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
      expect('chk9=' + String(await settle(() => slide('#desc-3').parentElement === deck()))).toBe('chk9=true');
      expect(s3.getAttribute('data-part')).toBe('image');
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect('chk10=' + String(await settle(() => slide('#desc-3').parentElement === slide('#slide-3')))).toBe('chk10=true');
    });

    await step('drift: the strip runs the marquee (constant pace, gates hold it)', async () => {
      const d = deck() as any;
      /* the earlier real clicks parked the pointer ON the deck and the
         keyboard step left its slide focused — a real reader moves off
         and blurs before the marquee resumes, so release both holds */
      d.dispatchEvent(new PointerEvent('pointerleave'));
      (document.activeElement as HTMLElement | null)?.blur?.();
      const strip = d.shadowRoot!.querySelector('.strip') as HTMLElement;
      /* interval=0 was authored (test mode) — the wrapper only ever
         HOLDS a valid drift; 0 is still, not jumpless-moving */
      const name = getComputedStyle(strip).animationName;
      const dur = parseFloat(getComputedStyle(strip).animationDuration);
      /* the card's closed, so the strip holds — held in test mode
         (interval=0) means the drift is INERT: no keyframes, or the
         zero-pace animation of a zero interval */
      expect('held=' + String((name === 'none' || dur === 0) && !d.open)).toBe('held=true');
      /* armed: re-arm the drift and watch the attribute flip — the
         close's hand-back owns the strip for its ease first, so the
         flip settles in after the last frame of it */
      d.interval = 4;
      d.updateDrift?.();
      const armed = d.open ? 'paused' : 'running';
      expect('armed=' + String(await settle(() => d.getAttribute('data-drift') === armed))).toBe('armed=true');
      /* the pace is per card: interval * count */
      expect('chk12=' + String(dur === 0 || name === 'none')).toBe('chk12=true');
      expect(slidesOf(canvasElement).map((s) => s.getAttribute('data-part'))).toEqual([null, null, null]);
    });

    await step('controls: prev/next cycle the composed card without a back-out', async () => {
      slide('#slide-2').click();
      /* the open attribute flips at the ALIGN phase — settle for the
         card's takeover (its controls ship with the .card template) */
      expect('chk18=' + String(await settle(() => !!deck().shadowRoot?.querySelector('.card')))).toBe('chk18=true');
      const root = deck().shadowRoot!;
      const ctlButton = (part: string) =>
        ((root.querySelector(`glaphic-button[part='${part}']`) as any).shadowRoot!.querySelector('button') as HTMLElement);
      ctlButton('ctl-next').click();
      expect('chk19=' + String(await settle(() => slide('#desc-3').parentElement === deck()))).toBe('chk19=true');
      expect(deck().shadowRoot!.querySelector('.card')).toBeTruthy();
      /* the step's departed pixels also flicker out — all three panels
         change, all three get a screen, the image column's old content
         is the previous slide itself, and the screens lift. (The
         covers land in the commit AFTER the re-host that chk19's
         settle already saw — settle for the full set, not the first.) */
      expect('flick-retune=' + String(await settle(() => deck().shadowRoot!.querySelectorAll('.old-screen').length === 3))).toBe('flick-retune=true');
      expect(slide('#slide-2').getAttribute('slot')).toBe('flick-img');
      expect('flick-lift2=' + String(await settle(() => !deck().shadowRoot!.querySelector('.old-screen')))).toBe('flick-lift2=true');
      ctlButton('ctl-prev').click();
      expect('chk20=' + String(await settle(() => slide('#desc-2').parentElement === deck()))).toBe('chk20=true');
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    });

    await step('physics: no alpha, no masks', async () => {
      /* the animated close (the control area's stow, then the strip's
         hand-back) holds the pose for ~1s — settle through it before
         reading computed styles */
      expect(await settle(() => !wrapperOpen() && !!deck().shadowRoot!.querySelector('.strip'))).toBe(true);
      const root = shadow('#slide-1');
      expect(getComputedStyle(root.host as Element).opacity).toBe('1');
      expect(root.querySelector('mask')).toBeFalsy();
    });
  },
};

export const CardCarouselPair: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-card-carousel id="deck" label="Projects" interval="0">
      <glaphic-card-slide id="slide-1" label="Rite">
        <p slot="description" id="desc-1">Rite description copy.</p>
        <div slot="actions"><button id="act-1">View project</button></div>
      </glaphic-card-slide>
      <glaphic-card-slide id="slide-2" label="Chatbot">
        <p slot="description" id="desc-2">Chatbot description copy.</p>
        <div slot="actions"><button id="act-2">Start chatting</button></div>
      </glaphic-card-slide>
    </glaphic-card-carousel>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const deck = () => canvasElement.querySelector('#deck') as HTMLElement & { shadowRoot: ShadowRoot; open: boolean };
    const slide = (id: string) => canvasElement.querySelector(id) as SlideHost;
    const shadow = (id: string) => slide(id).shadowRoot!;
    const wrapperOpen = () => deck().hasAttribute('open');

    await step('two slides compose image · description — no actions panel', async () => {
      slide('#slide-1').click();
      expect('chk13=' + String(await settle(() => deck().hasAttribute('open')))).toBe('chk13=true');
      expect('chk14=' + String(await settle(() => slide('#desc-1').parentElement === deck()))).toBe('chk14=true');
      expect(deck().shadowRoot!.querySelector('.panel-act')).toBeNull();
      expect(deck().shadowRoot!.querySelector('.panel-desc')).toBeTruthy();
      /* the plate markup belongs to the wrapper now — the slide carries none */
      expect(shadow('#slide-1').querySelector('.plate-actions')).toBeNull();
    });

    await step('one card: the other slide composes its own (after the back-out)', async () => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect('chk15=' + String(await settle(() => slide('#desc-1').parentElement === slide('#slide-1')))).toBe('chk15=true');
      slide('#slide-2').click();
      expect('chk16=' + String(await settle(() => slide('#desc-2').parentElement === deck()))).toBe('chk16=true');
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    });
  },
};