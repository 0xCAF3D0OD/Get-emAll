import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, type ColorToken } from '@/theme';
import type { FaceCrop, ImageAsset } from '@/types/characters';

export type AvatarSize = 40 | 44 | 56 | 64 | 80 | 84 | 96 | 120;

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
  /** « face » cadre le visage ; « full » montre le personnage entier (profil, maquette 11). */
  framing?: 'face' | 'full';
};

/**
 * Avatar rond. Par défaut l'image est agrandie et décalée pour cadrer le visage :
 * carré de visage = s × hauteur de l'image, centré en (0,5 ; cy). En « full », le personnage
 * entier tient dans le rond.
 */
export function Avatar({
  image,
  face,
  size = 44,
  bg = 'peachBg',
  initial,
  accessibilityLabel,
  transition = 0,
  framing = 'face',
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const full = framing === 'full';
  const h = full ? size * 0.84 : size / face.s;
  const w = (h * image.width) / image.height;
  const top = full ? (size - h) / 2 : size / 2 - face.cy * h;
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
            top,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
