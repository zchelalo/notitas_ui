import { useState } from 'react'

import { Layout, Button as MenuButton, theme } from 'antd'
import { Button } from '@/components/ui/button'
import { MenuList } from '@/components/Navbar/MenuList'

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

import './Navbar.css'

const { Header, Sider } = Layout

function Navbar({
  idioma,
  tema,
  handleChangeIdioma,
  handleChangeTema,
  children
}) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={tema ? 'dark' : 'light'}
        className='text-white sider'
      >
        <header className='flex h-[10vh] items-center justify-center text-white py-8'>
          <span>
            <h2>Notitas</h2>
          </span>
        </header>

        <div className='flex flex-col justify-between h-[90vh]'>
          <MenuList tema={tema} />
          <footer className={`${collapsed === true ? 'navbar-botones--collapsed' : 'navbar-botones--uncollapsed'}`}>
            <Button
              onClick={() => handleChangeTema(tema === 'dark' ? 'light' : 'dark')}
            >
              {tema === 'dark' ? <MoonIcon className='text-black w-5' /> : <SunIcon className='text-black w-5' />}
            </Button>
            <Button
              onClick={() => handleChangeTema(tema === 'dark' ? 'light' : 'dark')}
            >
              {tema === 'dark' ? <MoonIcon className='text-black w-5' /> : <SunIcon className='text-black w-5' />}
            </Button>
          </footer>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <MenuButton
            type='text'
            icon={collapsed ? <MoonIcon className='text-black w-5' /> : <MoonIcon className='text-black w-5' />}
            className='toggle'
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <main className='text-black'>
          {children}
        </main>
      </Layout>
    </Layout>
  )
}

export { Navbar }