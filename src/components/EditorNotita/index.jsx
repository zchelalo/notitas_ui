import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext/useAuth'

import { fetchData } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form'

import ReactQuill from 'react-quill'
import { ModalAudio } from '@/components/EditorNotita/ModalAudio'
import { HeaderEditor } from '@/components/EditorNotita/HeaderEditor'

import 'react-quill/dist/quill.snow.css'
import './EditorNotita.css'

function EditorNotita({ notita = {}, setNotitas, setOpenModal, accion = 'create' }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const auth = useAuth()

  const [nota, setNota] = useState((notita && notita.nota) ? notita.nota : '')
  const [color, setColor] = useState((notita && notita.color) ? notita.color : '#000000')
  const [privada, setPrivada] = useState((notita && notita.privada) ? notita.privada : false)

  const mediaRecorderRef = useRef(null)
  const [modalAudio, setModalAudio] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)

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
      titulo: (notita && notita.titulo) ? notita.titulo : '',
      nota: nota,
      color: color,
      privada: privada
    }
  })

  const actualizarNotita = async data => {
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

  const crearNotita = async data => {
    try {
      data.color = color
      data.nota = nota

      const response = await fetchData({
        url: `/notitas_back/api/v1/notitas/usuarios`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.usuario.token}`
        },
        setUsuario: auth.setUsuario
      })

      setNotitas(prevNotitas => [response, ...prevNotitas])

      toast({
        description: t('create_notita_success')
      })
    } catch (error) {
      console.log(error)
      if (error?.status && error?.status === 401) {
        auth.logout()
      }

      toast({
        title: 'Error',
        description: t('create_notita_error')
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

  const onSubmit = async data => {
    if (accion === 'update') {
      return actualizarNotita(data)
    }

    return crearNotita(data)
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
            <ModalAudio
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}

              setModalAudio={setModalAudio}

              setNota={setNota}
            />
          ) : undefined}

          <HeaderEditor
            accion={accion}
            setOpenModal={setOpenModal}

            form={form}

            color={color}
            setColor={setColor}

            privada={privada}
            setPrivada={setPrivada}

            setAudioBlob={setAudioBlob}
            mediaRecorderRef={mediaRecorderRef}
          />

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

export { EditorNotita }