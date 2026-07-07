# CareDose

A care-plan reminder and adherence companion for patients and caregivers.
CareDose helps users know exactly what care step is due next — medications,
pain-medicine intervals, antibiotic courses, wound care, ice therapy, walks,
breathing exercises, vitals checks, appointments, and refills.

CareDose is **not** a pharmacy, medication database, or medical advice app.

## Running the app

```bash
cd caredose
npm install
npm start          # then press i / a, or scan the QR with Expo Go
npm run typecheck  # TypeScript check
```

Built with Expo SDK 53 / React Native 0.79 / Expo Router 5.

## What's inside

- **Onboarding** — 7 gentle steps: welcome, text size, alarm style, emergency
  contact, helper intro, plan choice (sample / import / blank), medical
  disclaimer.
- **Today** — greeting, active plan, a large "Next Up" card with live
  countdown and Done / Snooze / Need Help actions, a missed-steps escalation
  banner, and the full day's care timeline (due now / upcoming / done /
  snoozed / missed).
- **Full-screen alarm** — takes over when a step is due: pill photo or large
  icon, dose, instructions, time due; Done / Snooze / Need Help / Skip.
  Sensory channels per task: loud sound (plays in silent mode), spoken voice
  reminder, strong vibration, pulsing visual (disabled by Reduce Motion).
- **Plans** — Recovery Plans grouping Care Tasks; guided add-medication form
  (React Hook Form) and a guided flow for 12 non-medication task types, all
  chip-based (no dropdowns, minimal typing).
- **Import** — photograph discharge papers/prescriptions/bottles or upload a
  PDF/image. Extraction is **mocked** for v1; every extracted item is editable
  on a review screen and *nothing activates* until the user confirms they
  verified it.
- **Helpers** — caregiver mode with invite codes, 7 granular permissions,
  and instant removal. Mocked locally, shaped for a future backend.
- **History** — day/week/month views, adherence percentage, full care log
  (done / taken / skipped / snoozed / missed / edited / confirmed late /
  caregiver alerted), export & share-with-doctor placeholders.
- **Settings** — text size, light/dark/system theme, reduce motion, default
  alarm style, emergency contact, disclaimer, erase-all.

## Safety features

Medical disclaimer at onboarding · import review confirmation gate ·
duplicate-medication warning · "Already taken?" double-dose warning ·
missed-step escalation with catch-up-safely guidance · undo accidental
completion · emergency contact card + Need Help button everywhere it
matters · mock caregiver missed-task alerts · critical-task flag.

## Accessibility

Large text (in-app scale × OS Dynamic Type), 48pt+ touch targets, VoiceOver/
TalkBack labels and hints throughout, no color-only status (every status has
icon + text), labeled back buttons (no bare icons), dark mode, reduced-motion
support, voice reminders, vibration, and loud-alarm options.

## Architecture

```
app/                  # Expo Router routes (tabs, alarm, forms, modals)
components/ui/        # Design system (AppText, Button, Card, chips, ...)
features/             # tasks, alarms, import, helpers, history domain logic
store/                # Zustand stores persisted to AsyncStorage
services/             # notifications, voice (TTS), alarm sound
theme/                # tokens + useTheme (palette, text scaling)
types/models.ts       # all data models
utils/                # dates, scheduling engine, ids
data/seed.ts          # sample Knee Surgery Recovery plan + history
```

Scheduling: `ScheduleRule` (fixed times / every-N-hours window / as-needed)
→ deterministic `DoseEvent`s generated per day → display status derived from
the clock (`upcoming → dueSoon → dueNow → missed`), so regenerating never
loses what the user already confirmed.

## Future integration points (marked `FUTURE:` in code)

- Real OCR + LLM extraction pipeline (`features/import/mockExtraction.ts`)
- Authentication + synced backend for plans and helper permissions
- Push notifications and real caregiver alerts (`services/notifications.ts`,
  `store/careStore.ts#recordCaregiverAlert`)
- iOS Critical Alerts / Android full-screen intents for critical tasks
- Exportable PDF care report & share-with-doctor (`app/(tabs)/history.tsx`)
