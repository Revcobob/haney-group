import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useAlarmEffects } from '@/features/alarms/useAlarmEffects';
import { markAlarmShown } from '@/features/alarms/useAlarmLauncher';
import {
  completeEventWithGuards,
  skipEventWithConfirm,
} from '@/features/tasks/completion';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { formatTime } from '@/utils/dates';
import { effectiveDueDate } from '@/utils/schedule';

/**
 * Full-screen alarm: one task, one question — what do I need to do right now?
 * Sound / voice / vibration / pulsing visuals follow the task's alarm
 * preferences and stop the moment the user responds.
 */
export default function AlarmScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { colors, font } = useTheme();

  const event = useCareStore((s) => s.events.find((e) => e.id === eventId));
  const task = useCareStore((s) =>
    s.tasks.find((t) => t.id === event?.taskId),
  );
  const snoozeEvent = useCareStore((s) => s.snoozeEvent);

  const pulse = useAlarmEffects(task);

  // Error state: the event no longer exists (edited/removed elsewhere).
  if (!event || !task) {
    return (
      <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
        <View style={[styles.fill, styles.center, { padding: spacing.xl }]}>
          <Ionicons name="help-circle-outline" size={64} color={colors.textMuted} />
          <AppText variant="heading" weight="bold" center style={{ marginTop: spacing.lg }}>
            This reminder is no longer available
          </AppText>
          <AppText variant="body" tone="secondary" center style={{ marginTop: spacing.sm }}>
            The task may have been changed or removed.
          </AppText>
          <View style={{ alignSelf: 'stretch', marginTop: spacing.xl }}>
            <Button label="Go back" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const meta = TASK_TYPE_META[task.type];
  const med = task.medication;
  const due = effectiveDueDate(event);

  const close = () => {
    markAlarmShown(event.id);
    if (router.canGoBack()) router.back();
    else router.replace('/today');
  };

  // Pulsing tint between the normal background and a soft amber.
  const backgroundColor = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.warningSoft],
  });

  return (
    <Animated.View style={[styles.fill, { backgroundColor }]}>
      <SafeAreaView style={styles.fill}>
        <View style={[styles.fill, { padding: spacing.xl, justifyContent: 'space-between' }]}>
          <View style={styles.center}>
            <View style={[styles.badge, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="notifications" size={22} color={colors.warning} />
              <AppText variant="label" weight="bold" color={colors.warning}>
                TIME FOR YOUR CARE STEP
              </AppText>
            </View>

            <AppText
              variant="label"
              tone="secondary"
              weight="medium"
              style={{ marginTop: spacing.xl }}
            >
              Due at {formatTime(due)} · {meta.label}
            </AppText>

            {/* Pill photo if available, otherwise a large labeled icon */}
            {med?.pillPhotoUri || task.imageUri ? (
              <Image
                source={{ uri: med?.pillPhotoUri ?? task.imageUri }}
                style={styles.photo}
                accessibilityIgnoresInvertColors
                accessible
                accessibilityLabel={`Photo of ${task.name}`}
              />
            ) : (
              <View style={[styles.bigIcon, { backgroundColor: colors.accentSoft }]}>
                <Ionicons name={meta.icon} size={72} color={colors.accent} />
              </View>
            )}

            <AppText
              weight="bold"
              center
              style={{ fontSize: font(34), lineHeight: font(42), marginTop: spacing.lg }}
              accessibilityRole="header"
            >
              {task.name}
            </AppText>

            {task.type === 'medication' && med ? (
              <AppText variant="heading" weight="semibold" center style={{ marginTop: spacing.sm }}>
                {med.dose}
                {med.strength ? ` · ${med.strength}` : ''}
              </AppText>
            ) : task.durationMinutes ? (
              <AppText variant="heading" weight="semibold" center style={{ marginTop: spacing.sm }}>
                For {task.durationMinutes} minutes
              </AppText>
            ) : null}

            <AppText variant="body" center tone="secondary" style={{ marginTop: spacing.md }}>
              {task.instructions}
            </AppText>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Button
              label={task.type === 'medication' ? 'Done — I took it' : 'Done'}
              icon="checkmark-circle"
              variant="success"
              size="xl"
              onPress={() => completeEventWithGuards(event, close)}
            />
            <Button
              label="Snooze 10 minutes"
              icon="moon"
              variant="secondary"
              onPress={() => {
                snoozeEvent(event.id, 10);
                close();
              }}
              accessibilityHint="Silences this alarm and reminds you again in 10 minutes"
            />
            <Button
              label="Need help"
              icon="call"
              variant="amber"
              onPress={() => {
                markAlarmShown(event.id);
                router.push('/help');
              }}
              accessibilityHint="Opens your emergency contact and helpers"
            />
            <Button
              label="Skip this time"
              variant="ghost"
              size="md"
              onPress={() => skipEventWithConfirm(event, close)}
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    marginTop: spacing.md,
  },
  bigIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 24,
    marginTop: spacing.xl,
  },
});
