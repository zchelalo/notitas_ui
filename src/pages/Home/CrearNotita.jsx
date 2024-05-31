import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

function CrearNotita({
  notita,
  setOpenModal,
  t
}) {
  const formSchema = z.object({
    titulo: z.string().min(1, {
      message: t('titulo_min')
    }).max(255, {
      message: t('titulo_max')
    }),
    nota: z.string(),
    color: z.string(),
    privada: z.boolean(),
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
    console.log(form)
    setOpenModal(false)
  }

  return (
    <div className='w-full h-full flex justify-center items-center ml-10 md:ml-12'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-5/6 h-3/4 md:w-3/4 md:h-3/4 bg-zinc-100 dark:bg-zinc-900 rounded'
        >
          {/* <pre>
            {JSON.stringify(notita, null, 2)}
          </pre> */}
          <div className='flex flex-col h-full'>
            <div className='p-3 flex justify-between'>
              <div>
                <Button
                  type='submit'
                  className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
                >
                  {'<'}
                </Button>
              </div>
              <div className='flex'>
                <Button
                  type='submit'
                  className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
                >
                  {'<'}
                </Button>
                <Button
                  type='submit'
                  className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
                >
                  {'<'}
                </Button>
                <Button
                  type='submit'
                  className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
                >
                  {'<'}
                </Button>
                <Button
                  type='submit'
                  className='w-auto h-auto p-2 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'
                >
                  {'<'}
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
                      placeholder='El verbo to be esta chingón'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='w-full h-full'>
              asijhdfsaojdjoa
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { CrearNotita }