import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { GrowHead } from '../components/GrowHead';
import { blogPosts } from '../data/blog';

export function Blog() {
  const [, navigate] = useLocation();
  const [inView, setInView] = useState(false);
  // the reveal observes the HEAD WRAPPER, never the page root: the
  // posts column outruns any viewport (PastWork's tall-element observer
  // trap), so a whole-page threshold computes to a gate that may never
  // pass — the wrapper is what arrives
  const headRef = useRef<HTMLDivElement | null>(null);

  // reveal the grow once the page's fold enters (the projects page's
  // own gate: an observer that means toggle — it never disconnects)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const head = headRef.current;
    if (head) io.observe(head);
    return () => io.disconnect();
  }, []);

  return (
    <div class="blog-page">
      <style>{`
        .blog-page {
          position: relative;
          min-height: 100vh;
          /* the stage is clear over the site's lava lamp (app.tsx
             lights the blobs for this route) — the panels' solid
             plates carry themselves */
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          /* the bare stage's flow padding (as projects/past) */
          padding: 3.6vh 3.9vw 4vh;
        }
        .blog-page__head { margin-bottom: 4.4vh; }
        /* the posts column keeps the page's legacy read (max-w-3xl);
           its stack's first gap clears the headline's shadow */
        .blog-page__flow { max-width: 48rem; }
        @media (max-width: 899px) {
          .blog-page { padding: 44px 6vw 6vh; }
        }
      `}</style>

      {/* the reveal gate wraps the head — the GrowHead composes bare
          inside the tracked wrapper */}
      <div class="blog-page__head" ref={headRef}>
        <GrowHead text="Blog" inView={inView} />
      </div>

      <div class="blog-page__flow mx-auto space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            class="site-panel p-6 cursor-pointer site-panel--hover transition-all duration-200 hover:scale-[1.02]"
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
              <time class="text-sm text-grey font-mono">
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
              class="text-theme max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').trim().slice(0, 300) + '...' }}
            />
            <div class="mt-4">
              <span class="text-accent-green text-sm font-medium">Read more →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
