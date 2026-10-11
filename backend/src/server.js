import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import { authMiddleware } from './middlewares/authMiddleware.js';
import { registerLimiter, loginLimiter, postLimiter } from './middlewares/rateLimitMiddleware.js';

import { 
    getMe, 
    register, 
    verifyEmail,
    login, 
    logout, 
    updateMe, 
    deleteMe, 
} from './controllers/usersController.js';

import { 
    getAllPosts, 
    getPostById, 
    getAllPostsByAuthor, 
    createPost, 
    updatePost, 
    deletePost 
} from './controllers/postsController.js';

// Cria a API
const app = express();

// É possível acessar o req.body com essa linha, pois ele transforma os dados em JSON
app.use(express.json());

// Permite que o express leia os cookies
app.use(cookieParser())

// Permite que o site acesse a API e receba os valores das credenciais (serve para os cookies)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Porta da API
const PORT = process.env.PORT;

// Rotas do users
app.post('/auth/register', registerLimiter, register);
app.post('/auth/verify-email', verifyEmail)
app.post('/auth/login', loginLimiter, login);
app.post('/auth/logout', logout)

app.get('/users/me', authMiddleware, getMe)
app.put('/users/me', authMiddleware, updateMe);
app.delete('/users/me', authMiddleware, deleteMe);

// Rotas dos posts
app.get('/posts', getAllPosts);
app.get('/posts/:id', getPostById);
app.get('/posts/user/:id', getAllPostsByAuthor)

app.post('/posts', authMiddleware, postLimiter, createPost);
app.put('/posts/:id', authMiddleware, updatePost);
app.delete('/posts/:id', authMiddleware, deletePost);

// Inicia a API
app.listen(PORT, "0.0.0.0", () => 
    console.log(`O servidor está rodando na porta: ${PORT}`)
);