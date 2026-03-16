import { useEffect, useState, useMemo, useRef } from 'preact/hooks';
import { startGameLoop } from './game';

export const GAME_STATES = {
  idle: 'idle',
  running: 'running',
  won: 'won'
} as const;

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];

export function DarkForestGame() {
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.idle);
  const [inTransit, setInTransit] = useState(false);

  const transitTimeout = useRef<number | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (gameState === GAME_STATES.running) {
      setInTransit(true);
      startGameLoop(setGameState, canvas.current).then(cleanupFn => {
        cleanup.current = cleanupFn;
      });
      transitTimeout.current = window.setTimeout(() => {
        setInTransit(false);
      }, 5000);
    } else if (gameState === GAME_STATES.won) {
      setInTransit(true);
    }
    return () => {
      cleanup.current?.();
      if (transitTimeout.current) clearTimeout(transitTimeout.current);
    };
  }, [gameState]);

  const isIdle = useMemo(() => gameState === GAME_STATES.idle, [gameState]);
  const victory = useMemo(() => gameState === GAME_STATES.won, [gameState]);
  const imgBase = '/games/dark-forest/img';

  return (
    <div class="dark-forest">
      {/* hidden sprites used by Paper.js Raster(id) */}
      <img src={`${imgBase}/gas.png`} id="gas" alt="" />
      <img src={`${imgBase}/harsh.png`} id="harsh" alt="" />
      <img src={`${imgBase}/transformed.png`} id="transformed" alt="" />
      <img src={`${imgBase}/ice.png`} id="ice" alt="" />
      <img src={`${imgBase}/smoke.png`} id="smoke" alt="" />
      <img src={`${imgBase}/ideal.png`} id="ideal" alt="" />
      <img src={`${imgBase}/vein.png`} id="vein" alt="" />
      <img src={`${imgBase}/ooze.png`} id="ooze" alt="" />
      <img src={`${imgBase}/fear.png`} id="fear" alt="" />
      <img src={`${imgBase}/glory.png`} id="glory" alt="" />
      <img src={`${imgBase}/cloud.png`} id="cloud" alt="" />
      <img src={`${imgBase}/drydeal.png`} id="drydeal" alt="" />
      <img src={`${imgBase}/dust.png`} id="dust" alt="" />
      <img src={`${imgBase}/transmuted.png`} id="transmuted" alt="" />
      <img src={`${imgBase}/venom.png`} id="venom" alt="" />

      <div id="dark-forest-stars" class={inTransit ? 'transit' : ''} />

      <div class="menu-container">
        <div class={isIdle ? 'menu' : 'menu hide'} id="dark-forest-menu">
          <h1>The Dark Forest</h1>
          <section>
            Coordinates recieved for system containing dangerous life.<br />
            This system must be purged.<br />
            The weapon is prepared.<br />
            Consume the worlds.<br />
            Cleanse the system of dangerous life.<br />
            Ensure the safety of our civilisation
          </section>
          <section>
            <h3>Instructions</h3>
            <ul>
              <li>
                <span>W</span> Accelerate Weapon
              </li>
              <li>
                <span>S</span> Decellerate Weapon
              </li>
              <li>
                <span>A</span> and <span>D</span> increase angle of vector left or right
              </li>
              <li>consume the planets, starting with the smallest</li>
            </ul>
          </section>
        </div>
        <div id="dark-forest-status" class={`status ${inTransit ? 'active' : ''}`}>
          <main>
            <span />
            <span />
            <h1 id="dark-forest-status-text">{gameState === GAME_STATES.won ? 'SYSTEM PURGED' : 'IN TRANSIT'}</h1>
            <span />
            <span />
          </main>
        </div>
        {(isIdle || victory) && (
          <div class="button-container">
            <button id="dark-forest-start" class="button" onClick={() => setGameState(GAME_STATES.running)}>
              {victory ? 'Play Again' : 'Engage Weapon'}
            </button>
            <a href="/">
              <button class="button">Back to Home</button>
            </a>
          </div>
        )}
      </div>
      <div id="dark-forest-container" class={!isIdle && !inTransit ? 'active' : ''}>
        <canvas id="dark-forest-canvas" ref={canvas} />
      </div>
    </div>
  );
}

export default DarkForestGame;
