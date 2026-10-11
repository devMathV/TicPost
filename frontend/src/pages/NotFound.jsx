import './NotFound.css'

import NavBar from '../components/notfound/NavBar'

import { useNavigate, useLocation } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()

    const location = useLocation()

    return (
        <div className='not-found'>
            <NavBar />
            <section>
                <h1>Página não encontrada</h1>
                <p>A página <strong>{`"${location.pathname}"`}</strong> não foi encontrada ou foi excluída.</p>
                <p>Clique no botão abaixo para ir para o início.</p>
                <button onClick={() => navigate("/login")}>
                    Ir para o início
                </button>
            </section>
        </div>
    )
}

export default NotFound