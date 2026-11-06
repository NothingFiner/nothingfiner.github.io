# Bloom header → glaphicUI (backlog, 2026-11-03)

Eliot's ask: the landing's bloom header (the coalescing shadow-cloud
headline that lived on the now section's grey band) is ditched from the
site read, but the pattern should live in the **glaphicUI library for
another time**.

State today:

- The engine (`glaphic-text`, variant="infinite", the shadow-stack
  rungs) **is** already in the library — the site consumed it directly.
- What was NOT in the library: the "bloom band" composite — the
  chamfered grey strip + the coalescing light-DOM copy read (the rest/
  arrived text-shadow pair lists, the equal-length list rationale, the
  round-E band sizing). That section styling retired with the round-6
  pass in LandingNow.

The backlog item: package the bloom-header pattern (band + coalescing
headline + sr-only heading pairing) as a library component — candidate
name `glaphic-bloom-head` — carrying the band's tier-2 knobs
(background, chamfer cut, type ladder) so future pages get it without
re-deriving the shadow lists.