import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Character, ApiResponse } from '../types/character'

export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://rickandmortyapi.com/api'

    fetch(`${baseUrl}/character`)
      .then((res) => res.json())
      .then((data: ApiResponse) => setCharacters(data.results))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col items-center bg-zinc-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold my-4">Annuaire Rick & Morty</h1>

      {loading && <p>Chargement...</p>}

      <div className="flex flex-wrap gap-3 justify-center">
        {!loading &&
          characters.map((character) => (
            /* Redirection vers la page /character/id au clic */
            <Link
              key={character.id}
              to={`/character/${character.id}`}
              className="border border-zinc-700 rounded overflow-hidden hover:scale-105 hover:border-green-500 transition-all"
            >
              <img src={character.image} alt={character.name} width={100} />
            </Link>
          ))}
      </div>
    </div>
  )
}
