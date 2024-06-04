import { useState, useRef, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { HiOutlineMicrophone } from 'react-icons/hi2'
import { BsRecordCircle } from 'react-icons/bs'

function AudioRecorder({ mediaRecorderRef, setAudioBlob }) {
  const { toast } = useToast()

  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const audioChunksRef = useRef([])

  useEffect(() => {
    // Check if MediaRecorder is supported
    if (typeof MediaRecorder === 'undefined') {
      setIsSupported(false)
    } else {
      setIsSupported(true)
    }
  }, [])
  
  const startRecording = async () => {
    if (!isSupported) {
      toast({
        title: 'Error',
        description: 'MediaRecorder is not supported in this browser'
      })
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        toast({
          title: 'Error',
          description: 'Microphone access denied. Please allow microphone access to use this feature.'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Error accessing microphone: ' + err
        })
      }
    }
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      return
    }

    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            type='button'
            className='btn-icon mr-1 p-2 text-sm rounded'
            onClick={() => {
              if (isRecording) {
                stopRecording()
                return
              }
    
              startRecording()
            }}
          >
            {isRecording ? <BsRecordCircle /> : <HiOutlineMicrophone />}
          </TooltipTrigger>
          <TooltipContent>
            <p>Transcribir audio a texto</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export { AudioRecorder }