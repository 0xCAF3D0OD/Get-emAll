/**
 * Couleurs de get'emall, valeurs exactes de la maquette (PROMPT.md, « Tokens de design »).
 * Les 5 dernières viennent de la maquette sans figurer dans la table (décision D du 05.11.2026).
 */
export const colors = {
  bg: '#FFF7EE',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F0E8',
  track: '#EFE7DC',
  border: '#EADFD0',
  borderStrong: '#F1E8DC',
  ink: '#26243B',
  inkMuted: '#625C70',
  primary: '#2D4FCB',
  primaryDark: '#1F3A9E',
  primaryLight: '#E9EEFF',
  primaryRing: '#C9D3FF',
  success: '#1E6B3F',
  successBg: '#DDF1E4',
  successFill: '#9FD8B5',
  successDark: '#6FB68D',
  error: '#A3261E',
  errorDark: '#8C1D18',
  errorText: '#5C1A15',
  errorBg: '#FDE7E4',
  warningBg: '#FFE9B8',
  warningText: '#6B4500',
  hintStroke: '#8A5A00',
  streak: '#FF9F6B',
  streakBg: '#FFE6D6',
  xp: '#FFC94D',
  lavender: '#B9A6E8',
  lavenderBg: '#E6DEFA',
  peachBg: '#FFE3D3',
  coral: '#FF8FA3',
  // Couleurs de la maquette ajoutées (décision D).
  starS: '#A9D3F2',
  starT: '#C9B8EE',
  infoBg: '#DCEBFA',
  streakText: '#9A3F0E',
  leagueBg: '#EDEAF2',
  // Médailles du classement (PROMPT.md, LeaderboardRow).
  medalGold: '#FFC94D',
  medalSilver: '#D9D4CC',
  medalBronze: '#E9A777',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
