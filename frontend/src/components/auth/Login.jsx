import { useEffect, useRef, useState } from "react"

import { useUsersDB } from '../../hooks/useUsersDB'
import { Link } from "react-router-dom"

import { useSocialMediaContext } from "../../hooks/useSocialMediaContext"

const Login = () => {
    const { errorDispatch } = useSocialMediaContext()

    const [ email, setEmail] = useState("")
    const [ password, setPassword] = useState("")

    const emailRef = useRef()
    const passwordRef = useRef()

    useEffect(() => {
        emailRef.current.setCustomValidity("O email é obrigatório.")
        passwordRef.current.setCustomValidity("A senha é obrigatória.")
    }, [])
    
    const { login } = useUsersDB()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) return errorDispatch("Preencha todos os campos para prosseguir.")

        await login(email, password)
    }

    const handleEmailChange = (e) => {
        const value = e.target.value
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        setEmail(value)

        if (value === "")
            e.target.setCustomValidity("O e-mail é obrigatório.")

        else if (!emailRegex.test(value)) 
            e.target.setCustomValidity("Digite um e-mail válido.")

        else 
            e.target.setCustomValidity("")
    }

    const handlePassword = (e) => {
        const value = e.target.value

        setPassword(value)

        if (value === "") e.target.setCustomValidity("A senha é obrigatória.")
        else e.target.setCustomValidity("")
    }

    return (
        <div className='login background-box'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p className="form-label-text">Digite seu email</p>
                    <input
                        type="email" 
                        id='email' 
                        value={email}
                        onChange={handleEmailChange}
                        ref={emailRef}
                        maxLength={254}
                        autoFocus
                        required
                    />
                </label>
                <label>
                    <p className="form-label-text">Digite sua senha</p>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={handlePassword}
                        ref={passwordRef}
                        maxLength={128}
                        required
                    />
                </label>
                <button type="submit" className="submit-button">Entrar</button>
            </form>
            <p>Clique aqui para se <Link to="/signup">Cadastrar</Link></p>
        </div>
    )
}

export default Login