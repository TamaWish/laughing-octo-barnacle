import { Course, CourseCategory, UniversityMajor } from './types/education';

// --- New Global Education System ---
// Age 3: Auto-enroll in Kindergarten
// Age 5: Complete Kindergarten → Auto-enroll in Primary School
// Age 12: Complete Primary → Auto-enroll in Secondary School
// Age 18: Complete Secondary → Ready for university/work
// Age 18+: Can enroll in University (optional, requires Secondary completion)

// =========================================================================
// UNIVERSITY MAJORS - Global list used by all countries
// =========================================================================
export const UNIVERSITY_MAJORS: UniversityMajor[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Study financial markets, investments, and corporate finance.',
    skillBoosts: [{ skill: 'smarts', amount: 25 }],
    careerPaths: ['Finance', 'Banking', 'Investment']
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Learn to design, build, and innovate technological solutions.',
    skillBoosts: [{ skill: 'smarts', amount: 30 }],
    careerPaths: ['Engineering', 'Technology', 'Manufacturing']
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Master media, public relations, and strategic communication.',
    skillBoosts: [{ skill: 'smarts', amount: 20 }, { skill: 'looks', amount: 10 }],
    careerPaths: ['Media', 'Marketing', 'Public Relations']
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Develop your musical talents and artistic expression.',
    skillBoosts: [{ skill: 'smarts', amount: 15 }],
    careerPaths: ['Music', 'Entertainment', 'Arts']
  },
  {
    id: 'economics',
    name: 'Economics',
    description: 'Analyze economic systems, policy, and market behavior.',
    skillBoosts: [{ skill: 'smarts', amount: 25 }],
    careerPaths: ['Economics', 'Policy', 'Research']
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Master programming, algorithms, and software development.',
    skillBoosts: [{ skill: 'smarts', amount: 35 }],
    careerPaths: ['Technology', 'Software', 'IT']
  },
  {
    id: 'business',
    name: 'Business Administration',
    description: 'Learn management, entrepreneurship, and business strategy.',
    skillBoosts: [{ skill: 'smarts', amount: 22 }],
    careerPaths: ['Business', 'Management', 'Entrepreneurship']
  },
  {
    id: 'medicine',
    name: 'Medicine',
    description: 'Train to become a doctor and save lives.',
    skillBoosts: [{ skill: 'smarts', amount: 40 }],
    careerPaths: ['Healthcare', 'Medicine', 'Surgery']
  },
  {
    id: 'law',
    name: 'Law',
    description: 'Study legal systems, advocacy, and justice.',
    skillBoosts: [{ skill: 'smarts', amount: 32 }],
    careerPaths: ['Law', 'Legal', 'Justice']
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'Understand human behavior and mental processes.',
    skillBoosts: [{ skill: 'smarts', amount: 24 }],
    careerPaths: ['Psychology', 'Counseling', 'Research']
  },
  {
    id: 'art',
    name: 'Fine Arts',
    description: 'Express yourself through visual arts and creative design.',
    skillBoosts: [{ skill: 'smarts', amount: 18 }],
    careerPaths: ['Arts', 'Design', 'Creative']
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Explore life sciences and living organisms.',
    skillBoosts: [{ skill: 'smarts', amount: 28 }],
    careerPaths: ['Science', 'Research', 'Healthcare']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Study matter, its properties, and transformations.',
    skillBoosts: [{ skill: 'smarts', amount: 28 }],
    careerPaths: ['Science', 'Pharmaceuticals', 'Research']
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental laws of the universe.',
    skillBoosts: [{ skill: 'smarts', amount: 30 }],
    careerPaths: ['Science', 'Research', 'Engineering']
  },
  {
    id: 'literature',
    name: 'English Literature',
    description: 'Analyze classic and contemporary literary works.',
    skillBoosts: [{ skill: 'smarts', amount: 20 }],
    careerPaths: ['Writing', 'Education', 'Publishing']
  },
  {
    id: 'history',
    name: 'History',
    description: 'Study past civilizations, events, and their impacts.',
    skillBoosts: [{ skill: 'smarts', amount: 22 }],
    careerPaths: ['Education', 'Research', 'Museum']
  },
  {
    id: 'political-science',
    name: 'Political Science',
    description: 'Examine governance, politics, and international relations.',
    skillBoosts: [{ skill: 'smarts', amount: 24 }],
    careerPaths: ['Government', 'Policy', 'Diplomacy']
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'Design buildings and spaces that shape our world.',
    skillBoosts: [{ skill: 'smarts', amount: 26 }],
    careerPaths: ['Architecture', 'Design', 'Construction']
  },
  {
    id: 'nursing',
    name: 'Nursing',
    description: 'Train to provide essential healthcare and patient care.',
    skillBoosts: [{ skill: 'smarts', amount: 26 }],
    careerPaths: ['Healthcare', 'Nursing', 'Medical']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learn to teach and inspire the next generation.',
    skillBoosts: [{ skill: 'smarts', amount: 20 }],
    careerPaths: ['Teaching', 'Education', 'Training']
  },
];

