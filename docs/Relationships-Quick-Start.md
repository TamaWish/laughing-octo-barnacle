# Relationships Screen - Quick Start Guide

## 🎉 What's New

### Latest Update (Oct 18, 2025):
- ✨ **Personality System**: Each NPC has a unique personality (Forgiving, Easygoing, Aggressive, Stubborn)
- 💕 **Make-Up Events**: Special bonding moments for high-conflict relationships
- 📝 **Conflict Memory**: NPCs remember past arguments and resolutions
- 💔 **Relationship Breakups**: Partners automatically break up at score 0
- 🎯 **Personality Effects**: Apology effectiveness varies by personality type

### Previous Features:
The Relationships screen has been completely rebuilt to provide a comprehensive family tree and relationship management system!

## 📁 Files Changed/Created

### Modified Files:
1. **`src/screens/RelationshipsScreen.tsx`** - Complete rewrite with full functionality
2. **`src/types/profile.ts`** - Extended with new relationship types
3. **`src/store/gameStore.ts`** - Updated relationship actions

### New Files:
4. **`src/utils/relationshipHelpers.ts`** - Utility functions for generating test data
5. **`docs/Relationships-Screen-Guide.md`** - Comprehensive feature documentation
6. **`docs/Relationships-Example-Data.md`** - Sample data structures
7. **`docs/Relationships-Implementation-Summary.md`** - Technical summary

## 🚀 Quick Start

### 1. View the Screen
Navigate to the Relationships tab from your bottom navigation bar. The screen will display all relationships organized by category.

### 2. Add Test Relationships
To test the screen with sample data, you can use the helper functions:

```typescript
import { generateCompleteFamily } from '../utils/relationshipHelpers';
import useGameStore from '../store/gameStore';

// In your component or dev screen
const profile = useGameStore((s) => s.profile);
const age = useGameStore((s) => s.age);
const setProfile = useGameStore((s) => s.setProfile);

// Generate sample relationships
const updatedProfile = generateCompleteFamily(profile, age, {
  includeGrandparents: true,
  includeParents: true,
  includeSiblings: 2,
  includeFriends: 5,
  includeBestFriend: true,
  includePartner: true,
  includeExes: 1
});

setProfile(updatedProfile);
```

### 3. Interact with Relationships
- **Tap any member** to open the action modal
- **Spend Time** - Free, +5 relationship, +2 happiness
- **Give Gift** - €100, +10 relationship
- **Compliment** - Say something nice
- **Conversation** - Have a deep talk

## 📊 Relationship Categories

The screen organizes relationships into these sections:

1. **Followers** - For cult leaders (Commune)
2. **Romantic** - Partners, lovers, exes
3. **Grandparents** - Oldest generation
4. **Parents** - Second oldest generation
5. **Siblings** - Same generation
6. **Children** - Next generation
7. **Grandchildren** - Youngest generation
8. **Best Friends** - Closest friends
9. **Friends** - Regular friends

Each section only appears if you have members in that category.

## 🎨 Visual Features

### Relationship Score Colors:
- 🟢 **80-100** - Excellent (Green)
- 🔵 **60-79** - Good (Blue)
- 🟡 **40-59** - Neutral (Yellow)
- 🟠 **20-39** - Poor (Orange)
- 🔴 **0-19** - Very Poor (Red)

### Member Cards Show:
- Gender-appropriate avatar
- Full name
- Relation type
- Age (and "† Deceased" if dead)
- Custom status
- Relationship bar (0-100)
- Chevron to open actions

## 🧪 Testing Tips

### Test Different Family Structures:

**Young Adult (Age 25):**
```typescript
generateCompleteFamily(profile, 25, {
  includeGrandparents: true,
  includeParents: true,
  includeSiblings: 2,
  includeFriends: 6,
  includeBestFriend: true,
  includePartner: true
});
```

**Middle-Aged Parent (Age 45):**
```typescript
generateCompleteFamily(profile, 45, {
  includeParents: true,
  includeSiblings: 1,
  includeChildren: 3,
  includeFriends: 4,
  includePartner: true,
  includeExes: 2
});
```

**Elder (Age 70):**
```typescript
generateCompleteFamily(profile, 70, {
  includeChildren: 3,
  includeGrandchildren: 6,
  includeFriends: 2,
  includePartner: true
});
```

### Individual Helpers:
```typescript
import { 
  addBasicFamily, 
  addFriends, 
  addPartner,
  addChildren
} from '../utils/relationshipHelpers';

// Add just parents
let updated = addBasicFamily(profile, age);

// Add friends
updated = addFriends(updated, age, 5, true);

// Add a spouse
updated = addPartner(updated, age, 'spouse');

// Add children
updated = addChildren(updated, age, 2);

setProfile(updated);
```

## 💡 Common Use Cases

### 1. Create a Family at Game Start
When player creates their character, generate parents:
```typescript
const newProfile = addBasicFamily(profile, age);
setProfile(newProfile);
```

