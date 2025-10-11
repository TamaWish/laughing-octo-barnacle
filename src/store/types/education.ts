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
  requiredStatus?: number; // education status e.g., 2,4,5
  requiredAge?: number;
  grantsStatus?: number; // status to grant when completed
  preReqs?: PreReqs;
  logicalConstraint?: any;
  // optional precise constraints
  minGpa?: number; // e.g., 2.5 on 4.0 scale for alternate entry
  alternateEntry?: { minStatus: number; minGpa: number };
  blocksAcademic?: boolean; // when true, blocks academic degrees until completed or dropped
  blocksPreMed?: boolean; // blocks pre-med entry unless A.A. completed
  requiredWorkYears?: number; // for EMBA/MBA entry
  requiredExam?: string; // e.g., 'MCAT','LSAT','DAT'
}

export interface Enrollment {
  id: string;
  name: string;
  duration: number;
  timeRemaining: number;
  cost?: number;
  grantsStatus?: number;
  preReqs?: PreReqs;
  logicalConstraint?: any;
}

export type CourseCategory = 'cc' | 'uni' | 'grad' | 'bus' | 'voc' | 'online';
