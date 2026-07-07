import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH_TARGET, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface OptionChipsProps<T extends string> {
  label?: string;
  options: ChipOption<T>[];
  /** Selected value(s). Pass an array for multi-select. */
  selected: T | T[] | null;
  onToggle: (value: T) => void;
  multi?: boolean;
}

/**
 * Big tappable choice chips — friendlier than dropdowns for older users.
 * Selection is shown with a checkmark AND a border, never color alone.
 */
export function OptionChips<T extends string>({
  label,
  options,
  selected,
  onToggle,
  multi,
}: OptionChipsProps<T>) {
  const { colors } = useTheme();
  const isSelected = (v: T) =>
    Array.isArray(selected) ? selected.includes(v) : selected === v;

  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="label" weight="semibold" style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      ) : null}
      <View style={styles.row} accessibilityRole={multi ? undefined : 'radiogroup'}>
        {options.map((opt) => {
          const on = isSelected(opt.value);
          return (
            <Pressable
              key={opt.value}
              onPress={() => onToggle(opt.value)}
              accessibilityRole={multi ? 'checkbox' : 'radio'}
              accessibilityState={{ checked: on }}
              accessibilityLabel={
                opt.description ? `${opt.label}. ${opt.description}` : opt.label
              }
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: on ? colors.accentSoft : colors.card,
                  borderColor: on ? colors.accent : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {on ? (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.accent}
                  style={{ marginRight: 6 }}
                />
              ) : null}
              <View style={{ flexShrink: 1 }}>
                <AppText
                  variant="label"
                  weight={on ? 'bold' : 'medium'}
                  color={on ? colors.accent : colors.text}
                >
                  {opt.label}
                </AppText>
                {opt.description ? (
                  <AppText variant="caption" tone="secondary">
                    {opt.description}
                  </AppText>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: MIN_TOUCH_TARGET,
  },
});
