const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

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
    map.remove(this.removeStrategy);
  }
}

const YELLOW_KEY = new KeyConfiguration('#ffcc00', true, new RemoveLock1());
const SKY_BLUE_KEY = new KeyConfiguration('#00ccff', false, new RemoveLock2());

interface RawTileValue {
  transform(): Tile;
}

class AirValue implements RawTileValue {
  transform() {
    return new Air();
  }
}

class FluxValue implements RawTileValue {
  transform() {
    return new Flux();
  }
}

class UnbreakableValue implements RawTileValue {
  transform() {
    return new Unbreakable();
  }
}

class PlayerValue implements RawTileValue {
  transform() {
    return new PlayerTile();
  }
}

class StoneValue implements RawTileValue {
  transform() {
    return new Stone(new Resting());
  }
}

class FallingStoneValue implements RawTileValue {
  transform() {
    return new Stone(new Falling());
  }
}

class BoxValue implements RawTileValue {
  transform() {
    return new Box(new Resting());
  }
}

class FallingBoxValue implements RawTileValue {
  transform() {
    return new Box(new Falling());
  }
}

class Key1Value implements RawTileValue {
  transform() {
    return new Key(YELLOW_KEY);
  }
}

class Lock1Value implements RawTileValue {
  transform() {
    return new LOCK(YELLOW_KEY);
  }
}
class Key2Value implements RawTileValue {
  transform() {
    return new Key(SKY_BLUE_KEY);
  }
}
class Lock2Value implements RawTileValue {
  transform() {
    return new LOCK(SKY_BLUE_KEY);
  }
}

class RawTile {
  static readonly AIR = new RawTile(new AirValue());
  static readonly FLUX = new RawTile(new FluxValue());
  static readonly UNBREAKABLE = new RawTile(new UnbreakableValue());
  static readonly PLAYER = new RawTile(new PlayerValue());
  static readonly STONE = new RawTile(new StoneValue());
  static readonly FALLING_STONE = new RawTile(new FallingStoneValue());
  static readonly BOX = new RawTile(new BoxValue());
  static readonly FALLING_BOX = new RawTile(new FallingBoxValue());
  static readonly KEY1 = new RawTile(new Key1Value());
  static readonly LOCK1 = new RawTile(new Lock1Value());
  static readonly KEY2 = new RawTile(new Key2Value());
  static readonly LOCK2 = new RawTile(new Lock2Value());
  private constructor(private value: RawTileValue) {}
  transform() {
    return this.value.transform();
  }
}
const RAW_TILES = [
  RawTile.AIR,
  RawTile.FLUX,
  RawTile.UNBREAKABLE,
  RawTile.PLAYER,
  RawTile.STONE,
  RawTile.FALLING_STONE,
  RawTile.BOX,
  RawTile.FALLING_BOX,
  RawTile.KEY1,
  RawTile.LOCK1,
  RawTile.KEY2,
  RawTile.LOCK2,
];

interface Tile {
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(map: Map, player: Player, dx: number): void;
  moveVertical(map: Map, player: Player, dy: number): void;
  update(map: Map, x: number, y: number): void;
  getBlockOnTopState(): FallingState;
}

class Air implements Tile {
  isAir(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Falling();
  }
}

class Flux implements Tile {
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#ccffcc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class Unbreakable implements Tile {
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#999999';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class PlayerTile implements Tile {
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number): void;
  drop(map: Map, tile: Tile, x: number, y: number): void;
}

class Falling {
  isFalling(): boolean {
    return true;
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {}
  drop(map: Map, tile: Tile, x: number, y: number) {
    map.drop(tile, x, y);
  }
}

class Resting {
  isFalling(): boolean {
    return false;
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
    player.pushHorizontal(map, tile, dx);
  }
  drop(map: Map, tile: Tile, x: number, y: number) {}
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#0000cc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState() {
    return new Resting();
  }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#8b4513';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState() {
    return new Resting();
  }
}

