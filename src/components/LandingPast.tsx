// New-design landing section — "Past Work." (the past block; #past, the
// sidebar's fourth target). The 2026-11-03 remodel retires the two
// side-by-side category bands on DESKTOP for a three-column track
// between two marquees (the now section's ticker-rail idiom); the same
// day's round-2 feedback amends the drawer and the title's read:
//   track     [copy | photo] [the title] [photo | copy] — the LEFT tray
//             flush with the screen's edge (Forever 21's storefront,
//             the E-Commerce tray), the RIGHT flush at the parked panel
//             (Batesville, the Custom Application Development tray)
//   title     the middle column: the big words on separate lines at
//             ONE shared size, framed by crimson rules above, between
//             and below — the round-5 borders: 15px, brought tighter
//             to the words (round 2's marquee-rail 4px and the 1.8vh
//             gap retire). The round-6 read: the FLICK DIES — the
//             faces are furniture — 'A' in PAST and 'R' in WORK wear
//             the 'Jacquard 12' pixel face PERMANENTLY, at the sans
//             caps (the scale = the measured caps ratio 1.305 = 0.745
//             over 0.571, the driver's canvas metrics; the translate
//             caps-tops them — −0.2195em at the 0.92 read, round 7's
//             baseline-line derivation) inside pinned cells the width
//             of the scaled ink (the A's 0.87em, the R's 0.932em), so no
//             letter's
//             box ever re-reads; the sans letters stay plain tracked
//             text. The pixel cell's footprint eats ~2.5cqw of
//             WORK's run, so the size steps to 9.0cqw (the tips stand
//             clear at ~14px air a side). The title is
//             ARIA-HIDDEN decor — the section's real heading is the
//             sr-only h2 before the flow grid (the mobile card read
//             shows the grow head, so the hidden one steps aside there)
//   trays     the DRAWER read (round 2: the zoom is out): the copy
//             plate is ATTACHED to the photo — the unit parks HALF OUT
//             (the photo's cell showing, the plate beyond the track's
//             screen-side edge, clipped by the track's own overflow)
//             and the HOVER slides the whole unit one half across the
//             middle: the photo arrives flush between the seam bands
//             (the middle column is COVERED, not moved — the transform
//             is rigid, the photo's box never changes, no re-crop), and
//             the plate lands on the tray's own screen side — the left
//             tray's plate enters at the viewport's left edge, the
//             right tray's emerges from under the parked panel. The
//             copy is the category's responsibilities (the D7 members)
//             — the round-6 read: a LITTLE copy, two lines a member
//             (the /past route carries the full
//             plates), the plate enclosed in the library's
//             glaphic-corners braces (all the cell's corners are
//             square, so the braces run all four; paint-only, the copy
//             still hit-tests). The way back runs at HALF the entry's pace
//             (the now bands' choreography grammar). Pointer devices
//             only; a tray carries no CTA, so the open has no keyboard
//             pairing — the /past route (the see-all below) carries the
//             same content
//   bands     the two crimson VERTICAL BANDS — the track's own seam
//             spines, FIXED at the middle column's two edges
//             (aria-hidden, pointer-events none: the hovers fall
//             through to the trays): the categories label them and they
//             never ride the drawers — the tray units pass BENEATH
//             them (the bands stay where they are, the parts move
//             through them). The left band's label reads UP (mirrored,
//             each band reads away from the middle), the right's reads
//             down
//   marquees  the pair bracketing the track; the LOWER one rides the
//             component's reverse attribute (the about band's
//             precedent — the library owns the direction) so the two
//             rails scroll OPPOSITE. No ride of their own (the now
//             marquees' read — the borders are there before and after
//             the track's rise)
//   entry     the track rises into place on the latched arrival (the
//             sections' -64% gate idiom); the see-all CTA (D11's one
//             voice) rides the section's foot to /past
// Mobile (899px and down) keeps the pre-remodel card read: the grow
// head, ONE ticker, the stacked card trays (the photo, its blended
// category name over it, the copy plate under it) — the tray copy plate
// prints its desktop paper fill as the mobile fluro plate there.
import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { GrowHead } from './GrowHead';
import { pastWorkByTag } from '../data/pastWork';
import type { PastWork } from '../data/pastWork';
import { rideOutUp } from './landing-shared';

