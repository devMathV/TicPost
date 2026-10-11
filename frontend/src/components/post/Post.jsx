import './Post.css'

import { useEffect, useRef, useState } from "react"

import { useSocialMediaContext } from "../../hooks/useSocialMediaContext"
import useClickOutside from '../../hooks/useClickOutside'

import PostSettings from './PostSettings'
import EditPostModal from './EditPostModal'

const Post = ({ post }) => {
    const { context } = useSocialMediaContext()

    const [isEditing, setIsEditing] = useState(false)
    const [isPostSettingsHidden, setIsPostSettingsHidden] = useState(true)

    useEffect(() => {
        if (isEditing) setIsPostSettingsHidden(true)
    }, [isEditing])

    const postSettingsRef = useRef(null)

    useClickOutside(postSettingsRef, () => {
        setIsPostSettingsHidden(true)
    })

    return (
        <div className='post background-box'>
            <div className='post-author-info'>
                <img src={post.author.avatarURL} alt={post.author.displayName} className='profile-picture' />
                <p className='author-name'>{post.author.displayName}</p>
            </div>
            <p className='post-message'>{post.message}</p>
            {post.authorId === context.id && (
                <>
                    <PostSettings
                        isPostSettingsHidden={isPostSettingsHidden}
                        setIsPostSettingsHidden={setIsPostSettingsHidden}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        post={post}
                        postSettingsRef={postSettingsRef}
                    />
                    {isEditing && (
                        <EditPostModal
                            post={post}
                            setIsEditing={setIsEditing}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default Post