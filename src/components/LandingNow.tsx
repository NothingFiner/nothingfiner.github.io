// New-design landing section four — "What I'm up to." (the now block;
// #now, which the sidebar's nav jumps to). Same layout grammar as the
// sections above it (a 1440x900-artboard section over the paper ground,
// the padded flow grid), carrying both Eliot's 2026-10-30 brief (the
// carousel out, the three project bands in) and that day's round-A
// feedback (the section rebuilt over the bands' photos):
//   header    the chamfered BAND (round E's sizing kept — the block
//             padding read onto the settled height, both top corners
//             cut at the doubled 40px, the bottom edge square). The
//             round-6 pass retires the glaphic-text BLOOM read (the
//             coalescing shadow cloud — round D's reversal — rode the
//             band: the engine itself lives in the library as
//             glaphic-text; the coalesce styling was this section's
//             own, and the bloom-header pattern's full library home
//             rides the backlog note of 2026-11-03). The band is a
//             BARE grey cap now, its heading the AT tree's own (the
//             sr-only "Current Projects."), and the visual title rides
//             the rail under it: a TRANSPARENT band (no fill — the
//             hatch prints through) whose display-face run "Current
//             Projects." sweeps across the band as you scroll — in from
//             the left, out right, one pass a section transit, pure X
//             with the glyphs on the band's midline the whole way
//   bands     Rite · glaphicUI · Novel, 30vh tall at desktop: the LEFT
//             62% is the project's photo, filling the band as one
//             background and chamfered on every edge (the plates' cuts
//             — the clip also scopes the title's difference
//             blend to what sits inside the shot); the title sits OVER
//             it, left justified at the band-height fill size (30vh,
//             stepped down per name by --ln-name-fit so a long run
//             keeps across its photo), blended difference so the photo's
//             inks print through the fill; the crimson line rides
//             the band's vertical middle UNDER the glyphs. The RIGHT 38%
//             is the content block — the copy
//             and the "go to ->" CTA live on it (Rite + glaphicUI only;
//             novel carries none) and slide in from under the photo's
//             edge on the hover (see below), to the project's detail
//             route
//   marquees  the ONE full-bleed ticker bracketing the bands at the
//             section's foot (the header rail's big pixel ticker
//             retired with the title rail taking the title read) —
//             it RIDES the section's own entry with the stack; the
//             strings/speed ride imperatively — JSX attributes can't
//             carry the arrays
//   entry     the strip + bands + marquee + title rail rise into place
//             as one unit; the alternate +/-2deg overshot rotation is
//             RETIRED (round 7: the bars settled tilted)
//   hover     the neutral pose is the CAST: the block rides its mount
//             (the one border panel, ONE thickness and ONE ink — the
//             --ln-border token — moving WITH the block as one unit)
//             between the paren echoes — each echo the plate's own
//             edge on its respective side (the spine plus the image's
//             chamfer cuts, outline-only), three per flank, one echo
//             a step clear of each other, each edge and the rim; the HOVER slides the unit left
//             to the assembled seat (the mount's near rim exits the
//             frame — the border's far side is always there, just
//             off-screen) while the echoes slide out the band's sides
//             they stroke — the left flank on the unit's clock, the
//             right flank on the panel's fan-out — and slide back in
//             on the resting rules' clock; the copy and the CTA, tucked UNDER
//             the machine at rest, WAIT until the trails' last beat,
//             then slide in from the left as if emerging from under
//             the plate's edge, and they tuck away on a short clock
//             when the hover leaves — home under the rim while the
//             return ride is still getting under way (the return runs
//             at half the entry's pace).
//             Pointer devices only — the mobile card stays assembled
// The title's sweep is scroll-linked (the run's driver below) — no
// reveal flag on the section; the riders settle on the rideInUp clock.
//
// COPY (provenance): Rite's band copy is the slide description
// verbatim; glaphicUI's and novel's are the landing's own lines.
import { Fragment } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { projectByTitle } from '../data/projects';
import { rideInUp, rideOutUp } from './landing-shared';

const INK = '#0D0221';
const RED = '#A6022A';
/* the now-title's type ladder — one size down from the bloom's own
   clamp (the round-7 read); the rail's height and the glyphs share it so
   the pair can't drift apart. The face is the display token: Space
   Grotesk, the head face the band names and the grow-head ride */
const HEAD_TYPE = 'clamp(32px, 4.4vw, 64px)';
const FLURO = '#14F1C8';
const PAPER = '#F2F5EB'; // the grow-head's warm white
const PAPER_BRIGHT = '#F9FAF4'; // the CTA recipe's paper

