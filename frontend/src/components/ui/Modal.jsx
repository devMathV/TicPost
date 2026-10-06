import './Modal.css'

import { createPortal } from "react-dom"

const Modal = ({ children, direction }) => {
    return createPortal(
        <div className='modal-overlay'>
            <div className={`modal background-box ${direction === "horizontal" ? "horizontal" : "vertical"}`}>
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal