/**
 * Completion with safety guards:
 * - "Already taken?" warning when a medication dose of the same task was
 *   completed very recently (double-dose protection).
 * - "Confirmed late" logging when a missed dose is completed after the fact.
 * - Success haptic on completion.
 */

import * as Haptics from 'expo-haptics';
import { Alert, Platform } from 'react-native';

import { useCareStore } from '@/store/careStore';
import type { DoseEvent } from '@/types/models';
import { deriveStatus } from '@/utils/schedule';

/** Doses of the same medication completed within this window trigger a warning. */
const DOUBLE_DOSE_WINDOW_HOURS = 3;

function successHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
}

/**
 * Complete an event after running the safety checks. `onDone` fires after the
 * event is actually marked (not when a warning is declined).
 */
export function completeEventWithGuards(event: DoseEvent, onDone?: () => void) {
  const store = useCareStore.getState();
  const task = store.tasks.find((t) => t.id === event.taskId);
  const now = new Date();
  const late = deriveStatus(event, now) === 'missed';

  const finish = () => {
    store.completeEvent(event.id, { late });
    successHaptic();
    onDone?.();
  };

  if (task?.type === 'medication') {
    const recentDose = store.events.find(
      (e) =>
        e.taskId === event.taskId &&
        e.id !== event.id &&
        e.status === 'done' &&
        e.completedAt &&
        now.getTime() - new Date(e.completedAt).getTime() <
          DOUBLE_DOSE_WINDOW_HOURS * 3_600_000,
    );
    if (recentDose) {
      Alert.alert(
        'Already taken?',
        `You marked ${task.name} as taken less than ${DOUBLE_DOSE_WINDOW_HOURS} hours ago. Are you sure you want to record another dose?`,
        [
          { text: 'No, cancel', style: 'cancel' },
          { text: 'Yes, record this dose', style: 'destructive', onPress: finish },
        ],
      );
      return;
    }
  }

  finish();
}

/** Skip with a confirmation so a stray tap never silently skips a dose. */
export function skipEventWithConfirm(event: DoseEvent, onDone?: () => void) {
  const store = useCareStore.getState();
  const task = store.tasks.find((t) => t.id === event.taskId);
  Alert.alert(
    'Skip this step?',
    task?.type === 'medication'
      ? `Skipping ${task?.name ?? 'this medication'} will be recorded in your history. If you're unsure, check with your doctor or pharmacist first.`
      : `Skipping "${task?.name ?? 'this task'}" will be recorded in your history.`,
    [
      { text: 'Go back', style: 'cancel' },
      {
        text: 'Skip it',
        style: 'destructive',
        onPress: () => {
          store.skipEvent(event.id);
          onDone?.();
        },
      },
    ],
  );
}

/** Undo a completion within the History/Today UI (accidental tap safety). */
export function undoEventWithConfirm(event: DoseEvent, onDone?: () => void) {
  const store = useCareStore.getState();
  Alert.alert('Undo this entry?', 'The step will go back to "not done yet".', [
    { text: 'Keep it', style: 'cancel' },
    {
      text: 'Undo',
      onPress: () => {
        store.undoEvent(event.id);
        onDone?.();
      },
    },
  ]);
}