// the CTA's recipe — the --glaphic-button-* token surface at the
// site's inks: ink surface, paper label, fluro hover with the label
// flipping to ink. The rim tokens ride the library's solid defaults,
// which are exactly these two inks as well (ink at rest, fluro on
// hover)
const GO_TO = {
  '--glaphic-button-surface': INK,
  '--glaphic-button-text': PAPER_BRIGHT,
  '--glaphic-button-hover-surface': FLURO,
  '--glaphic-button-hover-text': INK,
  /* the token sheet's spacing ladder rides 9/18 — the labels read
     flush past the chamfer cut; the CTA pins the component's own
     documented md read (12px tall, 24px deep) on every screen */
  '--glaphic-button-md-padding-y': '12px',
  '--glaphic-button-md-padding-x': '24px',
};

// the three bands in the brief's order; the image and the id resolve
// through projectByTitle (a missing title is a data error — the
// lookup throws). cta is the brief's read: novel carries no button
// and no route
const BANDS = [
  {
    title: 'Rite',
    cta: true,
    copy: "First of its kind integrated writing environment.",
  },
  {
    title: 'glaphicUI',
    cta: true,
    copy: 'Personal web component design system using Lit and Storybook. Used to build this portfolio.',
  },
  {
    title: 'Novel',
    cta: false,
    copy: 'Untitled Science Fiction Novel and the impetus behind Rite. About halfway drafted.',
  },
] as const;

// the now block's own ticker strings — the tools and subjects the
// current projects run on (the about/tech sections keep the shared
// TICKER; the section's title itself rides the slide-in rail, not a
// ticker entry)
const NOW_TICKER = [
  'Lit', 'Web Components', 'Rust', 'Open Weights', 'Word Processing',
  'Science Fiction', 'Design System',
];

/* the bands' separator rails — one marquee after every card on mobile,
   each printing its own project's vocabulary line; mid rail runs
   reversed so the three read as a weave. The AT tree carries each
   line once through the rail's own aria read */
const NOW_SEPARATORS: readonly string[] = [
  'rite: rust, tauri, vue, word processing, open weights, integrated writing environment',
  'glaphicUI: design system, lit, storybook, graphic realism, acetate',
  'novel: science fiction, literature, prose, inspiration',
] as const;

// the big name's fit — one advance-width model: a Space Grotesk 700
// glyph runs ~ADVANCE_EM em on average, so a name's run is
// ~ADVANCE_EM x chars em. The default size is the band-height fill
// 26vh; --ln-name-fit steps a long name below it just enough to keep
// its run inside NAME_SHARE of the band's width — the share of the
// photo the title may run across (the shot's 62% minus air) — the
// Projects card's --pc-fit step-down, generalized to the bands. The
// measured pass tunes this pair once
const NAME_SHARE = 58; // the name run's max share of the band (%)
// 0.52 = the measured pass's model (run 1's rendered advances averaged
// ~0.50 em: Rite 0.479 · glaphicUI 0.502 · Novel 0.529) — held above
// the widest so no name's run overshoots its share
const ADVANCE_EM = 0.52; // the model's average glyph advance (em)
const nameFit = (title: string) => (NAME_SHARE / (ADVANCE_EM * title.length)).toFixed(2);

// the paren echo — the image element's own edge on its respective
// side, outline only: a full-height spine one rail thick with a
// fixed svg chamfer band at each end — the cuts sit flush on the
// band's border rails (the stroke runs into them the plate's own
// outline does) — rem-exact under the stretch. The mirror box flips
// the drawing for the right flank so the choreography's transform
// lists stay plain
const bandParen = (
  glyph: 'l1' | 'l2' | 'l3' | 'r1' | 'r2' | 'r3',
) => (
  <span
    class={`landing-now__band-paren landing-now__band-paren--${glyph} landing-now__band-paren--${glyph.charAt(0)}`}
    aria-hidden="true"
  >
    <span class="landing-now__band-paren-inner">
      <span class="landing-now__band-paren-rail" />
      <svg class="landing-now__band-paren-cut landing-now__band-paren-cut--top" viewBox="0 0 23.314 15.314">
        <path d="M12 0 L23.314 0 L8 15.314 L0 12 Z" />
      </svg>
      <svg class="landing-now__band-paren-cut landing-now__band-paren-cut--bottom" viewBox="0 0 23.314 15.314">
        <path d="M12 0 L23.314 0 L8 15.314 L0 12 Z" />
      </svg>
    </span>
  </span>
);

