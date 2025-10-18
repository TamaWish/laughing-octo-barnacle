import { Profile, FamilyMember, PersonalityType, ConflictMemory } from '../types/profile';

/**
 * Assign a random personality to a family member if they don't have one
 * @param member Family member
 * @returns Personality type
 */
export function assignRandomPersonality(): PersonalityType {
  const personalities: PersonalityType[] = ['Easygoing', 'Aggressive', 'Forgiving', 'Stubborn'];
  return personalities[Math.floor(Math.random() * personalities.length)];
}

/**
 * Get apology effectiveness multiplier based on personality
 * @param personality Personality type
 * @returns Multiplier for apology effectiveness (0.7 to 1.5)
 */
export function getApologyEffectiveness(personality?: PersonalityType): number {
  switch (personality) {
    case 'Forgiving':
      return 1.5; // +50% effectiveness
    case 'Easygoing':
      return 1.2; // +20% effectiveness
    case 'Aggressive':
      return 0.8; // -20% effectiveness
    case 'Stubborn':
      return 0.7; // -30% effectiveness
    default:
      return 1.0; // Normal effectiveness if no personality set
  }
}

/**
 * Get conflict escalation multiplier based on personality
 * @param personality Personality type
 * @returns Multiplier for conflict escalation chance (0.5 to 1.5)
 */
export function getConflictEscalationMultiplier(personality?: PersonalityType): number {
  switch (personality) {
    case 'Aggressive':
      return 1.5; // +50% more likely to escalate
    case 'Stubborn':
      return 1.3; // +30% more likely to escalate
    case 'Easygoing':
      return 0.7; // -30% less likely to escalate
    case 'Forgiving':
      return 0.5; // -50% less likely to escalate
    default:
      return 1.0; // Normal escalation
  }
}

/**
 * Add a conflict to the member's memory
 * @param member Family member
 * @param topic Topic of the conflict
 * @param severity Severity of the conflict
 * @param currentDate Current game date
 * @returns Updated conflict memory array
 */
export function addConflictMemory(
  member: FamilyMember,
  topic: string,
  severity: 'minor' | 'major',
  currentDate: string
): ConflictMemory[] {
  const memory: ConflictMemory = {
    date: currentDate,
    topic,
    severity,
    resolved: false,
  };
  
  const existingMemories = member.conflictMemory || [];
  // Keep only last 10 conflicts to avoid memory bloat
  const updatedMemories = [...existingMemories, memory].slice(-10);
  
  return updatedMemories;
}

/**
 * Mark conflicts as resolved when apologizing
 * @param member Family member
 * @returns Updated conflict memory with recent conflicts marked as resolved
 */
export function resolveRecentConflicts(member: FamilyMember): ConflictMemory[] {
  if (!member.conflictMemory || member.conflictMemory.length === 0) {
    return [];
  }
  
  // Mark the most recent unresolved conflict as resolved
  const memories = [...member.conflictMemory];
  for (let i = memories.length - 1; i >= 0; i--) {
    if (!memories[i].resolved) {
      memories[i] = { ...memories[i], resolved: true };
      break; // Only resolve one conflict per apology
    }
  }
  
  return memories;
}

/**
 * Check if relationship should break up based on score
 * @param member Family member
 * @returns Whether the relationship should end
 */
export function shouldBreakup(member: FamilyMember): boolean {
  const score = member.relationshipScore ?? 50;
  
  // Only romantic relationships can break up
  const romanticRelations = ['partner', 'spouse', 'lover'];
  if (!romanticRelations.includes(member.relation)) {
    return false;
  }
  
  // Break up if score is 0 or below
  return score <= 0;
}

/**
 * Calculate the number of years since last interaction
 * @param lastInteractionDate ISO date string
 * @param currentGameDate ISO date string
 * @returns Number of years since last interaction
 */
export function calculateYearsSinceLastInteraction(
  lastInteractionDate: string | undefined,
  currentGameDate: string
): number {
  if (!lastInteractionDate) {
    // If no interaction date recorded, assume 1 year has passed
    return 1;
  }

  const lastDate = new Date(lastInteractionDate);
  const currentDate = new Date(currentGameDate);
  const yearsDiff = currentDate.getFullYear() - lastDate.getFullYear();
  
  return Math.max(0, yearsDiff);
}

/**
 * Calculate decay amount based on relationship type and years passed
 * @param member Family member to calculate decay for
 * @param yearsPassed Number of years since last interaction
 * @returns Decay amount to subtract from relationship score
 */
export function calculateDecayAmount(member: FamilyMember, yearsPassed: number): number {
  if (yearsPassed === 0 || !member.alive) return 0;

  // Different decay rates based on relationship type
  let decayPerYear = 0;
  
  switch (member.relation) {
    // Close family relationships decay slower
    case 'parent':
    case 'child':
      decayPerYear = 2; // -2 points per year
      break;
    case 'sibling':
    case 'grandparent':
    case 'grandchild':
      decayPerYear = 3; // -3 points per year
      break;
    
    // Romantic relationships decay faster if neglected
    case 'spouse':
    case 'partner':
    case 'lover':
      decayPerYear = 5; // -5 points per year
      break;
    
    // Friendships decay at moderate rate
    case 'best-friend':
      decayPerYear = 4; // -4 points per year
      break;
    case 'friend':
      decayPerYear = 5; // -5 points per year
      break;
    
    // Exes and followers decay slowly (less maintenance needed)
    case 'ex':
      decayPerYear = 1; // -1 point per year
      break;
    case 'follower':
      decayPerYear = 2; // -2 points per year
      break;
    
    default:
      decayPerYear = 3;
  }

  // Conflict level increases decay rate
  const conflictMultiplier = 1 + ((member.conflictLevel ?? 0) / 100);
  
  return Math.floor(decayPerYear * yearsPassed * conflictMultiplier);
}

