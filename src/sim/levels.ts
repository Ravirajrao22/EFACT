import { BlockCategory, BlockItem } from './blocks';

export type TileType = 'floor' | 'wall' | 'goal' | 'star' | 'line' | 'hazard' | 'start';

export interface LevelData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  whyItMatters: string;
  concepts: string[];
  grid: TileType[][]; // 10x10
  start: { x: number; y: number; dir: number }; // dir: 0: East, 1: South, 2: West, 3: North
  goal: { x: number; y: number };
  requiredStars: number;
  parBlocks: number;
  parSteps: number;
  hint: string;
  unlockedCategories: BlockCategory[];
  starterBlocks: BlockItem[];
}

// 10x10 grid helper
function makeEmptyGrid(): TileType[][] {
  return Array.from({ length: 10 }, () => Array(10).fill('floor' as TileType));
}

export const LEVELS: LevelData[] = [
  // Level 1: First Steps
  {
    id: 1,
    slug: 'first-steps',
    title: 'First Steps',
    subtitle: 'Drive forward 5 steps directly to the docking pad.',
    whyItMatters: 'Computers do exactly what you specify in sequential order—nothing more, nothing less.',
    concepts: ['sequence', 'forward'],
    unlockedCategories: ['move'],
    start: { x: 2, y: 5, dir: 0 },
    goal: { x: 7, y: 5 },
    requiredStars: 0,
    parBlocks: 1,
    parSteps: 5,
    hint: 'Use a single "move forward" block with 5 steps, or stack forward blocks.',
    starterBlocks: [
      { id: 'b_init_1', type: 'forward', category: 'move', valNumber: 5 }
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        g[0][i] = 'wall';
        g[9][i] = 'wall';
        g[i][0] = 'wall';
        g[i][9] = 'wall';
      }
      g[5][2] = 'start';
      g[5][7] = 'goal';
      return g;
    })(),
  },

  // Level 2: Corner Turner
  {
    id: 2,
    slug: 'corner-turner',
    title: 'Corner Turner',
    subtitle: 'Navigate an L-shaped corridor with right-angle turns.',
    whyItMatters: 'Orientation matters in physical computing. A robot’s left is its own left, not yours.',
    concepts: ['turns', 'orientation'],
    unlockedCategories: ['move'],
    start: { x: 2, y: 2, dir: 0 },
    goal: { x: 6, y: 7 },
    requiredStars: 0,
    parBlocks: 3,
    parSteps: 9,
    hint: 'Move forward 4 steps, turn right, then move forward 5 steps.',
    starterBlocks: [
      { id: 'b_ct_1', type: 'forward', category: 'move', valNumber: 4 },
      { id: 'b_ct_2', type: 'turn_right', category: 'move' },
      { id: 'b_ct_3', type: 'forward', category: 'move', valNumber: 5 },
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          g[i][j] = 'wall';
        }
      }
      // Carve corridor: (2,2) to (6,2), then (6,2) to (6,7)
      for (let x = 2; x <= 6; x++) g[2][x] = 'floor';
      for (let y = 2; y <= 7; y++) g[y][6] = 'floor';
      g[2][2] = 'start';
      g[7][6] = 'goal';
      return g;
    })(),
  },

  // Level 3: Square Dance
  {
    id: 3,
    slug: 'square-dance',
    title: 'Square Dance',
    subtitle: 'Trace a 3x3 square perimeter and arrive back at start.',
    whyItMatters: 'Repetition is what makes software powerful. Never write the same instruction 4 times.',
    concepts: ['loops', 'repeat'],
    unlockedCategories: ['move', 'control'],
    start: { x: 3, y: 3, dir: 0 },
    goal: { x: 3, y: 3 },
    requiredStars: 0,
    parBlocks: 3,
    parSteps: 12,
    hint: 'Put "forward(3)" and "turn_right()" inside a "repeat 4 times" loop.',
    starterBlocks: [
      {
        id: 'b_sd_1',
        type: 'repeat_times',
        category: 'control',
        valNumber: 4,
        children: [
          { id: 'b_sd_2', type: 'forward', category: 'move', valNumber: 3 },
          { id: 'b_sd_3', type: 'turn_right', category: 'move' }
        ]
      }
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        g[0][i] = 'wall';
        g[9][i] = 'wall';
        g[i][0] = 'wall';
        g[i][9] = 'wall';
      }
      g[3][3] = 'goal';
      return g;
    })(),
  },

  // Level 4: Don't Hit the Wall
  {
    id: 4,
    slug: 'dont-hit-the-wall',
    title: "Don't Hit the Wall",
    subtitle: 'Navigate an unknown corridor stopping right at the goal pad.',
    whyItMatters: 'Real robots operate in dynamic environments where distance cannot be hardcoded.',
    concepts: ['sensors', 'while loops', 'conditions'],
    unlockedCategories: ['move', 'control', 'sense'],
    start: { x: 1, y: 4, dir: 0 },
    goal: { x: 7, y: 4 },
    requiredStars: 0,
    parBlocks: 2,
    parSteps: 6,
    hint: 'Use "repeat while" with condition "not at_goal()" and step forward.',
    starterBlocks: [
      {
        id: 'b_dhw_1',
        type: 'while_cond',
        category: 'control',
        condition: { type: 'not_at_goal' },
        children: [
          { id: 'b_dhw_2', type: 'forward', category: 'move', valNumber: 1 }
        ]
      }
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          g[i][j] = 'wall';
        }
      }
      for (let x = 1; x <= 8; x++) g[4][x] = 'floor';
      g[4][1] = 'start';
      g[4][7] = 'goal';
      return g;
    })(),
  },

  // Level 5: Star Collector
  {
    id: 5,
    slug: 'star-collector',
    title: 'Star Collector',
    subtitle: 'Collect stars scattered across the room, then dock at the goal.',
    whyItMatters: 'Complex missions combine waypoint navigation, state tracking, and effector actions.',
    concepts: ['pick_up', 'pathing', 'multi-objective'],
    unlockedCategories: ['move', 'control', 'action'],
    start: { x: 1, y: 8, dir: 3 }, // Facing North
    goal: { x: 8, y: 1 },
    requiredStars: 3,
    parBlocks: 10,
    parSteps: 22,
    hint: 'Drive to each star coordinate, trigger "pick up item", and reach the goal.',
    starterBlocks: [
      { id: 'b_sc_1', type: 'forward', category: 'move', valNumber: 5 },
      { id: 'b_sc_2', type: 'pick_up', category: 'action' },
      { id: 'b_sc_3', type: 'turn_right', category: 'move' },
      { id: 'b_sc_4', type: 'forward', category: 'move', valNumber: 6 },
      { id: 'b_sc_5', type: 'pick_up', category: 'action' }
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        g[0][i] = 'wall';
        g[9][i] = 'wall';
        g[i][0] = 'wall';
        g[i][9] = 'wall';
      }
      // interior obstacle pillars
      g[3][3] = 'wall';
      g[3][4] = 'wall';
      g[6][5] = 'wall';
      g[6][6] = 'wall';

      g[8][1] = 'start';
      g[1][8] = 'goal';
      g[3][1] = 'star';
      g[3][7] = 'star';
      g[7][4] = 'star';
      return g;
    })(),
  },

  // Level 6: Line Follower
  {
    id: 6,
    slug: 'line-follower',
    title: 'Line Follower',
    subtitle: 'Follow the black track to the docking station using optical sensing.',
    whyItMatters: 'AGVs in automated warehouses rely on floor line following sensors.',
    concepts: ['optical sensor', 'if/else', 'feedback loop'],
    unlockedCategories: ['move', 'control', 'sense', 'logic'],
    start: { x: 1, y: 2, dir: 0 },
    goal: { x: 8, y: 7 },
    requiredStars: 0,
    parBlocks: 6,
    parSteps: 16,
    hint: 'Follow the track: step forward along the line path, turning when needed to reach the goal.',
    starterBlocks: [
      { id: 'b_lf_1', type: 'forward', category: 'move', valNumber: 4 },
      { id: 'b_lf_2', type: 'turn_right', category: 'move' },
      { id: 'b_lf_3', type: 'forward', category: 'move', valNumber: 5 },
      { id: 'b_lf_4', type: 'turn_left', category: 'move' },
      { id: 'b_lf_5', type: 'forward', category: 'move', valNumber: 3 },
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        g[0][i] = 'wall';
        g[9][i] = 'wall';
        g[i][0] = 'wall';
        g[i][9] = 'wall';
      }
      // Line track: (1,2) -> (5,2) -> (5,7) -> (8,7)
      for (let x = 1; x <= 5; x++) g[2][x] = 'line';
      for (let y = 2; y <= 7; y++) g[y][5] = 'line';
      for (let x = 5; x <= 8; x++) g[7][x] = 'line';

      g[2][1] = 'start';
      g[7][8] = 'goal';
      return g;
    })(),
  },

  // Level 7: Maze Runner
  {
    id: 7,
    slug: 'maze-runner',
    title: 'Maze Runner',
    subtitle: 'Find your way through the maze using sensing and logic.',
    whyItMatters: 'Autonomous search-and-rescue robots use wall-following algorithms to escape unknown mazes.',
    concepts: ['algorithms', 'wall following', 'logic'],
    unlockedCategories: ['move', 'control', 'sense', 'logic', 'variable'],
    start: { x: 1, y: 1, dir: 0 },
    goal: { x: 8, y: 8 },
    requiredStars: 0,
    parBlocks: 4,
    parSteps: 28,
    hint: 'Check if wall ahead: if true, turn right; otherwise move forward.',
    starterBlocks: [
      {
        id: 'b_mr_1',
        type: 'while_cond',
        category: 'control',
        condition: { type: 'not_at_goal' },
        children: [
          {
            id: 'b_mr_2',
            type: 'if_then_else',
            category: 'control',
            condition: { type: 'sense_wall_ahead' },
            children: [
              { id: 'b_mr_3', type: 'turn_right', category: 'move' }
            ],
            elseChildren: [
              { id: 'b_mr_4', type: 'forward', category: 'move', valNumber: 1 }
            ]
          }
        ]
      }
    ],
    grid: (() => {
      const g = makeEmptyGrid();
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          g[i][j] = 'wall';
        }
      }
      const paths = [
        [1,1], [2,1], [3,1],
        [3,2], [3,3], [2,3], [1,3], [1,4], [1,5],
        [2,5], [3,5], [4,5], [5,5], [5,4], [5,3], [6,3], [7,3], [8,3],
        [8,4], [8,5], [7,5], [7,6], [7,7], [6,7], [5,7], [5,8], [6,8], [7,8], [8,8]
      ];
      for (const [x, y] of paths) {
        g[y][x] = 'floor';
      }
      g[1][1] = 'start';
      g[8][8] = 'goal';
      return g;
    })(),
  },
];
