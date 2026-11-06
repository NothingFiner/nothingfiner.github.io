/** Theme pin states for setGlaphicTheme() / the Storybook toolbar. */
export type GlaphicThemeName = 'light' | 'dark' | 'system';

/** Names of every Tier-1 vocabulary token in tokens.css. Tooling and
 *  Storybook argTypes only — applying styles is CSS's job. */
export type GlaphicTokenName =
  | '--bg' | '--grid' | '--ink' | '--muted'
  | '--hot' | '--onhot' | '--cold' | '--acid'
  | '--platec' | '--platea' | '--plate'
  | '--rim' | '--rimsoft' | '--blend' | '--diff'
  | '--r' | '--ch' | '--blur' | '--cut' | '--furn'
  | '--hz' | '--hzw'
  | '--f-disp' | '--f-body' | '--f-mono';

export const glaphicTokens = [
  '--bg', '--grid', '--ink', '--muted',
  '--hot', '--onhot', '--cold', '--acid',
  '--platec', '--platea', '--plate',
  '--rim', '--rimsoft', '--blend', '--diff',
  '--r', '--ch', '--blur', '--cut', '--furn',
  '--hz', '--hzw',
  '--f-disp', '--f-body', '--f-mono',
] as const satisfies readonly GlaphicTokenName[];

/** Names of the Glaphic primitives layer in tokens.css — the Figma
 *  variables export (collection "primitives", mode "global") that the
 *  new component looks are built on. Same trimming rule as the CSS:
 *  `color-` dropped, `font-` kept, structural names verbatim. */
export type GlaphicPrimitiveTokenName =
  // ink
  | '--glaphic-ink-magenta' | '--glaphic-ink-yellow' | '--glaphic-ink-cyan'
  | '--glaphic-ink-violet' | '--glaphic-ink-black'
  | '--glaphic-ink-brand-dark' | '--glaphic-ink-brand-fluro'
  // multiply
  | '--glaphic-multiply-magenta-yellow' | '--glaphic-multiply-yellow-cyan'
  | '--glaphic-multiply-cyan-magenta'
  // hero
  | '--glaphic-hero-red' | '--glaphic-hero-green' | '--glaphic-hero-violet'
  // semantic
  | '--glaphic-semantic-danger-base' | '--glaphic-semantic-danger-surface'
  | '--glaphic-semantic-danger-text'
  | '--glaphic-semantic-warning-base' | '--glaphic-semantic-warning-surface'
  | '--glaphic-semantic-warning-text'
  | '--glaphic-semantic-success-base' | '--glaphic-semantic-success-surface'
  | '--glaphic-semantic-success-text'
  | '--glaphic-semantic-info-base' | '--glaphic-semantic-info-surface'
  | '--glaphic-semantic-info-text'
  // neutral
  | '--glaphic-neutral-paper' | '--glaphic-neutral-paper-elevated'
  | '--glaphic-neutral-paper-deep' | '--glaphic-neutral-ink'
  | '--glaphic-neutral-grey-cool-50' | '--glaphic-neutral-grey-cool-100'
  | '--glaphic-neutral-grey-cool-200' | '--glaphic-neutral-grey-cool-300'
  | '--glaphic-neutral-grey-cool-400' | '--glaphic-neutral-grey-cool-500'
  | '--glaphic-neutral-grey-cool-600' | '--glaphic-neutral-grey-cool-700'
  | '--glaphic-neutral-grey-cool-800' | '--glaphic-neutral-grey-cool-900'
  | '--glaphic-neutral-grey-warm-50' | '--glaphic-neutral-grey-warm-100'
  | '--glaphic-neutral-grey-warm-200' | '--glaphic-neutral-grey-warm-300'
  | '--glaphic-neutral-grey-warm-400' | '--glaphic-neutral-grey-warm-500'
  | '--glaphic-neutral-grey-warm-600' | '--glaphic-neutral-grey-warm-700'
  | '--glaphic-neutral-grey-warm-800' | '--glaphic-neutral-grey-warm-900'
  // ui
  | '--glaphic-ui-background' | '--glaphic-ui-surface'
  | '--glaphic-ui-surface-sunk' | '--glaphic-ui-text'
  | '--glaphic-ui-text-muted' | '--glaphic-ui-text-subtle'
  | '--glaphic-ui-border' | '--glaphic-ui-border-strong'
  | '--glaphic-ui-focus'
  // type
  | '--glaphic-font-family-mono' | '--glaphic-font-family-display'
  | '--glaphic-font-family-sans'
  | '--glaphic-font-weight-thin' | '--glaphic-font-weight-light'
  | '--glaphic-font-weight-regular' | '--glaphic-font-weight-semibold'
  | '--glaphic-font-weight-bold'
  | '--glaphic-font-size-0' | '--glaphic-font-size-1'
  | '--glaphic-font-size-2' | '--glaphic-font-size-3'
  | '--glaphic-font-size-4' | '--glaphic-font-size-5'
  | '--glaphic-font-size-6' | '--glaphic-font-size-7'
  | '--glaphic-font-line-height-0'
  // radius, spacing, component sizing, borders
  | '--glaphic-radius-base'
  | '--glaphic-spacing-1' | '--glaphic-spacing-2' | '--glaphic-spacing-3'
  | '--glaphic-spacing-4' | '--glaphic-spacing-5' | '--glaphic-spacing-6'
  | '--glaphic-spacing-7' | '--glaphic-spacing-8' | '--glaphic-spacing-9'
  | '--glaphic-spacing-10' | '--glaphic-spacing-11' | '--glaphic-spacing-12'
  | '--glaphic-button-lg-padding-x' | '--glaphic-button-lg-padding-y'
  | '--glaphic-button-md-padding-x' | '--glaphic-button-md-padding-y'
  | '--glaphic-button-sm-padding-x' | '--glaphic-button-sm-padding-y'
  | '--glaphic-button-group-md-padding-x'
  | '--glaphic-button-group-md-padding-y'
  | '--glaphic-switch-toggle-size' | '--glaphic-switch-track-y'
  | '--glaphic-switch-track-x'
  | '--glaphic-border-width-xs' | '--glaphic-border-width-sm'
  | '--glaphic-border-width-md' | '--glaphic-border-width-lg'
  | '--glaphic-border-width-xl';

