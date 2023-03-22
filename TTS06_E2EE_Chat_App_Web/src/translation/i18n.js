import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEn from '../locales/en/Translation.json';
import translationVi from '../locales/vi/Translation.json';

const resources = {
    en: {
        translation: translationEn
    },
    vi: {
        translation: translationVi
    }
}

i18n.use(Backend).use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    debug: true,
    interpolation: {
        escapeValue: false
    }
})

export default i18n