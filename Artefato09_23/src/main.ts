// Inicie uma rebelião e domine o Brasil a partir do Rio de Janeiro!

// Clique em uma capital inimiga para atacá-la com sua capital mais próxima, desde que ela tenha 2 ou mais soldados
// Com o tempo, você recebe impostos proporcionais a sua quantidade de capitais
// Clique em uma capital sua para gastar dinheiro e recrutar soldados

import p5 from "p5";
import * as ut from "../../utilities";
import { assert } from "console";
(p5 as any).disableFriendlyErrors = true;

let size_x = 500;
let size_y = 500;

let capital_diameter = 50;
let soldier_diameter = 10;
let soldier_spd = 0.01;
let enemy_attack_odds = 0.001;
let font_size = 20;

let friendly_coords = [385, 354];
let other_coords = [
  [366, 310], 
  [311, 346], 
  [263, 443], 
  [246, 326], 
  [228, 236], 
  [403, 226], 
  [263, 123], 
  [120, 126]
];

let tax_period = 120;
let tax_per_capital = 2;
let soldier_cost = 1;
let soldier_increment = 1;
let initial_money = 5;

let bg_color: p5.Color;
let friendly_capital_color: p5.Color;
let enemy_capital_color: p5.Color;
let black: p5.Color;
let mouse: ut.MouseTracker;
let screen: MainScreen;
let map_image: p5.Image;
//let w: number;
//let h: number;

class MainScreen {
  p: p5;
  capitals: Capital[];
  soldiers: Soldier[];
  money: number;

  constructor(p: p5) {
    this.p = p;
    this.capitals = [new Capital(p, friendly_coords[0], friendly_coords[1], true, 10)];

    for (let coord of other_coords) {
      this.capitals.push(new Capital(p, coord[0], coord[1], false, 10));
    }

    this.soldiers = [];
    this.money = initial_money;
  }

  friendly_capital_amount() {
    let result = 0;
    for (let capital of this.capitals) {
      if (capital.friendly) result += 1;
    }
    return result;
  }

  closest_friendly_capital(capital:Capital) {
    let d = -1;
    let result;
    
    for (let c of this.capitals) {
      if (!c.friendly) continue;
      
      let cd = (capital.x - c.x)**2 + (capital.y - c.y)**2;
      if (d == -1 || cd < d) {
        d = cd;
        result = c;
      }
    }
    
    if (result == undefined) throw "No friendly capitals!";
    return result;
  }

  attack(c1:Capital, c2:Capital) {
      c1.soldiers -= 1;
      this.soldiers.push(new Soldier(this.p, c1.x, c1.y, (c2.x - c1.x)*soldier_spd, (c2.y - c1.y)*soldier_spd, c1.friendly));
  }

  check_click() {
    if (!mouse.just_pressed) return;
    
    for (let capital of this.capitals) {
      if (capital.point_in_circle(mouse.x, mouse.y)) {
        if (capital.friendly && this.money >= soldier_cost) {
          capital.soldiers += soldier_increment;
          this.money -= soldier_cost;
        }
        
        if (!capital.friendly) {
          let c = this.closest_friendly_capital(capital);
          if (c.soldiers >= 2) this.attack(c, capital);
        }
        
        return;
      }
    }
  }

  check_collision(soldier_idx:number) {
    let soldier = this.soldiers[soldier_idx];
    for (let capital of this.capitals) {
      if (capital.point_in_circle(soldier.x, soldier.y)) {
        if (capital.soldiers == 0) {
          soldier.dead = true;
          capital.friendly = soldier.friendly;
          capital.soldiers = 1;
          return;
        }
        
        if (capital.friendly != soldier.friendly) {
          soldier.dead = true;
          capital.soldiers -= 1;
          if (capital.soldiers == 0) capital.friendly = false;
          return;
        }
      }
    }
  }

  tick() {
    mouse.listen();
    this.check_click();
    for (let capital of this.capitals) {
      if (!capital.friendly && capital.soldiers >= 2 && this.p.random(1) <= enemy_attack_odds) {
        let c = this.closest_friendly_capital(capital);
        this.attack(capital, c);
      }
    }
    
    for (let soldier of this.soldiers) soldier.move();
    for (let soldier_idx = 0; soldier_idx < this.soldiers.length; soldier_idx++) this.check_collision(soldier_idx);
    this.soldiers = this.soldiers.filter(soldier => !soldier.dead);
    
    if (this.p.frameCount % tax_period == tax_period - 1) {
      this.money += tax_per_capital*this.friendly_capital_amount();
    }
    
    this.p.background(bg_color);
    this.p.image(map_image, 0, 0, this.p.width, this.p.height);
   
    for (let capital of this.capitals) capital.draw_this();
    for (let soldier of this.soldiers) soldier.draw_this();
    
    ut.draw_text(this.p, `Dinheiro: ${this.money.toString()}`, size_x, size_y, black, font_size, this.p.RIGHT, this.p.BOTTOM);
  }
}

class Capital {
  p: p5;
  x: number;
  y: number;
  friendly: boolean;
  soldiers: number;

  constructor(p:p5, x:number, y:number, friendly:boolean, soldiers:number) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.friendly = friendly;

    this.soldiers = soldiers;
  }
  
  get_color() {
    if (this.friendly) return friendly_capital_color;
    return enemy_capital_color;
  }
  
  point_in_circle(x:number, y:number) {
    // Retorna true se x, y estão no meu círculo
    let r = capital_diameter/2;
    return (x-this.x)**2 + (y-this.y)**2 <= r**2;
  }
  
  draw_this() {
    this.p.push();
    
    this.p.fill(this.get_color());
    this.p.circle(this.x, this.y, capital_diameter);
    ut.draw_text(this.p, this.soldiers.toString(), this.x, this.y, black, font_size);
    
    this.p.pop();
  }
}

class Soldier {
  p: p5;
  x: number;
  y: number;
  spd_x: number;
  spd_y: number;
  friendly: boolean;
  dead: boolean;

  constructor(p: p5, x:number, y:number, spd_x:number, spd_y:number, friendly:boolean) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.spd_x = spd_x;
    this.spd_y = spd_y;
    this.friendly = friendly;
    this.dead = false;
  }
  
  get_color() {
    if (this.friendly) return friendly_capital_color;
    return enemy_capital_color;
  }
  
  move() {
    this.x += this.spd_x;
    this.y += this.spd_y;
  }
  
  draw_this() {
    this.p.push();
    
    this.p.fill(this.get_color());
    this.p.circle(this.x, this.y, soldier_diameter);
    
    this.p.pop();
  }
}

const sketch = (p: p5) => {
  p.preload = () => {
    map_image = p.loadImage('Images/mapa_brasil.jpeg');
  }

  p.setup = () => {
    p.createCanvas(size_x, size_y);
    
    bg_color = p.color('white');
    friendly_capital_color = p.color('green');
    enemy_capital_color = p.color('red');
    black = p.color('black');
    
    mouse = new ut.MouseTracker(p);
    screen = new MainScreen(p);
  };

  p.draw = () => {
    if (screen.friendly_capital_amount() != 0 && screen.friendly_capital_amount() != other_coords.length + 1) {
      screen.tick();
    }
  }
};

new p5(sketch);