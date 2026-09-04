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
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Dark Forest',
    image: './assets/darkforest.png',
    description: "Dark Forest is a simple game, inspired by Katamari Damacy and Liu Cixin's Rememberance of Earth's past trilogy, built with paper.js and css."
  },
  {
    id: '2',
    title: 'Gospodin',
    image: './assets/gospodin.png',
    description: "Gospodin is a single player roguelike game, built with the löve2d framework. Original art and music by Me. Inspired the works of the Strugatsky brothers and Warhammer 40,000. You play as an agent of an advanced starfaring society infiltrating a primitive planet. When you discover that many of its residents are suffering from a mysterious illness, you must navigate the planet's dangerous terrain and uncover the truth about the illness have been infected by Alien parasites, you must fight your way to the creature's lair and defeat it."
  },
  {
    id: '3',
    title: 'Resume Chatbot',
    image: './assets/chatbot.png',
    description: "Using WebLLM library, I load a model directly into the brower and use a machine's VRAM to run a chatbot locally that can answer questions about my resume. I have gone through a few approaches and you can read more about my process here."
  },
  {
    id: '4',
    title: 'Rite',
    image: './assets/rite/rite-hero.png',
    description: "Rite is an IWE—an integrated writing environment. It's a lightweight, distraction-free word processor I'm building as a native desktop app with Tauri. It's still in active development — what's shown here is a work in progress. The goal is a fast, focused writing tool that gets out of your way, complete with built-in support for a custom BYOK writing assistant, history diffing, and guess-free manuscript formatting.",
    gallery: [
      './assets/rite/rite-1.png',
      './assets/rite/rite-2.png',
      './assets/rite/rite-3.png',
    ],
    githubUrl: 'https://github.com/nothingfiner/rite',
    status: 'In development',
    tags: ['Tauri', 'Rust', 'TypeScript'],
  },
];
