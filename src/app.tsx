import { Router, Route, useLocation } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { useState, useEffect } from 'preact/hooks';
// Suspense comes from preact/compat only — preact's root module doesn't
// re-export it (10.28's index.d.ts); hooks do come from preact/hooks
import { Suspense } from 'preact/compat';
import { StickyHeader } from './components/StickyHeader';
import { LavaLampBackground } from './components/LavaLampBackground';
import { SiteFooter } from './components/SiteFooter';
import { Landing } from './pages/Landing';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { PastWork } from './pages/PastWork';
import { PastDetail } from './pages/PastDetail';
import { About } from './pages/About';
import { Resume } from './pages/Resume';
import { DarkForest } from './pages/DarkForest';
import { GlaphicGallery } from './pages/GlaphicGallery';
import { Chat } from './pages/Chat';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { getPageTitle, isHomePage } from './data/pages';
import { PageWipe } from './components/PageWipe';

function AppContent() {
  // the path STATE initializes from the router's own first snapshot —
  // an empty '' read as the HOME page for the first frame, which
  // mounted the landing (its "Hi, I'm Elie." typing starting) on every
  // fresh load of a deep route before the effect synced the real hash:
  // the one-frame landing flash on /#/chat
  const [location] = useLocation();
  const [currentPath, setCurrentPath] = useState(location);

  useEffect(() => {
    setCurrentPath(location);
  }, [location]);

  const isDarkForest = currentPath.startsWith('/games/dark-forest');
  const isHome = isHomePage(currentPath);
  const isChat = currentPath === '/chat';
  // /projects and /projects/:id join the chat's treatment: the new-design
  // stage is bare over the lamp + hatch (its corner blocks / title + the
  // landing footer band carry the page) — the legacy sticky header is
  // gone from every projects route (Eliot: no old menu bar on detail).
  const isProjects = currentPath === '/projects' || currentPath.startsWith('/projects/');
  // the past family: the bands page (/past) + the agency detail
  // plates (/past/:tag) — the new-design bare stage's fourth member
  const isPast = currentPath === '/past' || currentPath.startsWith('/past/');
  const isBlog = currentPath === '/blog' || currentPath.startsWith('/blog/');
  const isResume = currentPath === '/resume';
  /* the new-design bare stage: no legacy sticky header over the shared
     band (Eliot: the old header/menu bar is gone from projects, the
     past family, blog and resume — the band's pool menu is the chrome) */
  const isBareStage = isChat || isProjects || isPast || isBlog || isResume;
  const isSplitLayout = isHome && !isChat;
  const pageTitle = getPageTitle(currentPath);

  // the background's two layers are split: the LINE-GROUND hatch paints
  // site-wide (it is LavaLampBackground's own fixed layer), but the lava
  // BLOBS are opt-in per route — on (projects + project detail + chat +
  // the past family, whose stages read as clear paper over the lamp)
  // and OFF on the landing (lines only) and every legacy page. DarkForest
  // mounts neither layer.
  const lampOn = !isDarkForest && (isProjects || isChat || isPast);

  return (
    <div class="flex min-h-screen relative">
      {/* the site's one accessible page heading — visually hidden, mounted
          ONCE at the app level (outside the routes swap: it stays put on
          every route) so document order + screen readers always find it.
          No other h1 is declared on any route (the pages' headlines are
          h2s — the hero's, the GrowHead sections', every page's). */}
      <h1 class="site-footer__sr">Elie Gaspar-Finer - Frontend Focused Engineer - 12+ years of experience</h1>
      {/* background: the line-hatch ground site-wide; the lava blobs per
          route (see lampOn above) */}
      {!isDarkForest && (
        <div class="fixed inset-0 z-0">
          <LavaLampBackground lamp={lampOn} />
        </div>
      )}
      {/* the band's pool menu is the chrome on every page — the legacy
          drawer and its opener left with the old-site chrome (the
          MenuDrawer removal; its own research appendix archived the file) */}

      {isSplitLayout && !isDarkForest ? (
        // the home route's chrome gate: the landing page (src/pages/Landing.tsx)
        // owns its whole composition — hero → about → technologies → now +
        // the panel + the journey band. No sticky header, no main wrapper,
        // no default footer here: the landing brings its own.
        <Landing />
      ) : (
        <>
          {/* Sticky header for non-home pages — the chat page runs the
              new-design composition (bare paper ground, chrome in the
              corners), so no header rides over it */}
          {!isDarkForest && !isBareStage && (
            <StickyHeader
              pageTitle={pageTitle}
            />
          )}
          <main id="main-content" class="relative z-10 flex-1 ml-0">
            <div class={!isDarkForest && !isBareStage ? 'pt-24' : ''}>
              <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-theme">Loading...</div>}>
                <Route path="/projects" component={Projects} />
                <Route path="/projects/:id" component={ProjectDetail} />
                <Route path="/past" component={PastWork} />
                <Route path="/past/:id" component={PastDetail} />
                <Route path="/chat" component={Chat} />
                <Route path="/blog" component={Blog} />
                <Route path="/blog/:id" component={BlogPost} />
                <Route path="/games/dark-forest" component={DarkForest} />
                <Route path="/about" component={About} />
                <Route path="/resume" component={Resume} />
                <Route path="/components" component={GlaphicGallery} />
              </Suspense>
            </div>
            {/* the shared lower band (variant 'footer' — the default): the
                page's own in-flow footer at page-end — brand mark + `////`
                legal left, the contact icon row right. The POOL MENU keeps
                its fixed bottom-right pin (it is the navigation; the foot's
                floor padding clears its zone). The landing mounts its own
                journey copy above (pinned icons + the fold's hero legal).
                The chat page's old bespoke chrome rides this band too, with
                the menu patch arriving from load (its chrome enters with
                the page; the 1550ms fold timer is the landing's
                choreography). The footer is last in the flow — the page's
                own bottom. */}
            {!isDarkForest && <SiteFooter menuDelay={isChat ? 0 : 1550} />}
          </main>
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <AppContent />
      </Router>
      {/* the page-change animation: ONE <glaphic-wipe> overlay at the
          app root, outside the router's swap (see the module's header
          docs — it renders no children; the router drives it) */}
      <PageWipe />
    </>
  );
}
