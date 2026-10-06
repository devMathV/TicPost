import { useState } from 'react'

import { FaXmark } from 'react-icons/fa6'

import Modal from './ui/Modal'
import ConfirmActionDialog from './ui/ConfirmActionDialog'

import { usePostsDB } from '../hooks/usePostsDB'

const PostCreatorModal = ({ setIsCreatorModalOpen }) => {
    const { createNewPost } = usePostsDB()

    const [postText, setPostText] = useState("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const hasPostCreated = await createNewPost(postText)

        if (hasPostCreated) setIsCreatorModalOpen(false)
    }

    const cancelAction = () => {
        if (postText) setIsConfirmOpen(true)
        else setIsCreatorModalOpen(false)
    }

    return (
        <>
            <Modal direction={"horizontal"}>
                <div className="modal-header">
                    <h2>Criar nova publicação</h2>
                    <div className="close-button" onClick={cancelAction}>
                        <FaXmark size={20} />
                    </div>
                </div>
                <div className="modal-content">
                    <textarea
                        className="modal-textarea"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        maxLength={500}
                    ></textarea>
                </div>
                <div className="modal-actions">
                    <button
                        className='cancel-button'
                        onClick={cancelAction}
                    >
                        Cancelar
                    </button>
                    <button
                        className='post-button'
                        onClick={handleSubmit}
                    >
                        Postar
                    </button>
                </div>
            </Modal>
            {
                isConfirmOpen && (
                    <ConfirmActionDialog
                        message={"Deseja mesmo sair? O conteúdo não será salvo."}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => setIsCreatorModalOpen(false)}
                    />
                )
            }
        </>
    )
}

export default PostCreatorModal