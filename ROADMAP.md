# SimsLyfe — Roadmap

This roadmap captures prioritized improvements, concrete implementation steps, and quick commands to level up the SimsLyfe app (UX, reliability, and gameplay).

## Overview

Inspected files:
- `src/screens/GameScreen.tsx` — simple UI reading from store and showing Age/Money.
- `src/screens/HomeScreen.tsx` — Start button that navigates to `Game`.
- `src/screens/LoadingScreen.tsx` — animated progress bar (uses private Animated internals currently).
- `src/navigation/index.tsx` — Stack navigator (Loading → Home → Game).
- `src/store/gameStore.ts` — Zustand store with `age`, `money`, `advanceYear()` and `reset()` (no persistence or event log).

Goals for the roadmap:
- Fix correctness and small UX bugs.
- Add persistence and a readable event log.
- Expand gameplay with events/choices.
- Improve UI to match mock (left purple sidebar + large central event log).
- Add tests and quality gates.

---

## Prioritized improvements (short list)

1. Fix LoadingScreen percent display (avoid reading private Animated internals).
2. Persist game state (use AsyncStorage + `zustand` persist middleware).
3. Add a scrollable event log and wire it into `GameScreen` (the central white area in your mock).
4. Replace ad-hoc random money delta with an event generator and optional player choices.
5. Implement the left purple sidebar and header to match the design mock (avatar, vertical stats text, logo + settings).
6. Format money (Intl.NumberFormat) and improve localization.
7. Add unit tests for `gameStore` logic (happy path + edge cases) and run TypeScript checks.
8. Optional: achievements, save-slots, seedable RNG, polish/animations, analytics.
9. If you'd like the profile to be editable from the Game screen or persisted as the player's saved slot, I can add UI and store actions for that.
10. If you want strong runtime validation, I can add a small schema (zod) and validate before persisting.


## Implementation log — persistence added

What I implemented now (persisted game state):

- Files changed:
  - `src/store/gameStore.ts` — switched the Zustand store to use `persist` middleware, added `eventLog` and `addEvent`, updated `advanceYear()` to append events.
  - `src/screens/LoadingScreen.tsx` — updated earlier to fix percent display (kept here for traceability of recent edits).

- Packages installed:
  - `@react-native-async-storage/async-storage` (used as the backend for Zustand persistence).

- Commands I ran locally:

```powershell
pnpm add @react-native-async-storage/async-storage
pnpm -w tsc --noEmit
```

- Verification steps performed:
  1. TypeScript check (`pnpm -w tsc --noEmit`) ran without errors.
  2. Manual inspect of `gameStore.ts` to ensure `createJSONStorage(() => AsyncStorage)` is used for JSON serialization compatibility.

- Notes & next actions:
  - The persisted store key is `simslyfe-storage`.
  - Next I can add `src/components/EventLog.tsx` and wire it into `GameScreen` so you can see stored events in the UI.
  - Consider adding a `version` field to persisted state for future migrations.

## Concrete changes (what to edit, and why)

### 1) LoadingScreen: reliable percent
- Problem: current code reads `(progress as any)._value`. That uses a private field and is brittle.
- Change: use an Animated.Value listener and mirrored React state:

```tsx
// conceptual snippet for `src/screens/LoadingScreen.tsx`
const progress = useRef(new Animated.Value(0)).current;
const [percent, setPercent] = useState(0);
useEffect(() => {
  const id = progress.addListener(({ value }) => setPercent(Math.round(value * 100)));
  Animated.timing(progress, { toValue: 1, duration: 3000, useNativeDriver: false }).start(() => {
    progress.removeListener(id);
    navigation.replace('Home');
  });
  return () => progress.removeListener(id);
}, []);
```

Why: reliable display of progress, avoids private API.


### 2) Persist the game state
- Problem: progress resets on app restart.
- Change: use `@react-native-async-storage/async-storage` + `zustand` `persist` middleware. Add an `eventLog` array to the store and expose `addEvent`.

Conceptual store shape (`src/store/gameStore.ts`):

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameState = {
  age: number;
  money: number;
  eventLog: string[];
  advanceYear: () => void;
  addEvent: (msg: string) => void;
  reset: () => void;
};

