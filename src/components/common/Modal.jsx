import { useEffect } from 'react'
import NavIcon from './NavIcon'

function Modal({ children, onClose, className = 'max-w-md' }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`animate-fade-in-up relative max-h-[85vh] w-full overflow-y-auto rounded-2xl border border-line/80 bg-surface p-6 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-8 ${className}`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-card-strong hover:text-heading"
        >
          <NavIcon name="close" className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
