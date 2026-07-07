import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconBubble } from '@/components/ui/IconBubble';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusPill } from '@/components/ui/StatusPill';
import { AlarmPrefsFields } from '@/features/alarms/AlarmPrefsFields';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { formatCompactDate, formatTime } from '@/utils/dates';
import { deriveStatus, describeSchedule } from '@/utils/schedule';

/** Detail row helper: label on the left, value on the right. */
function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <AppText variant="label" tone="secondary" style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText variant="label" weight="semibold" style={{ flex: 1.4, textAlign: 'right' }}>
        {value}
      </AppText>
    </View>
  );
}

/**
 * Task detail: instructions, medication facts, schedule, alarm preferences
 * (editable in place), and this task's status history.
 */
export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const task = useCareStore((s) => s.tasks.find((t) => t.id === taskId));
  const allEvents = useCareStore((s) => s.events);
  const events = allEvents.filter((e) => e.taskId === taskId);
  const updateTask = useCareStore((s) => s.updateTask);
  const removeTask = useCareStore((s) => s.removeTask);
  const logAsNeededDose = useCareStore((s) => s.logAsNeededDose);

  if (!task) {
    return (
      <Screen title="Task not found" showBack>
        <EmptyState
          icon="help-circle-outline"
          title="This task is gone"
          message="It may have been removed from the plan."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const meta = TASK_TYPE_META[task.type];
  const med = task.medication;
  const now = new Date();
  const history = [...events]
    .sort((a, b) => b.dueAt.localeCompare(a.dueAt))
    .slice(0, 14);

  const confirmDelete = () => {
    Alert.alert('Remove this task?', `"${task.name}" will stop being scheduled. Past history is kept.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove task',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen title={task.name} subtitle={meta.label} showBack>
      <Card>
        <View style={styles.headRow}>
          <IconBubble icon={meta.icon} color={colors.accent} background={colors.accentSoft} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="body">{task.instructions}</AppText>
          </View>
        </View>
        {task.imageUri || med?.pillPhotoUri ? (
          <Image
            source={{ uri: task.imageUri ?? med?.pillPhotoUri }}
            style={styles.photo}
            accessible
            accessibilityLabel={`Photo for ${task.name}`}
          />
        ) : null}
        <View style={{ marginTop: spacing.md }}>
          <DetailRow label="Schedule" value={describeSchedule(task.schedule)} />
          <DetailRow label="Starts" value={task.schedule.startDate} />
          {task.durationMinutes ? (
            <DetailRow label="Duration" value={`${task.durationMinutes} minutes`} />
          ) : null}
          {task.notes ? <DetailRow label="Notes" value={task.notes} /> : null}
        </View>
      </Card>

      {task.schedule.kind === 'asNeeded' ? (
        <View style={{ marginTop: spacing.md }}>
          <Button
            label={task.type === 'medication' ? 'Log a dose taken now' : 'Log done now'}
            icon="checkmark-circle"
            variant="success"
            onPress={() =>
              Alert.alert(
                'Log this now?',
                `This records "${task.name}" as done at ${formatTime(now)}.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Yes, log it', onPress: () => logAsNeededDose(task.id) },
                ],
              )
            }
          />
        </View>
      ) : null}

      {med ? (
        <>
          <SectionHeader title="Medication details" />
          <Card>
            <DetailRow label="Brand name" value={med.brandName} />
            <DetailRow label="Generic name" value={med.genericName} />
            <DetailRow label="Dose" value={med.dose} />
            <DetailRow label="Strength" value={med.strength} />
            <DetailRow label="Prescribed by" value={med.prescribingPhysician} />
            <DetailRow label="Pharmacy" value={med.pharmacy} />
            <DetailRow label="Prescription #" value={med.prescriptionNumber} />
            <DetailRow
              label="Refills left"
              value={med.refillsRemaining !== undefined ? String(med.refillsRemaining) : undefined}
            />
            {(med.takeWithFood || med.takeWithWater || med.avoidAlcohol || med.doNotDrive) && (
              <View style={styles.flagWrap}>
                {med.takeWithFood ? <Flag label="Take with food" icon="restaurant" /> : null}
                {med.takeWithWater ? <Flag label="Take with water" icon="water" /> : null}
                {med.avoidAlcohol ? <Flag label="Avoid alcohol" icon="warning" warn /> : null}
                {med.doNotDrive ? <Flag label="Do not drive" icon="car" warn /> : null}
              </View>
            )}
          </Card>
        </>
      ) : null}

      <SectionHeader title="Alarm style for this task" />
      <Card>
        <AlarmPrefsFields
          value={task.alarm}
          onChange={(alarm) => updateTask(task.id, { alarm })}
        />
      </Card>

      <SectionHeader title="Recent history" />
      {history.length === 0 ? (
        <Card>
          <AppText variant="body" tone="secondary">
            No history yet. Entries appear once reminders start.
          </AppText>
        </Card>
      ) : (
        history.map((e) => {
          const due = new Date(e.dueAt);
          return (
            <Card key={e.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.historyRow}>
                <View style={{ flex: 1 }}>
                  <AppText variant="label" weight="semibold">
                    {formatCompactDate(due)} at {formatTime(due)}
                  </AppText>
                  {e.completedAt ? (
                    <AppText variant="caption" tone="secondary">
                      Confirmed at {formatTime(new Date(e.completedAt))}
                    </AppText>
                  ) : null}
                  {e.notes ? (
                    <AppText variant="caption" tone="secondary">
                      {e.notes}
                    </AppText>
                  ) : null}
                </View>
                <StatusPill status={deriveStatus(e, now)} />
              </View>
            </Card>
          );
        })
      )}

      <SectionHeader title="Task options" />
      <Button label="Remove this task" variant="ghost" onPress={confirmDelete} />
    </Screen>
  );
}

function Flag({
  label,
  icon,
  warn,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  warn?: boolean;
}) {
  const { colors } = useTheme();
  const fg = warn ? colors.warning : colors.accent;
  const bg = warn ? colors.warningSoft : colors.accentSoft;
  return (
    <View style={[styles.flag, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={16} color={fg} />
      <AppText variant="caption" weight="semibold" color={fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    gap: spacing.md,
  },
  flagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
