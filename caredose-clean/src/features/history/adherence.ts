/**
 * Adherence math for the History screen: how many scheduled steps were
 * completed vs. skipped vs. missed within a date range.
 */

import type { CareTask, DoseEvent } from '@/types/models';
import { deriveStatus } from '@/utils/schedule';

export type HistoryRange = 'day' | 'week' | 'month';

export interface AdherenceSummary {
  total: number;
  done: number;
  skipped: number;
  missed: number;
  pending: number;
  /** 0–100, done / resolved events. null when nothing resolved yet. */
  percent: number | null;
}

export function rangeStart(range: HistoryRange, now: Date): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (range === 'week') start.setDate(start.getDate() - 6);
  if (range === 'month') start.setDate(start.getDate() - 29);
  return start;
}

export function summarizeAdherence(
  events: DoseEvent[],
  now: Date,
  range: HistoryRange,
): AdherenceSummary {
  const start = rangeStart(range, now);
  const inRange = events.filter((e) => {
    const due = new Date(e.dueAt);
    return due >= start && due <= now;
  });

  let done = 0;
  let skipped = 0;
  let missed = 0;
  let pending = 0;
  for (const e of inRange) {
    const s = deriveStatus(e, now);
    if (s === 'done') done++;
    else if (s === 'skipped') skipped++;
    else if (s === 'missed') missed++;
    else pending++;
  }
  const resolved = done + skipped + missed;
  return {
    total: inRange.length,
    done,
    skipped,
    missed,
    pending,
    percent: resolved === 0 ? null : Math.round((done / resolved) * 100),
  };
}

/** Events in range, newest first, joined with their task for display. */
export function eventsInRange(
  events: DoseEvent[],
  tasks: CareTask[],
  now: Date,
  range: HistoryRange,
): { event: DoseEvent; task: CareTask }[] {
  const start = rangeStart(range, now);
  const taskById = new Map(tasks.map((t) => [t.id, t]));
  return events
    .filter((e) => {
      const due = new Date(e.dueAt);
      return due >= start && due <= now;
    })
    .sort((a, b) => b.dueAt.localeCompare(a.dueAt))
    .flatMap((event) => {
      const task = taskById.get(event.taskId);
      return task ? [{ event, task }] : [];
    });
}
