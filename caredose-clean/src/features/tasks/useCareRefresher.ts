/**
 * Keeps "now" ticking and today's events fresh while the app is open:
 * - re-derives events every 30 seconds (countdowns, due/missed transitions)
 * - regenerates on foreground and across midnight
 * - keeps local notifications in sync with the store
 * - fires mock caregiver alerts for newly missed tasks
 */

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { syncNotifications } from '@/services/notifications';
import { useCareStore } from '@/store/careStore';
import { missedEvents } from '@/utils/schedule';

const TICK_MS = 30_000;

export function useCareRefresher(): Date {
  const [now, setNow] = useState(new Date());
  const refreshTodayEvents = useCareStore((s) => s.refreshTodayEvents);

  useEffect(() => {
    refreshTodayEvents();
    const interval = setInterval(() => {
      setNow(new Date());
      refreshTodayEvents();
    }, TICK_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(new Date());
        refreshTodayEvents();
      }
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [refreshTodayEvents]);

  // Side effects that follow from the fresh event set.
  useEffect(() => {
    const { events, tasks, recordCaregiverAlert } = useCareStore.getState();
    syncNotifications(events, tasks);
    for (const missed of missedEvents(events, now)) {
      recordCaregiverAlert(missed.id);
    }
  }, [now]);

  return now;
}
