import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage from '../services/storage';

const LANGUAGE_KEY = '@investa_language';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    storage.getItem(LANGUAGE_KEY).then(saved => {
      if (saved) setSelectedLanguage(saved);
    });
  }, []);

  const setLanguage = async (language: string) => {
    setSelectedLanguage(language);
    await storage.setItem(LANGUAGE_KEY, language);
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage: setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
