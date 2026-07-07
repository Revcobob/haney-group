/**
 * CareDose core data models.
 *
 * These models are designed to be backend-ready: every entity has a stable
 * string id and ISO-8601 timestamps so records can later be synced to a
 * server (see comments marked FUTURE throughout the codebase).
 */

export type ID = string;

/** All care task types CareDose supports. */
export type TaskType =
  | 'medication'
  | 'woundCare'
  | 'dressingChange'
  | 'iceTherapy'
  | 'walking'
  | 'breathing'
  | 'bloodPressure'
  | 'bloodSugar'
  | 'hydration'
  | 'meal'
  | 'appointment'
  | 'refill'
  | 'custom';

/**
 * When a task should happen.
 * - `fixedTimes`: at specific clock times each scheduled day (e.g. 08:00, 20:00)
 * - `interval`:   every N hours within a daily window (e.g. every 6 hours, 7am–11pm)
 * - `asNeeded`:   no automatic reminders; user logs it manually (PRN medications)
 */
export interface ScheduleRule {
  kind: 'fixedTimes' | 'interval' | 'asNeeded';
  /** "HH:mm" 24-hour strings, used when kind === 'fixedTimes'. */
  times?: string[];
  /** Hours between occurrences, used when kind === 'interval'. */
  everyHours?: number;
  /** Daily window start "HH:mm" for interval schedules. Defaults to 08:00. */
  windowStart?: string;
  /** Daily window end "HH:mm" for interval schedules. Defaults to 22:00. */
  windowEnd?: string;
  /** 0 (Sunday) – 6 (Saturday). Omitted = every day. */
  daysOfWeek?: number[];
  /** ISO date "YYYY-MM-DD". */
  startDate: string;
  /** ISO date "YYYY-MM-DD" (inclusive). Wins over durationDays if both set. */
  endDate?: string;
  /** Course length in days from startDate (e.g. a 10-day antibiotic course). */
  durationDays?: number;
}

/** How the user wants to be alerted for a task. */
export interface AlarmPreference {
  sound: boolean;
  /** Speak the reminder out loud (helps users with limited vision). */
  voice: boolean;
  vibration: boolean;
  /** Take over the screen with a large, unmissable alert. */
  fullScreen: boolean;
  /** Pulse/flash the alarm screen (disabled automatically by Reduce Motion). */
  flashing: boolean;
  /** Re-alert every N minutes until confirmed. null = alert once. */
  repeatEveryMinutes: number | null;
  /** Notify caregivers with the "missed alerts" permission when missed. */
  alertCaregiverIfMissed: boolean;
  /**
   * Critical task: reminders should be as loud and persistent as possible.
   * FUTURE: use iOS Critical Alerts entitlement / Android full-screen intent
   * so critical reminders bypass Do Not Disturb.
   */
  critical: boolean;
}

/** Medication-specific details attached to a CareTask of type 'medication'. */
export interface MedicationDetails {
  brandName?: string;
  genericName?: string;
  /** What the user takes each time, e.g. "1 tablet" or "2 capsules". */
  dose: string;
  /** Strength of each unit, e.g. "500 mg". */
  strength?: string;
  takeWithFood?: boolean;
  takeWithWater?: boolean;
  avoidAlcohol?: boolean;
  doNotDrive?: boolean;
  prescribingPhysician?: string;
  pharmacy?: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  /** Local photo of the pill bottle / pill, shown on alarms. */
  pillPhotoUri?: string;
}

/** A single care step inside a Recovery Plan. */
export interface CareTask {
  id: ID;
  planId: ID;
  name: string;
  type: TaskType;
  /** Plain-language instructions shown on reminders. */
  instructions: string;
  /** For timed activities (ice 20 min, walk 5 min, breathing 10 breaths...). */
  durationMinutes?: number;
  schedule: ScheduleRule;
  alarm: AlarmPreference;
  medication?: MedicationDetails;
  /** Optional illustrative image (wound photo reference, device photo...). */
  imageUri?: string;
  notes?: string;
  createdAt: string;
  archived?: boolean;
}

