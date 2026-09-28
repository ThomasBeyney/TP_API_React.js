import { createContext } from 'react'

export type FavoritesValue = {
  favorites: number[]
  toggleFavorite: (id: number) => void
}

export const FavoritesContext = createContext<FavoritesValue | null>(null)