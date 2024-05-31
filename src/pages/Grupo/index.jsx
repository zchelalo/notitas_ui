import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

import {
  HiOutlinePlusSmall,
  HiOutlineBarsArrowDown,
  HiOutlineAdjustmentsVertical,
  HiOutlineUserPlus,
  HiOutlineLockClosed,
  HiOutlineCog6Tooth
} from 'react-icons/hi2'

import imgGrupoDefecto from '@/assets/img/grupoDefecto.jpg'
import bannerGrupoDefecto from '@/assets/img/bannerGrupoDefecto.jpg'

import './Grupo.css'

function Grupo() {
  const { usuario } = useAuth()
  const { grupo_id } = useParams()
  const { data: grupo, loadingGrupo, errorGrupo } = useFetch({
    url: `/notitas_back/api/v1/grupos/${grupo_id}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.token}`
    }
  })
  const { data: miembros, loadingMiembros, errorMiembros } = useFetch({
    url: `/notitas_back/api/v1/miembros_grupo?grupo_id=${grupo_id}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.token}`
    }
  })

  const infoMiembroUsuario = miembros?.find(miembro => miembro.usuario_id === usuario.id)
  const rolesAdministrativos = ['propietario', 'administrador']
  const editores = ['propietario', 'administrador', 'editor']

  return (
    <div className='w-full'>
      {loadingGrupo ? <p>Cargando...</p> : undefined}
      {(!loadingGrupo && errorGrupo) ? <p>Error: {error.message}</p> : undefined}
      {(
        !loadingGrupo
        && !errorGrupo
        && !loadingMiembros
        && !errorMiembros
        && grupo
        && miembros
      ) ? (
        <div className='w-full flex flex-col'>
          <figure className='w-full object-cover relative'>
            <img
              className='w-full h-full object-cover grupo-bannerFilter'
              src={grupo.banner ? grupo.banner : bannerGrupoDefecto}
              alt={grupo.nombre}
            />

            {infoMiembroUsuario && rolesAdministrativos.includes(infoMiembroUsuario.rol_grupo_clave) ? (
              <div className='absolute w-full top-0 right-0 flex justify-end items-center p-2 px-6'>
                <div className='flex items-center mt-3'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 mr-2 p-1 rounded cursor-pointer'>
                        <HiOutlineLockClosed className='text-xl' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Acceder a las notas privadas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
    
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer mr-2'>
                        <HiOutlineUserPlus className='text-xl' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Invitar a alguien</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer'>
                        <HiOutlineCog6Tooth className='text-xl' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Configuración del grupo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ) : undefined}

            <div className='absolute w-full bottom-0 left-0 flex justify-between items-center p-2 px-6'>
              <div className='flex items-center'>
                <figure>
                  {grupo.descripcion ? (
                    <HoverCard>
                      <HoverCardTrigger>
                        <img
                          className='rounded-full w-12 h-12 object-cover mr-4 border-2 border-zinc-100 dark:border-zinc-900 cursor-pointer'
                          src={grupo.profile_pic ? grupo.profile_pic : imgGrupoDefecto}
                          alt={grupo.nombre}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {grupo.descripcion}
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <img
                      className='rounded-full w-12 h-12 object-cover mr-4 border-2 border-zinc-100 dark:border-zinc-900'
                      src={grupo.profile_pic ? grupo.profile_pic : imgGrupoDefecto}
                      alt={grupo.nombre}
                    />
                  )}
                </figure>
                <h1 className='text-4xl font-bold mr-4'>{grupo.nombre}</h1>
                {infoMiembroUsuario && editores.includes(infoMiembroUsuario.rol_grupo_clave) ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer'>
                          <HiOutlinePlusSmall className='text-xl' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Agregar notita</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : undefined}
              </div>

              <div className='flex items-center'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer mr-2'>
                      <HiOutlineBarsArrowDown className='text-xl' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ordenar por fecha</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer'>
                      <HiOutlineAdjustmentsVertical className='text-xl' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar por</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

          </figure>
          
          <div className='p-4'>
            NOTAS
          </div>
        </div>
      ) : undefined}
    </div>
  )
}

export { Grupo }