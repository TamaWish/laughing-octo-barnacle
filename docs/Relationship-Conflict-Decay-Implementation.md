# Conflict/Argument System & Relationship Decay - Implementation Summary

## 📋 Implementation Date
October 18, 2025

## 🎯 Features Implemented

### 1. Conflict/Argument System ✅
- Players can start arguments with any living relationship member
- Arguments damage relationships (-8 to -15 points)
- Conflict levels track unresolved tension (0-100 scale)
- Escalation mechanics based on current relationship score
- Context-aware argument topics for different relationship types

### 2. Apology System ✅
- Apologize to resolve conflicts (-30 conflict, improves relationship)
- Visual indicators show when apologies are needed
- Relationship repair scales with conflict resolved
- Increases happiness when making amends

### 3. Relationship Decay ✅
- Automatic decay when advancing years
- Different decay rates by relationship type:
  - Parents/Children: -2/year
  - Siblings/Grandparents: -3/year  
  - Best Friends: -4/year
  - Partners/Friends: -5/year
  - Exes: -1/year
  - Followers: -2/year
- Conflict multiplier accelerates decay
- Interaction tracking prevents decay for actively maintained relationships

---

## 📁 Files Modified

### Core Type Definitions
**`src/types/profile.ts`**
- Added `lastInteractionDate?: string` to FamilyMember
- Added `conflictLevel?: number` to FamilyMember

### Utility Functions
**`src/utils/relationshipDecay.ts`** (NEW)
- `calculateYearsSinceLastInteraction()` - Time calculation
- `calculateDecayAmount()` - Decay logic based on type and conflict
- `applyDecayToMember()` - Apply decay to single member
- `applyRelationshipDecay()` - Apply decay to entire profile
- `shouldConflictEscalate()` - Escalation probability logic
- `getArgumentTopic()` - Context-aware argument topics

### Game State Management
**`src/store/gameStore.ts`**
- Added `startArgument(memberId: string)` action
- Added `apologize(memberId: string)` action
- Updated `spendTimewithFamilyMember()` to track `lastInteractionDate`
- Updated `giveGiftToFamilyMember()` to track `lastInteractionDate`
- Integrated decay into `advanceYear()` function

### User Interface
**`src/screens/RelationshipsScreen.tsx`**
- Added "Start Argument" button (red, negative style)
- Added "Apologize" button (green, conditional on conflict > 0)
- Added conflict badge display on member cards
- Added handlers: `handleArgue()` and `handleApologize()`
- New styles: `negativeActionButton`, `positiveActionButton`, `conflictBadge`

---

## 📚 Documentation Created

### Comprehensive Guide
**`docs/Relationship-Conflict-Decay-Guide.md`** (NEW)
- Complete system overview
- Argument mechanics and effects
- Escalation system explanation
- Apology system details
- Decay rates and formulas
- Visual indicators guide
- Gameplay strategies
- Technical details
- Event log examples
- Future enhancements
- Troubleshooting FAQ

### Quick Start Update
**`docs/Relationships-Quick-Start.md`**
- Updated "Future Enhancements" section
- Added "New Features" section highlighting conflict/decay
- Marked implemented features as complete

---

## 🎮 How to Use

### For Players:

1. **Start an Argument**:
   - Navigate to Relationships screen
   - Tap any living member → "Start Argument"
   - Watch relationship decline and conflict increase

2. **Make Amends**:
   - Look for red conflict badges on member cards
   - Open member with conflict > 0
   - Tap "Apologize" to reduce conflict

3. **Maintain Relationships**:
   - Spend time or give gifts regularly
   - Prevents relationship decay over time
   - Check event log for decay notifications

4. **Monitor Decay**:
   - Advance year to trigger decay
   - Review event log for relationship changes
   - Prioritize key relationships

### For Developers:

```typescript
// Trigger an argument
useGameStore.getState().startArgument(memberId);

// Apologize to resolve conflict
useGameStore.getState().apologize(memberId);

// Manually apply decay (usually automatic in advanceYear)
import { applyRelationshipDecay } from '../utils/relationshipDecay';
const { updatedProfile, decayEvents } = applyRelationshipDecay(
  profile,
  gameDate
);
```

