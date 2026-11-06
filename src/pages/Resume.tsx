import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from '../components/GrowHead';

export function Resume() {
  // the reveal observes the HEAD WRAPPER, never the page root: the
  // iframe panel can approach the viewport's height (the tall-element
  // observer trap) — the wrapper is what arrives
  const [inView, setInView] = useState(false);
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
    <div class="resume-page">
      <style>{`
        .resume-page {
          position: relative;
          min-height: 100vh;
          /* the stage is clear over the site's lava lamp (app.tsx
             lights the blobs for this route) — the panel's solid
             plate carries itself */
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          /* the bare stage's flow padding (as projects/past) */
          padding: 3.6vh 3.9vw 4vh;
        }
        .resume-page__head { margin-bottom: 4.4vh; }
        /* the resume column keeps the page's legacy read (max-w-4xl) */
        .resume-page__flow { max-width: 56rem; }
        @media (max-width: 899px) {
          .resume-page { padding: 44px 6vw 6vh; }
        }
      `}</style>

      {/* the reveal gate wraps the head — the GrowHead composes bare
          inside the tracked wrapper */}
      <div class="resume-page__head" ref={headRef}>
        <GrowHead text="Resume" inView={inView} />
      </div>

      <div class="resume-page__flow mx-auto">
        <div class="site-panel p-8 overflow-hidden">
          <iframe
            src="/assets/resume.pdf"
            class="w-full h-[80vh] rounded-[var(--glaphic-radius-base)] border border-[var(--panel-keyline)]"
          >
            <p class="text-theme">
              Your browser does not support PDFs.
              <a href="/assets/resume.pdf" target="_blank" class="text-accent-green underline">
                Download the PDF instead
              </a>.
            </p>
          </iframe>
        </div>
      </div>
    </div>
  );
}
