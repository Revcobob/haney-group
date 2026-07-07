/**
 * Loud alarm tone playback via expo-audio (the modern replacement for the
 * removed expo-av module).
 *
 * The tone is a small generated WAV (assets/alarm.wav) so the app works
 * offline with no licensing concerns. FUTURE: offer a choice of gentler /
 * louder tones and route through the alarm audio channel on Android.
 */

import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

let player: AudioPlayer | null = null;

export async function startAlarmTone(loop = true) {
  if (Platform.OS === 'web') return;
  try {
    // "Loud alarm option" — audible even when the phone is on silent.
    await setAudioModeAsync({ playsInSilentMode: true });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    player = createAudioPlayer(require('@/assets/alarm.wav'));
    player.loop = loop;
    player.volume = 1.0;
    player.play();
  } catch {
    // Sound is best-effort; vibration/voice/visual channels still fire.
  }
}

export async function stopAlarmTone() {
  try {
    if (player) {
      player.pause();
      player.remove();
      player = null;
    }
  } catch {
    player = null;
  }
}
