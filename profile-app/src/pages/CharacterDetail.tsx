import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Character } from '../types/character'

export function CharacterDetail() {
  // On récupère l'id présent dans l'URL (ex: /character/2 => id vaut "2")
  const { id } = useParams<{ id: string }>()
  
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://rickandmortyapi.com/api'

    fetch(`${baseUrl}/character/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Personnage introuvable')
        return res.json()
      })
      .then((data: Character) => {
        setCharacter(data)
        setError(null)
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <p className="text-white text-center mt-10">Chargement des détails...</p>
  }

  if (error || !character) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-red-500 mb-4">{error || 'Personnage non trouvé'}</p>
        <Link to="/" className="underline text-blue-400">← Retour à la liste</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center">
      <Link to="/" className="self-start mb-6 text-blue-400 hover:underline">
        ← Retour à la liste
      </Link>

      <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700 max-w-md w-full text-center shadow-lg">
        <img
          src={character.image}
          alt={character.name}
          className="w-48 h-48 rounded-full mx-auto mb-6 border-4 border-green-500 shadow"
        />
        <h1 className="text-3xl font-bold mb-4">{character.name}</h1>

        <div className="text-left bg-zinc-900 p-4 rounded-lg space-y-2 text-zinc-300">
          <p><strong className="text-white">Statut :</strong> {character.status}</p>
          <p><strong className="text-white">Espèce :</strong> {character.species}</p>
          <p><strong className="text-white">Genre :</strong> {character.gender}</p>
          <p><strong className="text-white">Origine :</strong> {character.origin.name}</p>
          <p><strong className="text-white">Localisation :</strong> {character.location.name}</p>
        </div>
      </div>
    </div>
  )
}
