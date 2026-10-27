// Site-wide window globals that carry no imports — kept in one ambient
// declaration so consumers don't reach for casts to touch them.
declare global {
  interface Window {
    /** Latch set by ProjectDetail's click driver: one listener per page run, not per route mount. */
    __driver?: boolean;
  }
}

export {};