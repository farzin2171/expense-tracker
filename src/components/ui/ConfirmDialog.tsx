'use client'

import { useEffect, useRef } from 'react'

type Props = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    cancelRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm deletion">
      <div className="confirm-dialog">
        <p className="confirm-dialog-message">Are you sure you want to delete this expense?</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button type="button" className="confirm-dialog-cancel" ref={cancelRef} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
