import { Routes, Route } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useIdioma } from '@/hooks/useIdioma'
import { useTema } from '@/hooks/useTema'

import { Rutas } from '@/config/routes.jsx'

import { Toaster } from '@/components/ui/toaster'
// import { Navbar } from '@/components/Navbar'

function App() {
  const routes = Rutas()
  const auth = useAuth()

  const { idioma, handleChangeIdioma } = useIdioma()
  const { tema, handleChangeTema } = useTema()

  return (
    <div className='min-h-screen min-w-screen flex flex-col dark:bg-zinc-950'>
      <Routes>
        {routes && routes.map(route => {

          if (route.nestedRoutes) {
            return (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.nestedRoutes.map(nestedRoute => (
                  <Route key={nestedRoute.path} path={nestedRoute.path} element={nestedRoute.element} />
                ))}
              </Route>
            )
          } else {
            return (
              <Route key={route.path} path={route.path} element={route.element} />
            )
          }
          
        })}
      </Routes>
      {
        auth.usuario && 
        <Navbar
          handleChangeIdioma={handleChangeIdioma}
          handleChangeTema={handleChangeTema}
          idioma={idioma}
          tema={tema}
        />
      }
      <Toaster />
    </div>
  )
}

export { App }