import { Router, Route, useLocation } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { useState, useEffect, Suspense } from 'preact/compat';
import { MenuDrawer } from './components/MenuDrawer';
import { ThemeToggle } from './components/ThemeToggle';
import { StickyHeader } from './components/StickyHeader';
import { LavaLampBackground } from './components/LavaLampBackground';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { About } from './pages/About';
import { Resume } from './pages/Resume';
import { DarkForest } from './pages/DarkForest';
import { Chat } from './pages/Chat';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { getPageTitle, isHomePage } from './data/pages';
import { Icon } from './components/Icon';

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [location] = useLocation();

  useEffect(() => {
    setCurrentPath(location);
    if (location.startsWith('/projects/') && location !== '/projects') {
      setIsDrawerOpen(false);
    }
  }, [location]);

  const handleMenuToggle = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  const isDarkForest = currentPath.startsWith('/games/dark-forest');
  const isHome = isHomePage(currentPath);
  const isChat = currentPath === '/chat';
  const isSplitLayout = isHome && !isChat;
  const pageTitle = getPageTitle(currentPath);

  return (
    <div class="flex min-h-screen relative">
      {/* Lava lamp background - shown on all pages except DarkForest */}
      {!isDarkForest && (
        <div class="fixed inset-0 z-0">
          <LavaLampBackground />
        </div>
      )}
      {!isDarkForest && <MenuDrawer isOpen={isDrawerOpen} onClose={() => handleMenuToggle(false)} onNavigate={() => handleMenuToggle(false)} />}

      {isSplitLayout && !isDarkForest ? (
        <>
          {/* Sticky header for home page */}
          <StickyHeader
            isDrawerOpen={isDrawerOpen}
            onMenuClick={() => handleMenuToggle(true)}
            showTitle={true}
            showThemeToggle={true}
            isHomePage={true}
          />
          <div class={`flex w-full min-h-screen overflow-hidden split-layout-mobile ${isDrawerOpen ? 'menu-open-animate' : ''}`}>
          {/* Left 25% panel - overlays and social icons */}
          <div class="w-1/4 min-h-screen relative z-10 hidden md:block" style={{ padding: '1.4rem' }}>
            <div class="lava-left-overlay absolute inset-0"></div>

            {/* Social icons - fixed at bottom on desktop */}
            <div class="fixed bottom-8 left-0 right-0 md:left-0 md:right-auto md:w-1/4 z-20 flex justify-center gap-4 pb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <a
                href="https://www.linkedin.com/in/efiner"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="LinkedIn"
              >
                <Icon name={'linkedin'} size={24} class="opacity-70" />
              </a>
              <a
                href="https://github.com/nothingfiner"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="GitHub"
              >
                <Icon name={'github'} size={24} class="opacity-70" />
              </a>
              <a
                href="mailto:e.a.finer@gmail.com"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="Email"
              >
                <Icon name={'email'} size={24} class="opacity-70" />
              </a>
            </div>
          </div>

          {/* Right 75% panel */}
          <div class="w-3/4 relative z-40">
            <div class="lava-right-overlay absolute inset-0 transition-opacity duration-700 hidden md-block"></div>
            <div class="absolute inset-0 glass md:hidden -z-10"></div>
            <main id="main-content" class="relative z-20 flex flex-col justify-center min-h-screen p-8 md:p-16">
              <div class="w-full max-w-2xl animate-fade-in-up md:m-auto" style={{ animationDelay: '0.3s' }}>
                <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-theme">Loading...</div>}>
                  <Route path="/" component={Home} />
                </Suspense>
              </div>
            </main>
          </div>
        </div>
        </>
      ) : (
        <>
          {/* Sticky header for non-home pages */}
          {!isDarkForest && (
            <StickyHeader
              isDrawerOpen={isDrawerOpen}
              onMenuClick={() => handleMenuToggle(true)}
              pageTitle={pageTitle}
              isHomePage={false}
            />
          )}
          <main id="main-content" class={`relative z-10 flex-1 transition-all duration-300 ${!isDarkForest && isDrawerOpen ? 'md:ml-80 ml-0' : 'ml-0'}`}>
            <div class={!isDarkForest ? 'pt-24' : ''}>
              <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-theme">Loading...</div>}>
                <Route path="/" component={Home} />
                <Route path="/projects" component={Projects} />
                <Route path="/projects/:id" component={ProjectDetail} />
                <Route path="/chat" component={Chat} />
                <Route path="/blog" component={Blog} />
                <Route path="/blog/:id" component={BlogPost} />
                <Route path="/games/dark-forest" component={DarkForest} />
                <Route path="/about" component={About} />
                <Route path="/resume" component={Resume} />
              </Suspense>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <Router hook={useHashLocation}>
      <AppContent />
    </Router>
  );
}
