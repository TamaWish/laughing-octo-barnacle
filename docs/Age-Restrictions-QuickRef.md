# Education Age Restrictions - Quick Reference

## ✅ What's Been Updated

### Documentation
- ✅ Updated `New-Global-Education-System.md` with university status (Status 4)
- ✅ Added age restrictions section
- ✅ Created `Age-Restrictions-Update.md` comprehensive guide

### Code Changes
- ✅ Added `maxAge?: number` to Course type
- ✅ Updated all 48 K-12 courses across 8 countries with max age
- ✅ Enhanced prerequisite validation in EducationScreen
- ✅ Zero compilation errors

---

## 📊 Age Restrictions Summary

| Education Level | Min Age | Max Age | Duration | Status Required | Status Granted |
|----------------|---------|---------|----------|-----------------|----------------|
| **Kindergarten** | 3 | **6** | 2 years | 0 | 1 |
| **Primary School** | 5 | **13** | 7 years | 1 | 2 |
| **Secondary School** | 12 | **19** | 6 years | 2 | 3 |
| **University** | 18 | **None** | 2-4 years | 3 | 4 |

---

## 🎯 Grey-Out Logic (EducationScreen.tsx)

A course is **greyed out** if ANY of these conditions are true:

1. ✅ Already completed
2. ✅ Education status too low (requiredStatus not met)
3. ✅ Age too young (below requiredAge)
4. ✅ **Age too old (above maxAge)** ← NEW
5. ✅ Skills too low (preReqs.requiredSkill not met)
6. ✅ Currently enrolled in a different course

---

## 🌍 Countries Updated

All 8 countries have age restrictions:

| Country | Kindergarten | Primary | Secondary |
|---------|-------------|---------|-----------|
| 🇺🇸 US | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇬🇧 UK | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇦🇺 AU | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇨🇦 CA | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇮🇳 IN | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇩🇪 DE | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇫🇷 FR | maxAge: 6 | maxAge: 13 | maxAge: 19 |
| 🇯🇵 JP | maxAge: 6 | maxAge: 13 | maxAge: 19 |

**Total courses updated**: 48 (6 courses per country × 8 countries)

---

## 💡 Example Scenarios

### Age 4, Status 0 (Newborn)
```
✅ Kindergarten (Public/Private) - Available
❌ Primary - Greyed out (status requirement)
❌ Secondary - Greyed out (status requirement)
❌ University - Greyed out (status requirement)
```

### Age 10, Status 2 (Skipped Primary)
```
❌ Kindergarten - Greyed out (too old, max 6)
❌ Primary - Greyed out (too old, max 13... wait, still OK!)
✅ Primary - Available! (Age 10 ≤ 13)
❌ Secondary - Greyed out (status requirement not met)
❌ University - Greyed out (status requirement)
```

### Age 25, Status 0 (Never went to school)
```
❌ Kindergarten - Greyed out (too old, max 6)
❌ Primary - Greyed out (too old, max 13)
❌ Secondary - Greyed out (status requirement + too old)
❌ University - Greyed out (status requirement)
```

### Age 25, Status 3 (High school graduate)
```
❌ Kindergarten - Greyed out (completed + too old)
❌ Primary - Greyed out (completed + too old)
❌ Secondary - Greyed out (completed + too old)
✅ University - Available! (No max age for university)
```

### Age 60, Status 3 (Retirement age)
```
❌ Kindergarten - Greyed out (completed + too old)
❌ Primary - Greyed out (completed + too old)
❌ Secondary - Greyed out (completed + too old)
✅ University - Still available! (Lifelong learning)
```

---

## 🔧 Technical Implementation

### Type Definition
```typescript
// src/store/types/education.ts
export interface Course {
  requiredAge?: number;  // Minimum age
  maxAge?: number;       // Maximum age (NEW)
}
```

### Validation Logic
```typescript
// src/screens/EducationScreen.tsx
const arePrerequisitesMet = (course: any) => {
  // Check minimum age
  if (course.requiredAge && age < course.requiredAge) return false;
  
  // Check maximum age (NEW)
  if (course.maxAge && age > course.maxAge) return false;
  
  // ... other checks
  return true;
};
```

### Example Course Data
```typescript
// src/store/educationCatalog.ts
{
  id: 'us-kindergarten-public',
  name: 'Public Kindergarten',
  requiredAge: 3,   // Must be at least 3
  maxAge: 6,        // Must be at most 6
  grantsStatus: 1,
  // ...
}
```

---

## 🎉 Result

### Before
- ❌ 25-year-old could enroll in kindergarten (unrealistic)
- ❌ 50-year-old could see primary school as available
- ❌ Only blocked by status requirements

### After
- ✅ Kindergarten: Ages 3-6 only
- ✅ Primary: Ages 5-13 only
- ✅ Secondary: Ages 12-19 only
- ✅ University: Ages 18+ forever (realistic lifelong learning)
- ✅ Proper grey-out with "Prerequisites not met"

---

## 📝 Documentation Created

1. ✅ **New-Global-Education-System.md** - Updated with university info and age restrictions
2. ✅ **Age-Restrictions-Update.md** - Comprehensive technical guide
3. ✅ **Age-Restrictions-QuickRef.md** - This quick reference (just created)

---

## ✅ Status: Complete

All education courses now have realistic age restrictions that prevent unrealistic enrollments while maintaining flexibility for adult education at the university level.
