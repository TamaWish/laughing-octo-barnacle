import useGameStore from '../src/store/gameStore';

// Mock Toast functionality as it's a UI component not available in the test environment
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('gameStore core logic', () => {
  // Reset the store to a default state before each test
  beforeEach(() => {
    useGameStore.getState().reset();
    useGameStore.setState({
      age: 20,
      money: 5000,
      health: 80,
      happiness: 70,
      smarts: 60,
      looks: 50,
      eventLog: [],
      gameDate: new Date('2023-01-01T00:00:00.000Z').toISOString(),
    });
  });

  describe('advanceYear', () => {
    it('should increment age by 1', () => {
      const initialAge = useGameStore.getState().age;
      useGameStore.getState().advanceYear();
      expect(useGameStore.getState().age).toBe(initialAge + 1);
    });

    it('should update the gameDate by one year', () => {
      const initialDate = new Date(useGameStore.getState().gameDate);
      useGameStore.getState().advanceYear();
      const newDate = new Date(useGameStore.getState().gameDate);
      expect(newDate.getFullYear()).toBe(initialDate.getFullYear() + 1);
    });

    it('should modify core stats like health and happiness', () => {
      const { health, happiness } = useGameStore.getState();
      useGameStore.getState().advanceYear();
      // Health is expected to decrease, happiness can fluctuate
      const newHealth = useGameStore.getState().health;
      const newHappiness = useGameStore.getState().happiness;
      expect(newHealth).toBeLessThan(health);
      // Happiness can now stay the same, so we check if it's within a plausible range
      expect(newHappiness).toBeGreaterThanOrEqual(happiness - 1);
      expect(newHappiness).toBeLessThanOrEqual(happiness + 1);
    });

    it('should add a new event to the eventLog', () => {
      useGameStore.getState().advanceYear();
      expect(useGameStore.getState().eventLog.length).toBe(1);
      expect(useGameStore.getState().eventLog[0]).toContain('Advanced to age 21');
    });
  });

  describe('stat-modifying actions', () => {
    it('visitDoctor should increase health and happiness and decrease money', () => {
      const { health, happiness, money } = useGameStore.getState();
      const cost = 100;
      useGameStore.getState().visitDoctor(cost);
      const newState = useGameStore.getState();
      expect(newState.health).toBeGreaterThan(health);
      expect(newState.happiness).toBeGreaterThan(happiness);
      expect(newState.money).toBe(money - cost);
    });

    it('goToGym should increase health and happiness', () => {
      const { health, happiness } = useGameStore.getState();
      useGameStore.getState().goToGym();
      const newState = useGameStore.getState();
      expect(newState.health).toBeGreaterThan(health);
      expect(newState.happiness).toBeGreaterThan(happiness);
    });
  });
});