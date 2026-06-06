import { useMemo } from 'react';
import i18n from '../i18n';
import { useLanguage } from '../context/LanguageContext';

export const useTranslation = () => {
  const { selectedLanguage } = useLanguage();
  const t = useMemo(
    () =>
      new Proxy({} as Record<string, string>, {
        get: (_, key: string) => i18n.t(key),
      }),
    [selectedLanguage],
  );
  return { t, language: selectedLanguage };
};
