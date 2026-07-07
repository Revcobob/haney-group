/**
 * Local notification scheduling for care reminders.
 *
 * FUTURE integration points:
 * - Push notifications via a backend + Expo Push for caregiver alerts.
 * - iOS Critical Alerts entitlement so `alarm.critical` tasks bypass silent
 *   mode and Do Not Disturb; Android full-screen intents for the same.
 * - Server-side scheduling so reminders fire even if the app was never
 *   reopened after a device restart.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { CareTask, DoseEvent } from '@/types/models';
import { effectiveDueDate } from '@/utils/schedule';

let configured = false;

/** Show alerts even while the app is foregrounded. */
export function configureNotificationHandling() {
  if (configured || Platform.OS === 'web') return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('care-reminders', {
      name: 'Care reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
      enableVibrate: true,
    }).catch(() => {});
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

/**
 * Re-schedule local notifications to match today's remaining events.
 * Called after every event refresh/mutation; wipes and re-creates so the
 * schedule can never drift from the store.
 */
export async function syncNotifications(events: DoseEvent[], tasks: CareTask[]) {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = Date.now();
    const taskById = new Map(tasks.map((t) => [t.id, t]));
    const upcoming = events
      .filter((e) => e.status === 'scheduled')
      .filter((e) => effectiveDueDate(e).getTime() > now)
      .sort((a, b) => effectiveDueDate(a).getTime() - effectiveDueDate(b).getTime())
      // iOS caps pending local notifications at 64; stay well under it.
      .slice(0, 32);

    for (const event of upcoming) {
      const task = taskById.get(event.taskId);
      if (!task || !task.alarm.sound && !task.alarm.vibration && !task.alarm.fullScreen) {
        // Fully silent tasks still appear in the in-app timeline.
        if (!task) continue;
      }
      const med = task.medication;
      const body =
        task.type === 'medication' && med
          ? `${med.dose}${med.strength ? ` · ${med.strength}` : ''} — ${task.instructions}`
          : task.instructions;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for: ${task.name}`,
          body,
          sound: task.alarm.sound,
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: { eventId: event.id, taskId: task.id },
          // FUTURE: interruptionLevel 'critical' once the entitlement exists.
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: effectiveDueDate(event),
          channelId: 'care-reminders',
        },
      });

      // Repeat-until-confirmed: schedule a couple of follow-up nudges.
      // FUTURE: replace with a real repeating alarm cancelled on confirm.
      if (task.alarm.repeatEveryMinutes) {
        for (const n of [1, 2]) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Still waiting: ${task.name}`,
              body: `This reminder repeats until you confirm it in CareDose.`,
              sound: task.alarm.sound,
              data: { eventId: event.id, taskId: task.id },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: new Date(
                effectiveDueDate(event).getTime() +
                  n * task.alarm.repeatEveryMinutes * 60_000,
              ),
              channelId: 'care-reminders',
            },
          });
        }
      }
    }
  } catch {
    // Notifications are best-effort; the in-app alarm remains the source of truth.
  }
}
