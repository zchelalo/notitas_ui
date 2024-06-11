import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { FiltroButton } from '@/components/FiltroButton'
import { Loading } from '@/pages/Home/Loading'
import { Modal } from '@/components/Modal'
const EditorNotita = lazy(() => import('@/components/EditorNotita').then(({ EditorNotita }) => ({ default: EditorNotita })))

import { HiOutlinePlus } from 'react-icons/hi2'

import './Home.css'

function Home() {
  const auth = useAuth()
  const { t } = useTranslation()

  const { data: notitas, setData: setNotitas, loading: loadingNotitas, error: errorNotitas } = useFetch({
    url: '/notitas_back/api/v1/notitas/usuarios',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.usuario.token}`,
    }
  })

  const [openModal, setOpenModal] = useState(false)
  const [modal, setModal] = useState(null)
  const [nota, setNota] = useState({})

  const [notas, setNotas] = useState([])

  return (
    <div className='p-6'>
      {(openModal && modal) ? (
        <Suspense>
          <Modal>
            {modal === 'update' ? (
              <Suspense>
                <EditorNotita
                  notita={nota}
                  setNotitas={setNotitas}
                  setOpenModal={setOpenModal}
                  accion={modal}
                />
              </Suspense>
            ) : (modal === 'create' ? (
              <Suspense>
                <EditorNotita
                  setNotitas={setNotitas}
                  setOpenModal={setOpenModal}
                  accion={modal}
                />
              </Suspense>
            ) : undefined)}
          </Modal>
        </Suspense>
      ) : undefined}

      <div className='flex flex-col items-start sm:flex-row sm:items-center justify-start sm:justify-between mb-2 sm:mb-6'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <h1 className='text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 font-bold mr-3'>
            {t('title_notitas')}
          </h1>
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
        </div>
        <div className='w-full sm:w-auto flex items-center justify-end'>
          <FiltroButton
            notitas={notitas}
            setNotas={setNotas}
          />
        </div>
      </div>
      {loadingNotitas ? <Loading /> : undefined}
      {(!loadingNotitas && errorNotitas) ? <p>Error: {errorNotitas}</p> : undefined}
      {(!loadingNotitas && !errorNotitas && notas?.length > 0) ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4, 1500: 5 }}>
          <Masonry gutter='1rem'>
            {notas?.map(notita => (
              <div
                key={notita.id}
                className={`w-full max-h-[40vh] block border-2 ${!notita.color ? 'border-zinc-900' : undefined} rounded p-2 box-border overflow-hidden home-notita cursor-pointer`}
                style={notita.color ? { borderColor: notita.color } : undefined}
                onClick={() => {
                  setNota(notita)
                  setModal('update')
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
      ) : loadingNotitas ? undefined : (
        <div>No hay notitas</div>
      )}
      
    </div>
  )
}

export { Home }