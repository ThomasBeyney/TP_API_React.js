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

const charactersPerPage = 20

function HomePage() {
  const [page, setPage] = useState(1)
  const { characters, loading, error } = useCharacters()
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
  const pages = Math.max(1, Math.ceil(filteredCharacters.length / charactersPerPage))
  const pageCharacters = filteredCharacters.slice((page - 1) * charactersPerPage, page * charactersPerPage)

  function updateFilter(filter: keyof CharacterFilters, value: string) {
    setFilters((currentFilters) => ({ ...currentFilters, [filter]: value }))
    setPage(1)
  }

  return <main className="app-content">
    <header className="second-header">
      <p>Voici une liste de personnages de Rick and Morty</p>
      <div className="search-group">
        <label className="search-label" htmlFor="character-search">Rechercher un personnage</label>
        <input
          className="search-input"
          id="character-search"
          onChange={(event) => {
            setSearchTerm(event.target.value)
            setPage(1)
          }}
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
      onReset={() => {
        setFilters(emptyFilters)
        setPage(1)
      }}
    />}

    {loading && <p className="message">Chargement...</p>}
    {error && <p className="message error" role="alert">{error}</p>}
    {!loading && !error && <CharacterGrid characters={pageCharacters} />}
    {!loading && !error && filteredCharacters.length > 0 && <nav className="pagination" aria-label="Pagination des personnages">
      <button disabled={page <= 1} onClick={() => setPage((currentPage) => currentPage - 1)} type="button">Précédent</button>
      <span>Page {page} / {pages}</span>
      <button disabled={page >= pages} onClick={() => setPage((currentPage) => currentPage + 1)} type="button">Suivant</button>
    </nav>}
  </main>
}

export default HomePage