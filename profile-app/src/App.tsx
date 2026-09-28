import type { ReactNode } from 'react'
import { FavoritesProvider } from './context/FavoritesContext'
import NavigationProvider from './routing/Navigation'
import { useNavigation } from './routing/NavigationContext'
import SiteHeader from './components/SiteHeader'
import AboutPage from './pages/AboutPage'
import CharacterPage from './pages/CharacterPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return <FavoritesProvider><NavigationProvider><AppRoutes /></NavigationProvider></FavoritesProvider>
}

function AppRoutes() {
  const { currentPath } = useNavigation()
  const characterMatch = currentPath.match(/^\/character\/(\d+)\/?$/)
  let page: ReactNode

  if (currentPath === '/') page = <HomePage />
  else if (currentPath === '/favorites') page = <FavoritesPage />
  else if (currentPath === '/about') page = <AboutPage />
  else if (characterMatch) page = <CharacterPage id={Number(characterMatch[1])} />
  else page = <NotFoundPage />

  return <>
    <SiteHeader currentPath={currentPath} />
    {page}
  </>
}

export default App
