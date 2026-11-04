/**
 * Image slots for RIG Homepage.
 * To replace a placeholder with a real photograph:
 * Simply set `src` to the image URL or local asset path (e.g., "/images/workshop.webp").
 * Zero layout shift will occur.
 *
 * Final photo guidance:
 * - Real classroom photos only, landscape, at least 1600px wide, optimized under 300KB (WebP/AVIF).
 * - Show students working with hardware and code, not posing for the camera.
 */

export interface HomeImageSlot {
  src?: string;
  alt: string;
  label: string; // 13px muted placeholder label (e.g. "Workshop photo")
}

export interface HomeImagesConfig {
  heroMain: HomeImageSlot;
  heroEvents: HomeImageSlot;
  heroProjects: HomeImageSlot;
  cardWorkshops: HomeImageSlot;
  cardEvents: HomeImageSlot;
  cardProjects: HomeImageSlot;
}

export const HOME_IMAGES: HomeImagesConfig = {
  heroMain: {
    src: undefined, // TODO: owner to confirm when workshop photo is ready
    alt: "Students building and testing microcontroller circuits during a school robotics workshop",
    label: "Workshop photo",
  },
  heroEvents: {
    src: undefined, // TODO: owner to confirm when competition event photo is ready
    alt: "Student robotics team demonstrating autonomous rover navigation at a school event",
    label: "Event photo",
  },
  heroProjects: {
    src: undefined, // TODO: owner to confirm when student project photo is ready
    alt: "Student-engineered robotics prototype with sensors and custom motor chassis",
    label: "Student project photo",
  },
  cardWorkshops: {
    src: undefined, // TODO: owner to confirm
    alt: "Classroom workshop with students transitioning from block logic to Python code on rovers",
    label: "School workshop",
  },
  cardEvents: {
    src: undefined, // TODO: owner to confirm
    alt: "Students competing in an inter-school robotics and engineering challenge",
    label: "National event",
  },
  cardProjects: {
    src: undefined, // TODO: owner to confirm
    alt: "Hardware robotic arm and vehicle developed by mentored K-12 students",
    label: "Mentored project",
  },
};
