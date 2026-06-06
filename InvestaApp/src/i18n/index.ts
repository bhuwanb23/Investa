import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { profileTranslations } from '../language/pages/profile';
import { twoFactorAuthTranslations } from '../language/pages/twoFactorAuth';
import { securitySettingsTranslations } from '../language/pages/securitySettings';
import { privacySettingsTranslations } from '../language/pages/privacySettings';
import { homeTranslations } from '../language/pages/home';
import { progressTranslations } from '../language/pages/progress';
import { tradingTranslations } from '../language/pages/trading';
import { coursesTranslations } from '../language/pages/courses';

const pages = [
  profileTranslations,
  twoFactorAuthTranslations,
  securitySettingsTranslations,
  privacySettingsTranslations,
  homeTranslations,
  progressTranslations,
  tradingTranslations,
  coursesTranslations,
];

const LANGUAGES = ['en', 'hi', 'ta', 'te'] as const;

const resources: Record<string, { translation: Record<string, string> }> = {};
for (const lang of LANGUAGES) {
  const merged: Record<string, string> = {};
  for (const page of pages) {
    Object.assign(merged, page[lang]);
  }
  resources[lang] = { translation: merged };
}

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

export default i18next;
