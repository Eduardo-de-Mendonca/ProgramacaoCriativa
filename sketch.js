/**
 * @param {p5} p
 */
const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400); // ✅ autocomplete works!
  };

  p.draw = () => {
    p.background(200);
    p.ellipse(200, 200, 50, 50);
  };
};

new p5(mySketch);
