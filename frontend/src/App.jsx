// Estilos
import './App.css'

// React
import { useEffect } from 'react'

// Components
import Toast from './components/ui/Toast'

// React Router
import { Outlet } from 'react-router-dom'

// Hooks
import { useSocialMediaContext } from './hooks/useSocialMediaContext'

function App() {
  const { context, commonDispatch } = useSocialMediaContext()

  if (context.isGlobalLoading) {
    return <p>Carregando...</p>;
  }

  useEffect(() => {
    if (context.messageToUser || context.error) {
      setTimeout(() => {
        commonDispatch('REMOVE_MESSAGE_TO_USER')
      }, 4000);
    }
  }, [context.messageToUser, context.error])

  return (
    <div className='app'>
      {context.messageToUser && <Toast message={context.messageToUser} backgroundColor={"#03c903"} />}
      {context.error && <Toast message={context.error} backgroundColor={"#f91818"} />}
      <Outlet />
    </div>
  )
}

export default App
