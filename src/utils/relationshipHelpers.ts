import { FamilyMember, Profile } from '../types/profile';

/**
 * Utility functions for generating and managing relationships
 */

// Sample first names by gender
const MALE_NAMES = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
  'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
  'Alexandre', 'Pierre', 'Luc', 'Jean', 'Marcel', 'Antoine', 'Jules', 'Hugo'
];

const FEMALE_NAMES = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra',
  'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda',
  'Sophie', 'Emma', 'Marie', 'Claire', 'Julie', 'Charlotte', 'Camille', 'Lily'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
  'Dubois', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Muller'
];

/**
 * Generate a random name based on gender
 */
export function generateRandomName(gender: 'male' | 'female' | 'other'): string {
  if (gender === 'male') {
    return MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)];
  } else if (gender === 'female') {
    return FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
  }
  // For 'other', randomly pick from either list
  const allNames = [...MALE_NAMES, ...FEMALE_NAMES];
  return allNames[Math.floor(Math.random() * allNames.length)];
}

/**
 * Generate a random last name
 */
export function generateRandomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

/**
 * Generate a random avatar number (0-29 for males, 0-29 for females)
 */
export function generateRandomAvatar(): number {
  return Math.floor(Math.random() * 30);
}

/**
 * Generate a random gender
 */
export function generateRandomGender(): 'male' | 'female' {
  return Math.random() > 0.5 ? 'male' : 'female';
}

/**
 * Generate a unique ID for a family member
 */
