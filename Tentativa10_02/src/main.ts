/*
import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    console.log("Hello, world from p5 Instance Mode + TS!");
  };

  p.draw = () => {
    // nothing for now
  };
};

new p5(sketch);
*/

import p5 from "p5";

let w: number;
let h: number;
let line_proportion = 0.1;
let iterations = 32;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    w = p.width;
    h = p.height;

    p.background("white");

    let x = line_proportion * w;
    for (let i = 1; i < iterations; i++) {
      vertical_infinite_line(p, x);
      x = p.map(line_proportion, 0, 1, x, w);
    }
  };

  const vertical_infinite_line = (p: p5, x: number) => {
    let x1 = x;
    let x2 = x;
    let y1 = 0;
    let y2 = h;

    p.line(x1, y1, x2, y2);
  };
};

new p5(sketch);
