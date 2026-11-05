import 'i18next';

import type fr from './fr.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof fr };
  }
}
