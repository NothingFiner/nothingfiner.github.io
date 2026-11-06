// The technologies the site shows off — the same set the legacy (live)
// version lists in its Technologies section; the new landing's chip
// cloud and the legacy section both read from here.
export const technologies = [
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Vue.js', icon: 'vue' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Ruby', icon: 'ruby' },
  { name: 'Ruby on Rails', icon: 'rubyonrails' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Redux', icon: 'redux' },
  { name: 'TanStack Query', icon: 'tanstack' },
  { name: 'Material UI', icon: 'mui' },
  { name: 'Git', icon: 'git' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Python', icon: 'python' },
];

// The new landing chip cloud's fuller kit: the legacy set plus the app
// shells, frameworks, design tools and models the rest of the work
// touches. The legacy section keeps the original list; fold any entry
// up into `technologies` if it should join the live site too.
export const landingTechnologies = [
  ...technologies.slice(0, 9), // through Tailwind CSS
  { name: 'Sass', icon: 'sass' },
  ...technologies.slice(9),
  { name: 'Tauri', icon: 'tauri' },
  { name: 'Lit', icon: 'lit' },
  { name: 'Ollama', icon: 'ollama' },
  { name: 'Storybook', icon: 'storybook' },
  { name: 'Figma', icon: 'figma' },
  { name: 'QWen', icon: 'qwen' },
  { name: 'Z.ai', icon: 'zai' },
  { name: 'DeepSeek', icon: 'deepseek' },
  { name: 'Claude Code', icon: 'claudecode' },
  // the agent in the seat: the goose rides with the tooling cluster
  { name: 'Goose', icon: 'goose' },
  { name: 'Preact', icon: 'preact' },
  { name: 'GraphQL', icon: 'graphql' },
];