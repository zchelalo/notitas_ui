import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from 'jwt-decode'
import { back_url } from '@/config/const'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const crearUsuarioByTokenResponse = respuesta => {
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
  authRoute = false,
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
      if (response.status === 401 && authRoute) {
        throw await formatResponseError(response)
      }

      if (response.status === 401) { // 401 Unauthorized
        // Intentar renovar el token
        const refreshResponse = await fetch(`${back_url}/notitas_auth/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' // Esto es para incluir las cookies httpOnly en la solicitud
        })

        if (!refreshResponse.ok) {
          throw await formatResponseError(refreshResponse)
        }

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
          throw await formatResponseError(retryResponse)
        }

        const retryData = await retryResponse.json()
        return retryData
      }

      throw await formatResponseError(response)
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

async function formatResponseError(response) {
  if (isValidJSON(response)) {
    const responseJson = await response.json()

    let error = undefined
    if (responseJson.error) error = responseJson.error
    if (responseJson.message) error = responseJson.message
    if (responseJson.detail?.error) error = responseJson.detail.error
    if (responseJson.detail?.message) error = responseJson.detail.message

    return { status: response.status, error: error ? error : response.statusText }
  }

  return { status: response.status, error: response.statusText }
}