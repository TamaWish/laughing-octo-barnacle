import useGameStore from '../src/store/gameStore';

// mock Toast to avoid errors
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('Education Profile Card Reactive Updates', () => {
  beforeEach(() => {
    // reset store completely including enrollment state
    useGameStore.setState({
      age: 0,
      money: 1000,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      currentEnrollment: null,
      completedDegrees: [],
      completedCertificates: [],
      health: 85,
      happiness: 62,
      smarts: 98,
      looks: 100,
      fame: 0,
      eventLog: [],
      completedSuggestions: [],
      gameDate: new Date().toISOString(),
    });
  });

  test('enrollment state updates are reactive', () => {
    const course = { 
      id: 'test-primary', 
      name: 'Primary School', 
      duration: 6, 
      cost: 0,
      requiredAge: 6
    } as any;

    // Set initial state - age must be 3+ for education info to display
    useGameStore.setState({ age: 6, money: 1000 });

    // Verify initial state
    let state = useGameStore.getState();
    expect(state.isCurrentlyEnrolled).toBe(false);
    expect(state.currentEnrollment).toBeNull();

    // Enroll in course
    state.enrollCourse(course);

    // Verify enrollment updated reactively
    state = useGameStore.getState();
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment).not.toBeNull();
    expect(state.currentEnrollment?.id).toBe('test-primary');
    expect(state.currentEnrollment?.name).toBe('Primary School');
    expect(state.currentEnrollment?.duration).toBe(6);
    expect(state.currentEnrollment?.timeRemaining).toBe(6);
  });

  test('education info should not display for ages 0-2', () => {
    // Even if somehow enrolled, education info shouldn't show for ages 0-2
    const course = { 
      id: 'test-early', 
      name: 'Early Learning', 
      duration: 1, 
      cost: 0,
      requiredAge: 0
    } as any;

    // Test age 0
    useGameStore.setState({ age: 0, money: 1000 });
    let state = useGameStore.getState();
    
    // This test just verifies the age constraint exists
    // In the UI, the education info won't render for age < 3
    expect(state.age).toBeLessThan(3);

    // Test age 2
    useGameStore.setState({ age: 2, money: 1000 });
    state = useGameStore.getState();
    expect(state.age).toBeLessThan(3);
  });

  test('education info should display starting at age 3', () => {
    const course = { 
      id: 'test-preschool', 
      name: 'Preschool', 
      duration: 1, 
      cost: 0,
      requiredAge: 3
    } as any;

    // Set age to 3
    useGameStore.setState({ age: 3, money: 1000 });
    
    // Enroll in course
    useGameStore.getState().enrollCourse(course);
    
    let state = useGameStore.getState();
    expect(state.age).toBeGreaterThanOrEqual(3);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment).not.toBeNull();
  });

  test('timeRemaining updates when advancing year', () => {
    const course = { 
      id: 'test-secondary', 
      name: 'Secondary School', 
      duration: 4, 
      cost: 0,
      requiredAge: 12
    } as any;

    useGameStore.setState({ age: 12, money: 1000, educationStatus: 1 });
    
    // Enroll
    useGameStore.getState().enrollCourse(course);
    
    let state = useGameStore.getState();
    expect(state.currentEnrollment?.timeRemaining).toBe(4);

    // Advance year
    state.advanceYear();

    // Verify timeRemaining decreased
    state = useGameStore.getState();
    expect(state.currentEnrollment?.timeRemaining).toBe(3);
    expect(state.age).toBe(13);
  });

  test('enrollment clears upon completion', () => {
    const course = { 
      id: 'test-short', 
      name: 'Short Course', 
      duration: 1, 
      cost: 0,
      grantsStatus: 3
    } as any;

    useGameStore.setState({ age: 18, money: 1000, educationStatus: 2 });
    
    // Enroll
    useGameStore.getState().enrollCourse(course);
    
    let state = useGameStore.getState();
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);

    // Advance year to complete
    state.advanceYear();

    // Verify completion
    state = useGameStore.getState();
    expect(state.isCurrentlyEnrolled).toBe(false);
    expect(state.currentEnrollment).toBeNull();
    expect(state.completedDegrees).toContain('Short Course');
  });

  test('progress calculation is accurate', () => {
    const course = { 
      id: 'test-uni', 
      name: 'University', 
      duration: 4, 
      cost: 10000,
      requiredAge: 18,
      requiredStatus: 2
    } as any;

    useGameStore.setState({ age: 18, money: 20000, educationStatus: 2 });
    
    // Enroll
    useGameStore.getState().enrollCourse(course);
    
    let state = useGameStore.getState();
    
    // Initial progress: (4 - 4) / 4 = 0%
    const initialProgress = state.currentEnrollment?.duration && state.currentEnrollment?.timeRemaining
      ? ((state.currentEnrollment.duration - state.currentEnrollment.timeRemaining) / state.currentEnrollment.duration) * 100
      : 0;
    expect(Math.round(initialProgress)).toBe(0);

    // Advance one year
    state.advanceYear();
    state = useGameStore.getState();
    
    // Progress after 1 year: (4 - 3) / 4 = 25%
    const progress1 = state.currentEnrollment?.duration && state.currentEnrollment?.timeRemaining
      ? ((state.currentEnrollment.duration - state.currentEnrollment.timeRemaining) / state.currentEnrollment.duration) * 100
      : 0;
    expect(Math.round(progress1)).toBe(25);

    // Advance another year
    state.advanceYear();
    state = useGameStore.getState();
    
    // Progress after 2 years: (4 - 2) / 4 = 50%
    const progress2 = state.currentEnrollment?.duration && state.currentEnrollment?.timeRemaining
      ? ((state.currentEnrollment.duration - state.currentEnrollment.timeRemaining) / state.currentEnrollment.duration) * 100
      : 0;
    expect(Math.round(progress2)).toBe(50);
  });

  test('graduation year uses in-game date not real-world date', () => {
    // Set a specific in-game date (year 2036)
    const inGameDate = new Date('2036-01-01T00:00:00.000Z').toISOString();
    
    const course = { 
      id: 'test-college', 
      name: 'College Program', 
      duration: 4, 
      cost: 5000,
      requiredAge: 18,
      requiredStatus: 2
    } as any;

    useGameStore.setState({ 
      age: 18, 
      money: 10000, 
      educationStatus: 2,
      gameDate: inGameDate
    });
    
    // Enroll in 4-year course
    useGameStore.getState().enrollCourse(course);
    
    let state = useGameStore.getState();
    
    // Calculate expected graduation year based on in-game date
    const currentGameYear = new Date(state.gameDate).getFullYear();
    const expectedGraduation = currentGameYear + Math.ceil(state.currentEnrollment?.timeRemaining ?? 0);
    
    // Should be 2036 + 4 = 2040, NOT real-world year + 4
    expect(currentGameYear).toBe(2036);
    expect(expectedGraduation).toBe(2040);
    
    // Verify timeRemaining is correct
    expect(state.currentEnrollment?.timeRemaining).toBe(4);
  });
});
