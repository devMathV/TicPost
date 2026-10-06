import { useState } from 'react'

import EditModal from '../ui/EditModal'
import ConfirmActionDialog from '../ui/ConfirmActionDialog'

import { useUsersDB } from '../../hooks/useUsersDB'

import { useSocialMediaContext } from '../../hooks/useSocialMediaContext'

const EditProfileModal = ({ setIsEditing, displayName, username, biography }) => {
    const { errorDispatch } = useSocialMediaContext()

    const [newDisplayName, setNewDisplayName] = useState(displayName)
    const [newUsername, setNewUsername] = useState(username)
    const [newBiography, setNewBiography] = useState(biography)

    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
    const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)

    const { update } = useUsersDB()

    const cancelButtonClick = () => {
        if (newDisplayName !== displayName || newUsername !== username || newBiography !== biography) {
            setIsCancelConfirmOpen(true)
        } else {
            setIsEditing(false)
        }
    }

    const saveButtonClick = () => {
        newDisplayName.trim().length === 0 ? setNewDisplayName(username) : setNewDisplayName(newDisplayName.trim())
        setNewUsername(newUsername.trim())

        if (newBiography) setNewBiography(newBiography.trim())
        if (!newBiography || newBiography.length === 0) setNewBiography(null)

        if (newDisplayName === displayName && newUsername === username && newBiography === biography && newBiography !== null) {
            return errorDispatch("Informe pelo menos um campo para atualizar.")
        }

        if (!username) {
            return errorDispatch("Preencha todos os campos obrigatórios para prosseguir.")
        }

        setIsSaveConfirmOpen(true)
    }

    const updateUser = async () => {
        const data = {}

        if (newDisplayName && newDisplayName !== displayName) data.displayName = newDisplayName
        if (newUsername && newUsername !== username) data.username = newUsername
        if (newBiography || newBiography === null && newBiography !== biography) data.biography = newBiography

        if (Object.entries(data).length === 0) return errorDispatch("Informe pelo menos um campo para atualizar.")

        const hasUserUpdated = await update(data)

        if (hasUserUpdated) {
            setIsSaveConfirmOpen(false)
            setIsEditing(false)
        }
    }

    const handleNewDisplayNameChange = (e) => {
        const value = e.target.value

        setNewDisplayName(value)

        if (value.length !== 0 && value.length < 3 || value.length > 35) 
            e.target.setCustomValidity("O nome de exibição deve ter no mínimo 3 caracteres e no máximo 35.")

        else 
            e.target.setCustomValidity("")
    }

    const handleNewUsernameChange = (e) => {
        const value = e.target.value

        setNewUsername(value)

        if (value === "")
            e.target.setCustomValidity("O nome de usuário é obrigatório.")

        else if (!/^[a-zA-Z0-9_]+$/.test(value))
            e.target.setCustomValidity("O nome de usuário só pode conter letras, números e _.")

        else if (value.length < 8 || value.length > 20)
            e.target.setCustomValidity("O nome de usuário deve ter no mínimo 3 caracteres e no máximo 20.")

        else 
            e.target.setCustomValidity("")
    }

    const handleNewBiographyChange = (e) => {
        const value = e.target.value

        setNewBiography(value)

        if (value.length > 160)
            e.target.setCustomValidity("A biografia deve ter no máximo 160 caracteres.")

        else 
            e.target.setCustomValidity("")
    }

    return (
        <EditModal
            title={"Editar perfil"}
            onClose={cancelButtonClick}
            onSave={saveButtonClick}
            direction={"vertical"}
        >
            <label>
                <p className='modal-input-label'>Nome de exibição</p>
                <input
                    type="text"
                    id="display-name"
                    className='modal-input'
                    value={newDisplayName}
                    onChange={handleNewDisplayNameChange}
                    maxLength={35}
                    placeholder={username}
                />
            </label>
            <label>
                <p className='modal-input-label'>Nome de usuário</p>
                <input
                    type="text"
                    id="username"
                    className='modal-input'
                    value={newUsername}
                    onChange={handleNewUsernameChange}
                    maxLength={20}
                    required
                />
            </label>
            <label>
                <p className='modal-input-label'>Biografia</p>
                <textarea
                    id="textarea"
                    className='modal-textarea'
                    value={newBiography}
                    onChange={handleNewBiographyChange}
                    maxLength={160}
                ></textarea>
            </label>
            {isCancelConfirmOpen && (
                <ConfirmActionDialog
                    message={"Deseja mesmo sair sem salvar?"}
                    onClose={() => setIsCancelConfirmOpen(false)}
                    onConfirm={() => setIsEditing(false)}
                />
            )}
            {isSaveConfirmOpen && (
                <ConfirmActionDialog
                    message={"Deseja mesmo salvar as alterações?"}
                    onClose={() => setIsSaveConfirmOpen(false)}
                    onConfirm={updateUser}
                />
            )}
        </EditModal>
    )
}

export default EditProfileModal