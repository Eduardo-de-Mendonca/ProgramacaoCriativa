//console.log("Hello, world from TypeScript!");

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
