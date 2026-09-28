import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import Character from './pages/Character'
import { useCharacters } from './hooks/useCharacters'
import { FavoritesProvider, useFavorites } from './context/FavoritesContext'
import type { CharacterData } from './types/character'
import logo from './assets/Rick_and_Morty_logo.png'

type CharacterFilters = {
  gender: string
  species: string
  origin: string
  location: string
  status: string
}

const emptyFilters: CharacterFilters = {
  gender: '',
  species: '',
  origin: '',
  location: '',
  status: '',
}

function uniqueValues(characters: CharacterData[], getValue: (character: CharacterData) => string) {
  return [...new Set(characters.map(getValue).filter(Boolean))].sort()
}

function App() {
  return <FavoritesProvider><AppRoutes /></FavoritesProvider>
}

const NavigationContext = createContext<(path: string) => void>(() => undefined)

function Link({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  const navigate = useContext(NavigationContext)

  return <a className={className} href={to} onClick={(event) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault()
      navigate(to)
    }
  }}>{children}</a>
}

function NavLink({ to, children, end = false }: { to: string; children: ReactNode; end?: boolean }) {
  const active = end ? window.location.pathname === to : window.location.pathname.startsWith(to)
  return <Link className={active ? 'nav-link active' : 'nav-link'} to={to}>{children}</Link>
}

function AppRoutes() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  function navigate(path: string) {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const characterMatch = currentPath.match(/^\/character\/(\d+)\/?$/)
  let page: ReactNode

  if (currentPath === '/') page = <HomePage />
  else if (currentPath === '/favorites') page = <FavoritesPage />
  else if (currentPath === '/about') page = <AboutPage />
  else if (characterMatch) page = <CharacterPage id={Number(characterMatch[1])} />
  else page = <NotFoundPage />

  return <NavigationContext.Provider value={navigate}>
    <header className="main-header">
      <Link to="/"><img className="site-logo" src={logo} alt="Rick and Morty" /></Link>
      <nav className="main-nav" aria-label="Navigation principale">
        <NavLink to="/" end>Personnages</NavLink>
        <NavLink to="/favorites">Favoris</NavLink>
        <NavLink to="/about">À propos</NavLink>
      </nav>
    </header>
    {page}
  </NavigationContext.Provider>
}

function HomePage() {
  const { characters, loading, error } = useCharacters()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CharacterFilters>(emptyFilters)
  const { favorites, toggleFavorite } = useFavorites()

  const filteredCharacters = useMemo(() => characters.filter((character) =>
    (character.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filters.gender || character.gender === filters.gender) &&
    (!filters.species || character.species === filters.species) &&
    (!filters.origin || character.origin?.name === filters.origin) &&
    (!filters.location || character.location?.name === filters.location) &&
    (!filters.status || character.status === filters.status),
  ), [characters, filters, searchTerm])

  function updateFilter(filter: keyof CharacterFilters, value: string) {
    setFilters((currentFilters) => ({ ...currentFilters, [filter]: value }))
  }

  return (
    <main className="app-content">
      <header className="second-header">
        <p>Voici une liste de personnages de Rick and Morty</p>
          <div className="search-group">
            <label className="search-label" htmlFor="character-search">Rechercher un personnage</label>
            <input
              className="search-input"
              id="character-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ex : Rick, Morty..."
              type="search"
              value={searchTerm}
            />
          </div>
      </header>

      {!loading && !error && (
        <section className="filters-panel" aria-label="Filtres des personnages">
            <div className="filter-fields">
              <label>Genre<select value={filters.gender} onChange={(event) => updateFilter('gender', event.target.value)}>
                <option value="">Tous les genres</option>
                {uniqueValues(characters, (character) => character.gender ?? '').map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Espèce<select value={filters.species} onChange={(event) => updateFilter('species', event.target.value)}>
                <option value="">Toutes les espèces</option>
                {uniqueValues(characters, (character) => character.species ?? '').map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Origine<select value={filters.origin} onChange={(event) => updateFilter('origin', event.target.value)}>
                <option value="">Toutes les origines</option>
                {uniqueValues(characters, (character) => character.origin?.name ?? '').map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Localisation<select value={filters.location} onChange={(event) => updateFilter('location', event.target.value)}>
                <option value="">Toutes les localisations</option>
                {uniqueValues(characters, (character) => character.location?.name ?? '').map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>État de santé<select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
                <option value="">Tous les états</option>
                {uniqueValues(characters, (character) => character.status ?? '').map((value) => <option key={value}>{value}</option>)}
              </select></label>
            </div>
            <button className="reset-filters" onClick={() => setFilters(emptyFilters)} type="button">Réinitialiser</button>
        </section>
      )}

      {loading && <p className="message">Chargement...</p>}
      {error && <p className="message error" role="alert">{error}</p>}

      {!loading && !error && (
        <section className="character-grid" aria-label="Personnages">
            {filteredCharacters.map((character) => (
              <article className="character-card" key={character.id}>
                <Link to={`/character/${character.id}`}>
                  {character.image && <img src={character.image} alt={character.name ?? 'Personnage'} />}
                  <span>{character.name ?? 'Sans nom'}</span>
                </Link>
                <button className="favorite-button" onClick={() => toggleFavorite(character.id)} type="button">
                  {favorites.includes(character.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
              </article>
            ))}
            {filteredCharacters.length === 0 && <p className="no-results">Aucun personnage trouvé.</p>}
        </section>
      )}
    </main>
  );
}

function CharacterPage({ id }: { id: number }) {
  const { characters, loading, error } = useCharacters()
  const { favorites, toggleFavorite } = useFavorites()
  const character = characters.find((item) => item.id === id)

  if (loading) return <p className="message">Chargement...</p>
  if (error) return <p className="message error" role="alert">{error}</p>
  if (!character) return <p className="message">Personnage introuvable.</p>

  return <Character character={character} isFavorite={favorites.includes(id)} onToggleFavorite={() => toggleFavorite(id)} />
}

function FavoritesPage() {
  const { characters, loading, error } = useCharacters()
  const { favorites, toggleFavorite } = useFavorites()

  if (loading) return <p className="message">Chargement...</p>
  if (error) return <p className="message error" role="alert">{error}</p>
  const savedCharacters = characters.filter((character) => favorites.includes(character.id))

  return <main className="app-content"><h1>Mes favoris</h1>
    {savedCharacters.length === 0 ? <p>Aucun favori pour le moment.</p> : <section className="character-grid">
      {savedCharacters.map((character) => <article className="character-card" key={character.id}>
        <Link to={`/character/${character.id}`}><img src={character.image ?? ''} alt={character.name ?? 'Personnage'} /><span>{character.name ?? 'Sans nom'}</span></Link>
        <button className="favorite-button" onClick={() => toggleFavorite(character.id)} type="button">Retirer des favoris</button>
      </article>)}
    </section>}
  </main>
}

function AboutPage() {
  return <main className="app-content">
    <h1>À propos</h1>
      <p>Explore les personnages de la série et garde tes favoris sous la main.</p> 
        <p>Créé par Thomas et Esteban</p> 
    </main>
}

function NotFoundPage() {
  return <main className="app-content"><h1>Page introuvable</h1><p>Cette page n’existe pas.</p><Link to="/">Retour aux personnages</Link></main>
}

export default App
