/**
 * User preferences and onboarding state, persisted locally with AsyncStorage.
 * FUTURE: sync preferences to the user's account once authentication exists.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { TextScaleChoice } from '@/theme/tokens';
import type { AlarmPreference, EmergencyContact } from '@/types/models';

export type AppearanceChoice = 'system' | 'light' | 'dark';

export const DEFAULT_ALARM: AlarmPreference = {
  sound: true,
  voice: false,
  vibration: true,
  fullScreen: true,
  flashing: false,
  repeatEveryMinutes: 10,
  alertCaregiverIfMissed: false,
  critical: false,
};

interface SettingsState {
  hasOnboarded: boolean;
  userName: string;
  textScale: TextScaleChoice;
  appearance: AppearanceChoice;
  reducedMotion: boolean;
  /** Default alarm style applied to newly created tasks. */
  defaultAlarm: AlarmPreference;
  emergencyContact: EmergencyContact | null;
  disclaimerAcceptedAt: string | null;

  setUserName: (name: string) => void;
  setTextScale: (scale: TextScaleChoice) => void;
  setAppearance: (a: AppearanceChoice) => void;
  setReducedMotion: (v: boolean) => void;
  setDefaultAlarm: (patch: Partial<AlarmPreference>) => void;
  setEmergencyContact: (c: EmergencyContact | null) => void;
  acceptDisclaimer: () => void;
  completeOnboarding: () => void;
  resetAll: () => void;
}

const initialState = {
  hasOnboarded: false,
  userName: '',
  textScale: 'standard' as TextScaleChoice,
  appearance: 'system' as AppearanceChoice,
  reducedMotion: false,
  defaultAlarm: DEFAULT_ALARM,
  emergencyContact: null as EmergencyContact | null,
  disclaimerAcceptedAt: null as string | null,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserName: (userName) => set({ userName: userName.trim() }),
      setTextScale: (textScale) => set({ textScale }),
      setAppearance: (appearance) => set({ appearance }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setDefaultAlarm: (patch) =>
        set((s) => ({ defaultAlarm: { ...s.defaultAlarm, ...patch } })),
      setEmergencyContact: (emergencyContact) => set({ emergencyContact }),
      acceptDisclaimer: () =>
        set({ disclaimerAcceptedAt: new Date().toISOString() }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      resetAll: () => set({ ...initialState }),
    }),
    {
      name: 'caredose-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
