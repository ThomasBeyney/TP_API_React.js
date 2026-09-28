import { useEffect, useState } from 'react'
import type { CharacterData, CharacterResponse } from '../types/character'

type PageResult = {
  key: string
  characters: CharacterData[]
  pages: number
  next: string | null
  error: string | null
}

export function useCharacters(page = 1) {
  const apiUrl = import.meta.env.VITE_API_URL
  const requestKey = `${apiUrl ?? ''}|${page}`
  const [result, setResult] = useState<PageResult | null>(null)

  useEffect(() => {
    if (!apiUrl) return

    const controller = new AbortController()
    const url = new URL(apiUrl)
    url.searchParams.set('page', String(page))

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        const data = await response.json() as CharacterResponse
        if (!Array.isArray(data.results)) throw new Error('La réponse API est invalide.')

        setResult({
          key: requestKey,
          characters: data.results,
          pages: data.info?.pages ?? 1,
          next: data.info?.next ?? null,
          error: null,
        })
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            characters: [],
            pages: 1,
            next: null,
            error: reason instanceof Error ? reason.message : 'Erreur réseau inconnue.',
          })
        }
      })

    return () => controller.abort()
  }, [apiUrl, page, requestKey])

  const currentResult = result?.key === requestKey ? result : null

  return {
    characters: currentResult?.characters ?? [],
    pages: currentResult?.pages ?? null,
    hasNextPage: Boolean(currentResult?.next),
    loading: Boolean(apiUrl) && !currentResult,
    error: apiUrl ? currentResult?.error ?? null : 'Configure VITE_API_URL dans les variables d’environnement.',
  }
}