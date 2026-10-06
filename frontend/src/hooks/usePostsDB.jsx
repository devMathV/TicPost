import { useSocialMediaContext } from "./useSocialMediaContext";

import api from "../services/api";

export const usePostsDB = () => {
    const { errorDispatch, successDispatch } = useSocialMediaContext()

    const getAllPosts = async (page) => {
        try {
            const { data: allPosts } = await api.get(`/posts?page=${page}`);

            return allPosts;

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    };

    const createNewPost = async (message) => {
        try {
            const { data } = await api.post('/posts', { message })

            successDispatch(data.successMessage)

            if (data.successMessage) return "post created"

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const updatePost = async (postId, newMessage) => {
        try {
            const { data } = await api.put(`/posts/${postId}`, { message: newMessage })

            successDispatch(data.successMessage)

            return "post updated"

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const deletePost = async (postId) => {
        try {
            const { data } = await api.delete(`/posts/${postId}`)

            successDispatch(data.successMessage)

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    const getAllUserPosts = async (userId, page) => {
        try {
            const { data: userPosts} = await api.get(`/posts/user/${userId}?page=${page}`)

            return userPosts

        } catch (error) {
            errorDispatch(error.response.data.errorMessage)
        }
    }

    return {
        getAllPosts,
        createNewPost,
        updatePost,
        deletePost,
        getAllUserPosts
    };
}