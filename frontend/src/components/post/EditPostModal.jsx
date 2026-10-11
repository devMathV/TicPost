import { useState } from "react"

import EditModal from '../ui/EditModal';
import ConfirmActionDialog from '../ui/ConfirmActionDialog';

import { usePostsDB } from "../../hooks/usePostsDB"

import { useSocialMediaContext } from '../../hooks/useSocialMediaContext';

const EditPostModal = ({ post, setIsEditing }) => {
    const [newPostMessage, setNewPostMessage] = useState(post.message)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const { errorDispatch } = useSocialMediaContext()

    const { updatePost } = usePostsDB()

    const editPost = async () => {
        if (!newPostMessage) return errorDispatch("O conteúdo da postagem não pode ser vazio.")
        if (newPostMessage === post.message) return errorDispatch("Altere o conteúdo da postagem para poder editar.")

        const hasPostUpdated = await updatePost(post.id, newPostMessage)

        if (hasPostUpdated) setIsEditing(false)
    }

    const onClose = () => {
        if (newPostMessage !== post.message) setIsConfirmOpen(true)
        else setIsEditing(false)
    }

    return (
        <>
            <EditModal
                title={"Editar postagem"}
                onClose={onClose}
                onSave={editPost}
                direction={"horizontal"}
            >
                <textarea
                    className="modal-textarea"
                    value={newPostMessage}
                    onChange={(e) => setNewPostMessage(e.target.value)}
                    maxLength={500}
                ></textarea>
            </EditModal>
            {isConfirmOpen && (
                <ConfirmActionDialog
                    message={"Deseja mesmo sair? O conteúdo não será salvo."}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={() => setIsEditing(false)}
                />
            )}
        </>
    )
}

export default EditPostModal