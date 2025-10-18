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

### Auto-Enrollment Logic
- **Age 3**: Automatically enrolled in public kindergarten
- **Status 1** (Kindergarten complete): Auto-enrolled in primary school
- **Status 2** (Primary complete): Auto-enrolled in secondary school
- **Status 3** (Secondary complete): Education complete, ready for work/university

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
   - Simplified `CourseCategory` type to: `'kindergarten' | 'primary' | 'secondary'`
   - Removed complex constraints (alternateEntry, minGpa, logicalConstraint, requiredExam, requiredWorkYears)
   - Kept essential fields: id, name, type, description, duration, cost, requiredStatus, requiredAge, grantsStatus, preReqs, isPublic

2. **src/store/educationCatalog.ts**
   - Complete rewrite with global system
   - 8 countries with country-specific school names
   - Each country has 3 categories, each with 2 options (public/private)
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
- **4-6**: Reserved for future university levels

## Future Expansion
The system is designed to support future additions:
- University/College (status 4-5)
- Graduate school (status 6)
- Professional certifications
- Vocational training

All would follow the same simplified structure with country-specific names.
