
import p5 from "p5";
import * as ut from ".././utilities";
// Acesse o módulo utilities.ts em https://github.com/Eduardo-de-Mendonca/ProgramacaoCriativa/blob/main/utilities.ts

/*
Inspiração:
Artista: https://www.instagram.com/jpyepez/
Sketch: https://www.instagram.com/p/CaQO9RXF_qb/

Conclusões...
Gastei muito mais tempo construindo esse framework para poder fazer os sketches em TypeScript do que no sketch de fato. Planejo fazer os sketches assim daqui para a frente.

A ideia do sketch era, com vários retângulos, fazer um formato curvo como o da inspiração. Porém, o problema é que, por mais que eu diminua o tamanho de cada retângulo (aumentando n_rects), eu não estou criando mais retângulos por frame (estou criando só 1). Por isso, em vez de ter uma forma mais curva, os retângulos acabam deixando espaço vazios entre eles.
*/

// Turn off p5’s error-friendly parser (avoids console spam on GitHub Pages)
(p5 as any).disableFriendlyErrors = true;

let speed = -2;
let n_rects_on_screen = 300;
let cheight_variation_amplitude = 10;
let ccy_variation_amplitude = 10;

let rectangle_color: p5.Color;
let bg_color: p5.Color;
let screen: MainScreen;

class Rectangle {
  p:p5;
  center_x: number;
  center_y: number;
  width: number;
  height: number;

  constructor(p: p5, center_x: number, center_y: number, width: number, height: number) {
    this.p = p;
    this.center_x = center_x;
    this.center_y = center_y;
    this.width = width;
    this.height = height;
  }

  /**
  Retorna false se o retângulo saiu da tela pela esquerda.
  */
  is_on_screen() {
    let rightmost_occupied_space = this.center_x + this.width/2;
    if (rightmost_occupied_space < 0) return false;
    return true;
  }

  tick() {
    this.center_x += speed;
  }

  draw() {
    ut.centered_rect_no_stroke(this.p, this.center_x, this.center_y, this.width, this.height, rectangle_color);
  }
}

class MainScreen {
  p: p5;
  rects: Rectangle[];

  creating_cy: number;
  creating_height: number;

  constructor(p: p5) {
    this.p = p;
    this.rects = [];

    this.creating_cy = p.height/2;
    this.creating_height = p.height/2;
  }

  tick() {
    // Atualizar creating_cy, creating_height
    this.creating_cy += ut.random_around_zero(this.p, ccy_variation_amplitude);
    this.creating_height += ut.random_around_zero(this.p, cheight_variation_amplitude);

    this.creating_cy = this.p.constrain(this.creating_cy, this.p.height/4, 3*this.p.height/4);

    this.creating_height = this.p.constrain(this.creating_height, 0, 2*Math.min(this.creating_cy, this.p.height - this.creating_cy)); // Restringir a altura para que nenhuma das extremidades fique fora da tela

    // Criar um retângulo
    this.rects.push(new Rectangle(this.p, this.p.width, this.creating_cy, this.p.width/n_rects_on_screen, this.creating_height));

    // Atualizar a posição dos retângulos
    for (let rect of this.rects) {
      rect.tick();
    }

    // Filtrar os retângulos que saíram da tela
    this.rects = this.rects.filter(rect => rect.is_on_screen());

    // Desenhar tudo
    this.p.background(bg_color);
    for (let rect of this.rects) {
      rect.draw();
    }
  }
}

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    rectangle_color = p.color('white');
    bg_color = p.color('black');

    screen = new MainScreen(p);
  };

  p.draw = () => {
    screen.tick();

    //p.background(bg_color);
    //ut.centered_rect(p, p.width/2, p.height/2, 20, p.height, rectangle_color);
  }
};

new p5(sketch);
