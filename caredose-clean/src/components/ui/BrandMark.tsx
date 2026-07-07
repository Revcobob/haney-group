import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * The CareDose logo mark (heart + pill + clock). Decorative, so it's hidden
 * from screen readers — nearby text carries the meaning.
 */
export function BrandMark({ size = 96 }: { size?: number }) {
  return (
    <Image
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require('@/assets/images/caredose-mark.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessible={false}
      importantForAccessibility="no"
      accessibilityIgnoresInvertColors
    />
  );
}

/** Logo mark + "CareDose" wordmark, used in headers. */
export function BrandLockup({ size = 30 }: { size?: number }) {
  const { colors, font } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="CareDose">
      <BrandMark size={size} />
      <AppText
        weight="bold"
        color={colors.accent}
        style={{ fontSize: font(20), letterSpacing: 0.2 }}
      >
        CareDose
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
