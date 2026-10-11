// Estilos
import './Auth.css'

// React Router
import { Navigate, Outlet } from 'react-router-dom'

// Hooks
import { useSocialMediaContext } from '../hooks/useSocialMediaContext'

const Auth = () => {
    const { context } = useSocialMediaContext()

    if (context.isLogged) return <Navigate to="/home" />

    return (
        <div className='auth'>
            <Outlet />
        </div>
    )
}

export default Auth