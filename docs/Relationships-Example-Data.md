# Example Relationships Data

This file provides sample data structures for testing the Relationships screen with various family configurations.

## Example 1: Young Adult with Parents and Siblings

```typescript
const profile = {
  avatar: 5,
  gender: 'male',
  firstName: 'Joel',
  lastName: 'Nicolas',
  country: 'FR',
  family: {
    parents: [
      {
        id: 'parent-1',
        relation: 'parent',
        avatar: 15,
        gender: 'male',
        firstName: 'Prince Paolo',
        lastName: 'Nicolas',
        age: 52,
        alive: true,
        relationshipScore: 85,
        status: 'Father'
      },
      {
        id: 'parent-2',
        relation: 'parent',
        avatar: 8,
        gender: 'female',
        firstName: 'Princess Hera',
        lastName: 'Nicolas',
        age: 48,
        alive: true,
        relationshipScore: 90,
        status: 'Mother'
      }
    ]
  },
  friends: [
    {
      id: 'friend-1',
      relation: 'friend',
      avatar: 12,
      gender: 'male',
      firstName: 'Jules',
      lastName: 'Muller',
      age: 25,
      alive: true,
      relationshipScore: 65
    },
    {
      id: 'friend-2',
      relation: 'friend',
      avatar: 3,
      gender: 'male',
      firstName: 'Aaron',
      lastName: 'Francois',
      age: 26,
      alive: true,
      relationshipScore: 55
    },
    {
      id: 'friend-3',
      relation: 'friend',
      avatar: 7,
      gender: 'male',
      firstName: 'Marcel',
      lastName: 'Petit',
      age: 27,
      alive: true,
      relationshipScore: 48
    },
    {
      id: 'friend-4',
      relation: 'best-friend',
      avatar: 9,
      gender: 'male',
      firstName: 'Roberto',
      lastName: 'Muller',
      age: 25,
      alive: true,
      relationshipScore: 95,
      status: 'Best Friend'
    },
    {
      id: 'friend-5',
      relation: 'friend',
      avatar: 11,
      gender: 'male',
      firstName: 'Thomas',
      lastName: 'Gauthier',
      age: 24,
      alive: true,
      relationshipScore: 58
    },
    {
      id: 'friend-6',
      relation: 'friend',
      avatar: 13,
      gender: 'male',
      firstName: 'Maurizio',
      lastName: 'Walter',
      age: 28,
      alive: true,
      relationshipScore: 42
    }
  ]
};
```

## Example 2: Multi-Generational Family

```typescript
const profile = {
  avatar: 10,
  gender: 'female',
  firstName: 'Emma',
  lastName: 'Johnson',
  country: 'US',
  family: {
    grandparents: [
      {
        id: 'gp-1',
        relation: 'grandparent',
        avatar: 20,
        gender: 'male',
        firstName: 'Robert',
        lastName: 'Johnson',
        age: 78,
        alive: true,
        relationshipScore: 72
      },
      {
        id: 'gp-2',
        relation: 'grandparent',
        avatar: 15,
        gender: 'female',
        firstName: 'Margaret',
        lastName: 'Johnson',
        age: 75,
        alive: true,
        relationshipScore: 80
      }
    ],
    parents: [
      {
        id: 'p-1',
        relation: 'parent',
        avatar: 18,
        gender: 'male',
        firstName: 'David',
        lastName: 'Johnson',
        age: 55,
        alive: true,
        relationshipScore: 88
      },
      {
        id: 'p-2',
        relation: 'parent',
        avatar: 12,
        gender: 'female',
        firstName: 'Sarah',
        lastName: 'Johnson',
        age: 52,
        alive: true,
        relationshipScore: 92
      }
    ],
    siblings: [
      {
        id: 's-1',
        relation: 'sibling',
        avatar: 5,
        gender: 'male',
        firstName: 'Michael',
        lastName: 'Johnson',
        age: 28,
        alive: true,
        relationshipScore: 75
      },
      {
        id: 's-2',
        relation: 'sibling',
        avatar: 8,
        gender: 'female',
        firstName: 'Jessica',
        lastName: 'Johnson',
        age: 24,
        alive: true,
        relationshipScore: 68
      }
    ],
    children: [
      {
        id: 'c-1',
        relation: 'child',
        avatar: 2,
        gender: 'female',
        firstName: 'Lily',
        lastName: 'Johnson',
        age: 8,
        alive: true,
        relationshipScore: 95
      },
      {
        id: 'c-2',
        relation: 'child',
        avatar: 4,
        gender: 'male',
        firstName: 'Noah',
        lastName: 'Johnson',
        age: 5,
        alive: true,
        relationshipScore: 98
      }
    ]
  },
  partner: {
    id: 'partner-1',
    relation: 'spouse',
    avatar: 16,
    gender: 'male',
    firstName: 'James',
    lastName: 'Johnson',
    age: 32,
    alive: true,
    relationshipScore: 89,
    status: 'Married'
  }
};
```

## Example 3: Elder with Grandchildren

