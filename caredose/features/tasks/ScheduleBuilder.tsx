import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ScheduleRule } from '@/types/models';
import {
  formatTimeString,
  isValidDateKey,
  isValidTimeString,
  todayKey,
  toDateKey,
  addDays,
} from '@/utils/dates';
import { describeSchedule } from '@/utils/schedule';

interface ScheduleBuilderProps {
  value: ScheduleRule;
  onChange: (rule: ScheduleRule) => void;
  /** Hide the as-needed option (not meaningful for e.g. appointments). */
  allowAsNeeded?: boolean;
}

const COMMON_TIMES = [
  { value: '08:00', label: 'Morning · 8:00 AM' },
  { value: '12:00', label: 'Midday · 12:00 PM' },
  { value: '18:00', label: 'Evening · 6:00 PM' },
  { value: '22:00', label: 'Bedtime · 10:00 PM' },
];

const INTERVAL_CHOICES = ['2', '3', '4', '6', '8', '12'] as const;
const DURATION_CHOICES = [
  { value: '3', label: '3 days' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days' },
  { value: '10', label: '10 days' },
  { value: '14', label: '14 days' },
  { value: 'ongoing', label: 'Ongoing' },
];

/**
 * Plain-language schedule form: chips instead of dropdowns, no typing
 * required for the common cases, and a live "in other words" summary so the
 * user can confirm the schedule reads back the way they meant it.
 */
export function ScheduleBuilder({ value, onChange, allowAsNeeded = true }: ScheduleBuilderProps) {
  const { colors } = useTheme();
  const [customTime, setCustomTime] = useState('');
  const [customTimeError, setCustomTimeError] = useState('');
  const [customStart, setCustomStart] = useState('');

  const patch = (p: Partial<ScheduleRule>) => onChange({ ...value, ...p });

  const kindOptions = [
    { value: 'fixedTimes' as const, label: 'At set times' },
    { value: 'interval' as const, label: 'Every few hours' },
    ...(allowAsNeeded
      ? [{ value: 'asNeeded' as const, label: 'Only as needed' }]
      : []),
  ];

  const startChoice =
    value.startDate === todayKey()
      ? 'today'
      : value.startDate === toDateKey(addDays(new Date(), 1))
        ? 'tomorrow'
        : 'custom';

  const durationChoice = value.durationDays ? String(value.durationDays) : 'ongoing';

  const addCustomTime = () => {
    const t = customTime.trim();
    if (!isValidTimeString(t)) {
      setCustomTimeError('Please enter a time like 14:30 (2:30 PM).');
      return;
    }
    setCustomTimeError('');
    const normalized = t.length === 4 ? `0${t}` : t;
    const times = Array.from(new Set([...(value.times ?? []), normalized])).sort();
    patch({ times });
    setCustomTime('');
  };

  return (
    <View>
      <OptionChips
        label="How often?"
        options={kindOptions}
        selected={value.kind}
        onToggle={(kind) =>
          patch(
            kind === 'fixedTimes'
              ? { kind, times: value.times?.length ? value.times : ['08:00'] }
              : kind === 'interval'
                ? { kind, everyHours: value.everyHours ?? 6 }
                : { kind },
          )
        }
      />

      {value.kind === 'fixedTimes' ? (
        <>
          <OptionChips
            label="Which times? (choose all that apply)"
            multi
            options={COMMON_TIMES}
            selected={(value.times ?? []).filter((t) =>
              COMMON_TIMES.some((c) => c.value === t),
            )}
            onToggle={(t) => {
              const times = value.times ?? [];
              patch({
                times: times.includes(t)
                  ? times.filter((x) => x !== t)
                  : [...times, t].sort(),
              });
            }}
          />
          <FormField
            label="Add another time"
            hint="24-hour clock, for example 14:30 for 2:30 PM"
            placeholder="14:30"
            value={customTime}
            onChangeText={setCustomTime}
            error={customTimeError}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
          />
          <Button label="Add this time" variant="secondary" size="md" onPress={addCustomTime} />
          {(value.times ?? []).length > 0 ? (
            <View style={styles.timesList}>
              <AppText variant="label" weight="semibold">
                Reminder times:
              </AppText>
              {(value.times ?? []).map((t) => (
                <View key={t} style={styles.timeRow}>
                  <AppText variant="body" style={{ flex: 1 }}>
                    {formatTimeString(t)}
                  </AppText>
                  <Button
                    label="Remove"
                    variant="ghost"
                    size="md"
                    fullWidth={false}
                    onPress={() =>
                      patch({ times: (value.times ?? []).filter((x) => x !== t) })
                    }
                    accessibilityLabel={`Remove ${formatTimeString(t)}`}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}

      {value.kind === 'interval' ? (
        <>
          <OptionChips
            label="How many hours between reminders?"
            options={INTERVAL_CHOICES.map((h) => ({ value: h, label: `Every ${h} hours` }))}
            selected={String(value.everyHours ?? 6) as (typeof INTERVAL_CHOICES)[number]}
            onToggle={(h) => patch({ everyHours: Number(h) })}
          />
          <FormField
            label="First reminder of the day"
            hint="24-hour clock, for example 07:00 for 7:00 AM"
            placeholder="08:00"
            value={value.windowStart ?? '08:00'}
            onChangeText={(t) => patch({ windowStart: t })}
            error={
              value.windowStart && !isValidTimeString(value.windowStart)
                ? 'Please enter a time like 07:00.'
                : undefined
            }
          />
          <FormField
            label="Last reminder of the day"
            hint="No reminders after this time"
            placeholder="22:00"
            value={value.windowEnd ?? '22:00'}
            onChangeText={(t) => patch({ windowEnd: t })}
            error={
              value.windowEnd && !isValidTimeString(value.windowEnd)
                ? 'Please enter a time like 22:00.'
                : undefined
            }
          />
        </>
      ) : null}

      {value.kind === 'asNeeded' ? (
        <AppText variant="body" tone="secondary" style={{ marginBottom: spacing.lg }}>
          CareDose will not remind you automatically. You can log each time you
          do this from the task page.
        </AppText>
      ) : null}

      <OptionChips
        label="When does it start?"
        options={[
          { value: 'today', label: 'Today' },
          { value: 'tomorrow', label: 'Tomorrow' },
          { value: 'custom', label: 'Pick a date' },
        ]}
        selected={startChoice}
        onToggle={(c) => {
          if (c === 'today') patch({ startDate: todayKey() });
          else if (c === 'tomorrow') patch({ startDate: toDateKey(addDays(new Date(), 1)) });
          else setCustomStart(customStart || value.startDate);
        }}
      />
      {startChoice === 'custom' || customStart ? (
        <FormField
          label="Start date"
          hint="Year-month-day, for example 2026-07-10"
          placeholder="2026-07-10"
          value={customStart || value.startDate}
          onChangeText={(t) => {
            setCustomStart(t);
            if (isValidDateKey(t)) patch({ startDate: t.trim() });
          }}
          error={
            customStart && !isValidDateKey(customStart)
              ? 'Please enter a date like 2026-07-10.'
              : undefined
          }
        />
      ) : null}

      <OptionChips
        label="For how long?"
        options={DURATION_CHOICES}
        selected={durationChoice}
        onToggle={(d) =>
          patch({
            durationDays: d === 'ongoing' ? undefined : Number(d),
            endDate: undefined,
          })
        }
      />

      <View style={[styles.summary, { backgroundColor: colors.accentSoft }]}>
        <AppText variant="label" weight="semibold" color={colors.accent}>
          In other words:
        </AppText>
        <AppText variant="body" style={{ marginTop: 4 }}>
          {describeSchedule(value)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timesList: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summary: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
});
