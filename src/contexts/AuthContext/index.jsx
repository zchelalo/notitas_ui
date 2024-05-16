import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'

import { obtenerUsuarioDesdeCookies } from '@/lib/utils'
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
      const usuarioCookie = obtenerUsuarioDesdeCookies()
      if (usuarioCookie) {
        setUsuario(usuarioCookie)
      } 
      setUsuarioVerificado(true)
    } catch (error) {
      console.error('Error al obtener usuario desde cookies:', error)
      navigate('/home')
    }
  }, [])

  const login = async (correo, password) => {
    try {
      const response = await fetchData({
        url: `/notitas_auth/api/v1/auth/login`,
        method: 'POST',
        body: JSON.stringify({
          correo,
          password
        })
      })

      let tokenDecoded = jwtDecode(response.token)
      const expDate = new Date(tokenDecoded.exp * 1000)

      const usuarioResponse = {
        token: response.token,
        id: tokenDecoded.sub,
        rol: tokenDecoded.rol,
        nombre: response.nombre
      }

      Cookies.set('usuario', JSON.stringify(usuarioResponse), { expires: expDate })
      setUsuario(usuarioResponse)
      navigate('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.error,
        status: 'error'
      })
    }
  }

  const logout = () => {
    Cookies.remove('usuario')
    setUsuario(null)
    navigate('/home')
  }

  const auth = { usuario, usuarioVerificado, login, logout }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }