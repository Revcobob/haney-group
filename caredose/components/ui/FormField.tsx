import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface FormFieldProps extends TextInputProps {
  label: string;
  /** Plain-language helper text under the label. */
  hint?: string;
  error?: string;
  required?: boolean;
}

/** Large labeled text field with plain-language hints and visible errors. */
export function FormField({
  label,
  hint,
  error,
  required,
  style,
  ...inputProps
}: FormFieldProps) {
  const { colors, font } = useTheme();
  return (
    <View style={styles.wrap}>
      <AppText variant="label" weight="semibold">
        {label}
        {required ? (
          <AppText variant="label" color={colors.danger}>
            {' '}
            (required)
          </AppText>
        ) : null}
      </AppText>
      {hint ? (
        <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {hint}
        </AppText>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={colors.textMuted}
        allowFontScaling
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
            fontSize: font(17),
          },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <AppText
          variant="caption"
          color={colors.danger}
          weight="semibold"
          style={{ marginTop: 4 }}
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  input: {
    marginTop: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 54,
  },
});
