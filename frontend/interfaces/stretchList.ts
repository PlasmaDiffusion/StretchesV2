export interface Stretch {
    name: string;
    color: string;
    totalStretchTime: number;
    enabled?: boolean;
    links?: string[];
  } 
  
export const stretchList: Stretch[] = [
    { name: "Hooklying Pos 1", color: "lightcoral", totalStretchTime: 1 },
    { name: "Hooklying Pos 2", color: "salmon", totalStretchTime: 1 },
    { name: "Knee-Chest 1", color: "#DC143C", totalStretchTime: 1 },
    { name: "Knee-Chest 2", color: "#DE3163", totalStretchTime: 1 },
    { name: "Figure Four 1", color: "#66b2b2", totalStretchTime: 1 },
    { name: "Figure Four 2", color: "#008080", totalStretchTime: 1 },
    { name: "Stir Pot", color: "green", totalStretchTime: 1 },
    {
      name: "Frog Stretch",
      color: "#58D68D",
      totalStretchTime: 1,
      links: [
        "https://youtu.be/0oGtY6TQ3NQ?t=39",
        "https://youtu.be/KPKfcsDzvXQ?t=16"
      ],
    },
    { name: "Windshield", color: "#FFBF00", totalStretchTime: 1 },
    {
      name: "Head-Knee 1",
      color: "#A52A2A",
      totalStretchTime: 1,
      links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
    },
    {
      name: "Head-Knee 2",
      color: "#990F02",
      totalStretchTime: 1,
      links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
    },
    { name: "Butterfly", color: "orange", totalStretchTime: 1 },
    { name: "Wipers Sitting", color: "violet", totalStretchTime: 1 },
    { name: "Child Pose", color: "purple", totalStretchTime: 1 },
  ];