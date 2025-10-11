# SimsLyfe

A BitLife-style life simulation mobile game scaffolded with Expo + React Native + TypeScript.

Quick start

1. Install dependencies (PNPM):

```powershell
cd "d:\Project\Mobile APP\SimsLyfe"
pnpm install
```

2. Run the app (Expo):

```powershell
pnpm start
# or to open on Android emulator/device
pnpm android
```

Project structure

- `App.tsx` — app entry, sets up navigation and providers
- `src/navigation` — app navigation stack
- `src/screens` — example `HomeScreen` and `GameScreen`
- `src/store` — simple Zustand store for game state

Next steps

- Add gameplay systems (careers, relationships, events)
- Add assets, UI screens, and analytics
- Integrate persistent save/load with `@react-native-async-storage/async-storage`

