export interface Job {
  id: string;
  title: string;
  level: number;
  baseSalary: number;
  requiredEducation?: number; // educationStatus required
  requiredSmarts?: number;
  requiredAge?: number;
  careerPath: string;
  description: string;
}

export interface PartTimeJob {
  id: string;
  title: string;
  company: string;
  description: string;
  hourlyRate: number;
  hoursPerWeek: number;
  duration: string; // e.g., "3-6 months", "Ongoing"
  requirements: string[];
  location: string;
}

export interface CareerState {
  currentJob?: Job | null;
  careerHistory: Job[];
  workExperience: number; // points for promotions
  lastWorkedDate?: string;
  partTimeJob?: PartTimeJob | null;
  partTimeHoursWorked: number; // hours worked this week for part-time job
}