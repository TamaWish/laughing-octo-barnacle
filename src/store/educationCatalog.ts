import { Course, CourseCategory } from './types/education';

export const EDUCATION_CATALOG: Record<CourseCategory, Course[]> = {
  cc: [
    { id: 'cc-aa', name: 'General Studies A.A.', type: 'Academic Transfer', duration: 2, cost: 4000, requiredStatus: 2, grantsStatus: 4, description: 'Standard transfer degree for humanities.' },
    { id: 'cc-as-eng', name: 'Assoc. of Science in Eng. Tech', type: 'Academic/Trade', duration: 2, cost: 4500, requiredStatus: 2, grantsStatus: 4, preReqs: { requiredSkill: 'smarts', value: 50 }, description: 'Focus on math, physics, and CAD.' },
    { id: 'cc-cna', name: 'Certified Nursing Assistant (CNA)', type: 'Trade Certificate', duration: 1, cost: 1500, requiredStatus: 2, grantsStatus: 3, preReqs: { requiredSkill: 'health', value: 50 }, description: 'Basic patient care and medical procedures.' },
    // Plumber apprenticeship blocks further academic enrollment until completed or dropped
    { id: 'cc-plumb', name: 'Plumber Apprenticeship', type: 'Trade Certificate', duration: 1.5, cost: 2000, requiredStatus: 2, grantsStatus: 3, preReqs: { requiredSkill: 'health', value: 40 }, logicalConstraint: { blocksAcademic: true }, description: 'Hands-on training for plumbing systems.' },
    { id: 'cc-digimark', name: 'Digital Marketing Certificate', type: 'Trade Certificate', duration: 0.5, cost: 800, requiredStatus: 2, grantsStatus: 3, description: 'Social media, SEO, and online advertising.' },
  ],
  uni: [
    { id: 'uni-ba-law', name: 'B.A. in Liberal Arts/Pre-Law', type: 'Academic', duration: 4, cost: 12000, requiredStatus: 4, grantsStatus: 5, description: 'Critical thinking and rhetoric.' },
    { id: 'uni-rn', name: 'B.S. in Registered Nursing (RN)', type: 'Pre-Professional', duration: 4, cost: 14000, requiredStatus: 4, grantsStatus: 5, preReqs: { requiredSkill: 'health', value: 60 }, description: 'Comprehensive medical training for nursing.' },
    // Pre-Med is restrictive: some trade certificates block immediate pre-med unless AA completed later
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
};

export const CATEGORY_META: { id: CourseCategory; title: string; desc: string }[] = [
  { id: 'cc', title: 'Community College', desc: 'Affordable two-year programs and certificates.' },
  { id: 'uni', title: 'University', desc: 'Four-year degrees with a broad curriculum.' },
  { id: 'grad', title: 'Graduate School', desc: 'Advanced degrees (Masters / PhD).' },
  { id: 'bus', title: 'Business School', desc: 'MBA and professional business degrees.' },
  { id: 'voc', title: 'Vocational School', desc: 'Trade skills and hands-on training.' },
  { id: 'online', title: 'Online Courses', desc: 'Flexible learning from home.' },
];
