import { useState } from 'react'

import { Layout, Button as MenuButton } from 'antd'
import { Button } from '@/components/ui/button'
import { MenuList } from './MenuList'

import {
  HiBars3,
  HiSun,
  HiMoon,
  HiXMark
} from 'react-icons/hi2'

import LogoNotitas from './img/LogoNotitas.png'

const { Header, Sider } = Layout

const Navbar = ({
  handleChangeIdioma,
  handleChangeTema,
  idioma,
  tema,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={tema}
        className='text-white overflow-y-auto'
      >
        <header className='flex flex-col items-center justify-center h-[20vh] text-white'>
          <figure className={`flex flex-col items-center justify-center ${collapsed ? 'p-0' : 'p-8'}`}>
            <img src={LogoNotitas} alt='Logo de Notitas' />
            <figcaption className={`text-2xl justify-center flex dark:text-white text-black ${collapsed ? 'hidden' : 'flex'}`}>
              Notitas
            </figcaption>
          </figure>
        </header>
        <section className='flex flex-col justify-between h-[80vh]'>
          <MenuList collapsed={collapsed} tema={tema} />
          <div className={`flex justify-center items-center ${collapsed ? 'flex-col' : 'flex-row'}`}>
            <Button
              className='flex justify-center items-center m-1 mb-2'
              onClick={() => handleChangeTema(tema === 'dark' ? 'light' : 'dark')}
            >
              {tema === 'dark' ? (
                <HiMoon />
              ) : (
                <HiSun />
              )}
            </Button>
            <Button
              className='flex justify-center items-center m-1 mb-2'
              onClick={() => handleChangeIdioma(idioma === 'es' ? 'en' : 'es')}
            >
              {idioma === 'es' ? 'es' : 'en'}
            </Button>
          </div>
        </section>
      </Sider>
      <Layout>
        <Header>
          <MenuButton
            type='text'
            className='ml-4 right-0'
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <HiBars3 className='fixed w-16 h-16 bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-200 focus:outline-none focus:ring-2' />
            ) : (
              <HiXMark className='fixed w-16 h-16 bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-200 focus:outline-none focus:ring-2' />
            )}
          </MenuButton>
        </Header>
        {children}
        lorem10000
      </Layout>
    </Layout>
  )
}

export { Navbar }
