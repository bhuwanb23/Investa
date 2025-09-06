import { translations } from './config';

export const useTranslation = (language: string = 'en') => {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  return {
    t,
    language,
  };
};
