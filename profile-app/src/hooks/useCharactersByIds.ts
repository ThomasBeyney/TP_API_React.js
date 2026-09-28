import { useEffect, useState } from 'react'
import type { CharacterData } from '../types/character'

type CharactersResult = {
  key: string
  characters: CharacterData[]
  error: string | null
}

export function useCharactersByIds(ids: number[]) {
  const apiUrl = import.meta.env.VITE_API_URL
  const idsKey = ids.join(',')
  const requestKey = `${apiUrl ?? ''}|${idsKey}`
  const [result, setResult] = useState<CharactersResult | null>(null)

  useEffect(() => {
    if (!apiUrl || !idsKey) return

    const controller = new AbortController()
    const url = new URL(apiUrl)
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/${idsKey}`
    url.search = ''

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)

        const data: unknown = await response.json()
        const characters = Array.isArray(data) ? data as CharacterData[] : [data as CharacterData]
        if (!characters.every((character) => typeof character?.id === 'number')) {
          throw new Error('La réponse API est invalide.')
        }

        setResult({ key: requestKey, characters, error: null })
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            characters: [],
            error: reason instanceof Error ? reason.message : 'Erreur réseau inconnue.',
          })
        }
      })

    return () => controller.abort()
  }, [apiUrl, idsKey, requestKey])

  const currentResult = result?.key === requestKey ? result : null

  return {
    characters: currentResult?.characters ?? [],
    loading: Boolean(apiUrl && idsKey) && !currentResult,
    error: !apiUrl
      ? 'Configure VITE_API_URL dans les variables d’environnement.'
      : currentResult?.error ?? null,
  }
}