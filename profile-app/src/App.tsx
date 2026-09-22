import { useEffect, useState } from 'react'
import Character from './pages/Character'
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
  return [...new Set(characters.map(getValue))].sort()
}

function App() {
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CharacterFilters>(emptyFilters)

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filters.gender || character.gender === filters.gender) &&
    (!filters.species || character.species === filters.species) &&
    (!filters.origin || character.origin.name === filters.origin) &&
    (!filters.location || character.location.name === filters.location) &&
    (!filters.status || character.status === filters.status),
  )

  function updateFilter(filter: keyof CharacterFilters, value: string) {
    setFilters((currentFilters) => ({ ...currentFilters, [filter]: value }))
  }

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data: { results: CharacterData[] }) => setCharacters(data.results))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const characterId = Number(currentPath.split('/')[2])
    const character = characters.find(({ id }) => id === characterId)

    setSelectedCharacter(currentPath.startsWith('/character/') ? character ?? null : null)
  }, [characters, currentPath])

  function loadCharacterDetails(characterId: number) {
    const character = characters.find(({ id }) => id === characterId)
    window.history.pushState({}, '', `/character/${characterId}`)
    setCurrentPath(`/character/${characterId}`)
    setSelectedCharacter(character ?? null)
  }

  function goBackToCharacters() {
    window.history.pushState({}, '', '/')
    setCurrentPath('/')
    setSelectedCharacter(null)
  }

  if (selectedCharacter) {
    return <Character character={selectedCharacter} onBack={goBackToCharacters} />
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <header className="main-header">
          <h2><img className="site-logo" src={logo} alt="Rick and Morty" /></h2>
        </header>
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

        {!loading && (
          <section className="filters-panel" aria-label="Filtres des personnages">
            <div className="filter-fields">
              <label>Genre<select value={filters.gender} onChange={(event) => updateFilter('gender', event.target.value)}>
                <option value="">Tous les genres</option>
                {uniqueValues(characters, (character) => character.gender).map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Espèce<select value={filters.species} onChange={(event) => updateFilter('species', event.target.value)}>
                <option value="">Toutes les espèces</option>
                {uniqueValues(characters, (character) => character.species).map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Origine<select value={filters.origin} onChange={(event) => updateFilter('origin', event.target.value)}>
                <option value="">Toutes les origines</option>
                {uniqueValues(characters, (character) => character.origin.name).map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>Localisation<select value={filters.location} onChange={(event) => updateFilter('location', event.target.value)}>
                <option value="">Toutes les localisations</option>
                {uniqueValues(characters, (character) => character.location.name).map((value) => <option key={value}>{value}</option>)}
              </select></label>
              <label>État de santé<select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
                <option value="">Tous les états</option>
                {uniqueValues(characters, (character) => character.status).map((value) => <option key={value}>{value}</option>)}
              </select></label>
            </div>
            <button className="reset-filters" onClick={() => setFilters(emptyFilters)} type="button">Réinitialiser</button>
          </section>
        )}

        {loading && <p>Chargement...</p>}

        {!loading && (
          <main className="character-grid" aria-label="Personnages">
            {filteredCharacters.map((character) => (
              <button
                className="character-card"
                key={character.id}
                onClick={() => loadCharacterDetails(character.id)}
                type="button"
              >
                <img src={character.image} alt={character.name} />
                <span>{character.name}</span>
              </button>
            ))}
            {filteredCharacters.length === 0 && <p className="no-results">Aucun personnage trouvé.</p>}
          </main>
        )}

    </div>
  );
}

export default App
