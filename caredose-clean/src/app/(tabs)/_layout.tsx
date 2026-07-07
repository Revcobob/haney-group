import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/**
 * Bottom tabs: Today, Plans, Import, History, Helpers, Settings.
 * Labels are always visible (never icon-only) and scale with text size.
 */
export default function TabsLayout() {
  const { colors, font } = useTheme();

  const tab = (
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconActive: keyof typeof Ionicons.glyphMap,
  ) => ({
    title,
    tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
      <Ionicons name={focused ? iconActive : icon} size={24} color={color} />
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: font(12),
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen name="today" options={tab('Today', 'sunny-outline', 'sunny')} />
      <Tabs.Screen name="plans" options={tab('Plans', 'list-outline', 'list')} />
      <Tabs.Screen name="import" options={tab('Import', 'camera-outline', 'camera')} />
      <Tabs.Screen name="history" options={tab('History', 'bar-chart-outline', 'bar-chart')} />
      <Tabs.Screen name="helpers" options={tab('Helpers', 'people-outline', 'people')} />
      <Tabs.Screen name="settings" options={tab('Settings', 'settings-outline', 'settings')} />
    </Tabs>
  );
}
