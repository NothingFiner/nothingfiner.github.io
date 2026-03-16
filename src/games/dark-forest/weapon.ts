import paper from 'paper';
import { getNewPosition } from './util/paper_util';

class Weapon {
  paper: typeof paper;
  view: paper.View;
  center: paper.Point;
  size: number;
  vector: paper.Point;
  friction: number;
  speed: number;
  maxSteer: number;
  steering: number;
  maxSpeed: number;
  minSpeed: number;
  position: paper.Point;
  lastRotation: number;
  count: number;
  core: paper.Path.Circle;

  constructor(paperModule: typeof paper) {
    this.paper = paperModule;
    this.view = paperModule.view;
    this.center = paperModule.view.center;
    this.size = 0;
    this.vector = new paperModule.Point({
      angle: 270,
      length: 20,
    });
    this.friction = 0.95;
    this.speed = 2;
    this.maxSteer = 4.5;
    this.steering = 1.5;
    this.maxSpeed = 10;
    this.minSpeed = 1;
    this.position = this.center;
    this.position.y = this.view.size.height;
    this.lastRotation = 0;
    this.count = 0;
    this.core = null!;
  }

  gestate() {
    this.core = new paper.Path.Circle({
      center: this.position,
      radius: 15,
      fillColor: 'black',
      strokeColor: null,
      shadowColor: new paper.Color(100, 0, 200),
      shadowBlur: 30,
    });
  }

  left() {
    if (this.speed >= -1) {
      if (this.speed < 3 && this.speed >= 0) {
        this.vector.angle -= (this.speed * 2);
      } else if (this.speed < 0) {
        this.vector.angle -= (this.speed / 2);
      } else {
        this.vector.angle -= this.maxSteer * this.steering;
      }
    }
    this.speed *= this.friction;
  }

  right() {
    if (this.speed >= -1) {
      if (this.speed < 3 && this.speed >= 0) {
        this.vector.angle += (this.speed * 2);
      } else if (this.speed < 0) {
        this.vector.angle += (this.speed / 2);
      } else {
        this.vector.angle += this.maxSteer * this.steering;
      }
    }
    this.speed *= this.friction;
  }

  forward() {
    this.speed += 0.3;
    this.speed = Math.min(this.maxSpeed, this.speed);
  }

  reverse() {
    this.speed -= 0.3;
    if (this.speed < -this.minSpeed) this.speed = -this.minSpeed;
  }

  grow() {
    this.size += 1;
    this.core.scale(1.1);
  }

  constrain() {
    const bounds = this.core.bounds;
    const size = this.view.size;
    if (!bounds.intersects(this.view.bounds)) {
      if (this.position.x < -bounds.width) this.position.x = size.width + bounds.width;
      if (this.position.y < -bounds.height) this.position.y = size.height + bounds.height;
      if (this.position.x > size.width + bounds.width) this.position.x = -bounds.width;
      if (this.position.y > size.height + bounds.height) this.position.y = -bounds.height;
      this.core.position = this.position;
    }
  }

  draw() {
    const normalizedVector = this.vector.normalize(this.speed);
    this.speed *= this.friction;
    this.position = getNewPosition(this.position, normalizedVector).clone();
    this.core.position = this.position;
    this.core.smooth();
    this.constrain();
  }
}

export default Weapon;
