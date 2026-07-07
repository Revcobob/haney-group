import { useColorScheme } from 'react-native';

import {
  baseFontSizes,
  darkColors,
  FontVariant,
  lightColors,
  Palette,
  textScaleMultipliers,
} from '@/theme/tokens';
import { useSettingsStore } from '@/store/settingsStore';

export interface Theme {
  colors: Palette;
  dark: boolean;
  /** Scale an arbitrary font size by the user's text-size preference. */
  font: (size: number) => number;
  /** Font size for a named variant, scaled. */
  fontFor: (variant: FontVariant) => number;
  reducedMotion: boolean;
}

/**
 * Resolves the active palette (light/dark) and the user's text-size
 * preference. OS-level font scaling still applies on top via
 * `allowFontScaling` (left enabled everywhere).
 */
export function useTheme(): Theme {
  const appearance = useSettingsStore((s) => s.appearance);
  const textScale = useSettingsStore((s) => s.textScale);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const system = useColorScheme();

  const dark = appearance === 'dark' || (appearance === 'system' && system === 'dark');
  const multiplier = textScaleMultipliers[textScale];

  const font = (size: number) => Math.round(size * multiplier);
  const fontFor = (variant: FontVariant) => font(baseFontSizes[variant]);

  return {
    colors: dark ? darkColors : lightColors,
    dark,
    font,
    fontFor,
    reducedMotion,
  };
}
