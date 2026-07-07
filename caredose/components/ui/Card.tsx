import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Accent border for highlighted cards (e.g. the Next Up card). */
  emphasized?: boolean;
  tint?: string;
}

/** White rounded card with a soft shadow — the basic surface of the app. */
export function Card({
  children,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  emphasized,
  tint,
}: CardProps) {
  const { colors } = useTheme();
  const inner = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tint ?? colors.card,
          borderColor: emphasized ? colors.accent : colors.border,
          borderWidth: emphasized ? 2 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#1C2A4A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
