import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function useIdioma() {
  const { i18n } = useTranslation()
  const [idioma, setIdioma] = useState(localStorage.getItem('idioma') || '')

  useEffect(() => {
    const idiomaGuardado = localStorage.getItem('idioma')
    if (!idiomaGuardado) {
      const idiomaSistema = navigator.language

      if (idiomaSistema !== 'es' && idiomaSistema !== 'en') {
        setIdioma('es')
        i18n.changeLanguage('es')
        localStorage.setItem('idioma', 'es')
        return
      }

      setIdioma(idiomaSistema)
      i18n.changeLanguage(idiomaSistema)
      localStorage.setItem('idioma', idiomaSistema)
    }
    
    if (idiomaGuardado) {
      setIdioma(idiomaGuardado)
      i18n.changeLanguage(idiomaGuardado)
    }
  }, [i18n])

  const handleChangeIdioma = (value) => {
    if (value === 'es' || value === 'en') {
      setIdioma(value)
      i18n.changeLanguage(value)
      localStorage.setItem('idioma', value)
    } else {
      setIdioma('es')
      i18n.changeLanguage('es')
      localStorage.setItem('idioma', 'es')
    }
  }

  return { idioma, handleChangeIdioma }
}

export { useIdioma }