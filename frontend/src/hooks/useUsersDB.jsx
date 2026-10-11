import api from '../services/api'
import { useSocialMediaContext } from "./useSocialMediaContext";

export const useUsersDB = () => {
    const { commonDispatch, errorDispatch, successDispatch } = useSocialMediaContext();

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', {
                email,
                password
            })

            commonDispatch(
                "LOGGED_TRUE",
                { userData: data.user }
            )

            successDispatch(data.successMessage)

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const register = async (username, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { username, email, password })

            successDispatch(data.successMessage)

            return "user created"

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const verifyEmail = async (email, code) => {
        try {
            const { data } = await api.post('/auth/verify-email', { email, code })

            commonDispatch(
                "LOGGED_TRUE",
                { userData: data.user }
            )

            successDispatch(data.successMessage)

            return 'verified user'
        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }

    }

    const logout = async () => {
        try {
            const { data } = await api.post('/auth/logout')

            commonDispatch(
                "LOGOUT",
                { messageToUser: data.successMessage }
            )

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const update = async (newData) => {
        try {
            const { data } = await api.put('/users/me', newData)

            commonDispatch(
                "UPDATE_USER",
                { userData: data.user }
            )

            successDispatch(data.successMessage)

            if (data.successMessage) return "user updated"

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    return {
        login,
        register,
        verifyEmail,
        logout,
        update
    };
};