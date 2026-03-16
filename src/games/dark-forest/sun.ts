import paper from 'paper';
import { randomStarColor, getRGB } from './util/colors';

class Sun {
  view: paper.View;
  center: paper.Point;
  lagrange: paper.Point;
  mass: number;
  color: paper.Color;
  rgb: string;
  star: paper.Path.Circle;
  pulsing: boolean;

  constructor(paperModule: typeof paper) {
    this.view = paperModule.view;
    this.center = paperModule.view.center.clone();
    this.lagrange = this.center;
    this.mass = Math.floor(Math.random() * 50) + 35;
    this.color = randomStarColor();
    this.rgb = getRGB(this.color);
    this.star = null!;
    this.pulsing = true;
    this.spawn();
  }

  pulse() {
    if (this.pulsing) {
      this.star.shadowBlur += 0.25;
      if (this.star.shadowBlur > (this.mass / 4) + 5) this.pulsing = false;
    } else {
      this.star.shadowBlur -= 0.25;
      if (this.star.shadowBlur <= (this.mass / 4)) this.pulsing = true;
    }
  }

  spawn() {
    this.star = new paper.Path.Circle({
      center: this.lagrange,
      radius: this.mass,
      strokeColor: null,
      shadowColor: this.rgb,
      shadowBlur: this.mass / 4,
    });
    this.star.fillColor = {
      gradient: {
        radial: true,
        stops: [['whitesmoke', 0.0000001], [this.rgb, 1]],
      },
      origin: { x: this.star.position.x - (this.mass / 3.14), y: this.star.position.y - (this.mass / 3.14) },
      destination: this.star.bounds.rightCenter,
    };
  }
}

export default Sun;
