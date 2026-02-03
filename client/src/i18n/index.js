import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import paTranslations from './locales/pa.json';
import bnTranslations from './locales/bn.json';
import teTranslations from './locales/te.json';
import taTranslations from './locales/ta.json';
import mlTranslations from './locales/ml.json';
import mrTranslations from './locales/mr.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  pa: {
    translation: paTranslations
  },
  bn: {
    translation: bnTranslations
  },
  te: {
    translation: teTranslations
  },
  ta: {
    translation: taTranslations
  },
  ml: {
    translation: mlTranslations
  },
  mr: {
    translation: mrTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'pa', 'bn', 'te', 'ta', 'ml', 'mr'],
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },

    // Ensure fallback behavior to prevent blank pages
    returnNull: false,
    returnEmptyString: false,
    saveMissing: false,
    
    // Prevent blank page on language change
    load: 'languageOnly',
    
    // Namespace settings
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;