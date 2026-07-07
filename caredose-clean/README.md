# CareDose (clean Expo project)

A care-plan reminder and adherence companion for patients and caregivers.
This is the **clean rebuild** of CareDose, scaffolded with
`create-expo-app@latest` and containing only Expo-compatible mobile
dependencies — no Next.js, no Clerk, no web-only packages.

**The project is pinned to Expo SDK 54 (React Native 0.81, Expo Router v6)
on purpose.** That is the newest SDK the Expo Go app currently available on
the App Store / Play Store can run — Expo Go builds for SDK 55–57 are still
stuck in store review (see Expo's changelog). If you see "download the
latest Expo Go" on an up-to-date phone, the project SDK is newer than the
store's Expo Go; don't upgrade this project past SDK 54 until the stores
carry a newer Expo Go.

> The previous `caredose/` folder is superseded by this project.
> Always run Expo commands from inside `caredose-clean/`, **not** from the
> repository root — the root `package.json` belongs to the Haney Group
> Next.js website.

## Run it in Expo Go

```bash
cd caredose-clean
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).
Other commands: `npm run web`, `npm run typecheck`.

## What's inside

- **Onboarding** — welcome, text size, alarm style, emergency contact,
  helper intro, plan choice (sample / import / blank), medical disclaimer.
- **Today** — greeting, active plan, large "Next Up" card with live
  countdown and Done / Snooze / Need Help, missed-steps escalation banner,
  and the full day timeline.
- **Full-screen alarm** — pill photo or large icon, dose, instructions,
  time due; per-task loud sound (expo-audio, plays in silent mode), spoken
  voice reminder (expo-speech), vibration, pulsing visual (Reduce Motion
  aware).
- **Plans** — Recovery Plans with 13 care-task types; guided add-medication
  (React Hook Form) and non-medication flows with large chip-based forms.
- **Import** — photograph papers / upload PDF with **mocked** OCR
  extraction, an editable review, and a mandatory confirmation gate.
- **Helpers** — caregiver invites with codes and 7 granular permissions
  (mocked locally, shaped for a future backend).
- **History** — day/week/month adherence stats and the full care log.
- **Settings** — text size, theme, reduce motion, default alarms,
  emergency contact, disclaimer, erase-all.

## Structure

```
src/app/            # Expo Router routes (tabs, alarm, forms, modals)
src/components/ui/  # design system (AppText, Button, Card, chips, ...)
src/features/       # tasks, alarms, import, helpers, history logic
src/store/          # Zustand stores persisted to AsyncStorage
src/services/       # notifications, voice (TTS), alarm sound (expo-audio)
src/theme/          # tokens + useTheme (palette, text scaling)
src/types/          # data models
src/utils/          # dates, scheduling engine, ids
src/data/           # sample Knee Surgery Recovery plan
assets/alarm.wav    # generated alarm tone
```

## Notes on the migration

Migrated from the old `caredose/` project (Expo SDK 53): application source
only — no `node_modules`, lockfile, or old `package.json`. Changes made for
the current SDK:

- `expo-av` → **`expo-audio`** (`src/services/alarmSound.ts`); expo-av is
  deprecated/removed in current SDKs.
- Tab bar icon typing updated for Expo Router v6 (`ColorValue`).
- Source moved under `src/` to match the current template (`@/*` →
  `./src/*`).
- `metro.config.js` prefers CommonJS resolution because zustand v5's ESM
  build uses `import.meta`, which Hermes/Metro on SDK 54 don't support.
- All dependency versions come from `expo@54`'s `bundledNativeModules.json`
  (the `npx expo install` API can be unreachable behind proxies).

`FUTURE:` comments throughout mark the OCR/AI, authentication, push
notification, and backend integration points.
