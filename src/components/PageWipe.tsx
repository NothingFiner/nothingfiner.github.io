/**
 * PageWipe — the site's page-change animation, driven by the library's
 * glaphic-wipe (read from @glaphic/ui as source; the component is an
 * SPA overlay protocol, rendering NO children):
 *
 *   run() → the plates sweep → `covered` (the full-coincidence ink
 *   seal) → THE SWAP APPLIES HERE → the hold types the caption
 *   (self-driving) → `done`.
 *
 * Two nav paths feed it:
 *  1. CONTROLLED — a capture-phase click listener intercepts every
 *     same-route `#/<route>` anchor (the footer band, the drawer's
 *     Links, the chat's inline links…), preventDefaults it, and runs
 *     the wipe; the hash is assigned only AT `covered`, so the old
 *     page stays on screen under the sweep and the swap lands under
 *     the opaque seal exactly as the protocol prescribes.
 *  2. POST-SWAP — a `hashchange` listener covers the navs a click
 *     can't hold (wouter's programmatic `navigate()` calls, the
 *     browser's back/forward buttons): the swap has already happened
 *     by the time the event dispatches, so the wipe runs as a
 *     decorative pass over the arriving page (same plates, same
 *     caption, self-driving) rather than a held-swap transition.
 *
 * The caption is the INCOMING page's name, printed LEFT-aligned
 * (--glaphic-wipe-caption-inline: flex-start on the host). Caption
 * mode is self-driving — typing → blink → exit on its own, no
 * release(); on the caption-less fallback (unknown route) a `dwell`
 * plays the same role.
 *
 * ESCAPE HATCH — wipes are disabled (navigation applies instantly,
 * no overlay) when either holds:
 *   - a `nowipe` query parameter on the page URL (any value, BEFORE
 *     the hash: e.g. http://localhost:5173/?nowipe=1#/projects)
 *   - `data-wipe="off"` on <body> (call setWipesEnabled(false), or
 *     set the attribute from devtools/tests)
 * Re-enable by removing the param and calling setWipesEnabled(true).
 */

import { useEffect } from 'preact/hooks';
// the wipe component + its cursor-type writer, straight from the
// library's source (the @glaphic/ui barrel already pulls it, but the
// direct import stands on its own so this module never depends on the
// gallery page being mounted)
import { GlaphicWipe } from '@glaphic/ui/components/glaphic-wipe/glaphic-wipe.js';
import { projects } from '../data/projects';

void GlaphicWipe; // the import registers <glaphic-wipe>; no JSX use

/** the wipe element's drive surface (run / release / abort / events) */
interface WipeElement extends HTMLElement {
  run(): Promise<void>;
  release(): void;
  abort(): void;
  direction: string;
  caption: string;
  dwell: number;
  phase: string;
}

type WipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * The nav order: home → projects → chat → blog → resume → about.
 * The travel derives from the pair's distance across it — moving
 * DOWN the list the sweep travels left (forward), back UP it travels
 * right. Detail routes ride their parent's slot.
 */
const NAV_ORDER: [RegExp, number][] = [
  [/^\/$/, 0],
  [/^\/projects(\/|$)/, 1],
  /* the past family slots right after the projects one (the bands +
     the /past/:id details ride one slot); no existing pair's relative
     order changes, so no existing route pair flips direction */
  [/^\/past(\/|$)/, 2],
  [/^\/chat$/, 3],
  [/^\/blog(\/|$)/, 4],
  [/^\/resume$/, 5],
  [/^\/about$/, 6],
  [/^\/games\/dark-forest$/, 7],
  [/^\/components$/, 8],
];

const orderIndex = (path: string): number | null => {
  for (const [re, idx] of NAV_ORDER) if (re.test(path)) return idx;
  return null;
};

function directionFor(from: string, to: string): WipeDirection {
  const a = orderIndex(from);
  const b = orderIndex(to);
  if (a === null || b === null || a === b) return 'right';
  return b > a ? 'left' : 'right';
}