export interface CountryEducationCatalog {
  // List of Categories (kindergarten, primary, secondary)
  categories: { id: CourseCategory; title: string; desc: string }[];
  // Mapping of CourseCategory keys to actual Courses
  courses: Record<CourseCategory, Course[]>;
  // Country-specific configuration
  config: {
    countryName: string;
    flag: string;
    kindergartenName: string; // e.g., "Kindergarten" (US), "Nursery School" (GB)
    primaryName: string; // e.g., "Elementary School" (US), "Primary School" (GB)
    secondaryName: string; // e.g., "High School" (US), "Secondary School" (GB)
    currencySymbol?: string;
  };
}

// =========================================================================
// Country-Specific School Names for Kindergarten, Primary, and Secondary
// =========================================================================

export const COUNTRY_EDUCATION_MAP: Record<string, CountryEducationCatalog> = {
  // 🇺🇸 UNITED STATES
  'US': {
    categories: [
      { id: 'kindergarten', title: 'Kindergarten', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Elementary School', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'High School', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'University', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'us-kindergarten-public', 
          name: 'Public Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public kindergarten. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'us-kindergarten-private', 
          name: 'Private Kindergarten Academy', 
          type: 'Early Education', 
          duration: 2, 
          cost: 5000, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private kindergarten. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'us-primary-public', 
          name: 'Public Elementary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'us-primary-private', 
          name: 'Private Elementary Academy', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 15000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private elementary school with enhanced curriculum.' 
        },
      ],
      secondary: [
        { 
          id: 'us-secondary-public', 
          name: 'Public High School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education. Ages 12-18.' 
        },
        { 
          id: 'us-secondary-private', 
          name: 'Private Preparatory School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 30000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private high school with college preparation.' 
        },
      ],
      university: [
        {
          id: 'us-university-community',
          name: 'Community College',
          type: 'Higher Education',
          duration: 2,
          cost: 8000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'nursing', 'education', 'art'].includes(m.id)),
          description: 'Affordable 2-year associate degree program.'
        },
        {
          id: 'us-university-state',
          name: 'State University',
          type: 'Higher Education',
          duration: 4,
          cost: 25000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'Public university offering diverse degree programs.'
        },
        {
          id: 'us-university-private',
          name: 'Private University',
          type: 'Higher Education',
          duration: 4,
          cost: 60000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: false,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'Prestigious private university with excellent resources.'
        },
        {
          id: 'us-university-ivy',
          name: 'Ivy League University',
          type: 'Higher Education',
          duration: 4,
          cost: 80000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: false,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 80 },
          description: 'Elite Ivy League institution - requires high intelligence.'
        },
      ],
    },
    config: {
      countryName: 'United States',
      flag: '🇺🇸',
      kindergartenName: 'Kindergarten',
      primaryName: 'Elementary School',
      secondaryName: 'High School',
      currencySymbol: '$',
    }
  },

  // 🇬🇧 UNITED KINGDOM
  'GB': {
    categories: [
      { id: 'kindergarten', title: 'Nursery School', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Primary School', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'Secondary School', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'University', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'gb-kindergarten-public', 
          name: 'State Nursery School', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free state-funded nursery school. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'gb-kindergarten-private', 
          name: 'Private Nursery Academy', 
          type: 'Early Education', 
          duration: 2, 
          cost: 4500, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private nursery school. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'gb-primary-public', 
          name: 'State Primary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'gb-primary-private', 
          name: 'Private Preparatory School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 18000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private primary school.' 
        },
      ],
      secondary: [
        { 
          id: 'gb-secondary-public', 
          name: 'State Secondary School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education leading to GCSEs and A-Levels.' 
        },
        { 
          id: 'gb-secondary-private', 
          name: 'Private Grammar School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 35000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite independent school with superior academics.' 
        },
      ],
      university: [
        {
          id: 'gb-university-polytechnic',
          name: 'Polytechnic',
          type: 'Higher Education',
          duration: 3,
          cost: 12000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'engineering', 'nursing', 'education'].includes(m.id)),
          description: 'Practical career-focused polytechnic education.'
        },
        {
          id: 'gb-university-standard',
          name: 'British University',
          type: 'Higher Education',
          duration: 3,
          cost: 15000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'Traditional UK university with 3-year degree programs.'
        },
        {
          id: 'gb-university-russell',
          name: 'Russell Group University',
          type: 'Higher Education',
          duration: 3,
          cost: 18000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'Prestigious research-intensive university.'
        },
        {
          id: 'gb-university-oxbridge',
          name: 'Oxford/Cambridge',
          type: 'Higher Education',
          duration: 3,
          cost: 22000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 85 },
          description: 'World-renowned Oxbridge institution - requires exceptional intelligence.'
        },
      ],
    },
    config: {
      countryName: 'United Kingdom',
      flag: '🇬🇧',
      kindergartenName: 'Nursery School',
      primaryName: 'Primary School',
      secondaryName: 'Secondary School',
      currencySymbol: '£',
    }
  },

  // 🇦🇺 AUSTRALIA
  'AU': {
    categories: [
      { id: 'kindergarten', title: 'Kindergarten', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Primary School', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'High School', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'University', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'au-kindergarten-public', 
          name: 'Public Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public kindergarten. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'au-kindergarten-private', 
          name: 'Private Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 4800, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private kindergarten. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'au-primary-public', 
          name: 'Public Primary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'au-primary-private', 
          name: 'Private Primary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 16000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private primary school.' 
        },
      ],
      secondary: [
        { 
          id: 'au-secondary-public', 
          name: 'Public High School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education. Ages 12-18.' 
        },
        { 
          id: 'au-secondary-private', 
          name: 'Private College', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 28000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary college.' 
        },
      ],
      university: [
        {
          id: 'au-university-tafe',
          name: 'TAFE',
          type: 'Higher Education',
          duration: 2,
          cost: 6000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'nursing', 'education', 'art'].includes(m.id)),
          description: 'Technical and Further Education - practical vocational training.'
        },
        {
          id: 'au-university-standard',
          name: 'Australian University',
          type: 'Higher Education',
          duration: 3,
          cost: 15000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'Standard Australian university degree program.'
        },
        {
          id: 'au-university-go8',
          name: 'Group of Eight University',
          type: 'Higher Education',
          duration: 3,
          cost: 20000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'Elite Go8 research university.'
        },
        {
          id: 'au-university-sandstone',
          name: 'Sandstone University',
          type: 'Higher Education',
          duration: 3,
          cost: 22000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 82 },
          description: 'Historic sandstone university - top-tier Australian institution.'
        },
      ],
    },
    config: {
      countryName: 'Australia',
      flag: '🇦🇺',
      kindergartenName: 'Kindergarten',
      primaryName: 'Primary School',
      secondaryName: 'High School',
      currencySymbol: '$',
    }
  },

  // 🇨🇦 CANADA
  'CA': {
    categories: [
      { id: 'kindergarten', title: 'Kindergarten', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Elementary School', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'High School', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'University', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'ca-kindergarten-public', 
          name: 'Public Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public kindergarten. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'ca-kindergarten-private', 
          name: 'Private Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 4200, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private kindergarten. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'ca-primary-public', 
          name: 'Public Elementary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'ca-primary-private', 
          name: 'Private Elementary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 14000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private elementary school.' 
        },
      ],
      secondary: [
        { 
          id: 'ca-secondary-public', 
          name: 'Public High School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education. Ages 12-18.' 
        },
        { 
          id: 'ca-secondary-private', 
          name: 'Private Secondary School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 25000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary school.' 
        },
      ],
      university: [
        {
          id: 'ca-university-college',
          name: 'Community College',
          type: 'Higher Education',
          duration: 2,
          cost: 10000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'nursing', 'education'].includes(m.id)),
          description: 'Canadian community college with practical programs.'
        },
        {
          id: 'ca-university-standard',
          name: 'Canadian University',
          type: 'Higher Education',
          duration: 4,
          cost: 20000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'Standard Canadian university degree program.'
        },
        {
          id: 'ca-university-u15',
          name: 'U15 Research University',
          type: 'Higher Education',
          duration: 4,
          cost: 25000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'Top-tier Canadian research university.'
        },
        {
          id: 'ca-university-elite',
          name: 'McGill/Toronto/UBC',
          type: 'Higher Education',
          duration: 4,
          cost: 28000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 83 },
          description: 'Elite Canadian university - world-class education.'
        },
      ],
    },
    config: {
      countryName: 'Canada',
      flag: '🇨🇦',
      kindergartenName: 'Kindergarten',
      primaryName: 'Elementary School',
      secondaryName: 'High School',
      currencySymbol: '$',
    }
  },

  // 🇮🇳 INDIA
  'IN': {
    categories: [
      { id: 'kindergarten', title: 'Pre-Primary School', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Primary School', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'Secondary School', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'University', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'in-kindergarten-public', 
          name: 'Government Pre-Primary School', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free government pre-primary school. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'in-kindergarten-private', 
          name: 'Private Montessori School', 
          type: 'Early Education', 
          duration: 2, 
          cost: 3500, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private pre-primary school. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'in-primary-public', 
          name: 'Government Primary School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'in-primary-private', 
          name: 'Private CBSE School', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 10000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private CBSE-affiliated school.' 
        },
      ],
      secondary: [
        { 
          id: 'in-secondary-public', 
          name: 'Government Secondary School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education. Ages 12-18.' 
        },
        { 
          id: 'in-secondary-private', 
          name: 'Private International School', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 20000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19, 
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private international school.' 
        },
      ],
      university: [
        {
          id: 'in-university-local',
          name: 'Regional University',
          type: 'Higher Education',
          duration: 3,
          cost: 3000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'education', 'art', 'literature'].includes(m.id)),
          description: 'Local regional university with affordable education.'
        },
        {
          id: 'in-university-central',
          name: 'Central University',
          type: 'Higher Education',
          duration: 3,
          cost: 5000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'Centrally-funded university with quality programs.'
        },
        {
          id: 'in-university-nit',
          name: 'NIT/IIIT',
          type: 'Higher Education',
          duration: 4,
          cost: 8000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'National Institute of Technology - premier technical institution.'
        },
        {
          id: 'in-university-iit',
          name: 'IIT/IIM',
          type: 'Higher Education',
          duration: 4,
          cost: 10000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 88 },
          description: 'Indian Institute of Technology/Management - world-class elite institution.'
        },
      ],
    },
    config: {
      countryName: 'India',
      flag: '🇮🇳',
      kindergartenName: 'Pre-Primary School',
      primaryName: 'Primary School',
      secondaryName: 'Secondary School',
      currencySymbol: '₹',
    }
  },

  // 🇩🇪 GERMANY
  'DE': {
    categories: [
      { id: 'kindergarten', title: 'Kindergarten', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Grundschule', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'Gymnasium', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'Universität', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'de-kindergarten-public', 
          name: 'Öffentlicher Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public kindergarten. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'de-kindergarten-private', 
          name: 'Privater Kindergarten', 
          type: 'Early Education', 
          duration: 2, 
          cost: 3800, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private kindergarten. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'de-primary-public', 
          name: 'Öffentliche Grundschule', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'de-primary-private', 
          name: 'Private Grundschule', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 12000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private primary school.' 
        },
      ],
      secondary: [
        { 
          id: 'de-secondary-public', 
          name: 'Öffentliches Gymnasium', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education leading to Abitur.' 
        },
        { 
          id: 'de-secondary-private', 
          name: 'Privates Gymnasium', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 22000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private gymnasium.' 
        },
      ],
      university: [
        {
          id: 'de-university-fh',
          name: 'Fachhochschule',
          type: 'Higher Education',
          duration: 3,
          cost: 1000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'engineering', 'computer-science'].includes(m.id)),
          description: 'University of Applied Sciences - practical education.'
        },
        {
          id: 'de-university-standard',
          name: 'Universität',
          type: 'Higher Education',
          duration: 3,
          cost: 1500,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'German university with nominal fees - excellent education.'
        },
        {
          id: 'de-university-tu',
          name: 'Technische Universität',
          type: 'Higher Education',
          duration: 4,
          cost: 1500,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS.filter(m => ['engineering', 'computer-science', 'physics', 'architecture'].includes(m.id)),
          description: 'Technical University - leading engineering institution.'
        },
        {
          id: 'de-university-elite',
          name: 'Heidelberg/Munich/Berlin',
          type: 'Higher Education',
          duration: 3,
          cost: 2000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 84 },
          description: 'Elite German university - world-renowned research institution.'
        },
      ],
    },
    config: {
      countryName: 'Germany',
      flag: '🇩🇪',
      kindergartenName: 'Kindergarten',
      primaryName: 'Grundschule',
      secondaryName: 'Gymnasium',
      currencySymbol: '€',
    }
  },

  // 🇫🇷 FRANCE
  'FR': {
    categories: [
      { id: 'kindergarten', title: 'École Maternelle', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'École Primaire', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'Lycée', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'Université', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'fr-kindergarten-public', 
          name: 'École Maternelle Publique', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public preschool. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'fr-kindergarten-private', 
          name: 'École Maternelle Privée', 
          type: 'Early Education', 
          duration: 2, 
          cost: 4000, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private preschool. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'fr-primary-public', 
          name: 'École Primaire Publique', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'fr-primary-private', 
          name: 'École Primaire Privée', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 11000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private primary school.' 
        },
      ],
      secondary: [
        { 
          id: 'fr-secondary-public', 
          name: 'Lycée Public', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education leading to Baccalauréat.' 
        },
        { 
          id: 'fr-secondary-private', 
          name: 'Lycée Privé', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 24000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private lycée.' 
        },
      ],
      university: [
        {
          id: 'fr-university-standard',
          name: 'Université Publique',
          type: 'Higher Education',
          duration: 3,
          cost: 500,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS,
          description: 'Public French university - very affordable education.'
        },
        {
          id: 'fr-university-grande-ecole',
          name: 'Grande École',
          type: 'Higher Education',
          duration: 4,
          cost: 8000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: false,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS.filter(m => ['engineering', 'business', 'political-science'].includes(m.id)),
          description: 'Prestigious Grande École - elite French institution.'
        },
        {
          id: 'fr-university-sciences-po',
          name: 'Sciences Po Paris',
          type: 'Higher Education',
          duration: 4,
          cost: 12000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: false,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS.filter(m => ['political-science', 'economics', 'law', 'business'].includes(m.id)),
          preReqs: { requiredSkill: 'smarts', value: 86 },
          description: 'Sciences Po Paris - world-leading political science institution.'
        },
        {
          id: 'fr-university-sorbonne',
          name: 'La Sorbonne',
          type: 'Higher Education',
          duration: 3,
          cost: 1000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 85 },
          description: 'Historic Sorbonne University - iconic French institution.'
        },
      ],
    },
    config: {
      countryName: 'France',
      flag: '🇫🇷',
      kindergartenName: 'École Maternelle',
      primaryName: 'École Primaire',
      secondaryName: 'Lycée',
      currencySymbol: '€',
    }
  },

  // 🇯🇵 JAPAN
  'JP': {
    categories: [
      { id: 'kindergarten', title: 'Yōchien', desc: 'Early education for ages 3-5' },
      { id: 'primary', title: 'Shōgakkō', desc: 'Primary education ages 5-12' },
      { id: 'secondary', title: 'Chūgakkō & Kōkō', desc: 'Secondary education ages 12-18' },
      { id: 'university', title: 'Daigaku', desc: 'Higher education ages 18+' },
    ],
    courses: {
      kindergarten: [
        { 
          id: 'jp-kindergarten-public', 
          name: 'Public Yōchien', 
          type: 'Early Education', 
          duration: 2, 
          cost: 0, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: true,
          description: 'Free public kindergarten. Boosts Smarts +10, Happiness +15.' 
        },
        { 
          id: 'jp-kindergarten-private', 
          name: 'Private Yōchien', 
          type: 'Early Education', 
          duration: 2, 
          cost: 5500, 
          requiredStatus: 0, 
          requiredAge: 3, 
          maxAge: 6,
          grantsStatus: 1, 
          isPublic: false,
          description: 'Premium private kindergarten. Boosts Smarts +20, Happiness +25.' 
        },
      ],
      primary: [
        { 
          id: 'jp-primary-public', 
          name: 'Public Shōgakkō', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 0, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: true,
          description: 'Free compulsory primary education. Ages 5-12.' 
        },
        { 
          id: 'jp-primary-private', 
          name: 'Private Shōgakkō', 
          type: 'Primary Education', 
          duration: 7, 
          cost: 18000, 
          requiredStatus: 1, 
          requiredAge: 5, 
          maxAge: 13,
          grantsStatus: 2, 
          isPublic: false,
          description: 'Premium private elementary school.' 
        },
      ],
      secondary: [
        { 
          id: 'jp-secondary-public', 
          name: 'Public Chūgakkō & Kōkō', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 0, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19,
          grantsStatus: 3, 
          isPublic: true,
          description: 'Free compulsory secondary education. Ages 12-18.' 
        },
        { 
          id: 'jp-secondary-private', 
          name: 'Private Chūgakkō & Kōkō', 
          type: 'Secondary Education', 
          duration: 6, 
          cost: 32000, 
          requiredStatus: 2, 
          requiredAge: 12, 
          maxAge: 19, 
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary school.' 
        },
      ],
      university: [
        {
          id: 'jp-university-local',
          name: 'Regional Daigaku',
          type: 'Higher Education',
          duration: 4,
          cost: 12000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'low',
          majors: UNIVERSITY_MAJORS.filter(m => ['business', 'education', 'art'].includes(m.id)),
          description: 'Regional Japanese university.'
        },
        {
          id: 'jp-university-standard',
          name: 'National University',
          type: 'Higher Education',
          duration: 4,
          cost: 15000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'medium',
          majors: UNIVERSITY_MAJORS,
          description: 'National university with strong academic programs.'
        },
        {
          id: 'jp-university-keio-waseda',
          name: 'Keio/Waseda University',
          type: 'Higher Education',
          duration: 4,
          cost: 25000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: false,
          prestige: 'high',
          majors: UNIVERSITY_MAJORS,
          description: 'Top private Japanese university.'
        },
        {
          id: 'jp-university-todai',
          name: 'University of Tokyo (Todai)',
          type: 'Higher Education',
          duration: 4,
          cost: 18000,
          requiredStatus: 3,
          requiredAge: 18,
          grantsStatus: 4,
          isPublic: true,
          prestige: 'elite',
          majors: UNIVERSITY_MAJORS,
          preReqs: { requiredSkill: 'smarts', value: 90 },
          description: 'University of Tokyo - Japan\'s most prestigious institution.'
        },
      ],
    },
    config: {
      countryName: 'Japan',
      flag: '🇯🇵',
      kindergartenName: 'Yōchien',
      primaryName: 'Shōgakkō',
      secondaryName: 'Chūgakkō & Kōkō',
      currencySymbol: '¥',
    }
  },
};

// Helper function to get education catalog for a country
export function getEducationCatalog(countryCode: string): CountryEducationCatalog {
  return COUNTRY_EDUCATION_MAP[countryCode] || COUNTRY_EDUCATION_MAP['US'];
}

// Helper function to get country metadata
export function getCountryMeta(countryCode: string) {
  const catalog = getEducationCatalog(countryCode);
  return {
    name: catalog.config.countryName,
    flag: catalog.config.flag,
  };
}
