import { useState, useEffect } from 'react'

function useTema() {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema')
    if (temaGuardado) {
      setTema(temaGuardado)
      setearTema(temaGuardado)
    } else {
      localStorage.setItem('tema', tema)
      setearTema(tema)
    }
  }, [tema])

  const setearTema = (tema) => {
    if (tema === 'dark') {
      document.querySelector('html').classList.add('dark')
    } else {
      document.querySelector('html').classList.remove('dark')
    }
  }

  const handleChangeTema = (value) => {
    if (value === 'dark') {
      setTema('dark')
      localStorage.setItem('tema', value)
    } else if (value === 'light') {
      setTema('light')
      localStorage.setItem('tema', value)
    } else {
      setTema('light')
      localStorage.setItem('tema', value)
    }
  }

  return { tema, handleChangeTema }
}

export { useTema }