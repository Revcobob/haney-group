import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconBubble } from '@/components/ui/IconBubble';
import { completeEventWithGuards } from '@/features/tasks/completion';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { CareTask, DoseEvent } from '@/types/models';
import { formatCountdown, formatOverdue, formatTime } from '@/utils/dates';
import { deriveStatus, effectiveDueDate } from '@/utils/schedule';

interface NextUpCardProps {
  event: DoseEvent;
  task: CareTask;
  now: Date;
}

/**
 * The hero card on Today: exactly what's due next, when, and what to do.
 */
export function NextUpCard({ event, task, now }: NextUpCardProps) {
  const { colors, font } = useTheme();
  const router = useRouter();
  const snoozeEvent = useCareStore((s) => s.snoozeEvent);
  const status = deriveStatus(event, now);
  const meta = TASK_TYPE_META[task.type];
  const due = effectiveDueDate(event);
  const overdue = now > due;

  const countdownText = overdue
    ? formatOverdue(now, due)
    : status === 'snoozed'
      ? `Snoozed — again ${formatCountdown(now, due)}`
      : `Due ${formatCountdown(now, due)}`;

  const med = task.medication;

  return (
    <Card
      emphasized
      accessibilityLabel={`Next up: ${task.name} at ${formatTime(due)}. ${countdownText}.`}
    >
      <AppText variant="label" weight="bold" color={colors.accent}>
        NEXT UP
      </AppText>

      <View style={styles.headRow}>
        <IconBubble
          icon={meta.icon}
          color={colors.accent}
          background={colors.accentSoft}
          size={64}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="title" weight="bold">
            {task.name}
          </AppText>
          <AppText variant="label" tone="secondary" style={{ marginTop: 2 }}>
            {meta.label}
            {med?.strength ? ` · ${med.dose} · ${med.strength}` : med?.dose ? ` · ${med.dose}` : ''}
          </AppText>
        </View>
      </View>

      <View
        style={[
          styles.countdown,
          { backgroundColor: overdue ? colors.warningSoft : colors.accentSoft },
        ]}
        accessibilityLiveRegion="polite"
      >
        <AppText
          weight="bold"
          color={overdue ? colors.warning : colors.accent}
          style={{ fontSize: font(24), lineHeight: font(30) }}
          center
        >
          {countdownText}
        </AppText>
        <AppText variant="label" tone="secondary" center style={{ marginTop: 2 }}>
          at {formatTime(due)}
        </AppText>
      </View>

      {task.instructions ? (
        <AppText variant="body" style={{ marginTop: spacing.md }}>
          {task.instructions}
        </AppText>
      ) : null}

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Button
          label={task.type === 'medication' ? 'I took it' : 'Mark done'}
          icon="checkmark-circle"
          variant="success"
          size="xl"
          onPress={() => completeEventWithGuards(event)}
        />
        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <Button
              label="Snooze 10 min"
              icon="moon"
              variant="secondary"
              size="md"
              onPress={() => snoozeEvent(event.id, 10)}
              accessibilityHint="Reminds you again in 10 minutes"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Need help"
              icon="call"
              variant="amber"
              size="md"
              onPress={() => router.push('/help')}
              accessibilityHint="Opens emergency contacts and helpers"
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  countdown: {
    marginTop: spacing.lg,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
