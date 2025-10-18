# University Re-Enrollment System

## Overview
Implemented a flexible university re-enrollment system that allows students to pursue multiple university courses throughout their life, with proper tracking of completed courses.

## Key Features

### ✅ 1. Multiple University Enrollments
Students can enroll in different university programs after completing previous ones:
- Complete "Grande École" → Enroll in "Sciences Po Paris"
- Complete "La Sorbonne" → Enroll in different university
- Switch between universities in different countries (US → France → UK, etc.)

### ✅ 2. Completed Course Tracking
- **State**: `completedUniversityCourses` array in gameStore
- Tracks all university course IDs that have been completed
- Persists across game sessions
- Prevents re-enrollment in already-completed courses

### ✅ 3. UI Feedback
- **"Completed" Badge**: Shows instead of "Enroll" button for finished courses
- **Grey-out Styling**: Completed courses have grey background and grey text
- **Strike-through Text**: Course details shown with line-through decoration
- **Switch Button**: Shows "Switch" text when enrolled in different university

### ✅ 4. Enrollment Logic
**Non-University Courses** (Primary, Secondary, etc.):
- Strict mutual exclusion - cannot enroll if already enrolled elsewhere
- Must complete current course before enrolling in another

**University Courses**:
- Flexible switching - can drop current university enrollment and switch to another
- Blocks re-enrollment in completed courses
- Shows appropriate error message: "Already Completed - You have already completed this course."

### ✅ 5. Real-time GPA Tracking
- GPA calculated during enrollment based on smarts stat
- Updates each year with performance variation
- Displayed in Education Info component
- Scale: 2.0 - 4.0

## Implementation Details

### State Management (`src/store/gameStore.ts`)

```typescript
// New state field
completedUniversityCourses: string[] // Tracks completed university course IDs

// enrollCourse logic
if (isUniversityCourse && state.completedUniversityCourses?.includes(course.id)) {
  Toast.show({ type: 'error', text1: 'Already Completed', 
               text2: 'You have already completed this course.' });
  return;
}

// Allow switching between ANY university courses
if (state.isCurrentlyEnrolled && isUniversityCourse) {
  set(() => ({ isCurrentlyEnrolled: false, currentEnrollment: null }));
  state.addEvent(`Dropped current enrollment to switch to ${course.name}.`);
}

// handleCourseCompletion
if (isUniversityCourse) {
  set((s) => ({
    completedUniversityCourses: Array.from(
      new Set([...(s.completedUniversityCourses || []), completedCourse.id])
    )
  }));
}
```

### UI Components (`src/screens/EducationScreen.tsx`)

```typescript
// Subscribe to completed courses
const completedUniversityCourses = useGameStore((s) => s.completedUniversityCourses);

// Check if course is completed
const isCourseCompleted = (course: any) => {
  return completedDegrees?.includes(course.name) || 
         completedCertificates?.includes(course.id) ||
         completedUniversityCourses?.includes(course.id);
};

// Determine button state
const completed = isCourseCompleted(course);
const canEnroll = !completed && prereqsMet && 
                  (!isCurrentlyEnrolled || (isUniversityCourse && !isEnrolledInThisCourse));
const isGreyedOut = completed || !prereqsMet || 
                    (isEnrolledInDifferentCourse && !isUniversityCourse);

// Button text logic
{completed ? 'Completed' : 
 isEnrolledInThisCourse ? 'Enrolled' :
 (isEnrolledInDifferentCourse && isUniversityCourse) ? 'Switch' :
 isEnrolledInDifferentCourse ? 'Enrolled' :
 !prereqsMet ? 'Locked' :
 'Enroll'}
```

### Styling

```typescript
disabledButton: { backgroundColor: '#d3d3d3' }  // Light grey for completed
completedText: { color: '#999', textDecorationLine: 'line-through' }
disabledText: { color: '#666' }
```

## User Experience Flow

