export interface ImageManifestEntry {
  id: string;
  alt: string;
  caption: string;
  tag?: string;
  ratio?: string; // e.g. "4/3", "3/4", "3/1", "16/9", "3/2"
  src: string | null;
}

export const IMAGES: Record<string, ImageManifestEntry> = {
  // Hero collage
  'hero-a': {
    id: 'hero-a',
    alt: 'Students building and testing microcontroller circuits during a school robotics workshop',
    caption: 'Students building in a workshop',
    tag: 'WORKSHOP',
    ratio: '4/3',
    src: null,
  },
  'hero-b': {
    id: 'hero-b',
    alt: 'Student engineering project on display at a school STEM exhibition',
    caption: 'Student project on display',
    tag: 'STUDENT PROJECT',
    ratio: '3/4',
    src: null,
  },
  'hero-c': {
    id: 'hero-c',
    alt: 'Student team testing an autonomous rover at a regional robotics event',
    caption: 'School event or competition',
    tag: 'EVENT',
    ratio: '3/4',
    src: null,
  },
  'hero-d': {
    id: 'hero-d',
    alt: 'STEM teacher training and curriculum orientation session in progress',
    caption: 'Teacher training session',
    tag: 'TEACHER TRAINING',
    ratio: '3/1',
    src: null,
  },

  // In action: Workshops
  'workshop-1': {
    id: 'workshop-1',
    alt: 'Classroom robotics and automation lab session with sensors and motor drivers',
    caption: 'Hands-on builds with boards, sensors and motors',
    tag: 'WORKSHOP',
    ratio: '3/2',
    src: null,
  },
  'workshop-2': {
    id: 'workshop-2',
    alt: 'Students designing and soldering a prototype PCB circuit board',
    caption: 'From a circuit idea to a working board',
    tag: 'WORKSHOP',
    ratio: '3/2',
    src: null,
  },
  'workshop-3': {
    id: 'workshop-3',
    alt: 'Students modeling 3D robot chassis components and inspecting 3D print builds',
    caption: 'Design it, print it, test it',
    tag: 'WORKSHOP',
    ratio: '3/2',
    src: null,
  },

  // In action: Events
  'event-1': {
    id: 'event-1',
    alt: 'Inter-school technology challenge with students presenting their robotics projects',
    caption: 'Inter-school technology challenge',
    tag: 'EVENT',
    ratio: '3/2',
    src: null,
  },
  'event-2': {
    id: 'event-2',
    alt: 'School-level robotics showcase with live autonomous vehicle trials',
    caption: 'School-level robotics showcase',
    tag: 'EVENT',
    ratio: '3/2',
    src: null,
  },
  'event-3': {
    id: 'event-3',
    alt: 'EFACT mentors preparing student teams for national robotics competitions',
    caption: 'National competition mentoring',
    tag: 'EVENT',
    ratio: '3/2',
    src: null,
  },

  // In action: Student Projects
  'project-1': {
    id: 'project-1',
    alt: 'Autonomous line-following robot built by students with optical infrared sensors',
    caption: 'Autonomous Line-Following Bot (Sample)',
    tag: 'STUDENT PROJECT',
    ratio: '3/2',
    src: null,
  },
  'project-2': {
    id: 'project-2',
    alt: 'Smart classroom environment monitor built with microcontrollers and telemetry sensors',
    caption: 'Smart Classroom Sensor Project (Sample)',
    tag: 'STUDENT PROJECT',
    ratio: '3/2',
    src: null,
  },
  'project-3': {
    id: 'project-3',
    alt: 'Mobile application developed by Class 9 students for sensor data visualization',
    caption: 'App built by Class 9 students (Sample)',
    tag: 'STUDENT PROJECT',
    ratio: '3/2',
    src: null,
  },

  // Training
  'training-1': {
    id: 'training-1',
    alt: 'Faculty development programme for school STEM educators',
    caption: 'Teacher professional development workshop',
    tag: 'TEACHER TRAINING',
    ratio: '16/9',
    src: null,
  },

  // Validated institutions
  'lpu': {
    id: 'lpu',
    alt: 'Lovely Professional University student testing and curriculum validation',
    caption: 'Lovely Professional University',
    tag: 'VALIDATION',
    ratio: '16/9',
    src: null,
  },
  'dps': {
    id: 'dps',
    alt: 'Delhi Public School Jalandhar classroom trials and feedback',
    caption: 'Delhi Public School, Jalandhar',
    tag: 'VALIDATION',
    ratio: '16/9',
    src: null,
  },
};

