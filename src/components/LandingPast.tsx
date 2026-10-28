import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowHead } from './GrowHead';

const INK = '#0D0221';

export function LandingPast() {
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLElement | null>(null);

  // reveal the grow + the strip's rise when the section scrolls in
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="past"
      ref={hostRef}
      class={`landing-past ${inView ? 'ln-in' : ''}`}
      style={{ color: INK }}
    >
      {/* the flow grid + head slot print from landing.css's shared layer */}
      <div class="ln-flow">
        <GrowHead text="Past Work" inView={inView} class="ln-head" />
        <glaphic-plate tone="brand" />
        <glaphic-tape />
        {/* the section's one worked-on storefront. The bare 1-col grid item
            below replaces the dead `grid-col-5/row-span-3/col-span-2`
            wrapper stack and its two empty containers — none of those
            carried styles, so the box (and the past plate look) is
            preserved exactly; the class names the item for future
            section-private rules. */}
        <div class="landing-past__image">
          <img src="./assets/brooksbrothers.png" alt="A Brooks Brothers web storefront build" />
        </div>
      </div>
    </section>
  );
}