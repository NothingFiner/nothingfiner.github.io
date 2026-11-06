import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-band.js';

const meta: Meta = {
  title: 'Surfaces/Band',
  component: 'glaphic-band',
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'radio', options: ['brand', 'fluro', 'success', 'neutral', 'muted'] },
    size: { control: 'radio', options: ['display', 'compact', 'small', 'thin'] },
    axis: { control: 'radio', options: ['horizontal', 'vertical'] },
    multiply: { control: 'boolean' },
    'content-row': { control: 'text' },
    'content-column': { control: 'text' },
    'content-align-inline': { control: 'radio', options: ['start', 'center', 'end'] },
    'content-align-block': { control: 'radio', options: ['start', 'center', 'end'] },
  },
};
export default meta;

const row = (label: string, spec: string, el: TemplateResult) => html`
  <div style="display:grid;gap:5px;padding:9px 0;border-bottom:1px solid var(--glaphic-neutral-grey-cool-100, #e9e7ef)">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    ${el}
  </div>
`;

/* DOCS SECTIONS — hidden in the sidebar, untested. Prose is a draft:
   the section copy is reviewed/edited with the user before merge. */

export const Basic: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row('BRAND', 'brand tone, display step — the ink-brand-dark solid, paper-elevated label', html`<glaphic-band>glaphica runs deep</glaphic-band>`)}
      ${row('FLURO', 'fluro tone, display step — the ink-brand-fluro solid, paper-elevated label', html`<glaphic-band tone="fluro">glaphica runs deep</glaphic-band>`)}
      ${row('BRAND · COMPACT', 'compact step — 81 tall, the label ink lifts to paper-deep', html`<glaphic-band size="compact">glaphica compact</glaphic-band>`)}
      ${row('SUCCESS', 'success tone — pale surface fill, the success-text ink AND keyline', html`<glaphic-band tone="success">all systems nominal</glaphic-band>`)}
      ${row('NEUTRAL', 'neutral tone, small step — cool-50 fill, cool-600 keyline + label', html`<glaphic-band tone="neutral" size="small">status: standing by</glaphic-band>`)}
      ${row('MUTED · THIN', 'muted tone, thin step — paper-deep strip, cool-400 keyline, cool-600 label', html`<glaphic-band tone="muted" size="thin">thin strip</glaphic-band>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'A band is one paint recipe riding one ladder step. The tone sits the paint: brand and fluro are the solid inks running to the radius with no keyline; success, neutral and muted are the pale surfaces whose keyline AND label take the text ink — success-text on the success surface, cool-600 on the cool-50 neutral, cool-600 on the muted paper-deep strip behind a cool-400 keyline. The size sits the height: display 120, compact 81 (whose label ink lifts to paper-deep — the sheet\'s slimmer brand read), small 73, thin 36. Everything is a multiply layer over the page — no alpha, no masks (this is a hard break from the figcut band: the cutout punch, the glass lens, the brackets and the supertext trim are all gone with the old spec). The multiply blend rides the presence-based `multiply` attribute — present by default for every band; drop it and the band reads flat, the same paints with no translucency. The design shows the brand display band twice at two label sizes — here the ladder ships 24px and the second size rides the Tier-2 --glaphic-band-display-label-size knob (flagged — the display scale is proposed, not yet confirmed). Draft copy.',
      },
    },
  },
};

export const DisplayScale: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row('DISPLAY · DEFAULT', 'the proposed 24px mono label at the 120 height', html`<glaphic-band>glaphica runs deep</glaphic-band>`)}
      ${row('DISPLAY · LARGE', 'the second display size via the knob (proposed 48px)', html`<glaphic-band style="--glaphic-band-display-label-size: var(--glaphic-font-size-4, 48px)"><b>glaphica LOUD</b></glaphic-band>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The sheet\'s two stacked brand display bands read as the same variant shown at two label sizes — the component carries one label-size per step and the second red is here the same band with --glaphic-band-display-label-size lifted to the 48px type token (PROPOSED — this pairing is flagged for Eliot; the second red could just as easily be a distinct \'billboard\' step of its own). Draft copy.',
      },
    },
  },
};

