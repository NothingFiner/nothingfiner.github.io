import { useState, useEffect } from 'preact/hooks';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';

interface StickyHeaderProps {
  isDrawerOpen: boolean;
  onMenuClick: () => void;
  pageTitle?: string;
  showTitle?: boolean;
  showThemeToggle?: boolean;
}

export function StickyHeader({ onMenuClick, pageTitle, showTitle = true, showThemeToggle = true }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      class={`stky fixed left-4 right-4 top-4 z-50 transition-all duration-300 rounded-xl ${
        scrolled ? 'panel stky-shrunk py-2 px-4' : 'py-3 px-4 stky-idle'
      }`}
    >
      <style>{`
        /* the header's own classes: the idle state paints nothing (transparent
           ground, no shadow); the nameplate's shrink is driven by the same
           scrolled state class so the values live here, not in JSX */
        .stky-idle { background: transparent; box-shadow: none; border: none; outline: none; }
        .stky-titleline { line-height: 1; }
        .stky .stky-name { display: inline-block; overflow: hidden; white-space: nowrap; font-weight: 400; }
        .stky .stky-asenoth { margin-left: 4px; }
        .stky .stky-gaspar { margin-left: 4px; }
        .stky-shrunk .stky-name { font-weight: 700; }
        .stky-shrunk .stky-elie { width: 6px; }
        .stky-shrunk .stky-asenoth { width: 5.5px; margin-left: 0; transform: scaleX(-1); }
        .stky-shrunk .stky-gaspar { width: 7px; margin-left: -4px; }
        .stky-shrunk .stky-finer { width: 6px; }
      `}</style>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            class={`p-2.5 rounded-xl transition-all text-theme flex-shrink-0 focus:outline-none flex items-center`}
            aria-label="Open menu"
          >
            <Icon name="menu" size={24} />
          </button>
          {showTitle && (
            <div class="stky-titleline flex items-center text-theme gap-2 overflow-hidden">
              <span class="sr-only">Elie Asenoth Gaspar-Finer</span>
              <div
                class="font-heading flex items-baseline"
                aria-hidden="true"
              >
                <span
                  class="stky-name stky-elie transition-all duration-500 ease-in-out"
                >
                  Elie
                </span>
                
                {/* Asenoth - shrinks to show right portion (includes A) */}
                <span
                  class="stky-name stky-asenoth transition-all duration-500 ease-in-out"
                >
                  Asenoth
                </span>
                {/* Gaspar- - shrinks to show right portion (includes G) */}
                <span
                  class="stky-name stky-gaspar transition-all duration-500 ease-in-out"
                >
                  Gaspar-
                </span>
                {/* Finer - shrinks to show left 5px of F */}
                <span
                  class="stky-name stky-finer transition-all duration-500 ease-in-out"
                >
                  Finer
                </span>
              </div>
              {pageTitle && (
                <>
                  <span class="text-grey">/</span>
                  <span class="text-theme font-mono text-sm">{pageTitle}</span>
                </>
              )}
            </div>
          )}
        </div>
        <div class="flex items-center gap-2">
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
