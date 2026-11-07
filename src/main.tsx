import { render } from 'preact';
import { ThemeProvider } from './context/ThemeContext';
import { App } from './app';
// glaphicUI tokens first — every glaphic component reads these custom
// properties; load them before any component CSS matters.
import '@glaphic/ui/tokens.css';
import './lib/glaphic-registrar';
import './index.css';
// the landing's shared styles (the grow headline + its shadow-print
// keyframes) — shared by the landing sections' components
import './landing.css';

// The skip link is static markup (index.html) whose default behavior
// feeds the hash router: '#main-content' parses as a wouter route
// ('main-content'), no Route matches it and the page collapses to the
// chrome + Suspense fallback. Intercept the click: prevent the hash
// from ever landing and move focus to the main landmark directly
// (main carries tabIndex -1 on every route, home included).
const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('main-content')?.focus();
  });
}

// The mount node is static markup in index.html; a missing node is a
// deployment error, not a silent no-render.
const host = document.getElementById('app');
if (!host) throw new Error('main: #app mount node missing from index.html');

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  host
);
