import './ConfirmActionDialog.css'

import { createPortal } from "react-dom"

const ConfirmActionDialog = ({ message, onClose, onConfirm, confirmButtonMessage }) => {
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
                    <button className='confirm-button' onClick={onConfirm}>
                        {confirmButtonMessage ? confirmButtonMessage : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmActionDialog