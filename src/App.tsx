
import { Navigate, Route, Routes } from 'react-router-dom'
import LoggedLayout from './components/LoggedLayout'
import CalendarPage from './pages/CalendarPage'
import EditTask from './pages/EditTask'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import NewTask from './pages/NewTask'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import { useAuth } from './api/useAuth'

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<LoggedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewTask />} />
            <Route path="/tasks/:taskId/edit" element={<EditTask />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}

export default App
