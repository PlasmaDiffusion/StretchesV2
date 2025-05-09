export interface ExerciseLog {
  date: Date;
  timeOfDay: TimeOfDay;
  stretch: string;
  secondsSpentDoingStretch: number;
  secondsSpentPausing?: number;
  color?: string;
}

export interface HealthLog {
    date: Date;
    painLevel: PainLevel;
    mentalHealthLevel: MentalHealthLevel;
  }

export enum TimeOfDay {
  Morning = 0,
  Afternoon = 1,
  Evening = 2,
}

/** How bad the pain is each day. The early ones don't need to be worsening in numerical order, but the later ones do. */
export enum PainLevel {
  Unassigned = -1,
  None = 0,
  Discomfort = 1,
  Tightness = 2,
  MildPain = 3,
  ModeratePain = 4,
  SeverePain = 5,
}

/** How bad the user feels, pain related or not. These don't need to be worsening in numerical order.*/
export enum MentalHealthLevel { 
  Unassigned = -1,
  Happy = 0, // Feeling great and positive
  Okay = 1, // Neutral or slightly positive
  Agitated = 2, // Feeling restless or irritated
  Depressed = 3, // Feeling low or sad
  VeryUnwell = 4, // Severe mental distress
  Crisis = 5, // Critical mental health state
}
