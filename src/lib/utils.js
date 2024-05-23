import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { back_url } from '@/config/const'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const obtenerUsuarioDesdeCookies = () => {
  const usuarioCookie = Cookies.get('usuario')
  return usuarioCookie ? JSON.parse(usuarioCookie) : null
}

export const guardarUsuarioEnCookies = (response) => {
  let tokenDecoded = jwtDecode(response.token)
  const expDate = new Date(tokenDecoded.exp * 1000)

  const usuarioResponse = {
    token: response.token,
    id: tokenDecoded.sub,
    rol: tokenDecoded.rol,
    nombre: response.nombre
  }

  Cookies.set('usuario', JSON.stringify(usuarioResponse), { expires: expDate })
}

export const primeraMayuscula = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const fetchData = async ({ url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' } }) => {
  try {
    const response = await fetch(`${back_url}${url}`, {
      method: method,
      headers: headers,
      body: body
    })

    if (!response.ok) { 
      if (response.status === 401) { // 401 Unauthorized
        // Intentar renovar el token
        const refreshResponse = await fetch(`${back_url}/notitas_auth/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include' // Esto es para incluir las cookies httpOnly en la solicitud
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          // Guardar el nuevo token en las cookies
          guardarUsuarioEnCookies(refreshData)

          // Guardar el nuevo token en los encabezados
          headers = { ...headers, 'Authorization': `Bearer ${refreshData.token}` }

          // Reintentar la solicitud original
          const retryResponse = await fetch(`${back_url}${url}`, {
            method: method,
            headers: headers,
            body: body
          })

          if (!retryResponse.ok) {
            throw { status: retryResponse.status, error: retryResponse.statusText }
          }

          const retryData = await retryResponse.json()
          return retryData
        } else {
          throw { status: refreshResponse.status, error: 'Failed to refresh token' }
        }
      } else {
        throw { status: response.status, error: response.statusText }
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}