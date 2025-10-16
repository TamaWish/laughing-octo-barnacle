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
});
