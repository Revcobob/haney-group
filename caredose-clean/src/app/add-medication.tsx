import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { AlarmPrefsFields } from '@/features/alarms/AlarmPrefsFields';
import { ScheduleBuilder } from '@/features/tasks/ScheduleBuilder';
import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { AlarmPreference, ScheduleRule } from '@/types/models';
import { todayKey } from '@/utils/dates';
import { makeId } from '@/utils/id';

interface MedFormValues {
  name: string;
  brandName: string;
  genericName: string;
  dose: string;
  strength: string;
  physician: string;
  pharmacy: string;
  prescriptionNumber: string;
  refillsRemaining: string;
  instructions: string;
  notes: string;
}

/**
 * Guided medication setup. Uses React Hook Form for text fields; schedule and
 * alarm preferences use the shared chip-based builders.
 */
export default function AddMedicationScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const allPlans = useCareStore((s) => s.plans);
  const plans = allPlans.filter((p) => p.status === 'active');
  const tasks = useCareStore((s) => s.tasks);
  const addTask = useCareStore((s) => s.addTask);
  const defaultAlarm = useSettingsStore((s) => s.defaultAlarm);

  const targetPlanId = planId ?? plans[0]?.id;

  const { control, handleSubmit, formState } = useForm<MedFormValues>({
    defaultValues: {
      name: '',
      brandName: '',
      genericName: '',
      dose: '',
      strength: '',
      physician: '',
      pharmacy: '',
      prescriptionNumber: '',
      refillsRemaining: '',
      instructions: '',
      notes: '',
    },
  });

  const [schedule, setSchedule] = useState<ScheduleRule>({
    kind: 'fixedTimes',
    times: ['08:00'],
    startDate: todayKey(),
    durationDays: 7,
  });
  const [alarm, setAlarm] = useState<AlarmPreference>({ ...defaultAlarm });
  const [takeWithFood, setTakeWithFood] = useState(false);
  const [takeWithWater, setTakeWithWater] = useState(true);
  const [avoidAlcohol, setAvoidAlcohol] = useState(false);
  const [doNotDrive, setDoNotDrive] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  // Error state: no active plan to attach the medication to.
  if (!targetPlanId) {
    return (
      <Screen title="Add medication" showBack>
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

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch {
      // Camera unavailable (simulator/web): fall back to the photo library.
      try {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
        if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
      } catch {
        Alert.alert('Camera not available', 'You can add a photo later from the task page.');
      }
    }
  };

  const onSubmit = (values: MedFormValues) => {
    const save = () => {
      addTask({
        id: makeId('task'),
        planId: targetPlanId,
        name: values.name.trim(),
        type: 'medication',
        instructions:
          values.instructions.trim() ||
          `Take ${values.dose.trim() || 'your dose'}${takeWithFood ? ' with food' : ''}.`,
        schedule,
        alarm,
        medication: {
          brandName: values.brandName.trim() || undefined,
          genericName: values.genericName.trim() || undefined,
          dose: values.dose.trim() || '1 dose',
          strength: values.strength.trim() || undefined,
          takeWithFood,
          takeWithWater,
          avoidAlcohol,
          doNotDrive,
          prescribingPhysician: values.physician.trim() || undefined,
          pharmacy: values.pharmacy.trim() || undefined,
          prescriptionNumber: values.prescriptionNumber.trim() || undefined,
          refillsRemaining: values.refillsRemaining.trim()
            ? Number(values.refillsRemaining)
            : undefined,
          pillPhotoUri: photoUri,
        },
        notes: values.notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
      router.back();
    };

    // Safety: duplicate medication warning.
    const duplicate = tasks.find(
      (t) =>
        t.type === 'medication' &&
        !t.archived &&
        t.name.trim().toLowerCase() === values.name.trim().toLowerCase(),
    );
    if (duplicate) {
      Alert.alert(
        'Possible duplicate medication',
        `You already have "${duplicate.name}" in a plan. Adding it twice could lead to double doses. Add it anyway?`,
        [
          { text: 'No, go back', style: 'cancel' },
          { text: 'Yes, add it', style: 'destructive', onPress: save },
        ],
      );
      return;
    }
    save();
  };

  return (
    <Screen title="Add medication" subtitle="Copy this from the bottle or your discharge papers" showBack>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Please enter the medication name.' }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Medication name"
            required
            hint="As written on the bottle"
            placeholder="For example: Cephalexin"
            value={value}
            onChangeText={onChange}
            error={formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="brandName"
        render={({ field: { onChange, value } }) => (
          <FormField label="Brand name (optional)" placeholder="For example: Keflex" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="genericName"
        render={({ field: { onChange, value } }) => (
          <FormField label="Generic name (optional)" placeholder="For example: Cephalexin" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="dose"
        rules={{ required: 'Please enter how much you take each time.' }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Dose"
            required
            hint="How much you take each time"
            placeholder="For example: 1 tablet"
            value={value}
            onChangeText={onChange}
            error={formState.errors.dose?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="strength"
        render={({ field: { onChange, value } }) => (
          <FormField label="Strength (optional)" placeholder="For example: 500 mg" value={value} onChangeText={onChange} />
        )}
      />

      <SectionHeader title="When to take it" />
      <ScheduleBuilder value={schedule} onChange={setSchedule} />

      <SectionHeader title="Important flags" />
      <Card>
        <SwitchRow label="Take with food" value={takeWithFood} onValueChange={setTakeWithFood} />
        <SwitchRow label="Take with water" value={takeWithWater} onValueChange={setTakeWithWater} />
        <SwitchRow label="Avoid alcohol" value={avoidAlcohol} onValueChange={setAvoidAlcohol} />
        <SwitchRow label="Do not drive after taking" value={doNotDrive} onValueChange={setDoNotDrive} />
      </Card>

      <SectionHeader title="Pharmacy & refills" />
      <Controller
        control={control}
        name="physician"
        render={({ field: { onChange, value } }) => (
          <FormField label="Prescribing doctor (optional)" placeholder="For example: Dr. Patel" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="pharmacy"
        render={({ field: { onChange, value } }) => (
          <FormField label="Pharmacy (optional)" placeholder="For example: Main Street Pharmacy" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="prescriptionNumber"
        render={({ field: { onChange, value } }) => (
          <FormField label="Prescription number (optional)" placeholder="RX-000000" value={value} onChangeText={onChange} autoCapitalize="characters" />
        )}
      />
      <Controller
        control={control}
        name="refillsRemaining"
        rules={{
          validate: (v) =>
            !v.trim() || /^\d+$/.test(v.trim()) || 'Please enter a whole number.',
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Refills remaining (optional)"
            placeholder="For example: 2"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            error={formState.errors.refillsRemaining?.message}
          />
        )}
      />

      <SectionHeader title="Photo of the bottle (optional)" />
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 180, borderRadius: 16, marginBottom: spacing.md }}
          accessible
          accessibilityLabel="Photo of the pill bottle"
        />
      ) : null}
      <Button
        label={photoUri ? 'Retake photo' : 'Take a photo of the bottle'}
        icon="camera"
        variant="secondary"
        onPress={pickPhoto}
      />

      <SectionHeader title="Instructions & notes" />
      <Controller
        control={control}
        name="instructions"
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Instructions shown on reminders (optional)"
            hint="Plain words work best"
            placeholder="Take 1 capsule with a full glass of water."
            value={value}
            onChangeText={onChange}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
        )}
      />
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
        <Button label="Save medication" icon="checkmark-circle" size="xl" onPress={handleSubmit(onSubmit)} />
      </View>
    </Screen>
  );
}
