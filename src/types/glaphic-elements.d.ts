// JSX declarations for the glaphic custom elements (Lit) so they typecheck
// inside Preact JSX. Attributes are permissive (Lit maps unknown
// attributes via reflection) — narrow any given element to
//   preact.ComponentProps<typeof GlaphicX>  from '@glaphic/ui'
// once the redesign uses it heavily.
import 'preact';

type GlaphicEl = preact.JSX.HTMLAttributes<HTMLElement> & Record<string, any>;

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'glaphic-text': GlaphicEl;
      'glaphic-cast': GlaphicEl;
      'glaphic-cursor-type': GlaphicEl;
      'glaphic-collapse': GlaphicEl;
      'glaphic-fan': GlaphicEl;
      'glaphic-ink-stroke': GlaphicEl;
      'glaphic-card': GlaphicEl;
      'glaphic-frame': GlaphicEl;
      'glaphic-plate': GlaphicEl;
      'glaphic-band': GlaphicEl;
      'glaphic-marquee': GlaphicEl;
      'glaphic-tape': GlaphicEl;
      'glaphic-ascii': GlaphicEl;
      'glaphic-corners': GlaphicEl;
      'glaphic-crumbs': GlaphicEl;
      'glaphic-crumb': GlaphicEl;
      'glaphic-divider': GlaphicEl;
      'glaphic-chip': GlaphicEl;
      'glaphic-button': GlaphicEl;
      'glaphic-button-group': GlaphicEl;
      'glaphic-film-button': GlaphicEl;
      'glaphic-switch': GlaphicEl;
      'glaphic-slider': GlaphicEl;
      'glaphic-textfield': GlaphicEl;
      'glaphic-select': GlaphicEl;
      'glaphic-accordion': GlaphicEl;
      'glaphic-accordion-item': GlaphicEl;
      'glaphic-carousel': GlaphicEl;
      'glaphic-card-carousel': GlaphicEl;
      'glaphic-card-slide': GlaphicEl;
      'glaphic-drawer': GlaphicEl;
      'glaphic-pool-menu': GlaphicEl;
      'glaphic-table': GlaphicEl;
      'glaphic-convergence': GlaphicEl;
    }
  }
}