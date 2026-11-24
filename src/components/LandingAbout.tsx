// New-design landing section two — the About rebuilt as Eliot's three
// bands (the 2026-10-30 revamp brief; the Figma-mock era's story rows
// and its old reading retired), amended in place by feedback round A
// (2026-10-30 ~16:57, F1-F11), feedback round B (2026-10-30 ~17:32,
// B1-B6) and iteration C (2026-10-30 ~17:59, C1-C9):
//   band 1  a TICKER above the ~490px portrait seat — the headline
//           "Trained Poet; Experienced Developer" keeps its shadow-less
//           read (F6) but "Trained Poet;" now paints the FLURO GREEN
//           (B3) in the Jacquard 12 pixel face outright (the
//           2026-11-03 call — the face the past track's big words flip
//           to; weight 400 — the face ships no bold) while the second
//           phrase keeps its one-shot crimson
//           flash, with no column reserve from the art (F4: the head's
//           track ends at the art's left edge, and a line may stride
//           across it) — and the ASCII-portraits cycler right, still
//           CONSUMER-STYLEd: ink glyphs straight on the page's hatch,
//           no surface/border/blend (F1's per-instance part overrides —
//           round D extends the isolation to the burst widget too), sized 2×
//           (F2) and holding each frame twice as long (F3) — then a
//           second TICKER whose track runs the OPPOSITE direction; the
//           whole band leads the section with a spacer that seats
//           band-1 at the viewport's middle exactly when the sidebar
//           parks (F5, re-verified after the B6 retune)
//   band 2  the one burst-beside-headline row (round F folded the
//           typed-line pair): the multiline "I've come a long way since
//           cloning asteroids on my middle school graphing calculator."
//           grow head (round D's text, round E's period + 64px cap)
//           with the asteroid burst riding NEXT TO it — the burst raw
//           (F1's per-instance isolation extended here — no fluro
//           surface, no border, no multiply), dark-crimson glyphs with
//           the grow ladder's first three rungs (1px 2px 4px, the
//           fading shadow print) at 64px; the widget reserves its
//           full-height seat from first paint, the seat deriving from
//           the burst's own type
//   band 3  the chamfered fluro plate — the band models its strip
//           (the sections' full-bleed margins) and the plate rides as
//           its one grid cell, floating ~8vw inside the strip's edges
//           (B1); the field is the box's own flat fluro fill (the
//           same flat read the past copy cell carries), its copy
//           breathing wider (C8+D: 20px hug, leading + tracking) and
//           enclosed in the library's glaphic-corners braces on its
//           two square corners
// Band 1's riders — the headline print, the portrait cycler — fire on
// the band's single flag; the marquees seat statically (11-04 retired
// their drop-into-place read), so the mid row holds no pose with them.
// Every band's animations trigger only when THAT band enters the
// viewport — one latched IntersectionObserver watching the band
// wrappers, each latching its own flag (F11; bands 1-2 fire with the
// section-arrival band, the plate at its own shallower entry band; the
// section's own .landing-about--in
// latch and the rideOutUp stay). Bands breathe 12vh apart (B6, up from
// round A's 6vh).
// The portraits are REAL art: eight text frames, all real renders
// from public/assets/ascii-portraits/ — every frame 55 lines, the
// widest 100 columns (the copies' names are download suffixes; the
// PLAY order is PORTRAIT_NUMBERS — the held-pose cycle, 13 slots
// counting the pulse-backs and the closing return). The frames fetch at runtime
// and set on the element's ref only when the fetches settle AND band 1 has
// fired (the cycle is a band-gated animation); array properties can't
// carry to Lit from JSX attributes (the marquee precedent).
import { useEffect, useRef, useState } from 'preact/hooks';
import { GrowText } from './GrowHead';
import { rideOutUp, TICKER } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A'; // dark brand crimson — the flash + the ticker inks
const FLURO = '#14F1C8'; // the site's fluro green — band 1's lead phrase + the plate's field

/* the portraits' PLAY ORDER — four holds, two blinks, two pulse-backs.
   A pulse-back rides right after the 17 and 38 holds. The previous
   anchor flashes for two steps, the settled pose returns for two
   more. Then the blink commits the next group. 2 holds, breathes
   through 1 into 17. The (25) blink lands 32→37→38. The (6) blink
   returns to 2, where the loop closes. All real art. Only (25) and
   (6) flash. The synthesized 90s family sits unused on disk. Re-bake
   after re-exports with scripts/bake-portrait-tour.py. */
const PORTRAIT_NUMBERS = [
  2, 1, 17, 2, 17, 25, 32, 37, 38, 32, 38, 6, 2,
];

