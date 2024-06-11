import { useTranslation } from 'react-i18next'

import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

function Dropdown({ filtro, setFiltro }) {
  const { t } = useTranslation()

  return (
    <DropdownMenuContent className='w-56'>
      <DropdownMenuLabel>{t('filter_by')}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={filtro} onValueChange={setFiltro}>
        <DropdownMenuRadioItem value='todas'>Todas las notitas</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='fotos'>Notitas con fotos</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='videos'>Notitas con videos</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='recordatorios'>Notitas con recordatorios</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  )
}

export { Dropdown }