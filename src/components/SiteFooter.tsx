// The shared lower band — the site's footer strip + the pinned pool
// menu, mounted once per route (app.tsx wires the landing's journey
// pose with the variant prop; every other route takes the footer pose).
// Eliot's redraw of the sticky-bar rules:
//
//   footer (the default)  the band is the page's own footer at
//                         page-end, IN FLOW — no pin, no ride — tightened
//                         to the floor (~2vh): the brand mark + the
//                         `////` legal left, the contact icon row right
//                         (it lands just under the pinned patch, so the
//                         corner stacks patch-over-icons, landing's
//                         scroll-bottom read).
//   journey (the landing) the sticky band carries ONLY the pool-menu
//                         patch and the pinned icons (they follow the
//                         reader — the landing's exception — riding the
//                         crimson hand-off) plus the LEARN MORE invite;
//                         the LEGAL and the BRAND LOGO ride nothing
//                         mid-scroll. The legal reads in exactly TWO
//                         positions: the HERO's own from-load instance
//                         (LandingHero composes FooterLegal for it) and
//                         the band's in-flow foot at the very bottom,
//                         where the brand mark FADES IN AT THE BOTTOM
//                         POSE (an IntersectionObserver beat — no
//                         journey-ride).
//   mobile                the menu button stays pinned everywhere (it
//                         is the navigation); on tablet/mobile the
//                         icons move into the foot (the fixed cluster
//                         keeps only the patch). The LEARN MORE invite
//                         FADES IN on mobile (no pointer means the
//                         low-mouse choreography can never play there)
//                         on the band's own fold clock, tap-to-scroll.
//   chat                  menuDelay 0 — its chrome enters with the page.
//
// The band's REUSABLE PIECES are exported so every page composes the
// same source of markup (the landing's fold composes the legal-only
// instance with the exact classes it always had):
//
//   <FooterLegal fade class="…">   the `////` legal (year + the ramp
//                                  tape + the name) — `fade` adds the
//                                  fold-arrival .site-footer__legal--fade (the hero's
//                                  from-load beat)
//   <FooterBrand>{legal}</FooterBrand>  the mirrored eee mark over a
//                                  legal (the foot's left column)
//   <FooterSocial fade class="…">  the three contact links — `fade`
//                                  marks the journey's fold arrival
//
// Styles are the band's class section in src/landing.css — not JSX
// style attributes (reusable classes over inline styles). The callers
// own positioning classes only.
//
// The band itself never captures clicks (it's transparent everywhere
// except its content); the pool menu's open state is how the CSS knows
// to hand the corner over (the sidebar's big nav fades out — landing).
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon } from './Icon';

// ── the factored pieces (one source of markup for every page) ──────

/** the `////` legal line — year + the ramp tape, the divider on the wide
    read; `fade` adds the arrival class (the fold clock, 0s off the band
    = from load — the hero's from-load instance) */
export function FooterLegal({ class: cls = '', fade = false }: { class?: string; fade?: boolean }) {
  const year = new Date().getFullYear();
  return (
    <div class={`site-footer__legal ${fade ? 'site-footer__legal--fade' : ''} ${cls}`}>
      <span class="site-footer__legal-year">
        ©{year}
        <glaphic-tape pattern="ramp" class="site-footer__legal-tape" />
      </span>
      <span class="site-footer__legal-divider">
        &nbsp;////&nbsp;
      </span>
      <span>
        Eliot Asenoth Gaspar-Finer
      </span>
    </div>
  );
}

/** the mirrored eee mark as the foot's left column; pass the legal (or
    anything else) through as its child — the column's 1.6vh gap is the
    .site-footer__foot-brand's own */
export function FooterBrand({ class: cls = '', children = null }: { class?: string; children?: ComponentChildren }) {
  return (
    <div class={`site-footer__foot-brand ${cls}`}>
      <div class="site-footer__glyph" />
      {children}
    </div>
  );
}

/** the three contact links (github / linkedin / email) — the journey
    pins it with the fold fade; the footer pose sets it in the foot */
export function FooterSocial({ class: cls = '', fade = false }: { class?: string; fade?: boolean }) {
  return (
    <div class={`site-footer__social ${fade ? 'site-footer__social--fade' : ''} ${cls}`}>
      <a href="https://github.com/nothingfiner" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Icon name={'github'} size={22} />
      </a>
      <a href="https://www.linkedin.com/in/efiner" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <Icon name={'linkedin'} size={22} />
      </a>
      <a href="mailto:e.a.finer@gmail.com" aria-label="Email">
        <Icon name={'email'} size={22} />
      </a>
    </div>
  );
}

export interface SiteFooterProps {
  /** the pose: 'journey' (the landing's sticky ride — pinned patch +
     icons + LEARN MORE, a foot at the page's end whose brand fades in
     at the bottom pose) or 'footer' (default — the in-flow page-bottom
     footer; only the pool menu stays pinned) */
  variant?: 'journey' | 'footer';
  /** the LEARN MORE hero-fold invite — landing only */
  learnMore?: boolean;
  /** the menu patch's arrival timer (ms). Other routes keep the old
     1550ms beat; the landing passes 150 — the same clock the icons'
     fade uses (--lf-fold-in, 0.15s in landing.css) so the icons and the
     patch read as one piece WITH the hero logos' entrance (Eliot: not
     after "I'm Elie"). 0 = all in from load (chat). */
  menuDelay?: number;
}

