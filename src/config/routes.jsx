import { AuthRoute } from '@/contexts/AuthContext/AuthRoute'
import { PublicRoute } from '@/contexts/AuthContext/PublicRoute'
import { RoleRestrictedRoute } from '@/contexts/AuthContext/RoleRestrictedRoute'

import { Home } from '@/pages/Home'
import { Landing } from '@/pages/Landing'
import { Error404 } from '@/pages/Error404'

import { Login } from '@/pages/Login'
import { Registro } from '@/pages/Registro'

import { EditarPerfil } from '@/pages/EditarPerfil'
import { NotitasPrivadas } from '@/pages/NotitasPrivadas'

import { MisGrupos } from '@/pages/MisGrupos'
import { CrearGrupo } from '@/pages/CrearGrupo'
import { Grupo } from '@/pages/Grupo'

import { ConfGeneral } from '@/pages/ConfGeneral'
import { ConfPrivacidad } from '@/pages/ConfPrivacidad'

import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
  HiOutlineLockClosed,
  HiOutlineInformationCircle,
  HiOutlinePlusCircle,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineHomeModern,
  HiOutlinePencil
} from 'react-icons/hi2'

function Rutas() {
  return [
    {
      path: '/',
      element: (
        <AuthRoute>
          <RoleRestrictedRoute roles={['admin', 'cliente']}>
            <Home />
          </RoleRestrictedRoute>
        </AuthRoute>
      ),
      private: true,
      public_only: false,
      allowed_roles: ['admin', 'cliente']
    },
    {
      path: '/landing',
      element: (
        <PublicRoute>
          <Landing />
        </PublicRoute>
      ),
      private: false,
      public_only: true,
      name: 'Inicio',
      icon: <HiOutlineHomeModern />
    },
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
      private: false,
      public_only: true,
      name: 'Iniciar sesión',
      icon: <HiOutlineArrowRightEndOnRectangle />
    },
    {
      path: '/registro',
      element: (
        <PublicRoute>
          <Registro />
        </PublicRoute>
      ),
      private: false,
      public_only: true
    },
    {
      path: '',
      private: true,
      public_only: false,
      allowed_roles: ['admin', 'cliente'],
      name: 'Perfil',
      icon: <HiOutlineUserCircle />,
      nestedRoutes: [
        {
          path: 'perfil/editar',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <EditarPerfil />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Editar',
          icon: <HiOutlinePencilSquare />
        },
        {
          path: '/',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <Home />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Mis notitas',
          icon: <HiOutlinePencil />
        },
        {
          path: 'perfil/notitas-privadas',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <NotitasPrivadas />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Mis notitas privadas',
          icon: <HiOutlineLockClosed />
        }
      ]
    },
    {
      path: '',
      private: true,
      public_only: false,
      allowed_roles: ['admin', 'cliente'],
      name: 'Grupos',
      icon: <HiOutlineUserGroup />,
      nestedRoutes: [
        {
          path: 'grupos/mis-grupos',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <MisGrupos />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Mis grupos',
          icon: <HiOutlineUserGroup />
        },
        {
          path: 'grupos/mis-grupos/:grupo_id',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <Grupo />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente']
        },
        {
          path: 'grupos/crear-grupo',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <CrearGrupo />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Crear grupo',
          icon: <HiOutlinePlusCircle />
        }
      ]
    },
    {
      path: '',
      private: true,
      public_only: false,
      allowed_roles: ['admin', 'cliente'],
      name: 'Configuración',
      icon: <HiOutlineCog6Tooth />,
      nestedRoutes: [
        {
          path: 'configuracion/general',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <ConfGeneral />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'General',
          icon: <HiOutlineInformationCircle />
        },
        {
          path: 'configuracion/privacidad',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute roles={['admin', 'cliente']}>
                <ConfPrivacidad />
              </RoleRestrictedRoute>
            </AuthRoute>
          ),
          private: true,
          public_only: false,
          allowed_roles: ['admin', 'cliente'],
          name: 'Privacidad',
          icon: <HiOutlineLockClosed />
        }
      ]
    },
    {
      path: '*',
      element: <Error404 />,
      private: false,
      public_only: false
    },
  ]
}

export { Rutas }