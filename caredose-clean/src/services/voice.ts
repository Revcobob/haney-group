/**
 * Voice reminders (spoken out loud) for users with limited vision.
 * Uses on-device text-to-speech via expo-speech.
 */

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export function speakReminder(text: string) {
  if (Platform.OS === 'web') return;
  try {
    Speech.stop();
    Speech.speak(text, { rate: 0.92, pitch: 1.0 });
  } catch {
    // Speech is a progressive enhancement; never block the alarm on it.
  }
}

export function stopSpeaking() {
  if (Platform.OS === 'web') return;
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
