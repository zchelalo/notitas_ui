import { createContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'

import { crearUsuarioByTokenResponse, obtenerUsuarioDesdeStorage, guardarUsuarioEnStorage } from '@/lib/utils'
import { fetchData } from '@/lib/utils'

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

      const usuario = crearUsuarioByTokenResponse(response)
      guardarUsuarioEnStorage(usuario)      
      setUsuario(usuario)
      navigate('/')
    } catch (error) {
      if (error.status === 401) {
        await logout()
      }

      toast({
        title: 'Error',
        description: error.error,
        status: 'error'
      })
    }
  }

  const register = async (nombre, correo, password) => {
    try {
      const response = await fetchData({
        url: `/notitas_auth/api/v1/auth/registro`,
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          nombre,
          correo,
          password
        })
      })

      const usuario = crearUsuarioByTokenResponse(response)
      guardarUsuarioEnStorage(usuario)
      setUsuario(usuario)
      navigate('/')
    } catch (error) {
      console.log(error)
      if (error.status === 401) {
        await logout()
      }

      toast({
        title: 'Error',
        description: error.error,
        status: 'error'
      })
    }
  }

  const logout = async () => {
    try {
      const response = await fetchData({
        url: '/notitas_auth/api/v1/auth/logout',
        method: 'POST',
        credentials: 'include'
      })

      toast({
        title: response.message
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

  const auth = { usuario, usuarioVerificado, login, register, logout }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }