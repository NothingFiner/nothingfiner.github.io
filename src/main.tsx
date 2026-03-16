import { render } from 'preact';
import { ThemeProvider } from './context/ThemeContext';
import { App } from './app';
import './index.css';

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('app')!
);
