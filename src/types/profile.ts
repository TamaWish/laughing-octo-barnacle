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
    parents?: FamilyMember[];
    siblings?: FamilyMember[];
    children?: FamilyMember[];
  };
  // Optional partner (lover/spouse/partner)
  partner?: FamilyMember | null;
};

export type FamilyMember = {
  id: string;
  relation: 'parent' | 'sibling' | 'child';
  avatar?: number;
  gender: 'male' | 'female' | 'other';
  firstName: string;
  lastName?: string;
  age: number;
  alive?: boolean;
};
