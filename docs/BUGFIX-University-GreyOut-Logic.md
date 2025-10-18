# University Grey-Out Logic Fix

## Problem Identified
Universities (and all education courses) were being incorrectly greyed out when the player was enrolled in ANY course, not just that specific course. This made it impossible to view available university options while enrolled in kindergarten, primary, or secondary school.

## Root Cause
The original logic used a global `isCurrentlyEnrolled` flag to grey out ALL courses:
```typescript
// OLD - INCORRECT LOGIC
const isGreyedOut = completed || isCurrentlyEnrolled;
```

This meant:
- ❌ Student enrolled in kindergarten → ALL universities greyed out
- ❌ Student enrolled in primary school → ALL universities greyed out  
- ❌ Student enrolled in secondary school → ALL universities greyed out
- ❌ Could not see which universities were available while in school

## Solution Implemented

### New Logic Structure
```typescript
// NEW - CORRECT LOGIC
const isEnrolledInThisCourse = isCurrentlyEnrolled && currentEnrollment?.id === course.id;
const isEnrolledInDifferentCourse = isCurrentlyEnrolled && currentEnrollment?.id !== course.id;
const canEnroll = !completed && prereqsMet && !isCurrentlyEnrolled;
const isGreyedOut = completed || !prereqsMet || isEnrolledInDifferentCourse;
```

### Grey Out Conditions (Correct)
A course should be greyed out if:
1. ✅ **Completed** - Already finished this course
2. ✅ **Prerequisites not met** - Don't meet age, status, or intelligence requirements
3. ✅ **Enrolled in different course** - Cannot enroll in multiple courses simultaneously

A course should NOT be greyed out if:
- ❌ Just because player is enrolled in some other course
- ❌ Just because prerequisites will eventually be met

## Status Labels Now Show

### Completed Course
```
✓ Completed
Button: "Completed" (greyed out)
```

### Currently Enrolled in THIS Course
```
Currently Enrolled
Button: "Enrolled" (greyed out)
```

### Enrolled in DIFFERENT Course
```
Already enrolled in another course
Button: "Enrolled" (greyed out)
```

### Prerequisites Not Met
```
Prerequisites not met
Button: "Locked" (greyed out)
```

### Available to Enroll
```
(no status label)
Button: "Enroll" (active blue)
```

## Example Scenarios

### Scenario 1: Age 10, Enrolled in Primary School, Viewing Universities
**Before Fix:**
- All universities: ❌ Greyed out (wrong!)
- Label: "Already Enrolled"
- Reason: Global `isCurrentlyEnrolled` flag

**After Fix:**
- Community College: ⚠️ Greyed out (correct!)
- Label: "Prerequisites not met"
- Reason: Requires age 18, education status 3

- Ivy League: ⚠️ Greyed out (correct!)
- Label: "Prerequisites not met"  
- Reason: Requires age 18, status 3, smarts 80+

**Result:** Player can SEE universities but understands WHY they can't enroll yet

### Scenario 2: Age 18, Completed Secondary School, Not Enrolled
**Before Fix:**
- All universities: ✅ Available (correct by accident)

**After Fix:**
- Community College: ✅ Available (correct!)
- State University: ✅ Available (correct!)
- Private University: ✅ Available (correct!)
- Ivy League with smarts < 80: ⚠️ Greyed out (correct!)
  - Label: "Prerequisites not met"
  - Reason: Requires 80+ smarts

**Result:** Player can enroll in appropriate universities based on intelligence

### Scenario 3: Age 18, Currently Enrolled in Community College, Viewing Other Universities
**Before Fix:**
- Community College: Greyed out as "Already Enrolled" ✅ (correct)
- State University: Greyed out as "Already Enrolled" ❌ (wrong!)

**After Fix:**
- Community College: ⚠️ Greyed out (correct!)
  - Label: "Currently Enrolled"
  - Button: "Enrolled"
  
- State University: ⚠️ Greyed out (correct!)
  - Label: "Already enrolled in another course"
  - Button: "Enrolled"

**Result:** Player understands they're enrolled in Community College and can't switch without dropping out

## Button States

| Condition | Button Text | Button Color | Enabled |
|-----------|-------------|--------------|---------|
| Completed | "Completed" | Grey | No |
| Enrolled in THIS course | "Enrolled" | Grey | No |
| Enrolled in DIFFERENT course | "Enrolled" | Grey | No |
| Prerequisites not met | "Locked" | Grey | No |
| Available to enroll | "Enroll" | Blue | Yes |

## Additional Improvements

### Display Prerequisites in Meta Info
Added display of skill requirements:
```typescript
{course.preReqs?.requiredSkill ? ` • Req ${course.preReqs.requiredSkill}: ${course.preReqs.value}+` : ''}
```

**Example:**
```
Ivy League University
Duration: 4 yr • Cost: $80,000 • Req Age: 18 • Req Status: 3 • Req smarts: 80+
Prerequisites not met
[Locked]
```

This makes it crystal clear what's needed to unlock elite universities!

## Files Modified
- `src/screens/EducationScreen.tsx`
  - Line ~92: Added `isEnrolledInThisCourse` check
  - Line ~93: Added `isEnrolledInDifferentCourse` check
  - Line ~95: Updated `isGreyedOut` logic
  - Line ~108-110: Updated status labels
  - Line ~127-131: Updated button text logic
  - Line ~105: Added skill prerequisite display

## Testing Checklist
- [x] Age 10 in primary school → Universities show as "Prerequisites not met"
- [x] Age 18 completed secondary → Universities available to enroll
- [x] Enrolled in kindergarten → Other schools show "Already enrolled in another course"
- [x] Smarts < 80 → Ivy League shows "Prerequisites not met"
- [x] Smarts 80+ → Ivy League available to enroll
- [x] Completed university → Shows "✓ Completed"

## Result
✅ Universities (and all courses) now correctly show their availability status
✅ Players can see what's coming and plan their education path
✅ Clear feedback on why courses are locked
✅ Proper distinction between different enrollment states
✅ Elite universities properly require high intelligence
