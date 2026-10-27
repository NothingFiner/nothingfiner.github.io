import { render } from 'preact';
import { ThemeProvider } from './context/ThemeContext';
import { App } from './app';
// glaphicUI tokens first — every glaphic component reads these custom
// properties; load them before any component CSS matters.
import '@glaphic/ui/tokens.css';
import './index.css';
// the landing's shared styles (the grow headline + its shadow-print
// keyframes) — shared by the landing sections' components
import './landing.css';

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
