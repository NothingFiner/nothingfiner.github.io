// Prerender the home route into dist/index.html so the root URL ships with
// real content for non-JS fetchers (link previewers, ATS/recruiter scrapers,
// search engines that don't render JS). Runs after `vite build`.
//
// It serves the built dist/ over HTTP, loads the root URL in a headless
// browser, waits for the SPA to render the home page, then injects the
// rendered #app markup back into dist/index.html. On the client, Preact
// re-mounts and replaces this content, so there is no duplication or
// hydration step — the static HTML is purely a fallback for non-JS clients.
import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from 'puppeteer';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = Number(process.env.PRERENDER_PORT) || 4173;
const ORIGIN = `http://localhost:${PORT}`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

// Minimal static file server with SPA fallback (serve index.html for unknown
// paths so hash routing resolves to the home shell).
const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = join(DIST, urlPath);
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    filePath = join(DIST, 'index.html'); // SPA fallback
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`prerender: serving ${DIST} at ${ORIGIN}`);

const launchOptions = {
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

let browser;
try {
  browser = await launch(launchOptions);
  const page = await browser.newPage();
  await page.goto(ORIGIN + '/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for the home hero to render before capturing.
  await page.waitForSelector('#main-content h1', { timeout: 20000 });
  // Let fonts/layout settle.
  await new Promise((r) => setTimeout(r, 400));

  const appHTML = await page.$eval('#app', (el) => el.innerHTML);

  if (!appHTML || !appHTML.trim()) {
    throw new Error('prerender: #app was empty — home route did not render');
  }

  const indexFile = join(DIST, 'index.html');
  const html = await readFile(indexFile, 'utf8');
  const marker = '<div id="app"></div>';
  if (!html.includes(marker)) {
    throw new Error(`prerender: could not find "${marker}" in dist/index.html`);
  }
  await writeFile(indexFile, html.replace(marker, `<div id="app">${appHTML}</div>`));
  console.log('prerender: wrote populated dist/index.html');
} finally {
  if (browser) await browser.close();
  server.close();
}