```typescript
const profile = {
  avatar: 22,
  gender: 'male',
  firstName: 'William',
  lastName: 'Anderson',
  country: 'GB',
  family: {
    children: [
      {
        id: 'c-1',
        relation: 'child',
        avatar: 14,
        gender: 'female',
        firstName: 'Elizabeth',
        lastName: 'Smith',
        age: 42,
        alive: true,
        relationshipScore: 85
      },
      {
        id: 'c-2',
        relation: 'child',
        avatar: 18,
        gender: 'male',
        firstName: 'George',
        lastName: 'Anderson',
        age: 38,
        alive: true,
        relationshipScore: 78
      }
    ],
    grandchildren: [
      {
        id: 'gc-1',
        relation: 'grandchild',
        avatar: 3,
        gender: 'female',
        firstName: 'Charlotte',
        lastName: 'Smith',
        age: 15,
        alive: true,
        relationshipScore: 88
      },
      {
        id: 'gc-2',
        relation: 'grandchild',
        avatar: 6,
        gender: 'male',
        firstName: 'Oliver',
        lastName: 'Smith',
        age: 12,
        alive: true,
        relationshipScore: 82
      },
      {
        id: 'gc-3',
        relation: 'grandchild',
        avatar: 9,
        gender: 'male',
        firstName: 'Henry',
        lastName: 'Anderson',
        age: 10,
        alive: true,
        relationshipScore: 90
      }
    ]
  },
  partner: {
    id: 'partner-1',
    relation: 'spouse',
    avatar: 19,
    gender: 'female',
    firstName: 'Victoria',
    lastName: 'Anderson',
    age: 65,
    alive: false, // Deceased
    relationshipScore: 100,
    status: 'Deceased Spouse'
  }
};
```

## Example 4: Complex Romantic History

```typescript
const profile = {
  avatar: 7,
  gender: 'female',
  firstName: 'Sophie',
  lastName: 'Martin',
  country: 'FR',
  partner: {
    id: 'partner-1',
    relation: 'lover',
    avatar: 11,
    gender: 'male',
    firstName: 'Alexandre',
    lastName: 'Dubois',
    age: 29,
    alive: true,
    relationshipScore: 75,
    status: 'Dating'
  },
  exes: [
    {
      id: 'ex-1',
      relation: 'ex',
      avatar: 15,
      gender: 'male',
      firstName: 'Pierre',
      lastName: 'Lefebvre',
      age: 31,
      alive: true,
      relationshipScore: 35,
      status: 'Ex-Boyfriend'
    },
    {
      id: 'ex-2',
      relation: 'ex',
      avatar: 18,
      gender: 'male',
      firstName: 'Luc',
      lastName: 'Bernard',
      age: 28,
      alive: true,
      relationshipScore: 42,
      status: 'Ex-Fiancé'
    }
  ]
};
```

## Example 5: Famous Person with Followers

```typescript
const profile = {
  avatar: 1,
  gender: 'male',
  firstName: 'Maximilian',
  lastName: 'Sterling',
  country: 'US',
  followers: [
    {
      id: 'follower-1',
      relation: 'follower',
      avatar: 5,
      gender: 'male',
      firstName: 'Cult',
      lastName: 'Member',
      age: 25,
      alive: true,
      relationshipScore: 100
    }
  ]
};
```

## How to Use These Examples

### Method 1: Manual Profile Creation (Development)
In your character creation or profile setup screen, you can add these relationships to test:

```typescript
const setProfile = useGameStore((s) => s.setProfile);

// Use one of the examples above
setProfile(exampleProfile);
```

### Method 2: Seed Data Function
Create a utility function to generate sample relationships:

```typescript
export function seedRelationships(profile: Profile): Profile {
  // Add sample parents
  profile.family = {
    parents: [
      generateRandomFamilyMember('parent', 'Father', profile.age + 25),
      generateRandomFamilyMember('parent', 'Mother', profile.age + 23)
    ],
    siblings: [
      generateRandomFamilyMember('sibling', 'Brother', profile.age - 2)
    ]
  };
  
  // Add sample friends
  profile.friends = [
    generateRandomFamilyMember('best-friend', 'Best Friend', profile.age),
    generateRandomFamilyMember('friend', 'Friend', profile.age + 1),
    generateRandomFamilyMember('friend', 'Friend', profile.age - 1)
  ];
  
  return profile;
}

function generateRandomFamilyMember(
  relation: FamilyMember['relation'], 
  relationLabel: string,
  age: number
): FamilyMember {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  return {
    id: `${relation}-${Date.now()}-${Math.random()}`,
    relation,
    avatar: Math.floor(Math.random() * 20),
    gender,
    firstName: generateRandomName(gender),
    lastName: 'Surname',
    age: Math.max(0, age),
    alive: true,
    relationshipScore: Math.floor(Math.random() * 40) + 50,
    status: relationLabel
  };
}
```

### Method 3: Game Events Generate Relationships
As the game progresses, create systems that naturally add relationships:

```typescript
// When player starts school
function onStartSchool() {
  const newFriends = generateClassmates(3);
  profile.friends = [...(profile.friends || []), ...newFriends];
}

// When player ages up
function onBirthday() {
  // Age all family members
  // Check if elderly members pass away
  // Add new relationships (marriage, children)
}
```

## Testing Checklist

When testing the Relationships screen, verify:

- [ ] All relationship categories display correctly
- [ ] Empty categories are hidden
- [ ] Member cards show correct avatars
- [ ] Relationship bars display with correct colors
- [ ] Deceased members show "† Deceased" marker
- [ ] Tapping member opens action modal
- [ ] "Spend Time" increases relationship and happiness
- [ ] "Give Gift" requires €100 and increases relationship
- [ ] Modal closes properly
- [ ] Section counts are accurate
- [ ] Empty state shows when no relationships exist
- [ ] Navigation tab highlights "Relationships"
- [ ] Toast messages appear for actions
- [ ] Scroll works properly with many relationships
- [ ] Relationship changes persist after closing/reopening screen
