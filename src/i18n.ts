import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation';
import zhCN from './locales/zh-CN/translation';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      'zh-CN': zhCN,
      zh: zhCN, // Fallback for 'zh' to 'zh-CN'
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
        order: ['querystring', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lang',
    }
  });

export default i18n;
