import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { NavLink } from 'react-router-dom'

import { createPortal } from 'react-dom'

import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineLanguage,
  HiOutlineBars3
} from 'react-icons/hi2'

import './Layout.css'

function Layout({
  items,
  isOpen,
  setIsOpen,
  titulo = 'Logo',
  logo,

  handleChangeIdioma,
  handleChangeTema,
  idioma,
  tema,

  children
}) {
  const [expandedItem, setExpandedItem] = useState(null)
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 })

  const toggleItem = (index, event) => {
    setExpandedItem(expandedItem === index ? null : index)
    if (expandedItem !== index) {
      const rect = event.currentTarget.getBoundingClientRect()
      setSubMenuPosition({ top: rect.top })
    }
  }

  const renderSubitems = (subitems) => {
    if (isOpen) {
      return (
        <ul className='bg-zinc-300 dark:bg-zinc-900 rounded mt-2'>
          {subitems.map((subitem, index) => (
            <li key={index} className='w-full p-2'>
              <NavLink
                to={subitem.ruta}
                className='p-1 w-full flex flex-row items-center text-xl hover:bg-zinc-400 dark:hover:bg-zinc-800 rounded'
              >
                <span>
                  {subitem.icono}
                </span>
                <span
                  className={subitem.icono ? 'ml-2' : undefined}
                >
                  {subitem.nombre}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      )
    }

    return createPortal(
      <ul
        className='bg-zinc-300 dark:bg-zinc-900 z-20 absolute left-10 md:left-12 top-0 rounded-tr rounded-br'
        style={{ top: subMenuPosition.top }}
      >
        {subitems.map((subitem, index) => (
          <li key={index} className='w-full p-2'>
            <NavLink
              to={subitem.ruta}
              className='p-1 w-full flex flex-row items-center text-xl hover:bg-zinc-400 dark:hover:bg-zinc-800 rounded'
            >
              <span>
                {subitem.icono}
              </span>
              <span
                className={subitem.icono ? 'ml-2' : undefined}
              >
                {subitem.nombre}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>,
      document.body
    )
  }

  return (
    <div className='min-h-screen w-full relative bg-zinc-100 dark:bg-neutral-900'>
      <div className={`z-10 fixed h-screen transition-all duration-200 ease-in-out flex flex-col justify-center items-center bg-zinc-200 dark:bg-zinc-950 ${isOpen ? 'w-48 md:w-64' : 'w-10 md:w-12'} overflow-hidden overflow-y-auto navbar`}>
        <header className='w-full flex flex-col justify-center items-center p-4'>
          <figure className={`flex flex-col justify-center items-center transition-all duration-200 ease-in-out ${isOpen ? 'w-32' : 'w-12'}`}>
            <img className='w-9/12 md:w-full' src={logo} alt={titulo} />
            <figcaption className={`mt-2 text-2xl ${isOpen ? 'flex' : 'hidden'}`}>
              {titulo}
            </figcaption>
          </figure>
        </header>
        <div className='w-full flex flex-col flex-1 justify-between items-center pt-5 overflow-y-auto overflow-hidden'>
          <nav className='w-full'>
            <ul>
              {items.map((item, index) => (
                <li key={index} className='w-full p-2'>
                  {item.subitems ? (
                    <div>
                      <div
                        className={`no-select cursor-pointer p-1 w-full flex flex-row items-center text-xl ${isOpen ? 'justify-start' : 'justify-center text-3xl'}`}
                        onClick={(event) => toggleItem(index, event)}
                      >
                        <span>
                          {item.icono}
                        </span>
                        <span className={`${item.icono ? 'ml-2' : undefined} ${isOpen ? 'flex' : 'hidden'}`}>
                          {item.nombre}
                        </span>
                      </div>
                      {expandedItem === index ? renderSubitems(item.subitems) : undefined}
                    </div>
                  ) : (
                    <NavLink
                      to={item.ruta}
                      className={`no-select p-1 w-full flex flex-row items-center text-xl ${isOpen ? 'justify-start' : 'justify-center text-3xl'}`}
                    >
                      <span>
                        {item.icono}
                      </span>
                      <span className={`${item.icono ? 'ml-2' : undefined} ${isOpen ? 'flex' : 'hidden'}`}>
                        {item.nombre}
                      </span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <footer className={`pb-5 flex ${isOpen ? 'flex-row' : 'flex-col'}`}>
            <Button
              className='bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-2 rounded cursor-pointer m-1'
              onClick={() => handleChangeTema(tema === 'light' ? 'dark' : 'light')}
            >
              {tema === 'light' ? <HiOutlineSun /> : <HiOutlineMoon />}
            </Button>
            <Button
              className='bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 p-2 rounded cursor-pointer m-1'
              onClick={() => handleChangeIdioma(idioma === 'es' ? 'en' : 'es')}
            >
              <HiOutlineLanguage />
            </Button>
          </footer>
        </div>
      </div>
      
      <div className='absolute top-0 bottom-0 left-10 md:left-12 right-0 overflow-y-auto'>
        {children}
      </div>

      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          setExpandedItem(null)
        }}
        className='w-16 h-16 fixed z-10 bottom-0 right-0 m-3 md:m-6 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100 rounded-full p-3 text-4xl'
      >
        <HiOutlineBars3 />
      </Button>
    </div>
  )
}

export { Layout }