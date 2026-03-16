import { useLocation } from 'wouter-preact';

export function Home() {
  const [, navigate] = useLocation();

  return (
    <div>
      <div class="mb-4 md:mb-12">
        <h1
          class="text-3xl md:text-6xl font-heading mb-2 text-left"
          style={{
            letterSpacing: '-0.02em',
          }}
        >
          Hello, I'm Elie
        </h1>
        <h2 class="text-xl md:text-2xl text-theme/80 text-left">
          I'm a developer
        </h2>
      </div>

      <button
        onClick={() => navigate('/chat')}
        class="px-8 py-4 rounded-xl btn-accent transition-all duration-200 font-medium text-lg hover:scale-105"
      >
        Learn More
      </button>
    </div>
  );
}
