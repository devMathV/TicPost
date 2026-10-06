import { Prisma } from "@prisma/client";
import prisma from '../lib/prisma.js'

const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1

        const limit = 6

        const skip = (page - 1) * limit

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                authorId: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        displayName: true,
                        avatarURL: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        let hasMorePosts = true

        const morePosts = await prisma.post.findMany({
            skip,
            take: limit + 1
        })
        if (morePosts.length < 7) hasMorePosts = false

        return res.status(200).json({
            posts,
            hasMorePosts
        })

    } catch (error) {
        res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                authorId: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        displayName: true,
                        avatarURL: true,
                    }
                }
            }
        })

        if (!post) {
            return res.status(404).json({
                errorMessage: "Postagem não encontrada ou já excluída."
            })
        }

        return res.status(200).json(post)

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2023") {
                return res.status(400).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
                })
            }
        }

        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
        })
    }
}

const getAllPostsByAuthor = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1

        const limit = 6

        const skip = (page - 1) * limit

        const posts = await prisma.post.findMany({
            where: { authorId: req.params.id },
            skip,
            take: limit,
            select: {
                id: true,
                authorId: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        displayName: true,
                        avatarURL: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        let hasMorePosts = true

        const morePosts = await prisma.post.findMany({
            where: { authorId: req.params.id },
            skip,
            take: limit + 1
        })
        if (morePosts.length < 7) hasMorePosts = false

        return res.status(200).json({
            posts,
            hasMorePosts
        })

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
        })
    }
}

const createPost = async (req, res) => {
    try {
        const { message } = req.body

        if (!message) {
            return res.status(400).json({
                errorMessage: "O conteúdo da postagem não pode ser vazio."
            })
        }

        if (message.lenght > 500) {
            return res.status(422).json({
                errorMessage: "O conteúdo da postagem excede o limite de caracteres."
            })
        }

        const authorId = req.userId

        if (!authorId) {
            return res.status(400).json({
                errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
            })
        }

        const newPost = await prisma.post.create({
            data: { message, authorId },
            select: {
                id: true,
                authorId: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        displayName: true,
                        avatarURL: true
                    }
                }
            }
        })

        return res.status(201).json({
            successMessage: "Postagem enviada.",
            newPost
        })

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const { message } = req.body

        if (!message) {
            return res.status(400).json({
                errorMessage: "O conteúdo da postagem não pode ser vazio."
            })
        }

        if (message.lenght > 500) {
            return res.status(422).json({
                errorMessage: "O conteúdo da postagem excede o limite de caracteres."
            })
        }

        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id,
                authorId: req.userId
            }
        })

        if (!post) {
            return res.status(403).json({
                errorMessage: "Você não pode executar essa ação."
            })
        }

        const updatedPost = await prisma.post.update({
            where: { id: req.params.id },
            data: { message },
        })

        return res.status(200).json({
            successMessage: "Postagem atualizada."
        })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
                })
            }

            if (error.code === "P2023") {
                return res.status(400).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
                })
            }
        }

        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id,
                authorId: req.userId
            }
        })
        if (!post) {
            return res.status(403).json({
                errorMessage: "Você não pode executar essa ação."
            })
        }

        const deletedPost = await prisma.post.delete({ where: { id: req.params.id } })

        return res.status(200).json({
            successMessage: "Postagem deletada."
        })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({
                    errorMessage: "Postagem não encontrada ou já excluída"
                })
            }

            if (error.code === "P2023") {
                return res.status(400).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
                })
            }
        }

        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
        })
    }
}

export {
    getAllPosts,
    getPostById,
    getAllPostsByAuthor,
    createPost,
    updatePost,
    deletePost,
};