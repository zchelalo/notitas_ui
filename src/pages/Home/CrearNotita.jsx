import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ReactQuill from 'react-quill'
import { RgbaStringColorPicker } from 'react-colorful'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import {
  HiOutlineMicrophone,
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineLockOpen,
} from 'react-icons/hi2'
import { IoColorPaletteOutline } from 'react-icons/io5'

import 'react-quill/dist/quill.snow.css'
import './Home.css'

function CrearNotita({ notita, setOpenModal, setUsuario, t }) {
  const [nota, setNota] = useState(notita.nota)
  const [color, setColor] = useState('#aabbcc')
  const [estado, setEstado] = useState(false)

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

  const onSubmit = async (form) => {
    form.nota = nota
    form.color = color
    console.log(form)
    setOpenModal(false)
  }

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
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

  const Herramientas = {
    toolbar: toolbarOptions,
  }
  
  return (
    <div className='w-full h-full flex justify-center items-center ml-10 md:ml-12'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-5/6 h-3/4 flex flex-col md:w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded'
        >
          <div className='p-3 flex justify-between Reactcolorfull'>
            <Button
              type='submit'
              className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
            >
              <HiOutlineChevronLeft />
            </Button>
            <div className='flex'>
              <Button
                type='button'
                className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100 mr-1'
              >
                <HiOutlineMicrophone />
              </Button>
              <div className='relative'>
                <Button
                  type='button'
                  onClick={() => setEstado(!estado)}
                  className='relative w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100 mr-1'
                >
                  <IoColorPaletteOutline />
                </Button>
                {estado &&  
                  <RgbaStringColorPicker
                    color={color}
                    onChange={setColor} 
                    className='absolute z-50 right-0 mr-1 mt-2'
                  />
                }
              </div>
              <Button
                type='button'
                className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100 mr-1'
              >
                <HiOutlineLockOpen />
              </Button>
              <Button
                type='button'
                className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
              >
                <HiOutlineBell />
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name='titulo'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    className='bg-transparent rounded-none px-3 py-6 text-xl border-none focus-visible:ring-0 text-muted-foreground focus-visible:text-zinc-900'
                    placeholder='La forma del verbo '
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
            modules={Herramientas}
            className='flex flex-col overflow-hidden w-full h-full'
          />
        </form>
      </Form>
    </div>
  )
}

export { CrearNotita }
