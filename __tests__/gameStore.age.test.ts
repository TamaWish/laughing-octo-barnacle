import useGameStore from '../src/store/gameStore';
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('enrollCourse age checks', () => {
  beforeEach(() => {
    const s = useGameStore.getState();
    s.reset();
  });

  test('blocks enrollment when Sim is too young', () => {
    const course = { id: 'kid-course', name: 'Junior Class', duration: 1, cost: 0, requiredAge: 16 } as any;
    // set Sim age lower
    useGameStore.setState({ age: 14, money: 1000 });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(false);
  });

  test('allows enrollment when Sim meets minimum age', () => {
    const course = { id: 'adult-course', name: 'Adult Studies', duration: 1, cost: 100, requiredAge: 18 } as any;
    useGameStore.setState({ age: 20, money: 1000 });
    useGameStore.getState().enrollCourse(course);
    const st = useGameStore.getState();
    expect(st.isCurrentlyEnrolled).toBe(true);
    expect(st.currentEnrollment?.id).toBe('adult-course');
  });
});
