import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';

const RELATIONSHIPS = ['Spouse', 'Adult child', 'Parent', 'Friend', 'Doctor', 'Other'];

/** Add or edit the emergency contact shown on the Need Help screen. */
export default function EmergencyContactScreen() {
  const router = useRouter();
  const existing = useSettingsStore((s) => s.emergencyContact);
  const setEmergencyContact = useSettingsStore((s) => s.setEmergencyContact);

  const [name, setName] = useState(existing?.name ?? '');
  const [relationship, setRelationship] = useState(existing?.relationship ?? 'Spouse');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const save = () => {
    let ok = true;
    if (!name.trim()) {
      setNameError('Please enter their name.');
      ok = false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 3) {
      setPhoneError('Please enter a phone number.');
      ok = false;
    }
    if (!ok) return;
    setEmergencyContact({
      name: name.trim(),
      relationship,
      phone: phone.trim(),
    });
    router.back();
  };

  return (
    <Screen title="Emergency contact" subtitle="Who should you reach quickly if something feels wrong?" showBack>
      <FormField
        label="Name"
        required
        value={name}
        onChangeText={(t) => {
          setName(t);
          setNameError('');
        }}
        error={nameError}
        placeholder="For example: Sarah Miller"
      />
      <OptionChips
        label="Relationship"
        options={RELATIONSHIPS.map((r) => ({ value: r, label: r }))}
        selected={relationship}
        onToggle={setRelationship}
      />
      <FormField
        label="Phone number"
        required
        value={phone}
        onChangeText={(t) => {
          setPhone(t);
          setPhoneError('');
        }}
        error={phoneError}
        placeholder="555-0192"
        keyboardType="phone-pad"
      />
      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        <Button label="Save contact" icon="checkmark-circle" onPress={save} />
        {existing ? (
          <Button
            label="Remove contact"
            variant="ghost"
            onPress={() => {
              setEmergencyContact(null);
              router.back();
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}
