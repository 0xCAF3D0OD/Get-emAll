import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, type ColorToken } from '@/theme';
import type { FaceCrop, ImageAsset } from '@/types/characters';

export type AvatarSize = 40 | 44 | 56 | 64 | 80 | 96 | 120;

export type AvatarProps = {
  image: ImageAsset;
  face: FaceCrop;
  size?: AvatarSize;
  bg?: ColorToken;
  /** Initiale affichée si l'image manque. */
  initial: string;
  /** Qui et quelle émotion ; sans libellé, l'avatar est décoratif. */
  accessibilityLabel?: string;
  /** Transition d'image (ms) quand l'expression change. */
  transition?: number;
};

/**
 * Avatar rond : l'image est agrandie et décalée pour cadrer le visage, pas le corps.
 * Carré de visage = s × hauteur de l'image, centré en (0,5 ; cy).
 */
export function Avatar({
  image,
  face,
  size = 44,
  bg = 'peachBg',
  initial,
  accessibilityLabel,
  transition = 0,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const h = size / face.s;
  const w = (h * image.width) / image.height;
  const decorative = !accessibilityLabel;

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[bg] },
      ]}
    >
      {failed ? (
        <AppText variant="h3" align="center" color="ink">
          {initial}
        </AppText>
      ) : (
        <Image
          source={image.source}
          transition={transition}
          contentFit="contain"
          onError={() => {
            console.warn(`TODO(asset) : image d'avatar introuvable (${initial})`);
            setFailed(true);
          }}
          style={{
            position: 'absolute',
            width: w,
            height: h,
            left: size / 2 - w / 2,
            top: size / 2 - face.cy * h,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