export function LandingNow() {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const sep0Ref = useRef<HTMLElement | null>(null);
  const sep1Ref = useRef<HTMLElement | null>(null);
  const sep2Ref = useRef<HTMLElement | null>(null);
  const [, navigate] = useLocation();

  // the ride-out wiring: the content translates up as the section
  // exits (the sections' idiom), reversing on the way back
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // the ride-in (11-04): the entrance riders — the strips, the title
  // rail, the band, the marquees — scroll-link their settle through
  // rideInUp, replacing the threshold-gated transition that lurched
  // against the about ride-out. The rail rides WITH the stack — a Y
  // pose of its own read as the title breaking from its band
  useEffect(() => {
    const root = flowRef.current;
    const riders = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            '.landing-now__header-strip, .landing-now__title, .landing-now__footer-strip, .landing-now__band, .landing-now__marquee',
          ),
        )
      : [];
    return rideInUp(hostRef, riders);
  }, []);

  // the marquee takes array properties, which JSX attributes can't
  // carry reliably to Lit — set them imperatively (the tools-and-
  // subjects ticker; the section title rides the slide-in rail)
  useEffect(() => {
    const m = marqueeRef.current as unknown as { strings: string[]; speed: number } | null;
    if (!m) return;
    m.strings = NOW_TICKER;
    m.speed = 50;
  }, []);

  // the separators: one project's vocabulary line per rail (the JSX
  // can't carry the strings array), the mid rail reversed in markup
  useEffect(() => {
    const refs = [sep0Ref, sep1Ref, sep2Ref];
    for (let i = 0; i < refs.length; i++) {
      const m = refs[i].current as unknown as { strings: string[]; speed: number } | null;
      if (!m) continue;
      m.strings = [NOW_SEPARATORS[i]];
      m.speed = 50;
    }
  }, []);

  // the title's sweep: the whole phrase lands on the rail exactly as
  // the header strip's bottom edge clears the fold — the entry sprint
  // spans the header's own transit, so the header arrives WITH its
  // phrase (an anchor on the section's top instead let the phrase
  // trail the cap, its run clipped to the tail while the header
  // transited). Past the seat the run continues across the rail and
  // clears the right edge by the lead band's exit (the rides' idiom:
  // scroll-linked, reversible, per-frame inline transform; no
  // transition — one would lag the clock and judder). The rail's grid
  // holds the Y center; the sweep holds pure X
  useEffect(() => {
    const host = hostRef.current;
    const run = host?.querySelector<HTMLElement>('.landing-now__title-run') ?? null;
    const header = host?.querySelector<HTMLElement>('.landing-now__header-strip') ?? null;
    if (!host || !run || !header) return;
    let raf = 0;
    const apply = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // no sweep on the reduce path: the run parked at its seat (the
        // title's real rest state) while the riders park via rideInUp
        run.style.transform = '';
        return;
      }
      const vh = window.innerHeight;
      const top = host.getBoundingClientRect().top;
      /* the entry's anchor, measured per frame rather than kept as a
         constant: the header strip's bottom edge's offset from the
         section's top — its own margin and cap height at every
         viewport */
      const headerOffset = Math.max(1, header.getBoundingClientRect().bottom - top);
      // the section's top the moment the header has just cleared the fold
      const topEntry = vh - headerOffset;
      let pose: number;
      if (top >= vh) {
        pose = -110; // parked out left while the section sits below the fold
      } else if (top > topEntry) {
        // the entry sprint: out-left pose to the seat across the
        // header's own transit — the phrase lands with its cap
        pose = -110 + ((vh - top) / headerOffset) * 110;
      } else {
        // the pass: seat to clear-right across the remaining transit;
        // the exit keeps its timing — about 0.9vh of scroll past the seat
        const passTravel = topEntry + 0.9 * vh;
        const pass = Math.min(1, Math.max(0, (topEntry - top) / passTravel));
        pose = pass * 200;
      }
      /* the pose's share of the run's own box: -110 fully out left,
         zero on the seat (the run at its padding), +200 clear past the
         rail's right edge — no half-glyph clip poses at either end */
      run.style.transform = `translateX(${pose.toFixed(2)}%)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      run.style.transform = '';
    };
  }, []);

  const bands = BANDS.map((band) => ({
    ...band,
    project: projectByTitle(band.title),
    fit: `${nameFit(band.title)}cqw`,
  }));

  return (
    <section
      id="now"
      ref={hostRef}
      class="landing-now"
      style={{ color: INK }}
    >
      <style>{`
        .landing-now {
          /* the borders' shared ink — the mount, the echoes, the band's
             rails and the photo's corner notches all read this var: the
             one knob to try colors on (Eliot 11-04: the furniture goes
             dark #242821 — the strips print as solid ink-dark slabs
             now) */
          --ln-border: #242821;
          /* the image cut: the echoes' own outer chamfer line — the
             miter's 0.75rem leg plus the √2-of-a-rail seat the
             one-rail band adds (the cuts' 1.457rem width) — so the
             image's corner runs the same 45° line the echo bands end
             on, and the mount's rim meets the miter line at the
             border (see the mount's cut) */
          --ln-image-cut: calc(0.75rem + 0.5rem * 1.41421);
          /* the octagon cut, expressed once — the photo's clip and the
             shot's img both read this var: one thickness, one shape,
             at every viewport */
          --ln-octagon: polygon(var(--ln-image-cut) 0, calc(100% - var(--ln-image-cut)) 0, 100% var(--ln-image-cut), 100% calc(100% - var(--ln-image-cut)), calc(100% - var(--ln-image-cut)) 100%, var(--ln-image-cut) 100%, 0 calc(100% - var(--ln-image-cut)), 0 var(--ln-image-cut));
          /* the mount's corner cut — the photo's octagon OFFSET one
             rail outward, never translated: the bevel lands 0.5rem
             perpendicular outside the photo's, a perpendicular offset
             shrinking a cut's legs by the offset's (√2−1) share —
             which leaves miter + rail: the mount's bevel meets the
             band's underside on the echoes' miter line, and the
             photo's own legs here would instead translate the bevel
             0.5rem along the edge (the corner protrusion) */
          --ln-mount-cut: calc(0.75rem + 0.5rem);
          --ln-octagon-mount: polygon(var(--ln-mount-cut) 0, calc(100% - var(--ln-mount-cut)) 0, 100% var(--ln-mount-cut), 100% calc(100% - var(--ln-mount-cut)), calc(100% - var(--ln-mount-cut)) 100%, var(--ln-mount-cut) 100%, 0 calc(100% - var(--ln-mount-cut)), 0 var(--ln-mount-cut));
          /* the paren rhythm: the rest gap divided into the steps —
             the lines stand a step out from each edge, a step apart,
             and the rim a step past the last line, so every gap
             between the echoes, the edges and the mount reads the
             same width; the echo's width: a step's share, leaving
             air between the echoes so none stack against another —
             the end cuts want ~2.2rem of width and scale a step in
             below it (see the cuts' rule) */
          --ln-paren-step: calc((19cqw - 0.5rem) / 4);
          --ln-paren-width: calc(var(--ln-paren-step) * 0.6);
          position: relative;
          height: auto;
          padding-bottom: 20vh;
          overflow: hidden;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .landing-now * { margin: 0; box-sizing: border-box; }

        /* the full non-sidebar flush (the strip grammar): the header
           band + the bands + the marquees hold ONE flush — a full-span
           flow item with negative margins, hard left at the viewport's
           edge, hard right at the parked panel's left edge (the flow's
           3.9vw padding + the panel's 24vw = the 20.1vw right pull).
           The entrance's threshold-gated 14vh hold + transition is
           retired from CSS (11-04): against the about's scroll-linked
           ride-out it read as a discrete lurch at the boundary — the
           riders now scroll-link through rideInUp (landing-shared), the
           reader's own scroll the clock, the marquees INCLUDED
           (round 7: they ride with their own section), settling exactly
           as the section's top reaches the viewport's top, always
           reversible, no transforms parked here */
        .landing-now__header-strip,
        .landing-now__footer-strip,
        .landing-now__band,
        .landing-now__marquee {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
        }

        /* the bloom band: solid ink-dark, the headline centered. The
           block padding rides Eliot's 11-04 read (5vh), the chamfers on
           BOTH top corners the doubled cut (40px); the bottom edge
           rides square */
        .landing-now__header-strip {
          margin-top: 3.6vh;
          display: grid;
          place-items: center;
          padding-block: 5vh;
          /* round 8: the strip is the border-panel's sibling — it reads
             the section's one border token, not a hardcoded twin */
          background: var(--ln-border);
          clip-path: polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%, 0 40px);
        }
        /* the echo band (2026-11-03): the header strip's padding read
           mirrored at the section's bottom — a solid ink-dark band under
           the bottom marquee, no content (it IS the padding structure),
           its chamfers on the two BOTTOM corners while the top edge stays
           square, closing the section the way the header opens it; it
           rides the header-strip's rise (the selector list above) */
        .landing-now__footer-strip {
          padding-block: 5vh;
          /* the header strip's token read (round 8) */
          background: var(--ln-border);
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
        }
        /* the project bands (30vh at desktop) */
        .landing-now__band {
          position: relative;
          height: 30vh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          /* the band is its own inline-size container: the name fit,
             the copy's share and the CTA's inset read off the band's
             own width, so long names scale inside it at every viewport */
          container-type: inline-size;
          /* the rails ride the ONE thickness: with the mount's rim at
             the same cut, the border around the photo reads equal at
             every side */
          border-block: 0.5rem solid var(--ln-border);
          margin-bottom: 0.5rem;
        }
        /* the last bar drops its runner — the bottom ticker sets
           flush against it, matching the ticker's seat at the stack's
           top */
        .landing-now__band:last-of-type {
          margin-bottom: 0;
        }
        /* the photo half: the machine's photo panel — clipped by the
           octagon cut on BOTH sides (the plates' cuts run the whole
           border; the mount behind carries the offset cut one rail
           out, so the notches read grey), the border's ink riding
           every notch; the
           clip also scopes the title's difference blend to what sits
           inside the shot (a clip-path is its own stacking context).
           The machine rides OVER the content block's tucked copy, so it
           takes the top layer */
        .landing-now__band-image {
          position: relative;
          z-index: 2;
          flex: 0 0 62%;
          overflow: hidden;
          clip-path: var(--ln-octagon);
          background-color: var(--ln-border);
        }
        .landing-now__band-image img {
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          clip-path: var(--ln-octagon);
        }
        /* the crimson midline: the stroke riding the band's
           vertical middle — where the fill-size title centers its run —
           under the glyphs (z 1; the title rides at 2) */
        .landing-now__band-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 8rem;
          margin-top: -4rem;
          width: 100%;
          background: ${RED};
          z-index: 1;
          mix-blend-mode: multiply;
        }
        /* the title: difference-blended over the photo (the photo's
           inks print through the fill, inverted — and a third color
           prints where the run crosses the crimson line), left
           justified at the fill size, which fills the band's height
           whole — the em box rides the 30vh band and --ln-name-fit
           steps a long name down to stay across its photo; the ink
           sits inside the em box with measured air (the driver's
           ink-fit check holds) */
        .landing-now__band-name {
          position: absolute;
          inset-block: 0;
          left: 0;
          display: flex;
          align-items: center;
          z-index: 2;
          mix-blend-mode: difference;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: min(30vh, var(--ln-name-fit, 30vh));
          line-height: 1;
          white-space: nowrap;
          color: ${PAPER};
        }
        /* the content half: the copy and the CTA live on the paper
           (the plate's tone retired) */
        .landing-now__band-content {
          position: relative;
          flex: 0 0 38%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          /* the emerged seat: the copy and the CTA rest a padding
             in from the rim when the machine sweeps */
          padding: 2cqw 2.4cqw;
          gap: 2.6vh;
        }
        .landing-now__band-copy {
          font-size: clamp(11px, 1.05vw, 15px);
          line-height: 1.5;
        }
        .landing-now__band-cta {
          position: relative;
        }

        /* the hover cast — the mount + the paren echoes only paint on
           pointer devices (the assembled card never shows them) */
        .landing-now__band-image-border,
        .landing-now__band-paren { display: none; }

        /* the TICKER marquee — the stack's rail at the section's foot,
           riding its section's entry WITH the strips and bands.
           Full-bleed at BOTH edges (the panel rides over the right
           run). The band's padding equation closes rules-off: the pad
           carries the rules' 4px share each side, so the 15px×1.6
           line plus 2×12px pad still lands the 48px strip height */
        .landing-now__marquee {
          grid-column: 1 / -1;
          margin-inline: -3.9vw -3.9vw;
          height: 48px;
          z-index: 2;
          mix-blend-mode: multiply;
          /* the rules are off (the library's documented 0 = off); the
             pad takes their 4px share each side so the interior box
             holds */
          --glaphic-marquee-rule-size: 0px;
          --glaphic-marquee-pad-block: 12px;
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-ink: #242821;
        }

        /* the separators: the cards' rails, MOBILE-ONLY (the desktop
           grid's columnar read has no room for horizontal rails between
           the bands) — parked off the desktop, the shared rail look
           rides below */
        .landing-now__sep {
          display: none;
          grid-column: 1 / -1;
          margin-inline: -3.9vw -3.9vw;
          height: 48px;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 0px;
          --glaphic-marquee-pad-block: 12px;
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-ink: #242821;
        }

        /* ── the title rail ─────────────────────────────────────────
           A TRANSPARENT band under the cap — no fill, the hatch
           prints through it — carrying the section's title the way
           the bloom and the pixel ticker each once did: the header
           type ladder in the display face (--f-disp: Space Grotesk),
           sweeping across the band on the reader's scroll clock — one
           pass a section transit, in from the left, out right past the
           rail's edge (the component's driver holds the X; the rail's
           grid holds the Y center, and the rail itself stays in the
           stack's shared scroll settle). The strip's sr-only heading
           stays the AT tree's heading; this rail is decor */
        .landing-now__title {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          display: grid;
          align-items: center;
          overflow: hidden;
          height: calc(${HEAD_TYPE} * 1.3);
        }
        .landing-now__title-run {
          /* the run rides the flow's own content column (the rail's
             box is the full-bleed strip grammar; the pad aligns it
             with the grid's first track). The X sweep is scroll-
             linked: the component's driver writes the transform per
             scroll frame — no CSS pose here, a transition would lag
             the reader's clock and judder */
          justify-self: start;
          padding-left: 3.9vw;
          font-family: var(--f-disp, 'Space Grotesk', sans-serif);
          font-weight: 700;
          letter-spacing: -0.02em;
          font-size: ${HEAD_TYPE};
          line-height: 1;
          color: #242821;
        }

        /* mobile: the bands become stacked cards (photo title-card,
           copy, CTA — the DOM order reads it in one flex column); the
           order value = the Phase-4 map's now slot (the journey's 3rd
           section) */
        @media (max-width: 899px) {
          .landing-now { height: auto; /* the Phase-4 map's now slot (the journey's 3rd section) */ order: 2; }
          .landing-now__header-strip,
          .landing-now__footer-strip,
          .landing-now__band { margin-inline: -6vw; }
          .landing-now__header-strip { margin-top: 8vh; }
          .landing-now__band { height: auto; flex-direction: column; }
          /* the column's % flex-basis would fight the explicit heights
             (a basis resolves against the column's indefinite height and
             collapses the absolute-only shot to 0): the heights are the
             drivers here */
          .landing-now__band-image { flex: 0 0 auto; height: 52vw; }
          /* the card's photo prints SQUARE — the octagon belongs to the
             desktop machine (the mount's offset cut + the echoes read
             the image's chamfer line); the pointer block below is what
             re-lights the whole cast */
          .landing-now__band-image,
          .landing-now__band-image img { clip-path: none; }
          .landing-now__band-name { font-size: min(24vw, var(--ln-name-fit, 24vw)); }
          .landing-now__band-content { flex: 0 0 auto; padding: 18px 16px; }
          .landing-now__band-copy { font-size: 13px; }
          /* the mobile: the full-bleed rails; the title rides the same
             pull, its type holding the desktop clamp */
          .landing-now__marquee { margin-inline: -6vw; }
          .landing-now__sep { display: block; margin-inline: -6vw; }
          .landing-now__title { margin-inline: -6vw; }
        }

        /* ── the hover choreography (desktop pointer devices) ─────────
           The ASSEMBLED read is the hover; at rest the unit parks
           centered. The unit is the photo and its mount TOGETHER: the
           mount is the one border panel — ONE thickness and ONE ink
           (--ln-border), never fading — riding the SAME transform on
           the SAME clock, its near rim simply exiting the frame at
           the seat. The paren echo lines flank the parking spot —
           each echo the plate's own edge on its side (a spine plus
           the image's chamfer cuts, outline-only), one echo a step
           clear of each other, each edge and the rim, the echoes
           un-stacked with air between them. On
           the hover's cast the echoes die into the outside border
           they hang from — one up into the top border, the next
           down into the bottom, the next up again — the left
           flank on the unit's clock, the right flank from the
           outermost and homing back in that same cadence. The copy and
           the CTA at rest sit tucked entirely outside the content's own
           box (its overflow holds them out under the machine); they
           wait for the trails to be gone, then slide in from the
           left, as if emerging from under the plate's edge. The way
           back runs at HALF the entry's pace — the content takes a
           short slide home ahead of it, and the resting rules carry
           every return. :focus-within pairs with :hover so the
           keyboard reaches the same read */
        @media (min-width: 900px) and (hover: hover) and (pointer: fine) {
          .landing-now__band-image-border,
          .landing-now__band-paren { display: block; }
          /* the mount: the border panel the photo sits on — the
             photo's octagon offset one rail out (--ln-octagon-mount),
             a rim past the photo's edges on both sides, riding the one
             transform with the photo, in the borders' shared ink */
          .landing-now__band-image-border {
            position: absolute;
            inset-block: 0;
            z-index: 2;
            left: -0.5rem;
            width: calc(62cqw + 1rem);
            background: var(--ln-border);
            /* the mount's cut, not the photo's: the photo's own legs
               here would translate the bevel instead of offsetting it
               out one rail */
            clip-path: var(--ln-octagon-mount);
            transform: translateX(19cqw);
            transition: transform 1.3s cubic-bezier(0.25, 1, 0.4, 1);
          }
          .landing-now__band-image {
            transform: translateX(19cqw);
            transition: transform 1.3s cubic-bezier(0.25, 1, 0.4, 1);
          }
          /* the echoes: the plate's edge on its respective side,
             outline only — a full-height spine one rail thick in the
             borders' one ink, each end carrying the image's chamfer
             as a fixed svg band; the resting rules carry the SLOW
             return (the entry's durations doubled), and the right
             trail's cadence rides BOTH ways */
          .landing-now__band-paren {
            position: absolute;
            inset-block: 0;
            width: var(--ln-paren-width);
          }
          /* the mirror box — the whole drawing flips for the right
             flank inside a box that never moves, so the
             choreography's transform lists stay plain */
          .landing-now__band-paren-inner {
            display: block;
            position: absolute;
            inset: 0;
          }
          .landing-now__band-paren--r .landing-now__band-paren-inner {
            transform: scaleX(-1);
          }
          /* the spine: the edge's straight run, stretched to the band
             and lapped into the cuts a hair so the same-color joins
             stay seam-proof */
          .landing-now__band-paren-rail {
            position: absolute;
            left: 0;
            top: calc(0.75rem - 1px);
            bottom: calc(0.75rem - 1px);
            width: 0.5rem;
            background-color: var(--ln-border);
          }
          /* the cuts: the chamfer at each end of the edge stroke — svg
             bands between the plate's outer chamfer line and its
             miter (a 0.75rem leg, one rail thick), each end sitting
             FLUSH on the band's border rail: the stroke runs into the
             rail the plate's own outline does, its seat √2 of a rail
             wide (0.707rem), the handover edge buried in the spine's
             lap. The box is a full chamfer band (1.457rem wide ×
             0.957rem), riding min(full, the echo's width − a step's
             hair) with the aspect held — so the cuts can't cross in
             narrow echoes (the sub-1240px band); at the target widths
             the full piece holds rem-exact */
          .landing-now__band-paren-cut {
            position: absolute;
            left: 0;
            width: min(1.457rem, calc(100% - 0.35rem));
            aspect-ratio: 23.314 / 15.314;
            fill: var(--ln-border);
          }
          .landing-now__band-paren-cut--top { top: 0; }
          .landing-now__band-paren-cut--bottom { bottom: 0; transform: scaleY(-1); }
          .landing-now__band-paren--l1,
          .landing-now__band-paren--l2,
          .landing-now__band-paren--l3 {
            transition: transform 1.3s cubic-bezier(0.25, 1, 0.4, 1);
          }
          .landing-now__band-paren--r1,
          .landing-now__band-paren--r2,
          .landing-now__band-paren--r3 {
            transition: transform 0.7s cubic-bezier(0.5, 0, 0.75, 0.6);
          }
          /* the right flank's homecoming rides the same cadence it
             left with — each echo's resting clock carries its own
             beat, the outermost first */
          .landing-now__band-paren--r2 {
            transition: transform 0.7s cubic-bezier(0.5, 0, 0.75, 0.6) 0.02s;
          }
          .landing-now__band-paren--r1 {
            transition: transform 0.7s cubic-bezier(0.5, 0, 0.75, 0.6) 0.04s;
          }
          /* the rhythm: the lines ladder down the flank — a step out
             from the edge, a step apart, a shy step off the mount,
             so every gap between the echoes, the edges and the mount
             reads the same width */
          .landing-now__band-paren--l1 { left: calc(var(--ln-paren-step) * 3 - 0.25rem); }
          .landing-now__band-paren--l2 { left: calc(var(--ln-paren-step) * 2 - 0.25rem); }
          .landing-now__band-paren--l3 { left: calc(var(--ln-paren-step) - 0.25rem); }
          .landing-now__band-paren--r1 { right: calc(var(--ln-paren-step) * 3 - 0.25rem); }
          .landing-now__band-paren--r2 { right: calc(var(--ln-paren-step) * 2 - 0.25rem); }
          .landing-now__band-paren--r3 { right: calc(var(--ln-paren-step) - 0.25rem); }
          /* the emergence: the copy and the CTA at rest sit tucked deep
             under-left of the content's own box — the block holds its
             overflow at the pointer widths, so the tucked content sits
             entirely OUTSIDE its box and cannot peek however the
             machine sweeps (the hide is the box's own clip, not the
             machine's cover); they slide in from the left on their
             delayed clock, and the resting rules carry a SHORT tuck —
             the exit is a quick slide home under the returning rim,
             not a vanish */
          .landing-now__band-content {
            overflow: hidden;
          }
          .landing-now__band-copy,
          .landing-now__band-cta {
            transform: translateX(-38cqw);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          /* ── the hover: the entry's pace and the echoes' cadences
             ride the hover side ── */
          .landing-now__band:hover .landing-now__band-image,
          .landing-now__band:hover .landing-now__band-image-border,
          .landing-now__band:focus-within .landing-now__band-image,
          .landing-now__band:focus-within .landing-now__band-image-border {
            transform: translateX(-0.5rem);
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1);
          }
          /* the exit: the echo slides out the band's side it strokes —
             the whole piece clears its own offset (the box, then a
             step to spare; the band's overflow clips the pass), the
             left flank on the unit's clock */
          .landing-now__band:hover .landing-now__band-paren--l1,
          .landing-now__band:focus-within .landing-now__band-paren--l1 {
            transform: translateX(calc(var(--ln-paren-step) * -4));
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1);
          }
          .landing-now__band:hover .landing-now__band-paren--l2,
          .landing-now__band:focus-within .landing-now__band-paren--l2 {
            transform: translateX(calc(var(--ln-paren-step) * -3));
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1) 0.02s;
          }
          .landing-now__band:hover .landing-now__band-paren--l3,
          .landing-now__band:focus-within .landing-now__band-paren--l3 {
            transform: translateX(calc(var(--ln-paren-step) * -2));
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1) 0.04s;
          }
          /* the right flank's exit rides the panel's fan-out curve;
             the delays ride the hover so the homecoming can
             carry its own */
          .landing-now__band:hover .landing-now__band-paren--r1,
          .landing-now__band:focus-within .landing-now__band-paren--r1 {
            transform: translateX(calc(var(--ln-paren-step) * 4));
            transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0.6) 0.04s;
          }
          .landing-now__band:hover .landing-now__band-paren--r2,
          .landing-now__band:focus-within .landing-now__band-paren--r2 {
            transform: translateX(calc(var(--ln-paren-step) * 3));
            transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0.6) 0.02s;
          }
          .landing-now__band:hover .landing-now__band-paren--r3,
          .landing-now__band:focus-within .landing-now__band-paren--r3 {
            transform: translateX(calc(var(--ln-paren-step) * 2));
            transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0.6);
          }
          /* the emergence: the copy and the CTA slide from under the
             machine's rim — but only past the trails' last beat: the
             delay parks the tuck through the echoes' flight, then
             they slide in from the left converging with the unit's
             last stretch. The way back is the resting clock's short
             tuck above */
          .landing-now__band:hover .landing-now__band-copy,
          .landing-now__band:hover .landing-now__band-cta,
          .landing-now__band:focus-within .landing-now__band-copy,
          .landing-now__band:focus-within .landing-now__band-cta {
            transform: translateX(0);
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1) 0.35s;
          }
        }
        /* the reduce path: every ride applies instantly, both ways */
        @media (min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: reduce) {
          .landing-now__band-image,
          .landing-now__band-image-border,
          .landing-now__band-paren,
          .landing-now__band-copy,
          .landing-now__band-cta { transition: none; }
        }
      `}</style>

      <div class="landing-flow" ref={flowRef}>
        {/* the chamfered cap band — the bloom read retired (round 6):
            the band is bare grey; the section's real heading rides the
            AT tree (the sr-only read) */}
        <h2 class="landing-now__header-strip">
          <span class="sr-only">Current Projects.</span>
        </h2>

        {/* the now title rail (aria-hidden: the AT tree's heading is
            the strip's sr-only read); it rides the stack's shared
            scroll settle, the run's sweep across it scroll-linked */}
        <div class="landing-now__title" aria-hidden="true">
          <span class="landing-now__title-run">Current Projects.</span>
        </div>

        {bands.map((band, i) => (
          <Fragment key={band.title}>
            <article
              class="landing-now__band"
              style={{ '--ln-name-fit': band.fit }}
            >
              {/* the mount paints FIRST (it rides under the block): the
                  equal-chamfer border the neutral block sits on */}
              <span class="landing-now__band-image-border" aria-hidden="true"></span>
              {/* the paren echoes flank the unit — the plate's own
                  edge on the respective side, outline only (a spine
                  with the image's chamfer cuts sitting flush on the
                  band's rails at both ends), one
                  echo a step clear of the next. On the unit's cast
                  the echoes slide out the band's sides — the left on
                  the unit's clock, the right on the panel's fan-out —
                  and slide home in the same cadence */}
              {bandParen('l3')}
              {bandParen('l2')}
              {bandParen('l1')}
              {/* the photo half — the title over it, the line under
                  the title's glyphs */}
              <div class="landing-now__band-image">
                <img src={band.project.image} alt={band.project.title} loading="lazy" />
                <span class="landing-now__band-line" aria-hidden="true" />
                <h3 class="landing-now__band-name">{band.project.title}</h3>
              </div>
              {/* the content half — the copy and the CTA sit tucked
                  under the machine at rest and slide in from the left
                  on the hover's clock (the half is the emergence's
                  backdrop) */}
              {bandParen('r1')}
              {bandParen('r2')}
              {bandParen('r3')}
              <div class="landing-now__band-content">
                <p class="landing-now__band-copy">
                  {band.copy}
                </p>
                {band.cta && (
                  <glaphic-button
                    class="landing-now__band-cta"
                    variant="solid"
                    chamfered
                    style={{ ...GO_TO }}
                    onClick={() => navigate('/projects/' + band.project.id)}
                  >
                    {'go to ->'}
                  </glaphic-button>
                )}
              </div>
            </article>
            {/* the band's separator rail — its own project's vocabulary
                line (the effect sets the strings); mobile-only, the mid
                rail reversed for the weave */}
            {i === 0 && (
              <glaphic-marquee class="landing-now__sep" aria-hidden="true" ref={sep0Ref} />
            )}
            {i === 1 && (
              <glaphic-marquee class="landing-now__sep" aria-hidden="true" reverse ref={sep1Ref} />
            )}
            {i === 2 && (
              <glaphic-marquee class="landing-now__sep" aria-hidden="true" ref={sep2Ref} />
            )}
          </Fragment>
        ))}
        {/* the ticker's words, once for the AT tree (the marquee is
            aria-hidden decor) */}
        <span class="sr-only">{NOW_TICKER.join(', ')}</span>
        <glaphic-marquee
          class="landing-now__marquee"
          aria-hidden="true"
          ref={marqueeRef}
        />

        {/* the echo band: the header strip's twin — bare, its chamfers
            on the bottom corners (the style block owns the read) */}
        <div class="landing-now__footer-strip" aria-hidden="true" />
      </div>
    </section>
  );
}