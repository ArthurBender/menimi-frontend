import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import "react-toastify/dist/ReactToastify.css";
import App from './App.tsx'
import { TasksProvider } from './api/TasksContext.tsx'
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
