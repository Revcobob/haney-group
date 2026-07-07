import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH_TARGET, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  /** Large screen title rendered in-app (system headers are hidden). */
  title?: string;
  subtitle?: string;
  /** Show a labeled back button (never an unlabeled icon). */
  showBack?: boolean;
  scroll?: boolean;
  headerRight?: React.ReactNode;
}

/** Standard screen shell: safe area, custom large-type header, scroll body. */
export function Screen({
  children,
  title,
  subtitle,
  showBack,
  scroll = true,
  headerRight,
}: ScreenProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const header = (title || showBack) && (
    <View style={styles.header}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={26} color={colors.accent} />
          <AppText variant="label" color={colors.accent} weight="semibold">
            Back
          </AppText>
        </Pressable>
      ) : null}
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          {title ? (
            <AppText variant="title" weight="bold" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText variant="label" tone="secondary" style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {headerRight}
      </View>
    </View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {header}
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, { flex: 1 }]}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    alignSelf: 'flex-start',
    marginLeft: -6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
});
