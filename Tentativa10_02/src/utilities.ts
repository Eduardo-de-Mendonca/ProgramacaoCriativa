import p5 from "p5";

// Draws a vertical line spanning the full canvas
export function vertical_infinite_line(p: p5, x: number) {
let x1 = x;
let x2 = x;
let y1 = 0;
let y2 = p.height;

p.line(x1, y1, x2, y2);
};