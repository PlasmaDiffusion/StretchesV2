export interface Stretch {
  name: string;
  color: string;
  totalStretchTime: number;
  enabled?: boolean;
  links?: string[];
}

const isDev =
  process.env.APP_VARIANT === "dev" || process.env.NODE_ENV === "development";

const defaultStretchTime = isDev ? 1 : 60;

export const stretchList: Stretch[] = [
  {
    name: "Hooklying Pos 1",
    color: "lightcoral",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Hooklying Pos 2",
    color: "salmon",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Knee-Chest 1",
    color: "#DC143C",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Knee-Chest 2",
    color: "#DE3163",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Figure Four 1",
    color: "#66b2b2",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Figure Four 2",
    color: "#008080",
    totalStretchTime: defaultStretchTime,
  },
  { name: "Stir Pot", color: "green", totalStretchTime: defaultStretchTime },
  {
    name: "Frog Stretch",
    color: "#58D68D",
    totalStretchTime: defaultStretchTime,
    links: [
      "https://youtu.be/0oGtY6TQ3NQ?t=39",
      "https://youtu.be/KPKfcsDzvXQ?t=16",
    ],
  },
  {
    name: "Windshield",
    color: "#FFBF00",
    totalStretchTime: defaultStretchTime,
  },
  {
    name: "Head-Knee 1",
    color: "#A52A2A",
    totalStretchTime: defaultStretchTime,
    links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
  },
  {
    name: "Head-Knee 2",
    color: "#990F02",
    totalStretchTime: defaultStretchTime,
    links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
  },
  { name: "Butterfly", color: "orange", totalStretchTime: defaultStretchTime },
  {
    name: "Wipers Sitting",
    color: "violet",
    totalStretchTime: defaultStretchTime,
  },
  { name: "Child Pose", color: "purple", totalStretchTime: defaultStretchTime },
];