class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.keyConf.removeLock(map);
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    this.keyConf.removeLock(map);
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class LOCK implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return this.keyConf.is1();
  }
  isLock2(): boolean {
    return !this.keyConf.is1();
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class FallStrategy {
  constructor(private falling: FallingState) {}
  update(map: Map, tile: Tile, x: number, y: number) {
    this.falling = map.getBlockOnTopState(x, y + 1);
    this.falling.drop(map, tile, x, y);
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
    this.falling.moveHorizontal(map, player, tile, dx);
  }
}

interface Input {
  handle(map: Map, player: Player): void;
}

class Right implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, 1);
  }
}

class Left implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, -1);
  }
}

class Up implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, -1);
  }
}

class Down implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, 1);
  }
}

class Player {
  private x = 1;
  private y = 1;
  draw(g: CanvasRenderingContext2D) {
    g.fillStyle = '#ff0000';
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, dx: number) {
    map.moveHorizontal(this, this.x, this.y, dx);
  }
  moveVertical(map: Map, dy: number) {
    map.moveVertical(this, this.x, this.y, dy);
  }
  move(map: Map, dx: number, dy: number) {
    this.moveToTile(map, this.x + dx, this.y + dy);
  }
  pushHorizontal(map: Map, tile: Tile, dx: number) {
    map.pushHorizontal(this, tile, this.x, this.y, dx);
  }
  moveToTile(map: Map, newx: number, newy: number) {
    map.movePlayer(this.x, this.y, newx, newy);
    this.x = newx;
    this.y = newy;
  }
}

let player = new Player();
let rawMap: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

class Map {
  private _map: Tile[][];
  constructor() {
    this._map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this._map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this._map[y][x] = RAW_TILES[rawMap[y][x]].transform();
      }
    }
  }
  update() {
    for (let y = this._map.length - 1; y >= 0; y--) {
      for (let x = 0; x < this._map[y].length; x++) {
        this._map[y][x].update(this, x, y);
      }
    }
  }
  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this._map.length; y++) {
      for (let x = 0; x < this._map[y].length; x++) {
        this._map[y][x].draw(g, x, y);
      }
    }
  }
  isAir(x: number, y: number) {
    return this._map[y][x].isAir();
  }
  drop(tile: Tile, x: number, y: number) {
    this._map[y + 1][x] = tile;
    this._map[y][x] = new Air();
  }
  getBlockOnTopState(x: number, y: number) {
    return this._map[y][x].getBlockOnTopState();
  }
  movePlayer(x: number, y: number, newx: number, newy: number) {
    this._map[y][x] = new Air();
    this._map[newy][newx] = new PlayerTile();
  }
  moveHorizontal(player: Player, x: number, y: number, dx: number) {
    this._map[y][x + dx].moveHorizontal(this, player, dx);
  }
  moveVertical(player: Player, x: number, y: number, dy: number) {
    this._map[y + dy][x].moveVertical(this, player, dy);
  }
  remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < this._map.length; y++) {
      for (let x = 0; x < this._map[y].length; x++) {
        if (shouldRemove.check(this._map[y][x])) {
          this._map[y][x] = new Air();
        }
      }
    }
  }
  pushHorizontal(player: Player, tile: Tile, x: number, y: number, dx: number) {
    if (
      this._map[y][x + dx + dx].isAir() &&
      !this._map[y + 1][x + dx].isAir()
    ) {
      this._map[y][x + dx + dx] = tile;
      player.moveToTile(this, x + dx, y);
    }
  }
}

let map = new Map();

let inputs: Input[] = [];

const update = (map: Map, player: Player) => {
  handleInputs(map, player);
  map.update();
};

const handleInputs = (map: Map, player: Player) => {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle(map, player);
  }
};

const createGraphics = () => {
  let canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
  let g = canvas.getContext('2d');

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
};

const draw = (map: Map, player: Player) => {
  let g = createGraphics();
  map.draw(g);
  player.draw(g);
};

const gameLoop = (map: Map) => {
  let before = Date.now();
  update(map, player);
  draw(map, player);
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(map), sleep);
};

window.onload = () => {
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
