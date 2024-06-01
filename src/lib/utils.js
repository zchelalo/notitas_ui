import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from 'jwt-decode'
import { back_url } from '@/config/const'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const crearUsuarioByTokenResponse = (respuesta) => {
  let tokenDecoded = jwtDecode(respuesta.token)
  // const expDate = new Date(tokenDecoded.exp * 1000)

  const usuario = {
    token: respuesta.token,
    id: tokenDecoded.sub,
    rol: tokenDecoded.rol,
    nombre: respuesta.nombre
  }

  return usuario
}

export const obtenerUsuarioDesdeStorage = () => {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

export const guardarUsuarioEnStorage = (usuario) => {
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export const primeraMayuscula = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const fetchData = async ({
  url,
  method = 'GET',
  body = null,
  headers = { 'Content-Type': 'application/json' },
  credentials,
  setUsuario
}) => {
  try {
    const response = await fetch(`${back_url}${url}`, {
      method: method,
      headers: headers,
      body: body,
      credentials
    })

    if (!response.ok) { 
      if (response.status === 401) { // 401 Unauthorized
        // Intentar renovar el token
        const refreshResponse = await fetch(`${back_url}/notitas_auth/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' // Esto es para incluir las cookies httpOnly en la solicitud
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          // Guardar el nuevo token en local storage
          const usuario = crearUsuarioByTokenResponse(refreshData)
          guardarUsuarioEnStorage(usuario)
          setUsuario(usuario)

          // Guardar el nuevo token en los encabezados
          headers = { ...headers, 'Authorization': `Bearer ${refreshData.token}` }

          // Reintentar la solicitud original
          const retryResponse = await fetch(`${back_url}${url}`, {
            method: method,
            headers: headers,
            body: body
          })

          if (!retryResponse.ok) {
            if (isValidJSON(retryResponse)) {
              const retryResponseJson = await retryResponse.json()

              let error = undefined
              if (retryResponseJson.message) error = retryResponseJson.message
              if (retryResponseJson.error) error = retryResponseJson.error
              if (retryResponseJson.detail?.message) error = retryResponseJson.detail.message
              if (retryResponseJson.detail?.error) error = retryResponseJson.detail.error

              throw { status: retryResponse.status, error: error ? error : retryResponse.statusText }
            }
    
            throw { status: retryResponse.status, error: retryResponse.statusText }
          }

          const retryData = await retryResponse.json()
          return retryData
        } else {
          throw { status: refreshResponse.status, error: 'Failed to refresh token' }
        }
      } else {
        if (isValidJSON(response)) {
          const responseJson = await response.json()

          let error = undefined
          if (responseJson.message) error = responseJson.message
          if (responseJson.error) error = responseJson.error
          if (responseJson.detail?.message) error = responseJson.detail.message
          if (responseJson.detail?.error) error = responseJson.detail.error

          throw { status: response.status, error: error ? error : response.statusText }
        }

        throw { status: response.status, error: response.statusText }
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

function isValidJSON(value) {
  try {
      JSON.stringify(value)
      return true
  } catch (error) {
      return false
  }
}