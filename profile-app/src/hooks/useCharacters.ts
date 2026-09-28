import { useEffect, useState } from 'react'
import type { CharacterData, CharacterResponse } from '../types/character'

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL
    const controller = new AbortController()

    if (!apiUrl) {
      setError('Configure VITE_API_URL dans le fichier .env.local.')
      setLoading(false)
      return () => controller.abort()
    }

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<CharacterResponse>
      })
      .then((data) => {
        if (!Array.isArray(data.results)) throw new Error('La réponse API est invalide.')
        setCharacters(data.results)
      })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name !== 'AbortError') setError(reason.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { characters, loading, error }
}