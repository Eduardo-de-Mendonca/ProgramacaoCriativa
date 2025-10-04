
import p5 from "p5";
import * as ut from "./utilities";

// Turn off p5’s error-friendly parser (avoids console spam on GitHub Pages)
(p5 as any).disableFriendlyErrors = true;

let line_proportion = 0.1;
let iterations = 32;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    let w = p.width;
    let h = p.height;

    p.background("white");

    let x = line_proportion * w;
    for (let i = 1; i < iterations; i++) {
      ut.vertical_infinite_line(p, x);
      x = p.map(line_proportion, 0, 1, x, w);
    }

    console.log("Hello, console!");
  };
};

new p5(sketch);
