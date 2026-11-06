import { useLocation } from 'wouter-preact';
import { getPostById } from '../data/blog';

export function BlogPost() {
  const [location] = useLocation();
  const postId = location.split('/').pop() || '';
  const post = getPostById(postId);

  if (!post) {
    return (
      <div class="min-h-screen p-8 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-heading font-bold text-theme mb-4">Post not found</h2>
          <a href="#/blog" aria-label="Back to blog index">
            <glaphic-button variant="outline" size="lg">← BACK TO INDEX</glaphic-button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen p-8">
      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <a href="#/blog" aria-label="Back to blog index">
            <glaphic-button variant="outline" size="lg">← BACK TO INDEX</glaphic-button>
          </a>
        </div>

        <article class="site-panel p-8">
          <time class="text-sm text-grey font-mono block mb-4">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          <h2 class="text-3xl font-heading font-bold text-theme mb-6">
            {post.title}
          </h2>

          <div
            class="max-w-none text-theme blog-post__content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div class="mt-8 flex justify-between">
          <a href="#/blog" aria-label="Back to blog index">
            <glaphic-button variant="outline" size="lg">← BACK TO INDEX</glaphic-button>
          </a>
        </div>
      </div>
    </div>
  );
}