---

## 🔧 Technical Architecture

### Data Flow

```
User Action (Argue/Apologize/Spend Time)
    ↓
gameStore Action
    ↓
Update FamilyMember:
  - relationshipScore
  - conflictLevel
  - lastInteractionDate
    ↓
Persist to AsyncStorage
    ↓
UI Updates (conflict badge, scores)
```

### Decay Flow

```
User Advances Year
    ↓
advanceYear() in gameStore
    ↓
applyRelationshipDecay()
    ↓
For Each Relationship:
  - Calculate years since last interaction
  - Calculate decay amount (type + conflict)
  - Apply decay to score
    ↓
Return updated profile + events
    ↓
Log decay events
    ↓
Persist changes
```

---

## 📊 System Parameters

### Escalation Chances
| Score Range | Escalation % |
|------------|--------------|
| 0-20       | 70%          |
| 21-40      | 50%          |
| 41-60      | 30%          |
| 61-80      | 15%          |
| 81-100     | 5%           |

### Conflict Effects
| Action     | Normal | Escalated |
|-----------|--------|-----------|
| Relationship | -8   | -15       |
| Conflict   | +10    | +20       |
| Happiness  | -3     | -5        |

### Decay Rates (per year)
- Parent/Child: 2
- Sibling/Grandparent: 3
- Best Friend: 4
- Partner/Friend: 5
- Ex: 1
- Follower: 2

**Conflict Multiplier**: `1 + (conflictLevel / 100)`

---

## ✅ Testing Checklist

- [x] Arguments reduce relationship score
- [x] Arguments increase conflict level
- [x] Arguments reduce happiness
- [x] Escalation works at different score levels
- [x] Appropriate topics display for each relationship type
- [x] Apologies reduce conflict
- [x] Apologies improve relationship
- [x] Conflict badge displays when conflict > 0
- [x] Apologize button only shows when conflict > 0
- [x] Cannot argue with deceased members
- [x] Decay applies when advancing year
- [x] Different relationships decay at correct rates
- [x] Conflict multiplier accelerates decay
- [x] lastInteractionDate prevents decay
- [x] Event log shows decay notifications
- [x] UI updates reflect all changes
- [x] No TypeScript compilation errors

---

## 🚀 Future Enhancements

### Short Term:
- ~~Add Compliment/Conversation to update lastInteractionDate~~ ✅ **IMPLEMENTED**
- ~~Toast notifications show more detail (escalation, topic)~~ ✅ **IMPLEMENTED**
- ~~Conflict indicator animation on escalation~~ ✅ **IMPLEMENTED**

### Medium Term:
- ~~Relationship breakup at score 0~~ ✅ **IMPLEMENTED**
- ~~Make-up events for post-conflict bonding~~ ✅ **IMPLEMENTED**
- ~~Different apology effectiveness by personality~~ ✅ **IMPLEMENTED**
- ~~Conflict memory system (NPCs remember)~~ ✅ **IMPLEMENTED**

### Long Term:
- Therapy/counseling mechanics
- Mediation by third parties
- Social consequences (arguments affect other relationships)
- Personality-based conflict styles
- Relationship achievements/milestones

---

## 📝 Notes

- Decay is calculated based on in-game years, not real-world time
- Dead members do not decay and cannot be interacted with
- Conflict level has no upper limit effect on decay (caps at 100)
- All relationship scores are clamped between 0-100
- Event log shows max 3 decay events per year to avoid spam

---

## 🎉 Success Metrics

This implementation successfully adds:
1. **Depth**: Relationships require active maintenance
2. **Drama**: Players can intentionally create conflicts
3. **Strategy**: Balancing relationship priorities
4. **Realism**: Natural relationship deterioration
5. **Recovery**: Clear path to repair damaged relationships

The system integrates seamlessly with existing relationship mechanics and provides clear visual feedback through the UI.

---

**Implementation Complete! 🎊**
