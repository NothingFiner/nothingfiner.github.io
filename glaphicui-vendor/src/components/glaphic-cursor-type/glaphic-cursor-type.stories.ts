import { css, html, LitElement, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-cursor-type.js';

const meta: Meta = {
  title: 'Foundations/Typography/Cursor Type',
  component: 'glaphic-cursor-type',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    wordMode: { control: 'boolean' },
    speed: { control: 'number', description: 'ms per print step' },
    cursorVanish: {
      control: 'boolean',
      description: 'set true to drop the block once the print finishes',
    },
  },
};
export default meta;

const panel = (el: TemplateResult) => html`
  <div style="max-width:640px">${el}</div>`;

const caption = (text: string) => html`<div class="demo-specline"><span>${text}</span></div>`;

/* the story's local row wrapper — a paper plate for the terminal read
   plus the replay button, so each variant reruns live */
class CursorRow extends LitElement {
  static properties = {
    wordMode: { type: Boolean, reflect: true, attribute: 'word-mode' },
    cursorVanish: { type: Boolean, reflect: true, attribute: 'cursor-vanish' },
  };
  declare wordMode: boolean;
  declare cursorVanish: boolean;
  constructor() {
    super();
    this.wordMode = false;
    this.cursorVanish = false;
  }
  static styles = css`
    :host {
      display: block;
      margin: 6px 0 8px;
    }
    glaphic-cursor-type {
      display: block;
      background: var(--glaphic-neutral-paper-elevated, #f9faf4);
    }
  `;
  render() {
    return html`
      <glaphic-cursor-type
        text="the cursor prints the words as they come; the tape sorts itself out."
        ?word-mode=${this.wordMode}
        ?cursor-vanish=${this.cursorVanish}></glaphic-cursor-type>
    `;
  }
}
customElements.define('glaphic-cursor-row', CursorRow);
declare global {
  interface HTMLElementTagNameMap {
    'glaphic-cursor-row': CursorRow;
  }
}

/* DOCS SECTION — hidden in the sidebar, untested prose. Draft copy. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => panel(html`
    ${caption('CHAR — one character per print step behind the block')}
    <glaphic-cursor-row id="row-char"></glaphic-cursor-row>
    <button @click=${() => (document.getElementById('row-char') as CursorRow).renderRoot.querySelector('glaphic-cursor-type')?.replay()}>replay char</button>
    ${caption('WORD — the whole word drops in per print step')}
    <glaphic-cursor-row id="row-word" word-mode></glaphic-cursor-row>
    <button @click=${() => (document.getElementById('row-word') as CursorRow).renderRoot.querySelector('glaphic-cursor-type')?.replay()}>replay word</button>
    ${caption('VANISH — cursor-vanish: the block drops out the moment the print ends')}
    <glaphic-cursor-row id="row-vanish" cursor-vanish></glaphic-cursor-row>
    <button @click=${() => (document.getElementById('row-vanish') as CursorRow).renderRoot.querySelector('glaphic-cursor-type')?.replay()}>replay vanish</button>
  `),
  parameters: {
    docs: {
      description: {
        story:
          'The CURSOR TYPE treatment (Eliot: "cursor type is also good both versions"): terminal block-cursor typography — text prints character by character behind a solid ink-block cursor that paints the character cell it sits on and blinks a 1s step. The WORD variant switches the print unit to whole words: each word appears at once at its cell (the replay buttons rerun either row from empty). Speed is a property (ms per print step, default 60); the blink\'s ~1Hz step is the treatment\'s read, not a knob. The cursor ink falls back to the TEXT ink — words and block read one tone unless --glaphic-cursor-type-cursor-ink repaints the block. The block keeps blinking after the print finishes — the terminal convention; set `cursor-vanish` and it drops out of the row the moment the print completes — a display none flip, never a fade; the block\'s `bottom` alignment keeps the row\'s line box read either way (no odd drop-offs). Tier-2: --glaphic-cursor-type-ink (the text) and -cursor-ink (the block). Reduced motion prints the whole script at once and freezes the cursor lit. STILL FLAGGED: the cursor blinks even while printing — the terminal convention keeps the block solid mid-print (kept as pitched, the flag stays noted). Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the print anatomy, both print units,
   the replay, the blink, the cursor-vanish flip and the ink fallback
   (real keyboard/mouse play no default browser action here, so the
   steps read state directly) */
