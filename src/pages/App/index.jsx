import { useState } from 'react'

import { Routes, Route } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useIdioma } from '@/hooks/useIdioma'
import { useTema } from '@/hooks/useTema'

import { Rutas } from '@/config/routes.jsx'

import { Toaster } from '@/components/ui/toaster'
import { Layout } from '@/components/Layout'

import {
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle
} from 'react-icons/hi2'

import logo from '@/assets/img/logo.png'

function App() {
  const routes = Rutas()
  const auth = useAuth()

  const [ isOpen, setIsOpen ] = useState(false)
  const { idioma, handleChangeIdioma } = useIdioma()
  const { tema, handleChangeTema } = useTema()

  const items = routes.reduce((rutas, ruta) => {
    if (!ruta.name) return rutas

    if (ruta.private && !auth.usuario) return rutas

    if (ruta.allowed_roles && !ruta.allowed_roles.includes(auth.usuario.rol)) return rutas

    if (ruta.public_only && auth.usuario) return rutas

    if (ruta.nestedRoutes) {
      rutas.push({
        nombre: ruta.name,
        icono: ruta.icon,
        ruta: ruta.path,
        subitems: ruta.nestedRoutes.reduce((rutasAnidadas, rutaAnidada) => {
          if (!rutaAnidada.name) return rutasAnidadas

          rutasAnidadas.push({
            nombre: rutaAnidada.name,
            icono: rutaAnidada.icon,
            ruta: rutaAnidada.path
          })

          return rutasAnidadas
        }, [])
      })

      return rutas
    }

    rutas.push({
      nombre: ruta.name,
      icono: ruta.icon,
      ruta: ruta.path
    })

    return rutas
  }, [])

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
        {routes && routes.map(route => {
          // if (route.private && !auth.usuario) return undefined

          // if (route.allowed_roles && !route.allowed_roles.includes(auth.usuario.rol)) return undefined
      
          // if (route.public_only && auth.usuario) return undefined

          if (route.nestedRoutes) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              >
                {route.nestedRoutes.map(nestedRoute => (
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
