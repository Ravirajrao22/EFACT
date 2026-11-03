# EFACT Studio - Next-Gen K-12 Robotics & Python Learning Platform

> **"Students don't lack attention. They reject being patronized."**  
> EFACT Studio is an in-browser robotics simulator and STEM education platform created for school students (Grades 6–12, ages 11–17). It provides a real-time, bidirectional bridge from visual logic blocks to genuine Python 3 code.

---

## 🚀 Key Features

1. **Interactive In-Browser Robotics Arena (HTML5 Canvas 2D)**:
   - 10×10 tile grid world with animated top-down rover, responsive DPR scaling, smooth heading and coordinate interpolation.
   - Dynamic sensors: Ultrasonic distance raycasting cone, optical line sensor, and target docking detection.
   - Real physics collision response: Bonk shake, squash-and-stretch collision animations, and precise error coordinates.

2. **The "Live Bridge" Blocks-to-Python Engine**:
   - Visual block palette (Move, Sense, Control, Actions, Logic, Variables).
   - Bi-directional synchronized highlighting: Hovering a block highlights its exact corresponding Python lines in violet, and vice-versa.
   - Real Python 3 subset step-by-step interpreter (no external runtime required, supports `for`, `while`, `if/else`, variables, recursion, functions, and robot hardware API).
   - Infinite loop protection capped at 5,000 steps with humanized error tips.

3. **6+ Data-Driven Missions**:
   - Level 1: **First Steps** (Sequence & timing)
   - Level 2: **Corner Turner** (Orientation & turning)
   - Level 3: **Square Dance** (Loops & repetition)
   - Level 4: **Don't Hit the Wall** (Sensors & `while` conditions)
   - Level 5: **Star Collector** (Effector manipulation & multi-waypoint navigation)
   - Level 6: **Line Follower** (Optical track following feedback loop)
   - Level 7: **Maze Runner** (Autonomous exploration & wall-following algorithms)

4. **Maker's Workbench Visual Identity**:
   - Playful Neo-Brutalist design language with warm paper background (`#FFF8EC`), blueprint grid lines, 2.5px ink outlines, and hard 5px/8px offset drop shadows.
   - High-contrast typography: Bricolage Grotesque (headings), DM Sans (body), and JetBrains Mono (code).
   - Full keyboard accessibility, semantic markup, and `prefers-reduced-motion` compliance.

---

## 🛠️ Getting Started & Local Development

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd RIG

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 🧩 How to Add New Missions (`/src/sim/levels.ts`)

Missions in EFACT Studio are data-driven. To add a new level, open [`src/sim/levels.ts`](file:///c:/Users/ravir/OneDrive/Desktop/RIG/src/sim/levels.ts) and append a new level definition to the `LEVELS` array:

```typescript
{
  id: 8,
  slug: 'slalom-course',
  title: 'Slalom Course',
  subtitle: 'Weave between hazard pillars without hitting obstacles.',
  whyItMatters: 'Autonomous ground vehicles dynamically recalculate paths around sudden roadblocks.',
  concepts: ['pathing', 'collision-avoidance', 'sensors'],
  unlockedCategories: ['move', 'sense', 'control'],
  start: { x: 1, y: 1, dir: 0 }, // 0: East, 1: South, 2: West, 3: North
  goal: { x: 8, y: 8 },
  requiredStars: 0,
  parBlocks: 8,
  parSteps: 22,
  hint: 'Check wall_ahead() and turn before colliding.',
  starterBlocks: [],
  grid: (() => {
    const g = makeEmptyGrid();
    // Configure 10x10 tile types: 'floor' | 'wall' | 'goal' | 'star' | 'line' | 'start'
    for (let i = 0; i < 10; i++) {
      g[0][i] = 'wall';
      g[9][i] = 'wall';
      g[i][0] = 'wall';
      g[i][9] = 'wall';
    }
    g[1][1] = 'start';
    g[8][8] = 'goal';
    return g;
  })(),
}
```

The simulator will automatically register the mission in the mission dropdown, the curriculum mission board, and calculate unlock progressions.

---

## 🎮 Easter Egg
Try entering the classic **Konami Code** on your keyboard anywhere on the page:  
`↑ ↑ ↓ ↓ ← → ← → B A`  
Watch the robot execute an overdrive turbo spin with a nod of respect printed to your developer console!

---

## 📄 License & Ownership
Copyright © 2026 EFACT Robotics Private Limited. All rights reserved.

