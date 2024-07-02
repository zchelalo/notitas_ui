import { useTranslation } from 'react-i18next'

import { rolesAdministrativos, editores } from '@/config/const'

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
import { OpcionesAdministrativas } from '@/pages/Grupo/OpcionesAdministrativas'
import { FiltroButton } from '@/components/FiltroButton'

import { HiOutlinePlus } from 'react-icons/hi2'

import imgGrupoDefecto from '@/assets/img/grupoDefecto.jpg'
import bannerGrupoDefecto from '@/assets/img/bannerGrupoDefecto.jpg'

function Banner({
  setModal,
  setOpenModal,
  notitas,
  setNotas,
  grupo,
  infoMiembro
}) {
  const { t } = useTranslation()

  return (
    <figure className='w-full object-cover relative'>
      <img
        className='w-full h-full object-cover grupo-bannerFilter'
        src={grupo.banner ? grupo.banner : bannerGrupoDefecto}
        alt={grupo.nombre}
      />

      {rolesAdministrativos.includes(infoMiembro[0].rol_grupo_clave) ? (
        <OpcionesAdministrativas
          grupo={grupo}
        /> 
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
          {editores.includes(infoMiembro[0].rol_grupo_clave) ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className='btn-icon p-1 rounded cursor-pointer'
                  onClick={() => {
                    setModal('create')
                    setOpenModal(true)
                  }}
                >
                  <HiOutlinePlus className='text-xl' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('add_notita')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : undefined}
        </div>

        <div className='flex items-center'>
          <FiltroButton
            notitas={notitas}
            setNotas={setNotas}
          />
        </div>
      </div>

    </figure>
  )
}

export { Banner }