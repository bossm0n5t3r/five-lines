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
  moveHorizontal(map: Map, tile: Tile, dx: number): void;
}

class Failling implements FaillingState {
  isFalling(): boolean {
    return true;
  }
  isResting(): boolean {
    return false;
  }
  moveHorizontal(map: Map, tile: Tile, dx: number): void {}
}

class Resting implements FaillingState {
  isFalling(): boolean {
    return false;
  }
  isResting(): boolean {
    return true;
  }

  moveHorizontal(map: Map, tile: Tile, dx: number): void {
    player.pushHorizontal(map, tile, dx);
  }
}

class FallStrategy {
  constructor(private falling: FaillingState) {}

  moveHorizontal(map: Map, tile: Tile, dx: number): void {
    this.falling.moveHorizontal(map, tile, dx);
  }

  update(map: Map, tile: Tile, x: number, y: number): void {
    this.falling = map.getMap()[y + 1][x].getBlockOnTopState();
    this.drop(map, tile, x, y);
  }

  private drop = (map: Map, tile: Tile, x: number, y: number): void => {
    if (this.falling.isFalling()) {
      map.getMap()[y + 1][x] = tile;
      map.getMap()[y][x] = new Air();
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

  moveHorizontal(map: Map, player: Player, dx: number): void;
  moveVertical(map: Map, player: Player, dy: number): void;

  isStony(): boolean;
  isBoxy(): boolean;

  drop(): void;
  rest(): void;

  isFalling(): boolean;
  canFall(): boolean;

  update(map: Map, x: number, y: number): void;

  getBlockOnTopState(): FaillingState;
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

  moveHorizontal(map: Map, player: Player, dx: number): void {
    player.move(map, dx, 0);
  }

  moveVertical(map: Map, player: Player, dy: number): void {
    player.move(map, 0, dy);
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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Failling();
  }
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

  moveHorizontal(map: Map, player: Player, dx: number): void {
    player.move(map, dx, 0);
  }

  moveVertical(map: Map, player: Player, dy: number): void {
    player.move(map, 0, dy);
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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
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

  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}

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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
}

class PlayerTile implements Tile {
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

  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}

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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
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

  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(map, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number): void {}

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

  update(map: Map, x: number, y: number): void {
    this.fallStrategy.update(map, this, x, y);
  }

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
}

class Box implements Tile {
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
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return true;
  }
  isFallingBox(): boolean {
    return this.falling.isFalling();
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

  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(map, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number): void {}

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

  update(map: Map, x: number, y: number): void {
    this.fallStrategy.update(map, this, x, y);
  }

  getBlockOnTopState(): FaillingState {
    return new Resting();
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
    this.keyConfiguration.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.keyConfiguration.removeLock(map);
    player.move(map, dx, 0);
  }

  moveVertical(map: Map, player: Player, dy: number): void {
    this.keyConfiguration.removeLock(map);
    player.move(map, 0, dy);
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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
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
    this.keyConfiguration.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible(): boolean {
    return this.isFlux() || this.isAir();
  }

  isPushable(): boolean {
    return this.isStone() || this.isBox();
  }

  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}

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

  update(map: Map, x: number, y: number): void {}

  getBlockOnTopState(): FaillingState {
    return new Resting();
  }
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
  handle(map: Map): void;
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

  handle(map: Map) {
    player.moveHorizontal(map, 1);
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

  handle(map: Map) {
    player.moveHorizontal(map, -1);
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

  handle(map: Map) {
    player.moveVertical(map, -1);
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

  handle(map: Map) {
    player.moveVertical(map, 1);
  }
}

class Player {
  private x = 1;
  private y = 1;

  setX(x: number): void {
    this.x = x;
  }
  setY(y: number): void {
    this.y = y;
  }

  draw(g: CanvasRenderingContext2D): void {
    g.fillStyle = '#ff0000';
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(map: Map, dx: number): void {
    map.getMap()[this.y][this.x + dx].moveHorizontal(map, this, dx);
  }

  moveVertical(map: Map, dy: number): void {
    map.getMap()[this.y + dy][this.x].moveVertical(map, this, dy);
  }

  move(map: Map, dx: number, dy: number): void {
    this.moveToTile(map, this.x + dx, this.y + dy);
  }

  pushHorizontal(map: Map, tile: Tile, dx: number): void {
    if (
      map.getMap()[this.y][this.x + dx + dx].isAir() &&
      !map.getMap()[this.y + 1][this.x + dx].isAir()
    ) {
      map.getMap()[this.y][this.x + dx + dx] = tile;
      this.moveToTile(map, this.x + dx, this.y);
    }
  }

  moveToTile(map: Map, newx: number, newy: number): void {
    map.getMap()[this.y][this.x] = new Air();
    map.getMap()[newy][newx] = new PlayerTile();
    this.x = newx;
    this.y = newy;
  }
}

let player = new Player();

let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

class Map {
  private _map: Tile[][];
  getMap(): Tile[][] {
    return this._map;
  }
  setMap(map: Tile[][]): void {
    this._map = map;
  }

  transform(): void {
    this._map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this._map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this._map[y][x] = transformTile(rawMap[y][x]);
      }
    }
  }

  update(): void {
    for (let y = this._map.length - 1; y >= 0; y--) {
      for (let x = 0; x < this._map[y].length; x++) {
        this._map[y][x].update(map, x, y);
      }
    }
  }
}

let map = new Map();

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
      return new PlayerTile();
    case RawTile.STONE:
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Failling());
    case RawTile.BOX:
      return new Box(new Resting());
    case RawTile.FALLING_BOX:
      return new Box(new Failling());
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

const transformMap = (map: Map) => {
  map.transform();
};

let inputs: Input[] = [];

const remove = (map: Map, shouldRemove: RemoveStrategy) => {
  for (let y = 0; y < map.getMap().length; y++) {
    for (let x = 0; x < map.getMap()[y].length; x++) {
      if (shouldRemove.check(map.getMap()[y][x])) {
        map.getMap()[y][x] = new Air();
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

function moveToTile(map: Map, player: Player, newx: number, newy: number) {
  player.moveToTile(map, newx, newy);
}

function update(map: Map) {
  handleInputs(map);
  updateMap(map);
}

const handleInputs = (map: Map) => {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.handle(map);
  }
};

const updateMap = (map: Map) => {
  map.update();
};

const createGraphics = () => {
  let canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
  let g = canvas.getContext('2d');

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
};

function draw(map: Map) {
  let g = createGraphics();
  drawMap(map, g);
  drawPlayer(g);
}

const drawMap = (map: Map, g: CanvasRenderingContext2D) => {
  for (let y = 0; y < map.getMap().length; y++) {
    for (let x = 0; x < map.getMap()[y].length; x++) {
      map.getMap()[y][x].draw(g, x, y);
    }
  }
};

const drawPlayer = (g: CanvasRenderingContext2D) => {
  player.draw(g);
};

function gameLoop(map: Map) {
  let before = Date.now();
  update(map);
  draw(map);
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(map), sleep);
}

window.onload = () => {
  transformMap(map);
  gameLoop(map);
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

  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }
  is1 = () => this._1;

  removeLock(map: Map) {
    remove(map, this.removeStrategy);
  }
}

const YELLOW_KEY = new KeyConfiguration('#ffcc00', true, new RemoveLock1());
const SKY_BLUE_KEY = new KeyConfiguration('#00ccff', false, new RemoveLock2());