/**
 * Apply decay to a single family member
 * @param member Family member to apply decay to
 * @param currentGameDate Current in-game date
 * @returns Updated family member with decayed relationship score
 */
export function applyDecayToMember(
  member: FamilyMember,
  currentGameDate: string
): FamilyMember {
  if (!member.alive) return member;

  const yearsSinceInteraction = calculateYearsSinceLastInteraction(
    member.lastInteractionDate,
    currentGameDate
  );

  if (yearsSinceInteraction === 0) return member;

  const decayAmount = calculateDecayAmount(member, yearsSinceInteraction);
  const currentScore = member.relationshipScore ?? 50;
  const newScore = Math.max(0, currentScore - decayAmount);

  return {
    ...member,
    relationshipScore: newScore,
  };
}

/**
 * Apply relationship decay to all relationships in profile
 * @param profile Player's profile with all relationships
 * @param currentGameDate Current in-game date
 * @returns Updated profile with decayed relationships and decay summary
 */
export function applyRelationshipDecay(
  profile: Profile | undefined,
  currentGameDate: string
): { updatedProfile: Profile | undefined; decayEvents: string[] } {
  if (!profile) return { updatedProfile: profile, decayEvents: [] };

  const decayEvents: string[] = [];
  const updatedProfile = { ...profile };

  // Helper to process member array
  const processMembers = (
    members: FamilyMember[] | undefined,
    category: string
  ): FamilyMember[] | undefined => {
    if (!members) return members;
    
    return members.map(member => {
      const oldScore = member.relationshipScore ?? 50;
      const updated = applyDecayToMember(member, currentGameDate);
      const newScore = updated.relationshipScore ?? 50;
      
      if (oldScore !== newScore) {
        const decline = oldScore - newScore;
        decayEvents.push(
          `${member.firstName}: Relationship declined by ${decline} (${newScore}/100)`
        );
      }
      
      return updated;
    });
  };

  // Process partner
  if (updatedProfile.partner) {
    const oldScore = updatedProfile.partner.relationshipScore ?? 50;
    updatedProfile.partner = applyDecayToMember(updatedProfile.partner, currentGameDate);
    const newScore = updatedProfile.partner.relationshipScore ?? 50;
    
    if (oldScore !== newScore) {
      const decline = oldScore - newScore;
      decayEvents.push(
        `${updatedProfile.partner.firstName} (Partner): Relationship declined by ${decline} (${newScore}/100)`
      );
    }
  }

  // Process friends
  updatedProfile.friends = processMembers(updatedProfile.friends, 'Friends');

  // Process exes
  updatedProfile.exes = processMembers(updatedProfile.exes, 'Exes');

  // Process followers
  updatedProfile.followers = processMembers(updatedProfile.followers, 'Followers');

  // Process family
  if (updatedProfile.family) {
    updatedProfile.family = {
      ...updatedProfile.family,
      grandparents: processMembers(updatedProfile.family.grandparents, 'Grandparents'),
      parents: processMembers(updatedProfile.family.parents, 'Parents'),
      siblings: processMembers(updatedProfile.family.siblings, 'Siblings'),
      children: processMembers(updatedProfile.family.children, 'Children'),
      grandchildren: processMembers(updatedProfile.family.grandchildren, 'Grandchildren'),
    };
  }

  return { updatedProfile, decayEvents };
}

/**
 * Calculate conflict escalation based on current relationship score
 * Lower relationship scores have higher chance of escalating arguments
 * @param relationshipScore Current relationship score (0-100)
 * @returns Whether the conflict escalates (true/false)
 */
export function shouldConflictEscalate(relationshipScore: number): boolean {
  // Lower scores = higher escalation chance
  // 0-20: 70% escalation chance
  // 21-40: 50% escalation chance
  // 41-60: 30% escalation chance
  // 61-80: 15% escalation chance
  // 81-100: 5% escalation chance
  
  let escalationChance = 0.05; // 5% default
  
  if (relationshipScore <= 20) {
    escalationChance = 0.70;
  } else if (relationshipScore <= 40) {
    escalationChance = 0.50;
  } else if (relationshipScore <= 60) {
    escalationChance = 0.30;
  } else if (relationshipScore <= 80) {
    escalationChance = 0.15;
  }
  
  return Math.random() < escalationChance;
}

/**
 * Get a random argument topic based on relationship type
 * @param relation Type of relationship
 * @returns Argument topic description
 */
export function getArgumentTopic(relation: FamilyMember['relation']): string {
  const parentChildTopics = [
    'curfew and rules',
    'career choices',
    'lifestyle decisions',
    'family obligations',
    'money management'
  ];
  
  const romanticTopics = [
    'lack of attention',
    'trust issues',
    'future plans',
    'spending habits',
    'time management'
  ];
  
  const friendTopics = [
    'broken promises',
    'gossip',
    'jealousy',
    'borrowed money',
    'neglected friendship'
  ];
  
  const siblingTopics = [
    'childhood rivalries',
    'parental favoritism',
    'borrowed belongings',
    'different values',
    'family responsibilities'
  ];
  
  let topics: string[] = [];
  
  switch (relation) {
    case 'parent':
    case 'child':
      topics = parentChildTopics;
      break;
    case 'spouse':
    case 'partner':
    case 'lover':
    case 'ex':
      topics = romanticTopics;
      break;
    case 'friend':
    case 'best-friend':
      topics = friendTopics;
      break;
    case 'sibling':
      topics = siblingTopics;
      break;
    default:
      topics = ['unresolved differences', 'miscommunication', 'differing opinions'];
  }
  
  return topics[Math.floor(Math.random() * topics.length)];
}
