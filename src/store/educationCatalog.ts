import { Course, CourseCategory } from './types/education';

// --- New Global Education System ---
// Age 3: Auto-enroll in Kindergarten
// Age 5: Complete Kindergarten → Auto-enroll in Primary School
// Age 12: Complete Primary → Auto-enroll in Secondary School
// Age 18: Complete Secondary → Ready for university/work

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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private high school with college preparation.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite independent school with superior academics.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary college.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary school.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private international school.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private gymnasium.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private lycée.' 
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
          grantsStatus: 3, 
          isPublic: false,
          description: 'Elite private secondary school.' 
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
