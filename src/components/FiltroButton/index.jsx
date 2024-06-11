import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dropdown } from '@/components/FiltroButton/Dropdown'

import { HiOutlineAdjustmentsVertical } from 'react-icons/hi2'

function FiltroButton({ notitas, setNotas }) {
  const { t } = useTranslation()

  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    if (!notitas) return

    if (filtro === 'todas') {

      setNotas(notitas)
      return

    } else if (filtro === 'fotos') {

      const regex = /<img\s+[^>]*src="[^"]*"[^>]*>/i
      const notasConFotos = notitas.filter(notita => regex.test(notita.nota))
      setNotas(notasConFotos)
      return

    } else if (filtro === 'videos') {

      const regex = /<iframe\s+[^>]*src="[^"]*"[^>]*>/i
      const notasConVideos = notitas.filter(notita => regex.test(notita.nota))
      setNotas(notasConVideos)
      return

    }

    setNotas(notitas)
  }, [filtro, notitas])

  return (
    <DropdownMenu>

      <TooltipProvider>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger className='btn-icon p-1 rounded cursor-pointer'>
              <HiOutlineAdjustmentsVertical className='text-xl' />
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent>
            <p>{t('filter_by')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dropdown
        filtro={filtro}
        setFiltro={setFiltro}
      />
      
    </DropdownMenu>
  )
}

export { FiltroButton }