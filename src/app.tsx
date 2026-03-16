import { Router, Route, useLocation } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { useState, useEffect, Suspense } from 'preact/compat';
import { MenuDrawer } from './components/MenuDrawer';
import { ThemeToggle } from './components/ThemeToggle';
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
import { getPageTitle, getHeaderTitle, isHomePage, PageTitle } from './data/pages';

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
  const currentPageTitle = getPageTitle(currentPath);
  const headerTitle = getHeaderTitle(currentPath);

  return (
    <div class="flex min-h-screen relative">
      {/* Lava lamp background - shown on all pages except DarkForest */}
      {!isDarkForest && (
        <div class="fixed inset-0 z-0">
          <LavaLampBackground />
        </div>
      )}
      {!isDarkForest && <MenuDrawer isOpen={isDrawerOpen} onClose={() => handleMenuToggle(false)} onNavigate={() => handleMenuToggle(false)} />}
      {!isDarkForest && (
        <div class="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {isSplitLayout && !isDarkForest ? (
        <div class={`flex w-full h-screen split-layout-mobile ${isDrawerOpen ? 'menu-open-animate' : ''}`}>
          {/* Left 25% panel */}
          <div class="w-1/4 h-full relative z-10 flex flex-col justify-end" style={{ padding: '1.4rem' }}>
            <div class="lava-left-overlay absolute inset-0"></div>

            {/* Top section - menu button and title aligned */}
            <div class="relative z-20 flex items-center gap-4 mb-auto">
              {!isDrawerOpen && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  class="p-3 glass glass-hover rounded-xl transition-all menu-open-btn"
                  aria-label="Open menu"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

                <h2 class="text-lg font-heading font-bold left-panel-text leading-tight">
                  Eliot Asenoth Gaspar-Finer
                </h2>


            </div>
            <div class="relative z-20 flex justify-center gap-4 pb-8 animate-fade-in-up mobile-icons-bottom" style={{ animationDelay: '0.2s' }}>
              <a
                href="https://www.linkedin.com/in/efiner"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="LinkedIn"
              >
                <svg class="w-6 h-6 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/nothingfiner"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="GitHub"
              >
                <svg class="w-6 h-6 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="mailto:e.a.finer@gmail.com"
                class="p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon"
                aria-label="Email"
              >
                <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Portrait centered at divide */}
          <div class="portrait-wrapper absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-scale">
            <div class="portrait-container">
              <img src="./assets/porfolio_portrait.jpeg" alt="Elie" class="portrait-image" />
            </div>
          </div>

          {/* Right 75% panel */}
          <div class="w-3/4 h-full relative z-40">
            <div class="lava-right-overlay absolute inset-0 transition-opacity duration-700"></div>
            <main id="main-content" class="relative z-20 h-full flex items-center justify-center p-8 md:p-16">
              <div class="w-full max-w-2xl text-left animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-theme">Loading...</div>}>
                  <Route path="/" component={Home} />
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <>
          <main id="main-content" class={`relative z-10 flex-1 transition-all duration-300 ${!isDarkForest && isDrawerOpen ? 'md:ml-80 ml-0' : 'ml-0'}`}>
            {/* Header with name and page title - hidden on Dark Forest page */}
            {!isDarkForest && (
              <header class="fixed left-0 top-0 right-0 z-20 flex items-center gap-4 p-4 md:p-4 ml-4">
                {!isDrawerOpen && (
                  <button
                    onClick={() => handleMenuToggle(true)}
                    class="p-3 glass glass-hover rounded-xl transition-all header-menu-btn flex-shrink-0"
                    aria-label="Open menu"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="text-lg font-heading font-bold left-panel-text leading-tight header-page-text">{headerTitle}</h1>
                </div>
              </header>
            )}
            <div class={!isDarkForest ? 'pt-20' : ''}>
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
