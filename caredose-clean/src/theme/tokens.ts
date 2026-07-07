/**
 * CareDose design tokens.
 *
 * Calm, warm healthcare palette: warm off-white background, white cards,
 * deep navy text, soft blue accents. Green = completed, amber = due soon,
 * muted red is reserved for missed/urgent only. Status is never conveyed by
 * color alone — every status also has an icon and a text label.
 */

export interface Palette {
  background: string;
  card: string;
  cardPressed: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
  tabBar: string;
  inputBackground: string;
}

export const lightColors: Palette = {
  background: '#FAF6F0',
  card: '#FFFFFF',
  cardPressed: '#F3EDE4',
  text: '#1C2A4A',
  textSecondary: '#54617D',
  textMuted: '#7C8699',
  border: '#E8E0D4',
  accent: '#3D6EA8',
  accentSoft: '#E6EEF8',
  onAccent: '#FFFFFF',
  success: '#2F7D51',
  successSoft: '#E2F1E7',
  warning: '#9A6410',
  warningSoft: '#FBEED3',
  danger: '#A94A42',
  dangerSoft: '#F7E4E1',
  overlay: 'rgba(28, 42, 74, 0.45)',
  tabBar: '#FFFFFF',
  inputBackground: '#FDFBF7',
};

export const darkColors: Palette = {
  background: '#121A29',
  card: '#1D2739',
  cardPressed: '#273349',
  text: '#F3F1EA',
  textSecondary: '#B4BCCC',
  textMuted: '#8B94A8',
  border: '#2C3850',
  accent: '#85ACDD',
  accentSoft: '#24344E',
  onAccent: '#0F1826',
  success: '#7CC397',
  successSoft: '#1F3529',
  warning: '#E4AC55',
  warningSoft: '#3B2F17',
  danger: '#DE8A80',
  dangerSoft: '#3E2422',
  overlay: 'rgba(0, 0, 0, 0.55)',
  tabBar: '#1D2739',
  inputBackground: '#161F30',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

/** Base font sizes before the user's text-size preference is applied. */
export const baseFontSizes = {
  caption: 13,
  label: 15,
  body: 17,
  heading: 20,
  title: 26,
  hero: 34,
  jumbo: 44,
} as const;

export type FontVariant = keyof typeof baseFontSizes;

/** Multipliers for the in-app text size setting (on top of OS font scaling). */
export const textScaleMultipliers = {
  standard: 1,
  large: 1.15,
  extraLarge: 1.3,
} as const;

export type TextScaleChoice = keyof typeof textScaleMultipliers;

/** Minimum touch target for all interactive elements (a11y). */
export const MIN_TOUCH_TARGET = 48;
