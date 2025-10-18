import useGameStore from '../src/store/gameStore';
import { COUNTRY_EDUCATION_MAP } from '../src/store/educationCatalog';

jest.mock('react-native-toast-message', () => ({ 
  show: jest.fn((config) => {
    console.log('TOAST:', config.type, '-', config.text1, '-', config.text2);
  })
}));

describe('Real-world Australia Education Bug', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  it('should trace exact execution when finishing kindergarten', () => {
    // Set up EXACT scenario: age 4, last year of kindergarten
    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const preschool = catalog.courses.preschool.find(c => c.cost === 0);
    
    useGameStore.setState({
      age: 4,
      educationStatus: 0,
      isCurrentlyEnrolled: true,
      money: 10000,
      health: 70,
      happiness: 50,
      smarts: 50,
      looks: 50,
      fame: 0,
      currentEnrollment: {
        id: preschool!.id,
        name: preschool!.name,
        duration: 2,
        timeRemaining: 1, // Last year
        cost: 0,
        grantsStatus: 0,
      },
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Emma', 
        lastName: 'Wilson', 
        country: 'AU',
      },
      gameDate: new Date('2024-01-15').toISOString(),
    });

    console.log('\n=== BEFORE ADVANCE YEAR ===');
    let state = useGameStore.getState();
    console.log('Age:', state.age);
    console.log('Education Status:', state.educationStatus);
    console.log('Enrolled:', state.isCurrentlyEnrolled);
    console.log('Current:', state.currentEnrollment?.name);
    console.log('Time Remaining:', state.currentEnrollment?.timeRemaining);

    // Advance year - this should complete kindergarten and auto-enroll in primary
    console.log('\n=== CALLING ADVANCE YEAR ===');
    useGameStore.getState().advanceYear();

    console.log('\n=== AFTER ADVANCE YEAR ===');
    state = useGameStore.getState();
    console.log('Age:', state.age);
    console.log('Education Status:', state.educationStatus);
    console.log('Enrolled:', state.isCurrentlyEnrolled);
    console.log('Current:', state.currentEnrollment?.name);
    console.log('Time Remaining:', state.currentEnrollment?.timeRemaining);

    // Check expectations
    expect(state.age).toBe(5);
    expect(state.educationStatus).toBe(0); // Still 0, primary hasn't completed
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
  });

  it('should check what happens when student is age 3 at start of kindergarten', () => {
    // Start completely fresh - age 2, no school
    useGameStore.setState({
      age: 2,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      money: 10000,
      health: 70,
      happiness: 50,
      smarts: 50,
      looks: 50,
      fame: 0,
      profile: { 
        avatar: 1, 
        gender: 'male', 
        firstName: 'Liam', 
        lastName: 'Brown', 
        country: 'AU',
      },
      gameDate: new Date('2022-01-15').toISOString(),
    });

    console.log('\n\n=== FULL EDUCATION JOURNEY ===');
    console.log('Starting at age 2...\n');

    // Age 2 -> 3: Should auto-enroll in kindergarten
    console.log('--- Advancing to age 3 ---');
    useGameStore.getState().advanceYear();
    let state = useGameStore.getState();
    console.log(`Age: ${state.age}, Enrolled: ${state.isCurrentlyEnrolled}, Course: ${state.currentEnrollment?.name}, Remaining: ${state.currentEnrollment?.timeRemaining}`);
    expect(state.age).toBe(3);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Preschool');
    
    // Age 3 -> 4: Kindergarten year 2
    console.log('\n--- Advancing to age 4 ---');
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    console.log(`Age: ${state.age}, Enrolled: ${state.isCurrentlyEnrolled}, Course: ${state.currentEnrollment?.name}, Remaining: ${state.currentEnrollment?.timeRemaining}`);
    expect(state.age).toBe(4);
    expect(state.currentEnrollment?.timeRemaining).toBe(1);

    // Age 4 -> 5: Complete kindergarten, should auto-enroll in primary
    console.log('\n--- Advancing to age 5 (should complete kindergarten and enroll in primary) ---');
    useGameStore.getState().advanceYear();
    state = useGameStore.getState();
    console.log(`Age: ${state.age}, Enrolled: ${state.isCurrentlyEnrolled}, Course: ${state.currentEnrollment?.name}, Remaining: ${state.currentEnrollment?.timeRemaining}, Status: ${state.educationStatus}`);
    
    console.log('\n=== CRITICAL CHECK ===');
    console.log('Is enrolled after kindergarten:', state.isCurrentlyEnrolled);
    console.log('Enrollment name:', state.currentEnrollment?.name);
    console.log('Should be Primary School!');
    
    expect(state.age).toBe(5);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toBe('Primary School');
  });
});
