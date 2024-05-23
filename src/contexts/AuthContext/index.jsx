import { createContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'

import { obtenerUsuarioDesdeStorage, guardarUsuarioEnStorage } from '@/lib/utils'
import { fetchData } from '@/lib/utils'
import { back_url } from '@/config/const'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [usuarioVerificado, setUsuarioVerificado] = useState(false)
  
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    try {
      const usuarioCookie = obtenerUsuarioDesdeStorage()
      if (usuarioCookie) {
        setUsuario(usuarioCookie)
      } 
      setUsuarioVerificado(true)
    } catch (error) {
      console.error('Error al obtener usuario desde el local storage:', error)
      navigate('/home')
    }
  }, [])

  const login = async (correo, password) => {
    try {
      const response = await fetchData({
        url: `/notitas_auth/api/v1/auth/login`,
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          correo,
          password
        })
      })

      guardarUsuarioEnStorage(response)      
      setUsuario(response)
      navigate('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.error,
        status: 'error'
      })
    }
  }

  const logout = async () => {
    try {
      const response = await fetch(`${back_url}/notitas_auth/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw { status: response.status, error: response.statusText }
      }

      const data = await response.json()

      toast({
        title: data.message
      })

      localStorage.removeItem('usuario')
      setUsuario(null)
      navigate('/landing')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.error
      })
    }
  }

  const auth = { usuario, usuarioVerificado, login, logout }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }