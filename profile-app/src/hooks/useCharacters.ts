import { useEffect, useState } from 'react'
import type { CharacterData, CharacterResponse } from '../types/character'

type PageResult = {
  key: string
  characters: CharacterData[]
  error: string | null
}

let cachedCharacters: CharacterData[] | null = null
let charactersRequest: Promise<CharacterData[]> | null = null

function getAllCharacters(apiUrl: string) {
  if (cachedCharacters) return Promise.resolve(cachedCharacters)
  if (charactersRequest) return charactersRequest

  charactersRequest = (async () => {
    const allCharacters: CharacterData[] = []
    let nextUrl: string | null = apiUrl

    while (nextUrl) {
      const response = await fetch(nextUrl)
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)

      const data = await response.json() as CharacterResponse
      if (!Array.isArray(data.results)) throw new Error('La réponse API est invalide.')

      allCharacters.push(...data.results)
      nextUrl = data.info?.next ?? null
    }

    return allCharacters
  })()
    .then((characters) => {
      cachedCharacters = characters
      return characters
    })
    .catch((reason: unknown) => {
      charactersRequest = null
      throw reason
    })

  return charactersRequest
}

export function useCharacters() {
  const apiUrl = import.meta.env.VITE_API_URL
  const requestKey = apiUrl ?? ''
  const [result, setResult] = useState<PageResult | null>(null)

  useEffect(() => {
    if (!apiUrl) return

    let active = true

    getAllCharacters(apiUrl)
      .then((characters) => {
        if (active) setResult({ key: requestKey, characters, error: null })
      })
      .catch((reason: unknown) => {
        if (active) {
          setResult({
            key: requestKey,
            characters: [],
            error: reason instanceof Error ? reason.message : 'Erreur réseau inconnue.',
          })
        }
      })

    return () => { active = false }
  }, [apiUrl, requestKey])

  const currentResult = result?.key === requestKey ? result : null

  return {
    characters: currentResult?.characters ?? [],
    loading: Boolean(apiUrl) && !currentResult,
    error: apiUrl ? currentResult?.error ?? null : 'Configure VITE_API_URL dans les variables d’environnement.',
  }
}