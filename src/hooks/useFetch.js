import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import { fetchData } from '@/lib/utils'

function useFetch({ url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' } }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const auth = useAuth()

  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const obtenerData = async () => {
      try {
        const response = await fetchData({
          url: url,
          method: method,
          headers: headers,
          body: body
        })

        setData(response)
        setError(null)
      } catch (error) {
        toast({
          title: 'Error',
          description: error.error,
          status: 'error'
        })
    
        if (error.status === 401) {
          auth.logout()
        }

        setError(error.error)
      } finally {
        setLoading(false)
      }
    }

    obtenerData()
  }, [])

  return { data, setData, loading, error }
}

export { useFetch }