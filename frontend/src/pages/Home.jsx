// Estilos
import './Home.css'

// React
import { useEffect, useState } from "react"

// Componentes
import PostCreator from "../components/PostCreator"
import Post from '../components/post/Post'
import EmptyPosts from '../components/ui/EmptyPosts'

// Hooks
import { usePostsDB } from "../hooks/usePostsDB"
import { useSocialMediaContext } from "../hooks/useSocialMediaContext"

const Home = () => {
    const { context } = useSocialMediaContext()

    const { getAllPosts } = usePostsDB()

    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [hasMorePosts, setHasMorePosts] = useState(true)
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)

    if (!context.isLogged) return

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoadingPosts(true)

            const { posts: postsData, hasMorePosts } = await getAllPosts(page)
            
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
        <div className="home">
            <PostCreator />
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

export default Home