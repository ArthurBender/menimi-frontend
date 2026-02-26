
import { Navigate, Route, Routes } from 'react-router-dom'
import LoggedLayout from './components/LoggedLayout'
import CalendarPage from './pages/CalendarPage'
import Home from './pages/Home'
import NewTask from './pages/NewTask'



const App = () => {
  return (
    <Routes>
      <Route element={<LoggedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewTask />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
