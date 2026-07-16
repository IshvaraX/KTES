import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import NewPermitPage from './pages/NewPermitPage'
import PermitViewPage from './pages/PermitViewPage'

export default function App() {
  return (
    <div className="min-h-full topo-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-permit" element={<NewPermitPage />} />
        <Route path="/permit/:id" element={<PermitViewPage />} />
      </Routes>
    </div>
  )
}
