import { profileTranslations } from './pages/profile';
import { twoFactorAuthTranslations } from './pages/twoFactorAuth';
import { securitySettingsTranslations } from './pages/securitySettings';
import { privacySettingsTranslations } from './pages/privacySettings';

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
  },
  hi: {
    ...profileTranslations.hi,
    ...twoFactorAuthTranslations.hi,
    ...securitySettingsTranslations.hi,
    ...privacySettingsTranslations.hi,
  },
  ta: {
    ...profileTranslations.ta,
    ...twoFactorAuthTranslations.ta,
    ...securitySettingsTranslations.ta,
    ...privacySettingsTranslations.ta,
  },
  te: {
    ...profileTranslations.te,
    ...twoFactorAuthTranslations.te,
    ...securitySettingsTranslations.te,
    ...privacySettingsTranslations.te,
  },
};

export type TranslationKey = keyof typeof translations.en;
