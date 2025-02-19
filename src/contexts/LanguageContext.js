import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/ar';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
    preload: ['en', 'fr', 'ar'],
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  });

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);
  const [dir, setDir] = useState('ltr');
  const [isLoading, setIsLoading] = useState(false);

  const changeLanguage = async (lng) => {
    try {
      setIsLoading(true);
      await i18n.changeLanguage(lng);
      setLanguage(lng);
      moment.locale(lng);

      // Set text direction based on language
      setDir(lng === 'ar' ? 'rtl' : 'ltr');

      // Update HTML dir and lang attributes
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;

      // Store language preference
      localStorage.setItem('i18nextLng', lng);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize language settings
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'en';
    changeLanguage(savedLang);
  }, []);

  const value = {
    language,
    changeLanguage,
    dir,
    t: i18n.t,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