export function generateMemberId(): string {
  return `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a single family member with random attributes
 */
export function generateFamilyMember(
  relation: FamilyMember['relation'],
  baseAge: number,
  ageOffset: number = 0,
  options?: {
    firstName?: string;
    lastName?: string;
    gender?: 'male' | 'female' | 'other';
    relationshipScore?: number;
    status?: string;
    alive?: boolean;
  }
): FamilyMember {
  const gender = options?.gender || generateRandomGender();
  const age = Math.max(0, Math.min(120, baseAge + ageOffset));
  
  return {
    id: generateMemberId(),
    relation,
    avatar: generateRandomAvatar(),
    gender,
    firstName: options?.firstName || generateRandomName(gender),
    lastName: options?.lastName || generateRandomLastName(),
    age,
    alive: options?.alive !== undefined ? options.alive : (age < 80 ? true : Math.random() > 0.3),
    relationshipScore: options?.relationshipScore !== undefined 
      ? options.relationshipScore 
      : Math.floor(Math.random() * 40) + 50, // 50-90 by default
    status: options?.status
  };
}

/**
 * Add basic family (parents) to a profile
 */
export function addBasicFamily(profile: Profile, playerAge: number, includeLastName: boolean = true): Profile {
  const lastName = includeLastName ? profile.lastName : generateRandomLastName();
  
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.family) {
    updatedProfile.family = {};
  }
  
  updatedProfile.family.parents = [
    generateFamilyMember('parent', playerAge, 28, {
      firstName: generateRandomName('male'),
      lastName,
      status: 'Father'
    }),
    generateFamilyMember('parent', playerAge, 25, {
      firstName: generateRandomName('female'),
      lastName,
      status: 'Mother'
    })
  ];
  
  return updatedProfile;
}

/**
 * Add grandparents to a profile
 */
export function addGrandparents(profile: Profile, playerAge: number): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.family) {
    updatedProfile.family = {};
  }
  
  const grandparentAge = playerAge + 55;
  
  updatedProfile.family.grandparents = [
    generateFamilyMember('grandparent', grandparentAge, 0, {
      firstName: generateRandomName('male'),
      status: 'Paternal Grandfather'
    }),
    generateFamilyMember('grandparent', grandparentAge, -3, {
      firstName: generateRandomName('female'),
      status: 'Paternal Grandmother'
    }),
    generateFamilyMember('grandparent', grandparentAge, 1, {
      firstName: generateRandomName('male'),
      status: 'Maternal Grandfather'
    }),
    generateFamilyMember('grandparent', grandparentAge, -2, {
      firstName: generateRandomName('female'),
      status: 'Maternal Grandmother'
    })
  ];
  
  return updatedProfile;
}

/**
 * Add siblings to a profile
 */
export function addSiblings(profile: Profile, playerAge: number, count: number = 2): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.family) {
    updatedProfile.family = {};
  }
  
  updatedProfile.family.siblings = [];
  
  for (let i = 0; i < count; i++) {
    const ageOffset = Math.floor(Math.random() * 10) - 5; // -5 to +5 years
    updatedProfile.family.siblings.push(
      generateFamilyMember('sibling', playerAge, ageOffset, {
        lastName: profile.lastName
      })
    );
  }
  
  return updatedProfile;
}

/**
 * Add children to a profile
 */
export function addChildren(profile: Profile, playerAge: number, count: number = 2): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.family) {
    updatedProfile.family = {};
  }
  
  updatedProfile.family.children = [];
  
  const baseChildAge = Math.max(0, playerAge - 25);
  
  for (let i = 0; i < count; i++) {
    updatedProfile.family.children.push(
      generateFamilyMember('child', baseChildAge + (i * 3), 0, {
        lastName: profile.lastName,
        relationshipScore: 85 + Math.floor(Math.random() * 15) // 85-100
      })
    );
  }
  
  return updatedProfile;
}

/**
 * Add grandchildren to a profile
 */
export function addGrandchildren(profile: Profile, playerAge: number, count: number = 3): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.family) {
    updatedProfile.family = {};
  }
  
  updatedProfile.family.grandchildren = [];
  
  const baseGrandchildAge = Math.max(0, playerAge - 50);
  
  for (let i = 0; i < count; i++) {
    updatedProfile.family.grandchildren.push(
      generateFamilyMember('grandchild', baseGrandchildAge + (i * 2), 0, {
        relationshipScore: 80 + Math.floor(Math.random() * 20) // 80-100
      })
    );
  }
  
  return updatedProfile;
}

/**
 * Add friends to a profile
 */
export function addFriends(profile: Profile, playerAge: number, count: number = 4, includeBestFriend: boolean = true): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.friends) {
    updatedProfile.friends = [];
  }
  
  // Add best friend first
  if (includeBestFriend) {
    updatedProfile.friends.push(
      generateFamilyMember('best-friend', playerAge, Math.floor(Math.random() * 4) - 2, {
        relationshipScore: 85 + Math.floor(Math.random() * 15), // 85-100
        status: 'Best Friend'
      })
    );
  }
  
  // Add regular friends
  for (let i = 0; i < count; i++) {
    const ageOffset = Math.floor(Math.random() * 6) - 3; // -3 to +3 years
    updatedProfile.friends.push(
      generateFamilyMember('friend', playerAge, ageOffset, {
        relationshipScore: 50 + Math.floor(Math.random() * 30) // 50-80
      })
    );
  }
  
  return updatedProfile;
}

/**
 * Add a partner to a profile
 */
export function addPartner(profile: Profile, playerAge: number, relationType: 'spouse' | 'lover' | 'partner' = 'spouse'): Profile {
  const updatedProfile = { ...profile };
  
  const statusMap = {
    spouse: 'Married',
    lover: 'Dating',
    partner: 'In a Relationship'
  };
  
  updatedProfile.partner = generateFamilyMember(relationType, playerAge, Math.floor(Math.random() * 6) - 3, {
    relationshipScore: 75 + Math.floor(Math.random() * 25), // 75-100
    status: statusMap[relationType],
    lastName: relationType === 'spouse' ? profile.lastName : undefined
  });
  
  return updatedProfile;
}

/**
 * Add exes to a profile
 */
export function addExes(profile: Profile, playerAge: number, count: number = 2): Profile {
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.exes) {
    updatedProfile.exes = [];
  }
  
  for (let i = 0; i < count; i++) {
    updatedProfile.exes.push(
      generateFamilyMember('ex', playerAge, Math.floor(Math.random() * 6) - 3, {
        relationshipScore: 20 + Math.floor(Math.random() * 40), // 20-60
        status: Math.random() > 0.5 ? 'Ex-Boyfriend' : 'Ex-Girlfriend'
      })
    );
  }
  
  return updatedProfile;
}

/**
 * Generate a complete family structure for testing
 * 
 * @param profile - The base profile to add relationships to
 * @param playerAge - The player's current age
 * @param options - Configuration for what to generate
 * @returns Updated profile with all relationships
 */
export function generateCompleteFamily(
  profile: Profile,
  playerAge: number,
  options: {
    includeGrandparents?: boolean;
    includeParents?: boolean;
    includeSiblings?: number;
    includeChildren?: number;
    includeGrandchildren?: number;
    includeFriends?: number;
    includeBestFriend?: boolean;
    includePartner?: boolean;
    includeExes?: number;
  } = {}
): Profile {
  let updatedProfile = { ...profile };
  
  // Add grandparents
  if (options.includeGrandparents) {
    updatedProfile = addGrandparents(updatedProfile, playerAge);
  }
  
  // Add parents (default true)
  if (options.includeParents !== false) {
    updatedProfile = addBasicFamily(updatedProfile, playerAge);
  }
  
  // Add siblings
  if (options.includeSiblings !== undefined && options.includeSiblings > 0) {
    updatedProfile = addSiblings(updatedProfile, playerAge, options.includeSiblings);
  }
  
  // Add children
  if (options.includeChildren !== undefined && options.includeChildren > 0) {
    updatedProfile = addChildren(updatedProfile, playerAge, options.includeChildren);
  }
  
  // Add grandchildren
  if (options.includeGrandchildren !== undefined && options.includeGrandchildren > 0) {
    updatedProfile = addGrandchildren(updatedProfile, playerAge, options.includeGrandchildren);
  }
  
  // Add friends
  if (options.includeFriends !== undefined && options.includeFriends > 0) {
    updatedProfile = addFriends(
      updatedProfile, 
      playerAge,
      options.includeFriends, 
      options.includeBestFriend !== false
    );
  }
  
  // Add partner
  if (options.includePartner) {
    updatedProfile = addPartner(updatedProfile, playerAge);
  }
  
  // Add exes
  if (options.includeExes !== undefined && options.includeExes > 0) {
    updatedProfile = addExes(updatedProfile, playerAge, options.includeExes);
  }
  
  return updatedProfile;
}

/**
 * Example usage for testing:
 * 
 * // In your development/testing screen:
 * import { generateCompleteFamily } from '../utils/relationshipHelpers';
 * 
 * const profile = useGameStore((s) => s.profile);
 * const age = useGameStore((s) => s.age);
 * const setProfile = useGameStore((s) => s.setProfile);
 * 
 * // Generate a young adult with full family
 * const youngAdult = generateCompleteFamily(profile, age, {
 *   includeGrandparents: true,
 *   includeParents: true,
 *   includeSiblings: 2,
 *   includeFriends: 5,
 *   includeBestFriend: true,
 *   includePartner: true,
 *   includeExes: 1
 * });
 * 
 * setProfile(youngAdult);
 * 
 * // Generate an elder with grandchildren
 * const elder = generateCompleteFamily(profile, age, {
 *   includeParents: false,
 *   includeSiblings: 1,
 *   includeChildren: 3,
 *   includeGrandchildren: 5,
 *   includeFriends: 3,
 *   includePartner: true
 * });
 * 
 * setProfile(elder);
 */
