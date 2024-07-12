import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import { fetchData } from '@/lib/utils'
import { jwtDecode } from 'jwt-decode'

import { Button } from '@/components/ui/button'

import './Invitacion.css'

import imgGrupoDefecto from '@/assets/img/grupoDefecto.jpg'

function Invitacion() {
  const auth = useAuth()
  const { token } = useParams()
  const [grupo, setGrupo] = useState({})

  useEffect(() => {
    const getInfo = async () => {
      try {
        if (!token) return undefined
        const jsonToken = jwtDecode(token)

        const grupo = await fetchData({
          url: `/notitas_back/api/v1/grupos/${jsonToken.grupo_id}`,
          headers: {
            'Content-Type': 'application-json',
            'Authorization': `Bearer ${auth.usuario.token}`
          },
          setUsuario: auth.setUsuario
        })
        setGrupo(grupo)
      } catch (error) {
        if (error?.status && error?.status === 401) {
          auth.logout()
        }

        toast({
          title: 'Error',
          description: t('get_grupo_error')
        })
      }
    }

    getInfo()
  }, [])

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='px-6 sm:px-10 py-3 sm:py-5 flex flex-col h-5/6 sm:h-auto items-center justify-between bg-zinc-100 dark:bg-zinc-900 overflow-y-auto overflow-x-hidden invitacion-shadow'>
        {grupo ? (
          <>
            <div className='flex flex-col items-center'>
              <h1 className='text-xl font-bold w-44 sm:w-52 lg:w-80 text-center'>
                Invitacion a {grupo.nombre}
              </h1>
              <figure className='mt-6'>
                <img
                  className='w-44 h-44 sm:w-52 sm:h-52 rounded'
                  src={grupo.profile_pic ? grupo.profile_pic : imgGrupoDefecto}
                  alt={grupo.nombre}
                />
              </figure>
              {grupo.description ? (
                <p className='w-44 sm:w-52 lg:w-80 mt-6'>
                  <small>{grupo.description}</small>
                </p>
              ) : undefined}
            </div>
            <Button className='btn w-44 sm:w-52 lg:w-80 mt-6'>
              Aceptar
            </Button>
          </>
        ) : undefined}
      </div>
    </div>
  )
}

export { Invitacion }
