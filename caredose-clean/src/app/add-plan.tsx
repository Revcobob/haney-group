import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { makeId } from '@/utils/id';
import { todayKey } from '@/utils/dates';

const PLAN_PRESETS = [
  { value: 'custom', label: 'Start blank' },
  { value: 'Knee Surgery Recovery', label: 'Knee surgery' },
  { value: 'Dental Surgery Recovery', label: 'Dental surgery' },
  { value: 'Cardiac Procedure Recovery', label: 'Cardiac procedure' },
  { value: 'Daily Heart Medication Routine', label: 'Heart medication routine' },
  { value: 'Diabetes Care Routine', label: 'Diabetes care' },
  { value: 'Antibiotic Course', label: 'Antibiotic course' },
  { value: 'Blood Pressure Monitoring Plan', label: 'Blood pressure monitoring' },
];

/** Create a Recovery Plan, then jump straight into adding tasks. */
export default function AddPlanScreen() {
  const router = useRouter();
  const addPlan = useCareStore((s) => s.addPlan);
  const [preset, setPreset] = useState('custom');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const effectiveName = name.trim() || (preset !== 'custom' ? preset : '');

  const save = () => {
    if (!effectiveName) {
      setError('Please choose a plan type or enter a name.');
      return;
    }
    const planId = makeId('plan');
    addPlan({
      id: planId,
      name: effectiveName,
      description: description.trim() || undefined,
      icon: 'clipboard',
      status: 'active',
      source: 'manual',
      createdAt: new Date().toISOString(),
      startDate: todayKey(),
    });
    router.replace(`/plan/${planId}`);
  };

  return (
    <Screen title="New Recovery Plan" subtitle="One plan per procedure or routine" showBack>
      <OptionChips
        label="What is this plan for?"
        options={PLAN_PRESETS}
        selected={preset}
        onToggle={(v) => {
          setPreset(v);
          setError('');
        }}
      />
      <FormField
        label={preset === 'custom' ? 'Plan name' : 'Plan name (you can change it)'}
        hint='For example "Hip Surgery Recovery" or "Mom&apos;s Daily Medications"'
        placeholder={preset !== 'custom' ? preset : 'Plan name'}
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError('');
        }}
        error={error}
      />
      <FormField
        label="Notes (optional)"
        hint="Anything that helps you or your helper"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 90, textAlignVertical: 'top' }}
      />
      <View style={{ marginTop: spacing.md }}>
        <Button label="Create plan" icon="checkmark-circle" onPress={save} />
      </View>
    </Screen>
  );
}
