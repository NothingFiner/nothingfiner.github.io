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

  const handleNavClick = (path: string) => {
    onNavigate();
  };

  return (
    <div
      class={`fixed left-0 top-0 h-full md:w-1/4 w-full glass transition-transform duration-300 z-[60] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div class="p-4 md:p-8 h-full flex flex-col">
        <button
          onClick={onClose}
          class="self-end mb-8 p-2 rounded-xl glass glass-hover transition-colors menu-drawer-close-btn"
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
                  class="block px-4 py-3 rounded-xl glass glass-hover transition-all duration-200 text-theme font-heading font-bold"
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
