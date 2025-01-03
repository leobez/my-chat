import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// STATES
import { SocketContextProvider } from './context/SocketContext.tsx'
import { Provider } from 'react-redux'
import store from './store.ts'
import { ChatContextProvider } from './context/ChatContext.tsx'
import { SnackbarContextProvider } from './context/SnackbarContext.tsx'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <SocketContextProvider>
        <ChatContextProvider>
          <SnackbarContextProvider>
            <App />
          </SnackbarContextProvider>
        </ChatContextProvider>
      </SocketContextProvider>
    </Provider>
)
