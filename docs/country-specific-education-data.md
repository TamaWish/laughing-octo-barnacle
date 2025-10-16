import { Course, CourseCategory, PreReqs } from './types/education';

// --- New Interfaces for Country-Specific Catalogs ---

export interface CountryEducationCatalog {
  // List of Categories specific to the country's system
  categories: { id: CourseCategory; title: string; desc: string }[];
  // Mapping of CourseCategory keys to actual Courses
  courses: Record<CourseCategory, Course[]>;
  // Optional country-specific rules or context
  config?: {
    // E.g., The name for the final High School equivalent degree
    highSchoolName: string; 
    universityDuration: number; // e.g., 4 years (US) vs 3 years (GB, AU)
    hasEntranceExam?: string; // e.g., 'SAT', 'A-Levels', 'JEE'
    tradeSchoolName: string; // e.g., 'Vocational School' vs 'Polytechnic'
    currencySymbol?: string; // Optional: Allows for future money display changes
  };
}

// =========================================================================
// Mapped Country Education Catalogs
// =========================================================================

export const COUNTRY_EDUCATION_MAP: Record<string, CountryEducationCatalog> = {
  // -----------------------------------------------------------
  // 🇺🇸 UNITED STATES (US) - Default Structure
  // -----------------------------------------------------------
  'US': {
    categories: [
      { id: 'cc', title: 'Community College', desc: 'Affordable two-year programs and certificates.' },
      { id: 'uni', title: 'University', desc: 'Four-year degrees with a broad curriculum.' },
      { id: 'grad', title: 'Graduate School', desc: 'Advanced degrees (Masters / PhD).' },
      { id: 'bus', title: 'Business School', desc: 'MBA and professional business degrees.' },
      { id: 'voc', title: 'Vocational School', desc: 'Trade skills and hands-on training.' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning from home.' },
    ],
    courses: {
      cc: [
        { id: 'cc-aa', name: 'General Studies A.A.', type: 'Academic Transfer', duration: 2, cost: 4000, requiredStatus: 2, grantsStatus: 4, description: 'Standard transfer degree for humanities.' },
        { id: 'cc-as-eng', name: 'Assoc. of Science in Eng. Tech', type: 'Academic/Trade', duration: 2, cost: 4500, requiredStatus: 2, grantsStatus: 4, preReqs: { requiredSkill: 'smarts', value: 50 }, description: 'Focus on math, physics, and CAD.' },
        { id: 'cc-cna', name: 'Certified Nursing Assistant (CNA)', type: 'Trade Certificate', duration: 1, cost: 1500, requiredStatus: 2, grantsStatus: 3, preReqs: { requiredSkill: 'health', value: 50 }, description: 'Basic patient care and medical procedures.' },
        { id: 'cc-plumb', name: 'Plumber Apprenticeship', type: 'Trade Certificate', duration: 1.5, cost: 2000, requiredStatus: 2, grantsStatus: 3, preReqs: { requiredSkill: 'health', value: 40 }, logicalConstraint: { blocksAcademic: true }, description: 'Hands-on training for plumbing systems.' },
        { id: 'cc-digimark', name: 'Digital Marketing Certificate', type: 'Trade Certificate', duration: 0.5, cost: 800, requiredStatus: 2, grantsStatus: 3, description: 'Social media, SEO, and online advertising.' },
      ],
      uni: [
        { id: 'uni-ba-law', name: 'B.A. in Liberal Arts/Pre-Law', type: 'Academic', duration: 4, cost: 12000, requiredStatus: 4, grantsStatus: 5, description: 'Critical thinking and rhetoric.' },
        { id: 'uni-rn', name: 'B.S. in Registered Nursing (RN)', type: 'Pre-Professional', duration: 4, cost: 14000, requiredStatus: 4, grantsStatus: 5, preReqs: { requiredSkill: 'health', value: 60 }, description: 'Comprehensive medical training for nursing.' },
        { id: 'uni-premed', name: 'B.S. in Pre-Medical Studies', type: 'Pre-Professional', duration: 4, cost: 15000, requiredStatus: 4, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 70 }, logicalConstraint: { blocksIfTradeCertificate: ['cc-cna'] }, description: 'Heavy focus on Chemistry, Biology, Physics.' },
        { id: 'uni-cs', name: 'B.S. in Computer Science', type: 'Technical', duration: 4, cost: 13000, requiredStatus: 4, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 65 }, description: 'Algorithms, data structures, software engineering.' },
        { id: 'uni-journal', name: 'B.A. in Journalism & Media', type: 'Academic', duration: 4, cost: 11000, requiredStatus: 4, grantsStatus: 5, description: 'Reporting, ethics, and communications.' },
      ],
      grad: [
        { id: 'grad-md', name: 'Medical School (M.D.)', type: 'Professional', duration: 4, cost: 30000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'MCAT', description: 'Intensive clinical training.' },
        { id: 'grad-jd', name: 'Juris Doctor (J.D.)', type: 'Professional', duration: 3, cost: 25000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'LSAT', description: 'Professional degree to practice law.' },
        { id: 'grad-phd-physics', name: 'Ph.D. in Physics', type: 'Research', duration: 5, cost: 20000, requiredStatus: 5, grantsStatus: 6, preReqs: { requiredSkill: 'smarts', value: 80 }, description: 'Research degree for advanced discovery and academia.' },
      ],
      bus: [
        { id: 'bus-mba', name: 'Master of Business Admin (MBA)', type: 'Professional', duration: 2, cost: 22000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 2, description: 'Management degree for executives.' },
        { id: 'bus-mfin', name: 'Master of Finance (M.Fin)', type: 'Specialized', duration: 1.5, cost: 18000, requiredStatus: 5, grantsStatus: 6, preReqs: { requiredSkill: 'smarts', value: 70 }, description: 'Financial modeling and investment strategy.' },
      ],
      voc: [
        { id: 'voc-electric', name: 'Master Electrician License', type: 'Trade', duration: 2, cost: 6000, requiredStatus: 2, grantsStatus: 3, description: 'On-the-job training and safety certification.' },
        { id: 'voc-pilot', name: 'Commercial Pilot License (CPL)', type: 'Trade', duration: 1.5, cost: 20000, requiredStatus: 2, grantsStatus: 3, description: 'Training for flying aircraft.' },
        { id: 'voc-cosmo', name: 'Cosmetology License', type: 'Trade', duration: 0.75, cost: 2500, requiredStatus: 2, grantsStatus: 3, description: 'Training in hair, skin, and nail care.' },
        { id: 'voc-culinary', name: 'Culinary Arts Certificate', type: 'Trade', duration: 1, cost: 3000, requiredStatus: 2, grantsStatus: 3, description: 'Professional cooking techniques and management.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
        { id: 'on-finance', name: 'Personal Finance & Investing', type: 'Skill Boost', duration: 0.25, cost: 120, requiredStatus: 2, grantsStatus: 0, description: 'Budgeting, debt, credit, and investing basics.' },
        { id: 'on-uxui', name: 'UX/UI Design Fundamentals', type: 'Skill Boost', duration: 0.33, cost: 250, requiredStatus: 2, grantsStatus: 0, description: 'Intro to UX and UI design principles.' },
        { id: 'on-ceh', name: 'Certified Ethical Hacker (CEH)', type: 'Skill Boost', duration: 0.5, cost: 800, requiredStatus: 2, grantsStatus: 0, preReqs: { requiredSkill: 'smarts', value: 50 }, description: 'Network security testing and vulnerability assessment.' },
      ],
    },
    config: {
        highSchoolName: 'High School Diploma',
        universityDuration: 4,
        hasEntranceExam: 'SAT/ACT',
        tradeSchoolName: 'Vocational School',
        currencySymbol: '$',
    }
  },

  // -----------------------------------------------------------
  // 🇬🇧 UNITED KINGDOM (GB)
  // -----------------------------------------------------------
  'GB': {
    categories: [
      { id: 'cc', title: 'Further Education', desc: 'College courses (A-Levels, BTECs) after compulsory school.' },
      { id: 'uni', title: 'University', desc: 'Three-year Bachelor\'s degrees (BSc, BA).' },
      { id: 'grad', title: 'Postgraduate Study', desc: 'Masters (MA/MSc) and Doctoral (PhD) qualifications.' },
      { id: 'bus', title: 'Business School', desc: 'MBA and specialized Master\'s degrees.' },
      { id: 'voc', title: 'Apprenticeships & Trades', desc: 'On-the-job training leading to certification.' },
      { id: 'online', title: 'Online Learning', desc: 'Flexible skill building.' },
    ],
    courses: {
      cc: [
        { id: 'gb-alevels', name: 'A-Levels (3 Subjects)', type: 'Academic Pathway', duration: 2, cost: 0, requiredStatus: 1, grantsStatus: 2, description: 'Required for university application.' },
        { id: 'gb-btec', name: 'BTEC Extended Diploma', type: 'Vocational Pathway', duration: 2, cost: 0, requiredStatus: 1, grantsStatus: 2, description: 'Work-related course equivalent to 3 A-Levels.' },
      ],
      uni: [
        { id: 'uni-ba-hist', name: 'B.A. in History', type: 'Academic', duration: 3, cost: 9250, requiredStatus: 2, grantsStatus: 5, description: 'Focuses on critical historical analysis.' },
        { id: 'uni-bsc-cs', name: 'B.Sc. in Computer Science', type: 'Technical', duration: 3, cost: 9250, requiredStatus: 2, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 65 }, description: 'Algorithms and software development.' },
        { id: 'uni-mbbs', name: 'Medicine (MBBS)', type: 'Undergrad Professional', duration: 5, cost: 30000, requiredStatus: 2, requiredExam: 'UCAT/BMAT', grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 80 }, description: 'Undergraduate medical qualification.' },
        { id: 'uni-meng', name: 'M.Eng. in Civil Engineering (Integrated)', type: 'Technical/Master', duration: 4, cost: 9250, requiredStatus: 2, grantsStatus: 6, preReqs: { requiredSkill: 'smarts', value: 70 }, description: 'Advanced engineering degree.' },
      ],
      grad: [
        { id: 'grad-msc-fin', name: 'M.Sc. in Finance', type: 'Specialized Master', duration: 1, cost: 15000, requiredStatus: 5, grantsStatus: 6, description: 'One-year intensive finance degree.' },
        { id: 'grad-phd', name: 'Ph.D. Research', type: 'Research', duration: 3, cost: 10000, requiredStatus: 6, preReqs: { requiredSkill: 'smarts', value: 85 }, description: 'Doctoral research degree.' },
      ],
      bus: [
        { id: 'bus-mba-uk', name: 'MBA (UK)', type: 'Professional', duration: 1, cost: 20000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 2, description: 'One-year management degree.' },
      ],
      voc: [
        { id: 'voc-apprentice', name: 'Advanced Electrical Apprenticeship', type: 'Trade', duration: 4, cost: 0, requiredStatus: 2, grantsStatus: 3, description: 'Long-term, paid training in a skilled trade.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'A-Levels/BTEC',
        universityDuration: 3,
        hasEntranceExam: 'UCAS Points',
        tradeSchoolName: 'Further Education College',
        currencySymbol: '£',
    }
  },

  // -----------------------------------------------------------
  // 🇨🇦 CANADA (CA)
  // -----------------------------------------------------------
  'CA': {
    categories: [
      { id: 'cc', title: 'CEGEP/College', desc: 'Post-secondary institutions offering diplomas and transfers.' },
      { id: 'uni', title: 'University', desc: 'Three or four-year Bachelor\'s degrees (BA, BSc, BComm).' },
      { id: 'grad', title: 'Graduate Studies', desc: 'Masters and Doctoral programs.' },
      { id: 'bus', title: 'Business/Commerce School', desc: 'MBA and specialized graduate certificates.' },
      { id: 'voc', title: 'Trade School/Apprenticeship', desc: 'Journeyman certificates and skilled trades training.' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning.' },
    ],
    courses: {
      cc: [
        { id: 'ca-diploma', name: 'Applied Technology Diploma', type: 'Career Diploma', duration: 2, cost: 4000, requiredStatus: 2, grantsStatus: 3, description: 'Hands-on technical training for direct employment.' },
        { id: 'ca-transfer', name: 'Arts & Science Transfer', type: 'Academic Transfer', duration: 2, cost: 5000, requiredStatus: 2, grantsStatus: 4, description: 'Prepares for seamless University transfer.' },
      ],
      uni: [
        { id: 'uni-bcomm', name: 'Bachelor of Commerce (BComm)', type: 'Professional', duration: 4, cost: 18000, requiredStatus: 4, grantsStatus: 5, description: 'Management, finance, and accounting focus.' },
        { id: 'uni-bachelor-arts', name: 'B.A. in Psychology', type: 'Academic', duration: 3, cost: 15000, requiredStatus: 4, grantsStatus: 5, description: 'Three-year general arts degree (common outside Ontario).' },
        { id: 'uni-eng', name: 'Bachelor of Engineering (B.Eng)', type: 'Technical', duration: 4, cost: 20000, requiredStatus: 4, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 70 }, description: 'Accredited professional engineering degree.' },
      ],
      grad: [
        { id: 'grad-llm', name: 'Master of Laws (LLM)', type: 'Professional', duration: 1, cost: 20000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'LSAT', description: 'Advanced legal specialization after J.D. or equivalent.' },
      ],
      bus: [
        { id: 'bus-mba-ca', name: 'Master of Business Admin (MBA)', type: 'Professional', duration: 2, cost: 28000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 2, description: 'Top-tier management degree.' },
      ],
      voc: [
        { id: 'voc-journeyman', name: 'Red Seal Journeyman Certificate (Weld)', type: 'Trade', duration: 3, cost: 5000, requiredStatus: 2, grantsStatus: 3, description: 'Highest level of trade certification.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'High School Diploma/CEGEP',
        universityDuration: 4, // Average for most provinces
        hasEntranceExam: 'High School Average',
        tradeSchoolName: 'Technical Institute/College',
        currencySymbol: '$',
    }
  },

  // -----------------------------------------------------------
  // 🇦🇺 AUSTRALIA (AU)
  // -----------------------------------------------------------
  'AU': {
    categories: [
      { id: 'cc', title: 'TAFE/VET', desc: 'Vocational Education and Training diplomas (VET).' },
      { id: 'uni', title: 'University', desc: 'Three-year Bachelor\'s degrees (often 3 years).' },
      { id: 'grad', title: 'Postgraduate Studies', desc: 'Masters and Doctoral programs.' },
      { id: 'bus', title: 'Business/Commerce School', desc: 'MBA and specialized graduate certificates.' },
      { id: 'voc', title: 'Apprenticeships & Trades', desc: 'Trade certification leading to job readiness.' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning.' },
    ],
    courses: {
      cc: [
        { id: 'au-vet-cert', name: 'Certificate IV in Automotive', type: 'Trade Certificate', duration: 0.5, cost: 1500, requiredStatus: 2, grantsStatus: 3, description: 'Quick trade certification via Vocational Education.' },
        { id: 'au-tafe-dip', name: 'TAFE Advanced Diploma', type: 'Academic/Trade', duration: 2, cost: 6000, requiredStatus: 2, grantsStatus: 4, description: 'High-level vocational qualification for job or uni credit.' },
      ],
      uni: [
        { id: 'uni-barts', name: 'Bachelor of Arts (BA)', type: 'Academic', duration: 3, cost: 10000, requiredStatus: 2, grantsStatus: 5, description: 'Three-year standard liberal arts degree.' },
        { id: 'uni-blaw', name: 'Bachelor of Laws (LLB)', type: 'Professional', duration: 4, cost: 18000, requiredStatus: 2, grantsStatus: 5, description: 'Undergraduate professional degree in law.' },
        { id: 'uni-beng', name: 'Bachelor of Engineering (Honours)', type: 'Technical', duration: 4, cost: 15000, requiredStatus: 2, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 70 }, description: 'Professional qualification to become an engineer.' },
      ],
      grad: [
        { id: 'grad-mphil', name: 'Master of Philosophy (MPhil)', type: 'Research Master', duration: 2, cost: 10000, requiredStatus: 5, grantsStatus: 6, description: 'Advanced research pathway to PhD.' },
      ],
      bus: [
        { id: 'bus-mba-au', name: 'Master of Business Admin (MBA)', type: 'Professional', duration: 1.5, cost: 25000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 3, description: 'Industry-focused management degree.' },
      ],
      voc: [
        { id: 'voc-apprentice-chef', name: 'Apprenticeship (Chef)', type: 'Trade', duration: 4, cost: 0, requiredStatus: 2, grantsStatus: 3, description: 'Paid, structured four-year culinary apprenticeship.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'HSC/ATAR',
        universityDuration: 3,
        hasEntranceExam: 'ATAR Score',
        tradeSchoolName: 'TAFE',
        currencySymbol: '$',
    }
  },

  // -----------------------------------------------------------
  // 🇯🇵 JAPAN (JP)
  // -----------------------------------------------------------
  'JP': {
    categories: [
      { id: 'cc', title: 'Senmon Gakko (Specialized Training)', desc: 'Vocational schools offering practical certifications.' },
      { id: 'uni', title: 'University', desc: 'Four-year Bachelor\'s degrees (Gakushi).' },
      { id: 'grad', title: 'Graduate School', desc: 'Masters and Doctoral programs.' },
      { id: 'bus', title: 'Business/Management', desc: 'Graduate-level business specialization.' },
      { id: 'voc', title: 'Technical Colleges (KOSEN)', desc: 'Engineering and technical diplomas.' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning.' },
    ],
    courses: {
      cc: [
        { id: 'jp-senmon', name: 'IT Senmon Gakko Diploma', type: 'Vocational', duration: 2, cost: 8000, requiredStatus: 2, grantsStatus: 3, description: 'Specialized diploma for direct technical employment.' },
      ],
      uni: [
        { id: 'uni-econ', name: 'Gakushi in Economics', type: 'Academic', duration: 4, cost: 15000, requiredStatus: 2, grantsStatus: 5, requiredExam: 'National Center Test', preReqs: { requiredSkill: 'smarts', value: 60 }, description: 'Focuses on complex economic theory and analysis.' },
        { id: 'uni-eng-gakushi', name: 'Gakushi in Engineering', type: 'Technical', duration: 4, cost: 18000, requiredStatus: 2, grantsStatus: 5, preReqs: { requiredSkill: 'smarts', value: 75 }, description: 'Required entry for high-tech manufacturing careers.' },
      ],
      grad: [
        { id: 'grad-shuushi-sci', name: 'Master of Science (Shuushi)', type: 'Research Master', duration: 2, cost: 10000, requiredStatus: 5, grantsStatus: 6, description: 'Advanced research for high-level R&D roles.' },
      ],
      bus: [
        { id: 'bus-mba-jp', name: 'MBA (Keiei-Gakushi)', type: 'Professional', duration: 2, cost: 25000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 3, description: 'Management degree focusing on global business practice.' },
      ],
      voc: [
        { id: 'voc-kosen', name: 'KOSEN Advanced Diploma', type: 'Technical Trade', duration: 5, cost: 5000, requiredStatus: 1, grantsStatus: 3, description: 'Five-year intensive technical college starting post-Junior High.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'High School Certificate/A-Levels',
        universityDuration: 4,
        hasEntranceExam: 'National Center Test',
        tradeSchoolName: 'Senmon Gakko',
        currencySymbol: '¥',
    }
  },

  // -----------------------------------------------------------
  // 🇮🇳 INDIA (IN)
  // -----------------------------------------------------------
  'IN': {
    categories: [
      { id: 'cc', title: 'Polytechnic/Diploma', desc: 'Technical education after 10th or 12th grade.' },
      { id: 'uni', title: 'University/Institution', desc: 'Three to four-year professional degrees (B.Tech, B.A.).' },
      { id: 'grad', title: 'Postgraduate Studies', desc: 'Masters (M.Tech, M.D.) and Doctoral (Ph.D) programs.' },
      { id: 'bus', title: 'Management Institutes', desc: 'MBA and specialized Master\'s degrees from top colleges.' },
      { id: 'voc', title: 'ITI & Trade Certification', desc: 'Industrial Training Institutes for trades.' },
      { id: 'online', title: 'Online Courses', desc: 'Niche upskilling via MOOCs.' },
    ],
    courses: {
      cc: [
        { id: 'in-polytech', name: 'Diploma in Civil Engineering (Polytechnic)', type: 'Trade Pathway', duration: 3, cost: 1500, requiredStatus: 1, grantsStatus: 3, description: 'Entry-level engineering diploma after 10th grade.' },
        { id: 'in-bachelor', name: 'B.Sc. (Pass Course)', type: 'Academic', duration: 3, cost: 4000, requiredStatus: 2, grantsStatus: 5, description: 'General science degree.' },
      ],
      uni: [
        { id: 'uni-btech-cs', name: 'B.Tech. in Computer Science (IIT)', type: 'Technical/Elite', duration: 4, cost: 20000, requiredStatus: 2, grantsStatus: 5, requiredExam: 'JEE Advanced', preReqs: { requiredSkill: 'smarts', value: 85 }, description: 'Top-tier technical degree.' },
        { id: 'uni-ba-econ', name: 'B.A. in Economics (Top University)', type: 'Academic', duration: 3, cost: 8000, requiredStatus: 2, grantsStatus: 5, requiredExam: 'CUCET', description: 'Highly competitive enrollment for Humanities/Social Sciences.' },
        { id: 'uni-mbbs', name: 'Medicine (MBBS)', type: 'Undergrad Professional', duration: 5.5, cost: 40000, requiredStatus: 2, requiredExam: 'NEET', grantsStatus: 5, preReqs: { requiredSkill: 'health', value: 75 }, description: '5.5 year undergraduate medical course.' },
      ],
      grad: [
        { id: 'grad-mtech', name: 'M.Tech. in Data Science', type: 'Research Master', duration: 2, cost: 12000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'GATE', description: 'Advanced research degree in technology.' },
      ],
      bus: [
        { id: 'bus-mba-iim', name: 'MBA (IIM/Top Institute)', type: 'Elite Professional', duration: 2, cost: 35000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'CAT', requiredWorkYears: 1, description: 'Highly selective management program.' },
      ],
      voc: [
        { id: 'voc-iti', name: 'Industrial Training Institute (ITI) Certification', type: 'Trade', duration: 1, cost: 500, requiredStatus: 2, grantsStatus: 3, description: 'Basic certification for factory and industrial jobs.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: '12th Grade Certificate',
        universityDuration: 3, 
        hasEntranceExam: 'JEE/NEET/CUCET',
        tradeSchoolName: 'Polytechnic/ITI',
        currencySymbol: '₹',
    }
  },
  
  // -----------------------------------------------------------
  // 🇩🇪 GERMANY (DE)
  // -----------------------------------------------------------
  'DE': {
    categories: [
      { id: 'cc', title: 'Berufsschule (Vocational)', desc: 'Dual VET programs mixing school and apprenticeship (Ausbildung).' },
      { id: 'uni', title: 'Hochschule/Universität', desc: 'Three-year Bachelor\'s degrees (Bachelor).' },
      { id: 'grad', title: 'Graduate Studies (Master/PhD)', desc: 'Masters and Doctoral programs.' },
      { id: 'bus', title: 'Business School', desc: 'Specialized management programs (similar to MBA).' },
      { id: 'voc', title: 'Meister (Master Craftsman)', desc: 'Advanced trade qualifications for self-employment.' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning.' },
    ],
    courses: {
      cc: [
        { id: 'de-ausbildung', name: 'IT Systems Specialist (Ausbildung)', type: 'Vocational Dual', duration: 3, cost: -500, requiredStatus: 2, grantsStatus: 3, description: 'Three-year paid apprenticeship. Net income of €500/year.' },
      ],
      uni: [
        { id: 'uni-bachelord', name: 'Bachelor of Science (BSc)', type: 'Academic', duration: 3, cost: 500, requiredStatus: 2, grantsStatus: 5, requiredExam: 'Abitur Grade', preReqs: { requiredSkill: 'smarts', value: 65 }, description: 'Standard three-year degree (often very low or no tuition).' },
        { id: 'uni-med', name: 'Medicine (Staatsexamen)', type: 'Professional', duration: 6, cost: 500, requiredStatus: 2, grantsStatus: 6, requiredExam: 'Numerus Clausus', preReqs: { requiredSkill: 'smarts', value: 90 }, description: 'State exam degree in medicine.' },
      ],
      grad: [
        { id: 'grad-master-eng', name: 'Master of Engineering (M.Eng)', type: 'Specialized Master', duration: 2, cost: 500, requiredStatus: 5, grantsStatus: 6, description: 'Required for advanced engineering roles.' },
      ],
      bus: [
        { id: 'bus-mba-de', name: 'MBA (Germany)', type: 'Professional', duration: 1.5, cost: 30000, requiredStatus: 5, grantsStatus: 6, requiredWorkYears: 2, description: 'High-cost international management degree.' },
      ],
      voc: [
        { id: 'voc-meister', name: 'Master Craftsman (Meister)', type: 'Advanced Trade', duration: 1.5, cost: 8000, requiredStatus: 3, grantsStatus: 5, description: 'Allows self-employment and training apprentices. Grants higher status.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'Abitur/Fachhochschulreife',
        universityDuration: 3,
        hasEntranceExam: 'Numerus Clausus',
        tradeSchoolName: 'Berufsschule',
        currencySymbol: '€',
    }
  },

  // -----------------------------------------------------------
  // 🇫🇷 FRANCE (FR)
  // -----------------------------------------------------------
  'FR': {
    categories: [
      { id: 'cc', title: 'BTS/BUT (Short Cycles)', desc: 'Short, professional training diplomas (2-3 years).' },
      { id: 'uni', title: 'Université (Licence)', desc: 'Three-year Bachelor\'s equivalent degrees (Licence).' },
      { id: 'grad', title: 'Grande École/Master', desc: 'Competitive Masters and Doctorates.' },
      { id: 'bus', title: 'Business School', desc: 'Highly selective Grande École management programs.' },
      { id: 'voc', title: 'Apprentissage', desc: 'Work-study programs (Alternance).' },
      { id: 'online', title: 'Online Courses', desc: 'Flexible learning.' },
    ],
    courses: {
      cc: [
        { id: 'fr-but', name: 'BUT (Tertiary Education Diploma)', type: 'Vocational', duration: 3, cost: 500, requiredStatus: 2, grantsStatus: 3, description: 'Three-year technical diploma with a strong industry focus.' },
      ],
      uni: [
        { id: 'uni-licence', name: 'Licence (Arts et Sciences)', type: 'Academic', duration: 3, cost: 500, requiredStatus: 2, grantsStatus: 5, requiredExam: 'Baccalauréat Results', description: 'Standard three-year public university degree.' },
        { id: 'uni-prepa', name: 'Classes Préparatoires (Prepa)', type: 'Elite Prep', duration: 2, cost: 1000, requiredStatus: 2, grantsStatus: 4, preReqs: { requiredSkill: 'smarts', value: 80 }, description: 'Intensive prep class for Grande École entry exams.' },
      ],
      grad: [
        { id: 'grad-master', name: 'Master Recherche (Physics)', type: 'Research Master', duration: 2, cost: 500, requiredStatus: 5, grantsStatus: 6, description: 'Leads to Ph.D. positions.' },
      ],
      bus: [
        { id: 'bus-grande-ecole', name: 'Grande École Master in Management', type: 'Elite Professional', duration: 2, cost: 40000, requiredStatus: 5, grantsStatus: 6, requiredExam: 'Concours Exam', description: 'Very high prestige business degree.' },
      ],
      voc: [
        { id: 'voc-alternance', name: 'Apprenticeship (Alternance) Certificate', type: 'Work-Study', duration: 2, cost: -100, requiredStatus: 2, grantsStatus: 3, description: 'Work-study contract with the company paying Sim to learn.' },
      ],
      online: [
        { id: 'on-datasci', name: 'Intro to Data Science', type: 'Skill Boost', duration: 0.5, cost: 200, requiredStatus: 2, grantsStatus: 0, description: 'Basics of Python and data analysis.' },
      ],
    },
    config: {
        highSchoolName: 'Baccalauréat',
        universityDuration: 3,
        hasEntranceExam: 'Parcoursup/Concours',
        tradeSchoolName: 'BTS/BUT',
        currencySymbol: '€',
    }
  },
};

// Fallback logic and default exports
export const EDUCATION_CATALOG = COUNTRY_EDUCATION_MAP.US.courses;
export const CATEGORY_META = COUNTRY_EDUCATION_MAP.US.categories;

export function getEducationCatalog(countryCode: string): CountryEducationCatalog {
  return COUNTRY_EDUCATION_MAP[countryCode] || COUNTRY_EDUCATION_MAP.US;
}
