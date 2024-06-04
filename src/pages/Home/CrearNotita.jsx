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
import ReactQuill from 'react-quill'
import { RgbaStringColorPicker } from 'react-colorful'
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
        message: t('titulo_min'),
      })
      .max(255, {
        message: t('titulo_max'),
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
    },
  })

  const onSubmit = async form => {
    try {
      form.color = color
      form.nota = nota

      if (
        form.titulo === notita.titulo &&
        form.nota === notita.nota &&
        form.color === notita.color &&
        form.privada === notita.privada
      ) {
        return setOpenModal(false)
      }

      const response = await fetchData({
        url: `/notitas_back/api/v1/notitas/usuarios/${notita.id}`,
        method: 'PUT',
        body: JSON.stringify(form),
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
                    >
                      <span className='mr-2'>
                        Agregar a la notita
                      </span>
                      <HiOutlinePlus />
                    </Button>
                    {transcribirLoading ? (
                      <small className='mt-2'>
                        Transcribiendo
                      </small>
                    ) : undefined}
                  </div>
                </div>
              </div>
            </Modal>
          ) : undefined}

          <div className='p-3 flex justify-between color-picker'>
            <div>
              <Button
                type='submit'
                className='btn-icon p-2'
              >
                <HiOutlineChevronLeft />
              </Button>
            </div>
            <div className='flex'>
              <div>
                <AudioRecorder
                  mediaRecorderRef={mediaRecorderRef}
                  setAudioBlob={setAudioBlob}
                />
              </div>
              <div className='relative'>
                <Button
                  type='button'
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  className='p-2 btn-icon mr-1'
                >
                  <IoColorPaletteOutline />
                </Button>
                {colorPickerOpen &&  
                  <RgbaStringColorPicker
                    color={color}
                    onChange={setColor} 
                    className='absolute z-10 left-1/2 transform -translate-x-1/2 sm:transform-none sm:translate-x-0 sm:left-auto sm:right-0 sm:mr-1 mt-2'
                  />
                }
              </div>
              <div>
                <Button
                  type='button'
                  className='btn-icon mr-1 p-2'
                  onClick={() => {
                    const valorPrivada = !form.getValues('privada')
                    setPrivada(valorPrivada)
                    form.setValue('privada', valorPrivada)
                  }}
                >
                  {privada ? <HiOutlineLockClosed /> : <HiOutlineLockOpen />}
                </Button>
              </div>
              <div>
                <Button
                  type='button'
                  className='btn-icon p-2'
                >
                  <HiOutlineBell />
                </Button>
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
