import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Profile } from '../types/profile';

type GameState = {
  age: number;
  money: number;
  gameDate: string;
  eventLog: string[];
  profile?: Profile;
  completedSuggestions: string[];
  setProfile: (p: Profile) => void;
  advanceYear: () => void;
  visitDoctor: (cost?: number) => void;
  takePartTimeJob: () => void;
  investStocks: () => void;
  planDate: () => void;
  goToGym: () => void;
  applyForPromotion: () => void;
  ignoreSuggestion: (title: string) => void;
  markSuggestionCompleted: (id: string) => void;
  clearCompletedSuggestions: () => void;
  addEvent: (msg: string) => void;
  reset: () => void;
};

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      age: 18,
      money: 1000,
      eventLog: [],
  completedSuggestions: [],
      profile: undefined,
          gameDate: new Date().toISOString(),
      setProfile: (p: Profile) => set({ profile: p }),
      advanceYear: () => {
            const newAge = get().age + 1;
            const delta = Math.floor(Math.random() * 1000) - 200;
            // advance the in-game date by one year so logs reflect game time
            set((s) => {
              const cur = new Date(s.gameDate || new Date().toISOString());
              const next = new Date(cur);
              next.setFullYear(next.getFullYear() + 1);
              return { age: s.age + 1, money: s.money + delta, gameDate: next.toISOString() };
            });
            get().addEvent(`Advanced to age ${newAge}. Money change: ${delta}`);
      },
      visitDoctor: (cost = 50) => {
        set((s) => ({ money: s.money - cost }));
        get().addEvent('Visited doctor. Health improved.');
      },
      takePartTimeJob: () => {
        const earn = Math.floor(Math.random() * (800 - 100 + 1)) + 100;
        set((s) => ({ money: s.money + earn }));
        get().addEvent(`Took a part-time job and earned ${earn}.`);
      },
      investStocks: () => {
        const delta = Math.floor(Math.random() * (1200 - -800 + 1)) + -800;
        set((s) => ({ money: s.money + delta }));
        get().addEvent(`Invested in stocks. Change: ${delta}.`);
      },
      planDate: () => {
        get().addEvent('Planned a date. Relationship improved.');
      },
      goToGym: () => {
        get().addEvent('Went to the gym. Health slightly improved.');
      },
      applyForPromotion: () => {
        const bonus = get().age >= 25 ? 2000 : 500;
        set((s) => ({ money: s.money + bonus }));
        get().addEvent(`Applied for promotion. Received ${bonus}.`);
      },
      ignoreSuggestion: (title: string) => {
        get().addEvent(`Ignored suggestion: ${title}`);
      },
      markSuggestionCompleted: (id: string) =>
        set((s) => ({ completedSuggestions: Array.from(new Set([...s.completedSuggestions, id])) })),
      clearCompletedSuggestions: () => set({ completedSuggestions: [] }),
      addEvent: (msg: string) =>
        set((s) => {
          // use the in-game date if available so logs track game time, otherwise fallback to now
          const d = s.gameDate ? new Date(s.gameDate) : new Date();
          return { eventLog: [...s.eventLog, `${d.toLocaleDateString()}: ${msg}`] };
        }),
      reset: () => set({ age: 18, money: 1000, eventLog: [], gameDate: new Date().toISOString() }),
    }),
  { name: 'simslyfe-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export default useGameStore;
