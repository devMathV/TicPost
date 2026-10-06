import "./VerifyEmail.css"

import { useState, useEffect, useRef } from "react"

import { useUsersDB } from "../../hooks/useUsersDB"

import { useLocation, useNavigate } from "react-router-dom"

const VerifyEmail = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const email = location.state?.email

    if (!email) navigate("/signup")

    const [code, setCode] = useState("")

    const codeRef = useRef(null)

    useEffect(() => {
        codeRef.current.setCustomValidity("O código é obrigatório.")
    }, [])

    const { verifyEmail } = useUsersDB()

    const handleCodeChange = (e) => {
        const value = e.target.value

        const codeRegex = /^[0-9]{6}$/

        if (!/^[0-9]{0,}$/.test(value)) return
        setCode(value)

        if (value === "") 
            e.target.setCustomValidity("O código é obrigatório")
        
        else if (!codeRegex.test(value))
            e.target.setCustomValidity("O código deve conter 6 dígitos.")

        else 
            e.target.setCustomValidity("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        verifyEmail(email, code)
    }

    return (
        <div className='verify-email background-box'>
            <h1>Informe o código</h1>
            <form onSubmit={handleSubmit}>
                <p>O código foi enviado para o email:</p>
                <p className="user-email">{email}</p>
                <label>
                    <p>Digite o código abaixo</p>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={handleCodeChange}
                        ref={codeRef}
                        maxLength={6}
                        autoFocus
                        required
                    />
                </label>
                <div className="actions-buttons">
                    <button type="button" className="back-button" onClick={() => navigate("/signup")}>
                        Voltar
                    </button>
                    <button type="submit">
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default VerifyEmail