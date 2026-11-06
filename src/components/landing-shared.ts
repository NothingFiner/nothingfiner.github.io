// Landing shared copy — the bits more than one landing section carries
// (the marquee ticker is the same band on both the about and the
// technologies sections).
export const TICKER = ['12+ Years', 'React', 'Vue', 'TypeScript', 'AI', 'Poetry', 'Fiction', 'Design', 'JavaScript', 'Style', 'Dvlpr', 'RoR'];

// The landing's ride-in: the entrance mirror of rideOutUp — as a section's
// top edge climbs out of the viewport's bottom, its riders sit BELOW their
// seats by the unread share and settle exactly when the section's top
// reaches the viewport's top. Same clock as the ride-out — the reader's
// own scroll — so there are no entrance classes, no timers, no transition
// (a per-frame inline transform; a CSS transition would lag the clock and
// judder), reversible always. prefers-reduced-motion: parked at seat.
export function rideInUp(
  section: { current: HTMLElement | null },
  riders: HTMLElement[],
  rideVh = 14,
): () => void {
  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const host = section.current;
      if (!host) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (const el of riders) el.style.transform = '';
        return;
      }
      const vh = window.innerHeight;
      const top = host.getBoundingClientRect().top;
      // the read: 0 while the top's below the fold, 1 once it's reached it
      const p = Math.min(1, Math.max(0, (vh - Math.max(0, top)) / vh));
      const ride = (1 - p) * ((vh * rideVh) / 100);
      const pose = ride > 0.5 ? `translateY(${ride}px)` : '';
      for (const el of riders) el.style.transform = pose;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    for (const el of riders) el.style.transform = '';
  };
}

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
  // round 9: an optional follower wire — fires every scroll frame with
  // the ride in px. The world-pair mirror (GlyphPair) rides via a LAYOUT
  // var (its `top` calc) because a transform of its own would re-stack
  // the mirror and re-isolate its blend from the ground.
  onRide?: (dy: number) => void,
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
        onRide?.(0);
        return;
      }
      // the run: the section's bottom's distance below the viewport's top
      const rect = host.getBoundingClientRect();
      const over = window.innerHeight - rect.bottom; // >0 = the bottom has
      // climbed above the viewport's top — the exit's distance
      const ride = Math.max(0, over) * share;
      inner.style.transform = ride > 0 ? `translateY(${-ride}px)` : '';
      // round 9: hand the same ride to a follower — px, not a transform
      onRide?.(ride > 0 ? -ride : 0);
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
    onRide?.(0);
  };
}