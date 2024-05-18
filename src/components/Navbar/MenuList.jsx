import { useState } from 'react'

import { Menu } from 'antd'
import { items } from './Data'

function MenuList({ tema }) {
  const [openKeys, setOpenKeys] = useState([])

  const onOpenChange = (openKeys) => {
    setOpenKeys([openKeys.pop()])
  }
  
  return (
    <Menu
      defaultSelectedKeys={['1']}
      mode='inline'
      theme={tema}
      items={items}
      className='flex flex-col gap-4'
      onOpenChange={onOpenChange}
      openKeys={openKeys}
    />
  )
}

export { MenuList }
