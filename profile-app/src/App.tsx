import { Routes, Route } from 'react-router-dom'
import { CharacterList } from './pages/CharacterList'
import { CharacterDetail } from './pages/CharacterDetail'

export default function App() {
  return (
    <Routes>
      {/* Route de la liste */}
      <Route path="/" element={<CharacterList />} />
      
      {/* Route dynamique pour le détail */}
      <Route path="/character/:id" element={<CharacterDetail />} />

      {/* Page 404 obligée par l'exigence n°3 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p>Page introuvable</p>
          </div>
        }
      />
    </Routes>
  )
}
