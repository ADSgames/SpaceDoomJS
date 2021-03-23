import {
  allegro_init,
  clear_to_color,
  DIGI_AUTODETECT,
  draw_sprite,
  enable_debug,
  END_OF_MAIN,
  font,
  GFX_AUTODETECT_WINDOWED,
  init_allegro_ts,
  install_keyboard,
  install_mouse,
  install_sound,
  key,
  KEY_B,
  KEY_ESC,
  KEY_R,
  load_bmp,
  load_sample,
  makecol,
  MIDI_AUTODETECT,
  mouse_b,
  mouse_x,
  mouse_y,
  play_sample,
  rest,
  rotate_sprite,
  screen,
  set_gfx_mode,
  textout_ex,
} from "allegro-ts";

import type { BITMAP, SAMPLE } from "allegro-ts";

// Image files
let asteroid_small: BITMAP;
let asteroid_large: BITMAP;
let vortex: BITMAP;
let spaceship: BITMAP;
let gas: BITMAP;
let cursor: BITMAP;
let background: BITMAP;
let main_menu: BITMAP;
let about: BITMAP;
let help: BITMAP;

// Audio files
let music: SAMPLE;
let vortex_sfx: SAMPLE;
let death_sfx: SAMPLE;
let gas_sfx: SAMPLE;

// Spaceship variables
let angle = 0;
let spaceship_x = 500.0;
let spaceship_y = 400.0;
let angle_allegro = 0;
let spaceship_x_velocity = 0.0;
let spaceship_y_velocity = 0.0;
let spaceship_speed = 100;

// Game variables
const gameObjects: GameObject[] = [];
let is_alive = true;
let seconds = 0;
let minutes = 0;

let high_minutes = 0;
let high_seconds = 0;

// Game loop variables
let tick = 0;
let frames = 0;
let GAME_STATE = 0;

// Collision between two given boxes
function collision(
  xMin1: number,
  xMax1: number,
  xMin2: number,
  xMax2: number,
  yMin1: number,
  yMax1: number,
  yMin2: number,
  yMax2: number
) {
  if (xMin1 < xMax2 && yMin1 < yMax2 && xMin2 < xMax1 && yMin2 < yMax1) {
    return true;
  }
  return false;
}

// Checks if the given box has been left clicked
function location_clicked(
  min_x: number,
  max_x: number,
  min_y: number,
  max_y: number
) {
  return Boolean(
    mouse_x > min_x &&
      mouse_x < max_x &&
      mouse_y > min_y &&
      mouse_y < max_y &&
      (mouse_b & 1 || mouse_b & 2)
  );
}

// Finds angle of point 2 relative to point 1
function find_angle(x_1: number, y_1: number, x_2: number, y_2: number) {
  return Math.atan2(x_1 - x_2, y_1 - y_2) * (255.0 / (2.0 * Math.PI));
}

// Game object (asteroids, vortex, gas) class declaration
class GameObject {
  public type: number;

  public x: number;

  public y: number;

  public x_velocity: number;

  public y_velocity: number;

