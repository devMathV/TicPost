import rateLimit from "express-rate-limit"

const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        errorMessage: "Você atingiu o limite de tentativas. Tente novamente mais tarde."
    }
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        errorMessage: "Você atingiu o limite de tentativas. Tente novamente mais tarde."
    }
})

const postLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    keyGenerator: (req) => req.userId,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipFailedRequests: true,
    handler: (req, res) => {
        return res.status(429).json({
            errorMessage: "Você criou posts demais. Tente novamente mais tarde."
        })
    }
})

export {
    registerLimiter,
    loginLimiter,
    postLimiter
}