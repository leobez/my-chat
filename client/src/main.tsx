import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// STATES
import { SocketContextProvider } from './context/SocketContext.tsx'
import { Provider } from 'react-redux'
import store from './store.ts'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </Provider>
)
