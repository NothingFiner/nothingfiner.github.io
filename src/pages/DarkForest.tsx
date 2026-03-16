import { useEffect, useState, useMemo, useRef, Suspense, lazy } from 'preact/compat';

const DarkForestGame = lazy(() => import('../games/dark-forest/DarkForestGame'));

export const GAME_STATES = {
  idle: 'idle',
  running: 'running',
  won: 'won'
} as const;

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];

export function DarkForest() {
  return (
    <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-theme">Loading game...</div>}>
      <DarkForestGame />
    </Suspense>
  );
}
