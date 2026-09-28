import { createContext, useContext } from 'react'

type NavigationValue = {
  currentPath: string
  navigate: (path: string) => void
}

export const NavigationContext = createContext<NavigationValue | null>(null)

export function useNavigation() {
  const navigation = useContext(NavigationContext)
  if (!navigation) throw new Error('useNavigation doit être utilisé dans NavigationProvider.')
  return navigation
}