# Age Restrictions for Education System

## Update Summary
Added maximum age restrictions to kindergarten, primary, and secondary education courses to prevent enrollment when the sim is too old.

---

## Changes Made

### 1. Type Definition Update
**File**: `src/store/types/education.ts`

Added `maxAge?: number` field to the `Course` interface:
```typescript
export interface Course {
  id: string;
  name: string;
  // ... other fields
  requiredAge?: number;  // Minimum age to enroll
  maxAge?: number;       // Maximum age to enroll (NEW)
  // ... other fields
}
```

---

### 2. Age Restrictions Added to All Courses
**File**: `src/store/educationCatalog.ts`

Updated all 48 kindergarten, primary, and secondary courses across 8 countries:

#### Kindergarten Courses (16 total)
- **Max Age**: 6
- Countries: US, UK, AU, CA, IN, DE, FR, JP
- Public + Private versions for each country

#### Primary School Courses (16 total)
- **Max Age**: 13
- Countries: US, UK, AU, CA, IN, DE, FR, JP
- Public + Private versions for each country

#### Secondary School Courses (16 total)
- **Max Age**: 19
- Countries: US, UK, AU, CA, IN, DE, FR, JP
- Public + Private versions for each country

#### University Courses (32 total)
- **Max Age**: None (no restriction)
- Universities remain accessible at any age 18+

---

### 3. Validation Logic Update
**File**: `src/screens/EducationScreen.tsx`

Enhanced the `arePrerequisitesMet()` function:

**Before**:
```typescript
// Only checked minimum age
if (typeof course.requiredAge === 'number' && age < course.requiredAge) {
  return false;
}
```

**After**:
```typescript
// Check minimum age requirement
if (typeof course.requiredAge === 'number' && age < course.requiredAge) {
  return false;
}

// Check maximum age requirement (NEW)
if (typeof course.maxAge === 'number' && age > course.maxAge) {
  return false;
}
```

---

### 4. Documentation Updates
**File**: `docs/New-Global-Education-System.md`

Added new section explaining age restrictions:

```markdown
### Age Restrictions
- **Kindergarten**: Ages 3-6 (max age 6 - greyed out if too old)
- **Primary School**: Ages 5-13 (max age 13 - greyed out if too old)
- **Secondary School**: Ages 12-19 (max age 19 - greyed out if too old)
- **University**: Ages 18+ (no maximum age restriction)
```

Also updated university status level documentation from "reserved for future" to "actively in use (Status 4)".

---

## User Experience Changes

### Before This Update
- A 25-year-old sim could see kindergarten/primary/secondary schools as available
- Courses would only grey out if already completed or lacking prerequisites
- No age-based restrictions except minimum age

### After This Update
- Kindergarten greyed out if sim is older than 6
- Primary school greyed out if sim is older than 13
- Secondary school greyed out if sim is older than 19
- University remains accessible at any age 18+
- Proper "Prerequisites not met" status displayed

---

## Technical Details

### Age Limits Rationale

| Course Level | Age Range | Max Age | Reasoning |
|--------------|-----------|---------|-----------|
| Kindergarten | 3-5 (2 years) | 6 | Typical enrollment ends before age 7 |
| Primary | 5-12 (7 years) | 13 | Complete by age 12, allow 1 year buffer |
| Secondary | 12-18 (6 years) | 19 | Complete by age 18, allow 1 year buffer |
| University | 18+ (2-4 years) | None | Adult education has no upper age limit |

---

## Testing Scenarios

### Scenario 1: Young Child
- **Age**: 4
- **Status**: 0 (no education)
- **Expected**: Kindergarten available, others greyed out

### Scenario 2: Teen Who Skipped Education
- **Age**: 15
- **Status**: 0 (no education)
- **Expected**: 
  - Kindergarten: Greyed out (too old, max age 6)
  - Primary: Greyed out (too old, max age 13)
  - Secondary: Greyed out (status requirement not met)
  - University: Greyed out (status requirement not met)

### Scenario 3: Young Adult Who Completed Secondary
- **Age**: 18
- **Status**: 3 (secondary complete)
- **Expected**:
  - Kindergarten: Greyed out (completed + too old)
  - Primary: Greyed out (completed + too old)
  - Secondary: Greyed out (completed + too old)
  - University: Available ✓

### Scenario 4: Older Adult
- **Age**: 45
- **Status**: 3 (secondary complete)
- **Expected**:
  - All compulsory education: Greyed out (too old)
  - University: Still available ✓ (no max age)

---

## Code Examples

### Example: US Kindergarten (Before)
```typescript
{ 
  id: 'us-kindergarten-public', 
  name: 'Public Kindergarten', 
  requiredAge: 3,  // Only minimum age
  grantsStatus: 1, 
  // ...
}
```

### Example: US Kindergarten (After)
```typescript
{ 
  id: 'us-kindergarten-public', 
  name: 'Public Kindergarten', 
  requiredAge: 3,   // Minimum age
  maxAge: 6,        // Maximum age (NEW)
  grantsStatus: 1, 
  // ...
}
```

---

## Files Changed

1. ✅ `src/store/types/education.ts` - Added `maxAge` field
2. ✅ `src/store/educationCatalog.ts` - Added `maxAge` to 48 courses (all non-university)
3. ✅ `src/screens/EducationScreen.tsx` - Added max age validation
4. ✅ `docs/New-Global-Education-System.md` - Updated documentation

---

## Verification

Run TypeScript compilation to verify:
```bash
npx tsc --noEmit
```

Result: ✅ **No errors found**

---

## Future Enhancements

Potential future improvements:
- Add "Too old to enroll" tooltip message
- Display age ranges in course descriptions
- Add GED/equivalency programs for adults who missed education
- Special adult education tracks with different age limits
- Age-based tuition discounts for mature students

---

## Conclusion

The education system now properly restricts enrollment based on realistic age limits:
- **Compulsory education** (K-12): Age-limited to prevent unrealistic enrollments
- **Higher education** (University): Age-flexible to support lifelong learning

This creates a more realistic simulation while maintaining flexibility for adult sims to pursue university education at any age.
