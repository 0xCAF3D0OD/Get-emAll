import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Vrai si l'utilisateur a demandé la réduction des animations (WCAG 2.3.3). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let actif = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (actif) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      actif = false;
      sub.remove();
    };
  }, []);
  return reduced;
}
