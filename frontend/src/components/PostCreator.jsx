import './PostCreator.css'

import { useState } from 'react'

import { usePostsDB } from '../hooks/usePostsDB'

import { useSocialMediaContext } from '../hooks/useSocialMediaContext'

const PostCreator = () => {
    const { context } = useSocialMediaContext()

    const [postText, setPostText] = useState("")

    const { createNewPost } = usePostsDB()

    const handleChange = (e) => {
        const textarea = e.target

        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`

        if (textarea.scrollHeight >= 250) textarea.style.overflowY = "scroll"
        else textarea.style.overflowY = "hidden"

        setPostText(textarea.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const hasPostCreated = await createNewPost(postText)

        if (hasPostCreated) setPostText("")
    }

    return (
        <div className='post-creator-container background-box'>
            <img src={context.avatarURL} alt={context.displayName} className='profile-picture' />
            <form onSubmit={handleSubmit}>
                <textarea
                    className='post-creator-button'
                    id="post-creator-button"
                    placeholder='No que você está pensando agora?'
                    rows={1}
                    value={postText}
                    onChange={handleChange}
                    maxLength={500}
                ></textarea>
                <button type='submit' className='post-creator-submit'>Postar</button>
            </form>
        </div>
    )
}

export default PostCreator