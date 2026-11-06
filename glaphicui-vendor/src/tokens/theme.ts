import type { GlaphicThemeName } from './tokens.js';

/** Pin the glaphic theme on the page. 'system' removes the pin and
 *  lets prefers-color-scheme decide (tokens.css dual dark blocks). */
export function setGlaphicTheme(theme: GlaphicThemeName): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.dataset.theme = theme;
}

export function currentGlaphicTheme(): GlaphicThemeName {
  const pinned = document.documentElement.getAttribute('data-theme');
  return pinned === 'light' || pinned === 'dark' ? pinned : 'system';
}