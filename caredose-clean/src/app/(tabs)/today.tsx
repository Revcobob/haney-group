import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAlarmLauncher } from '@/features/alarms/useAlarmLauncher';
import { NextUpCard } from '@/features/tasks/NextUpCard';
import { TimelineItem } from '@/features/tasks/TimelineItem';
import { useCareRefresher } from '@/features/tasks/useCareRefresher';
import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate, greetingFor, isSameDay } from '@/utils/dates';
import { deriveStatus, missedEvents, nextUpEvent } from '@/utils/schedule';

/**
 * Home. Answers one question immediately: what is due next?
 */
export default function TodayScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const now = useCareRefresher();
  useAlarmLauncher(now);

  const userName = useSettingsStore((s) => s.userName);
  const events = useCareStore((s) => s.events);
  const tasks = useCareStore((s) => s.tasks);
  const plans = useCareStore((s) => s.plans);

  const activePlans = plans.filter((p) => p.status === 'active');
  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);

  const todaysEvents = useMemo(
    () =>
      events
        .filter((e) => isSameDay(new Date(e.dueAt), now))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    [events, now],
  );

  const next = nextUpEvent(todaysEvents, now);
  const nextTask = next ? taskById.get(next.taskId) : undefined;
  const missed = missedEvents(todaysEvents, now);
  const remaining = todaysEvents.filter(
    (e) => deriveStatus(e, now) !== 'done' && deriveStatus(e, now) !== 'skipped',
  ).length;

  return (
    <Screen>
      {/* Date + greeting */}
      <AppText variant="label" tone="secondary" weight="medium">
        {formatLongDate(now)}
      </AppText>
      <AppText variant="title" weight="bold" accessibilityRole="header">
        {greetingFor(now, userName || undefined)}
      </AppText>
      {activePlans.length > 0 ? (
        <Pressable
          onPress={() => router.push(`/plan/${activePlans[0].id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Active plan: ${activePlans[0].name}. Opens plan details.`}
          style={({ pressed }) => [styles.planChip, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="clipboard-outline" size={16} color={colors.accent} />
          <AppText variant="label" color={colors.accent} weight="semibold">
            {activePlans[0].name}
            {activePlans.length > 1 ? ` +${activePlans.length - 1} more` : ''}
          </AppText>
        </Pressable>
      ) : null}

      {/* Missed escalation banner */}
      {missed.length > 0 ? (
        <Card
          tint={colors.dangerSoft}
          onPress={() => router.push('/missed')}
          accessibilityLabel={`${missed.length} missed care ${missed.length === 1 ? 'step' : 'steps'}. Opens the missed list.`}
          style={{ marginTop: spacing.lg }}
        >
          <View style={styles.bannerRow}>
            <Ionicons name="alert-circle" size={28} color={colors.danger} />
            <View style={{ flex: 1 }}>
              <AppText variant="body" weight="bold" color={colors.danger}>
                {missed.length} care {missed.length === 1 ? 'step was' : 'steps were'} missed
              </AppText>
              <AppText variant="caption" tone="secondary">
                Tap to review and catch up safely.
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.danger} />
          </View>
        </Card>
      ) : null}

      {/* Next Up */}
      <View style={{ marginTop: spacing.lg }}>
        {next && nextTask ? (
          <NextUpCard event={next} task={nextTask} now={now} />
        ) : todaysEvents.length > 0 ? (
          <Card tint={colors.successSoft}>
            <View style={styles.bannerRow}>
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <View style={{ flex: 1 }}>
                <AppText variant="heading" weight="bold" color={colors.success}>
                  All caught up!
                </AppText>
                <AppText variant="body" tone="secondary">
                  Nothing more is due right now. Rest well.
                </AppText>
              </View>
            </View>
          </Card>
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="No care steps today"
            message={
              activePlans.length === 0
                ? 'Create a Recovery Plan or import your discharge papers to get started.'
                : 'Your active plan has no steps scheduled for today.'
            }
            actionLabel={activePlans.length === 0 ? 'Go to Plans' : undefined}
            onAction={activePlans.length === 0 ? () => router.push('/plans') : undefined}
          />
        )}
      </View>

      {/* Timeline */}
      {todaysEvents.length > 0 ? (
        <>
          <SectionHeader
            title="Today's care timeline"
            right={
              <AppText variant="label" tone="secondary">
                {remaining} left
              </AppText>
            }
          />
          {todaysEvents.map((event) => {
            const task = taskById.get(event.taskId);
            if (!task) return null;
            return <TimelineItem key={event.id} event={event} task={task} now={now} />;
          })}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  planChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    minHeight: 32,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
