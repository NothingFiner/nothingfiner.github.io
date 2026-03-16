export enum PageTitle {
  HOME = '',
  PROJECTS = 'Projects',
  PROJECT_DETAIL = 'Project Detail',
  CHAT = 'Chat',
  ABOUT = 'About Me',
  RESUME = 'Resume',
  BLOG = 'Blog',
  BLOG_POST = 'Blog Post',
}

export const PAGE_PATHS: Record<string, PageTitle> = {
  '/': PageTitle.HOME,
  '/projects': PageTitle.PROJECTS,
  '/chat': PageTitle.CHAT,
  '/about': PageTitle.ABOUT,
  '/resume': PageTitle.RESUME,
  '/blog': PageTitle.BLOG,
};

export function getPageTitle(path: string): PageTitle {
  if (path.startsWith('/projects/')) return PageTitle.PROJECT_DETAIL;
  if (path.startsWith('/blog/')) return PageTitle.BLOG_POST;
  return PAGE_PATHS[path] ?? PageTitle.HOME;
}

export function isHomePage(path: string): boolean {
  return path === '/' || path === '';
}

export function getHeaderTitle(path: string): string {
  const title = getPageTitle(path);
  if (title === PageTitle.HOME) return 'Eliot Gaspar-Finer';
  return `Eliot Gaspar-Finer - ${title}`;
}
