// The landing route (home) — the journey page: the full-bleed hero fold,
// then the (still legacy styled) below-fold sections. The hero's menu is
// the framework pool menu (own trigger, hash links) — no header chrome
// over the hero. app.tsx gates only the chrome around this page (the
// lamp ground, the drawer); the composition lives here, the way every
// other route composes its own page component.
import { LandingHero } from '../components/LandingHero';
import { LandingAbout } from '../components/LandingAbout';
import { LandingTechnologies } from '../components/LandingTechnologies';
import { LandingNow } from '../components/LandingNow';
import { LandingPast } from '../components/LandingPast';
import { LandingPanel } from '../components/LandingPanel';
import { SiteFooter } from '../components/SiteFooter';

export function Landing() {
  return (
    <div class="w-full relative z-40 flex flex-col">
      {/* the sticky footer band rides LAST in the flow so its sticky
          range spans the whole journey: at load it sits over the
          hero's lower rows; it pins at the viewport bottom while the
          glyph band and the story section travel; at page-2 rest it
          lands on LandingAbout's bottom band (in one copy — the band,
          the pool menu and the brand mark are never duplicated) */}
      <LandingHero />
      {/* the mock's "I've been Coding." story section — carries the
          #about anchor the hero's LEARN MORE scrolls to */}
      <LandingAbout />
      {/* the mock's "Tools I've used." section — the chip cloud (same
          layout grammar as the story section above; #technologies,
          which the sidebar's nav jumps to) */}
      <LandingTechnologies />
      {/* the mock's "What I'm up to." section — the card carousel
          (#now, which the sidebar's nav jumps to) */}
      <LandingNow />
      {/* the crimson sidebar: fixed, full viewport height, everything
          past the first fold — slides in on the --ab-p journey clock
          (it sets it) and stays parked for the landing flow below */}
      <LandingPanel />
      <LandingPast />
      {/* the sticky journey band — the LANDING's pose (variant
          'journey'): at load it sits over the hero's lower rows
          (the hero legal + the icons visible from load, riding --lf-fold-in
          with the logos), pins at the viewport bottom while the
          sections travel (the icons STAY pinned on the landing; the
          brand mark fades in on the descent), and at page-end rest it
          lands in flow as the page's own bottom footer (the legal +
          brand + icons) — the pool menu stays pinned throughout (in
          one copy — the band, the pool menu and the brand mark are
          never duplicated) */}
      <SiteFooter variant="journey" learnMore menuDelay={150} />
    </div>
  );
}