/** a route change we wipe for = both ends are KNOWN routes */
const isKnown = (path: string): boolean => orderIndex(path) !== null;

/** the incoming page's name — the caption the cover types */
function captionFor(path: string): string | null {
  if (path === '/' || path === '') return 'Home';
  const detail = /^\/projects\/([^/?#]+)/.exec(path);
  if (detail) {
    return (
      projects.find((p) => p.id === decodeURIComponent(detail[1]))?.title ??
      'Project'
    );
  }
  const table: [RegExp, string][] = [
    [/^\/projects\/?$/, 'Projects'],
    [/^\/past\/?$/, 'Past Work'],
    [/^\/chat\/?$/, 'Chat'],
    [/^\/blog\/?$/, 'Blog'],
    [/^\/blog\/[^/?#]+$/, 'Blog'],
    [/^\/resume\/?$/, 'Resume'],
    [/^\/about\/?$/, 'About Me'],
    [/^\/games\/dark-forest\/?$/, 'Dark Forest'],
    [/^\/components\/?$/, 'Components'],
  ];
  for (const [re, name] of table) if (re.test(path)) return name;
  return null;
}

/* the blog family's own navs (the list's entry click, the post's back
   pair) ride the QUICK PASS: one fast film with no typed caption —
   "Blog" would type between two pages already inside the blog */
const sameBlogFamily = (fromPath: string, toPath: string): boolean =>
  /^\/blog(\/|$)/.test(fromPath) && /^\/blog(\/|$)/.test(toPath);

/** mirroring wouter's own hash parsing: leading '#' ignored, the
    leading '/' optional (…and a plain in-page anchor `#about` reads
    as the path '/about', which is why in-page scroll anchors are
    recognised here and never wiped) */
const parseHash = (hash: string): string =>
  '/' + hash.replace(/^#?\/?/, '');

const readHashPath = (): string => parseHash(location.hash);

/** the escape hatch (see the header docs) */
const wipesDisabled = (): boolean =>
  new URLSearchParams(location.search).has('nowipe') ||
  document.body.dataset.wipe === 'off';

/** force-enable / force-disable the wipes at runtime (body attr) */
export function setWipesEnabled(on: boolean): void {
  if (on) delete document.body.dataset.wipe;
  else document.body.dataset.wipe = 'off';
}

export function PageWipe(): null {
  useEffect(() => {
    const wipe = document.createElement('glaphic-wipe') as unknown as WipeElement;
    /* Eliot's ask — the caption ones, text aligned LEFT: the caption
       seat passes flex keywords through on either axis */
    wipe.style.setProperty('--glaphic-wipe-caption-inline', 'flex-start');
    /* page-name voice — Eliot: bigger, ~64px (clamped so a 390px
       phone's name still fits the band) */
    wipe.style.setProperty(
      '--glaphic-wipe-caption-size',
      'clamp(28px, 4.5vw, 64px)',
    );
    document.body.appendChild(wipe);

    // the tracked current route (only KNOWN routes are tracked — an
    // in-page anchor's pseudo-path like '/technologies' is not a
    // route and is skipped by isKnown below)
    let currentPath = readHashPath();
    /* the pending controlled swap — applied at `covered` */
    let pending: string | null = null;
    /* marks the hash assignment this module made itself (so the
       hashchange listener doesn't re-wipe the nav it just applied) */
    let ownHash = false;

    const onCovered = (): void => {
      console.log('WIPE covered target=' + String(pending));
      const target = pending;
      pending = null;
      if (target === null) return;
      ownHash = true;
      location.hash = '#' + target;
    };

    const startWipe = (toPath: string, fromPath: string, preSwapped: boolean): void => {
      console.log('WIPE startWipe to=' + toPath + ' from=' + fromPath + ' pre=' + preSwapped + ' disabled=' + wipesDisabled());
      /* the detail choreography owns every nav touching /projects/:id
         or /past/:id — the detail drivers' own held-swap protocols
         hold those routes; the overlay never arms for them */
      if (toPath.startsWith('/projects/') || fromPath.startsWith('/projects/')) return;
      if (toPath.startsWith('/past/') || fromPath.startsWith('/past/')) return;
      if (!isKnown(toPath) || (!preSwapped && !isKnown(fromPath))) return;
      if (toPath === fromPath) return;
      if (wipesDisabled()) {
        /* escape hatch: navigation without the overlay. On the
           pre-swapped path the hash is already applied — nothing to
           undo; on the controlled path apply it right here */
        if (!preSwapped) {
          ownHash = true;
          location.hash = '#' + toPath;
        }
        return;
      }
      /* one film at a time — a nav while a pass runs cancels the
         running cycle (abort snaps the plates parked instantly; no
         sweep-through) and starts this one */
      if (wipe.phase !== 'idle') {
        pending = null;
        wipe.abort();
      }
      pending = preSwapped ? null : toPath;
      wipe.direction = directionFor(fromPath, toPath);
      const caption = captionFor(toPath);
      if (sameBlogFamily(fromPath, toPath)) {
        /* Eliot's quick pass: the entry click swaps under one fast
           film — no caption to type (the nav stays inside the blog)
           and a brief dwell; the sweep itself rides a brisker motion
           than the site's 0.6s default, or the fixed plate speed
           would eat the "much quicker" ask */
        wipe.caption = '';
        wipe.dwell = 220;
        wipe.style.setProperty('--glaphic-wipe-motion', '0.35s');
      } else {
        wipe.caption = caption ?? '';
        /* caption mode is self-driving; the fallback holds by dwell */
        wipe.dwell = caption ? 0 : 900;
        wipe.style.setProperty('--glaphic-wipe-motion', '0.6s');
      }
      void wipe.run();
    };

    /* (2) the post-swap path: programmatic navigate()s and the
        history buttons. The swap has already rendered — the wipe
        plays over the arriving page. DarkForest included: the game's
        chrome mounts its own layers under the overlay's z-index, so
        the protocol is uniform there too. */
    const onHashChange = (): void => {
      const path = readHashPath();
      if (ownHash) {
        ownHash = false;
        currentPath = path;
        return;
      }
      const from = currentPath;
      currentPath = path;
      startWipe(path, from, true);
    };

    /* (1) the controlled path: every same-site `#/<route>` anchor,
        capture phase — ahead of wouter's own Link handler (which
        would otherwise apply the hash straight away and lose the
        held swap). Plain in-page anchors (`#about`…) and everything
        that isn't a route link is untouched. */
    const onClick = (ev: MouseEvent): void => {
      if (ev.defaultPrevented || ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const el = ev.target instanceof Element ? ev.target : null;
      const a = el?.closest<HTMLAnchorElement>('a[href^="#/"]');
      if (!a || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href) return;
      const toPath = parseHash(href);
      if (toPath === currentPath || !isKnown(toPath)) return;
      /* Eliot: the detail pages' transitions are NOT wipes — any nav
         touching a /projects/:id or /past/:id route returns UNTOUCHED
         (no overlay, no preventDefault): that page's own driver holds
         the swap and plays the entrance/exit choreography */
      if (toPath.startsWith('/projects/') || currentPath.startsWith('/projects/')) return;
      if (toPath.startsWith('/past/') || currentPath.startsWith('/past/')) return;
      ev.preventDefault();
      ev.stopPropagation();
      const fromPath = currentPath;
      startWipe(toPath, fromPath, false);
    };

    wipe.addEventListener('covered', onCovered);
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick, true);

    return () => {
      wipe.removeEventListener('covered', onCovered);
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onClick, true);
      pending = null;
      wipe.abort();
      wipe.remove();
    };
  }, []);

  return null;
}