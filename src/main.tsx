import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import "react-toastify/dist/ReactToastify.css";
import App from './App.tsx'
import { AuthProvider } from './api/AuthContext.tsx'
import { TasksProvider } from './api/TasksContext.tsx'
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TasksProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          newestOnTop
        />
      </TasksProvider>
    </AuthProvider>
  </StrictMode>,
)
