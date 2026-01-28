
import { Navigate, Route, Routes } from 'react-router-dom'
import LoggedLayout from './components/LoggedLayout'
import Calendar from './pages/Calendar'
import Home from './pages/Home'
import NewTask from './pages/NewTask'



const App = () => {
  return (
    <Routes>
      <Route element={<LoggedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewTask />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
