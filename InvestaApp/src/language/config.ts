import { profileTranslations } from './pages/profile';
import { twoFactorAuthTranslations } from './pages/twoFactorAuth';
import { securitySettingsTranslations } from './pages/securitySettings';
import { privacySettingsTranslations } from './pages/privacySettings';
import { homeTranslations } from './pages/home';
import { progressTranslations } from './pages/progress';
import { tradingTranslations } from './pages/trading';
import { coursesTranslations } from './pages/courses';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

// Combined translations for all pages
export const translations = {
  en: {
    ...profileTranslations.en,
    ...twoFactorAuthTranslations.en,
    ...securitySettingsTranslations.en,
    ...privacySettingsTranslations.en,
    ...homeTranslations.en,
    ...progressTranslations.en,
    ...tradingTranslations.en,
    ...coursesTranslations.en,
  },
  hi: {
    ...profileTranslations.hi,
    ...twoFactorAuthTranslations.hi,
    ...securitySettingsTranslations.hi,
    ...privacySettingsTranslations.hi,
    ...homeTranslations.hi,
    ...progressTranslations.hi,
    ...tradingTranslations.hi,
    ...coursesTranslations.hi,
  },
  ta: {
    ...profileTranslations.ta,
    ...twoFactorAuthTranslations.ta,
    ...securitySettingsTranslations.ta,
    ...privacySettingsTranslations.ta,
    ...homeTranslations.ta,
    ...progressTranslations.ta,
    ...tradingTranslations.ta,
    ...coursesTranslations.ta,
  },
  te: {
    ...profileTranslations.te,
    ...twoFactorAuthTranslations.te,
    ...securitySettingsTranslations.te,
    ...privacySettingsTranslations.te,
    ...homeTranslations.te,
    ...progressTranslations.te,
    ...tradingTranslations.te,
    ...coursesTranslations.te,
  },
};

export type TranslationKey = keyof typeof translations.en;
