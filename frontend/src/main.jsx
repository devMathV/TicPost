// Configs Padrões
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Estilos
import './index.css'

// Componentes
import App from './App.jsx'
import Login from './components/auth/Login.jsx'
import SignUp from './components/auth/SignUp.jsx'
import VerifyEmail from './components/auth/VerifyEmail.jsx'

// Rotas
import Auth from './routes/Auth.jsx'
import MainLayout from './routes/MainLayout.jsx'

// Páginas
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

// React Router
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Context Provider
import { SocialMediaContextProvider } from './context/SocialMediaContext.jsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        {
          element: <Auth />,
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "signup",
              element: <SignUp />,
            },
            {
              path: "verify-email",
              element: <VerifyEmail />,
            },
          ],
        },
        {
          element: <MainLayout />,
          children: [
            {
              path: "home",
              element: <Home />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
          ],
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.PROD ? "/TicPost" : "/"
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocialMediaContextProvider>
      <RouterProvider router={router} />
    </SocialMediaContextProvider>
  </StrictMode>
)