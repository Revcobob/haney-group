import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Recovery Plans list. */
export default function PlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const plans = useCareStore((s) => s.plans);
  const tasks = useCareStore((s) => s.tasks);

  const active = plans.filter((p) => p.status === 'active');
  const past = plans.filter((p) => p.status !== 'active');

  const planCard = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)!;
    const count = tasks.filter((t) => t.planId === plan.id && !t.archived).length;
    return (
      <Card
        key={plan.id}
        onPress={() => router.push(`/plan/${plan.id}`)}
        accessibilityLabel={`${plan.name}, ${count} care tasks. Opens plan.`}
        style={{ marginBottom: spacing.md }}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
            <Ionicons
              name={(plan.icon as keyof typeof Ionicons.glyphMap) ?? 'clipboard'}
              size={28}
              color={colors.accent}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" weight="bold">
              {plan.name}
            </AppText>
            <AppText variant="label" tone="secondary" style={{ marginTop: 2 }}>
              {count} care {count === 1 ? 'task' : 'tasks'}
              {plan.endDate ? ` · until ${plan.endDate}` : ''}
            </AppText>
            {plan.description ? (
              <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
                {plan.description}
              </AppText>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </View>
      </Card>
    );
  };

  return (
    <Screen title="Recovery Plans" subtitle="Everything you're recovering from or managing">
      <Button
        label="New Recovery Plan"
        icon="add-circle"
        onPress={() => router.push('/add-plan')}
      />
      <View style={{ height: spacing.sm }} />
      <Button
        label="Import from papers or photos"
        icon="camera"
        variant="secondary"
        onPress={() => router.push('/import')}
      />

      {plans.length === 0 ? (
        <EmptyState
          icon="clipboard-outline"
          title="No plans yet"
          message="A Recovery Plan holds all the care steps for one procedure or routine — medications, wound care, walks, and more."
        />
      ) : (
        <>
          {active.length > 0 ? (
            <>
              <SectionHeader title="Active plans" />
              {active.map((p) => planCard(p.id))}
            </>
          ) : null}
          {past.length > 0 ? (
            <>
              <SectionHeader title="Completed & archived" />
              {past.map((p) => planCard(p.id))}
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
