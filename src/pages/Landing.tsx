// The landing route (home) — the journey page: the full-bleed hero fold,
// then the below-fold sections. The journey's order is the Phase-4
// reorder: Hero → About → What I'm up to → Past Work → Panel →
// Technologies → Band; the mobile flex column re-derives its own order
// separately (each section's ≤899px block carries its map value: hero
// -1, band 0, about 1, now 2, past 3, tech 4). app.tsx gates only the
// chrome around this page (the lamp ground, the drawer); the
// composition lives here, the way every other route composes its own
// page component.
import { LandingHero } from '../components/LandingHero';
import { LandingAbout } from '../components/LandingAbout';
import { LandingNow } from '../components/LandingNow';
import { LandingPast } from '../components/LandingPast';
import { LandingTechnologies } from '../components/LandingTechnologies';
import { LandingPanel } from '../components/LandingPanel';
import { SiteFooter } from '../components/SiteFooter';

export function Landing() {
  return (
    <div class="w-full relative z-40 flex flex-col">
      {/* the sticky footer band rides LAST so its sticky range spans the
          whole journey (the Phase-4 order keeps it the flow's final
          item — the tech section now the .site-footer__band's nearer neighbor on
          top, but the general sibling's reach is DOM-order not
          adjacency): at load it sits over the hero's lower rows; it
          pins at the viewport bottom while the glyph band and the story
          section travel; at page-2 rest it lands on LandingAbout's
          bottom band (in one copy — the band, the pool menu and the
          brand mark are never duplicated) */}
      <LandingHero />
      {/* the story section (I've been Coding.) — carries the #about
          anchor the hero's LEARN MORE scrolls to */}
      <LandingAbout />
      {/* the What I'm up to. section — the three project bands between
          the ticker borders (#now, a sidebar target) */}
      <LandingNow />
      {/* the Past Work. section — the three-column tray track between
          the ticker rails (#past, the sidebar's fourth target) */}
      <LandingPast />
      {/* the crimson sidebar: fixed, full viewport height, everything
          past the first fold — slides in on the --ab-p journey clock
          (it sets it) and stays parked for the landing flow below; the
          want-logic follows the journey's order (about → now → past →
          tech) */}
      <LandingPanel />
      {/* the tools section (Tools I've used.) — the chip cloud (#technologies,
          the sidebar's last target; now the panel's flow neighbor
          before the band) */}
      <LandingTechnologies />
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