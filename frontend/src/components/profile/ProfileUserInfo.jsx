import './ProfileUserInfo.css'

import { useState } from 'react';

import { FaPen } from "react-icons/fa6";

import EditProfileModal from './EditProfileModal';

import { useSocialMediaContext } from "../../hooks/useSocialMediaContext";

const ProfileUserInfo = () => {
    const { context } = useSocialMediaContext()

    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className='profile-user-info-container background-box'>
            <img src={context.avatarURL} alt={context.displayName} className="profile-picture" />
            <div className='display-username-container'>
                <p className="display-name">{context.displayName}</p>
                <p className="username">@{context.username}</p>
            </div>
            {context.biography && (
                <p className='biography'>{context.biography}</p>
            )}
            <div className='edit-button' onClick={() => setIsEditing(true)}><FaPen /> Editar</div>
            {isEditing && (
                <EditProfileModal
                    setIsEditing={setIsEditing}
                    displayName={context.displayName}
                    username={context.username}
                    biography={context.biography}
                />
            )}
        </div>
    )
}

export default ProfileUserInfo