export const CursorTypeInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-cursor-type id="type-char" text="prints by the character" speed="16"></glaphic-cursor-type>
    <glaphic-cursor-type id="type-word" word-mode text="prints whole words" speed="16"></glaphic-cursor-type>
    <glaphic-cursor-type id="type-vanish" text="drops the block when done" speed="16"></glaphic-cursor-type>
    <glaphic-cursor-type id="type-ink" text="reads one tone" speed="16"></glaphic-cursor-type>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    /* poll for a print run to reach its end state */
    const settle = async (probe: () => boolean, tries = 300) => {
      for (let i = 0; i < tries; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(r));
        if (probe()) return true;
      }
      return false;
    };
    const typed = (id: string) =>
      (canvasElement.querySelector(id) as HTMLElement).shadowRoot!.querySelector('.typed')!;
    const cursor = (id: string) =>
      (canvasElement.querySelector(id) as HTMLElement).shadowRoot!.querySelector('.cursor')!;
    await step('char print: the script arrives one character per step', async () => {
      const full = 'prints by the character';
      const grown = await settle(() => typed('#type-char').textContent === full);
      expect(grown).toBe(true);
      expect(typed('#type-char').textContent).toBe(full);
    });
    await step('word print: whole words drop in, spaces preserved', async () => {
      const full = 'prints whole words';
      const grown = await settle(() => typed('#type-word').textContent === full);
      expect(grown).toBe(true);
      /* the word unit never prints a partial word mid-run */
      expect(typed('#type-word').textContent!.trim().endsWith('words')).toBe(true);
    });
    await step('the block cursor: 0.6em solid ink cell, blinking a 1s step', async () => {
      const cs = getComputedStyle(cursor('#type-char'));
      expect(cs.animationName).toBe('glaphic-cursor-type-blink');
      expect(parseFloat(cs.width)).toBeGreaterThan(5); // 0.6em of 13px ≈ 7.8px
      expect(cs.animationIterationCount).toBe('infinite');
    });
    await step('replay: the print reruns from empty (the story buttons)', async () => {
      const host = canvasElement.querySelector('#type-char') as HTMLElement & { replay(): void };
      expect(typed('#type-char').textContent).toBe('prints by the character');
      host.replay();
      /* mid-run the typed span reads shorter than the full script */
      const running = typed('#type-char').textContent!.length < 23;
      expect(running).toBe(true);
      const regrown = await settle(() => typed('#type-char').textContent === 'prints by the character');
      expect(regrown).toBe(true);
    });
    await step('tier-2: the cursor ink repaints the block', async () => {
      const host = canvasElement.querySelector('#type-word') as HTMLElement;
      host.style.setProperty('--glaphic-cursor-type-cursor-ink', '#a6022a');
      const cs = getComputedStyle(cursor('#type-word'));
      /* assert through the owning var: the blink's keyframes flip the
         computed background between the ink and transparent a 1s step,
         so the paint read alone is phase-dependent */
      expect(cs.getPropertyValue('--glaphic-cursor-type-cursor-ink')).toBe('#a6022a');
      expect(cs.animationName).toBe('glaphic-cursor-type-blink');
    });
    await step('default linger: the block keeps blinking after the print finishes', async () => {
      /* step one settled #type-char to its full script and step four
         replayed it; the run has finished again here */
      await settle(() => typed('#type-char').textContent === 'prints by the character');
      const display = getComputedStyle(cursor('#type-char')).display;
      expect(display).not.toBe('none');
      expect(display).toBe('inline-block');
    });
    await step('cursor-vanish: the block drops out the moment the print ends', async () => {
      const host = canvasElement.querySelector('#type-vanish') as HTMLElement & { cursorVanish: boolean };
      expect(getComputedStyle(cursor('#type-vanish')).display).not.toBe('none');
      host.cursorVanish = true; // a property change reruns the print
      const gone = await settle(
        () =>
          typed('#type-vanish').textContent === 'drops the block when done' &&
          getComputedStyle(cursor('#type-vanish')).display === 'none',
      );
      expect(gone).toBe(true);
      expect(typed('#type-vanish').textContent).toBe('drops the block when done');
      /* the drop stays while the row sits finished (no re-light) */
      expect(getComputedStyle(cursor('#type-vanish')).display).toBe('none');
    });
    await step('tier-2 ink fallback: the cursor ink reads the TEXT ink', async () => {
      const host = canvasElement.querySelector('#type-ink') as HTMLElement;
      /* an rgb() literal so both reads arrive as the same literal
         rgb: the typed span's color and the cursor's owning var */
      host.style.setProperty('--glaphic-cursor-type-ink', 'rgb(166, 2, 42)');
      await settle(() => typed('#type-ink').textContent === 'reads one tone');
      expect(getComputedStyle(typed('#type-ink')).color).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(cursor('#type-ink')).getPropertyValue('--glaphic-cursor-type-cursor-ink')).toBe(
        'rgb(166, 2, 42)',
      );
      /* the block override still wins over the text ink */
      host.style.setProperty('--glaphic-cursor-type-cursor-ink', 'rgb(2, 102, 112)');
      expect(getComputedStyle(cursor('#type-ink')).getPropertyValue('--glaphic-cursor-type-cursor-ink')).toBe(
        'rgb(2, 102, 112)',
      );
    });
  },
};