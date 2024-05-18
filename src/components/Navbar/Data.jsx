import {
  CogIcon,
  UserCircleIcon,
  UserGroupIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/solid'

const items = [
  {
    key: '1',
    icon: <UserCircleIcon className='w-6' />,
    label: 'Perfil',
  },
  {
    key: '2',
    icon: <UserGroupIcon className='w-6' />,
    label: 'Grupos',
  },
  {
    key: '3',
    icon: <CogIcon className='w-6' />,
    label: 'Configuración',
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <ArrowsUpDownIcon className='w-6' />,
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
]

export { items }
