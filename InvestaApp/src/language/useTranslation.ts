import { translations } from './config';
import { useLanguage } from '../context/LanguageContext';

export const useTranslation = () => {
  const { selectedLanguage } = useLanguage();
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;
  
  return {
    t,
    language: selectedLanguage,
  };
};
