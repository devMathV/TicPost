import { FaXmark } from "react-icons/fa6";

import Modal from './Modal';

const EditModal = ({ children, title, onClose, onSave, direction }) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        onSave()
    }

    return (
        <Modal direction={direction}>
            <div className="modal-header">
                <h2>{title}</h2>
                <div className="close-button" onClick={onClose}>
                    <FaXmark size={20} />
                </div>
            </div>
            <form className="modal-content" onSubmit={handleSubmit}>
                {children}
                <div className='modal-actions'>
                    <button
                        type="button"
                        className='cancel-button'
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className='save-button'
                    >
                        Salvar
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default EditModal