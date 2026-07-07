import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import type { FontVariant } from '@/theme/tokens';

interface AppTextProps extends TextProps {
  variant?: FontVariant;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  /** Convenience for secondary/muted text without picking hex values. */
  tone?: 'primary' | 'secondary' | 'muted';
  center?: boolean;
}

const weightMap: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Themed, scale-aware text. All app copy goes through this component so the
 * in-app text size setting and OS font scaling apply everywhere.
 */
export function AppText({
  variant = 'body',
  weight = 'regular',
  color,
  tone = 'primary',
  center,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors, fontFor } = useTheme();
  const toneColor =
    tone === 'secondary'
      ? colors.textSecondary
      : tone === 'muted'
        ? colors.textMuted
        : colors.text;
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.6}
      style={[
        {
          fontSize: fontFor(variant),
          lineHeight: Math.round(fontFor(variant) * 1.35),
          color: color ?? toneColor,
          fontWeight: weightMap[weight],
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
