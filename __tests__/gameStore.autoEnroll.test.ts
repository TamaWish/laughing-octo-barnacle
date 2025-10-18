import useGameStore from '../src/store/gameStore';
import { COUNTRY_EDUCATION_MAP } from '../src/store/educationCatalog';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('Auto-enrollment tests for education progression', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  it('should auto-enroll in primary school after preschool completion (Australia)', () => {
    // Set up Australian student
    useGameStore.setState({
      age: 4,
      educationStatus: 0,
      profile: { 
        avatar: 1, 
        gender: 'male', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const preschool = catalog.courses.preschool.find(c => c.cost === 0);
    
    // Manually enroll in preschool
    if (preschool) {
      useGameStore.setState({
        isCurrentlyEnrolled: true,
        currentEnrollment: {
          id: preschool.id,
          name: preschool.name,
          duration: preschool.duration,
          timeRemaining: 1, // Only 1 year left
          cost: 0,
          grantsStatus: 0,
        },
      });
    }

    // Age up - should complete preschool and auto-enroll in primary
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    // Should be 5 now
    expect(state.age).toBe(5);
    
    // Should be enrolled in primary school
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
  });

  it('should auto-enroll in secondary school after primary completion (Australia)', () => {
    // Set up Australian student finishing primary school
    useGameStore.setState({
      age: 11,
      educationStatus: 0,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const primary = catalog.courses.primary[0];
    
    // Enroll in primary with 1 year remaining
    if (primary) {
      useGameStore.setState({
        isCurrentlyEnrolled: true,
        currentEnrollment: {
          id: primary.id,
          name: primary.name,
          duration: primary.duration,
          timeRemaining: 1, // Last year
          cost: 0,
          grantsStatus: 1,
        },
      });
    }

    // Age up - should complete primary and auto-enroll in secondary
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    // Should be 12 now
    expect(state.age).toBe(12);
    
    // Should have completed primary (status 1)
    expect(state.educationStatus).toBe(1);
    
    // Should be enrolled in secondary school
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Secondary');
  });

  it('should auto-enroll in primary school at age 6 if not enrolled (US)', () => {
    useGameStore.setState({
      age: 5,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 2, 
        gender: 'male', 
        firstName: 'John', 
        lastName: 'Doe', 
        country: 'US' 
      },
    });

    // Age up to 6
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(6);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Elementary');
  });

  it('should auto-enroll in secondary school after primary completion (France)', () => {
    // Set up French student finishing primary school
    useGameStore.setState({
      age: 10,
      educationStatus: 0,
      profile: { 
        avatar: 3, 
        gender: 'female', 
        firstName: 'Marie', 
        lastName: 'Dupont', 
        country: 'FR' 
      },
    });

    const catalog = COUNTRY_EDUCATION_MAP['FR'];
    const primary = catalog.courses.primary[0];
    
    // Enroll in primary with 1 year remaining
    if (primary) {
      useGameStore.setState({
        isCurrentlyEnrolled: true,
        currentEnrollment: {
          id: primary.id,
          name: primary.name,
          duration: primary.duration,
          timeRemaining: 1,
          cost: 0,
          grantsStatus: 1,
        },
      });
    }

    // Age up - should complete primary and auto-enroll in secondary
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(11);
    expect(state.educationStatus).toBe(1);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Collège');
  });

  it('should auto-enroll in secondary school at age 11 for UK student with status 1', () => {
    // Student who already completed primary but wasn't enrolled
    useGameStore.setState({
      age: 10,
      educationStatus: 1,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 4, 
        gender: 'other', 
        firstName: 'Sam', 
        lastName: 'Smith', 
        country: 'GB' 
      },
    });

    // Age up to 11
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(11);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Secondary');
  });

  it('should auto-enroll in primary school for Germany at age 6', () => {
    useGameStore.setState({
      age: 5,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 5, 
        gender: 'male', 
        firstName: 'Hans', 
        lastName: 'Mueller', 
        country: 'DE' 
      },
    });

    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(6);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Grundschule');
  });

  it('should auto-enroll in secondary school at age 10 for Germany after primary completion', () => {
    // German student finishing Grundschule
    useGameStore.setState({
      age: 9,
      educationStatus: 0,
      profile: { 
        avatar: 6, 
        gender: 'female', 
        firstName: 'Heidi', 
        lastName: 'Schmidt', 
        country: 'DE' 
      },
    });

    const catalog = COUNTRY_EDUCATION_MAP['DE'];
    const primary = catalog.courses.primary[0];
    
    if (primary) {
      useGameStore.setState({
        isCurrentlyEnrolled: true,
        currentEnrollment: {
          id: primary.id,
          name: primary.name,
          duration: primary.duration,
          timeRemaining: 1,
          cost: 0,
          grantsStatus: 1,
        },
      });
    }

    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    
    expect(state.age).toBe(10);
    expect(state.educationStatus).toBe(1);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Gymnasium');
  });
});
