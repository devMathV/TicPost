import './EmptyPosts.css'

import { FaRegFrown } from "react-icons/fa";

const EmptyPosts = () => {
    return (
        <div className="empty-posts">
            <h2>Não há novas postagens por aqui</h2>
            <FaRegFrown />
        </div>
    )
}

export default EmptyPosts