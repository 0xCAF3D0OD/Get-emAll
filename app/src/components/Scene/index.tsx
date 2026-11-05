import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { recruiters, scenes } from '@/characters/registry';
import { useCharacterLabel } from '@/characters/useCharacterLabel';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, motion, radius } from '@/theme';
import type { Expression, RecruiterId } from '@/types/characters';

export const SCENE_HEIGHT = 392;
const DECOR_SHIFT = 78;
const CHARACTER_BOTTOM = 40;

export type SceneProps = {
  recruiter: RecruiterId;
  expression: Expression;
  /** Change de valeur pour déclencher le petit saut de réaction. */
  bounceKey?: number;
  /** Largeur de la scène ; par défaut la largeur disponible, mesurée. */
  width?: number;
};

/**
 * Trois calques : décor en cover décalé de 78 px vers le haut, personnage centré
 * (bas à 40 px du bas), bureau pleine largeur collé en bas qui cache les jambes.
 * Changement d'expression : fondu enchaîné de 200 ms (150 ms si animations réduites).
 */
export function Scene({ recruiter, expression, bounceKey = 0, width }: SceneProps) {
  // Largeur mesurée à l'affichage : la page web statique est rendue sans fenêtre, et le
  // premier rendu du navigateur doit être identique à celui du serveur.
  const [mesure, setMesure] = useState(0);
  const W = width ?? mesure;
  const onLayout = (ev: LayoutChangeEvent) => setMesure(ev.nativeEvent.layout.width);
  const reduced = useReducedMotion();
  const label = useCharacterLabel();
  const r = recruiters[recruiter];
  const img = r.expressions[expression];
  const charH = r.sceneHeight;
  const charW = (charH * img.width) / img.height;
  const decorH = Math.max(
    SCENE_HEIGHT + DECOR_SHIFT,
    (W * scenes.decor.height) / scenes.decor.width,
  );
  const decorW = (decorH * scenes.decor.width) / scenes.decor.height;
  const deskH = (W * scenes.bureau.height) / scenes.bureau.width;

  const jump = useSharedValue(0);
  useEffect(() => {
    if (bounceKey === 0 || reduced) return;
    jump.value = withSequence(
      withTiming(-14, { duration: motion.fast, easing: motion.enter }),
      withTiming(0, { duration: motion.standard }),
    );
  }, [bounceKey, reduced, jump]);
  const jumpStyle = useAnimatedStyle(() => ({ transform: [{ translateY: jump.value }] }));

  return (
    <View
      testID="scene"
      onLayout={width ? undefined : onLayout}
      style={[styles.zone, width ? { width } : styles.full]}
    >
      {W > 0 ? (
        <>
          <Image
            source={r.scene}
            contentFit="cover"
            accessible={false}
            style={{
              position: 'absolute',
              width: decorW,
              height: decorH,
              top: -DECOR_SHIFT,
              left: (W - decorW) / 2,
            }}
          />
          <Animated.View
            accessible
            accessibilityRole="image"
            accessibilityLabel={label.recruiter(recruiter, expression)}
            style={[
              { position: 'absolute', width: charW, height: charH },
              { left: (W - charW) / 2, bottom: CHARACTER_BOTTOM },
              jumpStyle,
            ]}
          >
            <Image
              source={img.source}
              contentFit="contain"
              transition={reduced ? motion.reducedFade : motion.expression}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Image
            source={scenes.bureau.source}
            contentFit="cover"
            accessible={false}
            style={{ position: 'absolute', width: W, height: deskH, left: 0, bottom: 0 }}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  zone: {
    height: SCENE_HEIGHT,
    overflow: 'hidden',
    borderBottomLeftRadius: radius.scene,
    borderBottomRightRadius: radius.scene,
    backgroundColor: colors.peachBg,
  },
});
