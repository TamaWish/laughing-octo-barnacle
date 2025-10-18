import useGameStore from '../src/store/gameStore';

// mock Toast to avoid errors
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('enrollCourse checks', () => {
  beforeEach(() => {
    // reset store
    const s = useGameStore.getState();
    s.reset();
  });

  test('preReqs block enrollment when skill too low', () => {
    const s = useGameStore.getState();
    // create a fake course requiring smarts 90
    const course = { id: 'test-high-smarts', name: 'Elite CS', duration: 4, cost: 1000, preReqs: { requiredSkill: 'smarts', value: 90 } } as any;
    // set low smarts
    useGameStore.setState({ smarts: 50, money: 5000 });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(false);
  });

  test('insufficient funds block enrollment', () => {
    const course = { id: 'expensive', name: 'Expensive MBA', duration: 2, cost: 999999 } as any;
    useGameStore.setState({ money: 100 });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(false);
  });

  test('requiredExam blocks enrollment if not passed', () => {
    const course = { id: 'med-md', name: 'Medical School', duration: 4, cost: 1000, requiredExam: 'MCAT' } as any;
    useGameStore.setState({ money: 10000, profile: { passedExams: [] } as any });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(false);
  });

  test('logicalConstraint blocks if trade certificate present', () => {
    const course = { id: 'uni-premed', name: 'Pre-Med', duration: 4, cost: 1000, logicalConstraint: { blocksIfTradeCertificate: ['cc-cna'] } } as any;
    useGameStore.setState({ money: 10000, completedCertificates: ['cc-cna'] });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(false);
  });

  test('successful enrollment deducts money and sets currentEnrollment', () => {
    const course = { id: 'on-datasci', name: 'Intro to Data Science', duration: 1, cost: 200 } as any;
    useGameStore.setState({ money: 1000, smarts: 100 });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(true);
    expect(st.money).toBe(800);
    expect(st.currentEnrollment?.id).toBe('on-datasci');
  });

  test('enrollment initializes GPA based on smarts stat', () => {
    const course = { id: 'test-gpa', name: 'Test Course', duration: 4, cost: 0 } as any;
    useGameStore.setState({ money: 1000, smarts: 75 }); // Should give GPA around 3.0
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.currentEnrollment?.currentGPA).toBeDefined();
    expect(st.currentEnrollment?.currentGPA).toBeGreaterThanOrEqual(2.0);
    expect(st.currentEnrollment?.currentGPA).toBeLessThanOrEqual(4.0);
  });

  test('GPA updates during year advancement', () => {
    const course = { id: 'test-gpa-progress', name: 'Test Course', duration: 2, cost: 0 } as any;
    useGameStore.setState({ money: 1000, smarts: 80, age: 20 });
    useGameStore.getState().enrollCourse(course);
    
    const initialGPA = useGameStore.getState().currentEnrollment?.currentGPA;
    expect(initialGPA).toBeDefined();
    
    // Advance one year
    useGameStore.getState().advanceYear();
    
    const updatedGPA = useGameStore.getState().currentEnrollment?.currentGPA;
    expect(updatedGPA).toBeDefined();
    expect(updatedGPA).toBeGreaterThanOrEqual(2.0);
    expect(updatedGPA).toBeLessThanOrEqual(4.0);
  });

  test('university re-enrollment allows switching to any university course', () => {
    const course1 = { id: 'us-university-standard', name: 'Standard University', duration: 4, cost: 0, requiredStatus: 3, requiredAge: 18 } as any;
    const course2 = { id: 'fr-university-sorbonne', name: 'La Sorbonne', duration: 3, cost: 0, requiredStatus: 3, requiredAge: 18 } as any;
    
    useGameStore.setState({ money: 1000, smarts: 80, age: 20, educationStatus: 3 });
    
    // Enroll in first university course (US)
    useGameStore.getState().enrollCourse(course1);
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(true);
    expect(useGameStore.getState().currentEnrollment?.id).toBe('us-university-standard');
    
    // Switch to second university course (France) - should allow
    useGameStore.getState().enrollCourse(course2);
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(true);
    expect(useGameStore.getState().currentEnrollment?.id).toBe('fr-university-sorbonne');
  });

  test('university re-enrollment blocks completed course+major combinations', () => {
    const courseWithMajor1 = { id: 'us-university-standard', name: 'Standard University', major: 'Engineering', duration: 1, cost: 0, requiredStatus: 3, requiredAge: 18 } as any;
    const courseWithMajor2 = { id: 'us-university-standard', name: 'Standard University', major: 'Business', duration: 1, cost: 0, requiredStatus: 3, requiredAge: 18 } as any;
    
    useGameStore.setState({ money: 1000, smarts: 80, age: 20, educationStatus: 3 });
    
    // Enroll and complete the course with Engineering major
    useGameStore.getState().enrollCourse(courseWithMajor1);
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(true);
    
    // Advance year to complete the course
    useGameStore.getState().advanceYear();
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(false);
    
    // Check that the course+major was added to completed lists
    const state = useGameStore.getState();
    expect(state.completedDegrees).toContain('Standard University');
    expect(state.completedUniversityCourses).toContain('us-university-standard-Engineering');
    
    // Try to enroll again in the same course+major (should fail)
    useGameStore.getState().enrollCourse(courseWithMajor1);
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(false);
    
    // Try to enroll in the SAME university with DIFFERENT major (should succeed)
    useGameStore.getState().enrollCourse(courseWithMajor2);
    expect(useGameStore.getState().isCurrentlyEnrolled).toBe(true);
    expect(useGameStore.getState().currentEnrollment?.major).toBe('Business');
  });
});
