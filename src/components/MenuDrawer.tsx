import { Link } from 'wouter-preact';
import { Icon } from './Icon';

interface MenuItem {
  path: string;
  label: string;
  hideMobile?: boolean;
}

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export function MenuDrawer({ isOpen, onClose, onNavigate }: MenuDrawerProps) {
  const menuItems: MenuItem[] = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/chat', label: 'Chat with Bot' },
    { path: '/blog', label: 'Blog' },
    { path: '/resume', label: 'Resume' },
    { path: '/games/dark-forest', label: 'Game - Dark Forest', hideMobile: true },
  ];

  const handleNavClick = () => {
    onNavigate();
  };

  return (
    // the parked pose clears the look-layer's own shadow ladder (+8px): it
    // paints to the RIGHT of the translated box, so at -100% the closed
    // drawer's ladder still peeked 0–6px past the viewport's left edge on
    // every route it mounts (readable since the frosted glass went solid)
    <div
      class={`fixed left-0 top-0 h-full md:w-1/4 w-full site-panel transition-transform duration-300 z-[60] ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(-100%-8px)]'
      }`}
    >
      <div class="p-4 md:p-8 h-full flex flex-col">
        <button
          onClick={onClose}
          class="self-end mb-8 p-2 rounded-xl site-panel site-panel--hover transition-colors menu-drawer__close-btn"
          aria-label="Close menu"
        >
          <Icon name="close" size={24} />
        </button>

        <nav class="flex-1">
          <ul class="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path} class={item.hideMobile ? 'hidden md:block' : ''}>
                <Link
                  href={item.path}
                  onClick={handleNavClick}
                  class="block px-4 py-3 rounded-xl site-panel site-panel--hover transition-all duration-200 text-theme font-heading font-bold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
