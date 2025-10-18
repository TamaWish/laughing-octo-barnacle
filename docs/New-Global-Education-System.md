# New Global Education System

## Overview
A simplified, globally consistent education system with country-specific school names implemented across all countries.

## System Structure

### Education Levels
1. **Kindergarten** (Age 3-5, 2 years)
   - Status Level: 0 → 1
   - Auto-enrollment at age 3
   - Boosts stats based on public/private choice
   
2. **Primary School** (Age 5-12, 7 years)
   - Status Level: 1 → 2
   - Auto-enrollment upon kindergarten completion
   - Annual +2 Smarts, +1 Happiness
   
3. **Secondary School** (Age 12-18, 6 years)
   - Status Level: 2 → 3
   - Auto-enrollment upon primary completion
   - Annual +2 Smarts, +1 Happiness
   - Completion at age 18 = Ready for work/university

4. **University** (Age 18+, 2-4 years)
   - Status Level: 3 → 4
   - Optional enrollment (not automatic)
   - Requires secondary school completion
   - Choose from 20 majors
   - 3 payment methods: Student Loan, Parents, Cash
   - Prestige levels: Low (Community), Medium (State), High (Private), Elite (Ivy/Oxbridge)

### Auto-Enrollment Logic
- **Age 3**: Automatically enrolled in public kindergarten
- **Status 1** (Kindergarten complete): Auto-enrolled in primary school
- **Status 2** (Primary complete): Auto-enrolled in secondary school
- **Status 3** (Secondary complete): Education complete, ready for work/university

### Age Restrictions
- **Kindergarten**: Ages 3-6 (max age 6 - greyed out if too old)
- **Primary School**: Ages 5-13 (max age 13 - greyed out if too old)
- **Secondary School**: Ages 12-19 (max age 19 - greyed out if too old)
- **University**: Ages 18+ (no maximum age restriction)

### Public vs Private Schools
Each level offers two options:
- **Public Schools**: Free (cost: 0)
  - Kindergarten: +10 Smarts, +15 Happiness
  - Primary & Secondary: Standard progression
  
- **Private Schools**: Paid
  - Kindergarten: +20 Smarts, +25 Happiness
  - Primary & Secondary: Enhanced curriculum (higher costs)

## Country-Specific School Names

### 🇺🇸 United States
- Kindergarten
- Elementary School (Primary)
- High School (Secondary)

### 🇬🇧 United Kingdom
- Nursery School (Kindergarten)
- Primary School
- Secondary School

### 🇦🇺 Australia
- Kindergarten
- Primary School
- High School

### 🇨🇦 Canada
- Kindergarten
- Elementary School
- High School

### 🇮🇳 India
- Pre-Primary School (Kindergarten)
- Primary School
- Secondary School

### 🇩🇪 Germany
- Kindergarten
- Grundschule (Primary)
- Gymnasium (Secondary)

### 🇫🇷 France
- École Maternelle (Kindergarten)
- École Primaire (Primary)
- Lycée (Secondary)

### 🇯🇵 Japan
- Yōchien (Kindergarten)
- Shōgakkō (Primary)
- Chūgakkō & Kōkō (Secondary)

## Technical Implementation

### Files Modified
1. **src/store/types/education.ts**
   - Simplified `CourseCategory` type to: `'kindergarten' | 'primary' | 'secondary' | 'university'`
   - Added `maxAge?: number` field for age restrictions
   - Removed complex constraints (alternateEntry, minGpa, logicalConstraint, requiredExam, requiredWorkYears)
   - Kept essential fields: id, name, type, description, duration, cost, requiredStatus, requiredAge, maxAge, grantsStatus, preReqs, isPublic

2. **src/store/educationCatalog.ts**
   - Complete rewrite with global system
   - 8 countries with country-specific school names
   - Each country has 4 categories (kindergarten, primary, secondary, university)
   - Each category has 2 options (public/private) except university (4 options)
   - Added `maxAge` restrictions:
     - Kindergarten: maxAge 6
     - Primary: maxAge 13
     - Secondary: maxAge 19
     - University: No max age
   - Simplified `CountryEducationCatalog` interface
   - Helper functions: `getEducationCatalog()`, `getCountryMeta()`

3. **src/store/gameStore.ts**
   - Updated auto-enrollment logic in `advanceYear()`
   - Age 3 → kindergarten (public)
   - Status 1 → primary (public)
   - Status 2 → secondary (public)
   - Updated `enrollCourse()` to remove complex constraint checks
   - Updated `handleCourseCompletion()` to handle kindergarten stat boosts and simplified status system

4. **src/screens/EducationScreen.tsx**
   - Updated badge display to show country-specific school names
   - Enhanced `arePrerequisitesMet()` function to check both minimum and maximum age
   - Courses grey out if:
     - Already completed
     - Prerequisites not met (status/age/skills)
     - Too young (below `requiredAge`)
     - Too old (above `maxAge`)
     - Enrolled in a different course
   - Removed exam and work experience prerequisite checks
   - Simplified course metadata display

## Benefits
1. **Consistency**: Same progression across all countries
2. **Simplicity**: Clear age-based milestones
3. **Cultural Authenticity**: Country-specific school names
4. **Automatic**: No manual enrollment needed for compulsory education
5. **Choice**: Players can opt for private schools at any level
6. **Extensibility**: Easy to add more countries with same structure

## Status Levels
- **0**: No education (birth)
- **1**: Kindergarten complete (age ~5)
- **2**: Primary complete (age ~12)
- **3**: Secondary complete (age ~18)
- **4**: University/College complete (age ~20-22)
- **5-6**: Reserved for future graduate/professional programs

## Current Features
✅ **Kindergarten** - Ages 3-5 (Status 0 → 1)
✅ **Primary School** - Ages 5-12 (Status 1 → 2)
✅ **Secondary School** - Ages 12-18 (Status 2 → 3)
✅ **University** - Ages 18+ (Status 3 → 4)
   - 32 universities across 8 countries
   - 20 majors with skill boosts
   - 3 payment methods (loan/parents/cash)
   - Student loan system with repayment

## Future Expansion
The system is designed to support future additions:
- Graduate school (Master's, PhD - status 5-6)
- Professional certifications
- Vocational training
- Trade schools

All would follow the same simplified structure with country-specific names.
