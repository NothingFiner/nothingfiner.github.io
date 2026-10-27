import { useLocation } from 'wouter-preact';
import { getPostById } from '../data/blog';

export function BlogPost() {
  const [location, navigate] = useLocation();
  const postId = location.split('/').pop() || '';
  const post = getPostById(postId);

  if (!post) {
    return (
      <div class="min-h-screen p-8 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-heading font-bold text-theme mb-4">Post not found</h2>
          <button
            onClick={() => navigate('/blog')}
            class="px-6 py-3 rounded-xl panel panel-hover transition-all text-theme"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen p-8">
      <div class="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/blog')}
          class="mb-8 px-4 py-2 rounded-xl panel panel-hover transition-all text-theme text-sm"
          aria-label="Back to blog list"
        >
          ← Back to Blog
        </button>

        <article class="panel rounded-2xl p-8">
          <time class="text-sm text-theme/60 font-mono block mb-4">
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
            class="prose prose-lg max-w-none text-theme/80 blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div class="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/blog')}
            class="px-6 py-3 rounded-xl panel panel-hover transition-all text-theme"
            aria-label="Back to blog list"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    </div>
  );
}
