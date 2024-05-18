import { Menu } from 'antd'
import { items } from './Data.jsx'

function MenuList({ tema }) {
  return (
    <Menu
      defaultSelectedKeys={['1']}
      mode='inline'
      theme={tema}
      items={items}
      className='height-[88vh] pt-8 flex flex-col gap-4 relative'
    />
  )
}

export { MenuList }
