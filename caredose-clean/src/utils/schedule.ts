/**
 * The scheduling engine: turns ScheduleRules into concrete DoseEvents for a
 * day, and derives display statuses ("due now", "missed"...) from raw events.
 */

import type {
  CareTask,
  DoseEvent,
  RecoveryPlan,
  ScheduleRule,
} from '@/types/models';
import {
  addDays,
  dateAtTime,
  formatTimeString,
  fromDateKey,
  toDateKey,
} from '@/utils/dates';

/** Tasks show as "due soon" this many minutes before they are due. */
export const DUE_SOON_MINUTES = 60;
/** Uncompleted tasks become "missed" this many minutes after they were due. */
export const MISSED_AFTER_MINUTES = 60;

/** Everything the UI needs to color/label an event. Never color-only. */
export type DerivedStatus =
  | 'upcoming'
  | 'dueSoon'
  | 'dueNow'
  | 'snoozed'
  | 'done'
  | 'skipped'
  | 'missed';

/** Last calendar day (inclusive) a schedule is active, or null if open-ended. */
export function scheduleEndDate(rule: ScheduleRule): Date | null {
  if (rule.endDate) return fromDateKey(rule.endDate);
  if (rule.durationDays && rule.durationDays > 0) {
    return addDays(fromDateKey(rule.startDate), rule.durationDays - 1);
  }
  return null;
}

export function isTaskActiveOn(task: CareTask, date: Date): boolean {
  if (task.archived) return false;
  const start = fromDateKey(task.schedule.startDate);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  if (dayStart < new Date(start.setHours(0, 0, 0, 0))) return false;
  const end = scheduleEndDate(task.schedule);
  if (end) {
    end.setHours(23, 59, 59, 999);
    if (dayStart > end) return false;
  }
  const dow = task.schedule.daysOfWeek;
  if (dow && dow.length > 0 && !dow.includes(date.getDay())) return false;
  return true;
}

/** Clock times ("HH:mm") a task occurs on a given day. */
export function occurrenceTimesForDate(task: CareTask, date: Date): string[] {
  if (!isTaskActiveOn(task, date)) return [];
  const rule = task.schedule;
  if (rule.kind === 'asNeeded') return [];
  if (rule.kind === 'fixedTimes') {
    return [...(rule.times ?? [])].sort();
  }
  // interval
  const every = Math.max(1, rule.everyHours ?? 6);
  const start = rule.windowStart ?? '08:00';
  const end = rule.windowEnd ?? '22:00';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMin = (sh ?? 8) * 60 + (sm ?? 0);
  const endMin = (eh ?? 22) * 60 + (em ?? 0);
  const times: string[] = [];
  for (let m = startMin; m <= endMin; m += every * 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    times.push(`${`${h}`.padStart(2, '0')}:${`${mm}`.padStart(2, '0')}`);
  }
  return times;
}

/**
 * Deterministic event id so regenerating a day's events never duplicates
 * entries the user has already acted on.
 */
export function eventIdFor(taskId: string, date: Date, time: string): string {
  return `${taskId}@${toDateKey(date)}@${time}`;
}

/** Build the scheduled events for one calendar day across all active plans. */
export function buildEventsForDate(
  tasks: CareTask[],
  plans: RecoveryPlan[],
  date: Date,
): DoseEvent[] {
  const activePlanIds = new Set(
    plans.filter((p) => p.status === 'active').map((p) => p.id),
  );
  const events: DoseEvent[] = [];
  for (const task of tasks) {
    if (!activePlanIds.has(task.planId)) continue;
    for (const time of occurrenceTimesForDate(task, date)) {
      events.push({
        id: eventIdFor(task.id, date, time),
        taskId: task.id,
        planId: task.planId,
        dueAt: dateAtTime(toDateKey(date), time).toISOString(),
        status: 'scheduled',
      });
    }
  }
  return events.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/** Derive what the user should see for an event right now. */
export function deriveStatus(event: DoseEvent, now: Date): DerivedStatus {
  if (event.status === 'done') return 'done';
  if (event.status === 'skipped') return 'skipped';
  const due = new Date(event.dueAt);
  if (event.snoozedUntil) {
    const until = new Date(event.snoozedUntil);
    if (now < until) return 'snoozed';
    return 'dueNow';
  }
  const diffMin = (due.getTime() - now.getTime()) / 60_000;
  if (diffMin > DUE_SOON_MINUTES) return 'upcoming';
  if (diffMin > 0) return 'dueSoon';
  if (diffMin > -MISSED_AFTER_MINUTES) return 'dueNow';
  return 'missed';
}

/** The moment an event should next fire (snooze-aware). */
export function effectiveDueDate(event: DoseEvent): Date {
  if (event.snoozedUntil) return new Date(event.snoozedUntil);
  return new Date(event.dueAt);
}

/**
 * The single event the Home screen features as "Next Up":
 * the earliest actionable event — anything due now (or snooze elapsed) first,
 * otherwise the next upcoming one. Missed events are surfaced separately in
 * an escalation banner so a long-missed dose doesn't hide the next step.
 */
export function nextUpEvent(events: DoseEvent[], now: Date): DoseEvent | null {
  const actionable = events
    .filter((e) => {
      const s = deriveStatus(e, now);
      return s === 'dueNow' || s === 'dueSoon' || s === 'upcoming' || s === 'snoozed';
    })
    .sort(
      (a, b) => effectiveDueDate(a).getTime() - effectiveDueDate(b).getTime(),
    );
  return actionable[0] ?? null;
}

export function missedEvents(events: DoseEvent[], now: Date): DoseEvent[] {
  return events.filter((e) => deriveStatus(e, now) === 'missed');
}

/** Plain-language summary of a schedule rule, e.g. "3 times a day at 8:00 AM, 2:00 PM, 8:00 PM". */
export function describeSchedule(rule: ScheduleRule): string {
  let base: string;
  if (rule.kind === 'asNeeded') {
    base = 'As needed — no automatic reminders';
  } else if (rule.kind === 'fixedTimes') {
    const times = (rule.times ?? []).map(formatTimeString);
    if (times.length === 0) base = 'No times set';
    else if (times.length === 1) base = `Once a day at ${times[0]}`;
    else base = `${times.length} times a day at ${times.join(', ')}`;
  } else {
    const start = formatTimeString(rule.windowStart ?? '08:00');
    const end = formatTimeString(rule.windowEnd ?? '22:00');
    base = `Every ${rule.everyHours ?? 6} hours between ${start} and ${end}`;
  }
  if (rule.durationDays) {
    base += ` · for ${rule.durationDays} days`;
  } else if (rule.endDate) {
    base += ` · until ${rule.endDate}`;
  }
  return base;
}
