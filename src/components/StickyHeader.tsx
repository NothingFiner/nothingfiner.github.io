import { useState, useEffect } from 'preact/hooks';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';

interface StickyHeaderProps {
  isDrawerOpen: boolean;
  onMenuClick: () => void;
  pageTitle?: string;
  showTitle?: boolean;
  showThemeToggle?: boolean;
  isHomePage?: boolean;
}

export function StickyHeader({ isDrawerOpen, onMenuClick, pageTitle, showTitle = true, showThemeToggle = true, isHomePage = false }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On home page, color stays the same (split-right). On other pages, use fg color.
  const textColor = isHomePage ? 'var(--color-split-right)' : 'var(--color-fg)';

  return (
    <header
      class={`fixed left-4 right-4 top-4 z-50 transition-all duration-300 rounded-xl ${
        scrolled ? 'glass py-2 px-4' : 'py-3 px-4'
      }`}
      style={scrolled ? {} : { background: 'transparent', boxShadow: 'none', border: 'none', outline: 'none' }}
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4  md:text-[var(--color-split-right)]">
          <button
            onClick={onMenuClick}
            class={`p-2.5 rounded-xl transition-all text-[var(--color-fg)] md:text-[${textColor}] flex-shrink-0 focus:outline-none flex items-center`}
            aria-label="Open menu"
          >
            <Icon name="menu" size={24} />
          </button>
          {showTitle && (
            <div class={`flex items-center text-[var(--color-fg)] md:text-[${textColor}] gap-2 overflow-hidden`} style={{ lineHeight: 1 }}>
              {/* Screen reader only - always available but never visible */}
              <span class="sr-only">Eliot Asenoth Gaspar-Finer</span>
              {/* Visual name that animates */}
              <div
                class="font-heading flex items-baseline"
                aria-hidden="true"
              >
                {/* Eliot - shrinks to show left 5px of E */}
                <span
                  class="transition-all duration-500 ease-in-out"
                  style={{ 
                    display: 'inline-block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: scrolled ? '6px' : 'auto',
                    opacity: 1,
                    fontWeight: scrolled ? '700' : '400'
                  }}
                >
                  Eliot
                </span>
                
                {/* Asenoth - shrinks to show right portion (includes A) */}
                <span
                  class="transition-all duration-500 ease-in-out"
                  style={{ 
                    display: 'inline-block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: scrolled ? '5.5px' : 'auto',
                    marginLeft: scrolled ? '0' : '4px',
                    opacity: 1,
                    fontWeight: scrolled ? '700' : '400',
                    transform: scrolled ? 'scaleX(-1)' : 'unset'

                  }}
                >
                  Asenoth
                </span>
                {/* Gaspar- - shrinks to show right portion (includes G) */}
                <span
                  class="transition-all duration-500 ease-in-out"
                  style={{ 
                    display: 'inline-block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: scrolled ? '7px' : 'auto',
                    marginLeft: scrolled ? '-4px' : '4px',
                    opacity: 1,
                    fontWeight: scrolled ? '700' : '400'
                  }}
                >
                  Gaspar-
                </span>
                {/* Finer - shrinks to show left 5px of F */}
                <span
                  class="transition-all duration-500 ease-in-out"
                  style={{ 
                    display: 'inline-block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: scrolled ? '6px' : 'auto',
                    opacity: 1,
                    fontWeight: scrolled ? '700' : '400'
                  }}
                >
                  Finer
                </span>
              </div>
              {pageTitle && (
                <>
                  <span class="text-theme/40">/</span>
                  <span class="text-theme/80 font-mono text-sm">{pageTitle}</span>
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
