import { LevelData, TileType } from './levels';

export interface Point {
  x: number;
  y: number;
}

export type RobotStatus = 'idle' | 'running' | 'paused' | 'crashed' | 'completed';

export interface RobotState {
  x: number;
  y: number;
  dir: number; // 0: E, 1: S, 2: W, 3: N
  carrying: number;
  trail: Point[];
  status: RobotStatus;
  lastError: string | null;
  starsRemaining: Point[];
}

export interface EngineStats {
  stepsTaken: number;
  blocksUsed: number;
  starsCollected: number;
}

export class SimEngine {
  public level: LevelData;
  public grid: TileType[][];
  public state: RobotState;
  public stats: EngineStats;
  public collisionPoint: Point | null = null;
  public onLogMessage?: (msg: string, type: 'info' | 'error' | 'say') => void;

  // Directions: 0: E (+x), 1: S (+y), 2: W (-x), 3: N (-y)
  private static readonly DIRS: Point[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];

  constructor(level: LevelData, blocksCount: number = 0) {
    this.level = level;
    this.grid = level.grid.map((row) => [...row]);
    
    // Find stars in grid
    const stars: Point[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (this.grid[y][x] === 'star') {
          stars.push({ x, y });
        }
      }
    }

    this.state = {
      x: level.start.x,
      y: level.start.y,
      dir: level.start.dir,
      carrying: 0,
      trail: [{ x: level.start.x, y: level.start.y }],
      status: 'idle',
      lastError: null,
      starsRemaining: stars,
    };

    this.stats = {
      stepsTaken: 0,
      blocksUsed: blocksCount,
      starsCollected: 0,
    };
  }

  public reset(blocksCount?: number) {
    this.grid = this.level.grid.map((row) => [...row]);
    const stars: Point[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (this.grid[y][x] === 'star') {
          stars.push({ x, y });
        }
      }
    }

    this.state = {
      x: this.level.start.x,
      y: this.level.start.y,
      dir: this.level.start.dir,
      carrying: 0,
      trail: [{ x: this.level.start.x, y: this.level.start.y }],
      status: 'idle',
      lastError: null,
      starsRemaining: stars,
    };

    this.stats = {
      stepsTaken: 0,
      blocksUsed: blocksCount !== undefined ? blocksCount : this.stats.blocksUsed,
      starsCollected: 0,
    };
    this.collisionPoint = null;
  }

  public clearTrail() {
    this.state.trail = [{ x: this.state.x, y: this.state.y }];
  }

  // SENSORS
  public distance(): number {
    const d = SimEngine.DIRS[this.state.dir];
    let dist = 0;
    let currX = this.state.x + d.x;
    let currY = this.state.y + d.y;

    while (currX >= 0 && currX < 10 && currY >= 0 && currY < 10) {
      if (this.grid[currY][currX] === 'wall') {
        return dist;
      }
      dist++;
      currX += d.x;
      currY += d.y;
    }
    return dist;
  }

  public wall_ahead(): boolean {
    const d = SimEngine.DIRS[this.state.dir];
    const targetX = this.state.x + d.x;
    const targetY = this.state.y + d.y;

    if (targetX < 0 || targetX >= 10 || targetY < 0 || targetY >= 10) {
      return true;
    }
    return this.grid[targetY][targetX] === 'wall';
  }

  public on_line(): boolean {
    const currentTile = this.grid[this.state.y][this.state.x];
    return currentTile === 'line';
  }

  public at_goal(): boolean {
    const isAtGoalTile = this.state.x === this.level.goal.x && this.state.y === this.level.goal.y;
    const hasEnoughStars = this.stats.starsCollected >= this.level.requiredStars;
    return isAtGoalTile && hasEnoughStars;
  }

  public steps(): number {
    return this.stats.stepsTaken;
  }

  public stars(): number {
    return this.stats.starsCollected;
  }

  public facing(): 'N' | 'E' | 'S' | 'W' {
    const DIR_NAMES: ('E' | 'S' | 'W' | 'N')[] = ['E', 'S', 'W', 'N'];
    return DIR_NAMES[this.state.dir];
  }

  public position(): [number, number] {
    return [this.state.x, this.state.y];
  }

  // ACTIONS
  public stepForward(): boolean {
    if (this.state.status === 'crashed' || this.state.status === 'completed') return false;

    const d = SimEngine.DIRS[this.state.dir];
    const newX = this.state.x + d.x;
    const newY = this.state.y + d.y;

    if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10 || this.grid[newY][newX] === 'wall') {
      this.state.status = 'crashed';
      this.collisionPoint = { x: newX, y: newY };
      const err = `Bonk! Wall at (${newX}, ${newY}). Check your forward count.`;
      this.state.lastError = err;
      this.onLogMessage?.(err, 'error');
      return false;
    }

    this.state.x = newX;
    this.state.y = newY;
    this.state.trail.push({ x: newX, y: newY });
    this.stats.stepsTaken++;

    this.checkCompletion();
    return true;
  }

  public stepBackward(): boolean {
    if (this.state.status === 'crashed' || this.state.status === 'completed') return false;

    const d = SimEngine.DIRS[(this.state.dir + 2) % 4];
    const newX = this.state.x + d.x;
    const newY = this.state.y + d.y;

    if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10 || this.grid[newY][newX] === 'wall') {
      this.state.status = 'crashed';
      this.collisionPoint = { x: newX, y: newY };
      const err = `Bonk! Hit obstacle behind at (${newX}, ${newY}).`;
      this.state.lastError = err;
      this.onLogMessage?.(err, 'error');
      return false;
    }

    this.state.x = newX;
    this.state.y = newY;
    this.state.trail.push({ x: newX, y: newY });
    this.stats.stepsTaken++;

    this.checkCompletion();
    return true;
  }

  public turnLeft() {
    if (this.state.status === 'crashed' || this.state.status === 'completed') return;
    this.state.dir = (this.state.dir + 3) % 4;
    this.stats.stepsTaken++;
  }

  public turnRight() {
    if (this.state.status === 'crashed' || this.state.status === 'completed') return;
    this.state.dir = (this.state.dir + 1) % 4;
    this.stats.stepsTaken++;
  }

  public pickUp(): boolean {
    const starIdx = this.state.starsRemaining.findIndex(
      (s) => s.x === this.state.x && s.y === this.state.y
    );
    if (starIdx !== -1) {
      this.state.starsRemaining.splice(starIdx, 1);
      this.state.carrying++;
      this.stats.starsCollected++;
      this.onLogMessage?.(`Picked up star! (${this.stats.starsCollected}/${this.level.requiredStars})`, 'info');
      this.checkCompletion();
      return true;
    } else {
      this.onLogMessage?.(`Nothing to pick up at (${this.state.x}, ${this.state.y})`, 'info');
      return false;
    }
  }

  public drop(): boolean {
    if (this.state.carrying > 0) {
      this.state.carrying--;
      this.state.starsRemaining.push({ x: this.state.x, y: this.state.y });
      this.onLogMessage?.(`Dropped item at (${this.state.x}, ${this.state.y})`, 'info');
      return true;
    }
    return false;
  }

  public say(text: string) {
    this.onLogMessage?.(`[bot] ${text}`, 'say');
  }

  private checkCompletion() {
    if (this.at_goal()) {
      this.state.status = 'completed';
      this.onLogMessage?.(
        `Mission clear: ${this.stats.blocksUsed} blocks, ${this.stats.stepsTaken} steps.`,
        'info'
      );
    }
  }
}

