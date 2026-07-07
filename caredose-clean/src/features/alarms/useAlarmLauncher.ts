/**
 * Watches today's events while the app is open and pushes the full-screen
 * alarm the moment a task becomes due (for tasks with fullScreen alerts on).
 *
 * FUTURE: pair with notification taps + Android full-screen intents so the
 * alarm also takes over from the background/lock screen.
 */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useCareStore } from '@/store/careStore';
import { deriveStatus, effectiveDueDate } from '@/utils/schedule';

/** Alarm screens already shown this app session (avoid re-launch loops). */
const shownAlarms = new Set<string>();

/** Only auto-launch for events that became due within this window. */
const LAUNCH_WINDOW_MINUTES = 3;

export function useAlarmLauncher(now: Date) {
  const router = useRouter();
  const events = useCareStore((s) => s.events);
  const tasks = useCareStore((s) => s.tasks);

  useEffect(() => {
    const candidate = events.find((e) => {
      if (shownAlarms.has(e.id)) return false;
      if (deriveStatus(e, now) !== 'dueNow') return false;
      const dueMs = effectiveDueDate(e).getTime();
      if (now.getTime() - dueMs > LAUNCH_WINDOW_MINUTES * 60_000) return false;
      const task = tasks.find((t) => t.id === e.taskId);
      return !!task?.alarm.fullScreen;
    });
    if (candidate) {
      shownAlarms.add(candidate.id);
      router.push(`/alarm/${encodeURIComponent(candidate.id)}`);
    }
  }, [events, tasks, now, router]);
}

/** Mark an alarm as handled so snoozing doesn't instantly re-launch it. */
export function markAlarmShown(eventId: string) {
  shownAlarms.add(eventId);
}
