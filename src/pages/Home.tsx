import { useLocation } from 'wouter-preact';
import { Icon } from '../components/Icon';
import { useRef } from 'preact/hooks';

const technologies = [
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Vue.js', icon: 'vue' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Ruby', icon: 'ruby' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Redux', icon: 'redux' },
  { name: 'TanStack Query', icon: 'tanstack' },
  { name: 'Material UI', icon: 'mui' },
  { name: 'Git', icon: 'git' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Python', icon: 'python' },
];

export function Home() {
  const [, navigate] = useLocation();

  const aboutRef = useRef<HTMLElement | null>(null);
  const techRef = useRef<HTMLElement | null>(null);
  const botRef = useRef<HTMLElement | null>(null);

  return (
    <div class="w-full">
      {/* Hero section */}
      <section id="hero" class="min-h-screen flex items-center mb-16 md:mb-0">
        <div class="w-full md:ml-auto md:pr-16">
          <div class="mb-8">
            <h1
              class="text-4xl md:text-6xl font-heading mb-3 text-left"
              style={{
                letterSpacing: '-0.02em',
              }}
            >
              Hello, I'm Elie
            </h1>
            <h2 class="text-lg md:text-xl text-theme/80 text-left font-light">
              I'm a (mostly) frontend developer with 10+ years of experience. Let me help you tell your story.
            </h2>
          </div>

          <button
            onClick={() => navigate('/chat')}
            class="px-8 py-4 hidden md:block rounded-xl btn-accent transition-all duration-200 font-medium text-lg hover:scale-105"
          >
            Learn More
          </button>
          <button
            onClick={() =>  aboutRef.current?.scrollIntoView({behavior: 'smooth'})}
            class="px-8 py-4 rounded-xl md:hidden btn-accent transition-all duration-200 font-medium text-lg hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* About section */}
      <section id="about" ref={aboutRef} class="py-16 max-md:min-h-screen md:py-24 max-md:flex max-md:flex-col max-md:justify-center">
        <div class="max-w-3xl">
          <div class="glass rounded-2xl p-8">
            <div class="prose prose-lg max-w-none text-theme">
              <p class="mb-4">
                I've been coding since I was a kid. The first thing I ever coded was an attempt at an asteroid clone on a casio graphing calculator.
                I never could get it past enemy rendering: it got too slow. I'm sure I had a fundamental misunderstanding of how to implement a game loop.
              </p>
              <p class="mb-4">
                I've been coding professionally since 2013. First as a contractor, before landing my first full-time gig. I went to AppAcademy in 2017 and spent more than 8 years working in e-commerce & SaaS.
                I built everything from webstores to custom web apps. I'm looking for my next challenge in the product space.
              </p>
            </div>
          </div>
        </div>
        <button
            onClick={() =>  techRef.current?.scrollIntoView({behavior: 'smooth'})}
            class="bottom-8 w-full flex justify-center mt-12 px-8 py-4 ml-auto mr-auto rounded-xl md:hidden transition-all duration-200 font-medium text-lg hover:scale-105"
          >
            <Icon name={'down'} size={24} class="opacity-70" />
        </button>
      </section>

      {/* Technologies section */}
      <section id="technologies" ref={techRef} class="py-16 max-md:min-h-screen md:py-24 max-md:flex max-md:flex-col max-md:justify-center">
        <div class="text-center mb-6">
          <p class="text-sm md:text-base  text-theme/60 mb-2">
            Some of the Technologies I've worked with
          </p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              class="glass rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200"
              style={{
                animation: `fade-in 0.5s ease-out forwards ${0.1 * index}s`,
                opacity: 0
              }}
            >
              <Icon name={tech.icon} size={24} class="opacity-70" />
              <span class="text-sm text-theme/80 font-mono whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
        <button
            onClick={() =>  botRef.current?.scrollIntoView({behavior: 'smooth'})}
            class="bottom-8 w-full flex justify-center mt-12 px-8 py-4 ml-auto mr-auto rounded-xl md:hidden transition-all duration-200 font-medium text-lg hover:scale-105"
          >
            <Icon name={'down'} size={24} class="opacity-70" />
        </button>
      </section>
      <section 
        id="mobileLinks"
        ref={botRef} 
        class="max-md:flex max-md:min-h-screen max-md:flex-col max-md:justify-center md:hidden"
      >
        <h3 class="text-4xl mb-12 text-center">
          Don't Be a Stranger!
        </h3>
        <div class="flex justify-evenly">
          <a
            href="https://www.linkedin.com/in/efiner"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-xl glass glass-hover transition-all duration-300 text-theme"
            aria-label="LinkedIn"
          >
            <Icon name={'linkedin'} size={48} class="opacity-70" />
          </a>
          <a
            href="https://github.com/nothingfiner"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-xl glass glass-hover transition-all duration-300 text-theme"
            aria-label="GitHub"
          >
            <Icon name={'github'} size={48} class="opacity-70" />
          </a>
          <a
            href="mailto:e.a.finer@gmail.com"
            class="p-3 rounded-xl glass glass-hover transition-all duration-300 text-theme"
            aria-label="Email"
          >
            <Icon name={'email'} size={48} class="opacity-70" />
          </a>
        </div>
      </section>
    </div>
  );
}
