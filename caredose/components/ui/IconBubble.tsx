import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

interface IconBubbleProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
  size?: number;
}

/** Decorative icon in a soft circle. Always paired with visible text nearby. */
export function IconBubble({ icon, color, background, size = 48 }: IconBubbleProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={icon} size={Math.round(size * 0.55)} color={color} />
    </View>
  );
}
