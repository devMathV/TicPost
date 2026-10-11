// Estilos
import './MainLayout.css'

// Componentes
import NavBar from '../components/navbar/NavBar'

// React Router
import { Navigate, Outlet } from 'react-router-dom'

// Context
import { useSocialMediaContext } from '../hooks/useSocialMediaContext'

const MainLayout = () => {
    const { context } = useSocialMediaContext()

    if (!context.isLogged) return <Navigate to={"/login"} />

    return (
        <div className='main-layout'>
            <NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout