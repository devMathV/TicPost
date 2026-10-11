import './Toast.css'

import { createPortal } from "react-dom"

const Toast = ({ message, backgroundColor }) => {
    return createPortal(
        <div className='toast'>
            <p style={{ backgroundColor }}>{message}</p>
        </div>,
        document.body
    )
}

export default Toast