import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { extractFromDocument } from '@/features/import/mockExtraction';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { UploadedOrderDocument } from '@/types/models';
import { formatCompactDate, formatTime } from '@/utils/dates';
import { makeId } from '@/utils/id';

export const IMPORT_DISCLAIMER =
  'CareDose helps organize reminders but does not replace medical advice. Always verify imported instructions with your doctor, pharmacist, or care team.';

/**
 * Scan/upload discharge papers, prescriptions, or pill bottles.
 * Version one mocks the OCR/AI step (see features/import/mockExtraction.ts);
 * nothing becomes active until the user confirms on the review screen.
 */
export default function ImportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const documents = useCareStore((s) => s.documents);
  const addDocument = useCareStore((s) => s.addDocument);
  const updateDocument = useCareStore((s) => s.updateDocument);
  const setPendingReview = useCareStore((s) => s.setPendingReview);
  const [processing, setProcessing] = useState(false);

  const process = async (doc: UploadedOrderDocument) => {
    addDocument(doc);
    setProcessing(true);
    try {
      const review = await extractFromDocument(doc);
      updateDocument(doc.id, { status: 'extracted' });
      setPendingReview(review);
      router.push('/import-review');
    } catch {
      updateDocument(doc.id, { status: 'failed' });
      Alert.alert(
        "We couldn't read that document",
        'Please try again with a clearer photo, or add the items by hand from the Plans tab.',
      );
    } finally {
      setProcessing(false);
    }
  };

  const takePhoto = async (label: string) => {
    let uri: string | undefined;
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (result.canceled) return;
      uri = result.assets[0]?.uri;
    } catch {
      // Camera unavailable (simulator/web): continue with the mock pipeline.
    }
    await process({
      id: makeId('doc'),
      kind: 'photo',
      label,
      uri,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    });
  };

  const pickImage = async () => {
    let uri: string | undefined;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
      if (result.canceled) return;
      uri = result.assets[0]?.uri;
    } catch {
      // Library unavailable: continue with the mock pipeline.
    }
    await process({
      id: makeId('doc'),
      kind: 'image',
      label: 'Uploaded image',
      uri,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    });
  };

  const pickPdf = async () => {
    let uri: string | undefined;
    let label = 'Uploaded PDF';
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      uri = result.assets[0]?.uri;
      label = result.assets[0]?.name ?? label;
    } catch {
      // Picker unavailable: continue with the mock pipeline.
    }
    await process({
      id: makeId('doc'),
      kind: 'pdf',
      label,
      uri,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    });
  };

  const sourceCard = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    description: string,
    onPress: () => void,
  ) => (
    <Card
      onPress={processing ? undefined : onPress}
      accessibilityLabel={title}
      accessibilityHint={description}
      style={{ marginBottom: spacing.md, opacity: processing ? 0.5 : 1 }}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
          <Ionicons name={icon} size={28} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="body" weight="bold">
            {title}
          </AppText>
          <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
            {description}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      </View>
    </Card>
  );

  return (
    <Screen title="Import your orders" subtitle="Turn discharge papers into reminders">
      {processing ? (
        // Loading state while the (mock) OCR/AI extraction runs.
        <Card tint={colors.accentSoft} style={{ marginBottom: spacing.lg }}>
          <View style={styles.row}>
            <ActivityIndicator size="large" color={colors.accent} />
            <View style={{ flex: 1 }}>
              <AppText variant="body" weight="bold">
                Reading your document…
              </AppText>
              <AppText variant="caption" tone="secondary">
                We'll show you everything we found so you can check it.
              </AppText>
            </View>
          </View>
        </Card>
      ) : null}

      {sourceCard(
        'camera',
        'Photograph discharge papers',
        'Take a photo of your hospital or clinic instructions',
        () => takePhoto('Discharge papers photo'),
      )}
      {sourceCard(
        'medkit',
        'Photograph a prescription or bottle',
        'Snap the label on a prescription or pill bottle',
        () => takePhoto('Prescription photo'),
      )}
      {sourceCard('document-text', 'Upload a PDF', 'A discharge summary or visit note saved as PDF', pickPdf)}
      {sourceCard('image', 'Upload a photo from your library', 'A picture of doctor instructions you already took', pickImage)}

      <Card tint={colors.warningSoft} style={{ marginTop: spacing.sm }}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={26} color={colors.warning} />
          <AppText variant="caption" style={{ flex: 1 }}>
            {IMPORT_DISCLAIMER} Nothing becomes active until you review and
            confirm it.
          </AppText>
        </View>
      </Card>

      {documents.length > 0 ? (
        <>
          <SectionHeader title="Uploaded documents" />
          {documents.map((d) => (
            <Card key={d.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.row}>
                <Ionicons
                  name={d.kind === 'pdf' ? 'document-text' : 'image'}
                  size={24}
                  color={colors.textSecondary}
                />
                <View style={{ flex: 1 }}>
                  <AppText variant="label" weight="semibold">
                    {d.label}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    {formatCompactDate(new Date(d.uploadedAt))} at{' '}
                    {formatTime(new Date(d.uploadedAt))} ·{' '}
                    {d.status === 'processing'
                      ? 'Processing'
                      : d.status === 'extracted'
                        ? 'Read successfully'
                        : 'Could not be read'}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
        </>
      ) : null}
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
