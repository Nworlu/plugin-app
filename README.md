# Plugin App

The Plugin organizer mobile app — an [Expo](https://expo.dev) / React Native app for event organizers to create and manage events, check in attendees, run campaigns, and track earnings and payouts.

This repo is the **frontend only**. It talks to a separate backend API over HTTP; no backend code lives here.

## Tech stack

- **Framework**: [Expo](https://expo.dev) (SDK 54) + [Expo Router](https://docs.expo.dev/router/introduction) (file-based routing, typed routes)
- **UI**: React Native 0.81 + [NativeWind](https://www.nativewind.dev) (Tailwind CSS via `className`) — no `StyleSheet` objects
- **State**: [Zustand](https://github.com/pmndrs/zustand) for local/client state, [TanStack Query](https://tanstack.com/query) for server state (with AsyncStorage persistence)
- **Networking**: [Axios](https://axios-http.com) via a shared client in [utils/api-client.ts](utils/api-client.ts)
- **Icons**: [lucide-react-native](https://lucide.dev)
- **Testing**: [Jest](https://jestjs.io) + `@react-native/jest-preset`

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure the API base URL

   ```bash
   cp .env.example .env
   ```

   By default this points at `http://localhost:8001/api`. Point `EXPO_PUBLIC_API_BASE_URL` at your backend instance.

3. Start the app

   ```bash
   npx expo start
   ```

   From the output you can open the app in a [development build](https://docs.expo.dev/develop/development-builds/introduction/), [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Expo Go](https://expo.dev/go).

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the Metro dev server |
| `npm run ios` | Build and run on iOS simulator |
| `npm run android` | Build and run on Android emulator |
| `npm run web` | Run in a browser |
| `npm run lint` | Run ESLint (`eslint-config-expo`) |
| `npm test` | Run the Jest test suite |

## Project structure

Screens live in `app/` (Expo Router), business logic and screen implementations live in `feature/`. See [STRUCTURE.md](STRUCTURE.md) for the full directory breakdown and conventions (styling, theming, safe area, barrel exports, etc.).

At a glance:

- **`app/(auth)/`** — onboarding, login, signup, verification, location setup
- **`app/(organizer)/`** — the organizer app shell, with a `(tabs)/` group for Home, Events, Earnings, and Account
- **`feature/organizer/`** — feature modules (`home`, `events`, `earnings`, `account`, `notifications`), each with their own `components/`, `hooks/`, and `utils/`
- **`utils/api/`** — typed HTTP client functions per domain, built on the shared client in `utils/api-client.ts`
- **`hooks/api/`** — TanStack Query hooks wrapping the `utils/api/` functions
- **`store/`** — Zustand stores for client-side state (auth, organizer, locale, privacy, campaigns)
- **`providers/`** — app-wide React context providers (auth, network, theme, query, error boundary)

## Backend

This app expects a REST API reachable at `EXPO_PUBLIC_API_BASE_URL`. Auth is bearer-token based (`utils/api-client.ts` attaches the stored token; `providers/AuthProvider.tsx` and `utils/auth-session.ts` handle session state and invalidation). There is no backend source in this repository — API integration work here means adding/adjusting `utils/api/*.ts` + `hooks/api/*.ts` against an existing or documented backend contract.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
