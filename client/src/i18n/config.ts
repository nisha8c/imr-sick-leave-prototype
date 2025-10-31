import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import sv from './locales/sv.json';
import de from './locales/de.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            sv: { translation: sv },
            de: { translation: de },
        },
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;