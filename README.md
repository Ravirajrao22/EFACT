# EFACT Robotics: Practical STEM Education for K-12 Schools

> **"Equipment doesn't make engineers. Thinking does."**  
> EFACT Robotics partners with K-12 schools and educational institutions to build structured, progressive robotics and coding programmes. We combine proprietary curriculum, dedicated teacher training, hands-on workshop modules, and engineering mentorship in one connected framework.

---

## 🏫 About The Platform

EFACT Robotics is designed specifically for school leadership, academic coordinators, and educators seeking to transform their STEM labs from idle hardware storage into hubs of genuine computational thinking.

### Core Institutional Offerings
1. **Continuous Curriculum (Grades 6–12)**: 30+ structured sessions per grade level covering algorithmic thinking, embedded electronics, sensory feedback loops, and C++/Python robotics.
2. **Teacher Empowerment & Training**: Comprehensive educator playbooks, weekly live office hours, and continuous technical upskilling for existing faculty.
3. **Immersive Workshops & Events**: Multi-day high-energy bootcamps (Autonomous Rovers, Line Tracking, Maze Solving, IoT Weather Stations, Sensor Fusion).
4. **Structured Progression (User → Maker)**: Moving students systematically from visual logic consumers to independent hardware innovators.

---

## 📸 How to Add Photos & Configure the Gallery

All gallery and hero photos are managed via a centralized image manifest at [`src/data/images.ts`](file:///c:/Users/ravir/OneDrive/Desktop/RIG/src/data/images.ts).

### 1. Recommended Image Specifications
- **Hero Photos (`hero-a`, `hero-b`, etc.)**: ~1600px wide, 4:3 or 16:9 aspect ratio, JPG or WebP, optimized under 250 KB.
- **Gallery & In-Action Photos (`workshop-1`, `event-1`, `project-1`, etc.)**: ~1200px wide, 4:3 or 16:9 aspect ratio, JPG or WebP, optimized under 200 KB.
- **Institutional Validation Photos (`lpu`, `dps`)**: 800–1200px wide, JPG or WebP.

### 2. Adding Image Files
1. Save your optimized image files in the `public/images/` directory (e.g. `public/images/hero-1.webp`).
2. Open [`src/data/images.ts`](file:///c:/Users/ravir/OneDrive/Desktop/RIG/src/data/images.ts) and set the `src` field for the corresponding image ID:

```typescript
export const IMAGES: ImageManifest = {
  'hero-a': {
    src: '/images/hero-1.webp', // Point to your file in /public/images/
    alt: 'Students assembling rover chassis during workshop',
    caption: 'Grade 8 students wiring ultrasonic sensors'
  },
  // ...
};
```

### 3. Toggling Placeholder Badges
When images are pending, the UI displays a clean diagonal-hatch architectural placeholder with a corner badge:
- To hide the "PLACEHOLDER" corner badges across the site, open [`src/config.ts`](file:///c:/Users/ravir/OneDrive/Desktop/RIG/src/config.ts) and set:
  ```typescript
  export const SHOW_PLACEHOLDER_BADGE = false;
  ```

---

## 🛠️ Getting Started & Local Development

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Run

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
# Typecheck and compile production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🎨 Design System & Accessibility

- **Palette**: Warm paper canvas (`#FFF8EC`), dense ink borders (`#151426`, 2.5px solid), flat cards with 4px hard offset drop shadows (`shadow-hard`).
- **Typography**: Bricolage Grotesque (headings), DM Sans (body), JetBrains Mono (labels & metrics).
- **Accessibility**: Full keyboard navigation (`Tab` / `Shift+Tab` / `Enter`), high contrast ratios (WCAG AAA compliant for primary ink on paper), and reduced-motion respect.

---

## 📞 Institutional Enquiries & Contact

- **Phone**: +91 83608 38817  
- **Email**: efactrobotics@gmail.com  
- **WhatsApp**: Configured directly in `src/config.ts` for instant demo requests.

---

## 📄 License & Ownership
Copyright © 2026 EFACT Robotics. All rights reserved.
