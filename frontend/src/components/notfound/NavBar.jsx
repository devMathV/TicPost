import './NavBar.css'

import logo from '../../assets/logo-icon.png'

import { useNavigate } from 'react-router-dom'

const NavBar = () => {
    const navigate = useNavigate()

    return (
        <nav className='nav-not-found'>
            <div className="nav-logo" onClick={() => navigate("/login")}>
                <img src={logo} alt="Logo" className='logo' />
                <h2>TicPost</h2>
            </div>
            <div className="nav-auth" onClick={() => navigate("/login")}>
                Entrar na conta / Criar conta
            </div>
        </nav>
    )
}

export default NavBar