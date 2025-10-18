export interface PreReqs {
  requiredSkill?: string; // e.g., 'smarts' or 'health'
  value?: number; // numeric threshold
}

export interface Course {
  id: string;
  name: string;
  type?: string;
  description?: string;
  duration: number; // years (can be fractional for months like 0.5)
  cost?: number;
  requiredStatus?: number; // education status: 0=None, 1=Kindergarten, 2=Primary, 3=Secondary, 4=University
  requiredAge?: number;
  maxAge?: number; // Maximum age to enroll (for kindergarten, primary, secondary)
  grantsStatus?: number; // status to grant when completed
  preReqs?: PreReqs;
  isPublic?: boolean; // true for public (free) schools, false for private
  prestige?: 'low' | 'medium' | 'high' | 'elite'; // For universities
  majors?: UniversityMajor[]; // Available majors (for universities)
  tuitionRange?: { min: number; max: number }; // For universities with variable costs
}

export interface Enrollment {
  id: string;
  name: string;
  duration: number;
  timeRemaining: number;
  cost?: number;
  grantsStatus?: number;
  preReqs?: PreReqs;
  major?: string; // For university
  paymentMethod?: 'loan' | 'parents' | 'cash'; // For university
  currentGPA?: number; // Current GPA (0.0-4.0 scale)
}

export type CourseCategory = 'kindergarten' | 'primary' | 'secondary' | 'university';

export interface UniversityMajor {
  id: string;
  name: string;
  description: string;
  skillBoosts?: { skill: string; amount: number }[];
  careerPaths?: string[]; // Related career fields
}
