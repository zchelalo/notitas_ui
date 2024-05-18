import { useState } from 'react'

import { Routes, Route } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useIdioma } from '@/hooks/useIdioma'
import { useTema } from '@/hooks/useTema'

import { Rutas } from '@/config/routes.jsx'

import { Toaster } from '@/components/ui/toaster'
import { Layout } from '@/components/Layout'

import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle
} from 'react-icons/hi2'

import logo from '@/assets/img/logo.png'

const items = [
  {
    nombre: 'Perfil',
    icono: <HiOutlineUserCircle />,
    // ruta: '#',
    subitems: [
      {
        nombre: 'Editar',
        icono: <HiOutlinePencilSquare />,
        ruta: '#'
      },
      {
        nombre: 'Mis notitas privadas',
        icono: <HiOutlineLockClosed />,
        ruta: '#'
      }
    ]
  },
  {
    nombre: 'Grupos',
    icono: <HiOutlineUserGroup  />,
    // ruta: '#',
    subitems: [
      {
        nombre: 'Mis grupos',
        icono: <HiOutlineUserGroup />,
        ruta: '#'
      },
      {
        nombre: 'Crear grupo',
        icono: <HiOutlinePlusCircle />,
        ruta: '#'
      }
    ]
  },
  {
    nombre: 'Configuración',
    icono: <HiOutlineCog6Tooth />,
    // ruta: '#',
    subitems: [
      {
        nombre: 'General',
        icono: <HiOutlineCog6Tooth />,
        ruta: '#'
      },
      {
        nombre: 'Privacidad',
        icono: <HiOutlineLockClosed />,
        ruta: '#'
      },
      {
        nombre: 'Cerrar sesión',
        icono: <HiOutlineArrowRightOnRectangle />,
        ruta: '#'
      }
    ]
  },
  {
    nombre: 'Test',
    icono: <HiOutlineArrowRightOnRectangle />,
    ruta: '#'
  }
]

function App() {
  const routes = Rutas()
  const auth = useAuth()

  const [ isOpen, setIsOpen ] = useState(false)
  const { idioma, handleChangeIdioma } = useIdioma()
  const { tema, handleChangeTema } = useTema()

  return (
    <Layout
      items={items}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      titulo={'Notitas'}
      logo={logo}

      handleChangeIdioma={handleChangeIdioma}
      handleChangeTema={handleChangeTema}
      idioma={idioma}
      tema={tema}
    >
      <Routes>
        {routes &&
          routes.map((route) => {
            if (route.nestedRoutes) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                >
                  {route.nestedRoutes.map((nestedRoute) => (
                    <Route
                      key={nestedRoute.path}
                      path={nestedRoute.path}
                      element={nestedRoute.element}
                    />
                  ))}
                </Route>
              )
            } else {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              )
            }
          })}
      </Routes>
      <Toaster />
    </Layout>
  )
}

export { App }
