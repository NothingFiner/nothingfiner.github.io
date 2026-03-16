import paper from 'paper';

interface PlanetSeed {
  scope: typeof paper;
  radius: number;
  center: paper.Point;
  starMass: number;
  mass: number;
  type: string;
  angleOffset?: number;
}

class Planet {
  scope: typeof paper;
  orbitalRadius: number;
  starCenter: paper.Point;
  starMass: number;
  position: paper.Point;
  mass: number;
  type: string;
  velocity: number;
  orbitRing: paper.Path.Circle;
  body: paper.Raster;
  angleOffset: number;

  constructor(planetSeed: PlanetSeed) {
    this.scope = planetSeed.scope;
    this.orbitalRadius = planetSeed.radius;
    this.starCenter = planetSeed.center;
    this.starMass = planetSeed.starMass;
    this.position = this.starCenter.clone();
    this.position.x -= this.orbitalRadius;
    this.mass = planetSeed.mass;
    this.type = planetSeed.type;
    this.velocity = this.getVelocity();
    this.orbitRing = null!;
    this.body = null!;
    this.angleOffset = planetSeed.angleOffset ?? 0;
    this.spawn();
  }

  getVelocity() {
    return Math.sqrt(this.starMass / this.orbitalRadius);
  }

  spawn() {
    this.orbitRing = new paper.Path.Circle({
      radius: this.orbitalRadius,
      center: this.starCenter,
      strokeWidth: 1,
      strokeColor: 'rgba(68,214,44, 0.2)',
      shadowColor: 'rgb(68,214,44)',
      shadowBlur: 10,
      fillColor: null,
      dashArray: [2, 10],
    });
    this.body = new paper.Raster(this.type);
    this.body.position = this.position;
    this.body.size = new paper.Size(this.mass * 2, this.mass * 2);
  }

  orbit() {
    this.body.rotate(this.velocity, this.starCenter);
  }
}

export default Planet;