const INK = '#0D0221';
const PAPER = '#F2F5EB'; // the copy plate's paper (the grow head's warm white)
const COPY_PAPER = '#E9EDE0'; // the copy cell's own fill — the flat read replacing the glaphic-plate (Eliot 11-04)
const RED = '#A6022A'; // the marquees' + the seam bands' + the title frame's shared crimson

// the CTA recipe — D11's ONE voice: the same glaphic-button token
// surface LandingNow's go-to buttons carry (ink surface, paper label,
// fluro hover). A per-module copy by design: the abstraction factors on
// the third use
const GO_TO = {
  '--glaphic-button-surface': INK,
  '--glaphic-button-text': '#F9FAF4',
  '--glaphic-button-hover-surface': '#14F1C8',
  '--glaphic-button-hover-text': INK,
  /* the token sheet's spacing ladder rides 9/18 — the labels read
     flush past the chamfer cut; the CTA pins the component's own
     documented md read (12px tall, 24px deep) on every screen */
  '--glaphic-button-md-padding-y': '12px',
  '--glaphic-button-md-padding-x': '24px',
};

// the category mapping (the D7 default, unchanged): each tray lists its
// members' tags in print order; the head entry's main image is the
// tray's photo. The LEFT tray is E-Commerce, the RIGHT is Custom
// Application Development — the tray's index decides its side
const CATEGORIES = [
  { name: 'E\u2011Commerce', tags: ['forever_21', 'reformation', 'brooks_brothers'] },
  { name: 'Custom Application Development', tags: ['batesville'] },
] as const;

// the flick dies (round 6): the faces become FURNITURE — 'A' in PAST
// and 'R' in WORK wear 'Jacquard 12' permanently, at the sans caps, in
// pinned cells (the letter's rule); the flip clock's constants, the
// letter refs and the toggling effect retire with it

// the title's shared size (the round-6 equalize at WORK's second
// step): one size, one face, one tracking both words — the pixel
// letters' pinned cells eat ~2.5cqw of the run (the R's scaled advance
// 0.932em rides over its 0.667 sans advance, the driver's measured),
// so the size steps 9.5 → 9.0 to keep the tips clear of the seam bands
// (the run 3.409em × the em ≈ 336px in the middle's ~365px — ~14px
// air a side)
const WORD_SIZE = 'min(9.0cqw, 22vh)';

// the past block's own ticker strings — the practice areas under the
// title (Eliot's list; the E-Commerce run keeps the non-breaking hyphen
// the category names already print, so the track never splits it). Both
// rails carry the list: the pair brackets the tray track
const PAST_TICKER = ['Agency', 'E\u2011Commerce', 'React', 'Custom Applications', 'Web Stores', 'Plugin Integration'];

/* the tray's plate: the members' copy verbatim — one component because
   the two trays' DOM order differs (the left tray leads its plate —
   the piece that emerges from the screen's own side; the right's photo
   leads). The plate paints only on the mobile card; the desktop read
   is the paper fill itself. The round-6 read: a LITTLE copy — two
   lines a member (the /past route carries the full plates) — so the
   plate never crowds its cell, and the
   library's glaphic-corners braces enclose it (all the cell's corners
   are square, so the braces run all four) */
