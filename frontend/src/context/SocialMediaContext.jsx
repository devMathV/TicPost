import { createContext, useReducer, useEffect } from 'react'
import api from '../services/api'

export const SocialMediaContext = createContext()

const initialState = {
    id: "",
    username: "",
    displayName: "",
    email: "",
    avatarURL: "",
    biography: "",
    isLogged: false,
    error: "",
    messageToUser: "",
    isGlobalLoading: false
}

const SocialMediaReducer = (state, action) => {
    let userData = {}

    if (action.payload?.userData) userData = action.payload.userData
    
    switch (action.type) {
        case "LOGGED_TRUE":
            return {
                ...state,
                ...userData,
                isLogged: true,
            }
        case "LOGOUT":
            return {
                ...initialState,
                messageToUser: action.payload.messageToUser
            }
        case "UPDATE_USER":
            return {
                ...state,
                ...userData,
            }
        case "ERROR":
            return {
                ...state,
                error: action.payload.error,
                messageToUser: ""
            }
        case "SEND_MESSAGE_TO_USER":
            return {
                ...state,
                messageToUser: action.payload.messageToUser,
                error: "",
            }
        case "REMOVE_MESSAGE_TO_USER":
            return {
                ...state,
                messageToUser: "",
                error: ""
            }
        case "LOADING":
            return {
                ...state,
                isGlobalLoading: true
            }
        case "LOADING_FINISHED":
            return {
                ...state,
                isGlobalLoading: false
            }
        default:
            return state
    }
}

export const SocialMediaContextProvider = ({ children }) => {
    const [context, dispatch] = useReducer(SocialMediaReducer, initialState)

    const loadUser = async () => {
        try {
            dispatch({ type: "LOADING" })

            const { data } = await api.get("/users/me")

            dispatch({
                type: "LOGGED_TRUE",
                payload: {
                    userData: data.user
                }
            })
        } catch (error) {
            // Não estava logado
        } finally {
            dispatch({ type: "LOADING_FINISHED" })
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <SocialMediaContext.Provider value={{ context, dispatch }}>
            {children}
        </SocialMediaContext.Provider>
    )
}