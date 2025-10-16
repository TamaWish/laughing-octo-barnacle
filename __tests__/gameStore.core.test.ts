import useGameStore from '../src/store/gameStore';

// mock Toast to avoid errors
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('gameStore core logic', () => {
  beforeEach(() => {
    // reset store
    const s = useGameStore.getState();
    s.reset();
  });

  describe('advanceYear', () => {
    test('advances age by 1', () => {
      const initialAge = useGameStore.getState().age;
      useGameStore.getState().advanceYear();
      expect(useGameStore.getState().age).toBe(initialAge + 1);
    });

    test('updates money with random delta', () => {
      const initialMoney = useGameStore.getState().money;
      useGameStore.getState().advanceYear();
      const newMoney = useGameStore.getState().money;
      // Money should change by -200 to +800 (random delta -200 to +800)
      expect(newMoney).toBeGreaterThanOrEqual(initialMoney - 200);
      expect(newMoney).toBeLessThanOrEqual(initialMoney + 800);
    });

    test('reduces health slightly', () => {
      const initialHealth = useGameStore.getState().health;
      useGameStore.getState().advanceYear();
      const newHealth = useGameStore.getState().health;
      // Health should decrease by 1-3 or stay the same
      expect(newHealth).toBeLessThanOrEqual(initialHealth);
      expect(newHealth).toBeGreaterThanOrEqual(initialHealth - 3);
    });

    test('updates happiness randomly', () => {
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().advanceYear();
      const newHappiness = useGameStore.getState().happiness;
      // Happiness can change by -1 to +1
      expect(newHappiness).toBeGreaterThanOrEqual(Math.max(0, initialHappiness - 1));
      expect(newHappiness).toBeLessThanOrEqual(Math.min(100, initialHappiness + 1));
    });

    test('advances game date by one year', () => {
      const initialDate = new Date(useGameStore.getState().gameDate);
      useGameStore.getState().advanceYear();
      const newDate = new Date(useGameStore.getState().gameDate);
      expect(newDate.getFullYear()).toBe(initialDate.getFullYear() + 1);
    });
  });

  describe('visitDoctor', () => {
    test('deducts cost from money', () => {
      const initialMoney = useGameStore.getState().money;
      const cost = 50;
      useGameStore.getState().visitDoctor(cost);
      expect(useGameStore.getState().money).toBe(initialMoney - cost);
    });

    test('increases health by 15', () => {
      const initialHealth = useGameStore.getState().health;
      useGameStore.getState().visitDoctor();
      expect(useGameStore.getState().health).toBe(Math.min(100, initialHealth + 15));
    });

    test('increases happiness by 6', () => {
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().visitDoctor();
      expect(useGameStore.getState().happiness).toBe(Math.min(100, initialHappiness + 6));
    });

    test('respects health cap at 100', () => {
      useGameStore.setState({ health: 95 });
      useGameStore.getState().visitDoctor();
      expect(useGameStore.getState().health).toBe(100);
    });
  });

  describe('takePartTimeJob', () => {
    test('increases money by random amount between 100-800', () => {
      const initialMoney = useGameStore.getState().money;
      useGameStore.getState().takePartTimeJob();
      const newMoney = useGameStore.getState().money;
      expect(newMoney).toBeGreaterThan(initialMoney + 99);
      expect(newMoney).toBeLessThanOrEqual(initialMoney + 800);
    });

    test('decreases happiness by 2', () => {
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().takePartTimeJob();
      expect(useGameStore.getState().happiness).toBe(Math.max(0, initialHappiness - 2));
    });
  });

  describe('investStocks', () => {
    test('changes money by random amount between -800 to +1200', () => {
      const initialMoney = useGameStore.getState().money;
      useGameStore.getState().investStocks();
      const newMoney = useGameStore.getState().money;
      expect(newMoney).toBeGreaterThanOrEqual(initialMoney - 800);
      expect(newMoney).toBeLessThanOrEqual(initialMoney + 1200);
    });

    test('affects happiness based on investment outcome', () => {
      // Mock Math.random to control the outcome
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5); // This should give a positive delta
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().investStocks();
      const newHappiness = useGameStore.getState().happiness;
      expect(newHappiness).toBeGreaterThanOrEqual(initialHappiness);
      Math.random = originalRandom;
    });
  });

  describe('planDate', () => {
    test('increases happiness by 8', () => {
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().planDate();
      expect(useGameStore.getState().happiness).toBe(Math.min(100, initialHappiness + 8));
    });
  });

  describe('goToGym', () => {
    test('increases health by 6', () => {
      const initialHealth = useGameStore.getState().health;
      useGameStore.getState().goToGym();
      expect(useGameStore.getState().health).toBe(Math.min(100, initialHealth + 6));
    });

    test('increases happiness by 4', () => {
      const initialHappiness = useGameStore.getState().happiness;
      useGameStore.getState().goToGym();
      expect(useGameStore.getState().happiness).toBe(Math.min(100, initialHappiness + 4));
    });
  });

  describe('applyForPromotion', () => {
    test('gives bonus based on age (500 if under 25, 2000 if 25+)', () => {
      // Test under 25
      useGameStore.setState({ age: 20 });
      const initialMoney = useGameStore.getState().money;
      useGameStore.getState().applyForPromotion();
      expect(useGameStore.getState().money).toBe(initialMoney + 500);

      // Reset and test 25+
      useGameStore.getState().reset();
      useGameStore.setState({ age: 25 });
      const initialMoney2 = useGameStore.getState().money;
      useGameStore.getState().applyForPromotion();
      expect(useGameStore.getState().money).toBe(initialMoney2 + 2000);
    });

    test('increases happiness (4 for small bonus, 10 for large bonus)', () => {
      // Test small bonus
      useGameStore.setState({ age: 20, happiness: 50 });
      useGameStore.getState().applyForPromotion();
      expect(useGameStore.getState().happiness).toBe(54);

      // Reset and test large bonus
      useGameStore.getState().reset();
      useGameStore.setState({ age: 25, happiness: 50 });
      useGameStore.getState().applyForPromotion();
      expect(useGameStore.getState().happiness).toBe(60);
    });
  });

  describe('addEvent', () => {
    test('adds event to eventLog with current date', () => {
      const message = 'Test event';
      useGameStore.getState().addEvent(message);
      const events = useGameStore.getState().eventLog;
      expect(events.length).toBe(1);
      expect(events[0]).toContain(message);
      expect(events[0]).toContain(new Date().toLocaleDateString());
    });
  });

  describe('reset', () => {
    test('resets state to initial values', () => {
      // Modify state
      useGameStore.setState({
        age: 10,
        money: 5000,
        health: 50,
        eventLog: ['test event']
      });

      useGameStore.getState().reset();

      const state = useGameStore.getState();
      expect(state.age).toBe(0);
      expect(state.money).toBe(1000);
      expect(state.eventLog).toEqual([]);
    });
  });
});