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
  requiredStatus?: number; // education status: 0=None, 1=Kindergarten, 2=Primary, 3=Secondary
  requiredAge?: number;
  grantsStatus?: number; // status to grant when completed
  preReqs?: PreReqs;
  isPublic?: boolean; // true for public (free) schools, false for private
}

export interface Enrollment {
  id: string;
  name: string;
  duration: number;
  timeRemaining: number;
  cost?: number;
  grantsStatus?: number;
  preReqs?: PreReqs;
}

export type CourseCategory = 'kindergarten' | 'primary' | 'secondary';
