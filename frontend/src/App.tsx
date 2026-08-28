import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Investigation } from './pages/Investigation'
import { LandingPage } from './pages/LandingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/investigation/:id" element={<Investigation />} />
    </Routes>
  )
}