export function SiteFooter({ variant = 'footer', learnMore = false, menuDelay = 1550 }: SiteFooterProps) {
  const journey = variant === 'journey';
  const [showMenu, setShowMenu] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  // the journey foot's bottom pose: the foot lives INSIDE the sticky
  // band (its box reserves the closing strip), so it stays with the
  // pin — which is why it is only REVEALED at the bottom pose: a
  // zero-height sentinel in the flow AFTER the band (the flow slot
  // beyond it adds no height) enters the viewport exactly when the
  // rest pose is reached — nothing legal/branded pins visibly
  // mid-scroll
  const [footIn, setFootIn] = useState(false);
  const sentinelRef = useRef<HTMLElement | null>(null);

  // the menu button arrives WITH the icons (one shared beat: app.tsx
  // passes the landing's --lf-fold-in beat — 150ms — so the patch and
  // the icons ride in as one piece with the logos; the fold's
  // choreography used to hold them back — Eliot: far too long)
  useEffect(() => {
    if (menuDelay <= 0) {
      setShowMenu(true);
      return;
    }
    const t3 = setTimeout(() => setShowMenu(true), menuDelay);
    return () => clearTimeout(t3);
  }, []);

  // the foot's arrival (the landing's rest pose): the sentinel sits at
  // the flow's true end; the 60px rootMargin lets it fire a breath
  // early, as the reader settles onto the bottom. TWO-WAY: no latch —
  // the foot fades back OUT as the reader scrolls up again (Eliot: the
  // legal/brand must not persist stuck on the way back up)
  useEffect(() => {
    if (!journey) return;
    const io = new IntersectionObserver(
      (entries) => {
        setFootIn(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: '0px 0px 60px 0px' },
    );
    const sentinel = sentinelRef.current;
    if (sentinel) io.observe(sentinel);
    return () => io.disconnect();
  }, [journey]);

  // LEARN MORE slides up from the bottom when the mouse gets close to the
  // bottom edge — ABOVE THE FOLD ONLY: the page being yet at the hero is
  // part of the invite, and any scroll past the hero tucks the button
  // away (a fresh low-mouse move re-earns it). NOT when the pointer is
  // over the pool-menu patch (its trigger AND its open panel) or the
  // contact links: only other low screen areas earn the slide — and the
  // exclusion holds steady (no re-earn flash when the pointer brushes an
  // adjacent corner). While a pool menu is open anywhere, the invite
  // stays TUCKED AWAY (the menu's own `change` event tucks it on open;
  // an open panel can portal its plate anywhere in the tree, so a
  // pointer test alone couldn't keep it covered) — closing hands the
  // low zone back and a fresh low move re-earns the invite.
  useEffect(() => {
    if (!learnMore) return;
    const atHero = () => window.scrollY < window.innerHeight * 0.5;
    const menuOpen = () => !!document.querySelector('glaphic-pool-menu[open]');
    const EXCLUDE = '.site-footer__cluster, .site-footer__menu, .site-footer__social, glaphic-pool-menu';
    const onMove = (e: MouseEvent) => {
      if (menuOpen()) return;
      if ((e.target as Element | null)?.closest?.(EXCLUDE)) return;
      setNearBottom(atHero() && e.clientY > window.innerHeight - 150);
    };
    const onScroll = () => {
      if (menuOpen()) return;
      if (!atHero()) setNearBottom(false);
    };
    // the patch's bubbling `change` ({open}, fired on every open/close
    // move) — tuck on open
    const onChange = (e: Event) => {
      if ((e.target as Element)?.tagName !== 'GLAPHIC-POOL-MENU') return;
      if ((e as CustomEvent).detail?.open) setNearBottom(false);
    };
    document.addEventListener('change', onChange);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('change', onChange);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [learnMore]);

  // the menu patch — mounted at the menu beat; its arrival plays the
  // one-shot site-footer-menu-in (the forwards fill kept the wrapper composited,
  // which trapped the pool plates' multiply blend — backwards only)
  const patch = showMenu && (
    <div class="site-footer__menu-arrive site-footer__menu-arrive--shown">
      <glaphic-pool-menu anchor="bottom-right" label="Menu">
        <a href="#/">Home</a>
        <a href="#/projects">Projects</a>
        <a href="#/chat">Chat with Bot</a>
        <a href="#/blog">Blog</a>
        <a href="#/resume">Resume</a>
        <a href="#/games/dark-forest">Dark Forest</a>
      </glaphic-pool-menu>
    </div>
  );

  return (
    <>
      <div
        class={`site-footer__band ${journey ? 'site-footer__band--journey' : 'site-footer__band--footer'} ${menuDelay === 0 ? 'site-footer__band--now' : ''} ${footIn ? 'site-footer__band--foot-in' : ''}`}
      >
        {journey ? (
            <div class="site-footer__cluster">
              {patch}
              <FooterSocial fade />
            </div>
          ) : (
             <div class="site-footer__menu">{patch}</div>
          )}
            <div class="site-footer__foot">
              <FooterBrand>
                <FooterLegal />
              </FooterBrand>
              <FooterSocial />
            </div>

        {/* LEARN MORE — rides the sticky band across both pages (landing) */}
        {learnMore && (
          <div class="site-footer__learn-wrap">
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              class={`site-footer__learn-more ${nearBottom ? 'site-footer__learn-more--near' : ''}`}
            >
              LEARN MORE
            </button>
          </div>
        )}
      </div>

      {/* the rest sentinel: zero height, the flow's true end — its
          entering the viewport IS the landing's bottom pose */}
      {journey && <i class="site-footer__rest-sentinel" ref={sentinelRef} aria-hidden="true" />}
    </>
  );
}