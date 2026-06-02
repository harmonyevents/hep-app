import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ta from './ta.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ta: { translation: ta } },
    lng: localStorage.getItem('hep-lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => localStorage.setItem('hep-lang', lng))

export default i18n
