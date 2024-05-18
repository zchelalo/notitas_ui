import {
  HiCog6Tooth,
  HiUserCircle,
  HiUserGroup,
  HiArrowsUpDown
} from 'react-icons/hi2'

const items = [
  {
    key: '1',
    icon: <HiUserCircle />,
    label: 'Perfil',
  },
  {
    key: '2',
    icon: <HiUserGroup />,
    label: 'Grupos',
  },
  {
    key: '3',
    icon: <HiCog6Tooth />,
    label: 'Configuración',
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <HiArrowsUpDown />,
    children: [
      {
        key: '5',
        label: 'Option 5',
      },
      {
        key: '6',
        label: 'Option 6',
      },
      {
        key: '7',
        label: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation One',
    icon: <HiArrowsUpDown />,
    children: [
      {
        key: '9',
        label: 'Option 5',
      },
      {
        key: '10',
        label: 'Option 6',
      },
      {
        key: '11',
        label: 'Option 7',
      },
      {
        key: '12',
        label: 'Option 8',
      },
    ],
  },
]

export { items }