function TrayCopy(props: { works: readonly PastWork[] }) {
  return (
    <div class="landing-past__copy">
      <glaphic-corners class="landing-past__copy-brackets" corners="tl,tr,bl,br" aria-hidden="true" />
      <div class="landing-past__copy-body">
        {props.works.map((work) => (
          <Fragment key={work.tag}>
            <b class="landing-past__band-member">{work.name}</b>
            <ul class="landing-past__band-bullets">
              {work.responsibilities.slice(0, 2).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function LandingPast() {
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const marqueeTopRef = useRef<HTMLElement | null>(null);
  const marqueeBottomRef = useRef<HTMLElement | null>(null);
  const marqueeBetweenRef = useRef<HTMLElement | null>(null);
  const [, navigate] = useLocation();

  // the ride-out wiring: the content translates up as the section
  // exits (the sections' idiom), reversing on the way back
  useEffect(() => rideOutUp(hostRef, flowRef, 0.5), []);

  // both marquees take array properties, which JSX attributes can't
  // carry reliably to Lit — set them imperatively once (the
  // sections'-marquee precedent; the pace is LandingNow's slower 50).
  // The lower rail's direction rides the breakpoint: the desktop's
  // two-rail bracket runs it reversed, the mobile's three-rail weave
  // runs it forward (fwd / rev / fwd around the two card trays)
  useEffect(() => {
    const marquees = [marqueeTopRef, marqueeBottomRef, marqueeBetweenRef];
    for (const ref of marquees) {
      const el = ref.current as unknown as { strings: string[]; speed: number } | null;
      if (!el) continue;
      el.strings = PAST_TICKER;
      el.speed = 50;
    }
    const narrow = window.matchMedia('(max-width: 899px)');
    const setRide = () => {
      const bottom = marqueeBottomRef.current as unknown as { reverse: boolean } | null;
      if (bottom) bottom.reverse = !narrow.matches;
    };
    setRide();
    narrow.addEventListener('change', setRide);
    return () => narrow.removeEventListener('change', setRide);
  }, []);

  // the section's own arrival latch — the LATCHED idiom: this one means
  // once, the disconnect in the callback is its whole point (the
  // sections' sticky reveal; the past flag does NOT replay — the now
  // section's two-way ride is that section's own signature). The -64%
  // band is the site's section-arrival gate: the top must reach the
  // viewport's upper 36% (earlier gates failed in both directions —
  // the plain 25% threshold fired ~550px deep)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -64% 0px' },
    );
    const host = hostRef.current;
    if (host) io.observe(host);
    return () => io.disconnect();
  }, []);

  const trays = CATEGORIES.map((cat, i) => {
    const works = cat.tags.map((t) => pastWorkByTag(t));
    return {
      name: cat.name,
      band: cat.name.toLowerCase(), // the seam band's label, as briefed
      side: i === 0 ? 'left' : 'right',
      works,
      image: works[0].image,
    };
  });

  return (
    <section
      id="past"
      ref={hostRef}
      class={`landing-past ${inView ? 'landing-past--in' : ''}`}
      style={{ color: INK }}
    >
      <style>{`
        .landing-past {
          position: relative;
          height: auto;
          /* the tail reserves the sticky band's page-end slot; the 8vh
             exhale keeps the see-all clear of the landing's rest read */
          padding-bottom: 20vh;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
        }
        .landing-past * { margin: 0; box-sizing: border-box; }

        /* the grow head is a mobile piece — the desktop's title hangs
           in the track's middle */
        .landing-past__head { display: none; }

        /* the two ticker rails: full-bleed non-sidebar flush, no ride —
           the now marquees' read (the borders are there before and
           after the track's rise). The LOWER rail's track runs reversed
           (the component's reverse attribute — the about band's D1
           precedent) */
        .landing-past__marquee {
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          margin-top: 3vh;
          height: 48px;
          mix-blend-mode: multiply;
          --glaphic-marquee-rule-size: 4px; /* the rules are the component's */
          --glaphic-marquee-text-size: 15px;
          --glaphic-marquee-pad-block: 8px;
          --glaphic-marquee-rule-ink: ${RED};
          --glaphic-marquee-ink: ${RED};
        }
        /* the lower rail closes on the track (the top rail's 3vh is the
           head slot's air, not rail spacing) */
        .landing-past__marquee--bottom { margin-top: 0; }
        /* the tray separator: MOBILE-ONLY — parked off the desktop's
           drawer track entirely (a grid child display:none takes no
           track) */
        .landing-past__marquee--between { display: none; }

        /* the track: the three columns' plate — flush left at the
           viewport's edge, flush right at the parked panel (the strip
           grammar). Its own overflow clips the DRAWERS' parked halves:
           a plate beyond the track's screen-side edge is held there.
           It is its own inline-size container: the trays', the seam
           bands' and the title's sizes read off the TRACK, not the
           viewport. The threshold-gated arrival ride retired (11-06):
           the marquees and their strip seat statically — with the
           marquees' print-in dead everywhere, the track's was the one
           ride left, and it went too */
        .landing-past__track {
          position: relative;
          grid-column: 1 / -1;
          margin-inline: -3.9vw 20.1vw;
          height: 52vh;
          container-type: inline-size;
          overflow: hidden;
          /* the seam spines' own width, shared: the braces' seam-side
             seat reads the same value, so the two stay kiss-locked at
             every width (the band's clamp pins past ~2017px, a hard
             3cqw brace would drift) */
          --lp-band-w: clamp(30px, 3cqw, 46px);
        }

        /* the middle column: the track's own title — the big words on
           separate lines at the shared size (the module's WORD_SIZE
           note), framed by the crimson rules above, between and below
           (the round-5 borders: 15px, the gap tightened; the frame
           runs the column between the seam bands). ARIA-HIDDEN
           decor: the section's real heading is the sr-only h2 before
           the flow grid */
        .landing-past__center {
          position: absolute;
          inset: 0 33.333cqw;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          /* the round-5 border-tightening: the 15px rules hold close
             to both words (the round-2 1.8vh read retires) */
          gap: 1vh;
          text-align: center;
        }
        .landing-past__rule {
          display: block;
          align-self: stretch;
          /* the round-5 border weight (the round-2 marquee-rail 4px
             retires — Eliot's ~15px) */
          height: 15px;
          background: ${RED};
        }
        /* the title's words — ONE rule, one line-height model, one size
           (the round-5/6 equalize; line-height 0.92 is the seat the
           pixel letter's translate reads — the 0.72em box top below).
           The words are ARIA-HIDDEN decor: the section's real heading
           is the sr-only h2 before the flow grid */
        .landing-past__word {
          display: block;
          white-space: nowrap;
          font-family: var(--f-body, 'Plus Jakarta Sans', sans-serif);
          font-weight: 800;
          font-size: ${WORD_SIZE};
          line-height: 0.92;
          letter-spacing: -0.03em;
        }
        /* the pixel letters' PINNED cells — the round-6 furniture:
           static, so only the two letters wearing the face carry a pin
           (the sans letters stay plain tracked text; the flick's whole
           flex machinery retires with its clock) */
        .landing-past__letter {
          display: inline-block;
          text-align: center;
        }
        /* the pixel letter: 'Jacquard 12' at the SANS caps: the scale =
           the measured caps ratio inverted (0.745/0.571, the driver's
           canvas metrics), the translate = the baseline-line seat (the
           rule's own note holds the derivation). Weight 400 stays its
           own guard: the face ships no bold (the word's 800 would
           synthesize and smear the pixel grid). The pin = the ink's
           footprint — the scaled advance, so the neighbors never sit
           under the pixel ink: the A 0.667em → 0.87em, the R
           0.7143 → 0.932em (the driver's measured advances × the
           caps ratio) */
        .landing-past__letter--pixel {
          font-family: 'Jacquard 12', monospace;
          font-weight: 400;
          /* the caps-matched seat, static. The flick's −0.069em was the
             flex-row read (items sat on the row's top edge); in the
             word's own line the span rides the BASELINE: box top =
             baseline − (line-ascent + half-leading) = −0.72em, the ink
             starts 0.149em into it and scales to 0.1945em at 1.305, so
             caps-top (0.745em up) needs −0.2195em — the flash-era
             constant sat the glyph ~0.15em low (range-rects measured,
             2026-11-03) */
          transform: translateY(-0.2195em) scale(1.305);
          transform-origin: top;
          width: 0.87em;
        }
        /* the R's own footprint (the wider advance, scaled): and the
           11-06 pair pulls (the user's kerning read) — the pinned
           advances sit symmetric boxes, but the eye reads the P/A and
           O/R pairs loose, so the a rides 6px left off the P and the r
           9px left off the O; the pinned widths keep each letter's
           OUTBOARD gap untouched (the S and the K ride with the pulled
           inks) */
        .landing-past__word:not(.landing-past__word--work) .landing-past__letter--pixel {
          margin-left: -6px;
        }
        .landing-past__word--work .landing-past__letter--pixel {
          width: 0.932em;
          margin-left: -9px;
        }

        /* a tray: the drawer unit — [copy | photo] or [photo | copy],
           TWO cells wide, absolutely positioned at its screen side.
           The photo's box is FIXED (flex-basis 50% of the unit for
           every state: the resting cover crop never re-reads — the
           zoom is out); the HOVER slides the WHOLE rigid unit a half
           PLUS the track's own negative margin (the round-6 pose): the
           photo's cell arrives EXACTLY on the title's strip (the
           covered middle — the 0 read had it a track-margin short, the
           plate's text cut at the viewport's edge), the plate lands on
           the screen's own side, its padding clear of the seam band's
           pass-over */
        .landing-past__tray {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 66.666cqw;
          z-index: 2;
          display: flex;
          align-items: stretch;
        }
        .landing-past__tray--left { left: 0; }
        .landing-past__tray--right { right: 0; }

        /* the photo: cover-filled at its fixed cell */
        .landing-past__shot {
          position: relative;
          flex: 0 0 50%;
          min-width: 0;
        }
        .landing-past__shot img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .landing-past__tray--left .landing-past__shot img { object-position: left center; }
        .landing-past__tray--right .landing-past__shot img { object-position: right center; }

        /* the blended category name — the MOBILE card's name over the
           photo (the desktop tray labels its category on the seam
           band; the blended read retired there with the side-by-side
           bands) */
        .landing-past__band-name { display: none; }

        /* the seam bands: the track's own fixed crimson spines at the
           middle's two edges, FULL height — the categories' labels,
           where they were, while the drawers pass beneath them (the
           bands' z sits over the trays). Pointer events fall through:
           the hovers hit the trays' boxes under the bands (the bands
           are decor, aria-hidden in the markup) */
        .landing-past__side-band {
          position: absolute;
          top: 0;
          bottom: 0;
          width: var(--lp-band-w);
          z-index: 3;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          background: ${RED};
          color: ${PAPER};
          font-weight: 700;
          font-size: clamp(10px, 1.8vh, 16px);
          letter-spacing: 0.14em;
        }
        /* the left spine's right edge sits ON the middle's left seam
           (its label mirrored to read up); the right spine's left edge
           sits on the middle's right seam (its label reads down) */
        .landing-past__side-band--left {
          left: 33.333cqw;
          transform: translateX(-100%) rotate(180deg);
        }
        .landing-past__side-band--right { left: 66.666cqw; }

        /* the tray's plate: the paper read that lands with its photo —
           the members verbatim. On the mobile card the plate paints
           over the paper (the fluro read returns there) */
        .landing-past__copy {
          position: relative;
          flex: 0 0 50%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1vh;
          /* the plate's air: a step under the section's default gaps —
             the E-Commerce plate carries the pair's densest content (12
             bullets) and the drawer's half-cell is its whole
             seat at every desktop width: the type ladder below is
             tuned to the tight plate, the driver's scrollHeight check
             holds it. The round-6 band-clearance pads live in the pose
             block above (they ARE open-seat geometry — the pass-over
             of the crimson spines); this base stays the block air and
             the out-side step */
          padding: 2vh 3.6cqw;
          background: ${COPY_PAPER};
          overflow: hidden;
        }
        /* the copy's round-6 brackets: the corners' drawer braces around
           the copy cell — paint-only (pointer-events none: the copy must
           hit-test), the library's drawer defaults' knobs (1.5px ink
           Ls, 10px arms) */
        .landing-past__copy-brackets {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .landing-past__copy-body { display: flex; flex-direction: column; gap: 1vh; }
        /* the member label: the entry's name leads its bullets in the
           mono label voice — crimson on the desktop paper, ink on the
           mobile fluro plate (the mobile block restores the read) */
        .landing-past__band-member {
          color: ${RED};
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        /* the responsibilities, verbatim: the list voice rides the
           plate's tight ladder (the half-cell's seat — see the copy
           panel's note) */
        .landing-past__band-bullets {
          padding-left: 14px;
          font-size: clamp(9px, 0.8vw, 12px);
          line-height: 1.4;
        }

        /* the see-all CTA (D11's one voice) — the crimson plate retired
           (11-04): the multiply could reach the hatch, but at this ink's
           luminance the lines read no brighter through the slab than
           the solid fill did — the plate earned nothing, so the band
           dies with its experiment. The plain CTA seats itself at the
           section's content edge, standing off the lower rail */
        .landing-past__see-all {
          grid-column: 1 / -1;
          margin-top: 4.2vh;
          justify-self: start;
        }

        /* ── the drawer (the desktop pointer read) ────────────────────
           The unit parks HALF OUT — the photo sits its cell, the plate
           beyond the track's screen-side edge (the track's own
           overflow holds it there; the 1px tucks the park's seam behind
           the clip); the HOVER rides the park's half EXACTLY back —
           round 7: the open seat IS the unit's own two-column home,
           photo's cell = the middle strip, plate = its own column,
           NOTHING past either (the round-6 half-plus-margin overshoot
           rode the whole drawer a third of a column past its boundary —
           measured: the open unit spanned 786px against the home's
           729.6). Both directions run the entry's one pace — the
           return riding the resting rules at the hover's read, the
           drawer reading as one gesture, not two clocks */
        @media (min-width: 900px) and (hover: hover) and (pointer: fine) {
          .landing-past__tray--left {
            transform: translateX(calc(-50% - 1px));
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1);
          }
          .landing-past__tray--right {
            transform: translateX(calc(50% + 1px));
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1);
          }
          /* the open seat: the park's half rides back exactly — the
             unit's own two-column home */
          .landing-past__tray--left:hover,
          .landing-past__tray--right:hover {
            transition: transform 0.65s cubic-bezier(0.25, 1, 0.4, 1);
          }
          .landing-past__tray--left:hover { transform: translateX(0); }
          .landing-past__tray--right:hover { transform: translateX(0); }
          /* the open seat's IN-SIDE air: at this seat the plate's
             seam-side edge sits ON the seam and the crimson band rides
             over the plate's in-side 3cqw — the pad clears the band's
             OUTER edge (3cqw) plus air (1.2cqw; with the round-6
             overshoot the old in-side read put the ink ~33px under the
             band — range-rects measured). The seat block owns the
             pads: the plate is only visible here */
          .landing-past__tray--left .landing-past__copy { padding-inline-end: 4.2cqw; }
          .landing-past__tray--right .landing-past__copy { padding-inline-start: 4.2cqw; }
          /* the corner braces ride the SAME safe frame (11-06): the
             brace's seam-side corners painted at the plate's edge —
             under the band's pass-over — and read cut off at the open
             seat. They now sit ON the band's outer edge — the same
             zero-gap the screen-side braces keep to the page's edge,
             the band reading as the frame's own edge there; the var
             keeps the seat kiss-locked to the band at every width */
          .landing-past__tray--left .landing-past__copy-brackets { inset: 0 var(--lp-band-w) 0 0; }
          .landing-past__tray--right .landing-past__copy-brackets { inset: 0 0 0 var(--lp-band-w); }
        }
        /* the reduce path: every ride applies instantly, both ways */
        @media (min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: reduce) {
          .landing-past__tray { transition: none; }
        }

        /* mobile: the pre-remodel card read — the grow head, ONE
           ticker, the two stacked card trays (photo title-card with its
           blended name, copy plate under it); the hidden sr-only
           heading steps aside (the grow head carries the title) */
        @media (max-width: 899px) {
          /* the Phase-4 map's past slot (the journey's 4th section) */
          .landing-past { order: 3; padding-bottom: 5vh; }
          .landing-past__a11y-head { display: none; }
          .landing-past__head { display: block; }
          .landing-past__marquee { margin-inline: -6vw; }
          /* the lower rail joins the mobile read (Eliot 11-24): the
             card read runs a three-rail weave — top, reversed between
             the trays, forward at the foot (its direction flips in the
             strings effect) */
          .landing-past__marquee--bottom { display: block; margin-inline: -6vw; }
          /* the tray separator's one mobile showing: flush between the
             two cards (its 3vh top air is the head's, not the rail's) */
          .landing-past__marquee--between { display: block; margin-inline: -6vw; margin-top: 0; }
          .landing-past__center { display: none; }
          .landing-past__side-band { display: none; }
          .landing-past__track {
            height: auto;
            margin-inline: -6vw;
            /* no top air: the first card's photo butts the ticker's
               bottom edge (Eliot 11-24) */
            margin-top: 0;
            display: flex;
            flex-direction: column;
          }
          /* the tray comes out of its drawer pose: a static column
             (photo title-card over its copy plate); the left tray's
             plate rides below the photo (the card's read) */
          .landing-past__tray {
            position: relative;
            top: auto;
            bottom: auto;
            left: auto;
            right: auto;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .landing-past__shot {
            flex: 0 0 auto;
            width: 100%;
            height: 44vw;
            /* the card's photo prints square (Eliot 11-04, the 20px cuts
               retire) — but the CLIP STAYS: inset(0) is the rectangle the
               blended name's spill is cropped + scoped against (the name
               rides the shot's box; without the clip its lines print over
               the copy plate) */
            clip-path: inset(0);
          }
          .landing-past__shot img { object-position: center; }
          /* the blended name rides again (the card's name over the
             shot) — its cap steps to Eliot's 11vw (2026-11-24): the
             16vw read printed the run too tall over the 44vw card box */
          .landing-past__band-name {
            position: absolute;
            inset-block: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            z-index: 1;
            mix-blend-mode: difference;
            font-family: var(--f-disp, 'Space Grotesk', sans-serif);
            font-weight: 700;
            font-size: 11vw;
            line-height: 1.05;
            text-wrap: balance;
            color: ${PAPER};
          }
          .landing-past__copy {
            flex: 0 0 auto;
            order: 2;
            width: 100%;
            justify-content: flex-start;
            padding: 18px 16px;
            gap: 12px;
          }
          .landing-past__copy-body { position: relative; }
          /* the member label's ink — inheriting the copy's own dark
             crimson (the fluro plate's tint retired with the plate) */
          .landing-past__band-member { color: inherit; }
          .landing-past__band-bullets { font-size: 12px; }
          /* the post-track space rides 0 (Eliot 11-04): the see-all butts
             the last tray — the plate beneath it retired same-day */
          .landing-past__see-all { margin-top: 0; }
        }
      `}</style>

      {/* the section's real heading — visually hidden everywhere but
          the AT tree (the desktop track's title is aria-hidden decor;
          the mobile card read shows the grow head, so the hidden one
          steps aside there) */}
      <h2 class="sr-only landing-past__a11y-head">Past Work.</h2>

      {/* the flow grid slots print from landing.css's shared layer */}
      <div class="landing-flow" ref={flowRef}>
        {/* the head — a mobile piece (the desktop's title hangs in the
            track's middle) */}
        <GrowHead text="Past Work." inView={inView} class="landing-past__head" />

        {/* the rails: one ticker above the track, one below it (its
            track runs REVERSED — the component's reverse attribute);
            strings/speed imperative-set, the effect above owns the whys */}
        {/* the rails' shared words, once for the AT tree (the marquee
            halves are aria-hidden decor) */}
        <span class="sr-only">{PAST_TICKER.join(', ')}</span>
        <glaphic-marquee
          class="landing-past__marquee"
          aria-hidden="true"
          ref={marqueeTopRef}
        />

        {/* the three-column track: drawer units flanking the title.
            The seam bands are the track's own fixed spines — they stay
            at the middle's two edges while the units pass beneath */}
        <div class="landing-past__track">
          {/* the title: the big words on separate lines at the shared
              size, framed by the crimson rules; only PAST's letters
              flicker (the clock's beat) */}
          {/* the title: the big words on separate lines at the shared
              size, framed by the crimson rules; the A and the R wear
              the pixel face permanently (the faces are furniture) */}
          <div class="landing-past__center" aria-hidden="true">
            <span class="landing-past__rule" aria-hidden="true" />
            <span class="landing-past__word">
              P<span class="landing-past__letter landing-past__letter--pixel">A</span>ST
            </span>
            <span class="landing-past__rule" aria-hidden="true" />
            <span class="landing-past__word landing-past__word--work">
              WO<span class="landing-past__letter landing-past__letter--pixel">R</span>K
            </span>
            <span class="landing-past__rule" aria-hidden="true" />
          </div>

          {trays.map((tray, ti) => (
            <Fragment key={tray.name}>
              <article
                class={`landing-past__tray landing-past__tray--${tray.side}`}
                key={tray.name}
              >
                {/* the left tray leads its plate — the piece that
                    emerges from the screen's own side; the right tray's
                    photo leads (the plate trails at the panel's edge) */}
                {tray.side === 'left' && (<TrayCopy works={tray.works} />)}
                <div class="landing-past__shot">
                  <img src={tray.image} alt={`The ${tray.works[0].name.toLowerCase()} build`} loading="lazy" />
                  <h3 class="landing-past__band-name">{tray.name}</h3>
                </div>
                {tray.side === 'right' && (<TrayCopy works={tray.works} />)}
              </article>
              {/* the tray separator: MOBILE-ONLY — the card read's rail
                  between the two category cards, running the track's own
                  ticker words the opposite way; the desktop's drawer
                  track has no room for a horizontal rail */}
              {ti === 0 && (
                <glaphic-marquee
                  key="between-rail"
                  class="landing-past__marquee landing-past__marquee--between"
                  reverse
                  aria-hidden="true"
                  ref={marqueeBetweenRef}
                />
              )}
            </Fragment>
          ))}

          {/* the seam bands: fixed at the middle's two edges, the
              categories' labels (aria-hidden decor — the drawers and
              the hovers pass beneath them) */}
          {trays.map((tray) => (
            <span
              class={`landing-past__side-band landing-past__side-band--${tray.side}`}
              aria-hidden="true"
              key={tray.band}
            >
              {tray.band}
            </span>
          ))}
        </div>

        <glaphic-marquee
          class="landing-past__marquee landing-past__marquee--bottom"
          reverse
          aria-hidden="true"
          ref={marqueeBottomRef}
        />

        {/* the see-all: the track's one route out */}
        <glaphic-button
          class="landing-past__see-all"
          variant="solid"
          chamfered
          style={{ ...GO_TO }}
          onClick={() => navigate('/past')}
        >
          {'see all ->'}
        </glaphic-button>
      </div>
    </section>
  );
}