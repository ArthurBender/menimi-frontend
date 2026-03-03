import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TasksProvider } from './api/TasksContext.tsx'
import { AlertProvider } from './components/AlertProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <TasksProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TasksProvider>
    </AlertProvider>
  </StrictMode>,
)
