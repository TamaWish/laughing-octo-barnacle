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
            // auto-enroll in kindergarten at age 3 if not already enrolled
            if (newAge === 3 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.preschool) {
                const publicPreschool = catalog.courses.preschool.find(c => c.cost === 0);
                if (publicPreschool) {
                  get().enrollCourse(publicPreschool);
                  get().addEvent(`Auto-enrolled in ${publicPreschool.name} at age 3.`);
                }
              }
            }
            // auto-enroll in primary school at the country's start age if educationStatus == 0 and not enrolled
            if (get().educationStatus === 0 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.primary) {
                const primaryCourse = catalog.courses.primary[0];
                if (primaryCourse && newAge === primaryCourse.requiredAge) {
                  get().enrollCourse(primaryCourse);
                  get().addEvent(`Auto-enrolled in ${primaryCourse.name} at age ${newAge}.`);
                }
              }
            }
            // auto-enroll in secondary school at the country's start age if educationStatus >= 1 and not enrolled
            if (get().educationStatus >= 1 && !get().isCurrentlyEnrolled && get().profile?.country) {
              const countryCode = get().profile!.country;
              const catalog = COUNTRY_EDUCATION_MAP[countryCode];
              if (catalog && catalog.courses.secondary) {
                const secondaryCourse = catalog.courses.secondary[0];
                if (secondaryCourse && newAge === secondaryCourse.requiredAge) {
                  get().enrollCourse(secondaryCourse);
                  get().addEvent(`Auto-enrolled in ${secondaryCourse.name} at age ${newAge}.`);
                }
              }
            }
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

            // call autosave callback when available
            const cb = (get() as any).autosaveCallback;
            if (cb) cb();

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
  enrollCourse: (course: Course) => {
    const state = get();
    // Constraint 1: mutually exclusive
    if (state.isCurrentlyEnrolled) {
      Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'You are already enrolled in a program.' });
      state.addEvent('Enrollment failed: already enrolled in another program.');
      return;
    }
    // Constraint 2: age (strict numeric check)
    if (typeof course.requiredAge === 'number' && state.age < course.requiredAge) {
      Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `Must be at least ${course.requiredAge} to enroll.` });
      state.addEvent(`Enrollment failed: too young for ${course.name}.`);
      return;
    }
    // Constraint 3: education status (including alternate entry via GPA)
    if (typeof course.requiredStatus === 'number') {
      const hasStatus = state.educationStatus >= course.requiredStatus;
      // alternate entry: allow lower status + GPA if provided
      let allowByAlternate = false;
      if (course.alternateEntry && state.profile && typeof (state.profile as any).gpa === 'number') {
        const alt = course.alternateEntry;
        if (state.educationStatus >= (alt.minStatus ?? 0) && (state.profile as any).gpa >= (alt.minGpa ?? 0)) allowByAlternate = true;
      }
      // also allow if profile.gpa meets minGpa (legacy minGpa field)
      if (!hasStatus && !allowByAlternate && typeof course.minGpa === 'number' && state.profile && typeof (state.profile as any).gpa === 'number') {
        if ((state.profile as any).gpa >= course.minGpa) allowByAlternate = true;
      }
      if (!hasStatus && !allowByAlternate) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'Educational prerequisites not met.' });
        state.addEvent(`Enrollment failed: prerequisites not met for ${course.name}.`);
        return;
      }
    }
    // Constraint 4: money
    if (typeof course.cost === 'number' && state.money < course.cost) {
      Toast.show({ type: 'error', text1: 'Enrollment failed', text2: 'Insufficient funds for tuition.' });
      state.addEvent(`Enrollment failed: insufficient funds for ${course.name}.`);
      return;
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

    // Constraint 6: required exams (MCAT, LSAT, DAT) and work experience for MBAs
    if (course.requiredExam) {
      const passed = state.profile && Array.isArray((state.profile as any).passedExams) && ((state.profile as any).passedExams as string[]).includes(course.requiredExam);
      if (!passed) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `You must pass ${course.requiredExam} to enroll.` });
        state.addEvent(`Enrollment failed: missing ${course.requiredExam} for ${course.name}.`);
        return;
      }
    }

    if (typeof course.requiredWorkYears === 'number') {
      const years = (state.profile as any)?.yearsWorked ?? 0;
      if (years < course.requiredWorkYears) {
        Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `Requires ${course.requiredWorkYears} years of work experience.` });
        state.addEvent(`Enrollment failed: insufficient work experience for ${course.name}.`);
        return;
      }
    }

    // Constraint 7: logical constraints / blocking rules
    if (course.logicalConstraint) {
      // plumber apprenticeship and other trades that block academic enrollment
      if (course.logicalConstraint.blocksAcademic && state.educationStatus < 5) {
        // if the sim has any active trade certificate flagged previously, block
        // here we deny enrollment if currentEnrollment is academic and a blocking trade is present (simplified)
      }
      // block pre-med if Sim has a trade that blocks it
      if (course.logicalConstraint.blocksIfTradeCertificate && Array.isArray(course.logicalConstraint.blocksIfTradeCertificate)) {
        const blocked = (course.logicalConstraint.blocksIfTradeCertificate as string[]).some((tradeId) => (state.completedCertificates || []).includes(tradeId) || (state.currentEnrollment && state.currentEnrollment.id === tradeId));
        if (blocked) {
          Toast.show({ type: 'error', text1: 'Enrollment failed', text2: `Your trade background prevents entry to ${course.name}.` });
          state.addEvent(`Enrollment failed: trade background prevents ${course.name}.`);
          return;
        }
      }
    }

    // Passed checks — deduct money and set enrollment
  set((s) => ({ money: s.money - (course.cost || 0), isCurrentlyEnrolled: true, currentEnrollment: { id: course.id || String(Date.now()), name: course.name, duration: course.duration || 1, timeRemaining: course.duration || 1, cost: course.cost || 0, grantsStatus: course.grantsStatus, preReqs: course.preReqs, logicalConstraint: course.logicalConstraint } as Enrollment }));
    get().addEvent(`Enrolled in ${course.name}. Tuition paid: $${course.cost || 0}.`);
    Toast.show({ type: 'success', text1: 'Enrolled', text2: `Successfully enrolled in ${course.name}.` });
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
    // Add degree/name to completedDegrees and update status
    set((s) => ({ completedDegrees: Array.from(new Set([...(s.completedDegrees || []), completedCourse.name])), completedCertificates: Array.from(new Set([...(s.completedCertificates || []), completedCourse.id])) }));
    // Special handling for preschool completion: boost stats instead of status
    const isPreschool = completedCourse.id?.includes('-preschool-');
    if (isPreschool) {
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
    } else {
      // Determine status to grant: prefer explicit grantsStatus, otherwise attempt to infer
      const grant = completedCourse.grantsStatus ?? (completedCourse.name?.toLowerCase()?.includes('associate') ? 4 : completedCourse.name?.toLowerCase()?.includes('b.a') || completedCourse.name?.toLowerCase()?.includes('b.s') || completedCourse.name?.toLowerCase()?.includes('bachelor') ? 5 : completedCourse.name?.toLowerCase()?.includes('master') || completedCourse.name?.toLowerCase()?.includes('m.d') || completedCourse.name?.toLowerCase()?.includes('j.d') || completedCourse.name?.toLowerCase()?.includes('ph.d') ? 6 : completedCourse.name?.toLowerCase()?.includes('certificate') ? 3 : null);
      if (typeof grant === 'number') {
        set(() => ({ educationStatus: Math.max(get().educationStatus, grant) }));
        get().addEvent(`Education status updated to ${grant} after completing ${completedCourse.name}.`);
      }
      Toast.show({ type: 'success', text1: 'Graduation', text2: `Completed ${completedCourse.name}!` });
    }
    // clear enrollment
    set(() => ({ isCurrentlyEnrolled: false, currentEnrollment: null }));
    const cb4 = (get() as any).autosaveCallback;
    if (cb4) cb4();
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
  reset: () => set({ age: 0, money: 1000, eventLog: [], gameDate: new Date().toISOString() }),
  spendTimewithFamilyMember: (memberId: string) => {
    const state = get();
    if (!state.profile) return;

    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let memberName = '';

    const updatedProfile = { ...state.profile };
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner.relationshipScore = clamp((updatedProfile.partner.relationshipScore ?? 50) + 5);
      memberName = updatedProfile.partner.firstName;
    } else {
      const family = updatedProfile.family;
      if (family) {
        const updateMember = (m: any) => {
          if (m.id === memberId) {
            m.relationshipScore = clamp((m.relationshipScore ?? 50) + 5);
            memberName = m.firstName;
          }
          return m;
        };
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
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
    if (updatedProfile.partner?.id === memberId) {
      updatedProfile.partner.relationshipScore = clamp((updatedProfile.partner.relationshipScore ?? 50) + 10);
      memberName = updatedProfile.partner.firstName;
    } else {
      const family = updatedProfile.family;
      if (family) {
        const updateMember = (m: any) => {
          if (m.id === memberId) {
            m.relationshipScore = clamp((m.relationshipScore ?? 50) + 10);
            memberName = m.firstName;
          }
          return m;
        };
        if (family.parents) family.parents = family.parents.map(updateMember);
        if (family.siblings) family.siblings = family.siblings.map(updateMember);
        if (family.children) family.children = family.children.map(updateMember);
      }
    }

    set({
      profile: updatedProfile,
      money: state.money - cost,
    });
    get().addEvent(`Gave a gift to ${memberName}. Relationship +10, Money -${cost}.`);
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
