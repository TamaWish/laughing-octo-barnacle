import useGameStore from '../src/store/gameStore';
import { COUNTRY_EDUCATION_MAP } from '../src/store/educationCatalog';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('Debug Australia Kindergarten to Primary Transition', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  it('should handle age 8 with no school after kindergarten bug', () => {
    // Simulate the exact scenario: age 8, no enrollment, education status 0
    useGameStore.setState({
      age: 8,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      currentEnrollment: null,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    console.log('BEFORE advanceYear:');
    console.log('Age:', useGameStore.getState().age);
    console.log('Education Status:', useGameStore.getState().educationStatus);
    console.log('Is Enrolled:', useGameStore.getState().isCurrentlyEnrolled);
    console.log('Current Enrollment:', useGameStore.getState().currentEnrollment);

    // Advance year
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    console.log('\nAFTER advanceYear:');
    console.log('Age:', state.age);
    console.log('Education Status:', state.educationStatus);
    console.log('Is Enrolled:', state.isCurrentlyEnrolled);
    console.log('Current Enrollment:', state.currentEnrollment);

    expect(state.age).toBe(9);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
  });

  it('should auto-enroll immediately when manually advancing from kindergarten completion', () => {
    // Start at age 4 in last year of kindergarten
    const catalog = COUNTRY_EDUCATION_MAP['AU'];
    const preschool = catalog.courses.preschool.find(c => c.cost === 0);

    useGameStore.setState({
      age: 4,
      educationStatus: 0,
      isCurrentlyEnrolled: true,
      currentEnrollment: {
        id: preschool!.id,
        name: preschool!.name,
        duration: 2,
        timeRemaining: 1,
        cost: 0,
        grantsStatus: 0,
      },
      profile: { 
        avatar: 1, 
        gender: 'male', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    console.log('\n=== KINDERGARTEN COMPLETION SCENARIO ===');
    console.log('BEFORE completing kindergarten:');
    console.log('Age:', useGameStore.getState().age);
    console.log('Time Remaining:', useGameStore.getState().currentEnrollment?.timeRemaining);

    // Advance year - should complete kindergarten and auto-enroll in primary
    useGameStore.getState().advanceYear();

    const state = useGameStore.getState();
    console.log('\nAFTER completing kindergarten:');
    console.log('Age:', state.age);
    console.log('Education Status:', state.educationStatus);
    console.log('Is Enrolled:', state.isCurrentlyEnrolled);
    console.log('Current Enrollment:', state.currentEnrollment);

    expect(state.age).toBe(5);
    expect(state.educationStatus).toBe(0);
    expect(state.isCurrentlyEnrolled).toBe(true);
    expect(state.currentEnrollment?.name).toContain('Primary');
  });

  it('should check auto-enrollment logic conditions step by step', () => {
    // Age 5, not enrolled, education status 0
    useGameStore.setState({
      age: 5,
      educationStatus: 0,
      isCurrentlyEnrolled: false,
      profile: { 
        avatar: 1, 
        gender: 'female', 
        firstName: 'Test', 
        lastName: 'User', 
        country: 'AU' 
      },
    });

    const state = useGameStore.getState();
    const catalog = COUNTRY_EDUCATION_MAP[state.profile!.country];
    const primaryCourse = catalog.courses.primary[0];

    console.log('\n=== CHECKING AUTO-ENROLLMENT CONDITIONS ===');
    console.log('educationStatus === 0:', state.educationStatus === 0);
    console.log('!isCurrentlyEnrolled:', !state.isCurrentlyEnrolled);
    console.log('profile?.country:', state.profile?.country);
    console.log('primaryCourse:', primaryCourse);
    console.log('age >= requiredAge:', state.age >= (primaryCourse.requiredAge ?? 0));
    console.log('requiredAge:', primaryCourse.requiredAge);

    // All conditions should be true
    expect(state.educationStatus).toBe(0);
    expect(state.isCurrentlyEnrolled).toBe(false);
    expect(state.profile?.country).toBe('AU');
    expect(primaryCourse).toBeDefined();
    expect(state.age >= (primaryCourse.requiredAge ?? 0)).toBe(true);

    // Now advance and see if it enrolls
    useGameStore.getState().advanceYear();
    const afterState = useGameStore.getState();

    console.log('\nAfter advance:');
    console.log('Is Enrolled:', afterState.isCurrentlyEnrolled);
    console.log('Enrollment:', afterState.currentEnrollment);

    expect(afterState.isCurrentlyEnrolled).toBe(true);
  });
});
