import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './glaphic-table.js';
import { tier2Vars, TIER1_COLORS } from '../../base/story-helpers.js';

const TABLE_TINT_MAP = {
  '--glaphic-table-tint': 'tint',
  '--glaphic-table-depth': 'depth',
};

const COLUMNS = ['Bay', 'Manifest', 'Status'];

const ROWS: string[][] = [
  ['07', 'Comms dish · array B', 'OK'],
  ['09', 'Optics bay · lens crate', 'OK'],
  ['04', 'Plate archive · roll 118', 'LOW INK'],
  ['11', 'Systems · spare filaments', 'PULLED'],
  ['02', 'Propellant lines · flush kit', 'OK'],
  ['06', 'Survey racks · negatives', 'OK'],
  ['13', 'Darkroom · fixer barrels', 'LOW INK'],
  ['15', 'Spine press · type blocks', 'OK'],
];

const seeded = (args: Record<string, unknown>, extraStyle = '') => html`
  <glaphic-table
    style="max-width:560px;${extraStyle}${tier2Vars(args as Record<string, unknown>, TABLE_TINT_MAP)}"
    caption="Deck manifest"
    .columns=${COLUMNS}
    .rows=${ROWS}
    ?zebra=${Boolean(args.zebra)}
    ?dense=${Boolean(args.dense)}
    ?sticky=${Boolean(args.sticky)}
    ?force-empty=${Boolean(args.forceEmpty)}
  ></glaphic-table>
`;

const meta: Meta = {
  title: 'Data/Table',
  component: 'glaphic-table',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Plate-framed strings table over a plate film. Data-driven: `caption` attribute, `.columns` as a comma-separated attribute, `.rows` property-only (mutation re-renders). Hover lifts each row through --glaphic-table-hover-depth; the bottom readout counts rows in the tabular voice.',
      },
    },
  },
  argTypes: {
    zebra: { control: 'boolean' },
    dense: { control: 'boolean' },
    sticky: { control: 'boolean' },
    forceEmpty: { name: 'force-empty', control: 'boolean' },
    caption: { control: 'text', table: { category: 'content' } },
    tint: { name: 'tint → --glaphic-table-tint', control: { type: 'color', presetColors: TIER1_COLORS } },
    depth: { name: 'depth → --glaphic-table-depth', control: 'range', min: 0, max: 100, step: 1 },
  },
};
export default meta;

/** DOCS SECTION — on the docs page, not in the sidebar, untested. */
export const Modes: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div class="ig" style="gap:14px">
      <div style="display:grid;gap:5px">
        <span class="demo-specline"><span>Plain</span><span>even-depth rows</span></span>
        ${seeded({})}
      </div>
      <div style="display:grid;gap:5px">
        <span class="demo-specline"><span>Dense</span><span>row padding halves</span></span>
        ${seeded({ dense: true })}
      </div>
      <div style="display:grid;gap:5px">
        <span class="demo-specline"><span>Zebra</span><span>even rows +4 depth</span></span>
        ${seeded({ zebra: true })}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The three row modes, stackable: `dense` halves the row padding, `zebra` bumps every nth-child(even) row +4 depth over the row film, plain keeps one even film. `sticky` (below) pins the header to the internal scroller.',
      },
    },
  },
};

/** DOCS SECTION — sticky header (rendered fixed — no controls). */
export const StickyMode: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Sticky',
  render: () => seeded({ zebra: true, sticky: true }),
  parameters: {
    docs: {
      description: {
        story: '`sticky` pins the header to the internal scroller — max-height comes from --glaphic-table-height (260px once sticky); it never pins to the document.',
      },
    },
  },
};

/** DOCS SECTION — the empty state. */
export const EmptyState: StoryObj = {
  tags: ['!dev', '!test'],
  name: 'Empty state',
  render: () => seeded({ forceEmpty: true }),
  parameters: {
    docs: {
      description: {
        story: 'The muted NO DATA row (`force-empty` previews it): readout drops to 00 ROWS.',
      },
    },
  },
};

/** combinations one-pager (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true } },
  render: () => html`
    <div class="ig" style="gap:18px">
      ${seeded({ zebra: true, dense: true })}
      <glaphic-table
        style="max-width:640px"
        caption="Optics bench · sweep log"
        columns="Run,Slice,Focus,Exposure,Plate,Status"
        .rows=${[
          ['014', 'A-2', '+0.4', '1/250', 'TRI-X', 'OK'],
          ['015', 'A-3', '+0.2', '1/500', 'TRI-X', 'OK'],
          ['016', 'B-1', '-0.1', '1/125', 'HP5', 'RECHECK'],
        ]}
      ></glaphic-table>
      <glaphic-table
        style="max-width:560px;${tier2Vars({ tint: '#2A2622', depth: '16' } as Record<string, unknown>, TABLE_TINT_MAP)}"
        caption="Retinted manifest"
        .columns=${COLUMNS.slice(0, 2)}
        .rows=${ROWS.slice(0, 4).map((r) => r.slice(0, 2))}
        dense
      ></glaphic-table>
    </div>
  `,
};

/** every knob live (sidebar only) */
export const Playground: StoryObj = {
  parameters: { docs: { disable: true } },
  args: { zebra: false, dense: false, sticky: false, forceEmpty: false, caption: 'Deck manifest', tint: '#17140E', depth: 8 },
  render: (args) => seeded(args),
};

/** hidden test story — guards rows mutation + empty/sticky modes */
export const Interactions: StoryObj = {
  tags: ['!dev'],
  parameters: { docs: { disable: true } },
  render: () => html`
    <glaphic-table
      caption="Deck manifest"
      columns="Bay,Manifest,Status"
      .rows=${ROWS.slice(0, 3)}
    ></glaphic-table>
  `,
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('storybook/test');
    const root = canvasElement as HTMLElement;
    const table = root.querySelector('glaphic-table') as any;
    await step('renders the seeded rows and a matching readout', async () => {
      const cells = table.shadowRoot!.querySelectorAll('tbody td');
      expect(cells.length).toBe(9);
      const rowElements = table.rows.length;
      expect(rowElements).toBe(3);
      expect(table.shadowRoot!.querySelector('.rows-readout')!.textContent!.trim()).toBe('03 ROWS');
      expect(table.shadowRoot!.querySelector('tbody td')!.textContent).toBe('07');
    });
    await step('mutating .rows re-renders + readout follows', async () => {
      table.rows = [...ROWS.slice(0, 2), ['99', 'Late addition', 'NEW']];
      await table.updateComplete;
      expect(table.shadowRoot!.querySelectorAll('tbody td').length).toBe(9);
      expect(table.shadowRoot!.querySelector('.rows-readout')!.textContent!.trim()).toBe('03 ROWS');
    });
    await step('force-empty shows the NO DATA row', async () => {
      table.forceEmpty = true;
      await table.updateComplete;
      expect(table.shadowRoot!.querySelector('.empty')!.textContent!.trim()).toBe('NO DATA');
      expect(table.shadowRoot!.querySelector('.rows-readout')!.textContent!.trim()).toBe('00 ROWS');
    });
    await step('sticky header anchors to the internal scroller', async () => {
      table.forceEmpty = false;
      table.sticky = true;
      await table.updateComplete;
      const th = table.shadowRoot!.querySelector('th') as HTMLElement;
      expect(getComputedStyle(th).position).toBe('sticky');
    });
  },
};