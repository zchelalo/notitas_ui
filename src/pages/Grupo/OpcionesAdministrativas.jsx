import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchData, primeraMayuscula } from '@/lib/utils'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { useFetch } from '@/hooks/useFetch'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { NavLink, useLocation } from 'react-router-dom'

import {
  HiOutlineUserPlus,
  HiOutlineLockClosed,
  HiOutlineCog6Tooth
} from 'react-icons/hi2'

function OpcionesAdministrativas({
  grupo
}) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const location = useLocation()
  const auth = useAuth()

  const [modalInvitacion, setModalInvitacion] = useState(false)

  const { data: roles, loading: loadingRoles, error: errorRoles } = useFetch({
    url: '/notitas_back/api/v1/roles_grupo',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.usuario.token}`,
    }
  })

  const formSchema = z.object({
    correo: z.string().email({
      message: t('email_validation'),
    }),
    rol_grupo_id: z.number().int({
      message: 'El rol del grupo debe ser un número entero.'
    }).or(z.string().regex(/^[1-9]\d*$/, {
      message: 'El rol del grupo debe ser un número entero.'
    }).transform(Number))
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correo: '',
      rol_grupo_id: '',
    },
  })

  const onSubmit = async data => {
    try {
      data.grupo_id = grupo.id

      const response = await fetchData({
        url: `/notitas_back/api/v1/miembros_grupo/invitar`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.usuario.token}`
        },
        setUsuario: auth.setUsuario
      })

      toast({
        title: 'Usuario invitado correctamente',
        description: response.message
      })
    } catch (error) {
      if (error?.status && error?.status === 401) {
        auth.logout()
      }

      toast({
        title: 'Error',
        description: 'Error al invitar al usuario'
      })
    } finally {
      form.reset()
      setModalInvitacion(false)
    }
  }

  return (
    <div className='absolute w-full top-0 right-0 flex justify-end items-center p-2 px-6'>
      <div className='flex items-center mt-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 mr-2 p-1 rounded cursor-pointer'>
              <HiOutlineLockClosed className='text-xl' />
            </TooltipTrigger>
            <TooltipContent>
              <p>Acceder a las notas privadas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Popover open={modalInvitacion}>
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer mr-2'
                    onClick={() => setModalInvitacion(!modalInvitacion)}
                  >
                    <HiOutlineUserPlus className='text-xl' />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent>
                <p>Invitar a alguien</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name='correo'
                    render={({ field }) => (
                      <FormItem className='w-full mb-2'>
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
                    name='rol_grupo_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol del grupo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Seleccione un rol para el usuario' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingRoles ? (<p>Cargando...</p>) : undefined}
                            {!loadingRoles && errorRoles ? (<p>Error al cargar los roles</p>) : undefined}
                            {!loadingRoles && !errorRoles && roles.length > 0 ? roles.map(rol => (
                              <SelectItem key={rol.id} value={(rol.id).toString()}>{primeraMayuscula(rol.clave)}</SelectItem>
                            )) : (
                              (errorRoles) ? undefined : (<p>No hay roles disponibles</p>)
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className='mt-6 w-full h-12 btn'>
                    {t('continue')}
                  </Button>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='h-auto w-auto bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-1 rounded cursor-pointer'>
              <NavLink to={`${location.pathname}/configuracion`}>
                <HiOutlineCog6Tooth className='text-xl' />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configuración del grupo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export { OpcionesAdministrativas }