export const glaphicPrimitiveTokens = [
  '--glaphic-ink-magenta', '--glaphic-ink-yellow', '--glaphic-ink-cyan',
  '--glaphic-ink-violet', '--glaphic-ink-black',
  '--glaphic-ink-brand-dark', '--glaphic-ink-brand-fluro',
  '--glaphic-multiply-magenta-yellow', '--glaphic-multiply-yellow-cyan',
  '--glaphic-multiply-cyan-magenta',
  '--glaphic-hero-red', '--glaphic-hero-green', '--glaphic-hero-violet',
  '--glaphic-semantic-danger-base', '--glaphic-semantic-danger-surface',
  '--glaphic-semantic-danger-text',
  '--glaphic-semantic-warning-base', '--glaphic-semantic-warning-surface',
  '--glaphic-semantic-warning-text',
  '--glaphic-semantic-success-base', '--glaphic-semantic-success-surface',
  '--glaphic-semantic-success-text',
  '--glaphic-semantic-info-base', '--glaphic-semantic-info-surface',
  '--glaphic-semantic-info-text',
  '--glaphic-neutral-paper', '--glaphic-neutral-paper-elevated',
  '--glaphic-neutral-paper-deep', '--glaphic-neutral-ink',
  '--glaphic-neutral-grey-cool-50', '--glaphic-neutral-grey-cool-100',
  '--glaphic-neutral-grey-cool-200', '--glaphic-neutral-grey-cool-300',
  '--glaphic-neutral-grey-cool-400', '--glaphic-neutral-grey-cool-500',
  '--glaphic-neutral-grey-cool-600', '--glaphic-neutral-grey-cool-700',
  '--glaphic-neutral-grey-cool-800', '--glaphic-neutral-grey-cool-900',
  '--glaphic-neutral-grey-warm-50', '--glaphic-neutral-grey-warm-100',
  '--glaphic-neutral-grey-warm-200', '--glaphic-neutral-grey-warm-300',
  '--glaphic-neutral-grey-warm-400', '--glaphic-neutral-grey-warm-500',
  '--glaphic-neutral-grey-warm-600', '--glaphic-neutral-grey-warm-700',
  '--glaphic-neutral-grey-warm-800', '--glaphic-neutral-grey-warm-900',
  '--glaphic-ui-background', '--glaphic-ui-surface',
  '--glaphic-ui-surface-sunk', '--glaphic-ui-text',
  '--glaphic-ui-text-muted', '--glaphic-ui-text-subtle',
  '--glaphic-ui-border', '--glaphic-ui-border-strong',
  '--glaphic-ui-focus',
  '--glaphic-font-family-mono', '--glaphic-font-family-display',
  '--glaphic-font-family-sans',
  '--glaphic-font-weight-thin', '--glaphic-font-weight-light',
  '--glaphic-font-weight-regular', '--glaphic-font-weight-semibold',
  '--glaphic-font-weight-bold',
  '--glaphic-font-size-0', '--glaphic-font-size-1',
  '--glaphic-font-size-2', '--glaphic-font-size-3',
  '--glaphic-font-size-4', '--glaphic-font-size-5',
  '--glaphic-font-size-6', '--glaphic-font-size-7',
  '--glaphic-font-line-height-0',
  '--glaphic-radius-base',
  '--glaphic-spacing-1', '--glaphic-spacing-2', '--glaphic-spacing-3',
  '--glaphic-spacing-4', '--glaphic-spacing-5', '--glaphic-spacing-6',
  '--glaphic-spacing-7', '--glaphic-spacing-8', '--glaphic-spacing-9',
  '--glaphic-spacing-10', '--glaphic-spacing-11', '--glaphic-spacing-12',
  '--glaphic-button-lg-padding-x', '--glaphic-button-lg-padding-y',
  '--glaphic-button-md-padding-x', '--glaphic-button-md-padding-y',
  '--glaphic-button-sm-padding-x', '--glaphic-button-sm-padding-y',
  '--glaphic-button-group-md-padding-x', '--glaphic-button-group-md-padding-y',
  '--glaphic-switch-toggle-size', '--glaphic-switch-track-y',
  '--glaphic-switch-track-x',
  '--glaphic-border-width-xs', '--glaphic-border-width-sm',
  '--glaphic-border-width-md', '--glaphic-border-width-lg',
  '--glaphic-border-width-xl',
] as const satisfies readonly GlaphicPrimitiveTokenName[];