export const Vertical: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row('VERTICAL · BRAND', 'the brand solid rotated 90° — label reading top-to-bottom', html`<glaphic-band axis="vertical" style="height:435px;display:inline-block">glaphica</glaphic-band>`)}
      ${row('VERTICAL · FLURO', 'the fluro solid rotated 90° — same treatment', html`<glaphic-band tone="fluro" axis="vertical" style="height:435px;display:inline-block">glaphica</glaphic-band>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'The vertical bands are the solid bands turned 90° — rotated geometry, not squeezed: the cross keeps its ladder width, the run goes to the full height, and the label turns with `writing-mode: vertical-rl` so it reads top-to-bottom. The run\'s length comes from the consumer\'s height (the sheet\'s 435 is a frame size, not a property). Draft copy.',
      },
    },
  },
};

export const Grid: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div style="max-width:620px">
      ${row('PINNED', 'content-row="3" content-column="2" — the second column, third row down', html`<glaphic-band content-row="3" content-column="2">pinned read</glaphic-band>`)}
      ${row('RANGE', 'content-row="7-8" — the bottom two rows of the eight', html`<glaphic-band content-row="7-8">billboard line</glaphic-band>`)}
      ${row('FIT', 'content-align-block="start" content-align-inline="end" — top right inside the span', html`<glaphic-band content-align-block="start" content-align-inline="end">top right</glaphic-band>`)}
      ${row('TUNED SUBSTRATE', 'the track counts themselves are Tier-2: a 4 × 2 grid', html`<glaphic-band style="--glaphic-band-content-rows: 4; --glaphic-band-content-columns: 2">four by two</glaphic-band>`)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Every band carries an internal grid — 8 rows × 4 columns of 1fr tracks (Eliot\'s substrate). The content is one grid item you place like any grid item: `content-row` and `content-column` take `all` (default — the full span, so the band reads exactly as it did before the grid went in), a track number, or an `a-b` start-to-end range; `content-align-inline` and `content-align-block` then position it inside its tracks (the defaults are inline start — the label hangs at the left padding — and block center, the sheet\'s read). Line-height rides the Tier-2 `--glaphic-band-line-height` (default 1.2). The track counts are Tier-2 too — `--glaphic-band-content-rows` / `--glaphic-band-content-columns` — so the whole substrate retunes; a placement pinned past the tuned count creates an implicit track (flagged), and vertical bands turn the grid with the label\'s writing-mode so the rows keep their block reading. The placement names are proposed and reviewed before anything cements. Draft copy.',
      },
    },
  },
};

/* hidden test story — guards the tone paints (fill / ink / keyline
   per recipe), the size ladder and the compact ink lift, the
   vertical rotation, the grid substrate and its placements, and the
   multiply/no-mask physics */
export const BandInteractions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;gap:2px">
      <glaphic-band>glaphica</glaphic-band>
      <glaphic-band id="band-fluro" tone="fluro">glaphica</glaphic-band>
      <glaphic-band id="band-success" tone="success">nominal</glaphic-band>
      <glaphic-band id="band-neutral" tone="neutral" size="small">standing by</glaphic-band>
      <glaphic-band id="band-muted" tone="muted" size="thin">thin strip</glaphic-band>
      <glaphic-band id="band-compact" size="compact">compact</glaphic-band>
      <glaphic-band id="band-thin" size="thin">thin label size</glaphic-band>
      <glaphic-band id="band-vertical" axis="vertical" style="height:300px">glaphica</glaphic-band>
      <glaphic-band id="band-flat">flat band</glaphic-band>
      <glaphic-band id="band-grid" style="width:400px"><span id="grid-marker" style="display:block;width:10px;height:10px;background:var(--glaphic-ink-black, #0d0221)"></span></glaphic-band>
      <glaphic-band id="band-pinned" style="width:400px" content-row="2" content-column="3"><span id="pinned-marker" style="display:block;width:10px;height:10px;background:var(--glaphic-ink-black, #0d0221)"></span></glaphic-band>
      <glaphic-band id="band-range" style="width:400px" content-row="7-8"><span id="range-marker" style="display:block;width:10px;height:10px;background:var(--glaphic-ink-black, #0d0221)"></span></glaphic-band>
      <glaphic-band id="band-fit" style="width:400px" content-align-block="start" content-align-inline="end"><span id="fit-marker" style="display:block;width:10px;height:10px;background:var(--glaphic-ink-black, #0d0221)"></span></glaphic-band>
      <glaphic-band id="band-lh" style="--glaphic-band-line-height: 2">loud line</glaphic-band>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const parts = (sel: string) => {
      const host = canvasElement.querySelector(sel) as HTMLElement;
      const label = host.shadowRoot!.querySelector('.label') as HTMLElement;
      const content = host.shadowRoot!.querySelector('.content') as HTMLElement;
      return { host, label, content };
    };
    /* the 400-wide bands: content box 360 wide / 88 tall — 90px
       columns, 11px rows, the 16/20 paddings outside the tracks */
    const marker = (sel: string) => canvasElement.querySelector(sel) as HTMLElement;
    const markerOffset = (host: HTMLElement, markerSel: string) => {
      const hb = host.getBoundingClientRect();
      const mb = marker(markerSel).getBoundingClientRect();
      return { left: mb.left - hb.left, top: mb.top - hb.top };
    };
    type BandHost = HTMLElement & { multiply: boolean; updateComplete: Promise<boolean> };
    const band = (sel: string) => parts(sel).host as BandHost;
    await step('brand: the ink-brand-dark solid, paper-elevated label, keyless', async () => {
      const { host, content } = parts('glaphic-band');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(166, 2, 42)');
      expect(getComputedStyle(content).color).toBe('rgb(249, 250, 244)');
      expect(getComputedStyle(host).borderColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(host).borderWidth).toBe('0px');
      expect(getComputedStyle(host).height).toBe('120px');
      expect(getComputedStyle(content).fontSize).toBe('24px');
    });
    await step('fluro: the ink-brand-fluro solid', async () => {
      const { host, content } = parts('#band-fluro');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(20, 241, 200)');
      expect(getComputedStyle(content).color).toBe('rgb(249, 250, 244)');
    });
    await step('success: pale surface, the keyline AND label take the text ink', async () => {
      const { host, content } = parts('#band-success');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(230, 255, 211)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(61, 139, 14)');
      expect(getComputedStyle(host).borderWidth).toBe('1px');
      expect(getComputedStyle(content).color).toBe('rgb(61, 139, 14)');
    });
    await step('neutral: cool-50 fill, cool-600 keyline + label, 73 tall', async () => {
      const { host, content } = parts('#band-neutral');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(244, 243, 247)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(104, 100, 116)');
      expect(getComputedStyle(host).height).toBe('73px');
      expect(getComputedStyle(content).color).toBe('rgb(104, 100, 116)');
      expect(getComputedStyle(content).fontSize).toBe('12px');
    });
    await step('muted: paper-deep strip, cool-400 keyline, thin 36 tall', async () => {
      const { host } = parts('#band-muted');
      expect(getComputedStyle(host).backgroundColor).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(host).borderColor).toBe('rgb(157, 153, 171)');
      expect(getComputedStyle(host).height).toBe('36px');
    });
    await step('compact: 81 tall and the label ink lifts to paper-deep', async () => {
      const { host, content } = parts('#band-compact');
      expect(getComputedStyle(host).height).toBe('81px');
      expect(getComputedStyle(content).color).toBe('rgb(233, 237, 224)');
      expect(getComputedStyle(content).fontSize).toBe('16px');
    });
    await step('thin: the label sizes down to the 10px step', async () => {
      expect(getComputedStyle(parts('#band-thin').content).fontSize).toBe('10px');
    });
    await step('vertical: the cross flips to the width, the label reads top-to-bottom', async () => {
      const { host, label } = parts('#band-vertical');
      expect(getComputedStyle(host).width).toBe('120px');
      expect(getComputedStyle(label).writingMode).toBe('vertical-rl');
    });
    await step('grid substrate: 8 × 4 one-fr tracks, default read unchanged', async () => {
      const { host, label, content } = parts('#band-grid');
      expect(getComputedStyle(label).gridTemplateRows.split(' ').length).toBe(8);
      expect(getComputedStyle(label).gridTemplateColumns.split(' ').length).toBe(4);
      expect(getComputedStyle(content).lineHeight).toBe('28.8px');
      /* content item: full span, block-centered, inline start — the
         10px marker hangs at the left padding, centered in the box */
      const at = markerOffset(host, '#grid-marker');
      expect(at.left).toBeCloseTo(20, 5);
      expect(at.top).toBeCloseTo((120 - 10) / 2, 5);
    });
    await step('pinned: track number + range land the content on its tracks', async () => {
      const host = canvasElement.querySelector('#band-pinned') as HTMLElement;
      /* row 2 spans 27..38, column 3 starts at 16+2·90 inline */
      const at = markerOffset(host, '#pinned-marker');
      expect(at.left).toBeCloseTo(200, 5);
      expect(at.top).toBeCloseTo(27 + (11 - 10) / 2, 5);
      const rangeHost = canvasElement.querySelector('#band-range') as HTMLElement;
      /* rows 7-8 span 82..110, the 10px marker centers in there */
      const rangeAt = markerOffset(rangeHost, '#range-marker');
      expect(rangeAt.top).toBeCloseTo(82 + (22 - 10) / 2, 5);
    });
    await step('fit: the alignment knobs position inside the span', async () => {
      const host = canvasElement.querySelector('#band-fit') as HTMLElement;
      const at = markerOffset(host, '#fit-marker');
      expect(at.top).toBeCloseTo(16, 5);
      expect(at.left).toBeCloseTo(400 - 20 - 10, 5);
    });
    await step('line-height: the Tier-2 knob retunes the content line box', async () => {
      expect(getComputedStyle(parts('#band-lh').content).lineHeight).toBe('48px');
    });
    await step('multiply toggle: the off attribute reads flat, on re-blends', async () => {
      const host = band('#band-flat');
      await host.updateComplete;
      /* upgrade semantics: the constructor default reflects the
         attribute on, even though the markup carries none */
      expect(host.hasAttribute('multiply')).toBe(true);
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
      host.multiply = false;
      await host.updateComplete;
      expect(host.hasAttribute('multiply')).toBe(false);
      expect(getComputedStyle(host).mixBlendMode).toBe('normal');
      host.multiply = true;
      await host.updateComplete;
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
    });
    await step('physics: multiply, no masks, no glass', async () => {
      const { host } = parts('glaphic-band');
      expect(getComputedStyle(host).mixBlendMode).toBe('multiply');
      expect(getComputedStyle(host).backdropFilter).toBe('none');
      expect(getComputedStyle(host).opacity).toBe('1');
      expect((host.shadowRoot as ShadowRoot).querySelector('svg, mask')).toBeFalsy();
    });
  },
};