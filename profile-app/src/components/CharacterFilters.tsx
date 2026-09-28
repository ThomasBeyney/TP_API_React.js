import type { CharacterData } from '../types/character'

export type CharacterFilters = {
  gender: string
  species: string
  origin: string
  location: string
  status: string
}

function uniqueValues(characters: CharacterData[], getValue: (character: CharacterData) => string) {
  return [...new Set(characters.map(getValue).filter(Boolean))].sort()
}

function CharacterFiltersPanel({
  characters,
  filters,
  onChange,
  onReset,
}: {
  characters: CharacterData[]
  filters: CharacterFilters
  onChange: (filter: keyof CharacterFilters, value: string) => void
  onReset: () => void
}) {
  return <section className="filters-panel" aria-label="Filtres des personnages">
    <div className="filter-fields">
      <label>Genre<select value={filters.gender} onChange={(event) => onChange('gender', event.target.value)}>
        <option value="">Tous les genres</option>
        {uniqueValues(characters, (character) => character.gender ?? '').map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>Espèce<select value={filters.species} onChange={(event) => onChange('species', event.target.value)}>
        <option value="">Toutes les espèces</option>
        {uniqueValues(characters, (character) => character.species ?? '').map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>Origine<select value={filters.origin} onChange={(event) => onChange('origin', event.target.value)}>
        <option value="">Toutes les origines</option>
        {uniqueValues(characters, (character) => character.origin?.name ?? '').map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>Localisation<select value={filters.location} onChange={(event) => onChange('location', event.target.value)}>
        <option value="">Toutes les localisations</option>
        {uniqueValues(characters, (character) => character.location?.name ?? '').map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>État de santé<select value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
        <option value="">Tous les états</option>
        {uniqueValues(characters, (character) => character.status ?? '').map((value) => <option key={value}>{value}</option>)}
      </select></label>
    </div>
    <button className="reset-filters" onClick={onReset} type="button">Réinitialiser</button>
  </section>
}

export default CharacterFiltersPanel