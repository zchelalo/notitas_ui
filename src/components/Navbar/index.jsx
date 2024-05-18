import { useState } from 'react'

import { Layout, Button as MenuButton } from 'antd'
import { Button } from '@/components/ui/button'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

import LogoNotitas from './img/LogoNotitas.png'
import { MenuList } from './MenuList'

const { Header, Sider } = Layout

const Navbar = ({
  handleChangeIdioma,
  handleChangeTema,
  idioma,
  tema,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)
  console.log(idioma)

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
        className='text-white'
      >
        <div className='flex height-[12vh] items-center justify-center text-white p-3'>
          <div className='flex items-center justify-center rounded-[50%]'>
            <img src={LogoNotitas} alt='LogoNotitas' />
          </div>
        </div>
        <h1 className='text-2xl justify-center flex dark:text-white text-black'>
          Notitas
        </h1>
        <MenuList tema={tema} />
        <Button
          className='absolute bottom-8 left-0 right-0 flex justify-center items-center'
          onClick={() => handleChangeTema(tema === 'dark' ? 'light' : 'dark')}
        >
          {tema === 'dark' ? (
            <MoonIcon className='w-6' />
          ) : (
            <SunIcon className='w-6' />
          )}
        </Button>
        <Button
          className='absolute bottom-20 left-0 right-0 flex justify-center items-center'
          onClick={() => handleChangeIdioma(idioma === 'es' ? 'en' : 'es')}
        >
          {idioma === 'es' ? 'es' : 'en'}
        </Button>
      </Sider>
      <Layout>
        <Header>
          <MenuButton
            type='text'
            className='ml-4 right-0'
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <Bars3Icon className='fixed w-20 h-20 bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-200 focus:outline-none focus:ring-2' />
            ) : (
              <XMarkIcon className='fixed w-20 h-20 bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-200 focus:outline-none focus:ring-2' />
            )}
          </MenuButton>
        </Header>
        {children}
      </Layout>
    </Layout>
  )
}

export { Navbar }
