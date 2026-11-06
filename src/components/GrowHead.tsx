// The landing's shared grow print — the "grows out of the page" type
// treatment (the stepped ink shadow ladder lives in src/landing.css).
// The component owns the markup and the reveal flag: the grow plays
// once when `inView` (the section's IntersectionObserver flag) flips
// on, and the `both` fill parks the stack at its full depth after it.
//
// The block name carries the semantics: GrowHead prints an actual
// section header (the one block that takes the mobile bump + fluro
// field read); GrowText prints statement copy that only borrows the
// grow treatment. One implementation, two exports — the ladder and
// the print stay shared; the blocks keep their BEM space apart.
function GrowPrint(props: { text: string; inView: boolean; class?: string; block: 'grow-head' | 'grow-text' }) {
  return (
    <h2 class={`${props.block} ${props.class ?? ''}`}>
      <span class={`${props.block}__in ${props.inView ? `${props.block}--on` : ''}`}>{props.text}</span>
    </h2>
  );
}

export function GrowHead(props: { text: string; inView: boolean; class?: string }) {
  return <GrowPrint {...props} block="grow-head" />;
}

export function GrowText(props: { text: string; inView: boolean; class?: string }) {
  return <GrowPrint {...props} block="grow-text" />;
}
