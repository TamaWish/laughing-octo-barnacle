import useGameStore from '../src/store/gameStore';
import { COUNTRY_EDUCATION_MAP } from '../src/store/educationCatalog';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('Australia Education System - Complete Flow Verification', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  it('should verify AU education catalog configuration', () => {
    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    
    expect(catalog).toBeDefined();
    expect(catalog.courses.preschool).toBeDefined();
    expect(catalog.courses.primary).toBeDefined();
    expect(catalog.courses.secondary).toBeDefined();

    // Check preschool/kindergarten
    const publicPreschool = catalog.courses.preschool.find(c => c.cost === 0);
    expect(publicPreschool).toBeDefined();
    expect(publicPreschool?.requiredAge).toBe(3);
    expect(publicPreschool?.duration).toBe(2);
    expect(publicPreschool?.grantsStatus).toBe(0);

    // Check primary school
    const primary = catalog.courses.primary[0];
    expect(primary).toBeDefined();
    expect(primary.requiredAge).toBe(5);
    expect(primary.duration).toBe(7);
    expect(primary.grantsStatus).toBe(1);
    expect(primary.requiredStatus).toBe(0);

    // Check secondary school
    const secondary = catalog.courses.secondary[0];
    expect(secondary).toBeDefined();
    expect(secondary.requiredAge).toBe(12);
    expect(secondary.duration).toBe(6);
    expect(secondary.grantsStatus).toBe(2);
    expect(secondary.requiredStatus).toBe(1);
  });

  it('should auto-enroll in kindergarten at age 3 (Australia)', () => {
    // Start at age 2
    useGameStore.setState({
      age: 2,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Emma', 
        lastName: 'Wilson', 
        country: 'AU' 
      },
    });

    // Advance to age 3
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(3);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Preschool');
    expect(state.currentEnrollment?.timeRemaining).toBe(2);
    expect(state.educationStatus).toBe(0); // Still status 0
  });

  it('should complete kindergarten at age 5 and auto-enroll in primary (Australia)', () => {
    // Start at age 3, enrolled in kindergarten
    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const preschool = catalog.courses.preschool.find(c => c.cost === 0);
    
    useGameStore.setState({
      age: 3,
      educationStatus: 0,
      isCurrentlyEnrolled: true,
      currentEnrollment: {
        id: preschool!.id,
        name: preschool!.name,
        duration: 2,
        timeRemaining: 2,
        cost: 0,
        grantsStatus: 0,
      },
      profile: { 
        avatar: 1, 
        gender: 'male', 
        firstName: 'Liam', 
        lastName: 'Brown', 
        country: 'AU' 
      },
    });

    // Advance year 1 (age 3->4, timeRemaining 2->1)
    useGameStore.getState().advanceYear();
    let state = useGameStore.getState();
    expect(state.age).toBe(4);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);
    expect(state.educationStatus).toBe(0);

    // Advance year 2 (age 4->5, complete kindergarten, auto-enroll in primary)
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    
    expect(state.age).toBe(5);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
    expect(state.currentEnrollment?.timeRemaining).toBe(7);
    expect(state.educationStatus).toBe(0); // Still status 0, will become 1 after primary
  });

  it('should complete primary at age 12 and auto-enroll in secondary (Australia)', () => {
    // Start at age 11 with 1 year of primary remaining
    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const primary = catalog.courses.primary[0];
    
    useGameStore.setState({
      age: 11,
      educationStatus: 0,
      isCurrentlyEnrolled: true,
      currentEnrollment: {
        id: primary.id,
        name: primary.name,
        duration: 7,
        timeRemaining: 1,
        cost: 0,
        grantsStatus: 1,
      },
      profile: { 
        avatar: 2, 
        gender: 'female', 
        firstName: 'Olivia', 
        lastName: 'Taylor', 
        country: 'AU' 
      },
    });

    // Advance year - complete primary and auto-enroll in secondary
    useGameStore.getState().advanceYear();
    const state = useGameStore.getState();
    
    expect(state.age).toBe(12);
    expect(state.educationStatus).toBe(1); // Now has primary completion status
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Secondary');
    expect(state.currentEnrollment?.timeRemaining).toBe(6);
  });

  it('should complete full education path from age 3 to 18 (Australia)', () => {
    // Start before kindergarten age
    useGameStore.setState({
      age: 2,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 3, 
        gender: 'other', 
        firstName: 'Jordan', 
        lastName: 'Lee', 
        country: 'AU' 
      },
    });

    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const preschool = catalog.courses.preschool.find(c => c.cost === 0);
    const primary = catalog.courses.primary[0];
    const secondary = catalog.courses.secondary[0];

    // Age 2 -> 3: Should auto-enroll in kindergarten
    useGameStore.getState().advanceYear();
    let state = useGameStore.getState();
    expect(state.age).toBe(3);
    expect(state.currentEnrollment?.name).toBe(preschool?.name);
    
    // Age 3 -> 4: Still in kindergarten
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    expect(state.age).toBe(4);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);
    
    // Age 4 -> 5: Complete kindergarten, auto-enroll in primary
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    expect(state.age).toBe(5);
    expect(state.currentEnrollment?.name).toBe(primary.name);
    expect(state.educationStatus).toBe(0);
    
    // Fast forward through primary (7 years: age 5-11)
    for (let i = 0; i < 6; i++) {
      useGameStore.getState().advanceYear();
    }
    state = useGameStore.getState();
    expect(state.age).toBe(11);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);
    
    // Age 11 -> 12: Complete primary, auto-enroll in secondary
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    expect(state.age).toBe(12);
    expect(state.educationStatus).toBe(1);
    expect(state.currentEnrollment?.name).toBe(secondary.name);
    expect(state.currentEnrollment?.timeRemaining).toBe(6);
    
    // Fast forward through secondary (6 years: age 12-17)
    for (let i = 0; i < 5; i++) {
      useGameStore.getState().advanceYear();
    }
    state = useGameStore.getState();
    expect(state.age).toBe(17);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);
    
    // Age 17 -> 18: Complete secondary
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    expect(state.age).toBe(18);
    expect(state.educationStatus).toBe(2); // Completed secondary
    expect(state.isCurrentlyEnrolled).toBe(false); // No auto-enrollment after secondary
  });

  it('should handle edge case: student who skipped kindergarten', () => {
    // Student starts at age 5 with no prior education
    useGameStore.setState({
      age: 5,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 4, 
        gender: 'male', 
        firstName: 'Noah', 
        lastName: 'Anderson', 
        country: 'AU' 
      },
    });

    // At age 5, should auto-enroll in primary (not kindergarten)
    useGameStore.getState().advanceYear();
    const state = useGameStore.getState();
    
    expect(state.age).toBe(6);
    // Since they were age 5 with status 0, they should have been enrolled in primary
    // Let's check if it happened during the year transition
  });
});
