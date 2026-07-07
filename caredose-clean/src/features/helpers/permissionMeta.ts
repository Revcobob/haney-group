import type { HelperPermission } from '@/types/models';

export const PERMISSION_META: Record<
  HelperPermission,
  { label: string; description: string }
> = {
  viewPlan: {
    label: 'See my plan',
    description: 'View tasks, schedules, and progress',
  },
  editPlan: {
    label: 'Edit my plan',
    description: 'Change tasks and schedules',
  },
  addTasks: {
    label: 'Add tasks',
    description: 'Add new medications and care steps',
  },
  changeAlarms: {
    label: 'Change alarms',
    description: 'Adjust how reminders sound and repeat',
  },
  missedAlerts: {
    label: 'Missed-step alerts',
    description: 'Get notified when I miss a care step',
  },
  refillAlerts: {
    label: 'Refill alerts',
    description: 'Get notified when a refill is due',
  },
  dailySummary: {
    label: 'Daily summary',
    description: 'A short recap of my day each evening',
  },
};

export const ALL_PERMISSIONS = Object.keys(PERMISSION_META) as HelperPermission[];

export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Adult child',
  'Parent',
  'Friend',
  'Neighbor',
  'Professional caregiver',
] as const;
