import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { DerivedStatus } from '@/utils/schedule';

/**
 * Status chip with icon + text — status is never conveyed by color alone.
 */
export function StatusPill({ status }: { status: DerivedStatus }) {
  const { colors, font } = useTheme();

  const meta: Record<
    DerivedStatus,
    { label: string; icon: keyof typeof Ionicons.glyphMap; bg: string; fg: string }
  > = {
    upcoming: {
      label: 'Upcoming',
      icon: 'time-outline',
      bg: colors.accentSoft,
      fg: colors.accent,
    },
    dueSoon: {
      label: 'Due soon',
      icon: 'alarm-outline',
      bg: colors.warningSoft,
      fg: colors.warning,
    },
    dueNow: {
      label: 'Due now',
      icon: 'notifications',
      bg: colors.warningSoft,
      fg: colors.warning,
    },
    snoozed: {
      label: 'Snoozed',
      icon: 'moon-outline',
      bg: colors.accentSoft,
      fg: colors.accent,
    },
    done: {
      label: 'Done',
      icon: 'checkmark-circle',
      bg: colors.successSoft,
      fg: colors.success,
    },
    skipped: {
      label: 'Skipped',
      icon: 'remove-circle-outline',
      bg: colors.cardPressed,
      fg: colors.textSecondary,
    },
    missed: {
      label: 'Missed',
      icon: 'alert-circle',
      bg: colors.dangerSoft,
      fg: colors.danger,
    },
  };

  const m = meta[status];
  return (
    <View
      style={[styles.pill, { backgroundColor: m.bg }]}
      accessible
      accessibilityLabel={`Status: ${m.label}`}
    >
      <Ionicons name={m.icon} size={font(15)} color={m.fg} />
      <AppText
        variant="caption"
        weight="semibold"
        color={m.fg}
        style={{ marginLeft: 4 }}
      >
        {m.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
