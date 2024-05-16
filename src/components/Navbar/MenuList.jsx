import { useState } from 'react'

import { items } from '@/components/Navbar/Data'

import { Menu } from 'antd'

function MenuList({ tema }) {
  const [openKeys, setOpenKeys] = useState(['sub1'])

  const onOpenChange = (openKeys) => {
    setOpenKeys([openKeys.pop()])
  }

  return (
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='inline'
        theme={tema}
        items={items}
        className='flex flex-col text-lg relative gap-4 pt-8'
        onOpenChange={onOpenChange}
        openKeys={openKeys}
      />
  )
}

export { MenuList }
