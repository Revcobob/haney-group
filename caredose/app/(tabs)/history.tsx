import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  eventsInRange,
  HistoryRange,
  summarizeAdherence,
} from '@/features/history/adherence';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { formatCompactDate, formatTime, isSameDay } from '@/utils/dates';
import { deriveStatus } from '@/utils/schedule';

/**
 * History & logging: adherence summary and the full care log across
 * daily / weekly / monthly views.
 */
export default function HistoryScreen() {
  const { colors, font } = useTheme();
  const [range, setRange] = useState<HistoryRange>('day');
  const events = useCareStore((s) => s.events);
  const tasks = useCareStore((s) => s.tasks);
  const helpers = useCareStore((s) => s.helpers);

  const now = new Date();
  const summary = summarizeAdherence(events, now, range);
  const rows = eventsInRange(events, tasks, now, range);

  const helperName = (helperId?: string) =>
    helperId ? helpers.find((h) => h.id === helperId)?.name : undefined;

  const placeholder = (feature: string) =>
    Alert.alert(
      `${feature} is coming soon`,
      // FUTURE: generate a PDF care report and share sheet / doctor portal link.
      'In a future version you will be able to share a care report with your doctor or care team.',
    );

  const statLabel =
    range === 'day' ? 'today' : range === 'week' ? 'past 7 days' : 'past 30 days';

  return (
    <Screen title="History" subtitle="Everything you've done, in one record">
      <OptionChips
        label="Show"
        options={[
          { value: 'day', label: 'Today' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
        selected={range}
        onToggle={(r) => setRange(r)}
      />

      {/* Adherence summary */}
      <Card emphasized>
        <AppText variant="label" tone="secondary" weight="medium">
          Care steps completed ({statLabel})
        </AppText>
        <AppText
          weight="bold"
          color={
            summary.percent === null
              ? colors.textSecondary
              : summary.percent >= 80
                ? colors.success
                : summary.percent >= 50
                  ? colors.warning
                  : colors.danger
          }
          style={{ fontSize: font(44), lineHeight: font(52) }}
          accessibilityLabel={
            summary.percent === null
              ? 'No completed steps to measure yet'
              : `${summary.percent} percent of care steps completed`
          }
        >
          {summary.percent === null ? '—' : `${summary.percent}%`}
        </AppText>
        <View style={styles.statRow}>
          <Stat label="Done" value={summary.done} color={colors.success} icon="checkmark-circle" />
          <Stat label="Skipped" value={summary.skipped} color={colors.textSecondary} icon="remove-circle" />
          <Stat label="Missed" value={summary.missed} color={colors.danger} icon="alert-circle" />
          <Stat label="Still to do" value={summary.pending} color={colors.accent} icon="time" />
        </View>
      </Card>

      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        <Button
          label="Export care report"
          icon="download-outline"
          variant="secondary"
          size="md"
          onPress={() => placeholder('Exporting')}
        />
        <Button
          label="Share with my doctor"
          icon="share-outline"
          variant="secondary"
          size="md"
          onPress={() => placeholder('Sharing')}
        />
      </View>

      <SectionHeader title="Care log" />
      {rows.length === 0 ? (
        <EmptyState
          icon="bar-chart-outline"
          title="No entries yet"
          message="Once reminders start, everything you complete, snooze, skip, or miss is recorded here."
        />
      ) : (
        rows.map(({ event, task }, i) => {
          const meta = TASK_TYPE_META[task.type];
          const due = new Date(event.dueAt);
          const prev = rows[i - 1];
          const newDay = !prev || !isSameDay(new Date(prev.event.dueAt), due);
          const helper = helperName(event.completedByHelperId);
          return (
            <View key={event.id}>
              {newDay ? (
                <AppText variant="label" weight="bold" tone="secondary" style={styles.dayHead}>
                  {formatCompactDate(due)}
                </AppText>
              ) : null}
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={styles.logRow}>
                  <Ionicons name={meta.icon} size={22} color={colors.accent} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="label" weight="semibold">
                      {task.name}
                    </AppText>
                    <AppText variant="caption" tone="secondary">
                      Due {formatTime(due)}
                      {event.completedAt
                        ? ` · confirmed ${formatTime(new Date(event.completedAt))}`
                        : ''}
                      {helper ? ` · by ${helper}` : ''}
                    </AppText>
                    {event.notes ? (
                      <AppText variant="caption" tone="muted">
                        {event.notes}
                      </AppText>
                    ) : null}
                  </View>
                  <StatusPill status={deriveStatus(event, now)} />
                </View>
              </Card>
            </View>
          );
        })
      )}
    </Screen>
  );
}

function Stat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={18} color={color} />
      <AppText variant="heading" weight="bold" color={color}>
        {value}
      </AppText>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  dayHead: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
