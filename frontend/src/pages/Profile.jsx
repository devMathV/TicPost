// Estilos
import './Profile.css'

// React
import { useEffect, useState } from 'react'

// Componentes
import ProfileUserInfo from '../components/profile/ProfileUserInfo'
import Post from "../components/Post/Post"
import EmptyPosts from '../components/ui/EmptyPosts'

// Context
import { useSocialMediaContext } from "../hooks/useSocialMediaContext"

// Hooks
import { usePostsDB } from '../hooks/usePostsDB'

const Profile = () => {
    const { context } = useSocialMediaContext()

    const { getAllUserPosts } = usePostsDB()

    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [hasMorePosts, setHasMorePosts] = useState(true)
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)

    if (!context.isLogged) return 

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoadingPosts(true)

            const { posts: postsData, hasMorePosts } = await getAllUserPosts(context.id, page)
            
            setPosts((prevPosts) => [
                ...prevPosts,
                ...postsData
            ])

            setHasMorePosts(hasMorePosts)
            setIsLoadingPosts(false)
        }

        loadPosts()
    }, [page])

    return (
        <div className="profile">
            <ProfileUserInfo />
            <h3>postagens mais recentes</h3>
            <div className="posts-container">
                {posts && posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
            {hasMorePosts && (
                <button 
                    className='load-posts'
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                    disabled={isLoadingPosts}
                >
                    {isLoadingPosts ? "Carregando..." : "Carregar mais"}
                </button>
            )}
            {!isLoadingPosts && posts.length === 0 && (
                <EmptyPosts />
            )}
        </div>
    )
}

export default Profile