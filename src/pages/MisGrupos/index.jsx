import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { NavLink, useLocation } from 'react-router-dom'

import { primeraMayuscula } from '@/lib/utils'

import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'

import imgGrupoDefecto from '@/assets/img/grupoDefecto.jpg'

import './MisGrupos.css'

function MisGrupos() {
  const { usuario } = useAuth()
  const location = useLocation()

  const { data: grupos, loading, error } = useFetch({
    url: '/notitas_back/api/v1/miembros_grupo',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.token}`
    }
  })

  return (
    <div className='w-full text-zinc-900 dark:text-zinc-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
      <h1 className='text-2xl font-bold col-span-full mb-4'>Mis Grupos</h1>
      {loading ? <p>Cargando...</p> : undefined}
      {(!loading && error) ? <p>Error: {error.message}</p> : undefined}
      {(!loading && !error && grupos?.length > 0) ? (
        grupos.map(grupo => (
          <NavLink
            key={grupo.grupo_id}
            to={location.pathname + '/' + grupo.grupo_id}
          >
            <Card className='misGrupos-card h-full flex flex-col'>
              <CardHeader className='pb-0'>
                <CardTitle>
                  <figure className='w-full flex justify-start items-center'>
                    <img
                      className='rounded-full w-16 h-16 object-cover mr-2'
                      src={grupo.grupo_profile_pic ? grupo.grupo_profile_pic : imgGrupoDefecto}
                      alt={grupo.grupo_nombre}
                    />
                    <figcaption>{grupo.grupo_nombre}</figcaption>
                  </figure>
                </CardTitle>
                <CardDescription>{grupo.grupo_descripcion}</CardDescription>
              </CardHeader>
              <CardFooter className='pb-2 pt-3 flex justify-end'>
                <small className='text-muted-foreground'>
                  {primeraMayuscula(grupo.rol_grupo_clave)}
                </small>
              </CardFooter>
            </Card>
          </NavLink>
        ))
      ) : <p>No hay grupos</p>}
    </div>
  )
}

export { MisGrupos }