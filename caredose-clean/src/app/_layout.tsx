import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import {
  configureNotificationHandling,
  requestNotificationPermissions,
} from '@/services/notifications';
import { useStoresHydrated } from '@/store/useHydration';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * Root layout. Headers are custom (large type, labeled back buttons), so the
 * system header is hidden everywhere. The alarm route presents as a
 * full-screen modal that can't be swiped away casually.
 */
export default function RootLayout() {
  const hydrated = useStoresHydrated();
  const { colors, dark } = useTheme();

  useEffect(() => {
    configureNotificationHandling();
    requestNotificationPermissions();
  }, []);

  if (!hydrated) {
    // Loading state while persisted data is read from AsyncStorage.
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            gap: spacing.lg,
          }}
        >
          <ActivityIndicator size="large" color={colors.accent} />
          <AppText variant="heading" weight="semibold">
            Getting your care plan ready…
          </AppText>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="alarm/[eventId]"
          options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
        />
        <Stack.Screen name="help" options={{ presentation: 'modal' }} />
        <Stack.Screen name="missed" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
