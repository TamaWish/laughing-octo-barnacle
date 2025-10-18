# Education Profile Card Fix

## Issue
The education progression display in the profile card on the GameScreen had two issues:
1. Not functioning reactively - enrollment info wouldn't appear/update until app reload
2. **Graduation year showing incorrect date** - using real-world year (2025) instead of in-game year (e.g., 2036)

## Root Causes
1. The code was using `useGameStore.getState()` to access the enrollment state, which provides a static snapshot rather than subscribing to state changes
2. **Graduation year calculation used `new Date().getFullYear()` instead of the game's internal `gameDate`**

## Solution
Modified `GameScreen.tsx` to properly subscribe to the enrollment state using Zustand's hook pattern AND use the in-game date for graduation calculations:

### Before:
```tsx
export default function GameScreen({ route, navigation }: Props) {
  const { age, money, advanceYear, reset } = useGameStore();
  // ... rest of component
  
  {useGameStore.getState().isCurrentlyEnrolled && useGameStore.getState().currentEnrollment && (() => {
    const enrollment = useGameStore.getState().currentEnrollment;
    const graduationYear = new Date().getFullYear() + timeRemaining; // WRONG: Uses real-world year!
    // ... render logic
  })()}
}
```

### After:
```tsx
export default function GameScreen({ route, navigation }: Props) {
  const { age, money, advanceYear, reset } = useGameStore();
  // Subscribe to education state for reactive updates
  const isCurrentlyEnrolled = useGameStore((s) => s.isCurrentlyEnrolled);
  const currentEnrollment = useGameStore((s) => s.currentEnrollment);
  const gameDate = useGameStore((s) => s.gameDate); // NEW: Subscribe to in-game date
  // ... rest of component
  
  {age >= 3 && isCurrentlyEnrolled && currentEnrollment && (() => {
    const enrollment = currentEnrollment;
    // Use in-game date, not real-world date
    const currentGameYear = gameDate ? new Date(gameDate).getFullYear() : new Date().getFullYear();
    const graduationYear = currentGameYear + timeRemaining; // CORRECT: Uses in-game year!
    // ... render logic
  })()}
}
```

## Changes Made

1. **Added reactive subscriptions** (lines ~51-53 in GameScreen.tsx):
   - `const isCurrentlyEnrolled = useGameStore((s) => s.isCurrentlyEnrolled);`
   - `const currentEnrollment = useGameStore((s) => s.currentEnrollment);`
   - `const gameDate = useGameStore((s) => s.gameDate);` **← NEW: Subscribe to in-game date**

2. **Updated render logic** (line ~346):
   - Replaced `useGameStore.getState()` calls with the subscribed state variables
   - Added null-safety checks with `??` operators for `timeRemaining` field
   - Added age constraint: Education info only displays for sims age 3 or older
   - **Fixed graduation year calculation to use `gameDate` instead of real-world date**

## What This Fixes

✅ Education info now appears immediately when a sim enrolls in a course  
✅ Progress bar updates reactively as years advance  
✅ **Graduation date now correctly reflects the IN-GAME year** (e.g., if game year is 2036 and 4 years remaining, shows 2040)  
✅ Years remaining counter updates properly  
✅ Component re-renders automatically when enrollment state changes  
✅ Education info only displays for sims age 3 and older (not shown for ages 0-2)

### Example Scenario:
- **Before Fix**: Game year is 2036, sim enrolled in 4-year program → Graduation shows 2029 (2025 + 4) ❌
- **After Fix**: Game year is 2036, sim enrolled in 4-year program → Graduation shows 2040 (2036 + 4) ✅  

## How to Verify

### Test Scenario 1: New Enrollment (Age 3+)
1. Start a new game or load an existing one with a sim age 3 or older
2. Navigate to Education screen
3. Enroll in any course (e.g., Preschool, Primary School, University, etc.)
4. Return to Game/Home screen
5. **Expected**: Education info card should immediately appear showing:
   - School name
   - Years remaining
   - Progress bar (green)
   - Estimated graduation year

### Test Scenario 1b: Ages 0-2 (No Display)
1. Start a new game with a sim age 0-2
2. Even if somehow enrolled, the education info should NOT display
3. **Expected**: No education info card appears for sims under age 3

### Test Scenario 2: Year Progression
1. While enrolled in a course, click "Advance Year" button
2. **Expected**: 
   - Progress bar should increase
   - Years remaining should decrease by 1
   - **Graduation year should remain constant** (based on in-game year + remaining time)
   - In-game year advances by 1
   - Updates should be immediate/reactive

### Test Scenario 2b: Verify In-Game Date
1. Check the current in-game year (stored in `gameDate`)
2. Note the years remaining on the course
3. **Expected**: Est. graduation = current in-game year + years remaining
   - Example: If game year is 2036 and 4 years remaining → Est. graduation: 2040
   - Example: If game year is 2050 and 2 years remaining → Est. graduation: 2052

### Test Scenario 3: Course Completion
1. Continue advancing years until course completes (timeRemaining reaches 0)
2. **Expected**: 
   - Toast notification for graduation
   - Education info card should disappear
   - Education status should update in store

### Test Scenario 4: Auto-enrollment
1. Create a new character at age 0
2. Advance years until age 3
3. **Expected**: Should auto-enroll in kindergarten/preschool if available
4. Education info should appear automatically

## Technical Details

### Zustand State Management Pattern
- `useGameStore((s) => s.field)` creates a reactive subscription
- Component re-renders whenever the subscribed field changes
- `useGameStore.getState()` only provides a static snapshot at call time

### Related Files
- `src/screens/GameScreen.tsx` - Main game screen with profile card
- `src/components/EducationInfo.tsx` - Education display component
- `src/store/gameStore.ts` - Zustand store with enrollment logic
- `__tests__/gameStore.enroll.test.ts` - Enrollment validation tests

## Test Results
All 44 tests pass (including 7 tests for education profile card):
```
✓ enrollment state updates are reactive
✓ education info should not display for ages 0-2
✓ education info should display starting at age 3
✓ timeRemaining updates when advancing year
✓ enrollment clears upon completion
✓ progress calculation is accurate
✓ graduation year uses in-game date not real-world date  ← NEW TEST
```

Legacy enrollment tests:
```
✓ preReqs block enrollment when skill too low
✓ insufficient funds block enrollment
✓ requiredExam blocks enrollment if not passed
✓ logicalConstraint blocks if trade certificate present
✓ successful enrollment deducts money and sets currentEnrollment
```

## Future Enhancements
Consider adding:
- Real-time GPA tracking during enrollment
- Skill progression visualization
- Course-specific stat boosts display
- Enrollment history in profile
