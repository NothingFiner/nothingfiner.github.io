import type { StoryFn, StoryContext } from '@storybook/web-components-vite';

/**
 * Story decorator: reads `args.tier2` (a CSS declaration string of
 * `--glaphic-*` custom properties) and applies it as inline style on the
 * story's top-level element. Gives every story a live Tier-2 panel in
 * docs without a per-component plumbing job.
 *
 * Example args: { tier2: "--glaphic-card-depth: 30; --glaphic-card-tint: var(--cold)" }
 */
export const withTier2 = <T extends StoryFn>(story: T) => {
  return (ctx: StoryContext) => {
    const result = story(ctx.args, ctx) as unknown;
    if (ctx.args?.tier2 && result instanceof HTMLElement) {
      result.style.cssText += ctx.args.tier2;
    }
    return result;
  };
};

/**
 * The Tier-1 pigments for color-control presets — every color picker
 * keeps the house palette one click away beside the free picker.
 */
export const TIER1_COLORS = [
  '#17140E', // ink
  '#F1ECE2', // bg
  '#E03A0B', // hot
  '#FBF7EC', // onhot
  '#0780B8', // cold
  '#E3D71B', // acid
];

/**
 * Maps story args onto CSS custom properties as an inline style string.
 * Used by render functions so each story's Controls panel can carry
 * color controls for that component's Tier-2 knobs. Unset args produce
 * no declaration, so the component's own Tier-2 defaults stay live.
 *
 *   style="max-width:340px;${tier2Vars(args, { '--glaphic-card-tint': 'tint' })}"
 */
export function tier2Vars(
  args: Record<string, unknown> | undefined,
  map: Record<string, string>, // css custom property → arg name
): string {
  if (!args) return '';
  const parts: string[] = [];
  for (const [cssVar, argName] of Object.entries(map)) {
    const value = args[argName];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      parts.push(`${cssVar}: ${String(value)}`);
    }
  }
  return parts.length ? `${parts.join('; ')};` : '';
}