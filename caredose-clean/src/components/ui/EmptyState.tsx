import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Friendly empty state with a clear next step. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name={icon} size={44} color={colors.accent} />
      </View>
      <AppText variant="heading" weight="bold" center style={{ marginTop: spacing.lg }}>
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" center style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: spacing.sm,
    maxWidth: 320,
  },
});
