import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useTranslation } from 'react-i18next'

import { fetchData } from '@/lib/utils'

import { Typewriter } from 'react-simple-typewriter'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/button'

import {
  HiOutlineXMark,
  HiOutlinePlus
} from 'react-icons/hi2'

function ModalAudio({
  audioBlob,
  setAudioBlob,

  setModalAudio,

  setNota
}) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const auth = useAuth()

  const [transcribirLoading, setTranscribirLoading] = useState(false)

  const transcribirAudio = async () => {
    try {
      setTranscribirLoading(true)

      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('file', audioFile)

      const response = await fetchData({
        // url: `/notitas_back/api/v1/notitas/transcripcion`,
        url: `/notitas_back/api/v1/transcripcion/audio_trascription`,
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${auth.usuario.token}`
        },
        setUsuario: auth.setUsuario
      })

      if (!response.transcripcion) {
        toast({
          description: t('transcription_error')
        })
        return
      }

      setNota(prevNota => prevNota + response.transcripcion)

      toast({
        description: t('audio_transcription_success')
      })
    } catch (error) {
      if (error?.status && error.status === 401) {
        auth.logout()
      }

      toast({
        title: 'Error',
        description: t('audio_transcription_error')
      })
    } finally {
      setTranscribirLoading(false)
      setAudioBlob(null)
      setModalAudio(false)
    }
  }

  return (
    <Modal>
      <div className='w-full h-full flex justify-center items-center ml-10 md:ml-12'>
        <div className='w-1/2 lg:w-1/4 flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded p-3'>
          <div className='w-full flex justify-between items-center mb-3'>
            <h1>
              Transformar audio a texto
            </h1>
            <Button
              type='button'
              onClick={() => {
                setAudioBlob(null)
                setModalAudio(false)
              }}
              disabled={transcribirLoading}
              className='btn-icon p-2'
            >
              <HiOutlineXMark />
            </Button>
          </div>
          <div className='w-full flex flex-col'>
            <Button
              type='button'
              onClick={transcribirAudio}
              className='w-auto btn p-2 flex items-center'
              disabled={transcribirLoading}
            >
              <span className='mr-2'>
                Agregar a la notita
              </span>
              <HiOutlinePlus />
            </Button>
            {transcribirLoading ? (
              <small className='mt-2'>
                <Typewriter
                  words={[t('transcribing_audio')]}
                  loop={true}
                  cursor
                  cursorStyle='_'
                  typeSpeed={90}
                  deleteSpeed={90}
                  delaySpeed={1000}
                />
              </small>
            ) : undefined}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { ModalAudio }