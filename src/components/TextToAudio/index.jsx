import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useToast } from '@/components/ui/use-toast'

import { fetchData } from '@/lib/utils'
import { convert } from 'html-to-text'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/Modal'

import {
  HiOutlineSpeakerWave,
  HiOutlineXMark
} from 'react-icons/hi2'

function TextToAudio({
  nota
}) {
  const { t } = useTranslation()
  const auth = useAuth()
  const { toast } = useToast()

  const [openModal, setOpenModal] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const transcription = async () => {
    try {
      const options = {
        selectors: [
          {
            selector: 'a',
            options: {
              ignoreHref: true
            }
          },
          {
            selector: 'img',
            format: 'skip'
          }
        ]
      }

      const audio = await fetchData({
        url: '/notitas_back/api/v1/transcripcion/text_to_speech',
        method: 'POST',
        body: JSON.stringify({
          texto: convert(nota, options)
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.usuario.token}`
        },
        setUsuario: auth.setUsuario,
        esAudio: true
      })

      const audioBlob = await audio.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrl(audioUrl)
      setOpenModal(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error has ocurred at the moment to transcribe the notita'
      })
    }
  }

  return (
    <div className='relative'>
      {openModal ? (
        <Modal>
          <div className='w-full h-full flex justify-center items-center ml-10 md:ml-12'>
            {audioUrl ? (
              <div className='w-1/2 lg:w-1/4 flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded p-3'>
                <div className='w-full flex flex-col justify-between items-center mb-3'>
                  <div className='w-full flex justify-between items-center mb-3'>
                    <h1>
                      Texto transcrito
                    </h1>
                    <Button
                      onClick={() => {
                        setAudioUrl('')
                        setOpenModal(false)
                      }}
                      className='btn p-2 rounded cursor-pointer m-1'>
                      <HiOutlineXMark />
                    </Button>
                  </div>
                  <audio
                    className='w-full'
                    controls
                    src={audioUrl}
                  />
                </div>
              </div>
            ) : (
              <div className='w-1/2 lg:w-1/4 flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded p-3'>
                <div className='w-full flex justify-between items-center mb-3'>
                  <div className='w-full flex justify-between items-center mb-3'>
                    <h1>
                      Error al transcribir el texto
                    </h1>
                    <Button
                      onClick={() => {
                        setAudioUrl('')
                        setOpenModal(false)
                      }}
                      className='btn p-2 rounded cursor-pointer m-1'>
                      <HiOutlineXMark />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      ) : undefined}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            type='button'
            className='btn-icon mr-1 p-2 text-sm rounded'
            onClick={() => {
              transcription()
            }}
          >
            <HiOutlineSpeakerWave />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('change_color')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export { TextToAudio }