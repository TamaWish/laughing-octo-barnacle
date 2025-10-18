export type Profile = {
  avatar: number;
  gender: 'male' | 'female' | 'other';
  firstName: string;
  lastName: string;
  country: string; // ISO country code
  // optional education/work fields used by enrollment logic
  gpa?: number; // 4.0 scale
  yearsWorked?: number;
  passedExams?: string[]; // e.g., ['MCAT','LSAT']
  // Optional family info: parents and siblings
  family?: {
    grandparents?: FamilyMember[];
    parents?: FamilyMember[];
    siblings?: FamilyMember[];
    children?: FamilyMember[];
    grandchildren?: FamilyMember[];
  };
  // Optional partner (lover/spouse/partner)
  partner?: FamilyMember | null;
  // Optional friends list
  friends?: FamilyMember[];
  // Optional exes list
  exes?: FamilyMember[];
  // Optional followers (for famous people)
  followers?: FamilyMember[];
};

export type PersonalityType = 'Easygoing' | 'Aggressive' | 'Forgiving' | 'Stubborn';

export type ConflictMemory = {
  date: string; // ISO date string
  topic: string; // What the conflict was about
  severity: 'minor' | 'major'; // How serious was the conflict
  resolved: boolean; // Whether it was apologized for
};

export type FamilyMember = {
  id: string;
  relation: 'grandparent' | 'parent' | 'sibling' | 'child' | 'grandchild' | 'partner' | 'spouse' | 'lover' | 'ex' | 'friend' | 'best-friend' | 'follower';
  avatar?: number;
  gender: 'male' | 'female' | 'other';
  firstName: string;
  lastName?: string;
  age: number;
  alive?: boolean;
  relationshipScore?: number; // 0-100
  status?: string; // e.g., "Married", "Dating", "Friend", etc.
  lastInteractionDate?: string; // ISO date string for tracking relationship decay
  conflictLevel?: number; // 0-100, higher means more tension/unresolved conflicts
  personality?: PersonalityType; // Personality affects conflict and apology effectiveness
  conflictMemory?: ConflictMemory[]; // Track history of conflicts with this person
};