### Scenario 1: First University Enrollment
1. Student reaches age 18+ with high school diploma
2. Views university options (Université Publique, Grande École, Sciences Po, etc.)
3. Clicks "Enroll" on desired course
4. Selects major (if applicable)
5. Chooses payment method (loan/parents/cash)
6. Enrolls successfully

### Scenario 2: Completing a University Course
1. Student advances through years (e.g., 4 years for standard university)
2. GPA calculated each year based on smarts + randomness
3. Upon completion:
   - Toast notification: "Congratulations! Graduated from [Course Name]"
   - Course added to `completedUniversityCourses`
   - Education status updated
   - Enrollment cleared

### Scenario 3: Re-enrolling in Different University
1. After completing "Grande École":
   - "Grande École" shows "Completed" badge (greyed out)
   - "Sciences Po Paris" shows "Enroll" button (active)
   - "La Sorbonne" shows "Enroll" button (active)
2. Student clicks "Enroll" on "Sciences Po Paris"
3. Enrolls successfully in new university program
4. Can complete and repeat with other universities

### Scenario 4: Attempting to Re-enroll in Completed Course
1. Student tries to enroll in "Grande École" (already completed)
2. Error toast: "Already Completed - You have already completed this course."
3. Enrollment fails, stays unenrolled

### Scenario 5: Switching Between Universities While Enrolled
1. Student enrolled in "Université Publique" (2 years remaining)
2. Sees "Sciences Po Paris" and wants to switch
3. Clicks "Switch" button on "Sciences Po Paris"
4. Toast: "Switched Courses - Enrolled in Sciences Po Paris"
5. Previous enrollment dropped (no penalty)
6. Now enrolled in new course

## Example Image Reference

```
┌─────────────────────────────────────────────┐
│ Université                                   │
│ Higher education ages 18+                    │
│                                              │
│ Université Publique [Higher Education]      │
│ Public French university - very affordable   │ [Enroll]
│ Duration: 3 yr • Cost: $500 • Req Status: 3 │
│                                              │
│ Grande École [Higher Education]              │
│ Prestigious Grande École - elite French      │ Completed
│ Duration: 4 yr • Cost: $8,000 • Req Status: 3│
│ ✓ Completed                                  │
│                                              │
│ Sciences Po Paris [Higher Education]         │
│ Sciences Po Paris - world-leading political  │ [Enroll]
│ Duration: 4 yr • Cost: $12,000 • Req Status: 3│
│                                              │
│ La Sorbonne [Higher Education]               │
│ Historic Sorbonne University - iconic French │ [Enroll]
│ Duration: 3 yr • Cost: $1,000 • Req Status: 3│
└─────────────────────────────────────────────┘
```

## Test Coverage

All tests passing for university re-enrollment:

```javascript
✓ university re-enrollment allows switching to any university course
✓ university re-enrollment blocks completed courses
✓ enrollment initializes GPA based on smarts stat
✓ GPA updates during year advancement
```

## Benefits

1. **Realistic Life Simulation**: Allows multiple university degrees over a lifetime
2. **Career Flexibility**: Students can pursue different fields of study
3. **Progression Tracking**: Clear visual feedback on educational achievements
4. **User-Friendly**: Intuitive "Completed" badges and grey-out styling
5. **Data Integrity**: Prevents invalid re-enrollments while allowing legitimate course switching

## Technical Notes

- University courses identified by ID containing '-university-' or '-uni-'
- Completion tracked separately from general degrees/certificates
- GPA system runs parallel to course progression
- State persists through Zustand middleware
- Toast notifications provide immediate feedback
- No penalties for switching between universities (realistic academic flexibility)

## Related Documentation

- [Education Profile Card Fix](./Education-Profile-Card-Fix.md) - GPA tracking and reactive UI
- [University Payment System](./University-Payment-System.md) - Loan/parents/cash payment
- [New Global Education System](./New-Global-Education-System.md) - Overall education architecture
