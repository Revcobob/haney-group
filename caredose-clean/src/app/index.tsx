import { Redirect } from 'expo-router';
import React from 'react';

import { useSettingsStore } from '@/store/settingsStore';

/** Entry: send new users to onboarding, returning users to Today. */
export default function Index() {
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);
  return <Redirect href={hasOnboarded ? '/today' : '/onboarding'} />;
}
