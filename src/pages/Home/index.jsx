import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  HiOutlinePlus,
  HiOutlineAdjustmentsVertical,
  HiOutlineBarsArrowDown,
} from 'react-icons/hi2'
import { Modal } from '@/components/Modal'
import { CrearNotita } from '@/pages/Home/CrearNotita'

import './Home.css'

function Home() {
  const { usuario } = useAuth()
  const { t } = useTranslation()

  const { data: notitas, loadingNotitas, errorNotitas } = useFetch({
    url: '/notitas_back/api/v1/notitas/usuarios',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.token}`,
    }
  })

  const [openModal, setOpenModal] = useState(false)
  const [nota, setNota] = useState({})

  return (
    <div className='p-6'>
      {openModal ? (
        <Modal>
          <CrearNotita
            notita={nota}
            setOpenModal={setOpenModal}
            t={t}
          />
        </Modal>
      ) : undefined}

      <div className='flex flex-col items-start sm:flex-row sm:items-center justify-start sm:justify-between mb-2 sm:mb-6'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <h1 className='text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 font-bold mr-3'>
            {t('title_notitas')}
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer'>
                <HiOutlinePlus className='text-xl' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Agregar notita</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className='w-full sm:w-auto flex items-center justify-end'>
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
      {loadingNotitas ? <p>Cargando...</p> : undefined}
      {(!loadingNotitas && errorNotitas) ? <p>Error: {errorNotitas}</p> : undefined}
      {(!loadingNotitas && !errorNotitas && notitas?.length > 0) ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4 }}>
          <Masonry gutter='1rem'>
            {notitas?.map(notita => (
              <div
                key={notita.id}
                className={`w-full max-h-[30vh] block border-2 ${!notita.color ? 'border-zinc-900' : undefined} rounded p-2 box-border overflow-hidden home-notita cursor-pointer`}
                style={notita.color ? { borderColor: notita.color } : undefined}
                onClick={() => {
                  setNota(notita)
                  setOpenModal(true)
                }}
              >
                <h2 className='text-xl'>{notita.titulo}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: notita.nota }}
                  className='overflow-hidden'
                ></div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <div>No hay notas</div>
      )}
      
    </div>
  )
}

export { Home }
