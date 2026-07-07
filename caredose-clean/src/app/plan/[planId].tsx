import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconBubble } from '@/components/ui/IconBubble';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { describeSchedule } from '@/utils/schedule';

/** Plan detail: its tasks, plus add/complete/delete plan actions. */
export default function PlanDetailScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const plan = useCareStore((s) => s.plans.find((p) => p.id === planId));
  const allTasks = useCareStore((s) => s.tasks);
  const tasks = allTasks.filter((t) => t.planId === planId && !t.archived);
  const updatePlan = useCareStore((s) => s.updatePlan);
  const removePlan = useCareStore((s) => s.removePlan);
  const refreshTodayEvents = useCareStore((s) => s.refreshTodayEvents);

  if (!plan) {
    return (
      <Screen title="Plan not found" showBack>
        <EmptyState
          icon="help-circle-outline"
          title="This plan is gone"
          message="It may have been removed on this device."
          actionLabel="Back to Plans"
          onAction={() => router.replace('/plans')}
        />
      </Screen>
    );
  }

  const meds = tasks.filter((t) => t.type === 'medication');
  const other = tasks.filter((t) => t.type !== 'medication');

  const confirmComplete = () => {
    Alert.alert(
      plan.status === 'active' ? 'Mark plan as completed?' : 'Reactivate plan?',
      plan.status === 'active'
        ? 'Reminders for this plan will stop. Its history is kept.'
        : 'Reminders for this plan will start again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: plan.status === 'active' ? 'Complete plan' : 'Reactivate',
          onPress: () => {
            updatePlan(plan.id, {
              status: plan.status === 'active' ? 'completed' : 'active',
            });
            refreshTodayEvents();
          },
        },
      ],
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete this plan?',
      `"${plan.name}" and all of its tasks will be removed. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete plan',
          style: 'destructive',
          onPress: () => {
            removePlan(plan.id);
            router.replace('/plans');
          },
        },
      ],
    );
  };

  const taskRow = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)!;
    const meta = TASK_TYPE_META[task.type];
    return (
      <Card
        key={task.id}
        onPress={() => router.push(`/task/${task.id}`)}
        accessibilityLabel={`${task.name}, ${meta.label}. Opens task details.`}
        style={{ marginBottom: spacing.md }}
      >
        <View style={styles.row}>
          <IconBubble icon={meta.icon} color={colors.accent} background={colors.accentSoft} />
          <View style={{ flex: 1 }}>
            <AppText variant="body" weight="bold">
              {task.name}
            </AppText>
            <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
              {meta.label} · {describeSchedule(task.schedule)}
            </AppText>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <Screen title={plan.name} subtitle={plan.description} showBack>
      {plan.status !== 'active' ? (
        <Card tint={colors.warningSoft} style={{ marginBottom: spacing.lg }}>
          <AppText variant="body" weight="semibold" color={colors.warning}>
            This plan is {plan.status === 'completed' ? 'completed' : 'not active'} —
            no reminders are scheduled.
          </AppText>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm }}>
        <Button
          label="Add medication"
          icon="medical"
          onPress={() => router.push(`/add-medication?planId=${plan.id}`)}
        />
        <Button
          label="Add care task"
          icon="add-circle"
          variant="secondary"
          onPress={() => router.push(`/add-task?planId=${plan.id}`)}
        />
      </View>

      {tasks.length === 0 ? (
        <EmptyState
          icon="list-outline"
          title="No tasks yet"
          message="Add the medications and care steps from your discharge instructions."
        />
      ) : (
        <>
          {meds.length > 0 ? (
            <>
              <SectionHeader title="Medications" />
              {meds.map((t) => taskRow(t.id))}
            </>
          ) : null}
          {other.length > 0 ? (
            <>
              <SectionHeader title="Care tasks" />
              {other.map((t) => taskRow(t.id))}
            </>
          ) : null}
        </>
      )}

      <SectionHeader title="Plan options" />
      <View style={{ gap: spacing.sm }}>
        <Button
          label={plan.status === 'active' ? 'Mark plan completed' : 'Reactivate plan'}
          variant="secondary"
          onPress={confirmComplete}
        />
        <Button label="Delete plan" variant="ghost" onPress={confirmDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
