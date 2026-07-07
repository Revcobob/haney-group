/**
 * Sample "Knee Surgery Recovery" plan used for onboarding demos and empty
 * installs. Includes a couple of days of realistic history so the History
 * screen has something to show.
 */

import { DEFAULT_ALARM, useSettingsStore } from '@/store/settingsStore';
import { useCareStore } from '@/store/careStore';
import type {
  AlarmPreference,
  CareTask,
  DoseEvent,
  Helper,
  RecoveryPlan,
} from '@/types/models';
import { addDays, toDateKey } from '@/utils/dates';
import { buildEventsForDate, eventIdFor } from '@/utils/schedule';
import { makeId, makeInviteCode } from '@/utils/id';

function alarm(patch: Partial<AlarmPreference> = {}): AlarmPreference {
  return { ...DEFAULT_ALARM, ...patch };
}

export function seedSamplePlan(): string {
  const store = useCareStore.getState();
  const now = new Date();
  const start = addDays(now, -2);
  const startKey = toDateKey(start);

  const planId = makeId('plan');
  const plan: RecoveryPlan = {
    id: planId,
    name: 'Knee Surgery Recovery',
    description:
      'Post-operative care plan for the first two weeks after knee surgery.',
    icon: 'walk',
    status: 'active',
    source: 'sample',
    createdAt: now.toISOString(),
    startDate: startKey,
    endDate: toDateKey(addDays(start, 13)),
  };

  const mk = (t: Omit<CareTask, 'id' | 'planId' | 'createdAt'>): CareTask => ({
    ...t,
    id: makeId('task'),
    planId,
    createdAt: now.toISOString(),
  });

  const tasks: CareTask[] = [
    mk({
      name: 'Pain medication',
      type: 'medication',
      instructions:
        'Take 1 tablet with food. Do not drive or use machinery afterwards.',
      schedule: {
        kind: 'interval',
        everyHours: 6,
        windowStart: '07:00',
        windowEnd: '23:00',
        startDate: startKey,
        durationDays: 7,
      },
      alarm: alarm({ voice: true, alertCaregiverIfMissed: true, critical: true }),
      medication: {
        brandName: 'Norco',
        genericName: 'Hydrocodone / Acetaminophen',
        dose: '1 tablet',
        strength: '5-325 mg',
        takeWithFood: true,
        takeWithWater: true,
        avoidAlcohol: true,
        doNotDrive: true,
        prescribingPhysician: 'Dr. Patel',
        pharmacy: 'Main Street Pharmacy',
        prescriptionNumber: 'RX-482915',
        refillsRemaining: 1,
      },
    }),
    mk({
      name: 'Antibiotic',
      type: 'medication',
      instructions:
        'Take 1 capsule with a full glass of water. Finish the entire 10-day course even if you feel better.',
      schedule: {
        kind: 'fixedTimes',
        times: ['08:00', '14:00', '20:00'],
        startDate: startKey,
        durationDays: 10,
      },
      alarm: alarm({ alertCaregiverIfMissed: true, critical: true }),
      medication: {
        brandName: 'Keflex',
        genericName: 'Cephalexin',
        dose: '1 capsule',
        strength: '500 mg',
        takeWithWater: true,
        prescribingPhysician: 'Dr. Patel',
        pharmacy: 'Main Street Pharmacy',
        prescriptionNumber: 'RX-482916',
        refillsRemaining: 0,
      },
    }),
    mk({
      name: 'Blood thinner',
      type: 'medication',
      instructions: 'Take 1 low-dose aspirin with breakfast to prevent blood clots.',
      schedule: {
        kind: 'fixedTimes',
        times: ['09:00'],
        startDate: startKey,
        durationDays: 14,
      },
      alarm: alarm(),
      medication: {
        genericName: 'Aspirin (low dose)',
        dose: '1 tablet',
        strength: '81 mg',
        takeWithFood: true,
      },
    }),
    mk({
      name: 'Ice your knee',
      type: 'iceTherapy',
      instructions:
        'Place the ice pack over the dressing for 20 minutes. Keep a cloth between ice and skin.',
      durationMinutes: 20,
      schedule: {
        kind: 'fixedTimes',
        times: ['10:00', '15:00', '19:00'],
        startDate: startKey,
        durationDays: 7,
      },
      alarm: alarm({ sound: false }),
    }),
    mk({
      name: 'Short walk',
      type: 'walking',
      instructions:
        'Walk for about 5 minutes using your walker or crutches. Stop if you feel dizzy.',
      durationMinutes: 5,
      schedule: {
        kind: 'interval',
        everyHours: 3,
        windowStart: '09:00',
        windowEnd: '18:00',
        startDate: startKey,
        durationDays: 14,
      },
      alarm: alarm({ sound: false, vibration: true }),
    }),
    mk({
      name: 'Breathing exercises',
      type: 'breathing',
      instructions:
        'Take 10 slow, deep breaths using your spirometer to keep your lungs clear.',
      durationMinutes: 5,
      schedule: {
        kind: 'fixedTimes',
        times: ['08:30', '13:30', '20:30'],
        startDate: startKey,
        durationDays: 7,
      },
      alarm: alarm({ sound: false }),
    }),
    mk({
      name: 'Check incision & change dressing',
      type: 'woundCare',
      instructions:
        'Wash hands first. Remove the old dressing, check for redness, swelling, or discharge, then apply a fresh dressing. Call your doctor if it looks worse.',
      schedule: {
        kind: 'fixedTimes',
        times: ['09:30'],
        startDate: startKey,
        durationDays: 14,
      },
      alarm: alarm({ voice: true }),
    }),
    mk({
      name: 'Blood pressure check',
      type: 'bloodPressure',
      instructions:
        'Sit quietly for 5 minutes, then take your blood pressure and write it in your notes.',
      schedule: {
        kind: 'fixedTimes',
        times: ['08:15'],
        startDate: startKey,
        durationDays: 14,
      },
      alarm: alarm({ sound: false }),
    }),
    mk({
      name: 'Follow-up with Dr. Patel',
      type: 'appointment',
      instructions:
        'Post-op check at Northside Orthopedics, 450 Medical Plaza, Suite 210. Bring your medication list.',
      schedule: {
        kind: 'fixedTimes',
        times: ['10:30'],
        startDate: toDateKey(addDays(start, 10)),
        endDate: toDateKey(addDays(start, 10)),
      },
      alarm: alarm({ voice: true }),
    }),
    mk({
      name: 'Refill pain medication',
      type: 'refill',
      instructions:
        'Call Main Street Pharmacy (555-0134) to refill Norco. 1 refill remaining on RX-482915.',
      schedule: {
        kind: 'fixedTimes',
        times: ['09:00'],
        startDate: toDateKey(addDays(start, 5)),
        endDate: toDateKey(addDays(start, 5)),
      },
      alarm: alarm(),
    }),
  ];

  const helper: Helper = {
    id: makeId('helper'),
    name: 'Sarah Miller',
    relationship: 'Daughter',
    status: 'active',
    inviteCode: makeInviteCode(),
    permissions: ['viewPlan', 'missedAlerts', 'refillAlerts', 'dailySummary'],
    invitedAt: addDays(now, -2).toISOString(),
    acceptedAt: addDays(now, -2).toISOString(),
    contact: '555-0192',
  };

  store.addPlan(plan);
  for (const t of tasks) {
    useCareStore.setState((s) => ({ tasks: [...s.tasks, t] }));
  }
  store.addHelper(helper);

  seedHistory(plan, tasks);
  store.refreshTodayEvents();
  return planId;
}

