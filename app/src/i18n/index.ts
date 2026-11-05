import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './de.json';
import en from './en.json';
import fr from './fr.json';

/** Français seulement en phase 1 ; de et en sont prévus (vides). */
export const resources = {
  fr: { translation: fr },
  de: { translation: de },
  en: { translation: en },
} as const;

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  initAsync: false,
});

export default i18n;
