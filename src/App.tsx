
import { Navigate, Route, Routes } from 'react-router-dom'
import Calendar from './pages/Calendar'
import Home from './pages/Home'
import NewTask from './pages/NewTask'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<NewTask />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
