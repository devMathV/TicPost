import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto"
import resend from '../services/resend.js';

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarURL: true,
                biography: true,
            }
        })

        if (!user) {
            return res.status(404).json({
                errorMessage: "Usuário não encontrado."
            })
        }

        return res.status(200).json({ user })

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um problema. Tente novamente mais tarde.",
        })
    }
};

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({
                errorMessage: "Preencha todos os campos obrigatórios.",
            });
        }

        // Valida se todos os campos estão realmente nos padrões
        const usernameRegex = /^[a-zA-Z0-9_]+$/
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const passwordRegex = /^\S+$/

        const isUsernameValid =
            username &&
            usernameRegex.test(username) &&
            username.length >= 3 &&
            username.length <= 20

        const isEmailValid =
            email &&
            emailRegex.test(email)

        const isPasswordValid =
            password &&
            passwordRegex.test(password) &&
            password.length >= 8 &&
            password.length <= 128

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            return res.status(400).json({
                errorMessage: "Os dados informados são inválidos."
            })
        }

        // Verifica se já uma conta com esse email e username
        const existingEmail = await prisma.user.findUnique({ where: { email } })
        if (existingEmail) return res.status(409).json({
            errorMessage: "Este email já está cadastrado.",
        })

        const existingUsername = await prisma.user.findUnique({ where: { username } })
        if (existingUsername) return res.status(409).json({
            errorMessage: "Este nome de usuário já está sendo usado.",
        })

        // Transformando os dados para enviar para o banco
        const passwordHash = await bcrypt.hash(password, 10)

        const code = crypto.randomInt(100000, 1000000).toString()

        const codeHash = await bcrypt.hash(code, 10)

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Verificar se já existe essa conta no banco (por enquanto só está verificando o email)
        const existingPendingRegistration = await prisma.pendingRegistration.findFirst({
            where: { email }
        })

        if (existingPendingRegistration) {
            await prisma.pendingRegistration.update({
                where: {
                    id: existingPendingRegistration.id
                },
                data: {
                    username,
                    displayName: username,
                    passwordHash,
                    codeHash,
                    expiresAt,
                    attempts: 0
                }
            })
        } else {
            await prisma.pendingRegistration.create({
                data: {
                    email,
                    username,
                    displayName: username,
                    passwordHash,
                    codeHash,
                    expiresAt
                }
            })
        }

        // Enviar código pro email
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Código de verificação",
            html: `
            <h1>Confirme seu e-mail</h1>

            <p>Seu código de verificação é:</p>

            <h2>${code}</h2>

            <p>Esse código é válido por 10 minutos.</p>
        `
        })

        return res.status(201).json({
            successMessage: "Código de verificação enviado para o seu email.",
        });

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body

        if (!email || !code) {
            return res.status(400).json({
                errorMessage: "Os dados informados são inválidos."
            })
        }

        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                errorMessage: "Os dados informados são inválidos."
            })
        }

        const pendingRegistration = await prisma.pendingRegistration.findFirst({
                where: { email }
            })

        if (!pendingRegistration) {
            return res.status(400).json({
                errorMessage: "Código inválido ou expirado."
            })
        }

        if (new Date() > pendingRegistration.expiresAt) {
            return res.status(400).json({
                errorMessage: "Código inválido ou expirado."
            })
        }

        const isCodeValid = await bcrypt.compare(
            code,
            pendingRegistration.codeHash
        )

        if (!isCodeValid) {
            return res.status(400).json({
                errorMessage: "Código inválido ou expirado."
            })
        }

        const user = await prisma.user.create({
            data: {
                email: pendingRegistration.email,
                username: pendingRegistration.username,
                displayName: pendingRegistration.displayName,
                passwordHash: pendingRegistration.passwordHash,
                avatarURL: "https://res.cloudinary.com/jiymfayh/image/upload/v1788808550/default-avatar.jpg"
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarURL: true,
                biography: true
            }
        })

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await prisma.pendingRegistration.delete({
            where: {
                id: pendingRegistration.id
            }
        })

        return res.status(200).json({
            successMessage: "Conta criada com sucesso.",
            user
        })

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
            user
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({
                errorMessage: "Email ou senha inválidos.",
            });
        };

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                errorMessage: "Email ou senha inválidos."
            })
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            // "NODE_ENV" é uma variável padrão do node, ela é alterada automaticamente quando vai para produção (production)
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos ( dia * hora * minuto * segundo * milissegundo)
        })

        return res.status(200).json({
            successMessage: "Login realizado com sucesso.",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatarURL: user.avatarURL,
                biography: user.biography,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
        });
    };
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token")

        return res.status(200).json({
            successMessage: "Logout realizado com sucesso."
        })
    } catch (error) {
        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde."
        })
    }
}

const updateMe = async (req, res) => {
    try {
        const { username, displayName, biography } = req.body

        if (!username && !displayName && !biography && biography !== null) {
            return res.status(400).json({
                errorMessage: "Informe pelo menos um campo para atualizar.",
            })
        }

        let isDisplayNameValid = true

        if (displayName) {
            isDisplayNameValid =
                displayName.length >= 3 &&
                displayName.length <= 35
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/

        let isUsernameValid = true

        if (username) {
            isUsernameValid =
                usernameRegex.test(username) &&
                username.length >= 3 &&
                username.length <= 20
        }

        let isBiographyValid = true

        if (biography) {
            isBiographyValid = biography.length <= 160
        }

        if (!isDisplayNameValid || !isUsernameValid || !isBiographyValid) {
            return res.status(400).json({
                errorMessage: "Os dados informados são inválidos."
            })
        }

        if (username) {
            const existingUsername = await prisma.user.findUnique({ where: { username } })
            if (existingUsername) {
                return res.status(409).json({
                    errorMessage: "Este nome de usuário já está sendo usado.",
                })
            }
        }

        const data = {}

        if (username) data.username = username
        if (displayName) data.displayName = displayName
        if (biography || biography === null) data.biography = biography

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data,
            select: {
                username: true,
                displayName: true,
                email: true,
                avatarURL: true,
                biography: true,
            }
        });

        return res.status(200).json({
            user: updatedUser,
            successMessage: "Usuário atualizado com sucesso."
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
                });
            }

            if (error.code === "P2023") {
                return res.status(400).json({
                    errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
                })
            }

            if (error.code === "P2002") {
                return res.status(409).json({
                    errorMessage: "Email ou nome de usuário já estão cadastrados.",
                })
            }
        }

        return res.status(500).json({
            errorMessage: "Ocorreu um erro. Tente novamente mais tarde.",
            error: error.message
        })
    }
};

const deleteMe = async (req, res) => {
    try {
        // Deleta todos os posts do usuário
        await prisma.post.deleteMany({ where: { authorId: req.userId } })

        // Deleta o usuário
        await prisma.user.delete({ where: { id: req.userId } });

        return res.status(200).json({
            successMessage: "Usuário deletado com sucesso."
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({
                    errorMessage: "Usuário não encontrado.",
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
        });
    }
};

export {
    register,
    verifyEmail,
    login,
    logout,
    updateMe,
    deleteMe,
    getMe
}