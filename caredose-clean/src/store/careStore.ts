/**
 * The central store: plans, tasks, dose events, logs, helpers, and the
 * import-review pipeline. Persisted locally with AsyncStorage.
 *
 * FUTURE: replace local persistence with a synced backend so plans, events,
 * and helper permissions are shared in real time between patient and
 * caregivers. The action surface below is intentionally shaped like an API.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  CareTask,
  ConfirmationLog,
  DoseEvent,
  Helper,
  HelperPermission,
  ImportedPlanReview,
  LogAction,
  RecoveryPlan,
  UploadedOrderDocument,
} from '@/types/models';
import { addMinutes, toDateKey } from '@/utils/dates';
import { buildEventsForDate, deriveStatus } from '@/utils/schedule';
import { makeId } from '@/utils/id';

interface CareState {
  plans: RecoveryPlan[];
  tasks: CareTask[];
  events: DoseEvent[];
  logs: ConfirmationLog[];
  helpers: Helper[];
  documents: UploadedOrderDocument[];
  pendingReview: ImportedPlanReview | null;
  /** Date key of the last day events were generated for. */
  lastEventDay: string | null;

  // Plans
  addPlan: (plan: RecoveryPlan) => void;
  updatePlan: (planId: string, patch: Partial<RecoveryPlan>) => void;
  removePlan: (planId: string) => void;

  // Tasks
  addTask: (task: CareTask) => void;
  updateTask: (taskId: string, patch: Partial<CareTask>) => void;
  removeTask: (taskId: string) => void;

  // Events
  refreshTodayEvents: () => void;
  completeEvent: (eventId: string, opts?: { helperId?: string; late?: boolean }) => void;
  skipEvent: (eventId: string, notes?: string) => void;
  snoozeEvent: (eventId: string, minutes: number) => void;
  undoEvent: (eventId: string) => void;
  logAsNeededDose: (taskId: string) => void;

  // Helpers (mocked locally — FUTURE: invites go through backend + auth)
  addHelper: (helper: Helper) => void;
  updateHelper: (helperId: string, patch: Partial<Helper>) => void;
  removeHelper: (helperId: string) => void;
  /** Record a mock "caregiver notified" entry for missed-task escalation. */
  recordCaregiverAlert: (eventId: string) => void;

  // Import pipeline
  addDocument: (doc: UploadedOrderDocument) => void;
  updateDocument: (docId: string, patch: Partial<UploadedOrderDocument>) => void;
  setPendingReview: (review: ImportedPlanReview | null) => void;
  confirmPendingReview: () => string | null;

  appendLog: (log: Omit<ConfirmationLog, 'id' | 'at'>) => void;
  resetAll: () => void;
}

/** Look up an event and its task; used by every event mutation. */
function findEventAndTask(state: CareState, eventId: string) {
  const event = state.events.find((e) => e.id === eventId);
  const task = event ? state.tasks.find((t) => t.id === event.taskId) : undefined;
  return { event, task };
}

function makeLog(
  partial: Omit<ConfirmationLog, 'id' | 'at'>,
  at = new Date(),
): ConfirmationLog {
  return { ...partial, id: makeId('log'), at: at.toISOString() };
}

const initialData = {
  plans: [] as RecoveryPlan[],
  tasks: [] as CareTask[],
  events: [] as DoseEvent[],
  logs: [] as ConfirmationLog[],
  helpers: [] as Helper[],
  documents: [] as UploadedOrderDocument[],
  pendingReview: null as ImportedPlanReview | null,
  lastEventDay: null as string | null,
};

