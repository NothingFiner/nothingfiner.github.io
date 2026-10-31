// The landing's shared section header — the "grows out of the page"
// headline rendered by every landing section over the paper ground
// ("I've been Coding." / "Tools I've used."). The type/ink treatment and
// the stepped shadow-print grow live in src/landing.css; this component
// owns the markup and the reveal flag: the grow plays once when
// `inView` (the section's IntersectionObserver flag) flips on, and the
// `both` fill parks the stack at its full depth after it.
export function GrowHead(props: { text: string; inView: boolean; class?: string }) {
  return (
    <h2 class={`grow-head ${props.class ?? ''}`}>
      <span class={`grow-head__in ${props.inView ? 'grow-head--on' : ''}`}>{props.text}</span>
    </h2>
  );
}