import { AuthRoute } from '@/contexts/AuthContext/AuthRoute'
import { PublicRoute } from '@/contexts/AuthContext/PublicRoute'
import { RoleRestrictedRoute } from '@/contexts/AuthContext/RoleRestrictedRoute'

import { Home } from '@/pages/Home'
import { Landing } from '@/pages/Landing'
import { Error404 } from '@/pages/Error404'
import { Login } from '@/pages/Login'
import { EditarPerfil } from '@/pages/EditarPerfil'
import { NotitasPrivadas } from '@/pages/NotitasPrivadas'

import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineHomeModern
} from 'react-icons/hi2'

function Rutas() {
  return [
    {
      path: '/',
      element: (
        <AuthRoute>
          <Home />
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
              <RoleRestrictedRoute allowed_roles={['admin', 'cliente']}>
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
          path: 'perfil/notitas-privadas',
          element: (
            <AuthRoute>
              <RoleRestrictedRoute allowed_roles={['admin', 'cliente']}>
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
      path: '*',
      element: <Error404 />,
      private: false,
      public_only: false
    },
  ]
}

export { Rutas }