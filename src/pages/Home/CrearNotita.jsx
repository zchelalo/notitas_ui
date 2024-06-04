import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import { fetchData } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import ReactQuill from 'react-quill'
import { RgbaStringColorPicker } from 'react-colorful'
import { Typewriter } from 'react-simple-typewriter'
import { AudioRecorder } from '@/components/AudioRecorder'
import { Modal } from '@/components/Modal'

import {
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
  HiOutlineXMark,
  HiOutlinePlus
} from 'react-icons/hi2'
import { IoColorPaletteOutline } from 'react-icons/io5'

import 'react-quill/dist/quill.snow.css'
import './Home.css'

function CrearNotita({ notita, setOpenModal, setNotitas, t }) {
  const { toast } = useToast()
  const auth = useAuth()

  const [nota, setNota] = useState(notita.nota)
  const [color, setColor] = useState(notita.color ? notita.color : '#000000')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [privada, setPrivada] = useState(notita.privada)

  const [modalAudio, setModalAudio] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcribirLoading, setTranscribirLoading] = useState(false)
  const mediaRecorderRef = useRef(null)

  useEffect(() => {
    if (audioBlob) {
      setModalAudio(true)
    }
  }, [audioBlob])

  const formSchema = z.object({
    titulo: z
      .string()
      .min(1, {
        message: t('titulo_min_validation'),
      })
      .max(255, {
        message: t('titulo_max_validation'),
      }),
    nota: z.string(),
    color: z.string(),
    privada: z.boolean()
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: notita.titulo,
      nota: notita.nota,
      color: notita.color,
      privada: notita.privada
    }
  })

  const onSubmit = async data => {
    try {
      data.color = color
      data.nota = nota

      if (
        data.titulo === notita.titulo &&
        data.nota === notita.nota &&
        data.color === notita.color &&
        data.privada === notita.privada
      ) {
        return setOpenModal(false)
      }

      const response = await fetchData({
        url: `/notitas_back/api/v1/notitas/usuarios/${notita.id}`,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.usuario.token}`
        },
        setUsuario: auth.setUsuario
      })

      setNotitas(prevNotitas => {
        const index = prevNotitas.findIndex(n => n.id === notita.id)
        prevNotitas[index] = response
        return prevNotitas
      })

      toast({
        description: t('update_notita_success')
      })
    } catch (error) {
      if (error?.status && error?.status === 401) {
        auth.logout()
      }

      toast({
        title: 'Error',
        description: t('update_notita_error')
      })
    } finally {
      setOpenModal(false)
      if (mediaRecorderRef?.current?.state && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        toast({
          title: 'Audio',
          description: 'Se ha cancelado la grabación de audio'
        })
      }
    }
  }

  const transcribirAudio = async () => {
    try {
      setTranscribirLoading(true)

      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('file', audioFile)

      const response = await fetchData({
        // url: `/notitas_back/api/v1/notitas/transcripcion`,
        url: `/notitas_back/api/v1/transcribir_audio`,
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
        description: t('update_notita_success')
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

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    // ['link', 'image', 'video', 'formula'],
    ['link', 'image', 'video'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ]

  return (
    <div className='w-full h-full flex justify-center items-center ml-10 md:ml-12'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-5/6 h-3/4 flex flex-col md:w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded'
        >
          {modalAudio ? (
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
                          words={['Transcribiendo']}
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
          ) : undefined}

          <div className='p-3 flex justify-between color-picker'>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger 
                    type='submit'
                    className='btn-icon p-2 text-sm rounded'
                  >
                    <HiOutlineChevronLeft />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cerrar editor</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='flex'>
              <AudioRecorder
                mediaRecorderRef={mediaRecorderRef}
                setAudioBlob={setAudioBlob}
              />
              <div className='relative'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      type='button'
                      className='btn-icon mr-1 p-2 text-sm rounded'
                      onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    >
                      <IoColorPaletteOutline />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cambiar color</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {colorPickerOpen &&  
                  <RgbaStringColorPicker
                    color={color}
                    onChange={setColor} 
                    className='absolute z-10 left-[60%] transform -translate-x-[60%] sm:transform-none sm:translate-x-0 sm:left-auto sm:right-0 sm:mr-1 mt-2'
                  />
                }
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      type='button'
                      className='btn-icon mr-1 p-2 text-sm rounded'
                      onClick={() => {
                        const valorPrivada = !form.getValues('privada')
                        setPrivada(valorPrivada)
                        form.setValue('privada', valorPrivada)
                      }}
                    >
                      {privada ? <HiOutlineLockClosed /> : <HiOutlineLockOpen />}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cambiar privacidad</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger 
                      type='button'
                      className='btn-icon p-2 text-sm rounded'
                    >
                      <HiOutlineBell />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Añadir recordatorio</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name='titulo'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    className='bg-transparent rounded-none px-3 py-6 text-xl border-none focus-visible:ring-0 text-muted-foreground focus-visible:text-zinc-900 dark:focus-visible:text-zinc-100'
                    placeholder='La forma del verbo "to be"'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <ReactQuill
            value={nota}
            onChange={setNota}
            theme='snow'
            modules={{
              toolbar: toolbarOptions
            }}
            className='flex flex-col overflow-hidden w-full h-full'
          />
        </form>
      </Form>
    </div>
  )
}

export { CrearNotita }