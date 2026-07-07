/**
 * Loud alarm tone playback via expo-av.
 *
 * The tone is a small generated WAV (assets/alarm.wav) so the app works
 * offline with no licensing concerns. FUTURE: offer a choice of gentler /
 * louder tones and route through the alarm audio channel on Android.
 */

import { Audio } from 'expo-av';
import { Platform } from 'react-native';

let sound: Audio.Sound | null = null;

export async function startAlarmTone(loop = true) {
  if (Platform.OS === 'web') return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true, // "loud alarm option" — audible even on silent
      shouldDuckAndroid: false,
    });
    const created = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@/assets/alarm.wav'),
      { isLooping: loop, volume: 1.0 },
    );
    sound = created.sound;
    await sound.playAsync();
  } catch {
    // Sound is best-effort; vibration/voice/visual channels still fire.
  }
}

export async function stopAlarmTone() {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch {
    sound = null;
  }
}
