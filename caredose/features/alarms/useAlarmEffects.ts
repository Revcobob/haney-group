/**
 * Drives the sensory channels of the full-screen alarm: sound, voice,
 * vibration, and the pulsing visual. Every channel respects the task's
 * AlarmPreference and the user's Reduce Motion setting.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Vibration } from 'react-native';

import { startAlarmTone, stopAlarmTone } from '@/services/alarmSound';
import { speakReminder, stopSpeaking } from '@/services/voice';
import { useTheme } from '@/theme/useTheme';
import type { AlarmPreference, CareTask } from '@/types/models';

function spokenText(task: CareTask): string {
  const med = task.medication;
  if (task.type === 'medication' && med) {
    return `Time for your medication. ${task.name}. ${med.dose}${
      med.strength ? `, ${med.strength}` : ''
    }. ${task.instructions}`;
  }
  return `Care reminder. ${task.name}. ${task.instructions}`;
}

export function useAlarmEffects(task: CareTask | undefined, alarm?: AlarmPreference) {
  const { reducedMotion } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;
  const prefs = alarm ?? task?.alarm;

  useEffect(() => {
    if (!task || !prefs) return;

    if (prefs.sound) startAlarmTone(true);
    if (prefs.voice) speakReminder(spokenText(task));
    if (prefs.vibration && Platform.OS !== 'web') {
      // Long strong pattern, repeating — perceivable for users with hearing loss.
      Vibration.vibrate([0, 600, 400, 600, 400, 600], true);
    }

    let animation: Animated.CompositeAnimation | null = null;
    if (prefs.flashing && !reducedMotion) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );
      animation.start();
    }

    return () => {
      stopAlarmTone();
      stopSpeaking();
      if (Platform.OS !== 'web') Vibration.cancel();
      animation?.stop();
      pulse.setValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]);

  /** 0→1 pulse value the alarm screen maps to a background tint. */
  return pulse;
}
