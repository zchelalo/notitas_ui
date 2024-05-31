import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import { NavLink, useLocation } from 'react-router-dom'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import imgGrupoDefecto from '@/assets/img/grupoDefecto.jpg'

import './MisGrupos.css'

function MisGrupos() {
  const { usuario } = useAuth()
  const location = useLocation()

  const { data: grupos, loading, error } = useFetch({
    url: '/notitas_back/api/v1/grupos',
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
            key={grupo.id}
            to={location.pathname + '/' + grupo.id}
          >
            <Card className='misGrupos-card h-full flex flex-col'>
              <CardHeader>
                <CardTitle>
                  <figure className='w-full flex justify-start items-center'>
                    <img
                      className='rounded-full w-16 h-16 object-cover mr-2'
                      src={grupo.profile_pic ? grupo.imagen : imgGrupoDefecto}
                      alt={grupo.nombre}
                    />
                    <figcaption>{grupo.nombre}</figcaption>
                  </figure>
                </CardTitle>
                <CardDescription>{grupo.descripcion}</CardDescription>
              </CardHeader>
            </Card>
          </NavLink>
        ))
      ) : <p>No hay grupos</p>}
    </div>
  )
}

export { MisGrupos }