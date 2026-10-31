// The landing's crimson sidebar — the nav tool that lives on every part
// of the landing page beyond the first fold. NOT the about section's
// child: a fixed, full-viewport-height column flush right that slides in
// from being invisible between page 1 and page 2 and STAYS parked for
// everything below (the story, the technologies, what's next — it is not
// limited to one section's height). Scroll back up and it slides out
// again: the same --ab-p journey clock (this component sets it on :root)
// drives the sticky footer band's crossfades, so every rider follows one
// clock without its own listeners.
//
// The nav reads: the active link — the ONLY link visible when the panel
// enters — in paper, the others idle in ink, fanning out from the active
// link's spot (each starting there, overshooting slightly, snapping back
// into place) once the panel has arrived, and turning fluro on hover.
// The active link follows the scroll along the journey's order (about →
// what-i'm-up-to → past-work → technologies) — the deepest section whose
// top has crossed the viewport's middle owns the link, and back on the
// way up.
// A switch is a COLOR WIPE, not a drop: the old one used to re-trigger
// its fan (and vanish into the delay's backwards fill first) — now both
// links wipe color in the same instant, the new active's ink lifting to
// paper as the front passes, the old one's paper draining the same
// direction. Per-link fan memory means only arrival (and the pool menu
// handing the corner back) re-fans. Home. — the null target —
// smooth-scrolls to the page top, which slides the panel out again
// through the same journey clock.
// The fan has hysteresis: it only clears once the sidebar is meaningfully
// leaving, so small scroll-ups don't blink the links away — a meaningful
// scroll-up plays the reverse fan (the links fly back to the active
// link's spot in reverse order), and while the pool menu (in the sticky
// band below) is open the big links fade out so the menu owns the corner.
//
// Desktop only: on mobile it becomes a plainly listed crimson block
// joining the flow (no slide journey, all links visible).
import { useEffect, useRef, useState } from 'preact/hooks';

const INK = '#0D0221';
const RED = '#A6022A';
const ECHO = '#14F1C8';
const WHITE = '#F2F5EB';

// the panel's nav — the five links in the journey's order (the Phase-4
// decision); the active index follows the scroll (see the journey
// clock). The idle/active/hover inks live in CSS (idle ink, active
// paper, hover fluro)
const NAV: { label: string; target: string | null }[] = [
  { label: 'Home.', target: null }, // scroll to page top
  { label: 'About.', target: 'about' }, // the story section
  { label: "What I'm up to.", target: 'now' },
  { label: 'Past Work.', target: 'past' },
  { label: 'Technologies.', target: 'technologies' },
];
const INDEX = { HOME: 0, ABOUT: 1, NOW: 2, PAST: 3, TECHNOLOGIES: 4 };

