// Past-work bands — the agency storefront work the /past page prints,
// in showcase order (the file order the bands print; the /past/:id
// kicker's PAST.00N reads the array position, like Projects' PRJ.00N).
//
// Keyed by the agency NAME'S lowercase underscore tag (the normalizer
// mirrors projectDetails.ts's own filing, and the agency-seam records
// there key the SAME tags) — so one string keys both halves: the bands
// here and the detail plates in projectDetails.ts.
//
// Copy provenance: the responsibilities are DRAFTED placeholders,
// written from what the slides/renders show (the visible surfaces) —
// they are not Eliot's copy. Every entry carries `copy: 'draft'` so
// the detail plates print the DRAFT tag and nothing here can pass as
// sourced (projectDetails.ts's provenance prose, in the same terms).
// There is no description on a band: the bands carry names + images
// only; the plate copy lives at the seam.
//
// The stream lists are duplicated in projectDetails.ts's agency
// entries (images: the same list) — the bands' and the plates' data
// homes per the seam decision. Keep the pairs in step if the rides
// change.
//
// Image provenance (2026-10-29): Eliot's captures from the live
// storefronts, downscaled from the Desktop originals to a ~1200px max
// dimension (batesville keeps its native 1368x914 landscape); the
// PNG copies that outweighed ~400KB re-encoded as JPEG (forever21,
// reformation, reformation-detail) — the img idiom reads either.

export interface PastWork {
  /** the agency's display name — the band prints it uppercase */
  name: string;
  /** the tag the band navigates and the detail route resolves
      (name through the normalizer below) */
  tag: string;
  /** the band's lead image: the stream's first block, or the deck
      slide Batesville's band shows */
  image: string;
  /** the detail page's stream images (src paths, in ride order) */
  stream: string[];
  /** drafted responsibilities — the crimson plate's agency-seam
      section (mirrors the seam entry in projectDetails.ts) */
  responsibilities: string[];
  /** copy provenance: 'draft' until Eliot writes the real lines —
      the plates print a DRAFT tag so it can't pass as real */
  copy: 'live' | 'draft';
}

// the lowercase underscore tag — the same filing the index cards
// print and projectDetails.ts keys by
const tag = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const bands: Omit<PastWork, 'tag'>[] = [
  {
    name: 'Brooks Brothers',
    image: './assets/brooksbrothers.png',
    stream: ['./assets/brooksbrothers.png'],
    responsibilities: [
      'Category navigation and the shirts listing hierarchy',
      'Filter, chip and sort controls across the listing',
      'Product grid: color swatches, ratings badges, quick-add',
      'Promotional tiles riding the grid',
    ],
    copy: 'draft',
  },
  {
    name: 'Forever 21',
    image: './assets/forever21.jpg',
    stream: ['./assets/forever21.jpg', './assets/forever21-detail.png'],
    responsibilities: [
      'The Late Night Edit campaign home and its nav over the hero',
      'Product-detail template: gallery, color and size selectors, quantity stepper',
      'Commerce modules: add-to-cart, Shop Pay and Klarna installments',
      'Promo banner and breadcrumb trail on the PDP',
    ],
    copy: 'draft',
  },
  {
    name: 'Batesville',
    image: './assets/batesville.png',
    stream: ['./assets/batesville.png'],
    responsibilities: [
      'The six-step Family Choices guided flow (the slide panel set)',
      'The Tell Their Story conversational capture feeding curated selections',
      'Real-time personalization surfaces: urn engraving previewed on screen',
      'Living Memorial tree-seedling submission and the Batesville Connect cart hand-off',
    ],
    copy: 'draft',
  },
  {
    name: 'Reformation',
    image: './assets/reformation.jpg',
    stream: ['./assets/reformation.jpg', './assets/reformation-detail.jpg'],
    responsibilities: [
      'Responsive e-commerce storefront build (PLP and PDP surfaces)',
      'Collection grid with the quick-add size row and show-more paging',
      'Product template: colorways, size guide, Apple Pay add-to-bag',
      'The oversized brand print section and the newsletter signup',
    ],
    copy: 'draft',
  },
];

export const pastWorks: PastWork[] = bands.map((band) => ({ ...band, tag: tag(band.name) }));

/** the stable keyed lookup the band routes and next-chains resolve
    with (by tag). A missing tag is a data error: the error carries the
    tag and the lookup never returns a fallback band — never a silent
    fallback (the projectByTitle contract). */
export function pastWorkByTag(lookup: string): PastWork {
  const found = pastWorks.find((work) => work.tag === lookup);
  if (!found) {
    throw new Error(`pastWork: no entry tagged '${lookup}' — check the band and detail-route lookups`);
  }
  return found;
}