import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useTranslation } from 'react-i18next'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Modal } from '@/components/Modal'
import { Loading } from '@/pages/Home/Loading'
import { Banner } from '@/pages/Grupo/Banner'
const EditorNotita = lazy(() => import('@/components/EditorNotita').then(({ EditorNotita }) => ({ default: EditorNotita })))

import './Grupo.css'

function Grupo() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { grupo_id: grupoId } = useParams()

  const { data: grupo, loading: loadingGrupo, error: errorGrupo } = useFetch({
    url: `/notitas_back/api/v1/grupos/${grupoId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.usuario.token}`
    }
  })
  const { data: infoMiembro, loading: loadingInfoMiembro, error: errorInfoMiembro } = useFetch({
    url: `/notitas_back/api/v1/miembros_grupo?grupo_id=${grupoId}&solo_usuario=true`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.usuario.token}`
    }
  })
  const { data: notitas, setData: setNotitas, loading: loadingNotitas, error: errorNotitas } = useFetch({
    url: `/notitas_back/api/v1/notitas/grupos/${grupoId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.usuario.token}`
    }
  })

  const [openModal, setOpenModal] = useState(false)
  const [modal, setModal] = useState(null)
  const [nota, setNota] = useState({})

  const [notas, setNotas] = useState([])

  useEffect(() => {
    if (!loadingGrupo && !grupo) navigate('/')
    if (!loadingInfoMiembro && !infoMiembro) navigate('/')
  }, [loadingGrupo, grupo, loadingInfoMiembro, infoMiembro])

  return (
    <div className='w-full'>
      {(openModal && modal) ? (
        <Suspense>
          <Modal>
            {modal === 'update' ? (
              <Suspense>
                <EditorNotita
                  notaGrupal={true}
                  grupoId={grupoId}
                  rol={infoMiembro[0].rol_grupo_clave}
                  notita={nota}
                  setNotitas={setNotitas}
                  setOpenModal={setOpenModal}
                  accion={modal}
                />
              </Suspense>
            ) : (modal === 'create' ? (
              <Suspense>
                <EditorNotita
                  notaGrupal={true}
                  grupoId={grupoId}
                  rol={infoMiembro[0].rol_grupo_clave}
                  setNotitas={setNotitas}
                  setOpenModal={setOpenModal}
                  accion={modal}
                />
              </Suspense>
            ) : undefined)}
          </Modal>
        </Suspense>
      ) : undefined}

      {loadingGrupo ? <p>Cargando...</p> : undefined}
      {(!loadingGrupo && errorGrupo) ? <p>Error: {errorGrupo}</p> : undefined}
      {(
        !loadingGrupo &&
        !errorGrupo &&
        !loadingInfoMiembro &&
        !errorInfoMiembro &&
        grupo &&
        infoMiembro
      ) ? (
        <div className='w-full flex flex-col'>
          <Banner
            setModal={setModal}
            setOpenModal={setOpenModal}
            notitas={notitas}
            setNotas={setNotas}
            grupo={grupo}
            infoMiembro={infoMiembro}
          />
          
          <div className='p-6 w-full'>
          {loadingNotitas ? <Loading /> : undefined}
          {(!loadingNotitas && errorNotitas) ? <p>Error: {errorNotitas}</p> : undefined}
          {(!loadingNotitas && !errorNotitas && notas?.length > 0) ? (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4, 1500: 5 }}>
              <Masonry gutter='1rem'>
                {notas?.map(notita => (
                  <div
                    key={notita.id}
                    className={`w-full max-h-[40vh] block border-2 ${!notita.color ? 'border-zinc-900' : undefined} rounded p-2 box-border overflow-hidden grupo-notita cursor-pointer`}
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
        </div>
      ) : undefined}
    </div>
  )
}

export { Grupo }