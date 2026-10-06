import { useState, useEffect, useRef } from "react"

import { useUsersDB } from "../../hooks/useUsersDB"

import { Link, useNavigate } from "react-router-dom"
import { useSocialMediaContext } from "../../hooks/useSocialMediaContext"

const SignUp = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    useEffect(() => {
        nameRef.current.setCustomValidity("O nome de usuário é obrigatório.")
        emailRef.current.setCustomValidity("O email é obrigatório.")
        passwordRef.current.setCustomValidity("A senha é obrigatória.")
        confirmPasswordRef.current.setCustomValidity("A senha de confirmação é obrigatória.")
    }, [])

    const { register } = useUsersDB()
    const { errorDispatch } = useSocialMediaContext()

    const handleUsernameChange = (e) => {
        const value = e.target.value

        setUsername(value)

        if (value === "")
            e.target.setCustomValidity("O nome de usuário é obrigatório.")

        else if (!/^[a-zA-Z0-9_]+$/.test(value))
            e.target.setCustomValidity("O nome de usuário só pode conter letras, números e _.")

        else if (value.length < 3 || value.length > 20)
            e.target.setCustomValidity("O nome de usuário deve ter no mínimo 3 caracteres e no máximo 20.")

        else 
            e.target.setCustomValidity("")
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

    const handlePasswordChange = (e) => {
        const value = e.target.value

        setPassword(value)

        if (value === "")
            e.target.setCustomValidity("A senha é obrigatória.")

        else if (!/^\S+$/.test(value))
            e.target.setCustomValidity("A senha não pode conter espaços.")

        else if (value.length < 8 || value.length > 128)
            e.target.setCustomValidity("A senha deve ter no mínimo 8 caracteres e no máximo 128.")

        else
            e.target.setCustomValidity("")
    }

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value

        setConfirmPassword(value)

        if (value === "")
            e.target.setCustomValidity("A senha de confirmação é obrigatória.")

        else if (value !== password)
            e.target.setCustomValidity("A senha de confirmação não coincide com a senha informada.")

        else 
            e.target.setCustomValidity("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!username || !email || !password || !confirmPassword) return errorDispatch("Preencha todos os campos para prosseguir.")
        if (password !== confirmPassword) return errorDispatch("A senha de confirmação não coincide com a senha informada.")

        const wasUserCreated = await register(username, email, password)

        if (wasUserCreated) navigate('/verify-email', {
            state: {
                email
            }
        })
    }

    return (
        <div className='signup background-box'>
            <h1>Cadastre-se</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Digite um nome de usuário</p>
                    <input
                        type="text"
                        id='name'
                        value={username}
                        onChange={handleUsernameChange}
                        ref={nameRef}
                        maxLength={20}
                        required
                        autoFocus
                    />
                </label>
                <label>
                    <p>Digite seu email</p>
                    <input
                        type="email"
                        id='email'
                        value={email}
                        onChange={handleEmailChange}
                        ref={emailRef}
                        maxLength={128}
                        required
                    />
                </label>
                <label>
                    <p>Digite sua senha</p>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        maxLength={128}
                        ref={passwordRef}
                        required
                    />
                </label>
                <label>
                    <p>Confirme sua senha</p>
                    <input
                        type="password"
                        id="passwordAgain"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        maxLength={128}
                        ref={confirmPasswordRef}
                        required
                    />
                </label>
                <button type="submit">Cadastrar</button>
            </form>
            <p>Tem uma conta? Clique aqui para <Link to="/login">Entrar</Link></p>
        </div>
    )
}

export default SignUp