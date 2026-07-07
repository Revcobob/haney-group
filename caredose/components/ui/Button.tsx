import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'secondary'
  | 'danger'
  | 'amber'
  | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** xl = hero actions (alarm "Done"), lg = default, md = inline actions. */
  size?: 'xl' | 'lg' | 'md';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
}

/**
 * Large, high-contrast button. Minimum 48pt touch target at every size;
 * icons always ship with a text label (never icon-only).
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled,
  loading,
  fullWidth = true,
  accessibilityHint,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, font } = useTheme();

  const palette: Record<
    ButtonVariant,
    { bg: string; fg: string; border?: string }
  > = {
    primary: { bg: colors.accent, fg: colors.onAccent },
    success: { bg: colors.success, fg: '#FFFFFF' },
    danger: { bg: colors.danger, fg: '#FFFFFF' },
    amber: { bg: colors.warningSoft, fg: colors.warning },
    secondary: { bg: colors.card, fg: colors.accent, border: colors.accent },
    ghost: { bg: 'transparent', fg: colors.textSecondary },
  };
  const { bg, fg, border } = palette[variant];

  const minHeight = size === 'xl' ? 68 : size === 'lg' ? 56 : 48;
  const fontSize = font(size === 'xl' ? 20 : size === 'lg' ? 18 : 16);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          minHeight,
          borderColor: border,
          borderWidth: border ? 2 : 0,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.lg : spacing.xl,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Ionicons
              name={icon}
              size={fontSize + 4}
              color={fg}
              style={{ marginRight: spacing.sm }}
            />
          ) : null}
          <AppText
            color={fg}
            weight="semibold"
            style={{ fontSize, lineHeight: Math.round(fontSize * 1.3) }}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