/** Generate the previous two days of events with a realistic done/missed mix. */
function seedHistory(plan: RecoveryPlan, tasks: CareTask[]) {
  const store = useCareStore.getState();
  const now = new Date();
  const pastEvents: DoseEvent[] = [];

  for (const daysAgo of [2, 1]) {
    const day = addDays(now, -daysAgo);
    const dayEvents = buildEventsForDate(tasks, [plan], day);
    dayEvents.forEach((e, i) => {
      const task = tasks.find((t) => t.id === e.taskId);
      if (!task) return;
      // Complete most, skip one walk, leave one ice session missed.
      const missed = task.type === 'iceTherapy' && i % 5 === 0;
      const skipped = task.type === 'walking' && i % 7 === 0;
      if (missed) {
        pastEvents.push(e);
        store.appendLog({
          eventId: e.id,
          taskId: task.id,
          planId: plan.id,
          taskName: task.name,
          taskType: task.type,
          action: 'missed',
          dueAt: e.dueAt,
        });
      } else if (skipped) {
        pastEvents.push({ ...e, status: 'skipped', notes: 'Felt too sore' });
        store.appendLog({
          eventId: e.id,
          taskId: task.id,
          planId: plan.id,
          taskName: task.name,
          taskType: task.type,
          action: 'skipped',
          dueAt: e.dueAt,
          notes: 'Felt too sore',
        });
      } else {
        const completedAt = new Date(new Date(e.dueAt).getTime() + 8 * 60_000);
        pastEvents.push({ ...e, status: 'done', completedAt: completedAt.toISOString() });
        store.appendLog({
          eventId: e.id,
          taskId: task.id,
          planId: plan.id,
          taskName: task.name,
          taskType: task.type,
          action: task.type === 'medication' ? 'taken' : 'done',
          dueAt: e.dueAt,
        });
      }
    });
  }

  useCareStore.setState((s) => ({ events: [...s.events, ...pastEvents] }));
}

/** Seed a default user name if none set (used by the sample-plan path). */
export function ensureSampleUserName() {
  const settings = useSettingsStore.getState();
  if (!settings.userName) settings.setUserName('Margaret');
}

// Re-export so seed consumers don't need the raw id helper.
export { eventIdFor };
