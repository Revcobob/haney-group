import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface SwitchRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

/** Labeled toggle row with plain-language description. */
export function SwitchRow({ label, description, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <AppText variant="body" weight="medium">
          {label}
        </AppText>
        {description ? (
          <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        accessibilityHint={description}
        trackColor={{ true: colors.accent, false: colors.border }}
        thumbColor="#FFFFFF"
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  switch: {
    transform: [{ scale: 1.1 }],
  },
});
