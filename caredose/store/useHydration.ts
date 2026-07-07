import { useEffect, useState } from 'react';

import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';

/** True once both persisted stores have rehydrated from AsyncStorage. */
export function useStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    () =>
      useSettingsStore.persist.hasHydrated() &&
      useCareStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const check = () =>
      setHydrated(
        useSettingsStore.persist.hasHydrated() &&
          useCareStore.persist.hasHydrated(),
      );
    const unsub1 = useSettingsStore.persist.onFinishHydration(check);
    const unsub2 = useCareStore.persist.onFinishHydration(check);
    check();
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  return hydrated;
}
