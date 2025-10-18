import useGameStore from '../src/store/gameStore';
import { COUNTRY_EDUCATION_MAP } from '../src/store/educationCatalog';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('BUGFIX: Age 8 with no school after kindergarten', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  it('should auto-enroll an 8-year-old with no school into primary', () => {
    // This is the exact bug scenario reported by the user
    useGameStore.setState({
      age: 8,
      educationStatus: 0, // Completed kindergarten but not enrolled
      isCurrentlyEnrolled: false,
      currentEnrollment: null,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Emma', 
        lastName: 'Wilson', 
        country: 'AU' 
      },
    });

    console.log('Bug Scenario: Age 8, No School, Education Status 0');
    console.log('Before advancing year:', {
      age: useGameStore.getState().age,
      enrolled: useGameStore.getState().isCurrentlyEnrolled,
    });

    // Advance one year
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    console.log('After advancing year:', {
      age: state.age,
      enrolled: state.isCurrentlyEnrolled,
      course: state.currentEnrollment?.name,
    });

    // Expectations
    expect(state.age).toBe(9);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment).not.toBeNull();
    expect(state.currentEnrollment?.name).toContain('Primary');
    console.log('✅ BUG FIXED: Student auto-enrolled in primary school!');
  });

  it('should auto-enroll even if age is younger than normal (edge case)', () => {
    // Edge case: somehow a 4-year-old has status 0 and no enrollment
    useGameStore.setState({
      age: 4,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      currentEnrollment: null,
      profile: { 
        avatar: 1, 
        gender: 'male', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    console.log('\nEdge Case: Age 4, No School (missed kindergarten)');
    
    // Advance one year
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    console.log('After advancing:', {
      age: state.age,
      enrolled: state.isCurrentlyEnrolled,
      course: state.currentEnrollment?.name,
    });

    // Should auto-enroll in primary even though age 5 is technically primary start
    expect(state.age).toBe(5);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
  });

  it('should handle secondary school auto-enrollment after primary completion', () => {
    // Student completes primary at age 11
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
        avatar: 1, 
        gender: 'other', 
        firstName: 'Jordan', 
        lastName: 'Lee', 
        country: 'AU' 
      },
    });

    console.log('\nPrimary to Secondary Transition');
    
    // Advance year - complete primary and auto-enroll in secondary
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    console.log('After completing primary:', {
      age: state.age,
      educationStatus: state.educationStatus,
      enrolled: state.isCurrentlyEnrolled,
      course: state.currentEnrollment?.name,
    });

    expect(state.age).toBe(12);
    expect(state.educationStatus).toBe(1); // Completed primary
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Secondary');
  });

  it('should handle complete journey with no gaps', () => {
    // Start before kindergarten
    useGameStore.setState({
      age: 2,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Complete', 
        lastName: 'Journey', 
        country: 'AU' 
      },
    });

    const checkEnrollment = (expectedAge: number, expectedCourse: string | null) => {
      const state = useGameStore.getState();
      expect(state.age).toBe(expectedAge);
      if (expectedCourse) {
        expect(state.isCurrentlyEnrolled).toBe(true);
        expect(state.currentEnrollment?.name).toContain(expectedCourse);
      }
    };

    // Age 2 -> 3: Auto-enroll kindergarten
    useGameStore.getState().advanceYear();
    checkEnrollment(3, 'Preschool');
    
    // Age 3 -> 4: Kindergarten year 2
    useGameStore.getState().advanceYear();
    checkEnrollment(4, 'Preschool');
    
    // Age 4 -> 5: Complete kindergarten, auto-enroll primary
    useGameStore.getState().advanceYear();
    checkEnrollment(5, 'Primary');
    
    // Age 5 -> 11: Complete primary (skip through years)
    for (let i = 0; i < 6; i++) {
      useGameStore.getState().advanceYear();
    }
    let state11 = useGameStore.getState();
    console.log('At age 11:', {
      age: state11.age,
      enrolled: state11.isCurrentlyEnrolled,
      course: state11.currentEnrollment?.name,
      timeRemaining: state11.currentEnrollment?.timeRemaining,
    });
    checkEnrollment(11, 'Primary');
    
    // Age 11 -> 12: Complete primary, auto-enroll secondary
    useGameStore.getState().advanceYear();
    const finalState = useGameStore.getState();
    console.log('At age 12:', {
      age: finalState.age,
      educationStatus: finalState.educationStatus,
      enrolled: finalState.isCurrentlyEnrolled,
      course: finalState.currentEnrollment?.name,
      timeRemaining: finalState.currentEnrollment?.timeRemaining,
    });
    expect(finalState.age).toBe(12);
    expect(finalState.educationStatus).toBe(1);
    expect(finalState.isCurrentlyEnrolled).toBe(true);
    expect(finalState.currentEnrollment?.name).toContain('Secondary');

    console.log('✅ Complete education journey verified: No gaps from age 3 to 12!');
  });
});
