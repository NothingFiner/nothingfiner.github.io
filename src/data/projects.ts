// Shared project data
export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  gallery?: string[];
  githubUrl?: string;
  status?: string;
  tags?: string[];
  /** the card's copy provenance: 'live' (sourced from the repo) or 'draft'
      (written for the card and awaiting Eliot — card surfaces print a
      DRAFT tag so it can't pass as real; per-page-provenance mirrors
      projectDetails.ts, which carries the detail page's own flag) */
  copy: 'live' | 'draft';
}

// the card order is the file order (Projects renders PRJ.{index+1} off
// the array position): Rite, glaphicUI, chatbot, gospodin, dark forest,
// Novel
export const projects: Project[] = [
  {
    id: '1',
    title: 'Rite',
    image: './assets/rite/rite-hero.png',
    description: "Rite is an IWE—an integrated writing environment. It's a lightweight, distraction-free word processor I'm building as a native desktop app with Tauri. It's still in active development — what's shown here is a work in progress. The goal is a fast, focused writing tool that gets out of your way, complete with built-in support for a custom BYOK writing assistant, history diffing, and guess-free manuscript formatting.",
    gallery: [
      './assets/rite/rite-1.png',
      './assets/rite/rite-2.png',
      './assets/rite/rite-3.png',
    ],
    githubUrl: 'https://github.com/NothingFiner/rite',
    status: 'In development',
    tags: ['Tauri', 'Rust', 'TypeScript'],
    copy: 'live',
  },
  {
    id: '2',
    title: 'glaphicUI',
    image: './assets/glaphicUI.png',
    description: "glaphicUI is a Lit 3 web-component library with zero runtime dependencies, inspired by acetate film, HUDs, and graphic realism. It's driven by a single token.css sheet and I used it to build this site.",
    copy: 'live',
  },
  {
    id: '3',
    title: 'Resume Chatbot',
    image: './assets/chatbot.png',
    description: "Using WebLLM library, I load a model directly into the brower and use a machine's VRAM to run a chatbot locally that can answer questions about my resume. I have gone through a few approaches and you can read more about my process here. Please don't take what it says at face value though!",
    copy: 'live',
  },
  {
    id: '4',
    title: 'Gospodin',
    image: './assets/gospodin.png',
    description: "Gospodin is a single player roguelike game, built with the löve2d framework. Original art and music by Me. Inspired the works of the Strugatsky brothers and Warhammer 40,000. You play as an agent of an advanced starfaring society infiltrating a primitive planet. When you discover that many of its residents are suffering from a mysterious illness, you must navigate the planet's dangerous terrain and uncover the truth about the illness have been infected by Alien parasites, you must fight your way to the creature's lair and defeat it.",
    copy: 'live',
  },
  {
    id: '5',
    title: 'Dark Forest',
    image: './assets/darkforest.png',
    description: "Dark Forest is a simple game, inspired by Katamari Damacy and Liu Cixin's Rememberance of Earth's past trilogy, built with paper.js and css.",
    copy: 'live',
  },
  {
    id: '6',
    title: 'Novel',
    image: './assets/novel.png',
    description: "I'm writing a novel. It's why I'm buiding Rite. I'll post a sample on this website soon.",
    // the card carries no route link (the brief: the novel has no button)
    copy: 'live',
  },
];

/** the stable-key lookup the landing's cards navigate with: by title
    (the ids are the index array's order of the day — the reorder agent
    moves them). A missing title is a data error: the error carries the
    title and the lookup never returns a fallback project. */
export function projectByTitle(title: string): Project {
  const found = projects.find((p) => p.title === title);
  if (!found) {
    throw new Error(`projects: no entry titled '${title}' — check the card lookups`);
  }
  return found;
}