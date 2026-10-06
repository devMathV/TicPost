import './PostSettings.css'

import { useState } from 'react';

import { FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";

import ConfirmActionDialog from '../ui/ConfirmActionDialog';

import { usePostsDB } from "../../hooks/usePostsDB";

const PostSettings = ({ isPostSettingsHidden, setIsPostSettingsHidden, setIsEditing, post, postSettingsRef }) => {
    const { deletePost } = usePostsDB()

    const [isConfirmOpen, setIsConfirmOpen] = useState()

    const deletePostAction = () => {
        deletePost(post.id)
        setIsConfirmOpen(false)
    }

    return (
        <div className="post-settings-container" ref={postSettingsRef}>
            <div className='post-settings-button' onClick={() => setIsPostSettingsHidden(prev => !prev)}>
                <FaEllipsis size={20} />
            </div>
            {!isPostSettingsHidden && (
                <div className="post-settings-options-container">
                    <div onClick={() => setIsEditing(true)} className="post-settings-option">
                        <FaPen /> Editar
                    </div>
                    <div onClick={() => setIsConfirmOpen(true)} className="post-settings-option">
                        <FaTrash />Excluir
                    </div>
                </div>
            )}
            {isConfirmOpen && (
                <ConfirmActionDialog
                    message={"Deseja mesmo excluir essa publicação?"}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={deletePostAction}
                />
            )}
        </div>
    )
}

export default PostSettings