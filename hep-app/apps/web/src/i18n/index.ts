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

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('hep-lang', lng)
  // Update html lang attribute for proper font rendering (Tamil vs Latin)
  document.documentElement.lang = lng === 'ta' ? 'ta' : 'en'
})

// Set initial lang attribute
document.documentElement.lang = (localStorage.getItem('hep-lang') || 'en') === 'ta' ? 'ta' : 'en'

export default i18n
