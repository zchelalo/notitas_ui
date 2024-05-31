import { createPortal } from 'react-dom'
import './Modal.css'

function Modal({ children, className }) {
  return createPortal(
    <div className={`${className} modal-modalBackground`}>
      {children}
    </div>,
    document.getElementById('modal')
  )
}

export { Modal }