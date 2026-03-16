import paper from 'paper';
import Planet from './planet';

const PLANET_TYPES = [
  'transmuted',
  'drydeal',
  'cloud',
  'venom',
  'dust',
  'transformed',
  'ideal',
  'harsh',
  'smoke',
  'gas',
  'ice',
  'vein',
  'ooze',
  'fear',
  'glory',
] as const;

type PlanetType = typeof PLANET_TYPES[number];

const PLANET_SIZES = [3, 5, 8, 10, 13, 15, 18, 20, 25, 28, 30];

const sample = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffleInPlace = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

class System {
  paper: typeof paper;
  stellarMass: number;
  center: paper.Point;
  maxMass: number;
  planetSizes: number[];
  planets: (Planet | null)[];
  bodyCount: number;
  systemMass: number;
  currentRadius: number;
  minRadius: number;

  constructor(paperModule: typeof paper, stellarMass: number) {
    this.paper = paperModule;
    this.stellarMass = stellarMass;
    this.center = paperModule.view.center.clone();
    this.maxMass = Math.floor(Math.random() * 20) + (this.stellarMass * 2);
    this.planetSizes = shuffleInPlace([...PLANET_SIZES]);
    this.planets = [];
    this.bodyCount = 0;
    this.systemMass = 5;
    this.currentRadius = this.stellarMass * 2.5;
    this.minRadius = this.center.x - (this.stellarMass * 1.5);
    this.seed();
  }

  seed() {
    while (
      this.systemMass < this.maxMass
      && this.currentRadius < this.minRadius
      && this.planetSizes.length > 4
    ) {
      const planetMass = this.planetSizes.pop()!;
      const planetType = sample(PLANET_TYPES);
      const orbitalRadius = Math.floor(Math.random() * planetMass) + this.currentRadius;
      // Random starting angle offset so planets aren't all aligned
      const angleOffset = Math.random() * 360;

      this.planets.push(
        new Planet({
          radius: orbitalRadius,
          mass: planetMass,
          type: planetType,
          starMass: this.stellarMass,
          center: this.center,
          scope: this.paper,
          angleOffset,
        }),
      );

      this.systemMass += planetMass;
      this.currentRadius += (planetMass * 4);
      this.bodyCount += 1;
    }

    this.planets.sort((a, b) => (a?.mass || 0) - (b?.mass || 0));
  }

  orbit() {
    this.planets.forEach((planet) => {
      if (planet) {
        planet.orbit();
      }
    });
  }
}

export default System;
