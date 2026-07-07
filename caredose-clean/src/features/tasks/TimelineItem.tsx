import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconBubble } from '@/components/ui/IconBubble';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  completeEventWithGuards,
  undoEventWithConfirm,
} from '@/features/tasks/completion';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { CareTask, DoseEvent } from '@/types/models';
import { formatTime } from '@/utils/dates';
import { deriveStatus } from '@/utils/schedule';

interface TimelineItemProps {
  event: DoseEvent;
  task: CareTask;
  now: Date;
}

/** Recently-completed window during which an inline Undo is offered. */
const UNDO_WINDOW_MINUTES = 15;

/** One row of the Today timeline. */
export function TimelineItem({ event, task, now }: TimelineItemProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const status = deriveStatus(event, now);
  const meta = TASK_TYPE_META[task.type];
  const due = new Date(event.dueAt);

  const showQuickDone = status === 'dueNow' || status === 'dueSoon' || status === 'missed';
  const showUndo =
    status === 'done' &&
    !!event.completedAt &&
    now.getTime() - new Date(event.completedAt).getTime() < UNDO_WINDOW_MINUTES * 60_000;

  const iconColor =
    status === 'done'
      ? colors.success
      : status === 'missed'
        ? colors.danger
        : status === 'dueNow' || status === 'dueSoon'
          ? colors.warning
          : colors.accent;
  const iconBg =
    status === 'done'
      ? colors.successSoft
      : status === 'missed'
        ? colors.dangerSoft
        : status === 'dueNow' || status === 'dueSoon'
          ? colors.warningSoft
          : colors.accentSoft;

  return (
    <Card
      onPress={() => router.push(`/task/${task.id}`)}
      accessibilityLabel={`${task.name}, ${meta.label}, due ${formatTime(due)}`}
      accessibilityHint="Opens task details"
      style={{ marginBottom: spacing.md }}
    >
      <View style={styles.row}>
        <IconBubble icon={meta.icon} color={iconColor} background={iconBg} />
        <View style={styles.body}>
          <AppText variant="label" tone="secondary" weight="medium">
            {formatTime(due)} · {meta.label}
          </AppText>
          <AppText variant="body" weight="semibold" style={{ marginTop: 2 }}>
            {task.name}
          </AppText>
          {task.instructions ? (
            <AppText variant="caption" tone="secondary" numberOfLines={2} style={{ marginTop: 2 }}>
              {task.instructions}
            </AppText>
          ) : null}
          <View style={{ marginTop: spacing.sm }}>
            <StatusPill status={status} />
          </View>
        </View>
      </View>
      {showQuickDone ? (
        <View style={{ marginTop: spacing.md }}>
          <Button
            label={`Mark ${meta.actionVerb.toLowerCase()}`}
            icon="checkmark"
            variant="success"
            size="md"
            onPress={() => completeEventWithGuards(event)}
            accessibilityHint={`Marks ${task.name} as ${meta.actionVerb.toLowerCase()}`}
          />
        </View>
      ) : null}
      {showUndo ? (
        <View style={{ marginTop: spacing.md }}>
          <Button
            label="Undo — I tapped by mistake"
            variant="ghost"
            size="md"
            onPress={() => undoEventWithConfirm(event)}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  body: {
    flex: 1,
  },
});
