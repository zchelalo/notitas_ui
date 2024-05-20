import logoLogin from './logoLogin.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import './Login.css'

function Login() {
  const { t } = useTranslation()
  const auth = useAuth()

  const formSchema = z.object({
    correo: z.string().email({
      message: t('email_validation'),
    }),
    password: z.string().min(8, {
      message: t('password_validation'),
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correo: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async ({ correo, password }) => {
    await auth.login(correo, password)
  }

  return (
    <div className='p-1 w-full h-screen flex justify-center items-center'>
      <div className='w-10/12 h-full flex items-center justify-center'>
        {/* caja #1 */}
        <div className='hidden bg-zinc-200 dark:bg-zinc-950 w-1/2 h-5/6 md:flex items-center justify-center login-shadow'>
          <img className='w-72 h-72' src={logoLogin} alt='logoLogin' />
        </div>

        {/* caja #2 */}
        <div className='w-full h-5/6 md:w-1/2 relative flex flex-col justify-center items-center bg-zinc-100 dark:bg-zinc-900 login-shadow'>
          <div className='absolute right-0 top-0'>
            <Button className='flex justify-end self-end bg-transparent shadow-none rounded-none font-light dark:text-white dark:hover:bg-zinc-600 text-black hover:bg-slate-300 '>
              {t('register')}
            </Button>
          </div>
          <div className='h-full w-10/12 sm:w-8/12 md:w-9/12 lg:w-7/12 xl:w-6/12 flex flex-col items-center justify-center'>
            <h1 className='mb-2 text-4xl text-center font-bold'>
              {t('login_title')}
            </h1>
            <span className='mb-6 text-center'>{t('login_subtitle')}</span>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full flex flex-col items-center justify-center'
              >
                <FormField
                  control={form.control}
                  name='correo'
                  render={({ field }) => (
                    <FormItem className='w-full mb-1'>
                      <FormLabel className=''>{t('email_title')}</FormLabel>
                      <FormControl>
                        <Input
                          className='border dark:border-zinc-300 dark:bg-zinc-500 bg-white rounded'
                          placeholder='example@email.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='w-full mb-1'>
                      <FormLabel className=''>{t('password_title')}</FormLabel>
                      <FormControl>
                        <Input
                          className='border  dark:border-zinc-300 dark:bg-zinc-500 bg-white rounded'
                          placeholder='password'
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='mt-6 w-full h-12 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-800 dark:text-zinc-100'>
                  {t('continue')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Login }