const useGameStore = create<GameState>(
  persist((set, get) => ({
    age: 18,
    money: 1000,
    eventLog: [],
    advanceYear: () => {
      const delta = Math.floor(Math.random() * 1000) - 200;
      set((s) => ({ age: s.age + 1, money: s.money + delta }));
      get().addEvent(`Advanced to age ${get().age + 1}. Money change: ${delta}`);
    },
    addEvent: (msg) => set((s) => ({ eventLog: [...s.eventLog, `${new Date().toLocaleDateString()}: ${msg}`] })),
    reset: () => set({ age: 18, money: 1000, eventLog: [] }),
  }), { name: 'simslyfe-storage', getStorage: () => AsyncStorage })
);
```

Why: persistence keeps player progress and supports an event history.

PowerShell install commands:

```powershell
pnpm add @react-native-async-storage/async-storage
```


### 3) Add EventLog component and wire into `GameScreen`
- Create `src/components/EventLog.tsx` that reads `eventLog` from the store and renders a `ScrollView`.
- Update `GameScreen.tsx` to use a two-column layout: left fixed-width purple sidebar, center scrollable `EventLog` white card, top header.

Conceptual EventLog:

```tsx
export default function EventLog() {
  const eventLog = useGameStore((s) => s.eventLog);
  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {eventLog.length === 0 ? <Text>Your life story will appear here...</Text> : eventLog.map((e,i) => <Text key={i}>{e}</Text>)}
    </ScrollView>
  );
}
```

Why: aligns the UI with your mock where the central white area is the scrollable log.


### 4) Event system + choices (gameplay)
- Replace one-liner random money changes with an event generator that returns objects like:

```ts
type GameEvent = {
  id: string;
  text: string;
  moneyDelta?: number;
  choices?: { id: string; text: string; apply: ()=>void }[];
};
```

- `advanceYear()` should pick or generate an event, apply consequences, and append a readable message to `eventLog`. Some events may present a choice UI to the player (e.g., accept job, study, gamble).

Why: more compelling gameplay and replayability.


### 5) UI polish: left sidebar + header
- Implement a persistent header (`Logo` + `Settings` gear) and a left purple sidebar with an avatar card and vertical statistics text.
- Use `flexDirection: 'row'` at top-level screen, left column fixed width (~92px in mock), center flex=1 white area.

Why: matches your mock and improves clarity.


### 6) Format money and localization
- Use `Intl.NumberFormat` for readable money display:

```tsx
const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(money);
<Text>Money: {formatted}</Text>
```

Why: better UX for larger numbers and negative values.


### 7) Tests & Quality Gates
- Add minimal unit tests (Jest or Vitest) for `gameStore` behavior: `advanceYear` increments age, `reset` sets defaults, `addEvent` appends.
- Run TypeScript checks and any existing linters.

Commands (example):

```powershell
pnpm test
pnpm -w tsc --noEmit
```

Why: prevents regressions when adding gameplay features.


### 8) Optional polish and features (later)
- Save-slots, achievements, sound fx, animated event cards, social share, seedable RNG, analytics.

---

## Engineering contract (for persistence + event log feature)
- Inputs: user taps Advance Year or chooses an event action.
- Outputs: the store updates age/money/eventLog; UI immediately reflects changes; store persisted to AsyncStorage.
- Error modes: AsyncStorage failures should be caught and logged; UI works in-memory.
- Success: state persists across app restarts, event messages appear in `EventLog`.

---

## Edge cases & migration notes
- Large `eventLog` growth: cap to N entries (e.g., 1000) or implement paging.
- Negative money: decide whether to allow negative balances or clamp at zero.
- Age upper/lower bounds: implement end-of-life screen at a max age (e.g., 100).
- Store migrations: include a `version` number in persisted store and add migration steps when shape changes.

---

## Packages to add (recommended)
- `@react-native-async-storage/async-storage` — persist store.
- `date-fns` — date formatting helpers (optional).
- `react-native-vector-icons` — icons for header & gear.

Install example:

```powershell
pnpm add @react-native-async-storage/async-storage date-fns react-native-vector-icons
```

---

## Tests & QA checklist
- [ ] Loading screen shows percentage reliably and navigates to Home.
- [ ] Start New Life navigates to `Game`.
- [ ] Advancing a year increments `age` and appends a message to `EventLog`.
- [ ] Restart the app and confirm the state persists (age, money, events).
- [ ] Reset clears persisted state.
- [ ] Money formatting is readable and correct for negative values.

---

## Small implementation bundles (pick one to start)

A) Quick fixes (low risk, quick win)
- Fix `LoadingScreen` percent display.
- Format money in `GameScreen`.
- Estimated work: 15–30 minutes.

B) Persisted state + event log (medium)
- Add `AsyncStorage` + `zustand` persist to `src/store/gameStore.ts`.
- Add `eventLog` and `addEvent` APIs.
- Add `src/components/EventLog.tsx` and wire into `GameScreen` UI.
- Estimated work: 1–2 hours.

C) Full UI + gameplay (larger)
- Implement left purple sidebar, header (logo + gear), detailed EventLog UI, event generator, and choice UIs.
- Add tests and polish.
- Estimated work: several hours to a day depending on depth.

---

## How I can help next
- I can implement A (quick fix) right now and push the edits. I'll run TypeScript checks and a quick smoke test.
- Or I can implement B (persistence + event log) in one go and verify store behavior.

Tell me which bundle (A/B/C) you want me to implement and I'll apply the changes, run checks, and report back with exact diffs and how to test locally.

---

## Completion notes
This file is a living roadmap. After you pick a bundle I will apply the changes and run quick validations.


---

Created on: 2025-10-09
