import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import React from 'react';
import { Title, Stories } from '@storybook/addon-docs/blocks';
import './glaphic-wipe.js';

const meta: Meta = {
  title: 'Overlays/Wipe',
  component: 'glaphic-wipe',
  tags: ['autodocs'],
  argTypes: {
    direction: {
      name: 'direction → the travel (the film enters from the opposite edge)',
      control: 'select',
      options: ['right', 'left', 'up', 'down'],
    },
    dwell: { name: 'dwell → ms the cover holds by itself (0 = the exit waits for release())', control: 'number' },
    phase: { control: false },
  },
  /* the docs page composes the Title plus every story block (its
     name, its prose, its canvas) — the built-in autodocs page doubles
     the primary story, so the custom page stands in for it */
  parameters: {
    docs: {
      page: () =>
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Title),
          React.createElement(Stories),
        ),
    },
  },
};
export default meta;

/* the demo's swap copy — the wiped "page" flips a phrase per pass */
const DEMO_TURNS = [
  'The first page sits here while the film sweeps over it.',
  'The second page — the wipe covered the swap and uncovered the new copy.',
  'And a third, so the pass reads again.',
];

let demoTurn = 0;

const runDemo = (elementId: string, direction?: string, copyId = 'wipe-copy') => {
  const wipe = document.getElementById(elementId) as HTMLElement & {
    run?: () => Promise<void>;
    release?: () => void;
    phase?: string;
  };
  if (!wipe?.run) return;
  /* one film at a time — a click while the pass is running is
     ignored (a queued cycle would flip the copy mid-flight) */
  if (wipe.phase && wipe.phase !== 'idle') return;
  if (direction) (wipe as unknown as { direction: string }).direction = direction;
  /* the swap happens UNDER the cover — the copy flips the moment
     the cover is full (the route-swap instant). No release() here:
     the element's `dwell` holds the cover a beat and then resumes
     the film, so the swap gets a slight wait before the reveal */
  wipe.addEventListener(
    'covered',
    () => {
      demoTurn = (demoTurn + 1) % DEMO_TURNS.length;
      const copy = document.getElementById(copyId);
      if (copy) copy.textContent = DEMO_TURNS[demoTurn];
    },
    { once: true },
  );
  void wipe.run();
};

/* the caption demo — the hold TYPeWRITES: the covered listener does
   nothing (the caption is what holds the cover), the copy flips when
   the print finishes (the route "load" — the content transition
   waits on the writing), a short beat, then release() resumes. The
   component's own caption dwell would also resume alone if the
   release never came */
const runCaptionDemo = () => {
  const wipe = document.getElementById('wipe-cap') as HTMLElement & {
    run?: () => Promise<void>;
    release?: () => void;
    phase?: string;
  };
  if (!wipe?.run) return;
  if (wipe.phase && wipe.phase !== 'idle') return;
  const writer = wipe.querySelector('.writer') as HTMLElement | null;
  writer?.addEventListener(
    'printend',
    () => {
      window.setTimeout(() => {
        const copy = document.getElementById('cap-copy');
        if (copy) copy.textContent = 'New page, written in under the cover.';
        wipe.release?.();
      }, 250);
    },
    { once: true },
  );
  void wipe.run();
};

/* DOCS SECTIONS — hidden in the sidebar. Prose is a draft: the
   section copy is reviewed/edited with the user before merge. */

/** wipe — the pass: film over the page, swap under the cover, out */
export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="padding:56px 48px;max-width:640px">
      <h2
        id="wipe-copy"
        style="font-family:'Space Grotesk',sans-serif;font-size:32px;line-height:1.15;margin:0 0 16px"
      >
        ${DEMO_TURNS[0]}
      </h2>
      <p style="margin:0 0 24px;font:400 14px/1.5 sans-serif">
        <button
          @click=${() => runDemo('wipe-demo')}
          style="font:500 13px sans-serif;padding:10px 18px;cursor:pointer"
        >
          Wipe the page →
        </button>
      </p>
      <glaphic-wipe id="wipe-demo" dwell="400"></glaphic-wipe>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The pass: two viewport-sized plates enter from OPPOSITE edges — the ink-brand-dark front (travels `direction`, here "right": it sweeps in from the left edge) and the ink-brand-fluro twin entering against it from the right. Only the front prints multiply — the page tints through the red film (the pool print) — the twin is a solid fluro plate, and where the front crosses it, red × fluro prints the ink with the mint visibly beneath. The gap between them closes on a center meet; when the cover is full the `covered` event hands the swap to the app — the demo flips its copy right there, INSIDE the cover (an instant route swap), and the `dwell` (400ms here) holds the covered beat before the exit resumes, so the content transition gets a slight wait; the reveal uncovers the NEW copy and the old text never lingers through the pass. The plates then KEEP GOING in their own directions: they cross past each other (the ink print widens to a full-screen pass at full coincidence), pull apart the other way with their sides swapped, the ink unzips to nothing, a center slit opens, and both films slide out the sides they settled on. Nobody ever reverses. The enter leg covers half a viewport over `--glaphic-wipe-motion` (0.6s, ease in); the exit leg covers a viewport and a half at 3× the motion, easing out — a release() in the covered listener chains the legs in the same frame. Tier-2: `--glaphic-wipe-surface` / `-back-surface` / `-offset` / `-motion` / `-enter-easing` / `-exit-easing` / `-z-index`. Draft copy.',
      },
    },
  },
};