### 2. Make Friends Through Activities
When player does social activities:
```typescript
// Add a new friend
const newFriend = generateFamilyMember(
  'friend',
  age,
  Math.floor(Math.random() * 4) - 2,
  {
    relationshipScore: 50
  }
);

const updated = {
  ...profile,
  friends: [...(profile.friends || []), newFriend]
};
setProfile(updated);
```

### 3. Get Married
When player gets married:
```typescript
const married = addPartner(profile, age, 'spouse');
setProfile(married);
```

### 4. Have Children
When player has a baby:
```typescript
const newChild = generateFamilyMember(
  'child',
  0, // newborn
  0,
  {
    lastName: profile.lastName,
    relationshipScore: 100
  }
);

const updated = {
  ...profile,
  family: {
    ...profile.family,
    children: [...(profile.family?.children || []), newChild]
  }
};
setProfile(updated);
```

## 🔧 Customization

### Add Custom Statuses:
```typescript
const customMember = generateFamilyMember(
  'friend',
  age,
  0,
  {
    status: 'Childhood Friend',
    relationshipScore: 90
  }
);
```

### Mark Someone as Deceased:
```typescript
// Find and update the member
const updated = {
  ...profile,
  family: {
    ...profile.family,
    grandparents: profile.family?.grandparents?.map(gp => 
      gp.id === targetId 
        ? { ...gp, alive: false }
        : gp
    )
  }
};
setProfile(updated);
```

## 🎮 Integration with Game Systems

### Connect with Activities Screen:
```typescript
// In ActivitiesScreen, add "Make Friends" activity
{
  name: 'Make Friends',
  action: () => {
    const newFriend = generateFamilyMember('friend', age, 0);
    const updated = {
      ...profile,
      friends: [...(profile.friends || []), newFriend]
    };
    setProfile(updated);
    Toast.show({ type: 'success', text1: 'Made a new friend!' });
  }
}
```

### Connect with Age System:
```typescript
// In advanceYear function
function advanceYear() {
  // Age all family members
  const updated = {
    ...profile,
    family: {
      ...profile.family,
      parents: profile.family?.parents?.map(p => ({
        ...p,
        age: p.age + 1,
        alive: p.age >= 80 ? Math.random() > 0.9 : true
      }))
    }
  };
  setProfile(updated);
}
```

## 📖 Documentation

For more details, see:
- **Full Feature Guide**: `docs/Relationships-Screen-Guide.md`
- **Example Data**: `docs/Relationships-Example-Data.md`
- **Implementation Details**: `docs/Relationships-Implementation-Summary.md`

## ✅ What's Working

- ✅ Display all relationship types
- ✅ Organized by generation/category
- ✅ Interactive member cards
- ✅ Action modal with activities
- ✅ Relationship scoring (0-100)
- ✅ Color-coded relationship bars
- ✅ Deceased member handling
- ✅ Empty state
- ✅ Toast notifications
- ✅ Money validation for gifts
- ✅ Helper utilities for testing
- ✅ Full TypeScript type safety

## 🚧 Future Enhancements

- ~~Relationship decay over time~~ ✅ **IMPLEMENTED**
- ~~Conflict/argument system~~ ✅ **IMPLEMENTED**
- Marriage proposal mechanics
- Pregnancy/childbirth system
- Death/funeral system
- Social events (parties, gatherings)
- Advanced gift catalog
- Memory system
- Personality traits/compatibility

## 🎉 New Features (Latest Update)

### ✅ Conflict & Argument System
- **Start Arguments**: Damage relationships and create tension
- **Conflict Levels**: Track unresolved conflicts (0-100)
- **Escalation Mechanics**: Arguments can escalate based on relationship score
- **Apology System**: Resolve conflicts and repair relationships

### ✅ Relationship Decay
- **Automatic Decay**: Relationships deteriorate without interaction
- **Type-Based Rates**: Different decay speeds for different relationship types
- **Conflict Multiplier**: High conflict accelerates decay
- **Interaction Tracking**: Last interaction dates prevent decay

**See full documentation**: `docs/Relationship-Conflict-Decay-Guide.md`

## 🐛 Troubleshooting

**Problem:** No relationships showing
- **Solution:** Use `generateCompleteFamily()` to add test data

**Problem:** "Not enough money" error for gifts
- **Solution:** Ensure player has at least €100 in bank

**Problem:** Deceased members showing as alive
- **Solution:** Set `alive: false` on the member object

**Problem:** Relationship changes not persisting
- **Solution:** Ensure you're using `setProfile()` from the store

## 🎯 Next Steps

1. **Test the screen** with various family structures
2. **Integrate** relationship generation into gameplay
3. **Add more activities** to the action modal
4. **Connect** with other game systems (aging, events)
5. **Build out** life event systems (marriage, children, death)

---

**Enjoy your new Relationships screen!** 🎉👨‍👩‍👧‍👦
