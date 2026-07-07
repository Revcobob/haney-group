import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { IconBubble } from '@/components/ui/IconBubble';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AlarmPrefsFields } from '@/features/alarms/AlarmPrefsFields';
import { ScheduleBuilder } from '@/features/tasks/ScheduleBuilder';
import { NON_MED_ADDABLE_TYPES, TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { AlarmPreference, ScheduleRule, TaskType } from '@/types/models';
import { todayKey } from '@/utils/dates';
import { makeId } from '@/utils/id';

/** Sensible starting points per task type so most fields come pre-filled. */
const TYPE_DEFAULTS: Partial<
  Record<TaskType, { name: string; instructions: string; durationMinutes?: number }>
> = {
  woundCare: {
    name: 'Wound care',
    instructions: 'Wash hands, check the wound for redness or swelling, and follow your care sheet.',
  },
  dressingChange: {
    name: 'Change dressing',
    instructions: 'Wash hands, remove the old dressing gently, and apply a fresh one.',
  },
  iceTherapy: {
    name: 'Ice therapy',
    instructions: 'Apply the ice pack with a cloth between ice and skin.',
    durationMinutes: 20,
  },
  walking: {
    name: 'Short walk',
    instructions: 'Walk at an easy pace. Use your walker or cane if you have one.',
    durationMinutes: 5,
  },
  breathing: {
    name: 'Breathing exercises',
    instructions: 'Take 10 slow, deep breaths. Use your spirometer if you have one.',
    durationMinutes: 5,
  },
  bloodPressure: {
    name: 'Blood pressure check',
    instructions: 'Sit quietly for 5 minutes first, then record your reading.',
  },
  bloodSugar: {
    name: 'Blood sugar check',
    instructions: 'Check your blood sugar and write down the number.',
  },
  hydration: {
    name: 'Drink water',
    instructions: 'Drink a full glass of water.',
  },
  meal: {
    name: 'Meal reminder',
    instructions: 'Time to eat. Choose soft foods if your instructions say so.',
  },
  appointment: {
    name: 'Appointment',
    instructions: 'Bring your medication list and any questions.',
  },
  refill: {
    name: 'Refill reminder',
    instructions: 'Call your pharmacy to request the refill.',
  },
  custom: {
    name: '',
    instructions: '',
  },
};

interface TaskFormValues {
  name: string;
  instructions: string;
  durationMinutes: string;
  notes: string;
}

/**
 * Guided flow for every non-medication care task. Step 1 picks the type
 * (big labeled buttons); step 2 is a pre-filled plain-language form.
 */
export default function AddTaskScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const allPlans = useCareStore((s) => s.plans);
  const plans = allPlans.filter((p) => p.status === 'active');
  const addTask = useCareStore((s) => s.addTask);
  const defaultAlarm = useSettingsStore((s) => s.defaultAlarm);
  const targetPlanId = planId ?? plans[0]?.id;

  const [type, setType] = useState<TaskType | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRule>({
    kind: 'fixedTimes',
    times: ['09:00'],
    startDate: todayKey(),
    durationDays: 7,
  });
  const [alarm, setAlarm] = useState<AlarmPreference>({ ...defaultAlarm });

  const { control, handleSubmit, reset, formState } = useForm<TaskFormValues>({
    defaultValues: { name: '', instructions: '', durationMinutes: '', notes: '' },
  });

  if (!targetPlanId) {
    return (
      <Screen title="Add care task" showBack>
        <Card tint={colors.warningSoft}>
          <AppText variant="body" weight="semibold" color={colors.warning}>
            You need an active Recovery Plan first.
          </AppText>
          <View style={{ marginTop: spacing.md }}>
            <Button label="Create a plan" onPress={() => router.replace('/add-plan')} />
          </View>
        </Card>
      </Screen>
    );
  }

  // Step 1: pick the type of care task.
  if (!type) {
    return (
      <Screen title="Add care task" subtitle="What kind of step is this?" showBack>
        <View style={styles.grid}>
          {NON_MED_ADDABLE_TYPES.map((t) => {
            const meta = TASK_TYPE_META[t];
            return (
              <Pressable
                key={t}
                onPress={() => {
                  const d = TYPE_DEFAULTS[t];
                  reset({
                    name: d?.name ?? '',
                    instructions: d?.instructions ?? '',
                    durationMinutes: d?.durationMinutes ? String(d.durationMinutes) : '',
                    notes: '',
                  });
                  if (t === 'appointment' || t === 'refill') {
                    setSchedule({
                      kind: 'fixedTimes',
                      times: ['10:00'],
                      startDate: todayKey(),
                      endDate: todayKey(),
                    });
                  }
                  setType(t);
                }}
                accessibilityRole="button"
                accessibilityLabel={meta.label}
                style={({ pressed }) => [
                  styles.typeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <IconBubble icon={meta.icon} color={colors.accent} background={colors.accentSoft} size={52} />
                <AppText variant="label" weight="semibold" center style={{ marginTop: spacing.sm }}>
                  {meta.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Screen>
    );
  }

  const meta = TASK_TYPE_META[type];
  const isOneTime = type === 'appointment' || type === 'refill';

  const onSubmit = (values: TaskFormValues) => {
    addTask({
      id: makeId('task'),
      planId: targetPlanId,
      name: values.name.trim() || meta.label,
      type,
      instructions: values.instructions.trim(),
      durationMinutes: values.durationMinutes.trim()
        ? Number(values.durationMinutes)
        : undefined,
      schedule,
      alarm,
      notes: values.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <Screen title={meta.label} subtitle="Fill in what applies — you can change anything later" showBack>
      <Button
        label="Choose a different type"
        variant="ghost"
        size="md"
        onPress={() => setType(null)}
      />
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Please give this task a name.' }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Task name"
            required
            value={value}
            onChangeText={onChange}
            placeholder={meta.label}
            error={formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="instructions"
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Instructions"
            hint="Shown on every reminder — plain words work best"
            value={value}
            onChangeText={onChange}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
        )}
      />
      <Controller
        control={control}
        name="durationMinutes"
        rules={{
          validate: (v) =>
            !v.trim() || /^\d+$/.test(v.trim()) || 'Please enter a whole number of minutes.',
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="How long does it take? (minutes, optional)"
            placeholder="For example: 20"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            error={formState.errors.durationMinutes?.message}
          />
        )}
      />

      <SectionHeader title={isOneTime ? 'When is it?' : 'When should it happen?'} />
      <ScheduleBuilder value={schedule} onChange={setSchedule} allowAsNeeded={!isOneTime} />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Private notes (optional)"
            value={value}
            onChangeText={onChange}
            multiline
            style={{ minHeight: 70, textAlignVertical: 'top' }}
          />
        )}
      />

      <SectionHeader title="Alarm style" />
      <Card>
        <AlarmPrefsFields value={alarm} onChange={setAlarm} />
      </Card>

      <View style={{ marginTop: spacing.xl }}>
        <Button label="Save task" icon="checkmark-circle" size="xl" onPress={handleSubmit(onSubmit)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  typeCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 22,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 120,
  },
});
