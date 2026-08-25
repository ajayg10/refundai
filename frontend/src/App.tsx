import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Investigation } from './pages/Investigation'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/investigation/:id" element={<Investigation />} />
    </Routes>
  )
}
