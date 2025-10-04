import p5 from "p5";

export class MouseTracker {
    p: p5;
    x: number;
    y: number;
    pressed: boolean;
    just_pressed: boolean;

    constructor(p:p5) {
        this.p = p;
        this.x = 0;
        this.y = 0;
        this.pressed = false;
        this.just_pressed = false;
    }

    listen() {
        let old_pressed = this.pressed;
        this.pressed = false;
        this.just_pressed = false;
        if (this.p.mouseIsPressed) {
            this.pressed = true;
            if (!old_pressed) this.just_pressed = true;
        }

        this.x = this.p.mouseX;
        this.y = this.p.mouseY;
    }
}

/**
Draws a vertical line spanning the full canvas.
*/
export function vertical_infinite_line(p: p5, x: number) {
    let x1 = x;
    let x2 = x;
    let y1 = 0;
    let y2 = p.height;

    p.line(x1, y1, x2, y2);
};

/**
// Desenha texto com as coordenadas do top left e o tamanho da fonte
*/
export function draw_text(p:p5, drawee:string, x:number, y:number, text_color:p5.Color, f_size:number, h_align: any = p.CENTER, v_align: any = p.CENTER) {
    p.push();
    p.textAlign(h_align, v_align);
    p.textSize(f_size);
    p.fill(text_color);
    p.text(drawee, x, y);
    p.pop();
}