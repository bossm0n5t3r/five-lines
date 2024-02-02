const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE,
  FALLING_STONE,
  BOX,
  FALLING_BOX,
  KEY1,
  LOCK1,
  KEY2,
  LOCK2,
}

interface FaillingState {
  isFalling(): boolean;
  isResting(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class Failling implements FaillingState {
  isFalling(): boolean {
    return true;
  }
  isResting(): boolean {
    return false;
  }
  moveHorizontal(tile: Tile, dx: number): void {}
}

class Resting implements FaillingState {
  isFalling(): boolean {
    return false;
  }
  isResting(): boolean {
    return true;
  }

  moveHorizontal(tile: Tile, dx: number): void {
    if (
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }
}

class FallStrategy {
  constructor(private falling: FaillingState) {}

  getFalling(): FaillingState {
    return this.falling;
  }

  update(tile: Tile, x: number, y: number): void {
    this.falling = map[y + 1][x].isAir() ? new Failling() : new Resting();
    this.drop(tile, x, y);
  }

  private drop = (tile: Tile, x: number, y: number): void => {
    if (this.falling.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  };
}

interface Tile {
  isAir(): boolean;
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isKey1(): boolean;
  isLock1(): boolean;
  isKey2(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;

  isEdible(): boolean;
  isPushable(): boolean;

  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;

  isStony(): boolean;
  isBoxy(): boolean;

  drop(): void;
  rest(): void;

  isFalling(): boolean;
  canFall(): boolean;

  update(x: number, y: number): void;
}

class Air implements Tile {
  isAir(): boolean {
    return true;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {}

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

class Flux implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return true;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = '#ccffcc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

class Unbreakable implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return true;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = '#999999';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

class Player implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return true;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {}

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(private falling: FaillingState) {
    this.fallStrategy = new FallStrategy(falling);
  }

  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return true;
  }
  isFallingStone(): boolean {
    return this.falling.isFalling();
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = '#0000cc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {
    this.falling = new Failling();
  }
  rest(): void {
    this.falling = new Resting();
  }

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {
    this.fallStrategy.update(this, x, y);
  }
}

class Box implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return true;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = '#8b4513';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {
    if (
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = map[playery][playerx + dx];
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {
    if (map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }
}

class FallingBox implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return true;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = '#8b4513';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {
    if (map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }
}

class Key implements Tile {
  constructor(private keyConfiguration: KeyConfiguration) {}

  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = this.keyConfiguration.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {
    this.keyConfiguration.removeLock();
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number): void {
    this.keyConfiguration.removeLock();
    moveToTile(playerx, playery + dy);
  }

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

class LOCK implements Tile {
  constructor(private keyConfiguration: KeyConfiguration) {}

  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isLock1(): boolean {
    return this.keyConfiguration.is1();
  }
  isKey2(): boolean {
    return false;
  }
  isLock2(): boolean {
    return !this.keyConfiguration.is1();
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = this.keyConfiguration.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}

  isStony(): boolean {
    return this.isStone() || this.isFallingStone();
  }

  isBoxy(): boolean {
    return this.isBox() || this.isFallingBox();
  }

  drop(): void {}
  rest(): void {}

  isFalling(): boolean {
    return this.isFallingStone() || this.isFallingBox();
  }
  canFall(): boolean {
    return this.isStony() || this.isBoxy();
  }

  update(x: number, y: number): void {}
}

enum RawInput {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface Input {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
  handle(): void;
}

class Right implements Input {
  isRight(): boolean {
    return true;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }

  handle() {
    map[playery][playerx + 1].moveHorizontal(1);
  }
}

class Left implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return true;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }

  handle() {
    map[playery][playerx - 1].moveHorizontal(-1);
  }
}

class Up implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return true;
  }
  isDown(): boolean {
    return false;
  }

  handle() {
    map[playery - 1][playerx].moveVertical(-1);
  }
}

class Down implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return true;
  }

  handle() {
    map[playery + 1][playerx].moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];

const assertExhausted = (x: never): never => {
  throw new Error('Unexpected object: ' + x);
};

const transformTile = (tile: RawTile) => {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.FLUX:
      return new Flux();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.PLAYER:
      return new Player();
    case RawTile.STONE:
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Failling());
    case RawTile.BOX:
      return new Box();
    case RawTile.FALLING_BOX:
      return new FallingBox();
    case RawTile.KEY1:
      return new Key(YELLOW_KEY);
    case RawTile.LOCK1:
      return new LOCK(YELLOW_KEY);
    case RawTile.KEY2:
      return new Key(SKY_BLUE_KEY);
    case RawTile.LOCK2:
      return new LOCK(SKY_BLUE_KEY);
    default:
      assertExhausted(tile);
  }
};

const transformMap = () => {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
};

let inputs: Input[] = [];

const remove = (shouldRemove: RemoveStrategy) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
};

class RemoveLock1 implements RemoveStrategy {
  check = (tile: Tile) => {
    return tile.isLock1();
  };
}

class RemoveLock2 implements RemoveStrategy {
  check = (tile: Tile) => {
    return tile.isLock2();
  };
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function update() {
  handleInputs();
  updateMap();
}

const handleInputs = () => {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.handle();
  }
};

const updateMap = () => {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(x, y);
    }
  }
};

const createGraphics = () => {
  let canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
  let g = canvas.getContext('2d');

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
};

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

const drawMap = (g: CanvasRenderingContext2D) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
};

const drawPlayer = (g: CanvasRenderingContext2D) => {
  g.fillStyle = '#ff0000';
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
};

const LEFT_KEY = 'ArrowLeft';
const UP_KEY = 'ArrowUp';
const RIGHT_KEY = 'ArrowRight';
const DOWN_KEY = 'ArrowDown';
window.addEventListener('keydown', (e) => {
  if (e.key === LEFT_KEY || e.key === 'a') inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === 'w') inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === 'd') inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === 's') inputs.push(new Down());
});

class KeyConfiguration {
  constructor(
    private color: string,
    private _1: boolean,
    private removeStrategy: RemoveStrategy,
  ) {}

  getColor = () => this.color;
  is1 = () => this._1;

  removeLock() {
    remove(this.removeStrategy);
  }
}

const YELLOW_KEY = new KeyConfiguration('#ffcc00', true, new RemoveLock1());
const SKY_BLUE_KEY = new KeyConfiguration('#00ccff', false, new RemoveLock2());
