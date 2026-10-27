// Per-project detail content for the new-design /projects/:id page —
// the copy the pinned corner blocks and the scroll-stream read.
//
// Keyed by the project NAME (the lowercase underscore tag the index
// cards print, matched through getProjectDetail by project.title) —
// NOT by the index's positional ids: the index agent reorders the
// cards array (ids are the array position), so the id is the one key
// the detail content must not trust. projects.ts itself is the index
// page's domain (edited in parallel) — never touched from here.
//
// AGENCY WORKS SEAM — the coming agency-works page will mount this
// same corner composition with an extra section in the crimson plate:
// put a `responsibilities: string[]` on an entry (see the interface
// below; the plate renders it as its own label + list when present)
// and add the agency entries keyed the same way. No agency route or
// data exists yet on purpose — this file only leaves the shape ready.
//
// Copy: the descriptions are the index array's own text (real copy).
// `draft` flags copy written for this page and awaiting Eliot — the
// plate prints a small DRAFT tag so it can't pass as real.

export interface ProjectDetailContent {
  /** the fluro title block's paragraph (the index's `description`
      verbatim for the live entries) */
  description: string;
  /** the crimson details block's languages/technologies list */
  technologies: string[];
  /** the scroll stream's image blocks (src paths, in ride order) */
  images: string[];
  /** AGENCY WORKS SEAM (optional): the responsibilities section the
      crimson plate renders ONLY when present — the regular projects
      never set it */
  responsibilities?: string[];
  /** rows under the technologies list — real cross-references found
      in the repo (the chatbot's process post, Rite's repo) */
  rows?: { label: string; value: string; href?: string }[];
  /** LINK BUTTONS on the fluro title block (optional) — only real,
      resolvable targets go here; external = a new-tab hop */
  links?: { label: string; href: string; external?: boolean }[];
  /** copy provenance: 'live' (sourced from the repo) or 'draft'
      (written for this page, awaiting Eliot) — the plate prints a
      DRAFT tag on 'draft' */
  copy: 'live' | 'draft';
}

interface ProjectDetailEntry extends ProjectDetailContent {
  title: string;
}

const details: ProjectDetailEntry[] = [
  {
    title: 'Rite',
    description:
      "Rite is an IWE—an integrated writing environment. It's a lightweight, distraction-free word processor I'm building as a native desktop app with Tauri. It's still in active development — what's shown here is a work in progress. The goal is a fast, focused writing tool that gets out of your way, complete with built-in support for a custom BYOK writing assistant, history diffing, and guess-free manuscript formatting.",
    technologies: ['Tauri', 'Rust', 'TypeScript'],
    images: [
      './assets/rite/rite-hero.png',
      './assets/rite/rite-2.png',
      './assets/rite/rite-3.png',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/NothingFiner/rite', external: true }],
    copy: 'live',
  },
  {
    title: 'glaphicUI',
    description:
      'glaphicUI is a Lit 3 web-component library with zero runtime dependencies — the design system behind this site. Flat graphic realism cut against HUD-instrument styling: cutout corners, overprinting transparencies that print a third color, near-sharp edges and hard, no-blur inks, all driven from one tokens.css sheet.',
    technologies: ['Lit', 'TypeScript', 'Web Components', 'Storybook'],
    images: ['./assets/glaphicUI.png', './assets/glaphic_!.png', './assets/glaphic_2.png'],
    links: [{ label: 'Browse the components', href: '#/components' }],
    copy: 'live',
  },
  {
    title: 'Resume Chatbot',
    description:
      "Using WebLLM library, I load a model directly into the brower and use a machine's VRAM to run a chatbot locally that can answer questions about my resume. I have gone through a few approaches and you can read more about my process here.",
    technologies: ['WebLLM', 'WebGPU', 'Preact'],
    images: ['./assets/chatbot.png'],
    links: [{ label: 'Chat with the bot', href: '#/chat' }],
    rows: [
      { label: 'PROCESS', value: 'Running a Local LLM in the Browser with WebGL', href: '#/blog/1' },
    ],
    copy: 'live',
  },
  {
    title: 'Gospodin',
    description:
      "Gospodin is a single player roguelike game, built with the löve2d framework. Original art and music by Me. Inspired the works of the Strugatsky brothers and Warhammer 40,000. You play as an agent of an advanced starfaring society infiltrating a primitive planet. When you discover that many of its residents are suffering from a mysterious illness, you must navigate the planet's dangerous terrain and uncover the truth about the illness have been infected by Alien parasites, you must fight your way to the creature's lair and defeat it.",
    technologies: ['Lua', 'LÖVE2D framework', 'Original art & music'],
    images: ['./assets/gospodin.png'],
    copy: 'live',
  },
  {
    title: 'Dark Forest',
    description:
      "Dark Forest is a simple game, inspired by Katamari Damacy and Liu Cixin's Rememberance of Earth's past trilogy, built with paper.js and css.",
    technologies: ['JavaScript', 'paper.js', 'CSS'],
    images: ['./assets/darkforest.png'],
    links: [{ label: 'Play the game', href: '#/games/dark-forest' }],
    copy: 'live',
  },
];

// the lowercase underscore tag — the same filing the index cards print
const tag = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export const projectDetails: Record<string, ProjectDetailContent> = Object.fromEntries(
  details.map((d) => [tag(d.title), d]),
);

/** the detail content for a project from the index array, by its name
    tag; `undefined` when a project exists without an entry yet (the
    page falls back to the index's own description/gallery/tags) */
export function getProjectDetail(
  project: { id: string; title: string },
): ProjectDetailContent | undefined {
  return projectDetails[tag(project.title)];
}