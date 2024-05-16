import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie'
import { back_url } from '@/config/const'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const obtenerUsuarioDesdeCookies = () => {
  const usuarioCookie = Cookies.get('usuario')
  return usuarioCookie ? JSON.parse(usuarioCookie) : null
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
      throw { status: response.status, error: response.statusText }
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}