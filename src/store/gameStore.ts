import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Profile } from '../types/profile';
import { Asset } from '../types/assets';
import { LIFE_EVENTS } from '../constants/events';
import { Course, Enrollment } from './types/education';
import { COUNTRY_EDUCATION_MAP } from './educationCatalog';
import { TabKey } from '../navigation';
import { CareerState, Job, PartTimeJob } from '../types/career';
import { JOBS, getJobsByPath, getJobById } from '../constants/careers';
import Toast from 'react-native-toast-message';

type GameState = {
  age: number;
  money: number;
  // education system
  educationStatus: number; // 0-6 as defined in education_catalogs.md
  isCurrentlyEnrolled: boolean;
  currentEnrollment?: Enrollment | null;
  completedDegrees: string[];
  completedCertificates: string[]; // store completed course IDs for robust bookkeeping
  completedUniversityCourses: string[]; // store completed university course IDs to prevent re-enrollment in same course
  enrollmentHistory: Array<{ enrollment: Enrollment; completionDate: string }>; // Track completed enrollments with completion date
  studentLoanDebt: number; // Total student loan debt
  studentLoanHistory: Array<{ amount: number; course: string; date: string }>; // Track loan history
  // career system
  career: CareerState;
  // core dynamic stats (0-100)
  health: number;
  happiness: number;
  smarts: number;
  looks: number;
  fame: number;
  gameDate: string;
  eventLog: string[];
  profile?: Profile;
  completedSuggestions: string[];
  // UI state persisted: which activity categories are expanded
  expandedActivities: Record<string, boolean>;
  setExpandedActivity: (id: string, value: boolean) => void;
  setProfile: (p: Profile) => void;
  // Education actions
  enrollCourse: (course: Course) => void;
  dropEnrollment: (penalty?: number) => void;
  handleCourseCompletion: (completedCourse: Enrollment) => void;
  repayStudentLoan: (amount?: number) => void;
  // Career actions
  applyForJob: (job: Job) => void;
  work: () => void;
  quitJob: () => void;
  applyForPartTimeJob: (job: any) => void;
  workPartTime: (hours: number) => void;
  quitPartTimeJob: () => void;
  // current in-game tab for UI highlighting (Home, Career, Assets, Skills, Relationships, Activities, More)
  currentGameTab: TabKey;
  setCurrentGameTab: (t: TabKey) => void;
  // measured bottom nav height (runtime) so other screens can compute spacing precisely
  navHeight: number;
  setNavHeight: (h: number) => void;
  autosaveCallback?: (() => void) | null;
  setAutosaveCallback: (fn: (() => void) | null) => void;
  advanceYear: () => void;
  visitDoctor: (cost?: number) => void;
  investStocks: () => void;
  planDate: () => void;
  goToGym: () => void;
  applyForPromotion: () => void;
  ignoreSuggestion: (title: string) => void;
  markSuggestionCompleted: (id: string) => void;
  clearCompletedSuggestions: () => void;
  addEvent: (msg: string) => void;
  reset: () => void;
  // Relationship actions
  spendTimewithFamilyMember: (memberId: string) => void;
  giveGiftToFamilyMember: (memberId: string, cost: number) => void;
  complimentFamilyMember: (memberId: string) => void;
  conversationWithFamilyMember: (memberId: string) => void;
  startArgument: (memberId: string) => { memberName: string; topic: string; escalated: boolean; relationshipChange: number; conflictChange: number } | null;
  apologize: (memberId: string) => void;
  makeUp: (memberId: string) => void;
  checkAndHandleBreakup: (memberId: string) => boolean;
  // Asset actions
  assets: Asset[];
  buyAsset: (asset: Asset) => void;
  sellAsset: (asset: Asset) => void;
};

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // current active in-game tab (default Home)
      currentGameTab: 'Home' as TabKey,
      setCurrentGameTab: (t: TabKey) => set({ currentGameTab: t }),
  // runtime measured nav height
  navHeight: 86,
  setNavHeight: (h: number) => set({ navHeight: h }),
      age: 0,
  // education defaults
  educationStatus: 0,
  isCurrentlyEnrolled: false,
  currentEnrollment: null,
  completedDegrees: [],
  completedCertificates: [],
  completedUniversityCourses: [],
  enrollmentHistory: [],
  studentLoanDebt: 0,
  studentLoanHistory: [],
  // career defaults
  career: {
    currentJob: null,
    careerHistory: [],
    workExperience: 0,
    partTimeJob: null,
    partTimeHoursWorked: 0,
  },
      money: 1000,
      // default starting stats
      health: 85,
      happiness: 62,
      smarts: 98,
      looks: 100,
      fame: 0,
      eventLog: [],
  completedSuggestions: [],
      profile: undefined,
          gameDate: new Date().toISOString(),
  setProfile: (p: Profile) => {
    set({ profile: p });
    const cb = (get() as any).autosaveCallback;
    if (cb) cb();
  },
  // persisted UI state defaults (expanded/collapsed for activity categories)
  expandedActivities: { education: true, health: true, looks: true },
  setExpandedActivity: (id: string, value: boolean) => set((s) => ({ expandedActivities: { ...(s.expandedActivities || {}), [id]: value } })),
  advanceYear: () => {
            const newAge = get().age + 1;
            const delta = Math.floor(Math.random() * 1000) - 200;
            // advance the in-game date by one year so logs reflect game time
            // small chance to lose some health as you age
            const healthLoss = -1 * (Math.floor(Math.random() * 3) + 1); // -1 to -3
            const happyDelta = Math.floor(Math.random() * 3) - 1; // -1..+1
            const prev = get();

            let incomeFromAssets = 0;
            let maintenanceCosts = 0;
            prev.assets.forEach(asset => {
              if (asset.type === 'Business') {
                incomeFromAssets += (asset as any).incomePerYear || 0;
              } else if (asset.type === 'House') {
                maintenanceCosts += (asset as any).maintenanceCost || 0;
              }
            });

            set((s) => {
              const cur = new Date(s.gameDate || new Date().toISOString());
              const next = new Date(cur);
              next.setFullYear(next.getFullYear() + 1);
              // clamp helper
              const clamp = (v: number) => Math.max(0, Math.min(100, v));
              return {
                age: s.age + 1,
                money: s.money + delta + incomeFromAssets - maintenanceCosts,
                gameDate: next.toISOString(),
                health: clamp((s.health ?? 70) + healthLoss),
                happiness: clamp((s.happiness ?? 50) + happyDelta),
                career: {
                  ...s.career,
                  partTimeHoursWorked: 0, // Reset part-time hours at the start of new year
                },
              };
            });
            
            const next = get();
            const deltas = [] as string[];
            const hD = (next.health ?? 0) - (prev.health ?? 0);
            const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
            if (hD !== 0) deltas.push(`Health ${hD > 0 ? `+${hD}` : `${hD}`}`);
            if (hapD !== 0) deltas.push(`Happiness ${hapD > 0 ? `+${hapD}` : `${hapD}`}`);
            get().addEvent(`Advanced to age ${newAge}. Money change: ${delta}. ${deltas.join(', ')}`);
            if (deltas.length > 0) {
              Toast.show({ type: 'info', text1: 'Stats', text2: deltas.join(' • '), position: 'bottom' });
            }
            // process education progression (one year passes)
            const after = get();
            try {
              if (after.isCurrentlyEnrolled && after.currentEnrollment) {
                const prevTime = after.currentEnrollment.timeRemaining ?? after.currentEnrollment.duration ?? 1;
                const newTime = prevTime - 1;
                set((s) => ({ currentEnrollment: s.currentEnrollment ? { ...s.currentEnrollment, timeRemaining: newTime } : s.currentEnrollment }));
                get().addEvent(`${after.currentEnrollment.name} progressed by 1 year. ${Math.max(0, newTime)} years remaining.`);
                // add stat boosts if enrolled in primary or secondary
                if (after.currentEnrollment.id?.includes('primary') || after.currentEnrollment.id?.includes('secondary')) {
                  const clamp = (v: number) => Math.max(0, Math.min(100, v));
                  set((s) => ({
                    smarts: clamp((s.smarts ?? 50) + 2),
                    happiness: clamp((s.happiness ?? 50) + 1),
                  }));
                  get().addEvent(`Gained +2 Smarts and +1 Happiness from schooling.`);
                }

                // Calculate GPA for this year based on performance
                const currentSmarts = after.smarts ?? 50;
                const basePerformance = currentSmarts / 100; // 0-1 scale
                const randomFactor = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2 randomness
                const yearlyPerformance = Math.max(0, Math.min(1, basePerformance + randomFactor));
                const yearlyGPA = 2.0 + (yearlyPerformance * 2.0); // 2.0-4.0 scale

                // Update GPA as weighted average of previous GPA and this year's performance
                const currentGPA = after.currentEnrollment.currentGPA ?? 2.5;
                const yearsCompleted = after.currentEnrollment.duration - newTime;
                const totalYears = after.currentEnrollment.duration;
                const newGPA = ((currentGPA * yearsCompleted) + yearlyGPA) / (yearsCompleted + 1);

                set((s) => ({
                  currentEnrollment: s.currentEnrollment ? {
                    ...s.currentEnrollment,
                    currentGPA: Math.round(newGPA * 100) / 100 // Round to 2 decimal places
                  } : s.currentEnrollment
                }));

                get().addEvent(`Academic year completed. GPA: ${yearlyGPA.toFixed(2)} (Overall: ${(Math.round(newGPA * 100) / 100).toFixed(2)})`);
                if (newTime <= 0) {
                  // capture completed enrollment (use the copy from get())
                  const completed = get().currentEnrollment;
                  if (completed) {
                    // call completion handler
                    (get() as any).handleCourseCompletion(completed);
                  }
                }
              }
            } catch (err) {
              console.warn('Error processing education progression', err);
            }

            // Auto-enrollment logic (AFTER course completion to handle graduation transitions)
            // New Global Education System:
            // Age 3: Auto-enroll in Kindergarten
            // Age 5: Complete Kindergarten → Auto-enroll in Primary School  
            // Age 12: Complete Primary → Auto-enroll in Secondary School
            // Age 18: Complete Secondary → Ready for university/work
            
            // Auto-enroll in kindergarten at age 3 if not already enrolled
            if (newAge === 3 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.kindergarten) {
                const publicKindergarten = catalog.courses.kindergarten.find(c => c.cost === 0);
                if (publicKindergarten) {
                  get().enrollCourse(publicKindergarten);
                  get().addEvent(`Auto-enrolled in ${publicKindergarten.name} at age 3.`);
                }
              }
            }
            
            // Auto-enroll in primary school if educationStatus == 1 (completed kindergarten) and not enrolled
            if (get().educationStatus === 1 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.primary && catalog.courses.primary.length > 0) {
                const primaryCourse = catalog.courses.primary[0];
                if (primaryCourse) {
                  get().enrollCourse(primaryCourse);
                  get().addEvent(`Auto-enrolled in ${primaryCourse.name} at age ${newAge}.`);
                }
              }
            }
            
            // Auto-enroll in secondary school if educationStatus == 2 (completed primary) and not enrolled
            if (get().educationStatus === 2 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.secondary && catalog.courses.secondary.length > 0) {
                const secondaryCourse = catalog.courses.secondary[0];
                if (secondaryCourse) {
                  get().enrollCourse(secondaryCourse);
                  get().addEvent(`Auto-enrolled in ${secondaryCourse.name} at age ${newAge}.`);
                }
              }
            }

            // call autosave callback when available
            const cb = (get() as any).autosaveCallback;
            if (cb) cb();

            // Apply relationship decay over time
            const currentState = get();
            if (currentState.profile) {
              const { applyRelationshipDecay } = require('../utils/relationshipDecay');
              const { updatedProfile, decayEvents } = applyRelationshipDecay(
                currentState.profile,
                currentState.gameDate
              );
              
              if (updatedProfile && decayEvents.length > 0) {
                set({ profile: updatedProfile });
                // Log significant relationship decays (only show first 3 to avoid spam)
                const significantDecays = decayEvents.slice(0, 3);
                significantDecays.forEach((event: string) => get().addEvent(`Relationship decay: ${event}`));
                
                if (decayEvents.length > 3) {
                  get().addEvent(`...and ${decayEvents.length - 3} more relationships declined.`);
                }
                
                // Check if partner relationship hit 0 due to decay
                if (updatedProfile.partner) {
                  get().checkAndHandleBreakup(updatedProfile.partner.id);
                }
              }
            }

            // Handle random life events
            if (Math.random() < 0.2) { // 20% chance of a random event
              const event = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];
              get().addEvent(event.description);
              set((s) => {
                const clamp = (v: number) => Math.max(0, Math.min(100, v));
                return {
                  health: clamp((s.health ?? 70) + (event.effects.health || 0)),
                  happiness: clamp((s.happiness ?? 50) + (event.effects.happiness || 0)),
                  smarts: clamp((s.smarts ?? 50) + (event.effects.smarts || 0)),
                  looks: clamp((s.looks ?? 50) + (event.effects.looks || 0)),
                  fame: clamp((s.fame ?? 0) + (event.effects.fame || 0)),
                  money: s.money + (event.effects.money || 0),
                };
              });
              Toast.show({ type: 'info', text1: 'A life event occurred!', text2: event.description });
            }
      },

  // enroll a Sim in a course after performing checks
  enrollCourse: (course: Course & { major?: string; paymentMethod?: 'loan' | 'parents' | 'cash' }) => {
    const state = get();
    const isUniversityCourse = course.id?.includes('-university-') || course.id?.includes('-uni-');
    
    // For university courses with majors, check if this specific course+major combination is completed
    // This allows re-enrollment in the same university with different major
    const courseKey = course.major ? `${course.id}-${course.major}` : course.id;
    if (isUniversityCourse && state.completedUniversityCourses?.includes(courseKey)) {
      Toast.show({ type: 'error', text1: 'Already Completed', text2: 'You have already completed this course with this major.' });
      state.addEvent(`Enrollment failed: already completed ${course.name} (${course.major || 'General'}).`);
      return;
    }
    
    // Constraint 1: mutually exclusive (relaxed for ALL university courses)
    if (state.isCurrentlyEnrolled) {
      if (isUniversityCourse) {
        // For university courses: drop current enrollment and enroll in new one
        // (Allow switching between any university courses in the same or different institutions)
        set(() => ({ isCurrentlyEnrolled: false, currentEnrollment: null }));
        state.addEvent(`Dropped current enrollment to switch to ${course.name}.`);
        Toast.show({ type: 'info', text1: 'Switched Courses', text2: `Enrolled in ${course.name}.` });
      } else {
        // Non-university courses still follow strict mutual exclusion
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'You are already enrolled in a program.' });
        state.addEvent('Enrollment failed: already enrolled in another program.');
        return;
      }
    }
    // Constraint 2: age (strict numeric check)
    if (typeof course.requiredAge === 'number' && state.age < course.requiredAge) {
      Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `Must be at least ${course.requiredAge} to enroll.` });
      state.addEvent(`Enrollment failed: too young for ${course.name}.`);
      return;
    }
    // Constraint 3: education status
    if (typeof course.requiredStatus === 'number') {
      const hasStatus = state.educationStatus >= course.requiredStatus;
      if (!hasStatus) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'Educational prerequisites not met.' });
        state.addEvent(`Enrollment failed: prerequisites not met for ${course.name}.`);
        return;
      }
    }

    // Handle payment based on method for university courses
    const totalCost = (course.cost || 0) * (course.duration || 1);
    const paymentMethod = course.paymentMethod || 'cash';
    let paidAmount = 0;
    let loanAmount = 0;

    if (paymentMethod === 'cash') {
      // Constraint 4: money (for cash payment)
      if (state.money < totalCost) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'Insufficient funds for tuition.' });
        state.addEvent(`Enrollment failed: insufficient funds for ${course.name}.`);
        return;
      }
      paidAmount = totalCost;
    } else if (paymentMethod === 'loan') {
      // Student loan - no upfront payment required
      loanAmount = totalCost;
      paidAmount = 0;
    } else if (paymentMethod === 'parents') {
      // Parents pay - simulate parent decision
      // For now, assume parents always pay if relationship is good (can be enhanced later)
      // TODO: Add parent relationship check
      const parentsWillPay = Math.random() > 0.2; // 80% chance parents agree
      if (!parentsWillPay) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'Your parents declined to pay for your education.' });
        state.addEvent(`Enrollment failed: parents declined to pay for ${course.name}.`);
        return;
      }
      paidAmount = 0; // Parents pay, no cost to player
    }

    // Constraint 5: skill prereqs (very basic: checks against top-level stats)
    if (course.preReqs && course.preReqs.requiredSkill) {
      const skill = course.preReqs.requiredSkill;
      const required = course.preReqs.value || 0;
      const have = (get() as any)[skill];
      if (typeof have === 'number' && have < required) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `Your ${skill} is too low.` });
        state.addEvent(`Enrollment failed: ${skill} too low for ${course.name}.`);
        return;
      }
    }

    // All constraints passed - enroll student

    // Deduct money if cash payment
    const newMoney = paymentMethod === 'cash' ? state.money - paidAmount : state.money;

    // Add to student loan debt if loan payment
    const newLoanDebt = paymentMethod === 'loan' ? state.studentLoanDebt + loanAmount : state.studentLoanDebt;
    const newLoanHistory = paymentMethod === 'loan' 
      ? [...state.studentLoanHistory, { amount: loanAmount, course: course.name, date: state.gameDate }]
      : state.studentLoanHistory;

    // Create enrollment
    const enrollment: Enrollment = {
      id: course.id || String(Date.now()),
      name: course.name,
      duration: course.duration || 1,
      timeRemaining: course.duration || 1,
      cost: course.cost || 0,
      grantsStatus: course.grantsStatus,
      preReqs: course.preReqs,
      major: course.major,
      paymentMethod: paymentMethod,
      currentGPA: Math.max(2.0, Math.min(4.0, (state.smarts / 25))), // GPA based on smarts (0-100 -> 2.0-4.0)
    };

    set({
      money: newMoney,
      isCurrentlyEnrolled: true,
      currentEnrollment: enrollment,
      studentLoanDebt: newLoanDebt,
      studentLoanHistory: newLoanHistory,
    });

    // Log enrollment
    if (paymentMethod === 'cash') {
      get().addEvent(`Enrolled in ${course.name}. Paid ${totalCost.toLocaleString()} cash.`);
      Toast.show({ type: 'success', text1: 'Enrolled', text2: `Paid $${totalCost.toLocaleString()} for ${course.name}.` });
    } else if (paymentMethod === 'loan') {
      get().addEvent(`Enrolled in ${course.name}. Took student loan of ${loanAmount.toLocaleString()}.`);
      Toast.show({ type: 'success', text1: 'Enrolled', text2: `Student loan of $${loanAmount.toLocaleString()} approved.` });
    } else if (paymentMethod === 'parents') {
      get().addEvent(`Enrolled in ${course.name}. Parents paid tuition.`);
      Toast.show({ type: 'success', text1: 'Enrolled', text2: `Parents agreed to pay for ${course.name}!` });
    }

    const cb2 = (get() as any).autosaveCallback;
    if (cb2) cb2();
  },

  dropEnrollment: (penalty = 0) => {
    const s = get();
    if (!s.isCurrentlyEnrolled || !s.currentEnrollment) return;
    // apply optional penalty (financial)
    if (penalty > 0) set((st) => ({ money: st.money - penalty }));
    const name = s.currentEnrollment.name;
    set(() => ({ isCurrentlyEnrolled: false, currentEnrollment: null }));
    get().addEvent(`Dropped out of ${name}. Penalty: ${penalty ? `$${penalty}` : 'none'}.`);
    Toast.show({ type: 'info', text1: 'Enrollment', text2: `Dropped ${name}.` });
    const cb3 = (get() as any).autosaveCallback;
    if (cb3) cb3();
  },

  handleCourseCompletion: (completedCourse: any) => {
    if (!completedCourse) return;
    
    // Handle student loan repayment if course was paid with loan
    if (completedCourse.paymentMethod === 'loan') {
      const totalCourseCost = (completedCourse.cost || 0) * (completedCourse.duration || 1);
      const state = get();
      
      // Player chooses to pay half or full
      // For now, default to half payment (can be enhanced with UI choice later)
      const repaymentAmount = Math.floor(totalCourseCost / 2);
      
      if (state.money >= repaymentAmount) {
        // Can afford to pay half
        set((s) => ({
          money: s.money - repaymentAmount,
          studentLoanDebt: Math.max(0, s.studentLoanDebt - repaymentAmount),
        }));
        get().addEvent(`Repaid $${repaymentAmount.toLocaleString()} student loan for ${completedCourse.name}.`);
        Toast.show({ 
          type: 'info', 
          text1: 'Loan Repayment', 
          text2: `Paid $${repaymentAmount.toLocaleString()} (half). Remaining debt: $${(state.studentLoanDebt - repaymentAmount).toLocaleString()}`,
          position: 'bottom'
        });
      } else {
        // Cannot afford repayment - debt continues to accumulate
        get().addEvent(`Unable to repay student loan for ${completedCourse.name}. Debt remains: $${state.studentLoanDebt.toLocaleString()}`);
        Toast.show({ 
          type: 'error', 
          text1: 'Loan Repayment', 
          text2: `Insufficient funds. Student debt: $${state.studentLoanDebt.toLocaleString()}`,
          position: 'bottom'
        });
      }
    }
    
    // Add degree/name to completedDegrees and update status
    const isUniversityCourse = completedCourse.id?.includes('-university-') || completedCourse.id?.includes('-uni-');
    // For university courses with majors, store courseId-major combination to allow re-enrollment with different major
    const courseKey = completedCourse.major ? `${completedCourse.id}-${completedCourse.major}` : completedCourse.id;
    set((s) => ({
      completedDegrees: Array.from(new Set([...(s.completedDegrees || []), completedCourse.name])),
      completedCertificates: Array.from(new Set([...(s.completedCertificates || []), completedCourse.id])),
      completedUniversityCourses: isUniversityCourse 
        ? Array.from(new Set([...(s.completedUniversityCourses || []), courseKey]))
        : s.completedUniversityCourses,
      enrollmentHistory: [...(s.enrollmentHistory || []), { 
        enrollment: completedCourse, 
        completionDate: get().gameDate || new Date().toISOString() 
      }]
    }));
    
    // Special handling for kindergarten completion: boost stats and update status
    const isKindergarten = completedCourse.id?.includes('-kindergarten-');
    if (isKindergarten) {
      const isPrivate = completedCourse.cost > 0;
      const smartsBoost = isPrivate ? 20 : 10;
      const happinessBoost = isPrivate ? 25 : 15;
      const clamp = (v: number) => Math.max(0, Math.min(100, v));
      set((s) => ({
        smarts: clamp((s.smarts ?? 50) + smartsBoost),
        happiness: clamp((s.happiness ?? 50) + happinessBoost),
      }));
      get().addEvent(`Completed ${completedCourse.name}. Smarts +${smartsBoost}, Happiness +${happinessBoost}.`);
      Toast.show({ type: 'success', text1: 'Graduation', text2: `Completed ${completedCourse.name}! Smarts +${smartsBoost}, Happiness +${happinessBoost}.`, position: 'bottom' });
    }
    
    // Apply skill boosts from university major
    if (completedCourse.major) {
      // TODO: Implement major-specific skill boosts
      const clamp = (v: number) => Math.max(0, Math.min(100, v));
      const smartsBoost = 25; // Base university boost
      set((s) => ({
        smarts: clamp((s.smarts ?? 50) + smartsBoost),
      }));
      get().addEvent(`Graduated with degree in ${completedCourse.major}. Smarts +${smartsBoost}.`);
    }
    
    // Update education status based on grantsStatus
    // Status system: 0=None, 1=Kindergarten, 2=Primary, 3=Secondary, 4=University
    if (typeof completedCourse.grantsStatus === 'number') {
      set(() => ({ educationStatus: Math.max(get().educationStatus, completedCourse.grantsStatus) }));
      get().addEvent(`Education status updated to ${completedCourse.grantsStatus} after completing ${completedCourse.name}.`);
      Toast.show({ type: 'success', text1: 'Graduation', text2: `Completed ${completedCourse.name}!`, position: 'bottom' });
    }
    
    // clear enrollment
    set(() => ({ isCurrentlyEnrolled: false, currentEnrollment: null }));
    const cb4 = (get() as any).autosaveCallback;
    if (cb4) cb4();
  },

  repayStudentLoan: (amount?: number) => {
    const state = get();
    
    if (state.studentLoanDebt <= 0) {
      Toast.show({ type: 'info', text1: 'No Debt', text2: 'You have no student loan debt!' });
      return;
    }

    // If no amount specified, pay full debt or all available money
    const repayAmount = amount || Math.min(state.money, state.studentLoanDebt);

    if (state.money < repayAmount) {
      Toast.show({ type: 'error', text1: 'Insufficient Funds', text2: 'Not enough money to make this payment.' });
      return;
    }

    const newDebt = Math.max(0, state.studentLoanDebt - repayAmount);
    set((s) => ({
      money: s.money - repayAmount,
      studentLoanDebt: newDebt,
    }));

    get().addEvent(`Repaid $${repayAmount.toLocaleString()} student loan. Remaining: $${newDebt.toLocaleString()}.`);
    
    if (newDebt === 0) {
      Toast.show({ type: 'success', text1: 'Debt Free!', text2: 'You have paid off all student loans!' });
    } else {
      Toast.show({ type: 'success', text1: 'Payment Made', text2: `Paid $${repayAmount.toLocaleString()}. Remaining: $${newDebt.toLocaleString()}` });
    }

    const cb = (get() as any).autosaveCallback;
    if (cb) cb();
  },

  visitDoctor: (cost = 50) => {
        // pay the cost and improve health and happiness slightly
        const prev = get();
        set((s) => {
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          const newHealth = clamp((s.health ?? 70) + 15);
          const newHappy = clamp((s.happiness ?? 50) + 6);
          return { money: s.money - cost, health: newHealth, happiness: newHappy };
        });
        const next = get();
        const hD = (next.health ?? 0) - (prev.health ?? 0);
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        get().addEvent(`Visited doctor. Paid $${cost}. Health +15, Happiness +6.`);
        const parts = [] as string[];
        if (hD !== 0) parts.push(`Health ${hD > 0 ? `+${hD}` : `${hD}`}`);
        if (hapD !== 0) parts.push(`Happiness ${hapD > 0 ? `+${hapD}` : `${hapD}`}`);
        if (parts.length > 0) Toast.show({ type: 'success', text1: 'Stats', text2: parts.join(' • '), position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
  takePartTimeJob: () => {
        const earn = Math.floor(Math.random() * (800 - 100 + 1)) + 100;
        const prev = get();
        set((s) => {
          // small boost to money, small drop in happiness due to time spent
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          const newHappy = clamp((s.happiness ?? 50) - 2);
          return { money: s.money + earn, happiness: newHappy };
        });
        const next = get();
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        get().addEvent(`Took a part-time job and earned ${earn}. Happiness -2.`);
        if (hapD !== 0) Toast.show({ type: 'success', text1: 'Stats', text2: `Happiness ${hapD > 0 ? `+${hapD}` : `${hapD}`}`, position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
  investStocks: () => {
        const delta = Math.floor(Math.random() * (1200 - -800 + 1)) + -800;
        // investing affects money and happiness depending on outcome
        const prev = get();
        set((s) => {
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          const newMoney = s.money + delta;
          const happyChange = delta >= 0 ? Math.min(12, Math.round(delta / 150)) : Math.max(-18, Math.round(delta / 60));
          const newHappy = clamp((s.happiness ?? 50) + happyChange);
          return { money: newMoney, happiness: newHappy };
        });
        const next = get();
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        const happyChange = delta >= 0 ? `+${Math.min(12, Math.round(delta / 150))}` : `${Math.max(-18, Math.round(delta / 60))}`;
        get().addEvent(`Invested in stocks. Change: ${delta}. Happiness ${happyChange}.`);
        if (hapD !== 0) Toast.show({ type: hapD > 0 ? 'success' : 'error', text1: 'Happiness', text2: `${hapD > 0 ? `+${hapD}` : `${hapD}`}`, position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
  planDate: () => {
        const prev = get();
        set((s) => {
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          return { happiness: clamp((s.happiness ?? 50) + 8) };
        });
        const next = get();
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        get().addEvent('Planned a date. Happiness +8.');
        if (hapD !== 0) Toast.show({ type: 'success', text1: 'Happiness', text2: `${hapD > 0 ? `+${hapD}` : `${hapD}`}`, position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
  goToGym: () => {
        const prev = get();
        set((s) => {
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          return { health: clamp((s.health ?? 70) + 6), happiness: clamp((s.happiness ?? 50) + 4) };
        });
        const next = get();
        const hD = (next.health ?? 0) - (prev.health ?? 0);
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        get().addEvent('Went to the gym. Health +6, Happiness +4.');
        const parts = [] as string[];
        if (hD !== 0) parts.push(`Health ${hD > 0 ? `+${hD}` : `${hD}`}`);
        if (hapD !== 0) parts.push(`Happiness ${hapD > 0 ? `+${hapD}` : `${hapD}`}`);
        if (parts.length > 0) Toast.show({ type: 'success', text1: 'Stats', text2: parts.join(' • '), position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
  applyForPromotion: () => {
        const bonus = get().age >= 25 ? 2000 : 500;
        const prev = get();
        set((s) => {
          const clamp = (v: number) => Math.max(0, Math.min(100, v));
          return { money: s.money + bonus, happiness: clamp((s.happiness ?? 50) + (bonus >= 2000 ? 10 : 4)) };
        });
        const next = get();
        const hapD = (next.happiness ?? 0) - (prev.happiness ?? 0);
        get().addEvent(`Applied for promotion. Received ${bonus}. Happiness boosted.`);
        if (hapD !== 0) Toast.show({ type: 'success', text1: 'Happiness', text2: `${hapD > 0 ? `+${hapD}` : `${hapD}`}`, position: 'bottom' });
        const cb = (get() as any).autosaveCallback;
        if (cb) cb();
      },
      // allow UI to register a callback for autosave
      autosaveCallback: null,
      setAutosaveCallback: (fn: (() => void) | null) => set({ autosaveCallback: fn }),
      ignoreSuggestion: (title: string) => {
        get().addEvent(`Ignored suggestion: ${title}`);
      },
      markSuggestionCompleted: (id: string) =>
        set((s) => ({ completedSuggestions: Array.from(new Set([...s.completedSuggestions, id])) })),
      clearCompletedSuggestions: () => set({ completedSuggestions: [] }),
      addEvent: (msg: string) =>
        set((s) => {
          // use the in-game date if available so logs track game time, otherwise fallback to now
          const d = s.gameDate ? new Date(s.gameDate) : new Date();
          return { eventLog: [...s.eventLog, `${d.toLocaleDateString()}: ${msg}`] };
        }),
  reset: () => set({ 
    age: 0, 
    money: 1000, 
    eventLog: [], 
    gameDate: new Date().toISOString(),
    studentLoanDebt: 0,
    studentLoanHistory: [],
    educationStatus: 0,
    isCurrentlyEnrolled: false,
    currentEnrollment: null,
    completedDegrees: [],
    completedCertificates: [],
  }),
  spendTimewithFamilyMember: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';

    const updatedProfile = { ...state.profile };
    
    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner.relationshipScore = clamp((updatedProfile.partner.relationshipScore ?? 50) + 5);
      updatedProfile.partner.lastInteractionDate = state.gameDate;
      memberName = updatedProfile.partner.firstName;
    } 
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(m => {
        if (m.id === memberId) {
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + 5);
          m.lastInteractionDate = state.gameDate;
          memberName = m.firstName;
        }
        return m;
      });
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(m => {
        if (m.id === memberId) {
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + 5);
          m.lastInteractionDate = state.gameDate;
          memberName = m.firstName;
        }
        return m;
      });
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        const updateMember = (m: any) => {
          if (m.id === memberId) {
            m.relationshipScore = clamp((m.relationshipScore ?? 50) + 5);
            m.lastInteractionDate = state.gameDate;
            memberName = m.firstName;
          }
          return m;
        };
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness + 2),
    });
    get().addEvent(`Spent time with ${memberName}. Relationship +5, Happiness +2.`);
  },

  giveGiftToFamilyMember: (memberId: string, cost: number) => {
    const state = get();
    if (!state.profile || state.money < cost) {
      if(state.money < cost) {
        get().addEvent('Not enough money to give a gift.');
        Toast.show({ type: 'error', text1: 'Action failed', text2: 'Not enough money for a gift.' });
      }
      return;
    }

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';

    const updatedProfile = { ...state.profile };
    
    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner.relationshipScore = clamp((updatedProfile.partner.relationshipScore ?? 50) + 10);
      updatedProfile.partner.lastInteractionDate = state.gameDate;
      memberName = updatedProfile.partner.firstName;
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(m => {
        if (m.id === memberId) {
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + 10);
          m.lastInteractionDate = state.gameDate;
          memberName = m.firstName;
        }
        return m;
      });
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(m => {
        if (m.id === memberId) {
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + 10);
          m.lastInteractionDate = state.gameDate;
          memberName = m.firstName;
        }
        return m;
      });
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        const updateMember = (m: any) => {
          if (m.id === memberId) {
            m.relationshipScore = clamp((m.relationshipScore ?? 50) + 10);
            m.lastInteractionDate = state.gameDate;
            memberName = m.firstName;
          }
          return m;
        };
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      money: state.money - cost,
    });
    get().addEvent(`Gave a gift to ${memberName}. Relationship +10, Money -${cost}.`);
  },

  startArgument: (memberId: string) => {
    const state = get();
    if (!state.profile) return null;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';
    let relationshipChange = 0;
    let conflictChange = 0;
    let topic = '';
    let escalated = false;

    const updatedProfile = { ...state.profile };

    // Helper function to update a member
    const updateMember = (m: any) => {
      if (m.id === memberId) {
        memberName = m.firstName;
        const currentScore = m.relationshipScore ?? 50;
        
        // Import the utility functions
        const { 
          getArgumentTopic, 
          shouldConflictEscalate, 
          getConflictEscalationMultiplier,
          addConflictMemory,
          assignRandomPersonality
        } = require('../utils/relationshipDecay');
        
        // Assign personality if not set
        if (!m.personality) {
          m.personality = assignRandomPersonality();
        }
        
        topic = getArgumentTopic(m.relation);
        
        // Personality affects escalation chance
        const escalationMultiplier = getConflictEscalationMultiplier(m.personality);
        let baseEscalation = shouldConflictEscalate(currentScore);
        // Apply personality multiplier to escalation
        escalated = Math.random() < (baseEscalation ? escalationMultiplier : 0.05 * escalationMultiplier);
        
        // Base relationship loss
        relationshipChange = escalated ? -15 : -8;
        
        // Increase conflict level
        const currentConflict = m.conflictLevel ?? 0;
        conflictChange = escalated ? 20 : 10;
        
        m.relationshipScore = clamp(currentScore + relationshipChange);
        m.conflictLevel = clamp(currentConflict + conflictChange);
        m.lastInteractionDate = state.gameDate;
        
        // Add to conflict memory
        m.conflictMemory = addConflictMemory(m, topic, escalated ? 'major' : 'minor', state.gameDate);
      }
      return m;
    };

    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner = updateMember(updatedProfile.partner);
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(updateMember);
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(updateMember);
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness - (escalated ? 5 : 3)),
    });
    
    const escalationText = escalated ? ' The argument escalated!' : '';
    get().addEvent(
      `Had an argument with ${memberName} about ${topic}.${escalationText} Relationship ${relationshipChange}, Conflict +${conflictChange}, Happiness ${escalated ? -5 : -3}.`
    );
    
    // Check if this caused a breakup
    get().checkAndHandleBreakup(memberId);

    return {
      memberName,
      topic,
      escalated,
      relationshipChange,
      conflictChange
    };
  },

  apologize: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';
    let hadConflict = false;
    let personalityBonus = '';

    const updatedProfile = { ...state.profile };

    // Helper function to update a member
    const updateMember = (m: any) => {
      if (m.id === memberId) {
        memberName = m.firstName;
        const currentConflict = m.conflictLevel ?? 0;
        hadConflict = currentConflict > 0;
        
        // Import personality utilities
        const { getApologyEffectiveness, resolveRecentConflicts, assignRandomPersonality } = require('../utils/relationshipDecay');
        
        // Assign personality if not set
        if (!m.personality) {
          m.personality = assignRandomPersonality();
        }
        
        // Get personality effectiveness multiplier
        const effectiveness = getApologyEffectiveness(m.personality);
        personalityBonus = effectiveness > 1 ? ` (${m.personality} personality +${Math.round((effectiveness - 1) * 100)}%)` : 
                          effectiveness < 1 ? ` (${m.personality} personality ${Math.round((effectiveness - 1) * 100)}%)` : '';
        
        if (hadConflict) {
          // Apology reduces conflict and improves relationship, affected by personality
          const baseConflictReduction = Math.min(currentConflict, 30);
          const conflictReduction = Math.max(1, Math.floor(baseConflictReduction * effectiveness));
          m.conflictLevel = clamp(currentConflict - conflictReduction);
          
          // Relationship improvement is based on how much conflict was resolved
          // Always give at least +1 relationship boost when resolving conflict
          const baseRelationshipBoost = Math.max(1, Math.floor(conflictReduction / 3));
          const relationshipBoost = Math.max(1, Math.floor(baseRelationshipBoost * effectiveness));
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + relationshipBoost);
          
          // Resolve conflicts in memory
          m.conflictMemory = resolveRecentConflicts(m);
        } else {
          // No conflict, but apology still helps a bit
          const boost = Math.floor(3 * effectiveness);
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + boost);
        }
        
        m.lastInteractionDate = state.gameDate;
      }
      return m;
    };

    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner = updateMember(updatedProfile.partner);
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(updateMember);
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(updateMember);
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness + 2),
    });
    
    if (hadConflict) {
      get().addEvent(`Apologized to ${memberName}${personalityBonus}. Conflict reduced, relationship improved. Happiness +2.`);
    } else {
      get().addEvent(`Apologized to ${memberName}${personalityBonus}. Relationship improved, Happiness +2.`);
    }
  },

  makeUp: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';
    let wasHighConflict = false;

    const updatedProfile = { ...state.profile };

    // Helper function to update a member
    const updateMember = (m: any) => {
      if (m.id === memberId) {
        memberName = m.firstName;
        const currentConflict = m.conflictLevel ?? 0;
        wasHighConflict = currentConflict >= 50; // High conflict threshold
        
        if (currentConflict > 0) {
          // Make-up event: significant relationship boost and conflict resolution
          // More effective than regular apology, especially for high conflict
          const bonusMultiplier = wasHighConflict ? 2.0 : 1.5;
          
          // Clear most/all conflict
          const conflictReduction = Math.floor(currentConflict * 0.8); // Remove 80% of conflict
          m.conflictLevel = clamp(currentConflict - conflictReduction);
          
          // Significant relationship boost
          const relationshipBoost = Math.floor(15 * bonusMultiplier); // Base 15 points, doubled for high conflict
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + relationshipBoost);
          
          // Mark all conflicts as resolved in memory
          if (m.conflictMemory) {
            m.conflictMemory = m.conflictMemory.map((c: any) => ({ ...c, resolved: true }));
          }
        } else {
          // No conflict, but still strengthens relationship
          m.relationshipScore = clamp((m.relationshipScore ?? 50) + 8);
        }
        
        m.lastInteractionDate = state.gameDate;
      }
      return m;
    };

    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner = updateMember(updatedProfile.partner);
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(updateMember);
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(updateMember);
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness + (wasHighConflict ? 5 : 3)),
    });
    
    if (wasHighConflict) {
      get().addEvent(`💕 Made up with ${memberName} after serious conflicts. Relationship greatly improved! Happiness +5.`);
    } else {
      get().addEvent(`💕 Had a heartfelt make-up moment with ${memberName}. Relationship strengthened! Happiness +3.`);
    }
  },

  checkAndHandleBreakup: (memberId: string) => {
    const state = get();
    if (!state.profile) return false;

    const updatedProfile = { ...state.profile };
    let didBreakup = false;
    let memberName = '';

    // Check if partner and relationship is at 0
    if (updatedProfile.partner?.id === memberId) {
      const score = updatedProfile.partner.relationshipScore ?? 50;
      
      if (score <= 0) {
        // Move to exes
        memberName = updatedProfile.partner.firstName;
        const ex = { ...updatedProfile.partner, relation: 'ex' as const, status: 'Broken up' };
        
        if (!updatedProfile.exes) {
          updatedProfile.exes = [];
        }
        updatedProfile.exes.push(ex);
        updatedProfile.partner = null;
        didBreakup = true;
        
        set({ profile: updatedProfile });
        get().addEvent(`💔 Your relationship with ${memberName} has ended. You are no longer partners.`);
        
        Toast.show({
          type: 'error',
          text1: '💔 Relationship Ended',
          text2: `You and ${memberName} have broken up`,
          visibilityTime: 5000,
        });
      }
    }

    return didBreakup;
  },

  complimentFamilyMember: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';

    const updatedProfile = { ...state.profile };

    // Helper function to update a member
    const updateMember = (m: any) => {
      if (m.id === memberId) {
        memberName = m.firstName;
        m.relationshipScore = clamp((m.relationshipScore ?? 50) + 2);
        m.lastInteractionDate = state.gameDate;
      }
      return m;
    };

    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner = updateMember(updatedProfile.partner);
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(updateMember);
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(updateMember);
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness + 1),
    });
    
    get().addEvent(`Complimented ${memberName}. Relationship +2, Happiness +1.`);
  },

  conversationWithFamilyMember: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';

    const updatedProfile = { ...state.profile };

    // Helper function to update a member
    const updateMember = (m: any) => {
      if (m.id === memberId) {
        memberName = m.firstName;
        m.relationshipScore = clamp((m.relationshipScore ?? 50) + 3);
        m.lastInteractionDate = state.gameDate;
      }
      return m;
    };

    // Check partner
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner = updateMember(updatedProfile.partner);
    }
    // Check friends
    else if (updatedProfile.friends) {
      updatedProfile.friends = updatedProfile.friends.map(updateMember);
    }
    // Check exes
    if (!memberName && updatedProfile.exes) {
      updatedProfile.exes = updatedProfile.exes.map(updateMember);
    }
    // Check family
    if (!memberName) {
      const family = updatedProfile.family;
      if (family) {
        if (family.grandparents) family.grandparents = family.grandparents.map(updateMember);
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
        if (family.grandchildren) family.grandchildren = family.grandchildren.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      happiness: clamp(state.happiness + 2),
    });
    
    get().addEvent(`Had a conversation with ${memberName}. Relationship +3, Happiness +2.`);
  },

  // Career actions
  applyForJob: (job: Job) => {
    const state = get();
    // Check requirements
    if (job.requiredAge && state.age < job.requiredAge) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: `Must be at least ${job.requiredAge} years old.` });
      return;
    }
    if (job.requiredEducation && state.educationStatus < job.requiredEducation) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: 'Education requirements not met.' });
      return;
    }
    if (job.requiredSmarts && state.smarts < job.requiredSmarts) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: 'Smarts requirement not met.' });
      return;
    }
    if (state.career.currentJob) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: 'You already have a job. Quit first.' });
      return;
    }

    set((s) => ({
      career: {
        ...s.career,
        currentJob: job,
        careerHistory: [...s.career.careerHistory, job],
      },
    }));
    get().addEvent(`Applied for and got the job: ${job.title} at $${job.baseSalary}/year.`);
    Toast.show({ type: 'success', text1: 'Job secured!', text2: `You got the ${job.title} position.` });
  },

  work: () => {
    const state = get();
    if (!state.career.currentJob) {
      Toast.show({ type: 'error', text1: 'Work failed', text2: 'You have no job to work at.' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (state.career.lastWorkedDate === today) {
      Toast.show({ type: 'error', text1: 'Work failed', text2: 'You already worked today.' });
      return;
    }

    const salary = state.career.currentJob.baseSalary;
    const dailyPay = Math.floor(salary / 365);
    const experienceGain = Math.floor(Math.random() * 5) + 1; // 1-5 experience points

    set((s) => ({
      money: s.money + dailyPay,
      career: {
        ...s.career,
        workExperience: s.career.workExperience + experienceGain,
        lastWorkedDate: today,
      },
      happiness: Math.max(0, (s.happiness ?? 50) - 2), // Working reduces happiness slightly
    }));

    get().addEvent(`Worked and earned $${dailyPay}. Experience +${experienceGain}. Happiness -2.`);
    Toast.show({ type: 'success', text1: 'Work day completed', text2: `Earned $${dailyPay}, gained ${experienceGain} experience.` });
  },

  quitJob: () => {
    const state = get();
    if (!state.career.currentJob) {
      Toast.show({ type: 'error', text1: 'Quit failed', text2: 'You have no job to quit.' });
      return;
    }

    const jobTitle = state.career.currentJob.title;
    set((s) => ({
      career: {
        ...s.career,
        currentJob: null,
      },
    }));
    get().addEvent(`Quit your job as ${jobTitle}.`);
    Toast.show({ type: 'info', text1: 'Job quit', text2: `You quit your job as ${jobTitle}.` });
  },

  applyForPartTimeJob: (job: PartTimeJob) => {
    const state = get();
    if (state.career.partTimeJob) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: 'You can only have one part-time job at a time.' });
      return;
    }

    // Check age requirements
    const hasAgeRequirement = job.requirements.some(req => req.includes('Age'));
    if (hasAgeRequirement) {
      const ageReq = job.requirements.find(req => req.includes('Age'));
      if (ageReq && ageReq.includes('18+') && state.age < 18) {
        Toast.show({ type: 'error', text1: 'Application failed', text2: 'You must be 18 or older for this job.' });
        return;
      }
    }

    set((s) => ({
      career: {
        ...s.career,
        partTimeJob: job,
        partTimeHoursWorked: 0,
      },
    }));
    get().addEvent(`Started part-time job as ${job.title} at ${job.company}.`);
    Toast.show({ type: 'success', text1: 'Job accepted', text2: `You got a part-time job as ${job.title}!` });
  },

  workPartTime: (hours: number) => {
    const state = get();
    if (!state.career.partTimeJob) {
      Toast.show({ type: 'error', text1: 'Work failed', text2: 'You have no part-time job.' });
      return;
    }

    const maxHoursPerWeek = state.career.partTimeJob.hoursPerWeek;
    const currentHours = state.career.partTimeHoursWorked;
    
    if (currentHours + hours > maxHoursPerWeek) {
      Toast.show({ type: 'error', text1: 'Work failed', text2: `You can only work ${maxHoursPerWeek} hours per week. You've already worked ${currentHours} hours.` });
      return;
    }

    const earnings = state.career.partTimeJob.hourlyRate * hours;
    
    set((s) => ({
      money: s.money + earnings,
      career: {
        ...s.career,
        partTimeHoursWorked: s.career.partTimeHoursWorked + hours,
      },
      happiness: Math.max(0, (s.happiness ?? 50) - 1), // Part-time work reduces happiness slightly
    }));

    get().addEvent(`Worked part-time for ${hours} hours and earned $${earnings}. Happiness -1.`);
    Toast.show({ type: 'success', text1: 'Part-time work completed', text2: `Earned $${earnings} for ${hours} hours of work.` });
  },

  quitPartTimeJob: () => {
    const state = get();
    if (!state.career.partTimeJob) {
      Toast.show({ type: 'error', text1: 'Quit failed', text2: 'You have no part-time job to quit.' });
      return;
    }

    const jobTitle = state.career.partTimeJob.title;
    set((s) => ({
      career: {
        ...s.career,
        partTimeJob: null,
        partTimeHoursWorked: 0,
      },
    }));
    get().addEvent(`Quit your part-time job as ${jobTitle}.`);
    Toast.show({ type: 'info', text1: 'Part-time job quit', text2: `You quit your part-time job as ${jobTitle}.` });
  },

  assets: [],
  buyAsset: (asset: Asset) => {
    const state = get();
    if (state.money < asset.cost) {
      Toast.show({ type: 'error', text1: 'Purchase failed', text2: 'Not enough money.' });
      return;
    }
    if (asset.requiredAge && state.age < asset.requiredAge) {
      Toast.show({ type: 'error', text1: 'Purchase failed', text2: `You must be at least ${asset.requiredAge} to buy this.` });
      return;
    }
    set((s) => ({
      money: s.money - asset.cost,
      assets: [...s.assets, asset],
      happiness: s.happiness + (asset.happinessBoost || 0),
    }));
    get().addEvent(`Purchased ${asset.name} for $${asset.cost}.`);
    Toast.show({ type: 'success', text1: 'Purchase successful', text2: `You bought a ${asset.name}.` });
  },
  sellAsset: (asset: Asset) => {
    set((s) => ({
      money: s.money + asset.resaleValue,
      assets: s.assets.filter((a) => a.id !== asset.id),
    }));
    get().addEvent(`Sold ${asset.name} for $${asset.resaleValue}.`);
    Toast.show({ type: 'info', text1: 'Asset sold', text2: `You sold your ${asset.name}.` });
    },
  }),
  { name: 'simslyfe-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export default useGameStore;
