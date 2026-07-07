/**
 * MOCK OCR/AI extraction for version one.
 *
 * FUTURE: replace `extractFromDocument` with a real pipeline:
 *   1. Upload the photo/PDF to the backend.
 *   2. OCR (e.g. on-device VisionKit / ML Kit, or a server OCR service).
 *   3. LLM structuring pass that maps the raw text into ImportedTaskDrafts
 *      (the Claude API is a good fit — see services/ for integration notes).
 *   4. Confidence scores per field; anything below threshold gets a warning.
 *
 * The contract stays the same: the function returns an ImportedPlanReview
 * and NOTHING becomes active until the user confirms it on the review screen.
 */

import type {
  ImportedPlanReview,
  ImportedTaskDraft,
  UploadedOrderDocument,
} from '@/types/models';
import { addDays, toDateKey } from '@/utils/dates';
import { describeSchedule } from '@/utils/schedule';
import { makeId } from '@/utils/id';

export async function extractFromDocument(
  doc: UploadedOrderDocument,
): Promise<ImportedPlanReview> {
  // Simulate OCR + AI processing time so the UI shows a real loading state.
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const today = toDateKey(new Date());
  const drafts: Omit<ImportedTaskDraft, 'scheduleSummary'>[] = [
    {
      id: makeId('draft'),
      include: true,
      name: 'Amoxicillin',
      type: 'medication',
      instructions:
        'Take 1 capsule 3 times a day with food. Finish the full 7-day course.',
      schedule: {
        kind: 'fixedTimes',
        times: ['08:00', '14:00', '20:00'],
        startDate: today,
        durationDays: 7,
      },
      medication: {
        genericName: 'Amoxicillin',
        dose: '1 capsule',
        strength: '500 mg',
        takeWithFood: true,
        prescribingPhysician: 'Dr. Nguyen, DDS',
      },
      warnings: ['Verify the strength (500 mg) — the printout was hard to read.'],
    },
    {
      id: makeId('draft'),
      include: true,
      name: 'Ibuprofen for pain',
      type: 'medication',
      instructions:
        'Take 1 tablet every 6 hours as needed for pain. Do not exceed 4 doses in 24 hours.',
      schedule: { kind: 'asNeeded', startDate: today, durationDays: 7 },
      medication: {
        genericName: 'Ibuprofen',
        dose: '1 tablet',
        strength: '600 mg',
        takeWithFood: true,
        avoidAlcohol: true,
      },
      warnings: ['As-needed medication: CareDose will not remind you automatically.'],
    },
    {
      id: makeId('draft'),
      include: true,
      name: 'Salt water rinse',
      type: 'woundCare',
      instructions:
        'Gently rinse with warm salt water. Do not spit forcefully or use a straw.',
      schedule: {
        kind: 'fixedTimes',
        times: ['09:00', '13:00', '17:00', '21:00'],
        startDate: toDateKey(addDays(new Date(), 1)),
        durationDays: 6,
      },
    },
    {
      id: makeId('draft'),
      include: true,
      name: 'Ice your cheek',
      type: 'iceTherapy',
      instructions: 'Ice pack on the outside of your cheek, 20 minutes on, 20 minutes off.',
      schedule: {
        kind: 'interval',
        everyHours: 2,
        windowStart: '10:00',
        windowEnd: '20:00',
        startDate: today,
        durationDays: 2,
      },
    },
    {
      id: makeId('draft'),
      include: true,
      name: 'Follow-up with Dr. Nguyen',
      type: 'appointment',
      instructions: 'Suture check at Lakeside Dental. Call 555-0177 if you cannot make it.',
      schedule: {
        kind: 'fixedTimes',
        times: ['14:00'],
        startDate: toDateKey(addDays(new Date(), 7)),
        endDate: toDateKey(addDays(new Date(), 7)),
      },
      warnings: ['Confirm the appointment date — the handwriting was unclear.'],
    },
  ];

  return {
    id: makeId('review'),
    documentId: doc.id,
    planName: 'Dental Surgery Recovery',
    planDescription: 'Extracted from your uploaded discharge instructions.',
    extractedAt: new Date().toISOString(),
    drafts: drafts.map((d) => ({ ...d, scheduleSummary: describeSchedule(d.schedule) })),
    warningNotes: [
      'This was read automatically from your document and may contain mistakes.',
      'One section ("activity restrictions") could not be read and was left out.',
    ],
    status: 'needsReview',
  };
}
