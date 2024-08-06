import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { RgbaStringColorPicker } from 'react-colorful'
import { AudioRecorder } from '@/components/AudioRecorder'
import { TextToAudio } from '@/components/TextToAudio'

import {
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
  HiOutlinePlus,
  HiOutlineXMark
} from 'react-icons/hi2'
import { IoColorPaletteOutline } from 'react-icons/io5'

function HeaderEditor({
  accion,
  setOpenModal,

  form,

  color,
  setColor,

  privada,
  setPrivada,

  setAudioBlob,
  mediaRecorderRef,

  nota
}) {
  const { t } = useTranslation()

  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  return (
    <div className='p-3 flex justify-between color-picker'>

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              type={() => {
                if (accion === 'create' && !form.getValues('titulo')) {
                  return 'button'
                } else {
                  return 'submit'
                }
              }}
              onClick={() => {
                if (accion === 'create' && !form.getValues('titulo')) {
                  setOpenModal(false)
                }
              }}
              className='btn-icon p-2 text-sm rounded'
            >
              {accion !== 'create' ? (
                <HiOutlineChevronLeft />
              ) : (
                (accion === 'create' && !form.getValues('titulo')) ? (
                  <HiOutlineXMark />
                ) : (
                  <HiOutlinePlus />
                )
              )}
              
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('close_editor')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className='flex'>
        <AudioRecorder
          mediaRecorderRef={mediaRecorderRef}
          setAudioBlob={setAudioBlob}
        />

        <TextToAudio
          nota={nota}
        />

        <div className='relative'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type='button'
                className='btn-icon mr-1 p-2 text-sm rounded'
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
              >
                <IoColorPaletteOutline />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('change_color')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {colorPickerOpen &&  
            <RgbaStringColorPicker
              color={color}
              onChange={setColor} 
              className='absolute z-10 left-[60%] transform -translate-x-[60%] sm:transform-none sm:translate-x-0 sm:left-auto sm:right-0 sm:mr-1 mt-2'
            />
          }
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type='button'
                className='btn-icon mr-1 p-2 text-sm rounded'
                onClick={() => {
                  const valorPrivada = !form.getValues('privada')
                  setPrivada(valorPrivada)
                  form.setValue('privada', valorPrivada)
                }}
              >
                {privada ? <HiOutlineLockClosed /> : <HiOutlineLockOpen />}
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('change_privacy')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger 
                type='button'
                className='btn-icon p-2 text-sm rounded'
              >
                <HiOutlineBell />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('add_reminder')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
    </div>
  )
}

export { HeaderEditor }