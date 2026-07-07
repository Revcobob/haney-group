import React from 'react';
import { View } from 'react-native';

import { OptionChips } from '@/components/ui/OptionChips';
import { SwitchRow } from '@/components/ui/SwitchRow';
import type { AlarmPreference } from '@/types/models';

interface AlarmPrefsFieldsProps {
  value: AlarmPreference;
  onChange: (v: AlarmPreference) => void;
  /** Hide caregiver/critical rows (e.g. in Settings defaults). */
  compact?: boolean;
}

/** The full set of alarm-style toggles, shared by forms and Settings. */
export function AlarmPrefsFields({ value, onChange, compact }: AlarmPrefsFieldsProps) {
  const patch = (p: Partial<AlarmPreference>) => onChange({ ...value, ...p });
  const repeatChoice = value.repeatEveryMinutes ? String(value.repeatEveryMinutes) : 'off';

  return (
    <View>
      <SwitchRow
        label="Play a loud sound"
        description="Rings even if your phone is on silent"
        value={value.sound}
        onValueChange={(v) => patch({ sound: v })}
      />
      <SwitchRow
        label="Speak the reminder out loud"
        description="Reads the task and instructions to you"
        value={value.voice}
        onValueChange={(v) => patch({ voice: v })}
      />
      <SwitchRow
        label="Vibrate"
        description="Strong repeating vibration"
        value={value.vibration}
        onValueChange={(v) => patch({ vibration: v })}
      />
      <SwitchRow
        label="Full-screen reminder"
        description="Takes over the screen so it can't be missed"
        value={value.fullScreen}
        onValueChange={(v) => patch({ fullScreen: v })}
      />
      <SwitchRow
        label="Pulsing visual alert"
        description="Gently flashes the reminder screen (turned off by Reduce Motion)"
        value={value.flashing}
        onValueChange={(v) => patch({ flashing: v })}
      />
      <OptionChips
        label="Repeat until confirmed"
        options={[
          { value: 'off', label: "Don't repeat" },
          { value: '5', label: 'Every 5 min' },
          { value: '10', label: 'Every 10 min' },
          { value: '15', label: 'Every 15 min' },
        ]}
        selected={repeatChoice}
        onToggle={(c) =>
          patch({ repeatEveryMinutes: c === 'off' ? null : Number(c) })
        }
      />
      {!compact ? (
        <>
          <SwitchRow
            label="Alert my helper if I miss this"
            description="Helpers with missed-alert permission get notified"
            value={value.alertCaregiverIfMissed}
            onValueChange={(v) => patch({ alertCaregiverIfMissed: v })}
          />
          <SwitchRow
            label="Critical task"
            description="Treat this as must-not-miss: loudest, most persistent reminders"
            value={value.critical}
            onValueChange={(v) => patch({ critical: v })}
          />
        </>
      ) : null}
    </View>
  );
}
