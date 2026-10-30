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
// The active link follows the scroll — the about ("About.") while the
// story section is the stretch on screen, switching to the technologies
// ("Tools I've used.") once that section takes over past it, and back.
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

// the panel's nav — the active index follows the scroll (see the
// journey clock). The idle/active/hover inks live in CSS (idle ink,
// active paper, hover fluro)
const NAV: { label: string; target: string | null }[] = [
  { label: 'Home.', target: null }, // scroll to page top
  { label: 'About.', target: 'about' }, // the story section
  { label: 'Technologies.', target: 'technologies' },
  { label: "What I'm up to.", target: 'now' },
];
const ABOUT = 1;
const TECHNOLOGIES = 2;
const NOW = 3;

export function LandingPanel() {
  const [arrived, setArrived] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // which nav link is active (About. by default; switches with the
  // scroll — ref keeps the scroll handler closure-free)
  const [active, setActive] = useState(ABOUT);
  const activeRef = useRef(ABOUT);
  // the hand-over wipe: on a switch BOTH links play it — the class
  // clears once the 0.4s sweep completes
  const [wipe, setWipe] = useState<{ gain: number | null; was: number | null }>({
    gain: null,
    was: null,
  });
  // per-link fan memory — indices whose ab-fan has played, so a later
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
  // from fully off-screen right; the slide completes while the section's
  // top is still ~30vh high, so the sidebar arrives between page 1 and
  // page 2 — and, parked, keeps covering the fold-height band for the rest
  // of the landing flow below it.
  useEffect(() => {
    // the handle for the late fan-memory park timer — it must survive
    // between schedules (a callback firing after teardown is a ghost
    // write: it would setState on a dead component)
    let parkTimer: number | undefined;
    const onScroll = () => {
      const vh = window.innerHeight;
      const top = document.querySelector('.landing-about')?.getBoundingClientRect().top;
      if (top === undefined) return;
      const p = Math.min(1, Math.max(0, 1 - top / (vh * 0.7)));
      document.documentElement.style.setProperty('--ab-p', String(p));

      // the active link follows the stretch on screen: about until the
      // technologies section takes over past it (its top crosses the
      // viewport's vertical middle), then the now section — and back on
      // the way up
      const techTop = document.querySelector('.landing-tech')?.getBoundingClientRect().top;
      const nowTop = document.querySelector('.landing-now')?.getBoundingClientRect().top;
      let want = ABOUT;
      if (techTop !== undefined && techTop <= vh * 0.5) want = TECHNOLOGIES;
      if (nowTop !== undefined && nowTop <= vh * 0.5) want = NOW;
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
      // 0.25s delay + 0.18s stagger + 0.6s flight) — from here on a
      // switch only wipes colors
      if (nextArrived) {
        window.clearTimeout(parkTimer);
        parkTimer = window.setTimeout(() => {
          if (isArrivedNow.current) markFanned([0, 1, 2, 3]);
        }, 1100);
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
    <div class={`landing-panel ${arrived ? 'ab-arrived' : ''} ${leaving ? 'ab-leaving' : ''}`}>
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
        .ab-nav {
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
        .ab-nav a {
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
        .ab-nav a:hover, .ab-nav a:focus-visible { color: ${ECHO}; }
        .ab-nav a.active { background-position: 0 0; }

        /* the fan choreography — only the active link is visible when the
           panel enters; once it has arrived, the others fan out FROM the
           active link's words (each starts there — --fd is the flight
           distance in slot heights) with a slight overshoot past their
           own slot, then snap back into place. A link parks its .fanned
           memory once the flight settles, and rests visible — so a later
           active switch colors only (no re-fan, no disappear/reappear) */
        .ab-nav a:not(.active) { opacity: 0; }
        .ab-arrived .ab-nav a.fanned:not(.active) { opacity: 1; }
        @keyframes ab-fan {
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
        .ab-arrived .ab-nav a:not(.active):not(.fanned) {
          animation: ab-fan 0.6s cubic-bezier(0.3, 1.2, 0.5, 1) both;
          animation-delay: calc(0.25s + var(--afd, 0s));
        }
        /* the way out, once the sidebar is meaningfully leaving: the links
           fly BACK to the active link's spot — reverse of how they came,
           with the farthest link leaving first */
        .ab-leaving .ab-nav a:not(.active) {
          animation: ab-fan-out 0.4s cubic-bezier(0.5, 0, 0.75, 0.6) both;
          animation-delay: var(--afo, 0s);
        }
        @keyframes ab-fan-out {
          from { opacity: 1; transform: translateY(0) rotate(0deg); }
          to {
            opacity: 0;
            transform: translateY(calc(var(--fd, 0) * var(--ab-slot))) rotate(0deg);
          }
        }

        /* the active hand-over — both links sweep color in the SAME
           instant: the new active's ink lifts to paper as the front
           passes (gl-nav-wipe-in), the old one's paper drains to ink;
           the outgoing link swaps to the mirrored gradient so both
           fronts travel left-to-right together (one gradient only ever
           sends its fill from the left — the mirrored one keeps the
           same sweep direction on the way out). No re-fan, no
           disappear/reappear. */
        .ab-nav a.active.wipe { animation: gl-nav-wipe-in 0.4s ease-out both; }
        .ab-nav a.was {
          background-image: linear-gradient(to right, ${INK} 0% 50%, ${WHITE} 50% 100%);
          animation: gl-nav-wipe-out 0.4s ease-out both;
        }
        @keyframes gl-nav-wipe-in {
          from { background-position: 100% 0; }
          to { background-position: 0 0; }
        }
        @keyframes gl-nav-wipe-out {
          from { background-position: 100% 0; }
          to { background-position: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* the sweep jumps to its end pose; the static positions hold */
          .ab-nav a.active.wipe, .ab-nav a.was { animation-duration: 0s; }
        }

        /* the pool menu (the sticky footer band's) owns the corner while
           it's open — the big links disappear (and re-fan when the menu
           closes: re-applying the animation restarts it from the active
           link's spot) */
        .landing-panel:has(+ .lf-band glaphic-pool-menu[open]) .ab-nav a {
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
          .ab-nav { position: static; gap: 3vh; }
          .ab-nav a:not(.active) { opacity: 1; animation: none; } /* plainly listed */
          .ab-nav a { transform: none !important; }
        }
      `}</style>

      <nav class="ab-nav" aria-label="Section nav">
        {NAV.map((n, i) => {
          // flight distance from the active link, in nav slots
          // (the active index follows the scroll)
          const fd = active - i;
          const dist = Math.abs(fd);
          const cls = [
            i === active ? 'active' : '',
            wipe.gain === i ? 'wipe' : '',
            wipe.was === i ? 'was' : '',
            fanned.includes(i) ? 'fanned' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <a
              key={n.label}
              class={cls}
              style={{
                '--fd': fd,
                '--afd': `${dist * 0.09}s`,
                '--afo': `${(2 - dist) * 0.09}s`,
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