/** wipe — the four travel directions off the one pose math */
export const Directions: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="padding:56px 48px">
      <h2 id="dir-copy" style="font-family:'Space Grotesk',sans-serif;font-size:24px;margin:0 0 24px">
        One page, four ways through.
      </h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${['right', 'left', 'up', 'down'].map(
          (dir) => html`<button
            @click=${() => runDemo('wipe-demo-dir', dir)}
            style="font:500 13px sans-serif;padding:8px 14px;cursor:pointer"
          >
            ${dir}
          </button>`,
        )}
      </div>
      <glaphic-wipe id="wipe-demo-dir" direction="left" dwell="400"></glaphic-wipe>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The travel (`direction`): the FRONT plate\'s direction of travel — "right" sweeps the red film in from the left edge with the fluro twin entering the right edge against it, "left" is the mirror, "up" raises the red from the bottom while the fluro descends from the top, "down" the reverse. Every direction is the same three poses over a travel unit vector, the twin negating it — the films enter opposite edges, meet at the center, and swap sides in the pass in every orientation. Draft copy.',
      },
    },
  },
};

/** wipe — the caption hold: the pass pauses at the convergence and
    writes, then continues on its own */
export const Captions: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="padding:56px 48px">
      <h2
        id="cap-copy"
        style="font-family:'Space Grotesk',sans-serif;font-size:24px;margin:0 0 24px"
      >
        The pass holds and types.
      </h2>
      <button
        @click=${() => runCaptionDemo()}
        style="font:500 13px sans-serif;padding:8px 14px;cursor:pointer"
      >
        Wipe with a caption
      </button>
      <glaphic-wipe
        id="wipe-cap"
        caption="loading the next page…"
        style="--glaphic-wipe-caption-size: 24px"
      ></glaphic-wipe>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The caption hold (the `caption` prop): when the cover is full the `covered` event fires as always — and then the hold WRITES. A `glaphic-cursor-type` writer (the terminal block-cursor voice) prints the caption character by character above the plates (centered, unblended paper ink like the pool\'s items — the words sit on the film, never multiplied into it); the block cursor blinks the terminal\'s 1s step during the print. The hold is SELF-DRIVING: after the print finishes it blinks for `--glaphic-wipe-caption-dwell` (600ms) and the exit resumes — no release() needed in this mode (the app can still cut it short, and abort() still cancels). Caption mode\'s covered listener still does the swap — the demo flips its copy only when the WRITING finishes (the route "loads" while the caption types: the content transition waits on it), a 250ms beat, then releases — though the component would resume alone if the release never came. The caption prints only while the write is on (`writing`, a state attribute): the reveal never shows lingering copy. The cadence is `--glaphic-wipe-type-cadence` (60ms/character, the terminal speed); reduced motion prints the caption at once and hard-cuts the reveal. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the parked rig, the enter/cover/exit
   pose math, the swap protocol (covered → release → done), the
   dwell timer, the single-film guard, abort, the four directions,
   the caption hold, and the multiply physics */

export const WipeInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="height:60vh;font:400 14px/1.5 sans-serif;padding:24px">the page under the film</div>
    <glaphic-wipe id="wipe-1" style="--glaphic-wipe-motion: 80ms"></glaphic-wipe>
    <glaphic-wipe id="wipe-2" dwell="100" style="--glaphic-wipe-motion: 80ms"></glaphic-wipe>
    <glaphic-wipe
      id="wipe-3"
      caption="the route swaps under this cover"
      style="--glaphic-wipe-motion: 80ms; --glaphic-wipe-type-cadence: 16ms; --glaphic-wipe-caption-dwell: 60ms"
    ></glaphic-wipe>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const wipe1 = canvasElement.querySelector('#wipe-1') as HTMLElement & {
      run: () => Promise<void>;
      release: () => void;
      abort: () => void;
      direction: string;
      phase: string;
    };
    const wipe2 = canvasElement.querySelector('#wipe-2') as HTMLElement & {
      run: () => Promise<void>;
    };
    const settle = async (probe: () => boolean, tries = 80): Promise<boolean> => {
      for (let i = 0; i < tries; i++) {
        if (probe()) return true;
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
      }
      return false;
    };
    /* light DOM — the plates are the host's own children */
    const front = () => wipe1.querySelector('.plate-front') as HTMLElement;
    const back = () => wipe1.querySelector('.plate-back') as HTMLElement;
    /* a fixed inset-0 plate's box IS the viewport */
    const vw = () => front().offsetWidth;
    const vh = () => front().offsetHeight;
    /* the plate box is the viewport, so the box's rect origin IS
       the resolved translate — computed `translate` keeps the
       percentage/calc form ("-100% 0%", mid-flight "calc(…% +
       …px)") and never resolves to px. Land both on a round-off
       threshold (the bezier tail computes e-8 residues) */
    const near = (el: HTMLElement, x: number, y = 0): boolean => {
      const r = el.getBoundingClientRect();
      return Math.abs(r.x - x) < 0.01 && Math.abs(r.y - y) < 0.01;
    };
    /* the assert flavor of near — a miss dumps the resolved rect
       into the received value (storybook/test's expect ignores a
       custom-message second argument) */
    const assertNear = (label: string, el: HTMLElement, x: number, y = 0, where = '') => {
      const r = el.getBoundingClientRect();
      const ok = Math.abs(r.x - x) < 0.01 && Math.abs(r.y - y) < 0.01;
      expect(ok ? `${label} ok` : `${label} x=${r.x} y=${r.y} want=(${x},${y}) ${where}`).toBe(
        `${label} ok`,
      );
    };
    const eventOf = (el: HTMLElement, name: string) =>
      new Promise<CustomEvent>((resolve) =>
        el.addEventListener(name, (e) => resolve(e as CustomEvent), { once: true }),
      );
    /* the run() cycle started in the covered step, awaited in the
       done step — steps share the promise, not the block scope */
    let running: Promise<void> | undefined;

    await step('idle: the plates park hidden on their opposite entry edges', async () => {
      const f = front();
      await settle(() => f !== null);
      expect(wipe1.getAttribute('phase')).toBe('idle');
      expect(getComputedStyle(f).backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(back()).backgroundColor).toBe('rgb(20, 241, 200)');
      /* the blend rides the FRONT only — the twin prints opaque */
      expect(getComputedStyle(f).mixBlendMode).toBe('multiply');
      expect(getComputedStyle(back()).mixBlendMode).toBe('normal');
      expect(getComputedStyle(f).visibility).toBe('hidden');
      expect(getComputedStyle(back()).visibility).toBe('hidden');
      expect(getComputedStyle(f).pointerEvents).toBe('none');
      expect(getComputedStyle(f).position).toBe('fixed');
      /* the parks: the front one viewport out the LEFT edge, the
         twin one viewport out the right (direction 'right') */
      assertNear('idle front park', f, -vw());
      assertNear('idle twin park', back(), vw());
    });

    await step('run → enter → covered: the meet, the cover, the pointer block, the event', async () => {
      const covered = eventOf(wipe1, 'covered');
      running = wipe1.run();
      await settle(() => wipe1.getAttribute('phase') === 'enter');
      expect(getComputedStyle(front()).visibility).toBe('visible');
      const ev = (await settle(() => wipe1.getAttribute('phase') === 'covered')) ? await covered : null;
      expect(ev).not.toBeNull();
      expect((ev as CustomEvent).detail.direction).toBe('right');
      /* the cover seat is the COINCIDENCE — both films aligned at
         translate 0: one ink print across the whole screen, the page
         sealed out entirely (a swap here is invisible — at the mere
         meet it would read through the front's multiplied half) */
      assertNear('cover front seat', front(), 0);
      assertNear('cover twin seat', back(), 0);
      /* the cover holds the page: BOTH plates blanket it edge to
         edge, so both take the pointer */
      expect(getComputedStyle(front()).pointerEvents).toBe('auto');
      expect(getComputedStyle(back()).pointerEvents).toBe('auto');
      /* dwell 0 → the cover waits for release(): no auto-exit */
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 60)));
      expect(wipe1.getAttribute('phase')).toBe('covered');
    });

    await step('release → exit → done: the plates keep going, the reveal ends', async () => {
      const done = eventOf(wipe1, 'done');
      wipe1.release();
      await settle(() => wipe1.getAttribute('phase') === 'exit');
      await settle(() => wipe1.getAttribute('phase') === 'idle');
      const ev = await done;
      expect(ev.detail.direction).toBe('right');
      /* the exit carries each film past the other out its OWN far
         side (the front ends +100% along its travel, the twin
         -100%), and landing idle reparks both: the front one
         viewport back out the left edge, the twin out the right —
         hidden again */
      const f = front();
      const b = back();
      assertNear('revealed park front', f, -vw());
      assertNear('revealed park twin', b, vw());
      expect(getComputedStyle(front()).visibility).toBe('hidden');
      expect(getComputedStyle(front()).pointerEvents).toBe('none');
      await running;
      expect(getComputedStyle(front()).visibility).toBe('hidden');
      expect(getComputedStyle(front()).pointerEvents).toBe('none');
      await running;
    });

    await step('the dwell timer releases the cover by itself', async () => {
      const covered = eventOf(wipe2, 'covered');
      const running2 = wipe2.run();
      await settle(() => wipe2.getAttribute('phase') === 'covered');
      await covered;
      /* no release() call — dwell 100ms opens the gate alone */
      await running2;
      expect(wipe2.getAttribute('phase')).toBe('idle');
    });

    await step('caption: the hold writes, then the exit resumes alone', async () => {
      const wipe3 = canvasElement.querySelector('#wipe-3') as HTMLElement & {
        run: () => Promise<void>;
      };
      const caption = () => wipe3.querySelector('.caption') as HTMLElement;
      const typed = () =>
        (wipe3.querySelector('.writer') as HTMLElement & { shadowRoot: ShadowRoot })
          .shadowRoot!.querySelector('.typed') as HTMLElement;
      const covered = new Promise<CustomEvent>((r) =>
        wipe3.addEventListener('covered', (e) => r(e as CustomEvent), { once: true }),
      );
      const running3 = wipe3.run();
      await settle(() => wipe3.getAttribute('phase') === 'covered');
      const ev = await covered;
      expect(ev.detail.direction).toBe('right');
      /* the seat is the coincidence (the seal): the writing turns on
         here, the caption above the ink print */
      await settle(() => wipe3.hasAttribute('writing'));
      /* seated at full overlap: both films aligned — the whole
         screen is the single ink print */
      expect(near(wipe3.querySelector('.plate-front') as HTMLElement, 0, 0)).toBe(true);
      expect(near(wipe3.querySelector('.plate-back') as HTMLElement, 0, 0)).toBe(true);
      expect(getComputedStyle(caption()).visibility).toBe('visible');
      /* no release() call — the typewriter drives the hold */
      await settle(() => typed().textContent === 'the route swaps under this cover');
      /* the printend → caption dwell → gate opens by itself */
      await running3;
      expect(wipe3.getAttribute('phase')).toBe('idle');
      expect(wipe3.hasAttribute('writing')).toBe(false);
      expect(getComputedStyle(caption()).visibility).toBe('hidden');
      /* ...and the page the exit uncovered carries the caption's swap */
      expect(getComputedStyle(front()).visibility).toBe('hidden');
    });

    await step('caption print: unblended paper above the plates, replayed per cycle', async () => {
      const wipe3 = canvasElement.querySelector('#wipe-3') as HTMLElement & {
        run: () => Promise<void>;
      };
      const caption = () => wipe3.querySelector('.caption') as HTMLElement;
      const typed = () =>
        (wipe3.querySelector('.writer') as HTMLElement & { shadowRoot: ShadowRoot })
          .shadowRoot!.querySelector('.typed') as HTMLElement;
      expect(getComputedStyle(caption()).mixBlendMode).toBe('normal');
      const f = wipe3.querySelector('.plate-front') as HTMLElement;
      expect(parseInt(getComputedStyle(caption()).zIndex, 10)).toBe(
        parseInt(getComputedStyle(f).zIndex, 10) + 1,
      );
      /* the words read paper — re-seated through the caption ink var */
      expect(getComputedStyle(typed()).color).toBe('rgb(242, 245, 235)');
      /* a second cycle replays the script — an unchanged text would
         not re-fire the print, so the wipe replays() it */
      const running3 = wipe3.run();
      await settle(() => wipe3.getAttribute('phase') === 'covered');
      await running3;
      expect(wipe3.getAttribute('phase')).toBe('idle');
      expect(typed().textContent).toBe('the route swaps under this cover');
    });

    await step('one film at a time: a run in flight returns the cycle', async () => {
      const a = wipe1.run();
      const b = wipe1.run();
      expect(b).toBe(a);
      let coveredCount = 0;
      /* once — a lingering release-on-covered listener would cut
         every later cycle's cover short (the leak that ate the
         directions step: covered → instant exit → idle, unseeable) */
      wipe1.addEventListener(
        'covered',
        (e) => {
          coveredCount++;
          (e.target as typeof wipe1).release();
        },
        { once: true },
      );
      await a;
      /* the event above fired for THIS cycle only */
      expect(coveredCount).toBe(1);
    });

    await step('abort: no events, an instant park, the rig ready again', async () => {
      let coveredCount = 0;
      let doneCount = 0;
      wipe1.addEventListener('covered', () => coveredCount++, { once: true });
      wipe1.addEventListener('done', () => doneCount++, { once: true });
      const p = wipe1.run();
      await settle(() => wipe1.getAttribute('phase') === 'enter');
      expect(getComputedStyle(front()).visibility).toBe('visible');
      wipe1.abort();
      await settle(() => wipe1.getAttribute('phase') === 'idle');
      await p;
      expect(coveredCount).toBe(0);
      expect(doneCount).toBe(0);
      assertNear('abort park front', front(), -vw());
      assertNear('abort park twin', back(), vw());
      expect(getComputedStyle(front()).visibility).toBe('hidden');
      /* the rig runs clean right after an abort */
      const done = eventOf(wipe1, 'done');
      const clean = wipe1.run();
      await settle(() => wipe1.getAttribute('phase') === 'covered');
      wipe1.release();
      await clean;
      await done;
    });

    await step('directions: the films cross the travel axis in all four', async () => {
      /* each direction is the front's travel sign s on its axis —
         the cover seat is ±(half viewport - offset/2) across the
         meet, the park is the front at -s×viewport back on its own
         entry edge. The offset half is 4px (default offset 8) */
      for (const [dir, axis, s] of [
        ['left', 'x', -1],
        ['up', 'y', -1],
        ['down', 'y', 1],
      ] as const) {
        wipe1.direction = dir;
        const running = wipe1.run();
        const settled = await settle(() => wipe1.getAttribute('phase') === 'covered');
        const size = axis === 'x' ? vw() : vh();
        const seat = (label: string, el: HTMLElement, pos: number) =>
          assertNear(
            label,
            el,
            axis === 'x' ? pos : 0,
            axis === 'x' ? 0 : pos,
            `phase=${wipe1.getAttribute('phase')} dir=${dir} settled=${settled}`,
          );
        /* the cover seat is the coincidence — 0,0 in EVERY direction
           (the travel vector only moves which edge each film came
           from); the park is the front at -s×viewport on its entry
           edge. The offset half is 4px (default offset 8) */
        seat(`${dir} cover front`, front(), 0);
        seat(`${dir} cover twin`, back(), 0);
        wipe1.release();
        await settle(() => wipe1.getAttribute('phase') === 'idle');
        seat(`${dir} park`, front(), -s * size);
        await running;
      }
      wipe1.direction = 'right';
    });

    await step('physics: no alpha, the multiply rides the front only', async () => {
      const f = front();
      expect(wipe1.style.opacity).toBe('');
      expect(getComputedStyle(f).opacity).toBe('1');
      expect(getComputedStyle(back()).opacity).toBe('1');
      expect(getComputedStyle(f).mixBlendMode).toBe('multiply');
      expect(getComputedStyle(back()).mixBlendMode).toBe('normal');
      expect(getComputedStyle(f).backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(back()).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(getComputedStyle(f).backgroundColor).not.toContain('rgba');
      expect(getComputedStyle(back()).backgroundColor).not.toContain('rgba');
    });
  },
};