export function LandingPanel() {
  const [arrived, setArrived] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // which nav link is active (About. by default; switches with the
  // scroll — ref keeps the scroll handler closure-free)
  const [active, setActive] = useState(INDEX.ABOUT);
  const activeRef = useRef(INDEX.ABOUT);
  // the hand-over wipe: on a switch BOTH links play it — the class
  // clears once the 0.4s sweep completes
  const [wipe, setWipe] = useState<{ gain: number | null; was: number | null }>({
    gain: null,
    was: null,
  });
  // per-link fan memory — indices whose landing-panel-fan has played, so a later
  // active switch only ever wipes colors; only arrival and the pool
  // menu handing the corner back re-fan (refs keep the scroll handler
  // closure-free)
  const [fanned, setFanned] = useState<number[]>([]);
  const fannedRef = useRef<number[]>([]);
  const markFanned = (idx: number[]) => {
    fannedRef.current = Array.from(new Set([...fannedRef.current, ...idx]));
    setFanned(fannedRef.current);
  };
  const resetFanned = () => {
    fannedRef.current = [];
    setFanned([]);
  };
  // journey memory for the fan's hysteresis: has the sidebar ever parked
  // (so a scroll-up plays the reverse fan), and is it gone?
  const wasArrived = useRef(false);
  const isArrivedNow = useRef(false);
  const isLeavingNow = useRef(false);

  // the journey clock: as the about section ("I've been Coding.") travels
  // up from the viewport bottom, --ab-p runs 0→1 and the panel translates
  // from fully off-screen right. D9's divisor: the slide starts while the
  // about's top is still at 55vh (the run = the about's top's last 0.55vh
  // of viewport), so the sidebar finishes moving into position a little
  // more quickly — and, parked, keeps covering the fold-height band for
  // the rest of the landing flow below it.
  useEffect(() => {
    // the handle for the late fan-memory park timer — it must survive
    // between schedules (a callback firing after teardown is a ghost
    // write: it would setState on a dead component)
    let parkTimer: number | undefined;
    const onScroll = () => {
      const vh = window.innerHeight;
      const top = document.querySelector('.landing-about')?.getBoundingClientRect().top;
      if (top === undefined) return;
      const p = Math.min(1, Math.max(0, 1 - top / (vh * 0.55)));
      document.documentElement.style.setProperty('--ab-p', String(p));

      // the active link follows the stretch on screen along the
      // journey's order: about until a later section's top crosses the
      // viewport's middle, the deepest crossing owns the link — now,
      // then past work, then technologies (the Phase-4 order) — and
      // back on the way up
      const nowTop = document.querySelector('.landing-now')?.getBoundingClientRect().top;
      const pastTop = document.querySelector('.landing-past')?.getBoundingClientRect().top;
      const techTop = document.querySelector('.landing-technologies')?.getBoundingClientRect().top;
      let want = INDEX.ABOUT;
      if (nowTop !== undefined && nowTop <= vh * 0.5) want = INDEX.NOW;
      if (pastTop !== undefined && pastTop <= vh * 0.5) want = INDEX.PAST;
      if (techTop !== undefined && techTop <= vh * 0.5) want = INDEX.TECHNOLOGIES;
      if (want !== activeRef.current) {
        const was = activeRef.current;
        activeRef.current = want;
        setActive(want);
        // both links wipe in the same instant; anything tagged mid-fan
        // parks its fan memory so the switch never replays a drop
        setWipe({ gain: want, was });
        markFanned([want, was]);
      }

      const nextArrived = wasArrived.current ? p > 0.82 : p >= 1;
      // the out-fan only plays if the sidebar actually arrived on screen
      const nextLeaving = wasArrived.current && !nextArrived && p > 0.06;
      if (p <= 0.06) wasArrived.current = false;
      if (nextArrived !== isArrivedNow.current) {
        isArrivedNow.current = nextArrived;
        setArrived(nextArrived);
      }
      if (nextLeaving !== isLeavingNow.current) {
        isLeavingNow.current = nextLeaving;
        setLeaving(nextLeaving);
      }
      if (nextArrived) wasArrived.current = true;
      // park the fan memory once the flight settles (the farthest link:
      // 0.25s delay + 4 x 0.09s stagger (0.36) + 0.6s flight = 1.21s, the
      // 1250ms timer carries the margin) — from here on a switch only
      // wipes colors
      if (nextArrived) {
        window.clearTimeout(parkTimer);
        parkTimer = window.setTimeout(() => {
          if (isArrivedNow.current) markFanned([0, 1, 2, 3, 4]);
        }, 1250);
      }
      // a whole scroll-out parks the memory so a re-arrival re-fans
      if (p <= 0.06 && fannedRef.current.length) resetFanned();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(parkTimer);
      window.removeEventListener('scroll', onScroll);
      /* the clock is the LANDING's journey — leaving the landing must
         hand a clean :root to the next route: a stale --ab-p=1 kept
         every later route riding the band's sidebar poses (the contact
         icons printed paper over their paper grounds) */
      document.documentElement.style.setProperty('--ab-p', '0');
    };
  }, []);

  // clear the wipe classes once the sweep completes (a re-render with
  // them gone keeps the settled colors via the static rules)
  useEffect(() => {
    if (wipe.gain === null) return;
    const t = window.setTimeout(() => setWipe({ gain: null, was: null }), 460);
    return () => window.clearTimeout(t);
  }, [wipe.gain]);

  // the pool menu (the sticky band's) owns the corner while open; when
  // it hands back, the links re-fan — its bubbling `change` event
  // ({index, open}, fired on every open/close move) is the handback
  // signal. It mounts late (3.2s in, once the band invites it), so a
  // menu query parked at this component's mount would miss it entirely
  useEffect(() => {
    const onChange = (e: Event) => {
      const m = e.target as Element;
      if (m.tagName !== 'GLAPHIC-POOL-MENU') return;
      const open = (e as CustomEvent).detail?.open ?? m.hasAttribute('open');
      if (!open && isArrivedNow.current) resetFanned();
    };
    document.addEventListener('change', onChange);
    return () => document.removeEventListener('change', onChange);
  }, []);

  // a null target is the page top — the journey clock slides the panel
  // out as the hero comes back, then the fan re-arms past the fold
  const go = (id: string | null) => {
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div class={`landing-panel ${arrived ? 'landing-panel--arrived' : ''} ${leaving ? 'landing-panel--leaving' : ''}`}>
      <style>{`
        .landing-panel {
          position: fixed;
          /* fixed elements don't contribute to the document's scrollable
             overflow, so the off-screen pose opens no horizontal scrollbar */
          top: 0; right: 0; bottom: 0;
          width: 24vw;
          background: ${RED};
          /* above the landing flow (which carries the site gutter); the
             sticky footer band (z 45) stays above it so the pool menu and
             the icons own the corner */
          z-index: 40;
          /* waits fully off-screen right; the scroll journey parks it in */
          translate: calc((1 - var(--ab-p, 0)) * 106%) 0;
        }

        /* the oversized section nav — flush to the panel edge */
        .landing-panel__nav {
          position: absolute;
          left: 0.9vw;
          top: 38.7vh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.36vh;
          /* one nav slot: link line-height plus the column gap — the fan
             measures flight distances from the active link in these */
          --ab-slot: calc(clamp(22px, 2.6vw, 37px) * 1.1 + 1.36vh);
          transition: opacity 0.3s ease-out;
        }
        .landing-panel__nav a {
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(22px, 2.6vw, 37px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          /* the ink is a two-stop gradient clipped to the glyphs: idle
             shows the right half (ink), active slides to the left half
             (paper), and the hard boundary between them sweeps across
             the word as the position moves */
          background-image: linear-gradient(to right, ${WHITE} 0% 50%, ${INK} 50% 100%);
          background-size: 200% 100%;
          background-position: 100% 0;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition: color 0.25s ease-out, opacity 0.3s ease-out;
        }
        .landing-panel__nav a:hover, .landing-panel__nav a:focus-visible { color: ${ECHO}; }
        .landing-panel__nav a.landing-panel__link--active { background-position: 0 0; }

        /* the fan choreography — only the active link is visible when the
           panel enters; once it has arrived, the others fan out FROM the
           active link's words (each starts there — --fd is the flight
           distance in slot heights) with a slight overshoot past their
           own slot, then snap back into place. A link parks its --fanned
           memory once the flight settles, and rests visible — so a later
           active switch colors only (no re-fan, no disappear/reappear) */
        .landing-panel__nav a:not(.landing-panel__link--active) { opacity: 0; }
        .landing-panel--arrived .landing-panel__nav a.landing-panel__link--fanned:not(.landing-panel__link--active) { opacity: 1; }
        @keyframes landing-panel-fan {
          0% {
            opacity: 0;
            transform: translateY(calc(var(--fd, 0) * var(--ab-slot))) rotate(0deg);
          }
          60% {
            opacity: 1;
            transform: translateY(calc(var(--fd, 0) * var(--ab-slot) * -0.14))
              rotate(calc(var(--fd, 0) * 0.5deg));
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }
        .landing-panel--arrived .landing-panel__nav a:not(.landing-panel__link--active):not(.landing-panel__link--fanned) {
          animation: landing-panel-fan 0.6s cubic-bezier(0.3, 1.2, 0.5, 1) both;
          animation-delay: calc(0.25s + var(--afd, 0s));
        }
        /* the way out, once the sidebar is meaningfully leaving: the links
           fly BACK to the active link's spot — reverse of how they came,
           with the farthest link leaving first */
        .landing-panel--leaving .landing-panel__nav a:not(.landing-panel__link--active) {
          animation: landing-panel-fan-out 0.4s cubic-bezier(0.5, 0, 0.75, 0.6) both;
          animation-delay: var(--afo, 0s);
        }
        @keyframes landing-panel-fan-out {
          from { opacity: 1; transform: translateY(0) rotate(0deg); }
          to {
            opacity: 0;
            transform: translateY(calc(var(--fd, 0) * var(--ab-slot))) rotate(0deg);
          }
        }

        /* the active hand-over — both links sweep color in the SAME
           instant: the new active's ink lifts to paper as the front
           passes (landing-panel-wipe-in), the old one's paper drains to ink;
           the outgoing link swaps to the mirrored gradient so both
           fronts travel left-to-right together (one gradient only ever
           sends its fill from the left — the mirrored one keeps the
           same sweep direction on the way out). No re-fan, no
           disappear/reappear. */
        .landing-panel__nav a.landing-panel__link--active.landing-panel__link--wipe { animation: landing-panel-wipe-in 0.4s ease-out both; }
        .landing-panel__nav a.landing-panel__link--was {
          background-image: linear-gradient(to right, ${INK} 0% 50%, ${WHITE} 50% 100%);
          animation: landing-panel-wipe-out 0.4s ease-out both;
        }
        @keyframes landing-panel-wipe-in {
          from { background-position: 100% 0; }
          to { background-position: 0 0; }
        }
        @keyframes landing-panel-wipe-out {
          from { background-position: 100% 0; }
          to { background-position: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* the sweep jumps to its end pose; the static positions hold */
          .landing-panel__nav a.landing-panel__link--active.landing-panel__link--wipe, .landing-panel__nav a.landing-panel__link--was { animation-duration: 0s; }
        }

        /* the pool menu (the sticky footer band's) owns the corner while
           it's open — the big links disappear (and re-fan when the menu
           closes: re-applying the animation restarts it from the active
           link's spot) — the general-sibling ~, because the technologies
           section rides between the panel and the band in the flow (the
           Phase-4 order), so the adjacent sibling is never the .site-footer__band */
        .landing-panel:has(~ .site-footer__band glaphic-pool-menu[open]) .landing-panel__nav a {
          animation: none !important;
          opacity: 0 !important;
          pointer-events: none;
        }

        /* mobile: no slide journey — a plainly listed crimson block
           joining the flow ahead of the band and the about's content */
        @media (max-width: 899px) {
          .landing-panel {
            display: none;
          }
          .landing-panel__nav { position: static; gap: 3vh; }
          .landing-panel__nav a:not(.landing-panel__link--active) { opacity: 1; animation: none; } /* plainly listed */
          .landing-panel__nav a { transform: none !important; }
        }
      `}</style>

      <nav class="landing-panel__nav" aria-label="Section nav">
        {NAV.map((n, i) => {
          // flight distance from the active link, in nav slots
          // (the active index follows the scroll)
          const fd = active - i;
          const dist = Math.abs(fd);
          const cls = [
            'landing-panel__link',
            i === active ? 'landing-panel__link--active' : '',
            wipe.gain === i ? 'landing-panel__link--wipe' : '',
            wipe.was === i ? 'landing-panel__link--was' : '',
            fanned.includes(i) ? 'landing-panel__link--fanned' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <a
              key={n.label}
              class={cls}
              style={{
                '--fd': fd,
                /* D10's ladders: the in-flight staggers by distance
                   (dist x 0.09s); the out-fan's (4-dist) x 0.09s — the
                   farthest leaves first, no negative delays at the five
                   links (the old 2-dist pushed -0.09s at dist 3) */
                '--afd': `${dist * 0.09}s`,
                '--afo': `${(4 - dist) * 0.09}s`,
              }}
              onClick={() => go(n.target)}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  go(n.target);
                }
              }}
              role="link"
              tabIndex={0}
            >
              {n.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}