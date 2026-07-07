/**
 * Dependency-free date helpers. All user-facing formats use plain,
 * unambiguous language (e.g. "8:00 AM", "Monday, July 7").
 */

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "YYYY-MM-DD" for a local date. */
export function toDateKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** Parse "YYYY-MM-DD" into a local Date at midnight. */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Combine a "YYYY-MM-DD" date key with an "HH:mm" time into a local Date. */
export function dateAtTime(dateKey: string, time: string): Date {
  const d = fromDateKey(dateKey);
  const [h, min] = time.split(':').map(Number);
  d.setHours(h ?? 0, min ?? 0, 0, 0);
  return d;
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000);
}

export function minutesBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60_000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "8:00 AM" */
export function formatTime(d: Date): string {
  let h = d.getHours();
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const m = `${d.getMinutes()}`.padStart(2, '0');
  return `${h}:${m} ${suffix}`;
}

/** "8:00 AM" from an "HH:mm" string. */
export function formatTimeString(time: string): string {
  return formatTime(dateAtTime(todayKey(), time));
}

/** "Monday, July 7" */
export function formatLongDate(d: Date): string {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

/** "July 7" */
export function formatShortDate(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

/** "Mon, Jul 7" */
export function formatCompactDate(d: Date): string {
  return `${DAY_NAMES[d.getDay()].slice(0, 3)}, ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

/** Plain-language countdown: "in 2 hr 15 min", "in 3 min", "due now". */
export function formatCountdown(now: Date, dueAt: Date): string {
  const mins = minutesBetween(now, dueAt);
  if (mins <= 0) return 'now';
  if (mins < 60) return `in ${mins} min`;
  const h = Math.floor(mins / 60);
  const rem = mins % 60;
  if (rem === 0) return `in ${h} ${h === 1 ? 'hour' : 'hours'}`;
  return `in ${h} hr ${rem} min`;
}

/** Plain-language overdue text: "35 min overdue", "2 hr overdue". */
export function formatOverdue(now: Date, dueAt: Date): string {
  const mins = minutesBetween(dueAt, now);
  if (mins < 60) return `${mins} min overdue`;
  const h = Math.floor(mins / 60);
  return `${h} ${h === 1 ? 'hour' : 'hours'} overdue`;
}

/** Greeting for the Home header. */
export function greetingFor(d: Date, name?: string): string {
  const h = d.getHours();
  let base: string;
  if (h < 12) base = 'Good morning';
  else if (h < 17) base = 'Good afternoon';
  else base = 'Good evening';
  return name ? `${base}, ${name}` : base;
}

/** Validate an "HH:mm" 24-hour string. */
export function isValidTimeString(t: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(t.trim());
}

/** Validate a "YYYY-MM-DD" string. */
export function isValidDateKey(t: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.trim())) return false;
  const d = fromDateKey(t.trim());
  return !Number.isNaN(d.getTime());
}
