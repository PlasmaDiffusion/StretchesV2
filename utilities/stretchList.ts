export interface Stretch {
    name: string;
    color: string;
    totalStretchTime: number;
    enabled?: boolean;
    links?: string[];
  } 
  
export const stretchList: Stretch[] = [
    { name: "Hooklying Pos 1", color: "lightcoral", totalStretchTime: 60 },
    { name: "Hooklying Pos 2", color: "salmon", totalStretchTime: 60 },
    { name: "Knee-Chest 1", color: "pink", totalStretchTime: 60 },
    { name: "Knee-Chest 2", color: "#DE3163", totalStretchTime: 60 },
    { name: "Figure Four 1", color: "#66b2b2", totalStretchTime: 60 },
    { name: "Figure Four 2", color: "#008080", totalStretchTime: 60 },
    { name: "Stir Pot", color: "green", totalStretchTime: 60 },
    {
      name: "Frog Stretch",
      color: "#58D68D",
      totalStretchTime: 60,
      links: [
        "https://www.youtube.com/watch?v=0oGtY6TQ3NQ&t=13s&ab_channel=AdisonBriana",
      ],
    },
    { name: "Windshield", color: "#FFBF00", totalStretchTime: 60 },
    {
      name: "Head-Knee 1",
      color: "#A52A2A",
      totalStretchTime: 60,
      links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
    },
    {
      name: "Head-Knee 2",
      color: "#990F02",
      totalStretchTime: 60,
      links: ["https://youtu.be/oyGEVPuumtk?t=1188"],
    },
    { name: "Butterfly", color: "orange", totalStretchTime: 60 },
    { name: "Wipers Sitting", color: "violet", totalStretchTime: 60 },
    { name: "Child Pose", color: "purple", totalStretchTime: 60 },
  ];