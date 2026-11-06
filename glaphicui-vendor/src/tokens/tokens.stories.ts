import { html } from 'lit';
import type { Meta } from '@storybook/web-components-vite';
import { glaphicTokens } from './tokens.js';

/**
 * Tier-1 vocabulary — the ~25 global custom properties on :root that
 * every component reads. Load tokens.css once per page BEFORE any
 * component matters; components declare their own Tier-2 parameters on
 * the host element with fallbacks, never re-stating these values.
 *
 * Gotcha that shaped the design (see tokens.css header): var() inside a
 * custom property value is substituted at the element where the
 * property is DECLARED, not where it's used. That's why --plate is a
 * full color-mix formula over --platec/--platea at :root — both knobs
 * live there, so it resolves for every card. Components needing LOCAL
 * variation declare their own full formula (e.g. cards over
 * --glaphic-card-depth).
 */
const colorTokens = new Set([
  '--bg', '--ink', '--muted', '--hot', '--onhot', '--cold', '--acid',
  '--platec', '--rim', '--rimsoft', '--diff',
]);

const meta: Meta = {
  title: 'Foundations/Color',
  tags: ['autodocs'],
};
export default meta;

const rows = glaphicTokens.map((name) => {
  // resolve against :root so the story shows the live (theme-pinned) value
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '(empty)';
  return html`
    <div style="display:grid;grid-template-columns:170px 24px 1fr;gap:12px;align-items:center;padding:5px 0;border-bottom:1px solid var(--rimsoft,rgba(23,20,14,.14))">
      <code style="font:500 11px/1 var(--f-mono,monospace);color:var(--ink,#17140E)">${name}</code>
      ${colorTokens.has(name)
        ? html`<span style="width:24px;height:16px;border-radius:2px;outline:1px solid var(--rim,rgba(23,20,14,.3));background:var(${name})"></span>`
        : html`<span></span>`}
      <code style="font:400 11px/1 var(--f-mono,monospace);color:var(--muted,rgba(23,20,14,.62));overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v}</code>
    </div>
  `;
});

export const Vocabulary = {
  /* DOCS SECTION — on the docs page, not in the sidebar, untested. */
  tags: ['!dev', '!test'],
  render: () => html`<div style="max-width:560px">${rows}</div>`,
  parameters: {
    docs: {
      description: {
        story: 'Tier-1 vocabulary — the ~25 shared custom properties on :root, read through the live theme so the toolbar flips them. Swatches mark the true colors; formula tokens (plate, rim) list their resolved value.',
      },
    },
  },
};