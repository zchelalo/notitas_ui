import { AuthRoute } from '@/contexts/AuthContext/AuthRoute'
import { PublicRoute } from '@/contexts/AuthContext/PublicRoute'
import { RoleRestrictedRoute } from '@/contexts/AuthContext/RoleRestrictedRoute'

import { Home } from '@/pages/Home'
import { Landing } from '@/pages/Landing'
import { Error404 } from '@/pages/Error404'

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
      public_only: true
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