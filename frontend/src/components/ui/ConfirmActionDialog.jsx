import './ConfirmActionDialog.css'

import { useState } from 'react'

import { createPortal } from "react-dom"

const ConfirmActionDialog = ({ message, onClose, onConfirm, confirmButtonMessage }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirmClick = () => {
        setIsSubmitting(true)

        onConfirm()

        setIsSubmitting(false)
    }

    return createPortal(
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog background-box">
                <div className="confirm-dialog-message">
                    <p>{message}</p>
                </div>
                <div className="confirm-dialog-actions">
                    <button className='cancel-button' onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className='confirm-button' 
                        onClick={handleConfirmClick}
                        disabled={isSubmitting}
                    >
                        {confirmButtonMessage ? confirmButtonMessage : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmActionDialog