import "./NavBar.css"

import logo from '../../assets/logo-icon.png'

import { useState, useRef, useEffect } from "react";

import { FaHome } from "react-icons/fa";
import { BsHouse, BsHouseFill, BsPlusSquareFill } from "react-icons/bs";
import { FaPlus, FaEllipsis } from "react-icons/fa6";

import PostCreatorModal from "../PostCreatorModal";
import ConfirmActionDialog from "../ui/ConfirmActionDialog";

import { useSocialMediaContext } from "../../hooks/useSocialMediaContext"
import { useUsersDB } from "../../hooks/useUsersDB"
import useWindowWidth from "../../hooks/useWindowWidth";

import { useNavigate, NavLink, useLocation } from "react-router-dom"
import useClickOutside from "../../hooks/useClickOutside";

const NavBar = () => {
    const { context } = useSocialMediaContext()
    const width = useWindowWidth()

    const location = useLocation()
    const navigate = useNavigate()

    const { logout } = useUsersDB()

    const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false)
    const [isNavProfileOptionsHidden, setIsNavProfileOptionsHidden] = useState(true)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const navProfileRef = useRef(null)

    useClickOutside(navProfileRef, () => {
        setIsNavProfileOptionsHidden(true)
    })

    const handleProfileClick = () => {
        if (location.pathname === "/profile" && width <= 500) {
            setIsNavProfileOptionsHidden(prev => !prev)
        }
        else if (width <= 500) {
            navigate("/profile")
        }
        else {
            setIsNavProfileOptionsHidden(prev => !prev)
        }
    }

    return (
        <nav className="nav-home">
            <div className="nav-options-container">
                <NavLink to={"/home"} className="nav-logo">
                    <img src={logo} alt="Logo" className="logo" />
                </NavLink>
                <NavLink to={"/home"} className={({ isActive }) => "nav-option " + (isActive ? "active" : "")}>
                    <FaHome /> <span>Início</span>
                </NavLink>
                <p className="nav-option" onClick={() => setIsCreatorModalOpen(true)}>
                    <FaPlus /> <span>Postar</span>
                </p>
                {isCreatorModalOpen && (
                    <PostCreatorModal
                        setIsCreatorModalOpen={setIsCreatorModalOpen}
                    />
                )}
                <div className="nav-profile-container" ref={navProfileRef}>
                    <div onClick={handleProfileClick} className="nav-profile-button">
                        <div className="nav-profile">
                            <img src={context.avatarURL} alt={context.displayName} className="profile-picture" />
                            <p className="display-name">{context.displayName}</p>
                        </div>
                        <FaEllipsis size={24} />
                    </div>
                    {!isNavProfileOptionsHidden && (
                        <div className="nav-profile-options-container" onClick={() => setIsNavProfileOptionsHidden(true)}>
                            {width >= 500 && (
                                <div className="nav-profile-option">
                                    <NavLink to={"/profile"}>Ver Perfil</NavLink>
                                </div>
                            )}
                            <div className="nav-profile-option" onClick={() => setIsConfirmOpen(true)}>
                                <p>Sair da conta</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isConfirmOpen && (
                <ConfirmActionDialog
                    message={"Deseja mesmo sair? Você poderá entrar novamente depois."}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={logout}
                    confirmButtonMessage={"Sair"}
                />
            )}
        </nav>
    )
}

export default NavBar