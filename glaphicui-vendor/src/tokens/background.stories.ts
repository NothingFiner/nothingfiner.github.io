import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

/**
 * Foundations/Backgrounds — the grounds components sit on and paint
 * themselves from: the Tier-1 flat ground, the stage grounds
 * (grid hatch, blob field, hot wash) and the plate film depth ramp.
 * The blob field + hatch live in the storybook's demo.css as staging;
 * the flat ground / film formula are token recipes (tokens.css).
 */

const meta: Meta = {
  title: 'Foundations/Background',
  tags: ['autodocs'],
};
export default meta;

const row = (label: string, spec: string, style: string, height = 96) => html`
  <div style="display:grid;gap:5px">
    <div class="demo-specline"><span>${label}</span><span>${spec}</span></div>
    <div style="${style}height:${height}px"></div>
  </div>
`;

/** DOCS SECTION — the grounds + the film ramp. */
export const Grounds: StoryObj = {
  tags: ['!dev', '!test'],
  render: () => html`
    <div class="ig" style="max-width:560px;gap:18px;align-items:stretch">
      ${row('Flat', '--bg — the Tier-1 ground', 'background: var(--bg, #F1ECE2);')}
      ${row(
        'Grid hatch',
        '--rimsoft hatch at 12px',
        'background: repeating-linear-gradient(135deg, var(--rimsoft, rgba(23,20,14,.14)) 0 2px, transparent 2px 12px);',
      )}
      ${row(
        'Blob field',
        'cold + acid circles over the hot wash + hatch — glass staging',
        `background:
    radial-gradient(60px 60px at 22% 76%, var(--cold, #0780B8), transparent 100%),
    radial-gradient(38px 38px at 76% 26%, var(--acid, #E3D71B), transparent 100%),
    repeating-linear-gradient(135deg, var(--rimsoft, rgba(23, 20, 14, .14)) 0 2px, transparent 2px 12px),
    color-mix(in srgb, var(--hot, #E03A0B) 26%, transparent);`,
      )}
      ${row('Plate film 8%', 'platec at depth 8% — a whisper film', 'background: color-mix(in srgb, var(--platec, #17140E) 8%, transparent);')}
      ${row('Plate film 28%', 'platec at depth 28% — a heavy film', 'background: color-mix(in srgb, var(--platec, #17140E) 28%, transparent);')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'What sits under everything. Flat is --bg (the Tier-1 ground, both dark blocks flip it). The grid hatch and the blob field were the staging grounds the retiring glass plates frosted — the blobs are cold + acid circles over a hot wash. The plate film is --platec at a depth percentage; the card films it fed retired with the figcut card (the reworked card is a flat multiply panel), so the two stops are kept as ramp points, not card ties.',
      },
    },
  },
};

/** combinations one-pager (sidebar only) */
export const Example: StoryObj = {
  parameters: { docs: { disable: true } },
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;max-width:900px">
      <div class="demo-ground" style="padding:18px;min-height:170px;display:grid;align-content:end">
        <glaphic-card>
          <span class="demo-cap">over blobs — flat card staging</span>
        </glaphic-card>
      </div>
      <div style="padding:18px;min-height:170px;background: repeating-linear-gradient(135deg, var(--rimsoft, rgba(23,20,14,.14)) 0 2px, transparent 2px 12px);display:grid;align-content:end">
        <glaphic-card>
          <span class="demo-cap">over hatch — flat card staging</span>
        </glaphic-card>
      </div>
      <div style="padding:18px;min-height:170px;background: var(--bg, #F1ECE2);display:grid;align-content:end">
        <glaphic-card>
          <span class="demo-cap">on the warm ground — flat card staging</span>
        </glaphic-card>
      </div>
    </div>
  `,
};