/* time weights in steps: the anchors hold 9, the pulses flash 1,
   the breaths rest 2, the blinks 0.3, the close 3. One weight per
   route slot, in PORTRAIT_NUMBERS' order. --ab-ascii-step carries
   the seconds. */
const PORTRAIT_DWELLS = [
  9, 2, 9, 1, 1, 0.3, 9, 2, 9, 1, 1, 0.3, 3,
];

/* the burst's frame content (multi-line ASCII, real newlines): what the
   shell/burst cycle shows — data, not machinery */
const FRAMES = [
  " o\n\n   \n    ^  ",
  "  o\n\n   |\n   ^   ",
  "   o\n   |\n   |\n   ^   ",
  "   *\n   |\n\n  ^    ",
  "   \n   \n\n ^     ",
  " \n  ·:·\n   \n\n  ^    ",
  "   \n ·:˙:·\n   ˙\n\n   ^   ",
  "   \n ·:˙:·\n   ˙\n\n    ^  ",
  " . · .\n˙·   ·˙ \n   ˙\n\n     ^"
];

/* the plate's print waits on nothing: the timeline ladder it used to
   follow retired (11-04) — the plate now rises straight off its band's
   own fire (the .landing-about__rise box, no staged delay) */

export function LandingAbout() {
  // the section's own arrival latch (stays per F11's contract) — the
  // per-band flags below now own every animation's gate
  const [inView, setInView] = useState(false);
  // the three bands' latched reveals (F11): each flips once, in its own
  // observer entry, and never again
  const [in1, setIn1] = useState(false);
  const [in2, setIn2] = useState(false);
  const [in3, setIn3] = useState(false);
  // the portraits' resolved art (null until every fetch lands) — the set
  // onto the element waits for BOTH this and band 1's fire
  const [portraitFrames, setPortraitFrames] = useState<string[] | null>(null);
  // two ticker instances (band 1 top, band 1's reversed runner) — one
  // voice, each needing its own ref for the imperative set
  const marqueeLeadRef = useRef<HTMLElement | null>(null);
  const marqueeRevRef = useRef<HTMLElement | null>(null);
  const portraitsRef = useRef<HTMLElement | null>(null);
  const burstRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  // the bands are the observer targets AND the spacing spines (F10/F11)
  const band1Ref = useRef<HTMLDivElement | null>(null);
  const band2Ref = useRef<HTMLDivElement | null>(null);
  const band3Ref = useRef<HTMLDivElement | null>(null);
  // the content's ride-out: as the section leaves the viewport its
  // content translates up with the scroll (the next section's arrival
  // reads as the previous one leaving up), reversing on the way back
  const flowRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);

  // the marquee takes array properties, which JSX attributes can't carry
  // reliably to Lit — set them imperatively once (both instances ride
  // the same TICKER at LandingNow's slower ticker pace)
  useEffect(() => {
    const marquees = [marqueeLeadRef, marqueeRevRef];
    for (const ref of marquees) {
      const el = ref.current as unknown as { strings: string[]; speed: number } | null;
      if (!el) return;
      el.strings = TICKER;
      el.speed = 50;
    }
  }, []);

  // the portraits' load: runtime fetches over the route's 9 numbers from
  // public/assets; an absent number is a normal gap — the mounted set is
  // whatever surfaced (in the list's order, gaps
  // summarized once in the console) AND the band has fired. A caught
  // NETWORK failure logs its URL; a miss or an HTML fallback answer is a
  // gap, not an error. The
  // array property sets once both facts hold — never as JSX
  // attributes. Async outliving the render must cancel: the alive flag +
  // an AbortController stop ghost writes after teardown.
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const load = async () => {
      const frames = await Promise.all(
        PORTRAIT_NUMBERS.map(async (n) => {
          // the art's names carry spaces + parens — URL-encode every one;
          // document-relative paths ride the site's './'-base deploy (hash
          // routing never changes the page's pathname)
          const url = `./assets/ascii-portraits/${encodeURIComponent(`ascii-art (${n}).txt`)}`;
          try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) return null; // a candidate with no file yet — a gap, not an error
            // Vite's SPA fallback answers 200 text/html for missing public
            // files; the HTML body as a frame prints a glitch wall. Art is
            // text/plain, so non-plain responses rejoin the gaps.
            const contentType = res.headers.get('content-type') ?? '';
            if (!contentType.startsWith('text/plain')) return null;
            return await res.text();
          } catch (err) {
            console.error(`[LandingAbout] the portraits' fetch failed for ${url} (frame order ${n}): ${err}`);
            return null;
          }
        }),
      );
      if (!alive) return;
      // the survivors mount in the list's order; the gaps get one summary
      // line (their numbers) — no error per absent file. The filter's
      // type predicate narrows the nulls into real strings, no cast.
      const survivors = frames.filter((f): f is string => f !== null);
      if (survivors.length < PORTRAIT_NUMBERS.length) {
        const gaps = PORTRAIT_NUMBERS.filter((n, i) => frames[i] === null);
        console.info(`[LandingAbout] the portraits: ${survivors.length} of ${PORTRAIT_NUMBERS.length} candidates on disk (gaps: ${gaps.join(', ')})`);
      }
      if (survivors.length) setPortraitFrames(survivors);
    };
    void load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  // the burst's parallax (mobile): the flow's own exit ride handles the
  // content; the asteroid layer swims at its own rate — the driver
  // writes --ab-drift per scroll frame over the section's full transit
  // (the reader's clock — no classes, no timers, reversible always).
  // Desktop and prefers-reduced-motion: the var parks at 0 and the
  // desktop machine renders untouched
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const host = hostRef.current;
        if (!host) return;
        const narrow = window.matchMedia('(max-width: 899px)').matches;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!narrow || still) {
          host.style.setProperty('--ab-drift', '0');
          return;
        }
        const vh = window.innerHeight;
        // the read: 0 while the layer's zone is below the fold, 1 once
        // the section's bottom clears the viewport's top — the whole
        // transit the headline and the plate ride through
        const rect = host.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        host.style.setProperty('--ab-drift', String(Math.round((0.5 - p) * vh * 0.6)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      hostRef.current?.style.setProperty('--ab-drift', '0');
    };
  }, []);

  // the portraits' cycle is band 1's animation (F11): the frames land on
  // the element only once the band's own reveal fired AND the art
  // resolved — the cycle starts with the band, not at page mount. The
  // empty-length read makes the write idempotent (the property never
  // re-sets and the cycle never restarts mid-view).
  useEffect(() => {
    const el = portraitsRef.current as unknown as
      { frames: string[]; dwells: number[] | undefined } | null;
    if (in1 && portraitFrames && el) {
      // dwell weights land before the frames so the cycle starts with
      // the weighted keyframes in place; the weights re-set on every
      // run — an already-cycling element would otherwise keep stale
      // weights, and an unchanged constant is identity-stable, so the
      // re-set renders nothing
      el.dwells = PORTRAIT_DWELLS;
      if (el.frames.length === 0) el.frames = portraitFrames;
    }
  }, [in1, portraitFrames]);

  // the burst widget takes its FRAMES array (content staying with the
  // page) — an array property, so it sets imperatively — and its cycle
  // is band 2's animation (F11): nothing cycles until band 2's own
  // reveal fires. The empty-length read makes the write idempotent (the
  // property never re-sets and the cycle never restarts mid-view)
  useEffect(() => {
    if (!in2) return;
    const burst = burstRef.current as unknown as { frames: string[] } | null;
    if (burst && burst.frames.length === 0) burst.frames = FRAMES;
  }, [in2]);

  // the ride-out wiring
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // the section's own latched arrival latch (kept per F11) — the bands'
  // flags below do the animation gating; this latch carries the same
  // one-arrival read
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      /* the LATCHED idiom: this one means once — the disconnect in the
         callback is its whole point (sticky reveal). The -85% band ties
         the latch to the section's own arrival: the observed top must
         reach the viewport's upper 15%, which lands the fire at (or
         just past) the section's top meeting the viewport's top — the
         moment the reader is actually in the section. Shallower gates
         fired mid-transition for real: the plain 25% threshold fired
         ~550px deep, the -30% lower-third margin and the -64% band both
         let the build play while the previous section still held the
         screen */
      { rootMargin: '0px 0px -85% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  // the bands' latched reveals (F11): all the animations keyed above
  // wait for their OWN wrapper's entry. Bands 1 and 2 fire with the
  // section's arrival — one observer watches their wrappers through the
  // section-arrival -85% band (each fires as its TOP clears the
  // viewport's upper 15%), latching each band's flag once and
  // disconnecting once both have fired. Band 3's plate rides its OWN
  // shallower gate below: the deep -85% read held the fluro box
  // invisible through its whole approach, the fire landing only after
  // the reader had been staring at an empty slot
  useEffect(() => {
    const bands = [
      [band1Ref, setIn1],
      [band2Ref, setIn2],
    ] as const;
    const latched = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || latched.has(entry.target)) continue;
        latched.add(entry.target);
        for (const [ref, set] of bands) {
          if (ref.current === entry.target) set(true);
        }
        // both seen → the observer's job is done (the per-band
        // latch's shared hang-up)
        if (latched.size === bands.length) io.disconnect();
      }
    }, { rootMargin: '0px 0px -85% 0px' });
    for (const [ref] of bands) {
      const el = ref.current;
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // the plate's own gate — it fires on the PLATE's own first pixels
  // crossing the viewport's bottom edge (the band-gate read held the
  // fire 25vh above the fold — the rise played while the box was still
  // below the reader), and the rise's transition carries the fixed
  // beat, so the motion starts a fraction of a second after the box
  // scrolls into view. Latched once per F11's contract
  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIn3(true);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(plate);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={hostRef}
      class={`landing-about ${inView ? 'landing-about--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-about {
          position: relative;
          /* natural height — the sections don't force single screens; the
             tail keeps the sticky band's resting slot (its last 37.5vh)
             clear of the plate */
          height: auto;
          /* F5, the leading spacer: band-1 seats MID-viewport the exact
             moment the sidebar parks (--ab-p hits 1 when this section's
             top reaches 0) — the spacer holds half of band-1 (the two
             48px ticker bands + the seat) above and below the 50vh line
             at that scroll point */
          padding-top: calc(50vh - (var(--ab-band1-mid) + 2 * var(--ab-marquee-h)) / 2);
          /* the tail's 37.5vh + C9's exhale: the plate clears the next
             section's head ~15vh over the band's resting slot */
          overflow: hidden;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          /* F2, the portrait's seat ≈ 2×: the mid row's height — and the
             art's own box follows it exactly (the frame's borders are
             retired on this instance, so the 49-type-line column fills
             the seat with no border accounting); everything under this
             var (the art's font-size, line-height, height) follows it */
          --ab-band1-mid: 490px;
          /* the ticker bands' own height (the seat math above counts it) */
          --ab-marquee-h: 48px;
          /* B6, the bands' breathing: round A's +6vh felt tight — the
             section breathes at 12vh between every band (the band
             wrappers' leading margins) */
          --ab-band-gap: 12vh;
          /* D1, the burst's reserved seat: full height from FIRST
             paint — the frames' tallest run is 5 lines at the
             library's 1.3 line-height, off the burst's own type (the
             4px border-pair slack retired with the raw frame) */
          --ab-widget-seat: calc(6.5 * var(--ab-burst-type));
          /* C7's separations retired with the timeline (11-04): the
             plate owns the band's one leg directly */
          --ab-b3-gap-plate: 10vh;
          /* C9, the exhale after the plate: the about's bottom gap in
             ADDITION to the 37.5vh tail reservation */
          --ab-bottom-gap: 15vh;
          /* band 1's crimson flash: one-shot ~1.2s after the band's own
             reveal — the band's drop (0.7s) has settled and a beat
             passes, so the crimson lands as a second, deliberate mark
             on the finished plain-ink headline */
          --ab-flash-delay: 1.2s;
          /* D1, the burst's raw print size: 64px — the raw characters
             read at headline scale on the paper (Eliot's opening ask;
             this knob is the single retune point) */
          --ab-burst-type: 64px;
          /* C8, the plate's hug — 20px on every side (round D's bump:
             the brackets' 10px arms + a 4px breath clear the copy) */
          --ab-plate-pad: 20px;
          /* F3, the crawl's tempo: 49.6 weighted steps (with the 2
             closing holds) at 0.1s ≈ 5s/loop. Four anchors hold
             ~0.9s, the two breaths rest ~0.2s, the four pulses flash
             ~0.1s, the two blinks ~0.03s */
          --ab-ascii-step: 0.1s;
          /* B1, the plate's float air: ~8vw inside the strip's edges
             BOTH sides — the band holds it as its padding (the strip's
             own edges come off band 3's margins) */
          --ab-plate-float: 8vw;
        }
        .landing-about * { margin: 0; box-sizing: border-box; }

        /* the bands: one flow box each (the observer targets + the
           spacing spines); bands 2 and 3 lead with the F10 gap — band 1
           leads with the section's F5 spacer instead */
        .landing-about__band { grid-column: 1 / -1; }
        .landing-about__band2, .landing-about__band3 { margin-top: var(--ab-band-gap); }

        /* ── reveal ─────────────────────────────────────────────── */
        /* the rise + flash key off each band's own landing-about__band--on flag
           (F11): the section's .landing-about--in latch no longer fires these */
        /* the plate's entrance is a RISE from below its slot, no opacity read
           (the fade retired): the box prints solid and slides up the rides'
           ease — a forwards-filled transition keeps the arrival composited
           (the site's arrivals ride transitions, not keyframe fades) */
        .landing-about__rise { transform: translateY(14vh); }
        .landing-about__band--on .landing-about__rise {
          transform: none;
          /* the gate fires on the plate's first pixels — the beat rides
             the transition, so the motion starts a fraction of a
             second after the box scrolls into view */
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.4, 1) 0.12s;
        }
        /* reduced motion: the content is content, not the show — show it
           immediately */
        @media (prefers-reduced-motion: reduce) {
          .landing-about__band .landing-about__rise { transform: none; transition: none; }
          .landing-about__band .landing-about__flash { transition: none; }
        }

        /* the nav tool panel is LandingPanel now (a component alongside
           this one) — a fixed column covering every landing stretch beyond
           the first fold; the sticky footer band's CSS (.site-footer__band) pairs
           with it ── */

        /* ── the full-bleed ticker band (three instances, one voice) ──
           the band is a FLOW ROW, FULL BLEED AT BOTH EDGES (Eliot: it
           extends to the page's edge so the read stays good as the
           crimson sidebar slides over it — the marquee runs the full
           viewport, the panel riding on top of its right end as it
           arrives). In-band the marquee leads at zero (the band's own
           wrapper owns the spacing). The drop-into-place read retired
           (11-04): the band seats statically — the shadow's own rail
           wrapper (position relative) anchors its rules, so the host
           carries no transform at all */
        .landing-about__marquee {
          margin-inline: -3.9vw -3.9vw;
          height: var(--ab-marquee-h);
          z-index: 2;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the COMPONENT'S — no overlays */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
        }

        /* band 1's sandwich reads TIGHT: the middle row hugs the leader
           band above it, and the reversed runner hugs the row below (the
           wrapper owns every other gap) */
        /* ── band 1's middle row: headline left, portraits right ─────
           full non-sidebar width via the strip grammar (flush left, flush
           AT the parked panel's edge — the phase-1 bands' settled read);
           the headline keeps the flow's gutter inside */
        .landing-about__band1-mid {
          margin-inline: -3.9vw 20.1vw;
          padding-left: 3.9vw;
          /* the small inset right: the portrait keeps its own breath off
             the parked panel's edge instead of painting over it */
          padding-right: 2.2vw;
          height: var(--ab-band1-mid);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          /* F4, NO column reserve: the head's track ends AT the art's
             left edge — a headline line longer than its track paints
             across the art's left edge ("Developer" may overlap the
             image at the edge); the capture + the driver's edge pair
             gate what actually happens at these metrics */
          column-gap: 0;
          align-items: center;
        }
        /* the headline: shadow-less still (F6 — the shared .grow-head
           class here carries only the type voice; no .grow-head__in
           mount, so the grow shadow ladder never plays on this h2).
           B3 paints the lead phrase fluro green; the one-shot crimson
           flash span stays the headline's only animation */
        .landing-about__band1-head {
          min-width: 0;
          /* the overlapping word reads whole: its ink sits over the
             art's glyphs at the edge */
          position: relative;
          z-index: 1;
        }
        /* B3's fluro lead phrase — and the Jacquard 12 pixel face
           outright (the 2026-11-03 addendum: the same face the past
           track's big words flip to). Weight 400: the face ships no
           bold, and the h2's 700 would synthesize bold and smear the
           glyphs' pixel grid. Round 2 rides its own 76px here (the
           h2's clamp retires for this read — the face's small glyphs
           want the size); the mobile card read reverts to the head's
           clamp below */
        .landing-about__phrase {
          color: ${FLURO};
          font-family: 'Jacquard 12', monospace;
          font-weight: 400;
          font-size: 76px;
        }
        .landing-about__flash {
          /* starts at the headline's own plain ink; when band 1 latches,
             the transition's delay holds the flip ~1.2s — the band's own
             class makes it ONE-SHOT by construction (the flag never
             leaves again) */
          color: ${INK};
          transition: color 0.25s ease-out var(--ab-flash-delay);
        }
        .landing-about__band--on .landing-about__flash { color: ${RED}; }

        /* the portraits: F1 — the frame-style isolation lives on THIS
           instance only, via the parts the library exposes. The phase-2
           driver established the cascade fact in this Chrome (document
           ::part rules beat the shadow's plain .frame rules: the size
           rules landed as written) — these overrides retire the whole
           frame look on this instance: no fluro surface, no ink border,
           no multiply (the glyphs then color straight — ink on the
           page's hatch), no drop-ladder shadow. Round D extended the
           same isolation to the burst widget: the isolation is
           per-instance, consumer-side, no library ask. The spans
           (part="frame") take
           the ink by inheritance and keep their own flip sheet — no
           ::part(frame) rule, the machine's animation is untouched. */
        .landing-about__portraits {
          /* F3, the slower hold lives on the instance's knob */
          --glaphic-ascii-step: var(--ab-ascii-step);
        }
        .landing-about__portraits::part(box) {
          /* F1: the library's frame look retires here (see above) */
          color: ${INK};
          background: none;
          border: none;
          mix-blend-mode: normal;
          box-shadow: none;
          animation: none;
          /* F2: the seat's exact fill — the type is the seat ÷ 55 lines
             (borders gone, no −4 accounting); width is the 100-column
             run (every frame is 100 columns × 55 lines) */
          height: var(--ab-band1-mid);
          font-size: calc(var(--ab-band1-mid) / 55);
          line-height: 1;
          width: 100ch;
          /* centered in its track at the mobile stack (a no-op at the
             desktop auto track) */
          justify-self: center;
        }

        /* ── band 2: the grow headline + the two widget rows ───────── */
        /* the band's content keeps its round-A standoff: the parked
           panel's edge (20.1vw) + ~3vw clear of it — the head's
           right-justified run never kisses the panel */
        .landing-about__band2 {
          margin-inline: 0 var(--ab-band2-inset);
          --ab-band2-inset: calc(20.1vw + 3.1vw);
        }
        /* the band's one row (round F): the burst runs first, the head
           after — the animation sits NEXT TO the grow headline itself;
           C2 keeps the head's right-justified edge. The generic
           .landing-about__row name (the a/b suffix died with the
           second row) */
        .landing-about__row {
          margin-top: 4.4vh;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          column-gap: 2.5vw;
        }
        .landing-about__code-head {
          flex: 1;
          text-align: right;
          /* round E: the cap steps DOWN to 64px — the shared grow's
             70px top read a step heavier than this headline carries.
             The 3.6vh pad-top retired with the head's solo slot: the
             head rides the row's top, the burst beside it */
          font-size: clamp(34px, 4.9vw, 64px);
        }
        .landing-about__widget {
          /* the burst's print size comes off the named var (the
             library's knob channel — an inherited set beats its :host
             default) */
          --glaphic-ascii-type: var(--ab-burst-type);
          /* D1: the raw glyphs carry the grow-head's fading shadow
             print in its first three rungs — 1px 2px 4px, ink trailing
             off the crimson (an inherited property: the host set
             reaches the shadow's glyph spans, which carry no override) */
          text-shadow:
            1px 1px 0 rgba(13, 2, 33, 0.64),
            2px 2px 0 rgba(13, 2, 33, 0.56),
            4px 4px 0 rgba(13, 2, 33, 0.48);
        }
        .landing-about__widget::part(box) {
          /* the reserved seat: --ab-widget-seat = the frames' tallest
             5-line run at the library's 1.3 line-height (the boxes
             hold before, during and after the type) */
          height: var(--ab-widget-seat);
          /* D1: the burst rides RAW — every surface retires on this
             instance: fluro surface, border pair, multiply, the
             drop/shadow ladder; the print is dark crimson straight on
             the page's ground (the portraits' F1 isolation, extended) */
          color: ${RED};
          background: none;
          border: none;
          mix-blend-mode: normal;
          animation: none;
          box-shadow: none;
        }

        /* ── band 3: the chamfered plate ───────────────────────────── */

        /* the band models its strip FIRST (the section's full-bleed
           grammar, the same margins every strip here carries: hard
           left at the viewport's edge, hard right AT the parked panel)
           — the plate is the band's ONE grid cell, so the plate's
           placement is the tracks' and the B1 float lives in the
           band's padding, never in margin arithmetic. An offset read
           is a padding tweak, not a math re-derive */
        .landing-about__band3 {
          margin-inline: -3.9vw 20.1vw;
          padding-top: var(--ab-b3-gap-plate); /* C7: the band's one leg */
          padding-inline: var(--ab-plate-float);
          display: grid;
          grid-template-columns: minmax(0, 1fr);
        }

        /* the chamfered fluro plate: the box paints its OWN flat field
           (the glaphic-plate paint element out — a solid tone needs no
           paint element, the flat read the past copy cell carries; its
           cyan is the module's FLURO constant) and CLIPS two corners;
           the paragraph prints ink on it. No stacking trick: the fill
           is the box's own background, so no -1 z paint child can sink
           under a plain block */
        .landing-about__plate {
          grid-column: 1 / -1;
          position: relative;
          background: ${FLURO};
          /* the two chamfers, at the card's 20px amount: top-left +
             bottom-right, the 45-degree cut the cards carried */
          clip-path: polygon(
            20px 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%,
            0 20px
          );
        }
        /* the brackets (D2): glaphic-corners' drawer braces as a
           paint-only overlay on the plate's box — the host paints
           nothing and never eats clicks (pointer-events none, since
           the overlay spans the plate but the copy must hit-test);
           the corners' own tier-2 knobs stay at the library's drawer
           defaults (1.5px ink Ls, 10px arms) */
        .landing-about__plate-brackets {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .landing-about__plate-copy {
          /* C8: the plate HUGS its copy — the size rides --ab-plate-pad
             (the brackets' arms + a breath clear the run) */
          padding: var(--ab-plate-pad);
          font-size: clamp(12px, 1.18vw, 17px);
          /* round D's wider spacing: the leading steps up and the run
             takes a light tracking — the enclosed read wants the air */
          line-height: 1.85;
          letter-spacing: 0.02em;
          /* print lines past ~70ch stop reading — the plate spans the
             whole non-sidebar width, the copy keeps a book's measure */
          max-width: 72ch;
        }

        /* ── mobile: the three bands stack full-width ─────────────── */
        @media (max-width: 899px) {
          .landing-about {
            height: auto;
            /* the Phase-4 map's about slot (hero -1, band 0, about 1,
               now 2, past 3, tech 4) — re-derived once, here */
            order: 1;
            /* the same F5 spacer math, with the seat recomputed to FIT
               the full-bleed block: the art is 90 columns at the mono
               advance (0.6em, so the fitting type is 54em wide ÷ the
               block), the seat that type spread over its 49 lines; the
               8px slack = 4px of air a side at the centered 90-column
               box — halved with the section-gap retune (11-24: the
               mobile landing's between-section space steps down 50%) */
            --ab-band1-mid: calc((100vw - 8px) / 54 * 49);
            --ab-band-gap: 6vh;
            --ab-b3-gap-plate: 5vh;
            --ab-bottom-gap: 7.5vh;
            padding-top: calc(25vh - (var(--ab-band1-mid) + 2 * var(--ab-marquee-h)) / 4);
          }
          .landing-about__marquee { margin-inline: -6vw; }
          /* band 1's riders in the ONE full-bleed cell: the headline
             rides OVER the art's box (the h2's own z 1 wins the static
             art) — the statements print on separate lines (the head is
             a flex column; the spans' blockification reads them one
             line each), and the pair + the art read one full-width
             block (Eliot 11-04) */
          .landing-about__band1-mid {
            grid-template-columns: 1fr;
            height: auto;
            row-gap: 0;
            margin-top: 18px;
            margin-inline: -6vw;
            /* the base strip's inline pads retire (the strip grammar is
               a desktop span read) — the head insets itself below */
            padding: 0;
          }
          /* the art's box is the cell's SECOND rider — the host rides
             display:contents, so the shadow's box span IS the grid item
             (the host's own grid-area above is a no-box no-op) */
          .landing-about__portraits::part(box) { grid-area: 1 / 1; }
          .landing-about__band1-head,
          .landing-about__portraits { grid-area: 1 / 1; }
          .landing-about__band1-head {
            padding: 0 6vw;
            /* the statements on their own lines */
            display: flex;
            flex-direction: column;
          }
          /* the phrase's 76px is the desktop's read — the card head
             falls back to the h2's clamp */
          .landing-about__phrase {
            font-size: inherit;
            color: ${INK}
          }
          /* the band's content runs the full mobile flow (no panel to
             stand off on mobile) */
          .landing-about__band2 { margin-inline: 0; }
          /* the row stacks on mobile — the TEXT ABOVE the burst (the
             DOM's burst-first column reversed; the head's cap rides
             the desktop clamp as-is) */
          .landing-about__row { flex-direction: column-reverse; align-items: start; row-gap: 10px; }
          /* the strip box + the float air are desktop strip reads — the
             stacked mobile plate rides the flow column again */
          .landing-about__band3 { margin-inline: 0; padding-inline: 0; }
          /* the bands ride above the burst's parallax layer: the
             anchored frame paints at the flow's own level behind them */
          .landing-about__band2, .landing-about__band3 {
            position: relative;
            z-index: 1;
          }
          /* the burst's parallax: the widget's frame escapes the row's
             flex flow and anchors to the flow's content box (spans the
             headline's band and the plate's), sitting mid-lower behind
             both. The seat's type steps down — 44px reads as a layer,
             64px read as a figure. The drift rides --ab-drift (the
             section's driver writes it per scroll frame; static read
             without it) */
          .landing-about__widget {
            --glaphic-ascii-type: 44px;
            pointer-events: none;
          }
          .landing-about__widget::part(box) {
            position: absolute;
            top: 47%;
            left: 0;
            right: 0;
            margin-inline: auto;
            z-index: 0;
            transform: translateY(calc(var(--ab-drift, 0) * 1px));
          }
        }
      `}</style>

      {/* the nav tool panel is LandingPanel (a component alongside this
          one) — it pairs with the sticky footer band */}

      {/* flow grid: the three bands — the WHOLE content rides up on the
          section's exit */}
      <div class="landing-flow" ref={flowRef}>
        {/* ── band 1: the ticker, the headline + portraits row, the
            reversed ticker — the band's own flag gates its drop, the
            flash, and the portraits' cycle (F11) ─────────────────── */}
        <div class={`landing-about__band landing-about__band1 ${in1 ? 'landing-about__band--on' : ''}`} ref={band1Ref}>
          {/* the ticker's words exposed ONCE for the AT tree — the
              marquee halves are aria-hidden decor (the sweep's ink
              complaints against them are visual-text rules), SR reads
              the phrase a single time per section */}
          <span class="sr-only">{TICKER.join(', ')}</span>
          <glaphic-marquee
            ref={marqueeLeadRef}
            class="landing-about__marquee"
            aria-hidden="true"
          />
          {/* the sandwich's middle row: plain ink (F6), no reserve from
              the art (F4) — the phrases print straight from the
              section's ink; the flash span carries the one crimson
              moment */}
          <div class="landing-about__band1-mid">
            <h2 class="landing-about__band1-head grow-head">
              <span class="landing-about__phrase">Trained Poet;</span>{' '}
              <span class="landing-about__flash">Experienced Developer.</span>
            </h2>
            {/* the portraits: F1's own instance look; the frames land
                only once the fetch resolves AND this band fires */}
            <glaphic-ascii
              ref={portraitsRef}
              class="landing-about__portraits"
              label="A cycling ASCII portrait, the keeper's drawn poses"
            />
          </div>
          {/* the reversed runner: same band voice, the track's direction
              rides the component's own `reverse` attribute now (the
              library owns the behavior) */}
          <glaphic-marquee
            ref={marqueeRevRef}
            class="landing-about__marquee"
            reverse
            aria-hidden="true"
          />
        </div>

        {/* ── band 2: the burst beside its grow headline ──────────── */}
        <div class={`landing-about__band landing-about__band2 ${in2 ? 'landing-about__band--on' : ''}`} ref={band2Ref}>
          {/* round F: the burst rides BESIDE the band's grow head (the
              cursor-typed beside-line retired) — the head is B2's
              multiline grow voice: the stepped shadow ladder plays once
              when THIS band's flag lands, the breaks ride \n against
              the head's pre-line, and the h2 itself now carries the
              section's words (the cursor-type's sr-only span left with
              the line) */}
          <div class="landing-about__row">
            <glaphic-ascii
              ref={burstRef}
              class="landing-about__widget"
              role="img"
              label="simple characters: a ship fires a laser, destroying an asteroid."
            />
            {/* the statement, not a header: the band's copy borrows the
                grow treatment, so it prints under the grow-text block
                (the header's mobile bump + fluro field read is not
                its read) */}
            <GrowText
              text={"I've come a long way\nsince cloning asteroids\non my middle school\ngraphing calculator."}
              inView={in2}
              class="landing-about__code-head"
            />
          </div>
        </div>

        {/* ── band 3: the chamfered plate — the band's own flag gates
            the print (F11); the band models the strip, the plate rides
            as its one grid cell ───────────────────────────────────── */}
        <div class={`landing-about__band landing-about__band3 ${in3 ? 'landing-about__band--on' : ''}`} ref={band3Ref}>
          {/* the chamfered fluro plate (B1: the ~8vw float air lives in
              the band's padding — the plate's placement is the band
              grid's tracks): the field is the box's own flat fluro
              fill; the brackets (D2: the library's glaphic-corners
              braces — drawn on the two square corners, the tl/br pair
              being the chamfer's own mark) pin just inside the edges;
              the paragraph prints ink on the field, straight off the
              band's fire */}
          <div class="landing-about__plate landing-about__rise" ref={plateRef}>
            <glaphic-corners class="landing-about__plate-brackets" corners="tr,bl" aria-hidden="true" />
            <p class="landing-about__plate-copy">
              I like to joke that poetry and coding are similar in practice, but it is true: both
              crafts hinge upon collapsing complicated ideas into succinct patterns of symbols. A poet
              folds a singular human experience into as few words as possible. A programmer takes a
              complicated problem and reduces it to (hopefully) comprehensible code. Instead of
              unfolding into emotion, a program ends up as streams of binary running through some
              device's threads. Both too often intimidate the uninitiated.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}