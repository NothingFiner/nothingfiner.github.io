import { Link } from 'wouter-preact';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export function MenuDrawer({ isOpen, onClose, onNavigate }: MenuDrawerProps) {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/chat', label: 'Chat' },
    { path: '/blog', label: 'Blog' },
    { path: '/games/dark-forest', label: 'Game - Dark Forest' },
    { path: '/resume', label: 'Resume' },
    { path: '/about', label: 'About Me' },
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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav class="flex-1">
          <ul class="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
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
