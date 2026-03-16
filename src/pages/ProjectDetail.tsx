import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { useRoute } from 'wouter-preact';
import { projects } from '../data/projects';

interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
}

export function ProjectDetail() {
  const [match, params] = useRoute<{ id: string }>('/projects/:id');
  const [, navigate] = useLocation();
  const projectId = params?.id;
  const currentIndex = projectId ? projects.findIndex(p => p.id === projectId) : -1;
  const project: Project = projects[currentIndex] || projects[0];

  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [projectId]);

  const getNextProject = () => projects[(currentIndex + 1) % projects.length];
  const getPrevProject = () => projects[(currentIndex - 1 + projects.length) % projects.length];

  const navigateToProject = (id: string) => navigate(`/projects/${id}`);
  const nextProject = getNextProject();
  const prevProject = getPrevProject();

  return (
    <div class="min-h-screen bg-page relative">
      <button
        onClick={() => navigate('/projects')}
        class="fixed top-8 right-16 z-50 px-6 py-3 rounded-xl glass glass-hover transition-all duration-200 text-theme font-medium"
        aria-label="Back to projects list"
      >
        ← Back
      </button>

      <div class="container mx-auto px-4 md:px-8 py-8 md:py-16">
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <div class="hidden lg:flex flex-col items-center justify-center w-1/5 sticky top-1/2 -translate-y-1/2 h-screen">
            <button onClick={() => navigateToProject(prevProject.id)} class="group relative w-full max-w-xs" aria-label={`View previous project: ${prevProject.title}`}>
              <div class="absolute inset-0 flex items-center justify-center z-10">
                <div class="w-12 h-12 rounded-full glass flex items-center justify-center">
                  <svg class="w-6 h-6 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
              <img
                src={prevProject.image}
                alt={prevProject.title}
                class="w-full rounded-2xl opacity-40 blur-sm transition-all duration-300 group-hover:opacity-60 group-hover:blur-none"
              />
            </button>
          </div>

          <div class="flex-1 lg:w-3/5">
            <div class={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div class="rounded-2xl overflow-hidden glass mb-8">
                <img src={project.image} alt={project.title} class="w-full h-auto" />
              </div>

              <h1
                class="text-4xl font-heading font-heading mb-6 text-theme"
                style={{ textShadow: '3px 3px 0px var(--color-accent-green)' }}
              >
                {project.title}
              </h1>

              <div class="rounded-2xl glass p-8 max-h-[60vh] overflow-y-auto">
                <div class="prose prose-lg max-w-none text-theme font-body whitespace-pre-line">
                  {project.description}
                </div>
              </div>
            </div>
          </div>

          <div class="hidden lg:flex flex-col items-center justify-center w-1/5 sticky top-1/2 -translate-y-1/2 h-screen">
            <button onClick={() => navigateToProject(nextProject.id)} class="group relative w-full max-w-xs" aria-label={`View next project: ${nextProject.title}`}>
              <div class="absolute inset-0 flex items-center justify-center z-10">
                <div class="w-12 h-12 rounded-full glass flex items-center justify-center">
                  <svg class="w-6 h-6 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <img
                src={nextProject.image}
                alt={nextProject.title}
                class="w-full rounded-2xl opacity-40 blur-sm transition-all duration-300 group-hover:opacity-60 group-hover:blur-none"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
