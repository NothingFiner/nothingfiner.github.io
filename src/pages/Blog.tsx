import { useLocation } from 'wouter-preact';
import { blogPosts } from '../data/blog';

export function Blog() {
  const [, navigate] = useLocation();

  return (
    <div class="min-h-screen p-8">
      <div class="max-w-3xl mx-auto">
        <div class="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              class="glass-blog rounded-2xl p-6 cursor-pointer glass-hover transition-all duration-200 hover:scale-[1.02]"
              role="article"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/blog/${post.id}`);
                }
              }}
            >
              <div class="flex items-center gap-4 mb-3">
                <time class="text-sm text-theme/60 font-mono">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <h2 class="text-2xl font-heading font-bold text-theme mb-3">
                {post.title}
              </h2>
              <div 
                class="text-theme/80 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').trim().slice(0, 300) + '...' }}
              />
              <div class="mt-4">
                <span class="text-accent-green text-sm font-medium">Read more →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