  public constructor(
    x: number,
    y: number,
    type: number,
    x_velocity: number,
    y_velocity: number
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.x_velocity = x_velocity;
    this.y_velocity = y_velocity;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getType() {
    return this.type;
  }

  public draw() {
    switch (this.type) {
      case 0:
        draw_sprite(screen, asteroid_small, this.x, this.y);
        break;

      case 1:
        draw_sprite(screen, asteroid_large, this.x, this.y);
        break;

      case 2:
        rotate_sprite(screen, vortex, this.x, this.y, angle);
        break;

      case 3:
        draw_sprite(screen, gas, this.x, this.y);
        break;

      default:
        break;
    }
  }

  // eslint-disable-next-line max-lines-per-function
  public update() {
    if (GAME_STATE === 1) {
      switch (this.type) {
        case 0:
          if (this.x > spaceship_x) this.x -= 0.5;
          if (this.x < spaceship_x) this.x += 0.5;
          if (this.y < spaceship_y) this.y += 0.5;
          if (this.y > spaceship_y) this.y -= 0.5;

          if (
            collision(
              this.x + 5,
              this.x + 40,
              spaceship_x,
              spaceship_x + 30,
              this.y + 5,
              this.y + 30,
              spaceship_y,
              spaceship_y + 30
            )
          ) {
            is_alive = false;
            play_sample(death_sfx);
          }
          break;
        case 1:
          this.x += this.x_velocity;
          this.y += this.y_velocity;

          if (
            collision(
              this.x + 10,
              this.x + 82,
              spaceship_x + 10,
              spaceship_x + 30,
              this.y + 10,
              this.y + 90,
              spaceship_y + 10,
              spaceship_y + 30
            )
          ) {
            is_alive = false;
            play_sample(death_sfx);
          }
          break;

        case 2:
          if (
            collision(
              this.x + 10,
              this.x + 30,
              spaceship_x + 10,
              spaceship_x + 30,
              this.y + 10,
              this.y + 30,
              spaceship_y + 10,
              spaceship_y + 30
            )
          ) {
            is_alive = false;
            play_sample(vortex_sfx);
          }
          break;

        case 3:
          if (
            collision(
              this.x,
              this.x + 32,
              spaceship_x + 10,
              spaceship_x + 30,
              this.y,
              this.y + 32,
              spaceship_y + 10,
              spaceship_y + 30
            )
          ) {
            play_sample(gas_sfx);
            if (spaceship_speed > 10) spaceship_speed -= 10;
            gameObjects.splice(gameObjects.indexOf(this), 1);
          }
          break;

        default:
          break;
      }
    }
  }
}

function create_asteroid(newType: number, newSpeed: number) {
  let random_x = 0;
  let random_y = 0;

  if (newType === 1 || newType === 0) {
    const side = Math.ceil(Math.random() * 4);

    if (newType === 1) {
      random_x = Math.random() * newSpeed - 1;
      random_y = Math.random() * newSpeed - 1;
    }

    if (side === 1) {
      gameObjects.push(
        new GameObject(Math.random() * 960, -50, newType, random_x, random_y)
      );
    }
    if (side === 2) {
      gameObjects.push(
        new GameObject(Math.random() * 960, 720, newType, random_x, random_y)
      );
    }
    if (side === 3) {
      gameObjects.push(
        new GameObject(
          960,
          -25 + Math.random() * 720,
          newType,
          random_x,
          random_y
        )
      );
    }
    if (side === 4) {
      gameObjects.push(
        new GameObject(
          -50,
          -25 + Math.random() * 720,
          newType,
          random_x,
          random_y
        )
      );
    }
  } else if (newType === 2) {
    gameObjects.push(
      new GameObject(
        Math.random() * 960,
        Math.random() * 720,
        newType,
        random_x,
        random_y
      )
    );
  } else if (newType === 3) {
    gameObjects.push(
      new GameObject(
        100 + Math.random() * 760,
        100 + Math.random() * 520,
        newType,
        random_x,
        random_y
      )
    );
  }
}

// Called at the beginning of the game to clean up game
function restart_game() {
  spaceship_speed = 100;
  is_alive = true;
  seconds = 0;
  frames = 0;
  minutes = 0;
  gameObjects.splice(0, gameObjects.length);
  create_asteroid(0, 0);
  create_asteroid(0, 0);
  create_asteroid(0, 0);
  spaceship_x = 450;
  spaceship_y = 350;
}

function draw() {
  if (GAME_STATE === 1) {
    draw_sprite(screen, background, 0, 0);

    if (is_alive) {
      rotate_sprite(screen, spaceship, spaceship_x, spaceship_y, angle_allegro);
    }

    for (const obj of gameObjects) {
      obj.draw();
    }

    if (is_alive) {
      textout_ex(
        screen,
        font,
        `${high_minutes}:${String(high_seconds).padStart(2, "0")}`,
        5,
        40,
        40,
        makecol(255, 255, 255)
      );

      textout_ex(
        screen,
        font,
        `${minutes}:${String(seconds).padStart(2, "0")}`,
        5,
        80,
        40,
        makecol(255, 255, 255)
      );
    }
    if (!is_alive) {
      textout_ex(
        screen,
        font,
        "You died. Press R to restart",
        0,
        40,
        40,
        makecol(255, 255, 255)
      );

      let text = `${minutes}:${String(seconds).padStart(2, "0")}`;

      if (
        high_minutes < minutes ||
        (high_minutes === minutes && seconds > high_seconds)
      ) {
        text = `New Highscore!: ${text}`;
      }
      textout_ex(screen, font, text, 5, 80, 40, makecol(255, 255, 255));
    }
  }
  if (GAME_STATE === 0) {
    draw_sprite(screen, background, 0, 0);
    draw_sprite(screen, main_menu, 0, 0);
  }
  if (GAME_STATE === 2) {
    draw_sprite(screen, background, 0, 0);
    draw_sprite(screen, help, 0, 0);
  }
  if (GAME_STATE === 3) {
    draw_sprite(screen, background, 0, 0);
    draw_sprite(screen, about, 0, 0);
  }

  draw_sprite(screen, cursor, mouse_x, mouse_y);
}

function update() {
  tick += 1;

  if (GAME_STATE === 1) {
    if (key[KEY_B]) {
      GAME_STATE = 0;
      restart_game();
    }
    if (key[KEY_R]) restart_game();

    if (is_alive) {
      frames += 1;
      if (
        high_minutes > minutes ||
        (high_minutes === minutes && seconds > high_seconds)
      ) {
        high_minutes = minutes;
        high_seconds = seconds;
      }
    }

    if (frames === 60) {
      seconds += 1;
      frames = 0;

      if (Math.ceil(Math.random() * 10) === 1) {
        create_asteroid(3, 0);
      }
    }
    if (seconds % 10 === 0 && frames === 0) {
      if (minutes > 0) {
        for (let i = 0; i < (minutes + 1) * 5; i += 1) {
          create_asteroid(1, (minutes + 1) * 2);
        }
      }
      for (let i = 0; i < (minutes + 1) * 3; i += 1) {
        create_asteroid(0, 0);
        create_asteroid(2, 0);
      }
    }
    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    for (let i = 0; i < gameObjects.length; i += 1) {
      if (
        gameObjects[i].getX() > 1300 ||
        gameObjects[i].getX() < -200 ||
        gameObjects[i].getY() < -200 ||
        gameObjects[i].getY() > 1300
      ) {
        gameObjects.splice(i, 1);
      }

      gameObjects[i].update();
    }

    angle += 1;

    if (angle >= 256) angle = 0;

    if (is_alive) {
      angle_allegro = find_angle(spaceship_x, spaceship_y, mouse_x, mouse_y);

      spaceship_x_velocity = -(spaceship_x - mouse_x) / spaceship_speed;
      spaceship_y_velocity = -(spaceship_y - mouse_y) / spaceship_speed;

      spaceship_x += spaceship_x_velocity;
      spaceship_y += spaceship_y_velocity;
    } else {
      spaceship_x = 10000;
      spaceship_y = 10000;
    }

    if (spaceship_x > 960 - 46) spaceship_x = 960 - 46;

    if (spaceship_x < 0) spaceship_x = 0;

    if (spaceship_y > 720 - 46) spaceship_y = 720 - 46;

    if (spaceship_y < 0) spaceship_y = 0;
  }

  if (GAME_STATE === 0 && tick > 10) {
    // If (mouse_x < 0) mouse_x = 0;

    // If (mouse_y < 0) mouse_y = 0;

    // If (mouse_x > 960 - 16) mouse_x = 960 - 16;

    // If (mouse_y > 720 - 16) mouse_y = 720 - 16;

    if (location_clicked(290, 700, 360, 460)) {
      tick = 0;
      restart_game();
      create_asteroid(0, 0);
      create_asteroid(0, 0);
      create_asteroid(0, 0);
      GAME_STATE = 1;
    }
    if (location_clicked(290, 700, 460, 560)) {
      tick = 0;
      GAME_STATE = 2;
    }
    if (location_clicked(290, 700, 560, 660)) {
      tick = 0;
      GAME_STATE = 3;
    }
  }
  if (GAME_STATE === 2 || GAME_STATE === 3) {
    if (mouse_b & 1 && tick > 10) {
      GAME_STATE = 0;
      tick = 0;
    }
    if (key[KEY_B]) {
      GAME_STATE = 0;
    }
  }
}

async function setup() {
  // Website path
  background = load_bmp("assets/images/background.png");
  main_menu = load_bmp("assets/images/main_menu.png");
  asteroid_large = load_bmp("assets/images/asteroid_large.png");
  asteroid_small = load_bmp("assets/images/asteroid_small.png");
  spaceship = load_bmp("assets/images/spaceship.png");
  vortex = load_bmp("assets/images/vortex.png");
  help = load_bmp("assets/images/help.png");
  about = load_bmp("assets/images/about.png");

  gas = load_bmp("assets/images/gas.png");
  cursor = load_bmp("assets/images/cursor.png");

  music = await load_sample("assets/audio/music.mp3");
  vortex_sfx = await load_sample("assets/audio/vortex_sfx.mp3");
  death_sfx = await load_sample("assets/audio/death_sfx.mp3");
  gas_sfx = await load_sample("assets/audio/gas_sfx.mp3");

  play_sample(music, 255, 1000, 1);
}

async function main() {
  enable_debug("debug");

  allegro_init();
  install_mouse();
  install_keyboard();
  install_sound(DIGI_AUTODETECT, MIDI_AUTODETECT);
  set_gfx_mode(GFX_AUTODETECT_WINDOWED, 960, 720);

  await setup();

  while (!key[KEY_ESC]) {
    clear_to_color(screen, makecol(255, 255, 255));
    update();
    draw();
    // eslint-disable-next-line no-await-in-loop
    await rest(10);
  }

  return 0;
}
END_OF_MAIN();

init_allegro_ts("game_canvas", main);
