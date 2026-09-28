import { useState } from 'react'
import CharacterFiltersPanel, { type CharacterFilters } from '../components/CharacterFilters'
import CharacterGrid from '../components/CharacterGrid'
import { useCharacters } from '../hooks/useCharacters'

const emptyFilters: CharacterFilters = {
  gender: '',
  species: '',
  origin: '',
  location: '',
  status: '',
}

function HomePage() {
  const [page, setPage] = useState(1)
  const { characters, pages, hasNextPage, loading, error } = useCharacters(page)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CharacterFilters>(emptyFilters)

  const filteredCharacters = characters.filter((character) =>
    (character.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filters.gender || character.gender === filters.gender) &&
    (!filters.species || character.species === filters.species) &&
    (!filters.origin || character.origin?.name === filters.origin) &&
    (!filters.location || character.location?.name === filters.location) &&
    (!filters.status || character.status === filters.status),
  )

  function updateFilter(filter: keyof CharacterFilters, value: string) {
    setFilters((currentFilters) => ({ ...currentFilters, [filter]: value }))
  }

  return <main className="app-content">
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

    {!loading && !error && <CharacterFiltersPanel
      characters={characters}
      filters={filters}
      onChange={updateFilter}
      onReset={() => setFilters(emptyFilters)}
    />}

    {loading && <p className="message">Chargement...</p>}
    {error && <p className="message error" role="alert">{error}</p>}
    {!loading && !error && <CharacterGrid characters={filteredCharacters} />}
    {!loading && !error && pages !== null && <nav className="pagination" aria-label="Pagination des personnages">
      <button disabled={page <= 1} onClick={() => setPage((currentPage) => currentPage - 1)} type="button">Précédent</button>
      <span>Page {page} / {pages}</span>
      <button disabled={!hasNextPage} onClick={() => setPage((currentPage) => currentPage + 1)} type="button">Suivant</button>
    </nav>}
  </main>
}

export default HomePage