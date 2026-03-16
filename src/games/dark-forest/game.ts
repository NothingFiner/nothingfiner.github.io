import './style.sass';
import { GameState } from '../../pages/DarkForest';

export const startGameLoop = async (stateCallback: (state: GameState) => void, canvas: HTMLCanvasElement | null) => {
  if (!canvas) return () => {};

  // Lazy load Paper.js only when game starts
  const paper = await import('paper');
  const [{ default: Weapon }, { default: Sun }, { default: System }] = await Promise.all([
    import('./weapon'),
    import('./sun'),
    import('./system'),
  ]);

  // Initialize paper with canvas
  paper.default.setup(canvas);

  const star = new Sun(paper.default);
  const system = new System(paper.default, star.mass);
  const weapon = new Weapon(paper.default);
  const startPos = weapon.position;
  let targetIndex = 0;

  const collisionCheck = () => {
    if (weapon.position !== startPos) {
      const currentTarget = system.planets[targetIndex];
      if (!currentTarget) return;
      if (currentTarget.body.hitTest(weapon.core.position) || weapon.core.hitTest(currentTarget.body.position)) {
        system.planets[targetIndex] = null;
        targetIndex += 1;
        weapon.grow();
        currentTarget.body.remove();
      }
    }
  };

  const won = () => {
    stateCallback('won' as GameState);
  };

  weapon.gestate();
  weapon.core.visible = false;
  const revealTimeout = window.setTimeout(() => {
    weapon.core.visible = true;
  }, 6000);

  paper.default.view.onFrame = () => {
    if (!paper.default.project || !paper.default.view) return;

    if (paper.default.Key.isDown('a')) weapon.left();
    if (paper.default.Key.isDown('d')) weapon.right();
    if (paper.default.Key.isDown('w')) weapon.forward();
    if (paper.default.Key.isDown('s')) weapon.reverse();
    star.pulse();
    system.orbit();

    if (targetIndex >= system.bodyCount) {
      won();
    } else {
      collisionCheck();
    }

    if (weapon.core) {
        weapon.draw();
    }
  };

  return () => {
    window.clearTimeout(revealTimeout);
    if (paper.default.view) {
      paper.default.view.onFrame = null;
    }
    paper.default.project?.remove();
  };
};
