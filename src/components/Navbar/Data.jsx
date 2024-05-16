import {
  SunIcon
} from '@heroicons/react/24/solid'

const items = [
  {
    key: "1",
    icon: <SunIcon className='w-5' />,
    label: "Option 1",
  },
  {
    key: "2",
    icon: <SunIcon className='w-5' />,
    label: "Option 2",
  },
  {
    key: "3",
    icon: <SunIcon className='w-5' />,
    label: "Option 3",
  },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <SunIcon className='w-5' />,
    children: [
      {
        key: "5",
        label: "Option 5",
      },
      {
        key: "6",
        label: "Option 6",
      },
      {
        key: "7",
        label: "Option 7",
      },
      {
        key: "8",
        label: "Option 8",
      }
    ],
  }
];

export { items }
