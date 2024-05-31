import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetch } from '@/hooks/useFetch'

import { useAuth } from '@/contexts/AuthContext/useAuth'

import { Button } from '@/components/ui/button'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import {
  HiMiniPlus,
  HiOutlineAdjustmentsVertical,
  HiBarsArrowDown,
} from 'react-icons/hi2'

function Home() {
  const { usuario } = useAuth()
  const { t } = useTranslation()

  const {
    data: notas,
    loading,
    error,
  } = useFetch({
    url: ':8000/api/v1/notitas/usuarios',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${usuario.token}`,
    },
    credentials: 'include',
  })

  useEffect(() => {}, [usuario.token, usuario.id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <ResponsiveMasonry
      className='p-4'
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
    >
      <div className='py-3 flex flex-row items-center justify-between'>
        <div className='flex items-center'>
          <h1 className='mb-3 text-3xl text-black dark:text-white font-bold'>
            {t('title_notitas')}
          </h1>
          <Button className='m-2 justify-center bg-white hover:bg-zinc-300 dark:bg-zinc-400 dark:hover:bg-zinc-200'>
            <HiMiniPlus className='text-black' />
          </Button>
        </div>
        <div className='flex items-center'>
          <Button className=' m-2 justify-center bg-white hover:bg-zinc-300 dark:bg-zinc-400 dark:hover:bg-zinc-200 '>
            <HiBarsArrowDown className='text-black' />
          </Button>
          <Button className='justify-center bg-white hover:bg-zinc-300 dark:bg-zinc-400 dark:hover:bg-zinc-200'>
            <HiOutlineAdjustmentsVertical className='text-black' />
          </Button>
        </div>
      </div>
      <Masonry gutter='10px'>
        {notas ? (
          notas.map((notita, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                width: '100%',
                display: 'block',
                border: '2px solid #000',
                padding: '10px',
                boxSizing: 'border-box',
                maxHeight: '500px',
                overflow: 'hidden',
              }}
            >
              <h2 className='text-xl'>{notita.titulo}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: notita.nota }}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              ></div>
            </div>
          ))
        ) : (
          <div>Cargando...</div>
        )}
      </Masonry>
    </ResponsiveMasonry>
  )
}

export { Home }
