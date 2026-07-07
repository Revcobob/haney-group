import { Ionicons } from '@expo/vector-icons';

import type { TaskType } from '@/types/models';

export interface TaskTypeMeta {
  label: string;
  /** Short verb phrase used on buttons and alarms ("Take", "Do", "Check"). */
  actionVerb: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/** Display metadata for every care task type. Icons are always labeled. */
export const TASK_TYPE_META: Record<TaskType, TaskTypeMeta> = {
  medication: { label: 'Medication', actionVerb: 'Taken', icon: 'medical' },
  woundCare: { label: 'Wound care', actionVerb: 'Done', icon: 'bandage' },
  dressingChange: { label: 'Dressing change', actionVerb: 'Done', icon: 'bandage-outline' },
  iceTherapy: { label: 'Ice therapy', actionVerb: 'Done', icon: 'snow' },
  walking: { label: 'Walking', actionVerb: 'Done', icon: 'walk' },
  breathing: { label: 'Breathing exercise', actionVerb: 'Done', icon: 'leaf' },
  bloodPressure: { label: 'Blood pressure check', actionVerb: 'Checked', icon: 'heart' },
  bloodSugar: { label: 'Blood sugar check', actionVerb: 'Checked', icon: 'water' },
  hydration: { label: 'Hydration', actionVerb: 'Done', icon: 'water-outline' },
  meal: { label: 'Meal', actionVerb: 'Eaten', icon: 'restaurant' },
  appointment: { label: 'Appointment', actionVerb: 'Attended', icon: 'calendar' },
  refill: { label: 'Refill reminder', actionVerb: 'Requested', icon: 'refresh-circle' },
  custom: { label: 'Custom task', actionVerb: 'Done', icon: 'checkmark-circle' },
};

/** Task types users can add through the guided non-medication flow. */
export const NON_MED_ADDABLE_TYPES: TaskType[] = [
  'woundCare',
  'dressingChange',
  'iceTherapy',
  'walking',
  'breathing',
  'bloodPressure',
  'bloodSugar',
  'hydration',
  'meal',
  'appointment',
  'refill',
  'custom',
];
