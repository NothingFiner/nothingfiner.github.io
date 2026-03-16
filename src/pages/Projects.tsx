import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { projects } from '../data/projects';

interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
}

export function Projects() {
  const [, navigate] = useLocation();
  const [transitioningProject, setTransitioningProject] = useState<Project | null>(null);

  const handleProjectClick = (id: string) => {
    const project = projects.find(p => p.id === id);
    setTransitioningProject(project || null);
    setTimeout(() => {
      navigate(`/projects/${id}`);
      setTimeout(() => setTransitioningProject(null), 100);
    }, 400);
  };

  return (
    <div class="min-h-screen p-8 relative">
      {transitioningProject && (
        <div class="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-400">
          <div class="relative w-full h-full flex items-center justify-center">
            <img
              src={transitioningProject.image}
              alt={transitioningProject.title}
              class="max-w-4xl max-h-[80vh] object-contain rounded-2xl glass"
              style={{ transform: 'scale(1.2)' }}
            />
          </div>
        </div>
      )}

      <div class={`max-w-7xl mx-auto transition-opacity duration-300 ${transitioningProject ? 'opacity-0' : 'opacity-100'}`}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              class={`group cursor-pointer rounded-2xl overflow-hidden glass glass-hover transition-all duration-300 hover:scale-105 ${
                transitioningProject && transitioningProject.id !== project.id ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div class="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(139, 149, 86, 0.3), 0 0 30px rgba(139, 149, 86, 0.2)',
                  }}
                />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold text-theme">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
