// Landing shared copy — the bits more than one landing section carries
// (the marquee ticker is the same band on both the about and the
// technologies sections).
export const TICKER = ['12+ Years', 'React', 'Vue', 'TypeScript', 'AI', 'Poetry', 'Fiction', 'Design', 'JavaScript', 'Style', 'Dvlpr', 'RoR'];

// The landing's ride-out: each section's content ANIMATES UP as its
// own section leaves the viewport (Eliot: the previous section's
// content rides out the top as the next one arrives), reversing on the
// way back. One scroll-linked transform per section: as the section's
// bottom edge climbs past the viewport's top, its content translates
// up by a share of the overrun (the reader's own scroll is the
// animation's clock — no timers, no entrance classes, reversible
// always). prefers-reduced-motion: parked at 0.
export function rideOutUp(
  section: { current: HTMLElement | null },
  content: { current: HTMLElement | null },
  share = 0.5,
): () => void {
  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const host = section.current;
      const inner = content.current;
      if (!host || !inner) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        inner.style.transform = '';
        return;
      }
      // the run: the section's bottom's distance below the viewport's top
      const rect = host.getBoundingClientRect();
      const over = window.innerHeight - rect.bottom; // >0 = the bottom has
      // climbed above the viewport's top — the exit's distance
      const ride = Math.max(0, over) * share;
      inner.style.transform = ride > 0 ? `translateY(${-ride}px)` : '';
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (content.current) content.current.style.transform = '';
  };
}