/**
 * Moves a light-DOM component's captured pre-render children into a
 * rendered wrapper node. Optical components have no shadow slot
 * machinery, so user markup is captured on connect and re-inserted
 * after the first render. Content added later goes straight to the
 * wrapper (light DOM is queryable — that's a feature, not a hack).
 */
export function glaphicMoveChildren(slot: HTMLElement | null, nodes: readonly Node[]): void {
  if (!slot) return;
  for (const node of nodes) {
    if (node.parentNode) node.parentNode.removeChild(node);
    slot.appendChild(node);
  }
}