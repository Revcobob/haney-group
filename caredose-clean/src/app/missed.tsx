import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import {
  completeEventWithGuards,
  skipEventWithConfirm,
} from '@/features/tasks/completion';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { formatCompactDate, formatTime } from '@/utils/dates';
import { missedEvents } from '@/utils/schedule';

/**
 * Missed steps review: catch up ("confirmed late") or skip, with a safety
 * note for medications. Completing here logs the action as confirmed late.
 */
export default function MissedScreen() {
  const { colors } = useTheme();
  const now = new Date();
  const events = useCareStore((s) => s.events);
  const tasks = useCareStore((s) => s.tasks);

  const missed = missedEvents(events, now).sort((a, b) =>
    a.dueAt.localeCompare(b.dueAt),
  );
  const taskById = new Map(tasks.map((t) => [t.id, t]));

  return (
    <Screen title="Missed care steps" showBack>
      {missed.length === 0 ? (
        <EmptyState
          icon="checkmark-done-circle-outline"
          title="Nothing is missed"
          message="You're all caught up. Missed steps will appear here if a reminder goes unanswered."
        />
      ) : (
        <>
          <Card tint={colors.warningSoft} style={{ marginBottom: spacing.lg }}>
            <AppText variant="body" color={colors.warning} weight="semibold">
              If a medication dose is very late, check the label or ask your
              pharmacist whether to take it now or wait for the next one.
              Never double up to catch up.
            </AppText>
          </Card>
          {missed.map((event) => {
            const task = taskById.get(event.taskId);
            if (!task) return null;
            const meta = TASK_TYPE_META[task.type];
            const due = new Date(event.dueAt);
            return (
              <Card key={event.id} style={{ marginBottom: spacing.md }}>
                <AppText variant="label" tone="secondary">
                  Was due {formatCompactDate(due)} at {formatTime(due)} · {meta.label}
                </AppText>
                <AppText variant="heading" weight="bold" style={{ marginTop: 2 }}>
                  {task.name}
                </AppText>
                <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {task.instructions}
                </AppText>
                <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                  <Button
                    label={task.type === 'medication' ? 'I took it just now' : 'I did it just now'}
                    icon="checkmark-circle"
                    variant="success"
                    size="md"
                    onPress={() => completeEventWithGuards(event)}
                  />
                  <Button
                    label="Skip this one"
                    variant="ghost"
                    size="md"
                    onPress={() => skipEventWithConfirm(event)}
                  />
                </View>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}