export const useCareStore = create<CareState>()(
  persist(
    (set, get) => ({
      ...initialData,

      addPlan: (plan) => set((s) => ({ plans: [...s.plans, plan] })),

      updatePlan: (planId, patch) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === planId ? { ...p, ...patch } : p)),
        })),

      removePlan: (planId) =>
        set((s) => ({
          plans: s.plans.filter((p) => p.id !== planId),
          tasks: s.tasks.filter((t) => t.planId !== planId),
          events: s.events.filter((e) => e.planId !== planId),
        })),

      addTask: (task) => {
        set((s) => ({ tasks: [...s.tasks, task] }));
        get().refreshTodayEvents();
      },

      updateTask: (taskId, patch) => {
        const task = get().tasks.find((t) => t.id === taskId);
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        }));
        if (task) {
          get().appendLog({
            taskId,
            planId: task.planId,
            taskName: task.name,
            taskType: task.type,
            action: 'edited',
          });
        }
        get().refreshTodayEvents();
      },

      removeTask: (taskId) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== taskId),
          events: s.events.filter(
            (e) => !(e.taskId === taskId && e.status === 'scheduled'),
          ),
        })),

      /**
       * (Re)generate today's events from schedules, preserving any events the
       * user already acted on (deterministic ids make the merge safe), and log
       * "missed" entries once for doses that slipped past the missed window.
       */
      refreshTodayEvents: () => {
        const state = get();
        const now = new Date();
        const today = toDateKey(now);
        const generated = buildEventsForDate(state.tasks, state.plans, now);
        const existingById = new Map(state.events.map((e) => [e.id, e]));
        const merged = generated.map((e) => existingById.get(e.id) ?? e);
        // Keep history: retain past-day events and manual (as-needed) logs.
        const keepOld = state.events.filter(
          (e) =>
            !generated.some((g) => g.id === e.id) &&
            (!e.id.includes(`@${today}@`) || e.status !== 'scheduled' || !!e.snoozedUntil),
        );
        // Log newly-missed events exactly once.
        const alreadyMissedLogged = new Set(
          state.logs.filter((l) => l.action === 'missed').map((l) => l.eventId),
        );
        const newLogs: ConfirmationLog[] = [];
        for (const e of merged) {
          if (deriveStatus(e, now) === 'missed' && !alreadyMissedLogged.has(e.id)) {
            const task = state.tasks.find((t) => t.id === e.taskId);
            if (task) {
              newLogs.push(
                makeLog({
                  eventId: e.id,
                  taskId: task.id,
                  planId: task.planId,
                  taskName: task.name,
                  taskType: task.type,
                  action: 'missed',
                  dueAt: e.dueAt,
                }),
              );
            }
          }
        }
        set({
          events: [...keepOld, ...merged],
          lastEventDay: today,
          logs: newLogs.length ? [...state.logs, ...newLogs] : state.logs,
        });
      },

      completeEvent: (eventId, opts) => {
        const { event, task } = findEventAndTask(get(), eventId);
        if (!event || !task) return;
        const now = new Date();
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  status: 'done',
                  completedAt: now.toISOString(),
                  snoozedUntil: undefined,
                  completedByHelperId: opts?.helperId,
                }
              : e,
          ),
        }));
        const action: LogAction = opts?.late
          ? 'confirmedLate'
          : task.type === 'medication'
            ? 'taken'
            : 'done';
        get().appendLog({
          eventId,
          taskId: task.id,
          planId: task.planId,
          taskName: task.name,
          taskType: task.type,
          action,
          dueAt: event.dueAt,
          helperId: opts?.helperId,
        });
      },

      skipEvent: (eventId, notes) => {
        const { event, task } = findEventAndTask(get(), eventId);
        if (!event || !task) return;
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? { ...e, status: 'skipped', snoozedUntil: undefined, notes }
              : e,
          ),
        }));
        get().appendLog({
          eventId,
          taskId: task.id,
          planId: task.planId,
          taskName: task.name,
          taskType: task.type,
          action: 'skipped',
          dueAt: event.dueAt,
          notes,
        });
      },

      snoozeEvent: (eventId, minutes) => {
        const { event, task } = findEventAndTask(get(), eventId);
        if (!event || !task) return;
        const until = addMinutes(new Date(), minutes);
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  snoozedUntil: until.toISOString(),
                  snoozeCount: (e.snoozeCount ?? 0) + 1,
                }
              : e,
          ),
        }));
        get().appendLog({
          eventId,
          taskId: task.id,
          planId: task.planId,
          taskName: task.name,
          taskType: task.type,
          action: 'snoozed',
          dueAt: event.dueAt,
          notes: `Snoozed ${minutes} minutes`,
        });
      },

      /** Undo an accidental "Done" or "Skip" (safety feature). */
      undoEvent: (eventId) => {
        const { event, task } = findEventAndTask(get(), eventId);
        if (!event || !task) return;
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  status: 'scheduled',
                  completedAt: undefined,
                  completedByHelperId: undefined,
                }
              : e,
          ),
        }));
        get().appendLog({
          eventId,
          taskId: task.id,
          planId: task.planId,
          taskName: task.name,
          taskType: task.type,
          action: 'undone',
          dueAt: event.dueAt,
        });
      },

      /** Log a dose of an as-needed (PRN) task taken right now. */
      logAsNeededDose: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const now = new Date();
        const event: DoseEvent = {
          id: makeId('prn'),
          taskId: task.id,
          planId: task.planId,
          dueAt: now.toISOString(),
          status: 'done',
          completedAt: now.toISOString(),
        };
        set((s) => ({ events: [...s.events, event] }));
        get().appendLog({
          eventId: event.id,
          taskId: task.id,
          planId: task.planId,
          taskName: task.name,
          taskType: task.type,
          action: task.type === 'medication' ? 'taken' : 'done',
          dueAt: event.dueAt,
        });
      },

      addHelper: (helper) => set((s) => ({ helpers: [...s.helpers, helper] })),

      updateHelper: (helperId, patch) =>
        set((s) => ({
          helpers: s.helpers.map((h) =>
            h.id === helperId ? { ...h, ...patch } : h,
          ),
        })),

      removeHelper: (helperId) =>
        set((s) => ({ helpers: s.helpers.filter((h) => h.id !== helperId) })),

      /**
       * MOCK caregiver escalation: records that a helper was alerted about a
       * missed task. FUTURE: send a real push notification / SMS via backend
       * to every active helper with the 'missedAlerts' permission.
       */
      recordCaregiverAlert: (eventId) => {
        const state = get();
        const { event, task } = findEventAndTask(state, eventId);
        if (!event || !task || !task.alarm.alertCaregiverIfMissed) return;
        const recipients = state.helpers.filter(
          (h) => h.status === 'active' && h.permissions.includes('missedAlerts'),
        );
        if (recipients.length === 0) return;
        const already = state.logs.some(
          (l) => l.action === 'caregiverAlerted' && l.eventId === eventId,
        );
        if (already) return;
        for (const helper of recipients) {
          get().appendLog({
            eventId,
            taskId: task.id,
            planId: task.planId,
            taskName: task.name,
            taskType: task.type,
            action: 'caregiverAlerted',
            dueAt: event.dueAt,
            helperId: helper.id,
            notes: `${helper.name} was notified (mock)`,
          });
        }
      },

      addDocument: (doc) => set((s) => ({ documents: [doc, ...s.documents] })),

      updateDocument: (docId, patch) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === docId ? { ...d, ...patch } : d,
          ),
        })),

      setPendingReview: (pendingReview) => set({ pendingReview }),

      /**
       * Activate a reviewed import: creates the plan + included tasks.
       * Only callable from the review screen after explicit confirmation.
       * Returns the new plan id.
       */
      confirmPendingReview: () => {
        const review = get().pendingReview;
        if (!review) return null;
        const now = new Date();
        const planId = makeId('plan');
        const plan: RecoveryPlan = {
          id: planId,
          name: review.planName.trim() || 'Imported Recovery Plan',
          description: review.planDescription,
          icon: 'document-text',
          status: 'active',
          source: 'imported',
          createdAt: now.toISOString(),
          startDate: toDateKey(now),
        };
        const tasks: CareTask[] = review.drafts
          .filter((d) => d.include)
          .map((d) => ({
            id: makeId('task'),
            planId,
            name: d.name.trim() || 'Care task',
            type: d.type,
            instructions: d.instructions,
            schedule: d.schedule,
            alarm: { ...useCareStoreDefaults.alarm },
            medication: d.medication,
            createdAt: now.toISOString(),
          }));
        set((s) => ({
          plans: [...s.plans, plan],
          tasks: [...s.tasks, ...tasks],
          pendingReview: null,
        }));
        get().appendLog({
          planId,
          taskName: plan.name,
          taskType: 'custom',
          action: 'edited',
          notes: `Imported plan confirmed with ${tasks.length} tasks after review`,
        });
        get().refreshTodayEvents();
        return planId;
      },

      appendLog: (log) => set((s) => ({ logs: [...s.logs, makeLog(log)] })),

      resetAll: () => set({ ...initialData }),
    }),
    {
      name: 'caredose-care',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * Default alarm used for imported tasks. Kept here (not settingsStore) to
 * avoid a store cycle; the review screen surfaces that alarms can be changed
 * per task afterwards.
 */
export const useCareStoreDefaults = {
  alarm: {
    sound: true,
    voice: false,
    vibration: true,
    fullScreen: true,
    flashing: false,
    repeatEveryMinutes: 10,
    alertCaregiverIfMissed: false,
    critical: false,
  },
};