export type PlanStatus = 'active' | 'pendingReview' | 'completed' | 'archived';

/** A Recovery Plan groups the care tasks for one course of care. */
export interface RecoveryPlan {
  id: ID;
  name: string;
  description?: string;
  /** Ionicons icon name used on cards. */
  icon?: string;
  status: PlanStatus;
  source: 'manual' | 'imported' | 'sample';
  createdAt: string;
  startDate: string;
  endDate?: string;
}

/**
 * A concrete occurrence of a task ("take Cephalexin at 8:00 AM on July 7").
 * Raw status is minimal; display states like "due now" / "missed" are derived
 * from `dueAt` + the current time (see utils/schedule.ts).
 */
export type DoseEventStatus = 'scheduled' | 'done' | 'skipped';

export interface DoseEvent {
  id: ID;
  taskId: ID;
  planId: ID;
  /** ISO datetime the occurrence is due. */
  dueAt: string;
  status: DoseEventStatus;
  completedAt?: string;
  snoozedUntil?: string;
  snoozeCount?: number;
  notes?: string;
  /** Set when a helper (caregiver) confirmed the step on the user's behalf. */
  completedByHelperId?: ID;
}

export type LogAction =
  | 'done'
  | 'taken'
  | 'skipped'
  | 'snoozed'
  | 'missed'
  | 'edited'
  | 'confirmedLate'
  | 'undone'
  | 'caregiverAlerted';

/** Immutable audit trail entry for the History screen and care reports. */
export interface ConfirmationLog {
  id: ID;
  eventId?: ID;
  taskId?: ID;
  planId?: ID;
  taskName: string;
  taskType: TaskType;
  action: LogAction;
  /** When the step was originally due, if applicable. */
  dueAt?: string;
  /** When the action happened. */
  at: string;
  notes?: string;
  /** Helper involved, if a caregiver performed or received the action. */
  helperId?: ID;
}

export type HelperPermission =
  | 'viewPlan'
  | 'editPlan'
  | 'addTasks'
  | 'changeAlarms'
  | 'missedAlerts'
  | 'refillAlerts'
  | 'dailySummary';

/** A trusted person invited to help follow the plan. */
export interface Helper {
  id: ID;
  name: string;
  relationship: string;
  status: 'invited' | 'active' | 'removed';
  /** Short code the helper enters to accept the invite (mocked locally). */
  inviteCode: string;
  permissions: HelperPermission[];
  invitedAt: string;
  acceptedAt?: string;
  /** Phone or email, used for the Need Help screen. */
  contact?: string;
}

export interface EmergencyContact {
  name: string;
  relationship?: string;
  phone: string;
}

/** A photo/PDF of discharge papers or prescriptions the user uploaded. */
export interface UploadedOrderDocument {
  id: ID;
  kind: 'photo' | 'pdf' | 'image';
  label: string;
  uri?: string;
  uploadedAt: string;
  status: 'processing' | 'extracted' | 'failed';
}

/** One extracted item awaiting review. Nothing activates until confirmed. */
export interface ImportedTaskDraft {
  id: ID;
  /** Whether the user wants to keep this item when confirming. */
  include: boolean;
  name: string;
  type: TaskType;
  instructions: string;
  /** Human-readable summary of the proposed schedule, shown for review. */
  scheduleSummary: string;
  schedule: ScheduleRule;
  medication?: MedicationDetails;
  /** Extraction caveats the user must double-check. */
  warnings?: string[];
}

/** The editable review produced from an uploaded document. */
export interface ImportedPlanReview {
  id: ID;
  documentId: ID;
  planName: string;
  planDescription?: string;
  extractedAt: string;
  drafts: ImportedTaskDraft[];
  /** Document-level warnings (unreadable sections, verify-with-doctor notes). */
  warningNotes: string[];
  status: 'needsReview' | 'confirmed' | 'discarded';
}

/** The account owner. FUTURE: replace with authenticated profile from backend. */
export interface User {
  id: ID;
  name: string;
  createdAt: string;
}
